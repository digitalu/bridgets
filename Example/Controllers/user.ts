import { Controller, createMiddleware, createHttpError } from '../../Lib';
import { z } from 'zod';
import fs from 'fs';

const auth = (admin: boolean) =>
  createMiddleware(() => {
    return { Yo: admin };
  });

const auth2 = createMiddleware((req) => {
  if (req.headers.token) return createHttpError('Bad Request', 'AH');
  return { Yoo: 8 } as const;
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

export class User extends Controller {
  invoice = new Invoice();

  public create = this.createEndpoint({
    method: 'POST',
    // files: ['pp'] as const,
    headers: z.object({ token: z.string() }),
    // middlewares: [mid],
    handler: (p) => {
      if (p.headers.token !== 'raul_strip_teaseuse') return this.createHttpError('Unauthorized', 'Wrong token');

      // fs.writeFile('./public/' + p.files.pp.originalFilename, fs.readFileSync(p.files.pp.filepath), () => console.error);
      return p.headers.token;
    },
  });

  update = this.createEndpoint({
    method: 'PATCH',
    description: 'Yo salut tu vas bien ?',
    // body: z.object({ name: z.string() }),
    middlewares: [auth(false), auth2],
    handler: (p) => {
      const d = this.create.handler;
      return { d, p };
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
    // body: z.object({ name: z.string() }),
    middlewares: [auth(false), auth2],
    handler: (p) => {
      return p;
    },
  });
}
