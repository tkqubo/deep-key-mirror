"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deepKeyMirror = void 0;
const model_1 = require("./model");
const utils_1 = require("./utils");
/**
 * Constructs an enumeration with keys equal to their value.
 *
 * @param obj
 * @param config
 * @returns {any}
 */
function deepKeyMirror(obj, config) {
    return doDeepKeyMirror(obj, [], { ...model_1.defaultConfig, ...config });
}
exports.deepKeyMirror = deepKeyMirror;
function doDeepKeyMirror(obj, paths, config) {
    if (!(0, utils_1.isDefined)(obj) || (0, utils_1.isFunction)(obj)) {
        return obj;
    }
    if (typeof obj === 'string' && config.retain) {
        return joinPaths(paths.slice(0, -1).concat(obj), config);
    }
    if ((0, utils_1.isPrimitive)(obj)) {
        if (config.retain || paths.length === 0) {
            return obj;
        }
        else {
            return joinPaths(paths, config);
        }
    }
    if (obj instanceof Array) {
        return obj.reduce((prev, curr) => ({ ...prev, [curr]: joinPaths(paths.concat(String(curr)), config) }), {});
    }
    // object
    return Object.entries(obj).reduce((prev, [prop, value]) => ({
        ...prev,
        [prop]: (0, utils_1.isDefined)(value)
            ? doDeepKeyMirror(value, paths.concat(prop), config)
            : joinPaths(paths.concat(prop), config),
    }), {});
}
function joinPaths(paths, config) {
    return paths.map(key => (config.upperCase ? key.toUpperCase() : key)).join(config.joinString);
}
