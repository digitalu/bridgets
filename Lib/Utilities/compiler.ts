export const upperCaseFirstLetterOnly = (name: string) => name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

export const lastElem = (Arr: any[]) => Arr[Arr.length - 1];

export const pathArrayToPath = (pathArray: string[], origin: string): string =>
  pathArray.length === 0 ? `${origin}` : `${origin}/` + pathArray.reduce((prev, curr) => prev + '/' + curr);
