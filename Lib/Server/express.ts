import { Request, Response, NextFunction } from 'express';
import { createRoutes, BridgeRoutes } from '../Routes';
import { ErrorHandler } from '../Errors/types';
import { validateFiles } from '../Validators';
import { getJSONDataFromRequestStream } from './bodyJSON';
import formidable from 'formidable';

export const createExpressMiddleware = (routes: BridgeRoutes, onError?: ErrorHandler) => {
  const serverRoutes = createRoutes(routes);

  return async (req: Request, res: Response, next: NextFunction) => {
    const route = serverRoutes[req.path];
    if (!route) return next();

    if (!route.filesConfig) req.body = await getJSONDataFromRequestStream(req);

    let validation: any = {};
    if (route.validator) validation = await route.validator.validate(req, {});

    if (validation.error) {
      onError?.({
        error: validation.error,
        path: req.path,
        req,
        headers: req.headers,
        body: req.body,
        query: req.query,
      } as any);
      return res.status(validation.error.status || 500).json({ error: validation.error });
    }

    let result: any;

    try {
      if (route.filesConfig) {
        const form = formidable({ multiples: true });

        form.parse(req, async (err, fields, files) => {
          if (err) return res.status(500).json(err);

          result = validateFiles(route.filesConfig || 'any', files);

          if (!result) result = await route.handler({ headers: req.headers, query: req.query, files, ...validation });

          if (result.error) {
            onError?.({
              error: result.error,
              path: req.path,
              req,
              mdlwData: validation,
              headers: req.headers,
              body: req.body,
              query: req.query,
            } as any);
            return res.status(result.error.status || 500).json({ error: result.error });
          }

          typeof result === 'object' ? res.json(result) : res.send(result);
        });
      } else {
        result = await route.handler({ headers: req.headers, body: req.body, query: req.query, ...validation });

        if (result.error) {
          onError?.({
            error: result.error,
            path: req.path,
            req,
            mdlwData: validation,
            headers: req.headers,
            body: req.body,
            query: req.query,
          } as any);
          return res.status(result.error.status || 500).json({ error: result.error });
        }

        typeof result === 'object' ? res.json(result) : res.send(result);
      }
    } catch (err) {
      onError?.({
        error: {
          status: 500,
          name: 'Internal server error',
          data: err,
        },
        path: req.path,
        req,
        mdlwData: validation,
        headers: req.headers,
        body: req.body,
        query: req.query,
      } as any);
      return res.status(500).json({ error: { status: 500, name: 'Internal server error' } });
    }
  };
};
