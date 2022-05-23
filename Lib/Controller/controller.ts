import { ControllerI } from '../Controller';
import { Handler } from '../Handler';
import { httpError } from '../Errors';

export const handler: ControllerI['handler'] = (routeParams) => {
  return new Handler({
    bodySchema: routeParams.body,
    querySchema: routeParams.query,
    headersSchema: routeParams.headers,
    filesConfig: routeParams.files,
    method: routeParams.method || 'POST',
    middlewares: routeParams.middlewares,
    description: routeParams.description,
    resolve: routeParams.resolve,
  });
};

export class Controller implements ControllerI {
  public isBridgeController = true;

  public handler: ControllerI['handler'] = (routeParams) => {
    return new Handler({
      bodySchema: routeParams.body,
      querySchema: routeParams.query,
      headersSchema: routeParams.headers,
      filesConfig: routeParams.files,
      method: routeParams.method || 'POST',
      middlewares: routeParams.middlewares,
      description: routeParams.description,
      resolve: routeParams.resolve,
    });
  };
  public httpError = httpError;
}
