import { Config, defaultConfig, Mirrored } from './model';
import { isDefined, isFunction, isPrimitive } from './utils';

/**
 * Constructs an enumeration with keys equal to their value.
 *
 * @param obj
 * @param config
 * @returns {any}
 */
export function deepKeyMirror<T>(obj: T, config?: Config): Mirrored<T> {
  return doDeepKeyMirror(obj, [], { ...defaultConfig, ...config });
}

function doDeepKeyMirror(obj: any, paths: string[], config: Config): any {
  if (!isDefined(obj) || isFunction(obj)) {
    return obj;
  }

  if (typeof obj === 'string' && config.retain) {
    return joinPaths(paths.slice(0, -1).concat(obj), config);
  }

  if (isPrimitive(obj)) {
    if (config.retain || paths.length === 0) {
      return obj;
    } else {
      return joinPaths(paths, config);
    }
  }

  if (obj instanceof Array) {
    return obj.reduce(
      (prev, curr) => ({ ...prev, [curr]: doDeepKeyMirror(curr, paths.concat(String(curr)), config) }),
      {} as object,
    );
  }

  // object
  return Object.entries(obj).reduce(
    (prev, [prop, value]) => ({
      ...prev,
      [prop]: isDefined(value)
        ? doDeepKeyMirror(value, paths.concat(prop), config)
        : joinPaths(paths.concat(prop), config),
    }),
    {} as object,
  );
}

function joinPaths(paths: string[], config: Config): string {
  return paths.map(key => (config.upperCase ? key.toUpperCase() : key)).join(config.joinString);
}
