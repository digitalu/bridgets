import { Request, Response, NextFunction } from 'express';
import { createRoutes, BridgeRoutes } from '../Routes';
import { ErrorHandler } from '../Errors/types';
import { getJSONDataFromRequestStream } from './bodyJSON';
import { formidableAsyncParseFiles } from './formidableAsync';
import { compile } from '../Compiler';
import { fetchSdkRoute } from './fetchSDK';
var argv = require('minimist')(process.argv.slice(2));

export const createExpressMiddleware = (routes: BridgeRoutes, onError?: ErrorHandler) => {
  if (argv.c) compile(routes);

  const serverRoutes = createRoutes(routes);

  return async (req: Request, res: Response, next: NextFunction) => {
    let validation: any = {};

    try {
      if (req.path === '/fetchBridgeSDK') {
        fetchSdkRoute(req, res);
        return;
      }

      const route = serverRoutes[req.path];
      if (!route) return next();

      if (route.filesConfig) req.body = await formidableAsyncParseFiles(req);
      else req.body = await getJSONDataFromRequestStream(req);

      if (route.validator) validation = await route.validator.validate(req, {});

      if (validation.error) {
        onError?.({
          error: validation.error,
          path: req.path,
          req,
        } as any);
        return res.status(validation.error.status || 500).json({ error: validation.error });
      }

      // Return '' to transform void return into empty string
      const result =
        (await route.resolve({ headers: req.headers, body: req.body, files: req.body, query: req.query, ...validation })) ||
        '';

      if (result.error) {
        onError?.({ error: result.error, path: req.path, req, mdlwData: validation });
        return res.status(result.error.status || 500).json({ error: result.error });
      }

      typeof result === 'object' ? res.json(result) : res.send(result);
    } catch (err) {
      onError?.({
        error: { status: 500, name: 'Internal server error', data: err },
        path: req.path,
        req,
        mdlwData: validation,
      });
      return res.status(500).json({ error: { status: 500, name: 'Internal server error' } });
    }
  };
};
