import { Handler } from '../Handler';
import { ControllerI } from '../Controller';

export const isController = (data: any): data is ControllerI => {
  return data.createEndpoint !== undefined && data.isBridgeController;
};

export const isHandler = (data: any): data is Handler<any, any> => {
  return data.resolve !== undefined && typeof data.resolve === 'function' && data.isBridgeHandler;
};
