"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeepKeyMirror = exports.matrix = exports.DefaultConfig = void 0;
const lodash_1 = __importDefault(require("lodash"));
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
exports.DefaultConfig = {
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
function deepKeyMirror(obj, config) {
    'use strict';
    return new DeepKeyMirror(lodash_1.default.assign({}, exports.DefaultConfig, config)).deepKeyMirror(obj);
}
exports.default = deepKeyMirror;
/**
 * Creates an isomorphic and recursive key-value structure.
 *
 * @param keyMap
 * @param config
 * @returns {any}
 */
function matrix(keyMap, config) {
    return new DeepKeyMirror(lodash_1.default.assign({}, exports.DefaultConfig, config)).matrix(keyMap);
}
exports.matrix = matrix;
/** Class responsible for key mirror generation */
class DeepKeyMirror {
    config;
    constructor(config) {
        this.config = config;
    }
    deepKeyMirror(obj) {
        return this.doDeepKeyMirror(obj, []);
    }
    matrix(keyMap) {
        if (!this.isDefined(keyMap)) {
            return keyMap;
        }
        let matrix = null;
        while (keyMap.length) {
            const keys = keyMap.pop();
            if (!matrix) {
                matrix = keys;
            }
            else {
                matrix = lodash_1.default.reduce(keys, (obj, prop) => Object.defineProperty(obj, prop, {
                    value: lodash_1.default.isArray(matrix) ? lodash_1.default.assign([], matrix) : lodash_1.default.assign({}, matrix),
                    enumerable: true,
                    writable: true,
                    configurable: true
                }), {});
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
    doDeepKeyMirror(obj, paths) {
        if (!this.isDefined(obj)) {
            return obj;
        }
        if (['boolean', 'number', 'function'].indexOf(typeof obj) !== -1) {
            return obj;
        }
        if (lodash_1.default.isString(obj)) {
            if (this.config.prependKeyPath) {
                const parentPaths = lodash_1.default.dropRight(paths, 1);
                return this.buildValue(parentPaths.concat(obj));
            }
            else {
                return obj;
            }
        }
        if (obj instanceof Array) {
            // todo: reject an item that is not the type `string` nor `number`
            return lodash_1.default.reduce(obj, (mirrored, prop) => Object.defineProperty(mirrored, prop, {
                value: this.buildValue(paths.concat(prop.toString())),
                enumerable: true,
                writable: true,
                configurable: true
            }), {});
        }
        const properties = Object
            .keys(obj)
            .filter((prop) => prop in obj);
        if (properties.length === 0) {
            return obj;
        }
        obj = lodash_1.default.assign({}, obj);
        const [emptyProps, nonEmptyProps] = lodash_1.default.partition(properties, (prop) => !this.isDefined(obj[prop]));
        // assign prop name if its value is null or undefined
        emptyProps
            .forEach((prop) => obj[prop] = this.buildValue(paths.concat(prop)));
        // assign recursively prop if its value is not null nor undefined
        nonEmptyProps
            .forEach((prop) => obj[prop] = this.doDeepKeyMirror(obj[prop], paths.concat(prop)));
        return obj;
    }
    /**
     * @param paths
     * @returns {any}
     * @private
     */
    buildValue(paths) {
        return paths
            .map(key => this.config.makeUpperCase ? key.toUpperCase() : key)
            .join(this.config.keyJoinString);
    }
    isDefined(value) {
        return value !== null && value !== undefined;
    }
}
exports.DeepKeyMirror = DeepKeyMirror;
