import { ControllerI } from '../Controller';
import { isController, isEndpoint, upperCaseFirstLetterOnly, lastElem, pathArrayToPath } from '../Utilities';
import { createFolder, writeFile } from './fs';

export const writeController = (
  controller: ControllerI,
  pathArray: string[],
  sdkLocation: string,
  typeLocation: string,
  sdkTypeName: string
): void => {
  const controllersInside: Array<[string, ControllerI]> = [];

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // IMPORTS & CLASS TYPE
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////

  Object.entries(controller).forEach(([name, controller]) => {
    if (!isController(controller)) return;
    controllersInside.push([name, controller]);
  });

  let file = `import { ${sdkTypeName} } from '${'../'.repeat(
    controllersInside.length !== 0 ? pathArray.length : pathArray.length - 1
  )}dts/${typeLocation.replace('.ts', '').replace(/^.\//, '')}';\n\n`;

  if (controllersInside.length !== 0) {
    createFolder(pathArrayToPath(pathArray, sdkLocation));
    controllersInside.forEach(([ctrlName, ctrl]) => {
      file += `import { ${upperCaseFirstLetterOnly(ctrlName)} } from './${ctrlName.toLocaleLowerCase()}';\n`;
      writeController(ctrl, [...pathArray, ctrlName], sdkLocation, typeLocation, sdkTypeName);
    });
    file += '\n';
  }

  const className = upperCaseFirstLetterOnly(lastElem(pathArray));
  const typeVar = className + 'T';

  file += `type ${typeVar} = ${sdkTypeName}${pathArray.map((p) => `['${p}']`).reduce((a, b) => a + b)};\n\n`;

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // EXPORT CLASS
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////

  file += `export class ${className} {\n`;
  controllersInside.forEach(([ctrlName]) => {
    file += `  public ${ctrlName.toLocaleLowerCase()}: ${upperCaseFirstLetterOnly(ctrlName)};\n`;
  });
  file += `  constructor(private Fetch: any) {`;

  if (controllersInside.length === 0) file += '}\n';
  else {
    file += '\n';
    controllersInside.forEach(([ctrlName]) => {
      file += `    this.${ctrlName.toLocaleLowerCase()} = new ${upperCaseFirstLetterOnly(ctrlName)}(this.Fetch);\n`;
    });
    file += '  }\n';
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // CLASS METHODS
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////

  Object.entries(controller).forEach(([name, endpoint]) => {
    if (!isEndpoint(endpoint)) return;
    if (endpoint.description) file += `\n  /** ${endpoint.description}*/`;
    file += `\n  public ${name} = (p: { method: '${endpoint.method}'${
      endpoint.bodySchema ? `; body: ${typeVar}['${name}']['body']` : ''
    }${endpoint.querySchema ? `; query: ${typeVar}['${name}']['query']` : ''}${
      endpoint.headersSchema ? `; headers: ${typeVar}['${name}']['headers']` : ''
    } }): ${typeVar}['${name}']['return'] => {\n    return this.Fetch(p);\n  };\n`;
  });

  file += `}\n`;
  writeFile(
    controllersInside.length !== 0
      ? pathArrayToPath([...pathArray, 'index'], sdkLocation)
      : pathArrayToPath(pathArray, sdkLocation),
    file
  );
};
