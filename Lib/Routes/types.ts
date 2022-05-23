import { ControllerI } from '../Controller/';
import { Handler } from '../Handler';
import { MidsErrorReturnsUnion } from '../Utilities';
import { Validator, FilesConfig } from '../Validators';

export type BridgeRoutes = { [key: string | number | symbol]: BridgeRoutes | ControllerI };

export interface ServerRoutes {
  [key: string]: {
    resolve: (p: any) => any;
    validator?: Validator;
    filesConfig?: FilesConfig;
  };
}

export type Method = 'POST' | 'PATCH' | 'GET' | 'DELETE' | 'PUT';

type ControllerSDK<T extends ControllerI> = {
  [key in keyof T]: T[key] extends Handler<infer ResolveFct, infer Middlewares>
    ? {
        body: Parameters<ResolveFct>[0]['body'];
        query: Parameters<ResolveFct>[0]['query'];
        headers: Parameters<ResolveFct>[0]['headers'];
        return:
          | ReturnType<ResolveFct>
          // | MidsErrorReturnsUnion<Middlewares>
          | (Parameters<ResolveFct>[0]['body'] extends Record<any, any>
              ? { error: { name: 'Body schema validation error'; status: 422; data: any } }
              : never)
          | (Parameters<ResolveFct>[0]['headers'] extends Record<any, any>
              ? { error: { name: 'Headers schema validation error'; status: 422; data: any } }
              : never)
          | (Parameters<ResolveFct>[0]['query'] extends Record<any, any>
              ? { error: { name: 'Query schema validation error'; status: 422; data: any } }
              : never);
      }
    : T[key] extends ControllerI
    ? ControllerSDK<T[key]>
    : never;
};

export type RoutesToSDK<T extends BridgeRoutes> = {
  [key in keyof T]: T[key] extends ControllerI
    ? ControllerSDK<T[key]>
    : T[key] extends BridgeRoutes
    ? RoutesToSDK<T[key]>
    : never;
};
