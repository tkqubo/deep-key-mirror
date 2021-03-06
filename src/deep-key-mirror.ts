'use strict';
import * as _ from 'lodash';

/**
 * Configuration for `deepKeyMirror`
 */
export interface Config {
  prependKeyPath?: boolean;
  keyJoinString?: string;
  makeUpperCase?: boolean;
}

/**
 * Default `Config` instance
 * ```
 * {
 *   prependKeyPath: true,
 *   keyJoinString: '.',
 *   makeUpperCase: false
 * }
 * ```
 * @type {{prependKeyPath: boolean, keyJoinString: string, makeUpperCase: boolean}}
 */
export const DefaultConfig: Config = {
  prependKeyPath: true,
  keyJoinString: '.',
  makeUpperCase: false
};

/**
 * Constructs an enumeration with keys equal to their value.
 *
 * @param obj
 * @param config
 * @returns {any}
 */
export default function deepKeyMirror(obj: any, config?: Config): any {
  'use strict';
  return new DeepKeyMirror(_.assign({}, DefaultConfig, config)).deepKeyMirror(obj);
}

/**
 * Creates an isomorphic and recursive key-value structure.
 *
 * @param keyMap
 * @param config
 * @returns {any}
 */
export function matrix(keyMap: string[][], config?: Config) {
  'use strict';
  return new DeepKeyMirror(_.assign({}, DefaultConfig, config)).matrix(keyMap);
}

/** Class responsible for key mirror generation */
export class DeepKeyMirror {
  constructor(public config: Config) { }

  deepKeyMirror(obj: any): any {
    return this.doDeepKeyMirror(obj, []);
  }

  matrix(keyMap: string[][]): any {
    if (this.isNullLike(keyMap)) {
      return keyMap;
    }

    let matrix: any = null;
    while (keyMap.length) {
      let keys: string[] = keyMap.pop();
      if (!matrix) {
        matrix = keys;
      } else {
        matrix = _.reduce(
          keys,
          (obj: any, prop: string) =>
            Object.defineProperty(obj, prop, {
              value: _.isArray(matrix) ? _.assign([], matrix) : _.assign({}, matrix),
              enumerable: true,
              writable: true,
              configurable: true
            }),
          {} as any
        );
      }
    }
    return deepKeyMirror(matrix, this.config);
  }

  /**
   * @param obj
   * @param paths
   * @returns {any}
   * @private
   */
  private doDeepKeyMirror(obj: any, paths: string[]): any {
    if (this.isNullLike(obj)) {
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
        (mirrored: any, prop: string) =>
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
    if (properties.length === 0) {
      return obj;
    }

    obj = _.assign({}, obj);
    let [emptyProps, nonEmptyProps] = _.partition(properties, (prop: string) => this.isNullLike(obj[prop]));
    // assign prop name if its value is null or undefined
    emptyProps
      .forEach((prop: string) => obj[prop] = this.buildValue(paths.concat(prop)));
    // assign recursively prop if its value is not null nor undefined
    nonEmptyProps
      .forEach((prop: string) => obj[prop] = this.doDeepKeyMirror(obj[prop], paths.concat(prop)));
    return obj;
  }

  /**
   * @param paths
   * @returns {any}
   * @private
   */
  private buildValue(paths: string[]): string {
    return paths
      .map(key => this.config.makeUpperCase ? key.toUpperCase() : key)
      .join(this.config.keyJoinString);
  }

  /**
   * @param obj
   * @returns {boolean}
   * @private
   */
  private isNullLike(obj: any): boolean {
    return _.isNull(obj) || _.isUndefined(obj);
  }
}
