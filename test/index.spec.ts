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
  describe('with an object which should be processed', () => {
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

  describe('with an array', () => {
    it('supplies mirrored object with its key taken from array element', () => {
      let array: (string|number)[] = ['foo', 'bar', 24];
      let mirrored = deepKeyMirror(array);
      assert(mirrored.foo === 'foo');
      assert(mirrored.bar === 'bar');
      assert(mirrored[24] === '24');
    });
  });
});
