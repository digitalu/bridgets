import formidable from 'formidable';
import { FilesConfig } from './types';
import { createHttpError } from '../Errors';

export const validateFiles = (config: FilesConfig, files: formidable.Files) => {
  const missingFiles: string[] = [];
  if (config !== 'any') for (const name of config) if (!files[name]) missingFiles.push(name);

  if (missingFiles.length > 0)
    return createHttpError('Unprocessable entity', "You didn't send all required files", { missingFiles });
  return undefined;
};
