// Smoke test for the published ESM entry. Run against an installed tarball to
// confirm the package loads and works on the target Node version.
import assert from 'node:assert/strict';
import deepKeyMirror, { deepKeyMirror as named } from 'deep-key-mirror';

assert.equal(typeof deepKeyMirror, 'function', 'default export must be a function');
assert.equal(typeof named, 'function', 'named export must be a function');
assert.deepEqual(deepKeyMirror({ name: null, age: null }), { name: 'name', age: 'age' });
assert.deepEqual(named(['apple', 'banana']), { apple: 'apple', banana: 'banana' });

console.log(`ESM smoke ok on Node ${process.version}`);
