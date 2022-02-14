/**
 * Configuration for `deepKeyMirror`
 */
export interface Config {
  retain?: boolean;
  joinString?: string;
  upperCase?: boolean;
}

/**
 * Default `Config` instance
 * ```ts
 * {
 *   retain: false,
 *   joinString: '.',
 *   upperCase: false
 * }
 * ```
 * @type {{retain: boolean, joinString: string, upperCase: boolean}}
 */
export const defaultConfig: Readonly<Config> = {
  retain: false,
  joinString: '.',
  upperCase: false,
};

// prettier-ignore
export type Mirrored<T> =
  T extends Primitive | Fn ? T :
    T extends ArrayLike ? any :
      MirroredProperty<T>;

// prettier-ignore
export type MirroredProperty<T> =
  T extends Primitive ? string
    : T extends Fn ? T
      : T extends ArrayLike ? any
        : { [K in keyof T]: MirroredProperty<T[K]> };

export type Fn = (...args: any[]) => any;

export type ArrayLike = any[] | ReadonlyArray<any>;

export type Primitive = string | number | bigint | boolean | symbol | null | undefined;
