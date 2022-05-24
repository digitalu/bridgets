import { Request } from 'express';

export type ValidateFN = (req: Request, data: Record<any, any>) => Promise<Record<any, any>>;

export interface Validator {
  setNext(handler: Validator): Validator;

  validate: ValidateFN;
}

/**
 * The default chaining behavior is implemented inside a base handler class.
 */
export abstract class AbstractValidator implements Validator {
  private nextValidator: Validator | undefined;

  public setNext(handler: Validator): Validator {
    this.nextValidator = handler;

    return handler;
  }

  public async validate(req: Request, data: Record<any, any>): Promise<Record<any, any>> {
    if (this.nextValidator) return this.nextValidator.validate(req, data);
    return data;
  }
}
