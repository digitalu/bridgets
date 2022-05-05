import { Request } from 'express';
import { AbstractValidator } from './validator';

export class MiddlewareValidator extends AbstractValidator {
  constructor(private middleware: any) {
    super();
  }

  public async validate(req: Request, data: Record<any, any>): Promise<Record<any, any>> {
    const result = await this.middleware(req);

    if (result.error) return { error: result.error };

    return await super.validate(req, { ...data, ...result });
  }
}
