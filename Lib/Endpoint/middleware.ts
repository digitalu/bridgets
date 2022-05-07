import { Middleware } from '../Utilities';

export const createMiddleware = <T extends Middleware>(p: T) => p;
