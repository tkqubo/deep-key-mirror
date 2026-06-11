# Deep Key Mirror

[![npm version](https://img.shields.io/npm/v/deep-key-mirror?style=flat-square&logo=npm&color=CB3837)](https://www.npmjs.com/package/deep-key-mirror)
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

Returns a new object whose values equal the `.`-joined property paths in the given object.

#### Simple example

```ts
import deepKeyMirror from 'deep-key-mirror';

deepKeyMirror({ name: null, age: null }); // { name: 'name', age: 'age' }
```

#### String arrays

A **string array** is mirrored into an object keyed by its elements:

```ts
deepKeyMirror(['apple', 'banana', 'grape']);
// { apple: 'apple', banana: 'banana', grape: 'grape' }
```

#### Nested example

Child objects and string arrays are mirrored recursively, with the `.`-joined paths from the root assigned to each
value. (An array containing **objects** keeps the index-path behaviour instead, e.g. `items[0].name`.)

```ts
import deepKeyMirror from 'deep-key-mirror';

const breakfast = {
  bread: null,
  beverage: {
    milk: null,
    coffee: null,
    beer: 'BEER!',
  },
  fruits: ['orange', 'apple'],
};
const mirrored = deepKeyMirror(breakfast);
/*
mirrored === {
  bread: 'bread',
  beverage: {
    milk: 'beverage.milk',
    coffee: 'beverage.coffee',
    beer: 'beverage.beer',
  },
  fruits: {
    orange: 'fruits.orange',
    apple: 'fruits.apple',
  },
}
*/
```

#### Literal types

The return type is inferred as **literal types** when the argument is an inline literal (or annotated `as const`):

```ts
const keys = deepKeyMirror(['apple', 'banana']);
//    ^? { apple: 'apple'; banana: 'banana' }
```

When you pass a pre-declared variable, its array elements widen to `string[]`, so use an inline literal or `as const`
to retain literal keys.

## TypeScript

TypeDoc-generated documentation is available [here](http://tkqubo.github.io/deep-key-mirror/)
