# Deep Key Mirror

[![npm version](https://badge.fury.io/js/deep-key-mirror.svg)](http://badge.fury.io/js/deep-key-mirror)
[![License](http://img.shields.io/:license-mit-blue.svg)](http://doge.mit-license.org)
[![CI](https://github.com/tkqubo/deep-key-mirror/actions/workflows/build.yml/badge.svg)](https://github.com/tkqubo/deep-key-mirror/actions/workflows/build.yml)

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
