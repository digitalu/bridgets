import { execSync } from 'child_process';
import { copyTypesAndMinify } from './copyModuleTypes';
import { compileSDK } from './compileSDK';
import { removeFolder } from './fs';
import { BridgeRoutes } from '../Routes';
import fs from 'fs';
import { askForConfig } from './askForConfig';

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

export const compile = async (routes: BridgeRoutes) => {
  if (!fs.existsSync('bridgets.config.json')) {
    await askForConfig();
    throw new Error('No bridgets config file found');
  }

  const cfg = JSON.parse(fs.readFileSync('bridgets.config.json', 'utf-8'));

  if (fs.existsSync(cfg.sdkLocation)) removeFolder(cfg.sdkLocation);

  runCommand(createDtsFolderCommand(cfg.tsConfigLocation, `${cfg.sdkLocation}/dts`));

  copyTypesAndMinify(cfg.sdkLocation);

  compileSDK(routes, cfg.sdkLocation, cfg.typeLocation, cfg.sdkTypeName);

  runCommand(command);
  process.exit(1);
};
