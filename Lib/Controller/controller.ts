import { ControllerI } from '../Controller';
import { Endpoint } from '../Endpoint';
import { createHttpError } from '../Errors';

export const createEndpoint: ControllerI['createEndpoint'] = (routeParams) => {
  return new Endpoint({
    bodySchema: routeParams.body,
    querySchema: routeParams.query,
    headersSchema: routeParams.headers,
    filesConfig: routeParams.files,
    method: routeParams.method || 'POST',
    middlewares: routeParams.middlewares,
    description: routeParams.description,
    handler: routeParams.handler,
  });
};

export class Controller implements ControllerI {
  public isBridgeController = true;

  public createEndpoint: ControllerI['createEndpoint'] = (routeParams) => {
    return new Endpoint({
      bodySchema: routeParams.body,
      querySchema: routeParams.query,
      headersSchema: routeParams.headers,
      filesConfig: routeParams.files,
      method: routeParams.method || 'POST',
      middlewares: routeParams.middlewares,
      description: routeParams.description,
      handler: routeParams.handler,
    });
  };
  public createHttpError = createHttpError;
}
