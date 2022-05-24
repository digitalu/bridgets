import { Method } from '../Routes';
import { AbstractValidator, ValidateFN } from './validator';
import { httpError } from '../Errors';

export class MethodValidator extends AbstractValidator {
  constructor(private method: Method) {
    super();
  }

  public validate: ValidateFN = async (req, data) => {
    if (req.method !== this.method) return httpError('Not Found', 'Wrong method', { method: this.method });

    return await super.validate(req, data);
  };
}
