import { AbstractValidator } from './validator';
import { FilesConfig } from './types';
import { createHttpError } from '../Errors';
import { Request } from 'express';

export class FilesValidator extends AbstractValidator {
  constructor(private config: FilesConfig) {
    super();
  }

  public async validate(req: Request, data: Record<any, any>): Promise<Record<any, any>> {
    const missingFiles: string[] = [];

    // req.body contains the files
    if (this.config !== 'any') for (const name of this.config) if (!req.body[name]) missingFiles.push(name);

    if (missingFiles.length > 0)
      return createHttpError('Unprocessable entity', "You didn't send all required files", { missingFiles });
    return await super.validate(req, data);
  }
}
