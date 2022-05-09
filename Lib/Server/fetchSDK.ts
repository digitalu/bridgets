import AdmZip from 'adm-zip';
import { Request, Response } from 'express';
import fs from 'fs';

export const fetchSdkRoute = (req: Request, res: Response) => {
  if (!fs.existsSync('bridgets.config.json')) throw new Error('No Config');

  const cfg = JSON.parse(fs.readFileSync('bridgets.config.json', 'utf-8'));

  const zip = new AdmZip();
  zip.addLocalFolder(cfg.sdkLocation);
  const zipFileContents = zip.toBuffer();
  const fileName = 'sdk.zip';
  const fileType = 'application/zip';

  res.writeHead(200, { 'Content-Disposition': `attachment; filename="${fileName}"`, 'Content-Type': fileType });
  return res.end(zipFileContents);
};
