import { ZodSchema } from 'zod';
import { KeysWithValNotNever, MidsReturnsIntersection } from '../Utilities';
import { Method } from '../Routes';
import { FilesConfig, InferBridgeParser, BridgeParser } from '../Validators';
import { Endpoint } from '../Endpoint';
import formidable from 'formidable';
import { Request } from 'express';

export type Middleware = (p: Request) => Record<any, any> | void;

type FilesDoNotExists = ['BridgeFilesDoNotExists'];

export interface RouteParams<Body, Query, Mids, Handler, Method, Headers, Files> {
  body?: Method extends 'GET'
    ? never
    : Files extends FilesDoNotExists
    ? Body
    : never /** Can't have a body with GET method or with files */;
  query?: Query;
  headers?: Headers;
  files?: Files;
  method?: Method;
  middlewares?: Mids;
  description?: string;
  handler: Handler;
}

export interface ControllerI {
  createEndpoint: <
    Handler extends (
      p: {
        // MIDDLEWARES
        [key in KeysWithValNotNever<{ mid: MidsReturnsIntersection<Mids> }> &
          keyof { mid: MidsReturnsIntersection<Mids> }]: { mid: MidsReturnsIntersection<Mids> }[key];
      } & {
        // BODY & QUERY & HEADERS & FORMDATA (files)
        // It's hard coded (did not use ExcludeNeverKeys<T> type) to show via vscode a clean output type
        [key in KeysWithValNotNever<{
          body: InferBridgeParser<Body>;
          query: InferBridgeParser<Query>;
          headers: InferBridgeParser<Headers>;
          files: Files extends FilesDoNotExists
            ? never
            : Files extends 'any'
            ? { [key: string]: formidable.File }
            : { [key in Files[number]]: formidable.File };
        }> &
          keyof {
            body: InferBridgeParser<Body>;
            query: InferBridgeParser<Query>;
            headers: InferBridgeParser<Headers>;
            files: Files extends FilesDoNotExists
              ? never
              : Files extends 'any'
              ? { [key: string]: formidable.File }
              : { [key in Files[number]]: formidable.File };
          }]: {
          body: InferBridgeParser<Body>;
          query: InferBridgeParser<Query>;
          headers: InferBridgeParser<Headers>;
          files: Files extends FilesDoNotExists
            ? never
            : Files extends 'any'
            ? { [key: string]: formidable.File }
            : { [key in Files[number]]: formidable.File };
        }[key];
      }
    ) => Res,
    Res,
    Body extends BridgeParser<Record<any, any>> = never,
    Query extends BridgeParser<Record<string, any>> = never,
    Headers extends BridgeParser<Record<string, any>> = never,
    Files extends FilesConfig = FilesDoNotExists,
    Mids extends ReadonlyArray<Middleware> = never,
    Meth extends Method = 'POST'
  >(
    p: RouteParams<Body, Query, Mids, Handler, Meth, Headers, Files>
  ) => Endpoint<Handler, Mids>;
}
