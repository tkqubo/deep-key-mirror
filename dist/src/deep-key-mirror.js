"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const deep_key_mirror_generator_1 = require("./deep-key-mirror-generator");
const model_1 = require("./model");
/**
 * Constructs an enumeration with keys equal to their value.
 *
 * @param obj
 * @param config
 * @returns {any}
 */
function deepKeyMirror(obj, config) {
    return new deep_key_mirror_generator_1.DeepKeyMirrorGenerator({ ...model_1.defaultConfig, ...config }).deepKeyMirror(obj);
}
exports.default = deepKeyMirror;
