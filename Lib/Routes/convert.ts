import { ControllerI } from '../Controller';
import { BridgeRoutes, ServerRoutes } from '../Routes';
import { isController, isHandler } from '../Utilities';

export const createRoutes = (routes: BridgeRoutes, serverRoutes: ServerRoutes = {}, prefix = ''): ServerRoutes => {
  Object.entries(routes).forEach(([name, subRoutesOrController]) => {
    if (isController(subRoutesOrController))
      createRoutesFromController(subRoutesOrController, serverRoutes, `${prefix}/${name}`);
    else createRoutes(subRoutesOrController, serverRoutes, `${prefix}/${name}`);
  });
  return serverRoutes;
};

const createRoutesFromController = (controller: ControllerI, serverRoutes: ServerRoutes, prefix: string): void => {
  Object.entries(controller).forEach(([name, endpoint]) => {
    if (isHandler(endpoint))
      serverRoutes[`${prefix}/${name}`] = {
        resolve: endpoint.resolve,
        validator: endpoint.validator,
        filesConfig: endpoint.filesConfig,
      };
    else if (isController(endpoint)) createRoutesFromController(endpoint, serverRoutes, `${prefix}/${name}`);
  });
};
