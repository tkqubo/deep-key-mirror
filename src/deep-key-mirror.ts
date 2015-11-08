'use strict';
import * as _ from 'lodash';

export function deepKeyMirror(obj: any): any {
  'use strict';
  return doDeepKeyMirror(obj);
}

function doDeepKeyMirror(obj: any, paths: string[] = []): any {
  'use strict';
  if (obj === null || obj === undefined) {
    return obj;
  }
  if (['boolean', 'number', 'string', 'function'].indexOf(typeof obj) !== -1) {
    return obj;
  }
  if (obj instanceof Array) {
    // todo: reject an item that is not the type `string` nor `number`
    return _.reduce(
      obj,
      (mirrored: any, prop: any) =>
        Object.defineProperty(mirrored, prop, {
          value: buildValue(...paths, prop.toString()),
          enumerable: true,
          writable: true,
          configurable: true
        }),
      {} as any);
  }

  let properties: string[] = Object
    .keys(obj)
    .filter((prop: string) => obj.hasOwnProperty(prop));
  let [emptyProps, nonEmptyProps] = _.partition(properties, (prop: string) => obj[prop] === null || obj[prop] === undefined);
  // assign prop name if its value is null or undefined
  emptyProps
    .forEach((prop: string) => obj[prop] = buildValue(...paths, prop));
  // assign recursively prop if its value is not null nor undefined
  nonEmptyProps
    .forEach((prop: string) => obj[prop] = doDeepKeyMirror(obj[prop], [...paths, prop]));
  return obj;
}

function buildValue(...paths: string[]): string {
  'use strict';
  return paths.join('.');
}
