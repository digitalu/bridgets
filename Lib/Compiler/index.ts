import { execSync } from 'child_process';
import { compileSDK } from './compileSDK';
import { BridgeRoutes } from '../Routes';
import { writeFile } from './fs';
import fs from 'fs';
import { fetchFile } from './fetchFile';

const command = 'echo Compilation done';

export const compile = (routes: BridgeRoutes) => {
  // if (!fs.existsSync('bridgets.config.json')) {
  //   throw new Error('CLI not ready, create yourself the bridgets.config.json file.');
  //   createOrUpdateBridgeConfigFile();
  //   throw new Error('No Config');
  // }

  const cfg = JSON.parse(fs.readFileSync('bridgets.config.json', 'utf-8'));

  if (fs.existsSync(cfg.sdkLocation)) fs.rmSync(cfg.sdkLocation, { recursive: true });

  compileSDK(routes, cfg.sdkLocation, cfg.pathToSourceFile, 'SDKTypes');

  writeFile(`${cfg.sdkLocation}/fetchBridgeTS`, fetchFile);

  process.exit(1);
};
