'use strict';
import * as _ from 'lodash';

export interface Config {
  prependKeyPath?: boolean;
  keyJoinString?: string;
  makeUpperCase?: boolean;
}

export const DefaultConfig: Config = {
  prependKeyPath: true,
  keyJoinString: '.',
  makeUpperCase: false
};

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
 * @param config
 * @returns {any}
 */
export default function deepKeyMirror( obj: any, config?: Config): any {
  'use strict';
  return new DeepKeyMirror(_.assign({}, DefaultConfig, config)).deepKeyMirror(obj);
}

export class DeepKeyMirror {
  constructor(public config: Config) { }

  deepKeyMirror(obj: any): any {
    return this.doDeepKeyMirror(obj, []);
  }

  private doDeepKeyMirror(obj: any, paths: string[]): any {
    if (obj === null || obj === undefined) {
      return obj;
    }

    if (['boolean', 'number', 'function'].indexOf(typeof obj) !== -1) {
      return obj;
    }

    if (_.isString(obj)) {
      if (this.config.prependKeyPath) {
        let parentPaths = _.dropRight(paths, 1);
        return this.buildValue(parentPaths.concat(obj));
      } else {
        return obj;
      }
    }

    if (obj instanceof Array) {
      // todo: reject an item that is not the type `string` nor `number`
      return _.reduce(
        obj,
        (mirrored: any, prop: any) =>
          Object.defineProperty(mirrored, prop, {
            value: this.buildValue(paths.concat(prop.toString())),
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
      .forEach((prop: string) => obj[prop] = this.buildValue(paths.concat(prop)));
    // assign recursively prop if its value is not null nor undefined
    nonEmptyProps
      .forEach((prop: string) => obj[prop] = this.doDeepKeyMirror(obj[prop], paths.concat(prop)));
    return obj;
  }

  private buildValue(paths: string[]): string {
    return paths
      .map(key => this.config.makeUpperCase ? key.toUpperCase() : key)
      .join(this.config.keyJoinString);
  }
}
