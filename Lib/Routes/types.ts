import { ControllerI } from '../Controller/';
import { Endpoint } from '../Endpoint';
import { MidsErrorReturnsIntersection } from '../Utilities';
import { Validator, FilesConfig } from '../Validators';

export type BridgeRoutes = { [key: string | number | symbol]: BridgeRoutes | ControllerI };

export interface ServerRoutes {
  [key: string]: {
    handler: (p: any) => Record<any, any> | Promise<Record<any, any>>;
    validator?: Validator;
    filesConfig?: FilesConfig;
  };
}

export type Method = 'POST' | 'PATCH' | 'GET' | 'DELETE' | 'PUT';

type ControllerSDK<T extends ControllerI> = {
  [key in keyof T]: T[key] extends Endpoint<infer SDKFct, infer Middlewares>
    ? {
        body: Parameters<SDKFct>[0]['body'];
        query: Parameters<SDKFct>[0]['query'];
        headers: Parameters<SDKFct>[0]['headers'];
        return: ReturnType<SDKFct> | MidsErrorReturnsIntersection<Middlewares>;
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

export type SDKRoutes = { [key: string]: SDKRoutes | { body: any; query: any; headers: any; return: any } };
