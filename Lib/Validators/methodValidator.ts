import { Method } from '../Routes';
import { Request } from 'express';
import { AbstractValidator } from './validator';
import { createHttpError } from '../Controller';

export class MethodValidator extends AbstractValidator {
  constructor(private method: Method) {
    super();
  }

  public async validate(req: Request, data: Record<any, any>): Promise<Record<any, any>> {
    if (req.method !== this.method) return createHttpError('Not Found', 'Wrong method', { method: this.method });

    return await super.validate(req, data);
  }
}
