import { Controller, httpError, handler, apply } from '../../Lib';
import { z } from 'zod';

const mid1 = handler({
  body: z.object({ name: z.string() }),
  resolve: (p) => ({ yo: 'jj' }),
});

const mid2 = handler({
  middlewares: apply(mid1),
  body: z.object({ sasa: z.string() }),
  resolve: (p) => ({ ahouai: 'jj' }),
});

const auth = handler({
  headers: z.object({ token: z.string().min(10) }),
  body: z.object({ shaady: z.string() }),
  resolve: (p) => {
    if (p.headers.token !== 'jhsjdhsjdhjsdh') return httpError('Unauthorized', 'Wrong token');
    return { yo: 'kk' };
  },
});

export class User extends Controller {
  create = this.handler({
    method: 'PATCH',
    description: 'Yo salut tu vas bien ?',
    body: z.object({ dzds: z.string() }),
    middlewares: apply(auth, mid2),
    resolve: (p) => {
      if (p.body) console.log('AH');

      return ',,';
    },
  });
}
