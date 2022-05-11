import { Controller, createMiddleware, createHttpError, createEndpoint, apply } from '../../Lib';
import { Request } from 'express';
import { z } from 'zod';

const auth = createMiddleware((req) => ({ YES: req.headers.trailer }));

const auth3 = (req: Request) => ({ YESEE: { oui: true } });

const auth2 = createMiddleware((req) => {
  if (req.headers.token) return createHttpError('Bad Request', 'AH', 'oui oui');

  if (req.headers) return { user: { name: 'Nab', age: 78 } };
  else return { association: { admins: ['Nab'] } };
});

class Invoice extends Controller {
  kabium = new Patate();

  create = this.createEndpoint({
    headers: z.object({ token: z.string() }),
    handler: ({ headers }) => {
      if (headers.token === 'my_secret_password') return headers;
      return 'HEY' as const;
    },
  });
}

const create = createEndpoint({
  method: 'POST',
  files: 'any',
  // body: z.object({ name: z.string() }),
  middlewares: apply(auth2),
  headers: z.object({ token: z.string() }),
  handler: (p) => {
    return p.headers;
  },
});

export class User extends Controller {
  invoice = new Invoice();

  create = create;

  update = this.createEndpoint({
    method: 'PATCH',
    description: 'Yo salut tu vas bien ?',
    // body: z.object({ name: z.string() }),
    // middlewares: apply(auth),
    handler: (p) => {
      if (p) console.log('AH');
      return ',,';

      // const d = this.create.handler;
      // throw new Error('Yo tu vas bien?');
      // return { d: 7 / 0 };
    },
  });
}

export class Test extends Controller {
  test = new Invoice();

  k = 'SALUT';

  hhh = new User();
}

export class Patate extends Controller {
  update = this.createEndpoint({
    method: 'PATCH',
    description: 'Yo salut tu vas bien ?',
    files: apply('image1', 'file'),
    handler: (p) => {
      console.log(p);
      return 'ok';
      // if (!p.mid.association) p.mid.user.age;
    },
  });
}
