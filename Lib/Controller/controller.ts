import { ControllerI } from '../Controller';
import { Request } from 'express';
import { Endpoint } from '../Endpoint';
import { createHttpError } from './error';

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

export const createMiddleware = <T extends (req: Request) => void | Record<any, any>>(p: T) => p;
