import { Middleware } from '../Controller';

export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

export type KeysWithValNotNever<T> = keyof { [P in keyof T as T[P] extends never ? never : P]: P };

export type ExcludeNeverKeys<T> = { [key in KeysWithValNotNever<T> & keyof T]: T[key] };

type Values<T> = T[keyof T];

type Unfoo<T> = T extends { foo: any } ? T['foo'] : never;

type RemoveError<T> = T extends { error: any } ? never : T;

type KeepError<T> = T extends { error: any } ? T : never;

type NFooWithoutError<T extends Readonly<any[]>> = {
  [K in keyof T]: T[K] extends (...args: any) => any ? { foo: RemoveError<ReturnType<T[K]>> } : never;
};

type NFooOnlyError<T extends Readonly<any[]>> = {
  [K in keyof T]: T[K] extends (...args: any) => any ? { foo: KeepError<ReturnType<T[K]>> } : never;
};

export type MidsReturnsIntersection<T extends Readonly<any[]>> = Unfoo<UnionToIntersection<Values<NFooWithoutError<T>>>>;

export type MidsErrorReturnsIntersection<T extends Readonly<any[]>> = Unfoo<UnionToIntersection<Values<NFooOnlyError<T>>>>;

type UnionToOvlds<U> = UnionToIntersection<U extends any ? (f: U) => void : never>;

type PopUnion<U> = UnionToOvlds<U> extends (a: infer A) => void ? A : never;
type IsUnion<T> = [T] extends [UnionToIntersection<T>] ? false : true;
type UnionToArray<T, A extends unknown[] = []> = IsUnion<T> extends true
  ? UnionToArray<Exclude<T, PopUnion<T>>, [PopUnion<T>, ...A]>
  : [T, ...A];

export type Apply = <B extends string | Middleware, T extends Array<B>>(
  ...args: T
) => B extends string ? UnionToArray<T[number]> : UnionToArray<T[number]>;
