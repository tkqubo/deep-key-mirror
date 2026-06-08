export type Obj = { readonly [key: string]: ObjValue };

export type ObjValue = null | undefined | string | readonly ObjValue[] | Obj;

type Join<Prefix extends string, Key> = Key extends string ? (Prefix extends '' ? Key : `${Prefix}.${Key}`) : never;

// biome-ignore format: keep the conditional type branches aligned for readability
type MirroredInternal<T, Current extends string = ''> =
  T extends string | null | undefined ? Current :
  T extends readonly string[] ? { [K in T[number]]: Join<Current, K> } :
  T extends readonly (infer U)[] ? MirroredInternal<U, `${Current}[${number}]`>[] :
  T extends object ? { [K in keyof T]: MirroredInternal<T[K], Join<Current, K>> } :
  never;

export type Mirrored<T> = MirroredInternal<T>;
