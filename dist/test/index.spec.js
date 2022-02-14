"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const power_assert_1 = __importStar(require("power-assert"));
const src_1 = __importStar(require("../src"));
require("jest");
// not an object nor an array
describe('deepKeyMirror', () => {
    it('does nothing when null or undefined is passed as an argument', () => {
        const nv = null;
        (0, power_assert_1.default)((0, src_1.default)(nv) === null);
        const uv = undefined;
        (0, power_assert_1.default)((0, src_1.default)(uv) === undefined);
    });
    it('does nothing when an empty object is passed as an argument', () => {
        const obj = {};
        (0, power_assert_1.default)((0, src_1.default)(obj) === obj);
    });
    it('does nothing when a number is passed as an argument', () => {
        const num = 42;
        (0, power_assert_1.default)((0, src_1.default)(num) === num);
    });
    it('does nothing when a string is passed as an argument', () => {
        const str = 'foo';
        (0, power_assert_1.equal)((0, src_1.default)(str), str);
    });
    it('does nothing when a boolean is passed as an argument', () => {
        const bool = true;
        (0, power_assert_1.default)((0, src_1.default)(bool) === bool);
    });
    it('does nothing when a function is passed as an argument', () => {
        const func = () => 3;
        (0, power_assert_1.default)((0, src_1.default)(func) === func);
    });
    describe('with an array', () => {
        it('supplies mirrored object with its key taken from array element', () => {
            const array = ['foo', 'bar', 24];
            const mirrored = (0, src_1.default)(array);
            (0, power_assert_1.default)(mirrored.foo === 'foo');
            (0, power_assert_1.default)(mirrored.bar === 'bar');
            (0, power_assert_1.default)(mirrored[24] === '24');
        });
    });
    describe('with a flat object', () => {
        it('supplies key name itself to its value', () => {
            const obj = { name: null, action: undefined };
            (0, power_assert_1.default)((0, src_1.default)(obj).name === 'name');
            (0, power_assert_1.default)((0, src_1.default)(obj).action === 'action');
        });
        it('does nothing when value is not null nor undefined', () => {
            const obj = { name: 'some name', action: null };
            (0, power_assert_1.default)((0, src_1.default)(obj).name === 'some name');
            (0, power_assert_1.default)((0, src_1.default)(obj).action === 'action');
        });
    });
    describe('with a nested object', () => {
        it('supplies path-concatenated prop name to its value', () => {
            const breakfast = {
                bread: null,
                beverage: {
                    milk: null,
                    coffee: null
                },
                fruits: [
                    'orange',
                    'apple'
                ]
            };
            const breakfastConfig = (0, src_1.default)(breakfast);
            (0, power_assert_1.default)(breakfastConfig.bread === 'bread');
            (0, power_assert_1.default)(breakfastConfig.beverage.milk === 'beverage.milk');
            (0, power_assert_1.default)(breakfastConfig.beverage.coffee === 'beverage.coffee');
            (0, power_assert_1.default)(breakfastConfig.fruits.orange === 'fruits.orange');
            (0, power_assert_1.default)(breakfastConfig.fruits.apple === 'fruits.apple');
        });
        it('supplies path-concatenated prop name to its value', () => {
            const actual = (0, src_1.default)({
                user: {
                    created: null,
                    updated: null,
                    deleted: null
                },
                status: [
                    'start', 'stop'
                ],
                other: {
                    fixed: 'FIXED_VALUE',
                    misc: {
                        miscA: null,
                        miscB: undefined,
                        miscZ: 'Z'
                    }
                }
            });
            const expected = {
                user: {
                    created: 'user.created',
                    updated: 'user.updated',
                    deleted: 'user.deleted'
                },
                status: {
                    start: 'status.start',
                    stop: 'status.stop'
                },
                other: {
                    fixed: 'other.FIXED_VALUE',
                    misc: {
                        miscA: 'other.misc.miscA',
                        miscB: 'other.misc.miscB',
                        miscZ: 'other.misc.Z'
                    }
                }
            };
            (0, power_assert_1.deepEqual)(actual, expected);
        });
    });
});
describe('matrix', () => {
    it('doesn\'t process null nor undefined', () => {
        (0, power_assert_1.equal)((0, src_1.matrix)(null), null);
        (0, power_assert_1.equal)((0, src_1.matrix)(undefined), null);
    });
    it('processes 1 string array', () => {
        (0, power_assert_1.deepEqual)((0, src_1.matrix)([['apple', 'orange', 'grape']]), {
            apple: 'apple',
            orange: 'orange',
            grape: 'grape'
        });
    });
    it('processes 2 string array', () => {
        const actual = (0, src_1.matrix)([
            ['company', 'individual'],
            ['engineer', 'designer', 'manager']
        ]);
        const expected = {
            company: {
                engineer: 'company.engineer',
                designer: 'company.designer',
                manager: 'company.manager'
            },
            individual: {
                engineer: 'individual.engineer',
                designer: 'individual.designer',
                manager: 'individual.manager'
            }
        };
        (0, power_assert_1.deepEqual)(actual, expected);
    });
    it('processes action names of async operation', () => {
        const actual = (0, src_1.matrix)([
            ['user', 'team', 'group'],
            ['get', 'getList', 'post', 'put', 'delete'],
            ['request', 'success', 'failure']
        ], { keyJoinString: '_', makeUpperCase: true });
        (0, power_assert_1.equal)(actual.user.get.request, 'USER_GET_REQUEST');
        (0, power_assert_1.equal)(actual.user.delete.success, 'USER_DELETE_SUCCESS');
        (0, power_assert_1.equal)(actual.team.post.request, 'TEAM_POST_REQUEST');
        (0, power_assert_1.equal)(actual.team.getList.request, 'TEAM_GETLIST_REQUEST');
        (0, power_assert_1.equal)(actual.group.put.failure, 'GROUP_PUT_FAILURE');
    });
});
describe('Config', () => {
    describe('.prependKeyPath', () => {
        it('doesn\'t prepend key path whtn set to false', () => {
            const expected = {
                value: 'const',
                nested: {
                    value: 'nested_const',
                    yetNested: {
                        value: 'yetNested_const'
                    }
                }
            };
            const actual = (0, src_1.default)(expected, { prependKeyPath: false });
            (0, power_assert_1.deepEqual)(actual, expected);
        });
        it('prepends key path when set to true', () => {
            const expected = {
                value: 'const',
                nested: {
                    value: 'nested.nested_const',
                    yetNested: {
                        value: 'nested.yetNested.yetNested_const'
                    }
                }
            };
            const actual = (0, src_1.default)({
                value: 'const',
                nested: {
                    value: 'nested_const',
                    yetNested: {
                        value: 'yetNested_const'
                    }
                }
            }, { prependKeyPath: true });
            (0, power_assert_1.deepEqual)(actual, expected);
        });
    });
    describe('.keyJoinString', () => {
        it('join key path with "_" with set to "_"', () => {
            const expected = {
                value: 'const',
                nested: {
                    value: 'nested_nested_const',
                    yetNested: {
                        value: 'nested_yetNested_yetNested_const'
                    }
                }
            };
            const actual = (0, src_1.default)({
                value: 'const',
                nested: {
                    value: 'nested_const',
                    yetNested: {
                        value: 'yetNested_const'
                    }
                }
            }, { keyJoinString: '_' });
            (0, power_assert_1.deepEqual)(actual, expected);
        });
    });
    describe('.makeUpperCase', () => {
        it('makes key upper case when set to true', () => {
            const expected = {
                value: 'CONST',
                nested: {
                    value: 'NESTED.NESTED_CONST',
                    yetNested: {
                        value: 'NESTED.YETNESTED.YETNESTED_CONST'
                    }
                }
            };
            const actual = (0, src_1.default)({
                value: 'const',
                nested: {
                    value: 'nested_const',
                    yetNested: {
                        value: 'yetNested_const'
                    }
                }
            }, { makeUpperCase: true });
            (0, power_assert_1.deepEqual)(actual, expected);
        });
    });
});
