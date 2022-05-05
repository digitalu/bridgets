import { Request } from 'express';

/**
 * The Validator interface declares a method for building the chain of handlers.
 * It also declares a method for executing a request.
 */
export interface Validator {
  setNext(handler: Validator): Validator;

  validate(req: Request, data: Record<any, any>): Promise<Record<any, any>>;
}

export type FilesConfig = ReadonlyArray<string> | 'any';
