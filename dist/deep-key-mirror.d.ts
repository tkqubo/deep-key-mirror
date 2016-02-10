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
export declare const DefaultConfig: Config;
/**
 * Constructs an enumeration with keys equal to their value.
 *
 * @param obj
 * @param config
 * @returns {any}
 */
export default function deepKeyMirror(obj: any, config?: Config): any;
/**
 * Creates an isomorphic and recursive key-value structure.
 *
 * @param keyMap
 * @param config
 * @returns {any}
 */
export declare function matrix(keyMap: string[][], config?: Config): any;
/** Class responsible for key mirror generation */
export declare class DeepKeyMirror {
    config: Config;
    constructor(config: Config);
    deepKeyMirror(obj: any): any;
    matrix(keyMap: string[][]): any;
    /**
     * @param obj
     * @param paths
     * @returns {any}
     * @private
     */
    private doDeepKeyMirror(obj, paths);
    /**
     * @param paths
     * @returns {any}
     * @private
     */
    private buildValue(paths);
    /**
     * @param obj
     * @returns {boolean}
     * @private
     */
    private isNullLike(obj);
}
