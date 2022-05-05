import { Endpoint } from '../Endpoint';
import { ControllerI } from '../Controller';

export const isController = (data: any): data is ControllerI => {
  return data.createEndpoint !== undefined && data.isBridgeController;
};

export const isEndpoint = (data: any): data is Endpoint<any> => {
  return data.handler !== undefined && data.isBridgeEndpoint;
};
