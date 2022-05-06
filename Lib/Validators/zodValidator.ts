import { Request } from 'express';
import { AbstractValidator } from './validator';
import { ZodSchema } from 'zod';
import { createHttpError } from '../Errors';

export class ZodValidator extends AbstractValidator {
  constructor(private zodSchema: ZodSchema, private from: 'body' | 'query' | 'headers') {
    super();
  }

  public async validate(req: Request, data: Record<any, any>): Promise<Record<any, any>> {
    const result = this.zodSchema.safeParse(req[this.from]);

    if (result.success) return await super.validate(req, data);

    switch (this.from) {
      case 'body':
        return createHttpError('Unprocessable entity', `The JSON body does not respect the schema.`, result.error.issues);
      case 'query':
        return createHttpError(
          'Unprocessable entity',
          `The query parameters does not respect the schema.`,
          result.error.issues
        );
      case 'headers':
        return createHttpError('Unprocessable entity', `The headers does not respect the schema.`, result.error.issues);
    }
  }
}
