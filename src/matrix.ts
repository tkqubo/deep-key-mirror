import { Config } from './model';
import { isArray, isDefined } from './utils';
import { deepKeyMirror } from './deep-key-mirror';

/**
 * Creates an isomorphic and recursive key-value structure.
 *
 * @param keyMap
 * @param config
 * @returns {any}
 */
export function matrix(keyMap: string[][] | null | undefined, config?: Config): any {
  if (!isDefined(keyMap) || !isArray(keyMap) || !keyMap.every(isArray)) {
    return keyMap;
  }

  const [firstKeys, ...restKeys] = [...keyMap].reverse();
  let matrix: object = firstKeys;
  for (const keys of restKeys) {
    matrix = keys.reduce(
      (prev, curr) => ({
        ...prev,
        [curr]: isArray(matrix) ? [...matrix] : { ...matrix },
      }),
      {} as object,
    );
  }

  return deepKeyMirror(matrix, config);
}
