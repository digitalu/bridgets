import { Controller, httpError, handler, apply } from '../../Lib';
import { z } from 'zod';

const mid1 = handler({
  // body: z.object({ name: z.string() }),
  resolve: (p) => {
    // console.log('hhh');
    return { yoo: 'jj' };
  },
});

const mid2 = handler({
  // middlewares: apply(mid1),
  // body: z.object({ sasa: z.string() }),
  resolve: (p) => {
    // console.log('What', p.mid);
    return { ahouai: 'jj' };
  },
});

const auth = handler({
  middlewares: apply(mid1),
  // headers: z.object({ token: z.string().min(10) }),
  // body: z.object({ shaady: z.string() }),
  resolve: (p) => {
    console.log(p.mid, 'here');
    // if (p.headers.token !== 'jhsjdhsjdhjsdh') return httpError('Unauthorized', 'Wrong token');
    return { sah: 'kk', ...p.mid };
  },
});

export class User extends Controller {
  create = this.handler({
    method: 'PATCH',
    description: 'Yo salut tu vas bien ?',
    query: z.object({ dzds: z.string() }),
    middlewares: apply(mid2, auth),
    resolve: (p) => {
      // p.files.salut.
      return p.mid;
      if (p.query) return { STT: 'ouiou' } as const;

      return ',,' as const;
    },
  });
}
