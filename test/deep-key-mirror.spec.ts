import {deepEqual} from 'power-assert';
import {deepKeyMirror} from '../src';
import 'jest';

// not an object nor an array
describe('deepKeyMirror', () => {
  describe('does not changes', () => {
    describe('primitives', () => {
      test('null', () => {
        deepEqual(null, deepKeyMirror(null));
      });

      test('undefined', () => {
        deepEqual(undefined, deepKeyMirror(undefined));
      });

      test('number', () => {
        deepEqual(1, deepKeyMirror(1));
      });

      test('bigint', () => {
        deepEqual(42n, deepKeyMirror(42n));
      });

      test('boolean', () => {
        deepEqual(true, deepKeyMirror(true));
      });

      test('string', () => {
        deepEqual('string', deepKeyMirror('string'));
      });

      test('symbol', () => {
        const symbol = Symbol('');
        deepEqual(symbol, deepKeyMirror(symbol));
      });
    });

    test('function', () => {
      const func = () => 3;
      deepEqual(func, deepKeyMirror(func));
    });

    test('empty object', () => {
      deepEqual(deepKeyMirror({}), {});
    });
  });

  describe('changes', () => {
    describe('an array', () => {
      it(`into an object that has properties whose names are taken from the array's value`, () => {
        const array = ['foo', 'bar', 24];
        const mirrored = deepKeyMirror(array);
        deepEqual(mirrored.foo, 'foo');
        deepEqual(mirrored.bar, 'bar');
        deepEqual(mirrored[24], '24');
      });
    });

    describe('a flat object', () => {
      it('into a dictionary object where the property name and its value are the same', () => {
        const symbol = Symbol('some-symbol');
        const obj = {
          null: null,
          undefined: undefined,
          string: 'string',
          boolean: true,
          number: 1,
          bigint: 42n,
          symbol: symbol,
        };
        const actual = deepKeyMirror(obj);
        deepEqual(actual.null, 'null');
        deepEqual(actual.undefined, 'undefined');
        deepEqual(actual.string, 'string');
        deepEqual(actual.boolean, 'boolean');
        deepEqual(actual.number, 'number');
        deepEqual(actual.bigint, 'bigint');
        deepEqual(actual.symbol, 'symbol');
      });
    });

    describe('a nested object', () => {
      it('path-concatenated prop name assigned to its value', () => {
        const breakfast = {
          bread: null,
          beverage: {
            milk: null,
            coffee: null,
          },
          fruits: ['orange', 'apple'],
        };
        const breakfastConfig = deepKeyMirror(breakfast);
        deepEqual(breakfastConfig.bread, 'bread');
        deepEqual(breakfastConfig.beverage.milk, 'beverage.milk');
        deepEqual(breakfastConfig.beverage.coffee, 'beverage.coffee');
        deepEqual(breakfastConfig.fruits.orange, 'fruits.orange');
        deepEqual(breakfastConfig.fruits.apple, 'fruits.apple');
        // @ts-expect-error property nonExistingProperty does not exist and won't compile
        deepKeyMirror(breakfastConfig.nonExistingProperty);
      });

      it('supplies path-concatenated prop name to its value', () => {
        const actual = deepKeyMirror({
                                       user: {
                                         created: null,
                                         updated: null,
                                         deleted: null,
                                       },
                                       status: ['start', 'stop'],
                                       other: {
                                         fixed: 'other_value',
                                         misc: {
                                           miscA: null,
                                           miscB: undefined,
                                           miscZ: 'Z',
                                         },
                                       },
                                     });
        const expected = {
          user: {
            created: 'user.created',
            updated: 'user.updated',
            deleted: 'user.deleted',
          },
          status: {
            start: 'status.start',
            stop: 'status.stop',
          },
          other: {
            fixed: 'other.fixed',
            misc: {
              miscA: 'other.misc.miscA',
              miscB: 'other.misc.miscB',
              miscZ: 'other.misc.miscZ',
            },
          },
        };
        deepEqual(actual, expected);
      });
    });
  });

  describe('with config', () => {
    const input = {
      value: 'some_value',
      nested: {
        value: 'other_value',
        yetNested: {
          value: null,
          array: ['a', 42],
        },
      },
    };
    describe('.retain', () => {
      it(`doesn't replace key when set to true`, () => {
        const expected = {
          value: 'some_value',
          nested: {
            value: 'nested.other_value',
            yetNested: {
              value: 'nested.yetNested.value',
              array: {
                a: 'nested.yetNested.array.a',
                '42': 42,
              },
            },
          },
        };
        const actual = deepKeyMirror(input, {retain: true});
        deepEqual(actual, expected);
      });

      it(`doesn't replace primitives other than null or undefined when set to true`, () => {
        const symbol = Symbol('some-symbol');
        const input = {
          null: null,
          undefined: undefined,
          string: 'string',
          boolean: true,
          number: 1,
          bigint: 42n,
          symbol: symbol,
        };
        const expected = {
          null: 'null',
          undefined: 'undefined',
          string: 'string',
          boolean: true,
          number: 1,
          bigint: 42n,
          symbol: symbol,
        };
        const actual = deepKeyMirror(input, {retain: true});
        deepEqual(actual, expected);
      });

      it('replace key when set to false', () => {
        const expected = {
          value: 'value',
          nested: {
            value: 'nested.value',
            yetNested: {
              value: 'nested.yetNested.value',
              array: {
                a: 'nested.yetNested.array.a',
                '42': 'nested.yetNested.array.42',
              },
            },
          },
        };
        const actual = deepKeyMirror(input, {retain: false});
        deepEqual(actual, expected);
      });
    });

    describe('.joinString', () => {
      it('join key path with "_" with set to "_"', () => {
        const expected = {
          value: 'value',
          nested: {
            value: 'nested_value',
            yetNested: {
              value: 'nested_yetNested_value',
              array: {
                a: 'nested_yetNested_array_a',
                '42': 'nested_yetNested_array_42',
              },
            },
          },
        };
        const actual = deepKeyMirror(input, {joinString: '_'});
        deepEqual(actual, expected);
      });
    });

    describe('.upperCase', () => {
      it('makes key upper case when set to true', () => {
        const expected = {
          value: 'VALUE',
          nested: {
            value: 'NESTED.VALUE',
            yetNested: {
              value: 'NESTED.YETNESTED.VALUE',
              array: {
                a: 'NESTED.YETNESTED.ARRAY.A',
                '42': 'NESTED.YETNESTED.ARRAY.42',
              },
            },
          },
        };
        const actual = deepKeyMirror(input, {upperCase: true});
        deepEqual(actual, expected);
      });
    });


    test('example in README.md', () => {
      const props = {
        color: {
          red: null,
          green: 42,
          blue: 'not_an_yellow',
          other: {
            brown: 'maroon',
            darkness: ['bright', 1, false],
          },
        },
      };

      deepEqual(
        deepKeyMirror(props, {retain: true}),
        {
          color: {
            red: 'color.red',
            green: 42,
            blue: 'color.not_an_yellow',
            other: {
              brown: 'color.other.maroon',
              darkness: {
                '1': 1,
                bright: 'color.other.darkness.bright',
                false: false
              }
            }
          }
        });

      deepEqual(
        deepKeyMirror(props, {joinString: '-'}),
        {
          color: {
            red: 'color-red',
            green: 'color-green',
            blue: 'color-blue',
            other: {
              brown: 'color-other-brown',
              darkness: {
                '1': 'color-other-darkness-1',
                bright: 'color-other-darkness-bright',
                false: 'color-other-darkness-false'
              }
            }
          }
        });

      deepEqual(
        deepKeyMirror(props, {upperCase: true}),
        {
          color: {
            red: 'COLOR.RED',
            green: 'COLOR.GREEN',
            blue: 'COLOR.BLUE',
            other: {
              brown: 'COLOR.OTHER.BROWN',
              darkness: {
                '1': 'COLOR.OTHER.DARKNESS.1',
                bright: 'COLOR.OTHER.DARKNESS.BRIGHT',
                false: 'COLOR.OTHER.DARKNESS.FALSE'
              }
            }
          }
        });
    });
  });
});


