import { AbstractValidator, ValidateFN } from './validator';
import { createHttpError } from '../Errors';

export type FilesConfig = ReadonlyArray<string> | 'any';

export class FilesValidator extends AbstractValidator {
  constructor(private config: FilesConfig) {
    super();
  }

  public validate: ValidateFN = async (req, data) => {
    const missingFiles: string[] = [];

    // req.body contains the files
    if (this.config !== 'any') for (const name of this.config) if (!req.body[name]) missingFiles.push(name);

    if (missingFiles.length > 0)
      return createHttpError('Unprocessable entity', "You didn't send all required files", { missingFiles });
    return super.validate(req, data);
  };
}
