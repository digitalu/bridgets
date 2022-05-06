import { Middleware } from '../Controller';

export const createMiddleware = <T extends Middleware>(p: T) => p;
