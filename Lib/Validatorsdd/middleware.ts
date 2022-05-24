import { AbstractValidator, ValidateFN } from './validator';

export class MiddlewareValidator extends AbstractValidator {
  constructor(private middleware: any) {
    super();
  }

  public validate: ValidateFN = async (req, data) => {
    const result = (await this.middleware(req)) || {};

    if (result.error) return { error: result.error };

    return await super.validate(req, { ...data, ...result });
  };
}
