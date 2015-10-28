'use strict';
import assert from 'power-assert';
import { deepKeyMirror } from '../src/index';

// not an object nor an array
{
  let obj = {};
  assert(deepKeyMirror(obj) === obj);
  let num = 42;
  assert(deepKeyMirror(num) === num);
  let str = 'foo';
  assert(deepKeyMirror(str) === str);
  let bool = true;
  assert(deepKeyMirror(bool) === bool);
  let func = () => 3;
  assert(deepKeyMirror(func) === func);
}
