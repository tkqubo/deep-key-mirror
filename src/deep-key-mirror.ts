'use strict';

export function deepKeyMirror(obj: any): any {
  'use strict';
  if (obj === null || obj === undefined) {
    return obj;
  }
  if (['boolean', 'number', 'string', 'function'].indexOf(typeof obj) !== -1) {
    return obj;
  }
  if (obj instanceof Array) {
    return obj;
  }

  Object.keys(obj)
    .filter((prop: string) => {
      let value = obj[prop];
      return value === null || value === undefined;
    })
    .forEach((prop: string) => obj[prop] = prop);
  return obj;
}
