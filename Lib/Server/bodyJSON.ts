import { Request } from 'express';

export const getJSONDataFromRequestStream = <T>(request: Request): Promise<T> =>
  new Promise((resolve) => {
    const chunks: any[] = [];
    request.on('data', (chunk) => {
      chunks.push(chunk);
    });
    request.on('end', () => {
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString()));
      } catch (err) {
        resolve(JSON.parse('{}'));
      }
    });
  });
