export type Obj = { [key: string]: ObjValue };

export type ObjValue = null | undefined | string | null[] | undefined[] | string[] | Obj | Obj[];

type Join<Prefix extends string, Key> = Key extends string ? (Prefix extends '' ? Key : `${Prefix}.${Key}`) : never;

// prettier-ignore
type MirroredInternal<T extends ObjValue, Current extends string = ''> =
  T extends string | null | undefined ? Current :
  T extends Obj ? { [K in keyof T]: MirroredInternal<T[K], Join<Current, K>>; } :
  T extends (infer U)[] & { length: infer L } ?
    U extends null | undefined | string | ObjValue ? MirroredInternal<U, `${Current}[${number}]`>[] & { length: L } :
    never :
  never;

export type Mirrored<T extends Obj> = MirroredInternal<T, ''>;
