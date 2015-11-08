'use strict';

import assert from 'power-assert';
import { deepKeyMirror } from '../src/deep-key-mirror';

// not an object nor an array
describe('deepKeyMirror', () => {
  it('does nothing when null or undefined is passed as an argument', () => {
    let nv: any = null;
    assert(deepKeyMirror(nv) === null);
    let uv: any = undefined;
    assert(deepKeyMirror(uv) === undefined);
  });

  it('does nothing when an empty object is passed as an argument', () => {
    let obj = {};
    assert(deepKeyMirror(obj) === obj);
  });

  it('does nothing when a number is passed as an argument', () => {
    let num = 42;
    assert(deepKeyMirror(num) === num);
  });

  it('does nothing when a string is passed as an argument', () => {
    let str = 'foo';
    assert(deepKeyMirror(str) === str);
  });

  it('does nothing when a boolean is passed as an argument', () => {
    let bool = true;
    assert(deepKeyMirror(bool) === bool);
  });

  it('does nothing when a function is passed as an argument', () => {
    let func = () => 3;
    assert(deepKeyMirror(func) === func);
  });

  describe('with an array', () => {
    it('supplies mirrored object with its key taken from array element', () => {
      let array: (string|number)[] = ['foo', 'bar', 24];
      let mirrored = deepKeyMirror(array);
      assert(mirrored.foo === 'foo');
      assert(mirrored.bar === 'bar');
      assert(mirrored[24] === '24');
    });
  });

  describe('with a flat object', () => {
    it('supplies key name itself to its value', () => {
      let obj: any = { name: null, action: undefined };
      assert(deepKeyMirror(obj).name === 'name');
      assert(deepKeyMirror(obj).action === 'action');
    });
    it('does nothing when value is not null nor undefined', () => {
      let obj: any = { name: 'some name', action: null };
      assert(deepKeyMirror(obj).name === 'some name');
      assert(deepKeyMirror(obj).action === 'action');
    });
  });

  describe('with a nested object', () => {
    it('supplies path-concatenated prop name to its value', () => {
      let breakfast: any = {
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
      let breakfastConfig = deepKeyMirror(breakfast);
      assert(breakfastConfig.bread === 'bread');
      assert(breakfastConfig.beverage.milk === 'beverage.milk');
      assert(breakfastConfig.beverage.coffee === 'beverage.coffee');
      assert(breakfastConfig.fruits.orange === 'fruits.orange');
      assert(breakfastConfig.fruits.apple === 'fruits.apple');
    });
    it('supplies path-concatenated prop name to its value', () => {
      let actual = deepKeyMirror({
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
      let expected: any = {
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
          fixed: 'FIXED_VALUE',
          misc: {
            miscA: 'other.misc.miscA',
            miscB: 'other.misc.miscB',
            miscZ: 'Z'
          }
        }
      };
      assert.deepEqual(actual, expected);
    });
  });
});
