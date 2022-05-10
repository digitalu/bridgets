import { execSync } from 'child_process';
import { copyTypesAndMinify } from './copyModuleTypes';
import { compileSDK } from './compileSDK';
import { BridgeRoutes } from '../Routes';
import fs from 'fs';
import { createOrUpdateBridgeConfigFile } from './createConfigFile';

const command = 'echo Compilation done';

const createDtsFolderCommand = (tsConfigLocation: string, sdkLocation: string) =>
  `npx tsc -p ${tsConfigLocation} --declaration --emitDeclarationOnly --rootDir ./ --outDir ${sdkLocation}`;

const runCommand = (command: string) => {
  try {
    execSync(`${command}`, { stdio: 'inherit' });
  } catch (e) {
    console.error(`Failed to execute ${command}`, e);
    return false;
  }
  return true;
};

export const compile = (routes: BridgeRoutes) => {
  if (!fs.existsSync('bridgets.config.json')) {
    createOrUpdateBridgeConfigFile();
    throw new Error('No Config');
  }

  const cfg = JSON.parse(fs.readFileSync('bridgets.config.json', 'utf-8'));

  if (fs.existsSync(cfg.sdkLocation)) fs.rmSync(cfg.sdkLocation, { recursive: true });

  runCommand(createDtsFolderCommand(cfg.tsConfigLocation, `${cfg.sdkLocation}/dts`));

  copyTypesAndMinify(cfg.sdkLocation);

  compileSDK(routes, cfg.sdkLocation, cfg.typeLocation, cfg.sdkTypeName);

  runCommand(command);
  process.exit(1);
};
