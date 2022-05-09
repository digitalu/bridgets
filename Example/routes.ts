import { User, Test, Test2 } from './Controllers/user';
import { RoutesToSDK } from '../Lib';

export const routes = {
  user: new User(),
  ass: {
    tsb: new User(),
    ro: { t: new Test() },
  },
  n: {
    t: new Test2(),
  },
};
