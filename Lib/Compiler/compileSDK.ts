import { BridgeRoutes } from '../Routes';
import { isController, pathArrayToPath } from '../Utilities';
import { removeFolder, createFolder } from './fs';
import { writeController } from './writeControllers';

export const compileSDK = (routes: BridgeRoutes, sdkLocation: string, typeLocation: string, sdkTypeName: string) => {
  visiteRoutes(routes, [], sdkLocation, typeLocation, sdkTypeName);
};

const visiteRoutes = (
  routes: BridgeRoutes,
  pathArray: string[],
  sdkLocation: string,
  typeLocation: string,
  sdkTypeName: string
) => {
  Object.entries(routes).forEach(([name, subRouteOrController]) => {
    if (isController(subRouteOrController))
      writeController(subRouteOrController, [...pathArray, name], sdkLocation, typeLocation, sdkTypeName);
    else {
      createFolder(pathArrayToPath([...pathArray, name], sdkLocation));
      visiteRoutes(subRouteOrController, [...pathArray, name], sdkLocation, typeLocation, sdkTypeName);
    }
  });
};
