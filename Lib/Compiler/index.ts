import { BridgeRoutes } from '../Routes';
import { isController, pathArrayToPath } from '../Utilities';
import { removeFolder, createFolder } from './fs';
import { writeController } from './writeControllers';

// export const compileSDK = (routes: BridgeRoutes, sdkLocation: string) => {
//   removeFolder(sdkLocation);
//   visiteRoutes(routes, [], sdkLocation);
// };

// const visiteRoutes = (routes: BridgeRoutes, pathArray: string[], sdkLocation: string) => {
//   createFolder(pathArrayToPath(pathArray, sdkLocation));
//   Object.entries(routes).forEach(([name, subRouteOrController]) => {
//     if (isController(subRouteOrController))
//       writeController(subRouteOrController, [...pathArray, name], sdkLocation, 'SDKTypes');
//     else visiteRoutes(subRouteOrController, [...pathArray, name], sdkLocation);
//   });
// };
