// Smoke test for the published CommonJS entry. Run against an installed tarball
// to confirm `require()` resolves on the target Node version.
const assert = require('node:assert/strict');
const mod = require('deep-key-mirror');

const deepKeyMirror = mod.default;
assert.equal(typeof deepKeyMirror, 'function', 'default export must be a function');
assert.equal(typeof mod.deepKeyMirror, 'function', 'named export must be a function');
assert.deepEqual(mod.deepKeyMirror({ name: null, age: null }), { name: 'name', age: 'age' });
assert.deepEqual(deepKeyMirror(['apple', 'banana']), { apple: 'apple', banana: 'banana' });

console.log(`CJS smoke ok on Node ${process.version}`);
