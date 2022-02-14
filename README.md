# Deep Key Mirror

[![npm version](https://badge.fury.io/js/deep-key-mirror.svg)](http://badge.fury.io/js/deep-key-mirror)
[![License](http://img.shields.io/:license-mit-blue.svg)](http://doge.mit-license.org)

Alternative to React's [keyMirror](https://github.com/STRML/keyMirror) which further mirrors properties deep inside the
object graph.

## Installation

```sh
npm install deep-key-mirror
```

## Usage

### 1. `deepKeyMirror(obj, [config])`

Returns a new object that has values equal to its property names in the given object.

#### Simple example

```ts
import deepKeyMirror from 'deep-key-mirror';

deepKeyMirror({null: '', age: null}); // { name: 'name', age: 'age' }
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
  fruits: ['orange', 'apple'],
};
const breakfastConfig = deepKeyMirror(breakfast);
/*
breakfastConfig === {
  bread: 'bread',
  beverage: {
   milk: 'beverage.milk',
   coffee: 'beverage.coffee',
   beer: 'beverage.BEER!'
  },
  fruits: {
    orange: 'fruits.orange',
    apple: 'fruits.apple'
  }
}
*/
```

### 2. `matrix(string[][], [config])`

Converts an two-dimensional dimensional array into an object with an isomorphic key-value structure.

#### Example

```js
const restApi = matrix([
    ['user', 'team', 'group'],
    ['get', 'getList', 'post', 'put', 'delete'],
    ['request', 'success', 'failure'],
]);
/*
 restApi === {
   user: {
     get:     { request: 'user.get.request',      success: 'user.get.success',      failure: 'user.get.failure' },
     getList: { request: 'user.getList.request',  success: 'user.getList.success',  failure: 'user.getList.failure' },
     post:    { request: 'user.post.request',     success: 'user.post.success',     failure: 'user.post.failure' },
     put:     { request: 'user.put.request',      success: 'user.put.success',      failure: 'user.put.failure' },
     delete:  { request: 'user.delete.request',   success: 'user.delete.success',   failure: 'user.delete.failure' },
   },
   team: {
     get:     { request: 'team.get.request',      success: 'team.get.success',      failure: 'team.get.failure' },
     getList: { request: 'team.getList.request',  success: 'team.getList.success',  failure: 'team.getList.failure' },
     post:    { request: 'team.post.request',     success: 'team.post.success',     failure: 'team.post.failure' },
     put:     { request: 'team.put.request',      success: 'team.put.success',      failure: 'team.put.failure' },
     delete:  { request: 'team.delete.request',   success: 'team.delete.success',   failure: 'team.delete.failure' },
   },
   group: {
     get:     { request: 'group.get.request',     success: 'group.get.success',     failure: 'group.get.failure' },
     getList: { request: 'group.getList.request', success: 'group.getList.success', failure: 'group.getList.failure' },
     post:    { request: 'group.post.request',    success: 'group.post.success',    failure: 'group.post.failure' },
     put:     { request: 'group.put.request',     success: 'group.put.success',     failure: 'group.put.failure' },
     delete:  { request: 'group.delete.request',  success: 'group.delete.success',  failure: 'group.delete.failure' },
   }
 }
 */
```

### `config`

Both `deepKeyMirror` and `matrix` can take `config` object as a second argument, which has these three options

| prop         | type    | default | description                                                                         |
| :----------- | :------ | :------ |:------------------------------------------------------------------------------------|
| `retain`     | boolean | false   | When set to `true`, primitive values other than `null` or `undefined` won't be replaced |
| `joinString` | string  | `'.'`   | Separator for joining object paths.                                                 |
| `upperCase`  | boolean | false   | When set to `true`, values will be mirrored with uppercase.                         |

#### examples

```js
const props = {
    color: {
        red: null,
        green: null,
        blue: 'not_an_yellow',
        other: {
            brown: 'maroon',
        },
    },
};

const propConfig = deepKeyMirror(props, {prependKeyPath: true});
/*
propConfig = {
  color: {
    red: 'color.red',
    green: 'color.green',
    blue: 'color.not_an_yellow',
    other: {
      brown: 'color.other.maroon'
    }
  }
};
*/

const propConfig = deepKeyMirror(props, {prependKeyPath: false});
/*
propConfig = {
  color: {
    red: 'color.red',
    green: 'color.green',
    blue: 'not_an_yellow',
    other: {
      brown: 'maroon'
    }
  }
};
*/

const propConfig = deepKeyMirror(props, {keyJoinString: '-'});
/*
propConfig = {
  color: {
    red: 'color-red',
    green: 'color-green',
    blue: 'color-not_an_yellow',
    other: {
      brown: 'color-other-maroon'
    }
  }
};
*/

const propConfig = deepKeyMirror(props, {makeUpperCase: true});
/*
propConfig = {
  color: {
    red: 'COLOR.RED',
    green: 'COLOR.GREEN',
    blue: 'COLOR.NOT_AN_YELLOW',
    other: {
      brown: 'COLOR.OTHER.MAROON'
    }
  }
};
*/
```

## TypeScript

TypeDoc-generated documentation is available [here](http://tkqubo.github.io/deep-key-mirror/)
