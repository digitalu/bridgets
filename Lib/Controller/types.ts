import { ZodSchema } from 'zod';
import { UnionToIntersection, KeysWithValNotNever } from '../Utilities';
import { Method } from '../Routes';
import { FilesConfig } from '../Validators';
import { Endpoint } from '../Endpoint';
import formidable from 'formidable';
import { Request } from 'express';

export type Middleware = (p: Request) => Record<any, any>;
type MidNotExists = [(req: Request) => Record<string, { middlewareNotExists: true }>];

type BodyNotExists = { BridgeBodyDoesNotExists: 'true' };
type QueryNotExists = { BridgeQueryDoesNotExists: 'true' };
type HeadersNotExists = { BridgeHeadersDoesNotExists: 'true' };
type FilesDoNotExists = ['BridgeFilesDoNotExists'];

export interface RouteParams<Body, Query, Mids, Handler, Method, Headers, Files> {
  body?: Method extends 'GET'
    ? never
    : Files extends FilesDoNotExists
    ? ZodSchema<Body, any, any>
    : never /** Can't have a body with GET method or with files */;
  query?: ZodSchema<Query, any, any>;
  headers?: ZodSchema<Headers, any, any>;
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
        [key in KeysWithValNotNever<
          ReturnType<Mids[number]> extends Record<string, { middlewareNotExists: true }>
            ? { middleware: never }
            : UnionToIntersection<ReturnType<Mids[number]>>
        > &
          keyof (ReturnType<Mids[number]> extends Record<string, { middlewareNotExists: true }>
            ? { middleware: never }
            : UnionToIntersection<ReturnType<Mids[number]>>)]: (ReturnType<Mids[number]> extends Record<
          string,
          { middlewareNotExists: true }
        >
          ? { middleware: never }
          : UnionToIntersection<ReturnType<Mids[number]>>)[key];
      } & {
        // BODY & QUERY & FORMDATA
        [key in KeysWithValNotNever<{
          body: Body extends BodyNotExists ? never : Body;
          query: Query extends QueryNotExists ? never : Query;
          headers: Headers extends HeadersNotExists ? never : Headers;
          files: Files extends FilesDoNotExists
            ? never
            : Files extends 'any'
            ? { [key: string]: formidable.File }
            : { [key in Files[number]]: formidable.File };
        }> &
          keyof {
            body: Body extends BodyNotExists ? never : Body;
            query: Query extends QueryNotExists ? never : Query;
            headers: Headers extends HeadersNotExists ? never : Headers;
            files: Files extends FilesDoNotExists
              ? never
              : Files extends 'any'
              ? { [key: string]: formidable.File }
              : { [key in Files[number]]: formidable.File };
          }]: {
          body: Body extends BodyNotExists ? never : Body;
          query: Query extends QueryNotExists ? never : Query;
          headers: Headers extends HeadersNotExists ? never : Headers;
          files: Files extends FilesDoNotExists
            ? never
            : Files extends 'any'
            ? { [key: string]: formidable.File }
            : { [key in Files[number]]: formidable.File };
        }[key];
      }
    ) => Res,
    Res,
    Body extends Record<string, any> = BodyNotExists,
    Query extends Record<string, string> = QueryNotExists,
    Headers extends Record<string, string> = HeadersNotExists,
    Files extends FilesConfig = FilesDoNotExists,
    Mids extends Middleware[] = MidNotExists,
    Meth extends Method = 'POST'
  >(
    p: RouteParams<Body, Query, Mids, Handler, Meth, Headers, Files>
  ) => Endpoint<Handler>;
}

// export interface ControllerInterface {
//   createEndpoint: <
//     Handler extends (
//       p: ExcludeNeverKeys<

//         {
//           body: Body extends BodyNotExists ? never : Body;
//           query: Query extends QueryNotExists ? never : Query;
//         } & ExcludeNeverKeys<
//           ReturnType<Mids[number]> extends Record<string, { middlewareNotExists: true }>
//             ? { middleware: never }
//             : UnionToIntersection<ReturnType<Mids[number]>>
//         >
//       >
//     ) => Res,
//     Res,
//     Body extends Record<string, any> = BodyNotExists,
//     Query extends Record<string, string> = QueryNotExists,
//     Mids extends Middleware[] = MidNotExists,
//     Meth extends Method = 'POST'
//   >(
//     p: RouteParams<Body, Query, Mids, Handler, Meth>
//   ) => EndpointInterface<Handler>;
// }
