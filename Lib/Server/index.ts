import { BridgeApp } from './bridgeApp';
import { BridgeRoutes } from '../Routes';
import { ErrorHandler } from '../Errors/types';

export const createBridgeApp = (routes: BridgeRoutes, onError?: ErrorHandler): BridgeApp => new BridgeApp(routes);
