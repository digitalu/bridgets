import { Method } from '../Routes';
import { AbstractValidator, ValidateFN } from './validator';
import { createHttpError } from '../Errors';

export class MethodValidator extends AbstractValidator {
  constructor(private method: Method) {
    super();
  }

  public validate: ValidateFN = async (req, data) => {
    if (req.method !== this.method) return createHttpError('Not Found', 'Wrong method', { method: this.method });

    return await super.validate(req, data);
  };
}
