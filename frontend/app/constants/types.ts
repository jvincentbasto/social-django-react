export type DynamicObject = {
  [key: string]: unknown
} | Record<string, unknown>
export type DynamicList = string[] | DynamicObject[] | DynamicList[] | any[]

// generic pick types 
export type GenericTypeObjectPick<O, K extends keyof O> = Pick<O, K>;
export type GenericTypeValuePick<O, K extends keyof O> = O[K];

// key mapper
export type GenericKeyMapper<T, C extends Record<string, string>> = {
  [K in keyof T as C[K & keyof C]]: T[K];
};
