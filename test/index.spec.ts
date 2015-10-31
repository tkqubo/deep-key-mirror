'use strict';
import assert from 'power-assert';
import { deepKeyMirror } from '../src/index';

// not an object nor an array
describe('deepKeyMirror', () => {
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
});
