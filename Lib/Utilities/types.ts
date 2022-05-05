export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

export type KeysWithValNotNever<T> = keyof { [P in keyof T as T[P] extends never ? never : P]: P };

export type ExcludeNeverKeys<T> = { [key in KeysWithValNotNever<T> & keyof T]: T[key] };
