import type { Mirrored, ObjValue } from './model';

/**
 * Constructs an enumeration with keys equal to their value.
 *
 * A string array is mirrored into an object keyed by its elements
 * (e.g. `['a', 'b']` -> `{ a: 'a', b: 'b' }`), while an array containing
 * non-string elements keeps the legacy index-path behaviour.
 *
 * @param obj the source object (or string array)
 * @returns the mirrored structure
 */
export function deepKeyMirror<const T extends ObjValue>(obj: T): Mirrored<T> {
  return doDeepKeyMirror(obj, []) as Mirrored<T>;
}

function doDeepKeyMirror(obj: ObjValue, paths: string[]): unknown {
  if (obj == null || typeof obj === 'string') {
    return paths.join('.');
  }

  if (Array.isArray(obj)) {
    // A pure string array becomes an object keyed by its elements.
    if (obj.every((el): el is string => typeof el === 'string')) {
      return Object.fromEntries(obj.map(el => [el, paths.concat(el).join('.')]));
    }
    // Otherwise keep the legacy index-path behaviour.
    const indexer = (i: number): string[] =>
      paths.length ? paths.slice(0, paths.length - 1).concat([`${paths.slice(-1)[0]}[${i}]`]) : [];
    return obj.map((value, i) => doDeepKeyMirror(value, indexer(i)));
  }

  // object
  return Object.fromEntries(
    Object.entries(obj).map(([prop, value]) => [
      prop,
      value != null ? doDeepKeyMirror(value, paths.concat(prop)) : paths.concat(prop).join('.'),
    ]),
  );
}
