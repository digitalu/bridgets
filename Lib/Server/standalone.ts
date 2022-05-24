import { IncomingMessage, ServerResponse } from 'http';
import formidable from 'formidable';
import { fetchSdkRoute } from './fetchSDK';
import { ErrorHandler } from '../Errors';
import { getJSONDataFromRequestStream, formidableAsyncParseFiles, getJSONQueryFromURL } from './HttpTransformers';
import { createRoutes, BridgeRoutes, Method } from '../Routes';

export const createHttpHandler = (routes: BridgeRoutes, onError?: ErrorHandler) => {
  let path: string;
  let queryString: string;

  const serverRoutes = createRoutes(routes);

  return async (req: IncomingMessage, res: ServerResponse) => {
    let body: Record<any, any> = {};
    let file: formidable.Files = {};

    const query = getJSONQueryFromURL(req.url || '');

    try {
      [path, queryString] = (req.url || '/').split('?');

      if (path === '/fetchBridgeSDK') return fetchSdkRoute(req, res);

      const route = serverRoutes[path];
      if (!route) return;

      if (route.filesConfig) file = await formidableAsyncParseFiles(req);
      else body = await getJSONDataFromRequestStream(req);

      const mid = {};

      const result = await route.endpoint.handle({
        body,
        file,
        query,
        headers: req.headers,
        method: (req.method as Method) || 'POST',
        mid,
      });

      if (result.error) {
        onError?.({ error: result.error, path: path });
        return res.writeHead(result.error.status || 500, { 'Content-Type': 'application/json' }).end(JSON.stringify(result));
      }

      return res
        .writeHead(200, {
          'Content-Type': typeof result === 'object' ? 'application/json' : 'text/plain',
        })
        .end(typeof result === 'object' ? JSON.stringify(result) : result);
    } catch (err) {
      onError?.({ error: { status: 500, name: 'Internal server error', data: err }, path: path });
      return res
        .writeHead(500, { 'Content-Type': 'application/json' })
        .end(JSON.stringify({ status: 500, name: 'Internal server error' }));
    }
  };
};