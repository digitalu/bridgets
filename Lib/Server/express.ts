import { BridgeRoutes } from '../Routes';
import { ErrorHandler } from '../Errors/types';

import { createHttpHandler } from './standalone';

export const createExpressMiddleware = (routes: BridgeRoutes, onError?: ErrorHandler) => createHttpHandler(routes, onError);
