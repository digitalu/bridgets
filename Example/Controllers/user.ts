import { Controller, createMiddleware, createHttpError, createEndpoint, Middleware } from '../../Lib';
import { Request } from 'express';
import { z } from 'zod';

export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
type UnionToOvlds<U> = UnionToIntersection<U extends any ? (f: U) => void : never>;

type PopUnion<U> = UnionToOvlds<U> extends (a: infer A) => void ? A : never;
type IsUnion<T> = [T] extends [UnionToIntersection<T>] ? false : true;
type UnionToArray<T, A extends unknown[] = []> = IsUnion<T> extends true
  ? UnionToArray<Exclude<T, PopUnion<T>>, [PopUnion<T>, ...A]>
  : [T, ...A];

type Apply = <B extends string | Middleware, T extends Array<B>>(
  ...args: T
) => B extends string ? UnionToArray<T[number]> : UnionToArray<T[number]>;

const apply: Apply = (...args) => args as any;

const rr = apply('j', 'hoy');

const auth = createMiddleware((req) => ({ YES: req.headers.trailer }));

const auth3 = (req: Request) => ({ YES: req.headers.trailer });

const auth2 = createMiddleware((req) => {
  if (req.headers.token) return createHttpError('Bad Request', 'AH', { dsdf: true });
  // const res = next();
  // return res;
  if (req.headers) return { user: { name: 'Nab', age: 78 } };
  else return { association: { admins: ['Nab'] } };
});

class Invoice extends Controller {
  kabium = new Test2();

  create = this.createEndpoint({
    method: 'PATCH',
    body: z.object({
      name: z.string(),
      test: z.number(),
      j: z.object({ k: z.number() }),
    }),
    handler: (p) => {
      return 'HEY' as const;
    },
  });
}

const create = createEndpoint({
  method: 'POST',
  files: apply('image'),
  headers: z.object({ token: z.string() }),
  // middlewares: [mid],
  handler: (p) => {
    if (p.headers.token !== 'raul_strip_teaseuse') return createHttpError('Unauthorized', 'Wrong token');

    // fs.writeFile('./public/' + p.files.pp.originalFilename, fs.readFileSync(p.files.pp.filepath), () => console.error);
    return p.headers.token;
  },
});

export class User extends Controller {
  invoice = new Invoice();

  create = create;

  update = this.createEndpoint({
    method: 'PATCH',
    description: 'Yo salut tu vas bien ?',
    // body: z.object({ name: z.string() }),
    middlewares: apply(auth),
    handler: (p) => {
      if (p) console.log();

      const d = this.create.handler;
      throw new Error('Yo tu vas bien?');
      return { d: 7 / 0 };
    },
  });
}

export class Test extends Controller {
  test = new Invoice();

  k = 'SALUT';

  hhh = new User();
}

export class Test2 extends Controller {
  update = this.createEndpoint({
    method: 'PATCH',
    description: 'Yo salut tu vas bien ?',
    body: z.object({ name: z.string() }),
    middlewares: apply(auth, auth2),
    handler: (p) => {
      // p.
      // if (p.mid.BB)
      // p.mid
      // p.mid.
      // if ("BB" in p.mid) p.mid.
      // p.mid
      // if ("error" in p.mid) p.mid.
      // if p.mid.
      // if (p)
      // if (p.mid.BB) p.mid.
      // if (p.mid.TT) p.mid.
    },
  });
}
