# Deep Key Mirror

[![npm version](https://img.shields.io/npm/v/deep-key-mirror?style=flat-square&logo=npm&color=CB3837)](https://www.npmjs.com/package/deep-key-mirror)
[![npm downloads](https://img.shields.io/npm/dm/deep-key-mirror?style=flat-square&logo=npm&color=CB3837)](https://www.npmjs.com/package/deep-key-mirror)
[![CI](https://img.shields.io/github/actions/workflow/status/tkqubo/deep-key-mirror/build.yml?style=flat-square&logo=githubactions&logoColor=white&label=CI)](https://github.com/tkqubo/deep-key-mirror/actions/workflows/build.yml)
[![Bundle size](https://img.shields.io/bundlejs/size/deep-key-mirror?style=flat-square&label=minzip)](https://bundlejs.com/?q=deep-key-mirror)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/npm/l/deep-key-mirror?style=flat-square&color=blue)](./LICENSE)

Alternative to React's [keyMirror](https://github.com/STRML/keyMirror) which further mirrors properties deep inside the
object graph.

## Installation

```sh
npm install deep-key-mirror
```

## Usage

### `deepKeyMirror(obj)`

Returns a new object that has values equal to its property names in the given object.

#### Simple example

```ts
import deepKeyMirror from 'deep-key-mirror';

deepKeyMirror({ null: '', age: null }); // { name: 'name', age: 'age' }
```

If the given object has child arrays or objects, they are also "key-mirrored" recursively, with the `.`-concatenated
paths from the root object assigned to each of their value.

#### Nested example

```ts
import deepKeyMirror from 'deep-key-mirror';

const breakfast = {
  bread: null,
  beverage: {
    milk: null,
    coffee: null,
    beer: 'BEER!',
  },
  fruits: [{ name: 'orange' }, { name: 'apple' }],
};
const mirrored = deepKeyMirror(breakfast);
/*
mirrored === {
  bread: 'bread',
  beverage: {
    milk: 'beverage.milk',
    coffee: 'beverage.coffee',
    beer: 'beverage.beer'
  },
  fruits: [
    { name: 'fruits[0].name' },
    { name: 'fruits[1].name' },
  ]
}
*/
```

## TypeScript

TypeDoc-generated documentation is available [here](http://tkqubo.github.io/deep-key-mirror/)
