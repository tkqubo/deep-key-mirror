'use strict';
import * as _ from 'lodash';

export function deepKeyMirror(obj: any): any {
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
          value: prop.toString(),
          writable: true,
          configurable: true
        }),
      {} as any);
  }

  Object.keys(obj)
    .filter((prop: string) => {
      return obj.hasOwnProperty(prop) && (obj[prop] === null || obj[prop] === undefined);
    })
    .forEach((prop: string) => obj[prop] = prop);
  return obj;
}
