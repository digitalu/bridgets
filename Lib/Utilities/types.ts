import { Request } from 'express';

export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

export type KeysWithValNotNever<T> = keyof { [P in keyof T as T[P] extends never ? never : P]: P };

export type ExcludeNeverKeys<T> = { [key in KeysWithValNotNever<T> & keyof T]: T[key] };

export type BridgeNextFunction = <T extends Record<any, any> = { NoMetaParametersGiven: true }>(
  p?: T
) => Readonly<T extends { NoMetaParametersGiven: true } ? {} : T>;

export type Middleware = (p: Request, next: BridgeNextFunction) => Record<any, any> | void;

export type ExtractReturnTypes<T extends readonly ((a: any, b: any) => Record<any, any>)[]> = {
  [K in keyof T]: T[K] extends (a: any, b: any) => infer R ? R : never;
} extends Array<infer YES>
  ? YES
  : never;

const test1 = (req: Request, next: BridgeNextFunction) => {
  return { yedy: 'y' } as const;
};

const test2 = (req: Request, next: BridgeNextFunction) => {
  if (req.headers.to) return { tt: 89 } as const;
  else return { OPOPO: 'yiuy' } as const;
};

const test3 = (req: Request, next: BridgeNextFunction) => {
  if (req.headers.to) return { IOIOIO: 89 } as const;
  else return { OUUUOPO: 'yiuy' } as const;
};

type Intersect<T> = (T extends any ? (x: T) => 0 : never) extends (x: infer R) => 0 ? R : never;

type Values<T> = T[keyof T];

type Unfoo<T> = T extends { foo: any } ? T['foo'] : never;

type Exclude<T, U> = T extends U ? never : T;
type Pick<T, K extends keyof T> = { [P in K]: T[P] };
type DistributiveOmit<T, K extends keyof any> = T extends any
  ? {
      [P in keyof T extends K ? never : keyof T]: T[P];
    }
  : never;
// Pick<T, Exclude<keyof T, K>>: never;
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;

type RemoveError<T> = T extends { error: any } ? never : T;
type NFoo<T extends Readonly<any[]>> = {
  [K in keyof T]: T[K] extends (...args: any) => any
    ? {
        foo: RemoveError<ReturnType<T[K]>>;

        //{
        //   [key in KeysWithValNotNever<
        //     ReturnType<T[K]> extends { error: any } ? never : ReturnType<T[K]> & { error: never }
        //   > &
        //     keyof ReturnType<T[K]> extends { error: any }
        //     ? never
        //     : ReturnType<T[K]> & { error: never }]: ReturnType<T[K]> extends { error: any }
        //     ? never
        //     : ReturnType<T[K]> & { error: never }[key];
        // };
        // ExcludeNeverKeys<ReturnType<T[K]> extends { error: any } ? never : ReturnType<T[K]> & { error: never }>;

        // {
        //   [key in KeysWithValNotNever<
        //     ReturnType<T[K]> extends { error: any } ? never : ReturnType<T[K]> & { error: never }
        //   > &
        //     keyof ReturnType<T[K]> extends { error: any }
        //     ? never
        //     : ReturnType<T[K]> & { error: never }]: ReturnType<T[K]> extends { error: any }
        //     ? never
        //     : ReturnType<T[K]> & { error: never }[key];
        // };
      }
    : // ReturnType<T[K]> extends any
      // ? {
      //     [P in keyof ReturnType<T[K]> extends 'error' ? never : keyof ReturnType<T[K]>]: ReturnType<T[K]>[P];
      //   }
      // : never
      never;
  // {
  //     foo: {
  //       [P in Exclude<keyof ReturnType<T[K]>, 'error'>]: ReturnType<T[K]>[P];
  //     };
  //     // Pick<ReturnType<T[K]>, Exclude<keyof ReturnType<T[K]>, 'error'>>;
  //   }
  // never;
};

export type GOGO<T extends Readonly<any[]>> = Unfoo<Intersect<Values<NFoo<T>>>>;

const arr = [test1, test2] as const;

// type UnionToIntersectionHelper<U> = (U extends unknown ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

// type UnionToIntersection<U> = boolean extends U
//   ? UnionToIntersectionHelper<Exclude<U, boolean>> & boolean
//   : UnionToIntersectionHelper<U>;

type UnionToOvlds<U> = UnionToIntersection<U extends any ? (f: U) => void : never>;

type PopUnion<U> = UnionToOvlds<U> extends (a: infer A) => void ? A : never;
type IsUnion<T> = [T] extends [UnionToIntersection<T>] ? false : true;
type UnionToArray<T, A extends unknown[] = []> = IsUnion<T> extends true
  ? UnionToArray<Exclude<T, PopUnion<T>>, [PopUnion<T>, ...A]>
  : [T, ...A];

type A = typeof arr;
let res: NFoo<A>;

// let res: Intersect<NFoo<UnionToArray<ExtractReturnTypes<typeof arr>>>[number]>;

// if (res.)

type Fn = (a: any, b: any) => Record<any, any>;

// export type RT<A extends ReadonlyArray<Fn>> = A extends [infer H, ...infer R]
//   ? H extends Fn
//     ? R extends Fn[]
//       ? [ReturnType<H>, ...RT<R>]
//       : []
//     : []
//   : [];

// let re: RT<typeof arr>;

// assign<T, U, V>(target: T, source1: U, source2: V): T & U & V;

type Test<A> = A extends [infer A1] ? (A1 extends Fn ? ReturnType<A1> : never) : never;

const a = [test1];
let t: Test<typeof a>;

// const foo = [() => ({ one: 'fish' }), () => ({ two: 'fish' }), () => ({ red: 'fish' }), () => ({ blue: 'fish' })];
const foo = [test1, test2];

type ComponentType<A extends any[]> = A extends (infer U)[] ? U : never;

type what = ComponentType<typeof foo>;

type ReturnType2<T extends (...args: any) => Record<any, any>> = T extends (...args: any) => infer R
  ? { [key in keyof R]-?: R[key] }
  : any;

type ReturnsUnion = ReturnType2<ComponentType<typeof foo>>;
// {one: string} | {two: string} | {red: string} | {blue: string}

type KeyOfUnion<T> = T extends infer U ? keyof U : never;
// KeyOfUnion<ReturnsUnion> = 'one' | 'two' | 'red' | 'blue'

type ValueInUnion<T, K extends PropertyKey> = T extends { [k in K]: infer V } ? V : never;

type TESTTT = Intersect<ReturnsUnion>;

type Result = { [K in KeyOfUnion<ReturnsUnion>]: ValueInUnion<ReturnsUnion, K> };
// { one: string, two: string, red: string, blue: string }

type t = { a: 'oui'; b?: undefined } & { a?: undefined; b: 'oui' } & { c: 'oui' };

type Apply = <T extends ReadonlyArray<any>>(...args: T) => Readonly<T>;

const apply: Apply = (...args) => args;
