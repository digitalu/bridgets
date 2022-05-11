import { ControllerI } from '../Controller';
import { isController, isEndpoint, getParamsObjectString, pathArrayToPath } from '../Utilities';
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

  // writing the import of type from dts file
  // It handles index files and first stage file
  let file = `import { ${sdkTypeName} } from '${
    controllersInside.length === 0 && pathArray.length === 1
      ? './'
      : '../'.repeat(controllersInside.length !== 0 ? pathArray.length : pathArray.length - 1)
  }dts/${typeLocation.replace('.ts', '').replace(/^.\//, '')}';\n\n`;

  if (controllersInside.length !== 0) {
    createFolder(pathArrayToPath(pathArray, sdkLocation));
    controllersInside.forEach(([ctrlName, ctrl]) => {
      file += `import { ${ctrl.constructor.name} } from './${ctrlName.toLocaleLowerCase()}';\n`;
      writeController(ctrl, [...pathArray, ctrlName], sdkLocation, typeLocation, sdkTypeName);
    });
    file += '\n';
  }

  const className = (controller as any).constructor.name;
  const typeVar = className + 'T';

  file += `type ${typeVar} = ${sdkTypeName}${pathArray.map((p) => `['${p}']`).reduce((a, b) => a + b)};\n\n`;

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // EXPORT CLASS
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////

  file += `export class ${className} {\n`;
  controllersInside.forEach(([ctrlName, ctrl]) => {
    file += `  public ${ctrlName.toLocaleLowerCase()}: ${ctrl.constructor.name};\n`;
  });
  file += `  constructor(private Fetch: any) {`;

  if (controllersInside.length === 0) file += '}\n';
  else {
    file += '\n';
    controllersInside.forEach(([ctrlName, ctrl]) => {
      file += `    this.${ctrlName.toLocaleLowerCase()} = new ${ctrl.constructor.name}(this.Fetch);\n`;
    });
    file += '  }\n';
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // CLASS METHODS
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////

  Object.entries(controller).forEach(([name, endpoint]) => {
    if (!isEndpoint(endpoint)) return;
    if (endpoint.description) file += `\n  /** ${endpoint.description}*/`;

    const paramsString = [];
    if (endpoint.bodySchema) paramsString.push(`body: ${typeVar}['${name}']['body']`);
    if (endpoint.querySchema) paramsString.push(`query: ${typeVar}['${name}']['query']`);
    if (endpoint.headersSchema) paramsString.push(`headers: ${typeVar}['${name}']['headers']`);
    if (endpoint.filesConfig) {
      if (endpoint.filesConfig === 'any') paramsString.push('files: Record<string, File>');
      else
        paramsString.push(
          `files: {${endpoint.filesConfig
            .map((f) => ` ${f}: File;`)
            .reduce((a, b) => a + b)
            .slice(0, -1)} }`,
          ''
        );
    }
    const hasParams = paramsString.length > 0;

    file += `\n  public ${name} = (${
      hasParams ? `p: ${getParamsObjectString(paramsString)}` : ''
    }): Promise<${typeVar}['${name}']['return']> => {\n    return this.Fetch({ path: '${[...pathArray, name]
      .map((p) => `/${p}`)
      .reduce((a, b) => a + b)}', method: '${endpoint.method}'${hasParams ? ', ...p ' : ''}});\n  };\n`;
  });

  file += `}\n`;
  writeFile(
    controllersInside.length !== 0
      ? pathArrayToPath([...pathArray, 'index'], sdkLocation)
      : pathArrayToPath(pathArray, sdkLocation),
    file
  );
};
