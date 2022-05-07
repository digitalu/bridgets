import { execSync } from 'child_process';
import fs from 'fs';

const command = 'echo YOOOOO';

const createDtsFolderCommand = (tsConfigLocation: string, typeLocation: string, sdkLocation: string) =>
  `npx tsc -p ${tsConfigLocation} --declaration --emitDeclarationOnly --rootDir ${typeLocation} --outDir ${sdkLocation}`;

const runCommand = (command: string) => {
  try {
    execSync(`${command}`, { stdio: 'inherit' });
  } catch (e) {
    console.error(`Failed to execute ${command}`, e);
    return false;
  }
  return true;
};

export const compile = () => {
  console.log('YO');

  if (!fs.existsSync('bridgets.config.json')) throw new Error('No Config');

  const cfg = JSON.parse(fs.readFileSync('bridgets.config.json', 'utf-8'));

  console.log(createDtsFolderCommand(cfg.tsConfigLocation, cfg.typeLocation, cfg.sdkLocation));
  //   runCommand(createDtsFolderCommand(cfg.tsConfigLocation, cfg.typeLocation, cfg.sdkLocation));

  runCommand(command);
  process.exit(1);
};
