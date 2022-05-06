import { Controller, createMiddleware, createHttpError, createEndpoint } from '../../Lib';
import { z } from 'zod';

const auth = createMiddleware((req, next) => {
  return next();
  // return res;
});

const auth2 = createMiddleware((req, next) => {
  if (req.headers.token) return next(createHttpError('Bad Request', 'AH', { dsdf: true }));
  // const res = next();
  // return res;
  return next({ TT: 5 } as const);
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
  // files: ['pp'] as const,
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
    middlewares: [auth, auth2],
    handler: (p) => {
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
    middlewares: [auth, auth2],
    handler: (p) => {
      return p;
    },
  });
}
