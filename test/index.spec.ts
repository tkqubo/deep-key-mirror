import assert, {deepEqual, equal} from 'power-assert';
import deepKeyMirror, {matrix} from '../src';
import 'jest';

// not an object nor an array
describe('deepKeyMirror', () => {
  it('does nothing when null or undefined is passed as an argument', () => {
    const nv = null;
    assert(deepKeyMirror(nv) === null);
    const uv = undefined;
    assert(deepKeyMirror(uv) === undefined);
  });

  it('does nothing when an empty object is passed as an argument', () => {
    const obj = {};
    assert(deepKeyMirror(obj) === obj);
  });

  it('does nothing when a number is passed as an argument', () => {
    const num = 42;
    assert(deepKeyMirror(num) === num);
  });

  it('does nothing when a string is passed as an argument', () => {
    const str = 'foo';
    equal(deepKeyMirror(str), str);
  });

  it('does nothing when a boolean is passed as an argument', () => {
    const bool = true;
    assert(deepKeyMirror(bool) === bool);
  });

  it('does nothing when a function is passed as an argument', () => {
    const func = () => 3;
    assert(deepKeyMirror(func) === func);
  });

  describe('with an array', () => {
    it('supplies mirrored object with its key taken from array element', () => {
      const array = ['foo', 'bar', 24];
      const mirrored = deepKeyMirror(array);
      assert(mirrored.foo === 'foo');
      assert(mirrored.bar === 'bar');
      assert(mirrored[24] === '24');
    });
  });

  describe('with a flat object', () => {
    it('supplies key name itself to its value', () => {
      const obj = {name: null, action: undefined};
      assert(deepKeyMirror(obj).name === 'name');
      assert(deepKeyMirror(obj).action === 'action');
    });
    it('does nothing when value is not null nor undefined', () => {
      const obj = {name: 'some name', action: null};
      assert(deepKeyMirror(obj).name === 'some name');
      assert(deepKeyMirror(obj).action === 'action');
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
      const breakfastConfig = deepKeyMirror(breakfast);
      assert(breakfastConfig.bread === 'bread');
      assert(breakfastConfig.beverage.milk === 'beverage.milk');
      assert(breakfastConfig.beverage.coffee === 'beverage.coffee');
      assert(breakfastConfig.fruits.orange === 'fruits.orange');
      assert(breakfastConfig.fruits.apple === 'fruits.apple');
    });
    it('supplies path-concatenated prop name to its value', () => {
      const actual = deepKeyMirror({
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
      deepEqual(actual, expected);
    });
  });
});

describe('matrix', () => {
  it('doesn\'t process null nor undefined', () => {
    equal(matrix(null), null);
    equal(matrix(undefined), null);
  });
  it('processes 1 string array', () => {
    deepEqual(matrix([['apple', 'orange', 'grape']]), {
      apple: 'apple',
      orange: 'orange',
      grape: 'grape'
    });
  });
  it('processes 2 string array', () => {
    const actual = matrix(
      [
        ['company', 'individual'],
        ['engineer', 'designer', 'manager']
      ]
    );
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
    deepEqual(actual, expected);
  });
  it('processes action names of async operation', () => {
    const actual = matrix(
      [
        ['user', 'team', 'group'],
        ['get', 'getList', 'post', 'put', 'delete'],
        ['request', 'success', 'failure']
      ],
      {keyJoinString: '_', makeUpperCase: true}
    );
    equal(actual.user.get.request, 'USER_GET_REQUEST');
    equal(actual.user.delete.success, 'USER_DELETE_SUCCESS');
    equal(actual.team.post.request, 'TEAM_POST_REQUEST');
    equal(actual.team.getList.request, 'TEAM_GETLIST_REQUEST');
    equal(actual.group.put.failure, 'GROUP_PUT_FAILURE');
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
      const actual = deepKeyMirror(expected, {prependKeyPath: false});
      deepEqual(actual, expected);
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
      const actual = deepKeyMirror(
        {
          value: 'const',
          nested: {
            value: 'nested_const',
            yetNested: {
              value: 'yetNested_const'
            }
          }
        },
        {prependKeyPath: true});
      deepEqual(actual, expected);
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
      const actual = deepKeyMirror(
        {
          value: 'const',
          nested: {
            value: 'nested_const',
            yetNested: {
              value: 'yetNested_const'
            }
          }
        },
        {keyJoinString: '_'});
      deepEqual(actual, expected);
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
      const actual = deepKeyMirror(
        {
          value: 'const',
          nested: {
            value: 'nested_const',
            yetNested: {
              value: 'yetNested_const'
            }
          }
        },
        {makeUpperCase: true});
      deepEqual(actual, expected);
    });
  });
});
