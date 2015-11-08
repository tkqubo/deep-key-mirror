'use strict';
import * as _ from 'lodash';

/**
 * Constructs an enumeration with keys equal to their value.
 * <p>
 * If the given object has child arrays or objects, they are also similarly constructed recursively,
 * with their value assigned by the paths from the root object concatenated with `'.'`
 * </p>
 *
 * For example:
 * <pre>
 *   let breakfast = {
 *     bread: null,
 *     beverage: {
 *       milk: null,
 *       coffee: null
 *     },
 *     fruits: [
 *       'orange',
 *       'apple'
 *     ]
 *   };
 *   let breakfastConfig = deepKeyMirror(breakfast);
 *   breakfastConfig.bread === 'bread';
 *   breakfastConfig.beverage.milk === 'beverage.milk';
 *   breakfastConfig.beverage.coffee === 'beverage.coffee';
 *   breakfastConfig.fruits.orange === 'fruits.orange';
 *   breakfastConfig.fruits.apple === 'fruits.apple';
 * </pre>
 *
 * @param obj
 * @returns {any}
 */
export function deepKeyMirror(obj: any): any {
  'use strict';
  return doDeepKeyMirror(obj);
}

function doDeepKeyMirror(obj: any, paths: string[] = []): any {
  'use strict';
  if (obj === null || obj === undefined) {
    return obj;
  }
  if (['boolean', 'number', 'function'].indexOf(typeof obj) !== -1) {
    return obj;
  }
  if (_.isString(obj)) {
    let parentPaths = _.dropRight(paths, 1);
    return buildValue(parentPaths.concat(obj));
  }
  if (obj instanceof Array) {
    // todo: reject an item that is not the type `string` nor `number`
    return _.reduce(
      obj,
      (mirrored: any, prop: any) =>
        Object.defineProperty(mirrored, prop, {
          value: buildValue(paths.concat(prop.toString())),
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
    .forEach((prop: string) => obj[prop] = buildValue(paths.concat(prop)));
  // assign recursively prop if its value is not null nor undefined
  nonEmptyProps
    .forEach((prop: string) => obj[prop] = doDeepKeyMirror(obj[prop], paths.concat(prop)));
  return obj;
}

function buildValue(paths: string[]): string {
  'use strict';
  return paths.join('.');
}
