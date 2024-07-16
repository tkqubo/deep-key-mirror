"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deepKeyMirror = deepKeyMirror;
/**
 * Constructs an enumeration with keys equal to their value.
 *
 * @param obj
 * @returns {any}
 */
function deepKeyMirror(obj) {
    return doDeepKeyMirror(obj, []);
}
function doDeepKeyMirror(obj, paths) {
    if (obj == null || typeof obj === 'string') {
        return paths.join('.');
    }
    if (obj instanceof Array) {
        const indexer = (i) => paths.length ? paths.slice(0, paths.length - 1).concat([`${paths.slice(-1)[0]}[${i}]`]) : [];
        return obj.map((value, i) => doDeepKeyMirror(value, indexer(i)));
    }
    // object
    return Object.entries(obj).reduce((prev, [prop, value]) => ({
        ...prev,
        [prop]: value != null ? doDeepKeyMirror(value, paths.concat(prop)) : paths.concat(prop).join('.'),
    }), {});
}
