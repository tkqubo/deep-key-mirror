import { Mirrored, Obj, ObjValue } from './model';

/**
 * Constructs an enumeration with keys equal to their value.
 *
 * @param obj
 * @returns {any}
 */
export function deepKeyMirror<T extends Obj>(obj: T): Mirrored<T> {
  return doDeepKeyMirror(obj, []);
}

function doDeepKeyMirror(obj: ObjValue, paths: string[]): any {
  if (obj == null || typeof obj === 'string') {
    return paths.join('.');
  }

  if (obj instanceof Array) {
    const indexer = (i: number): string[] =>
      paths.length ? paths.slice(0, paths.length - 1).concat([`${paths.slice(-1)[0]}[${i}]`]) : [];
    return obj.map((value, i) => doDeepKeyMirror(value, indexer(i)));
  }

  // object
  return Object.entries(obj).reduce(
    (prev, [prop, value]) => ({
      ...prev,
      [prop]: value != null ? doDeepKeyMirror(value, paths.concat(prop)) : paths.concat(prop).join('.'),
    }),
    {} as object,
  );
}
