import { Controller, createMiddleware, createHttpError, createEndpoint, apply } from '../../Lib';
import { Request } from 'express';
import { z } from 'zod';
import * as s from 'superstruct';
import * as yup from 'yup';

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
    query: yup.object({ token: yup.string().required() }),
    handler: ({ query }) => {
      if (query.token === 'my_secret_password') return query;
      return 'HEY' as const;
    },
  });
}

const consoleMethod = createMiddleware((req) => console.log('method: ', req.method));

const create = createEndpoint({
  middlewares: apply(consoleMethod),
  body: s.object({ nana: s.string() }),
  query: yup.object({ token: yup.string().required() }),
  handler: (p) => {
    // p.query.
    return p;
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
