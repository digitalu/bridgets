import formidable from 'formidable';
import { Request } from 'express';

export const formidableAsyncParseFiles = async (req: Request): Promise<formidable.Files> => {
  let form = formidable({ multiples: true });

  return new Promise((resolve, reject) => {
    form.parse(req, function (error, fields, files) {
      if (error) {
        reject(error);
        return;
      }

      resolve(files);
    });
  });
};
