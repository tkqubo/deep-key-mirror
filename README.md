# Deep Key Mirror
[![npm version](https://badge.fury.io/js/deep-key-mirror.svg)](http://badge.fury.io/js/deep-key-mirror)
[![Build Status](https://travis-ci.org/tkqubo/deep-key-mirror.svg?branch=master)](https://travis-ci.org/tkqubo/deep-key-mirror)
![David](https://david-dm.org/tkqubo/deep-key-mirror.svg)
[![Test Coverage](https://codeclimate.com/github/tkqubo/deep-key-mirror/badges/coverage.svg)](https://codeclimate.com/github/tkqubo/deep-key-mirror/coverage)
[![Code Climate](https://codeclimate.com/github/tkqubo/deep-key-mirror/badges/gpa.svg)](https://codeclimate.com/github/tkqubo/deep-key-mirror)
[![License](http://img.shields.io/:license-mit-blue.svg)](http://doge.mit-license.org)

Alternative to React's keyMirror 

## Installation

```sh
npm install deep-key-mirror
```

## Usage

### `deepKeyMirror(any, [config])`

Constructs an enumeration with keys equal to their value.

If the given object has child arrays or objects, they are also "key-mirrored" recursively,
with the `'.'`-concatenated paths from the root object assigned to each of their value.
 
#### example

```js
let breakfast = {
  bread: null,
  beverage: {
    milk: null,
    coffee: null,
    beer: "BEER!"
  },
  fruits: [
    'orange',
    'apple'
  ]
};
let breakfastConfig = deepKeyMirror(breakfast);
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

### `matrix(string[][], [config])`

Creates an isomorphic and recursive key-value structure.
Consider the Redux scenario below:
 
You have a RESTful API with the following specification:

- The API can manipulate 3 types of resources; `user`, `team` and `group`
- Each of them can be manipulated by these operations; `GET`, `POST`, `PUT`, and `DELETE`  
  e.g. for `user` resource manipulation, there are totally 5 API endpoints:
  - `POST /users` to create a user
  - `GET /users` to retrieve a user list
  - `GET /users/:id` to retrieve a specified user
  - `PUT /users/:id` to update a specified user
  - `DELETE /users/:id` to delete a specified user
- In order to represent asynchronous API calls in Redux, there are 3 action types per each endpoint.
  - `request` action: happens when api call has been fired
  - `success` action: happens when api call has been completed with success
  - `failure` action: happens when api call has been completed with failure

To create all of action types to meet the requirements above, you can simply write as follows:

#### example

```js
let restApi = matrix([
  ['user', 'team', 'group'],
  ['get', 'getList', 'post', 'put', 'delete'],
  [ 'request', 'success', 'failure' ]
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
 
// actions/getTeam.js
let restApi = ...;
let { request, success, failure } = restApi.team.get;

// get team
export default id => dispatch => {
  dispatch({
    type: request,
    payload: { id }
  });
  teamService
    .getTeamById(id)
    .then((team) =>
      dispatch({
        type: success,
        payload: { team }
      })
    , (failure) =>
      dispatch({
        type: failure,
        error: true,
        payload: { failure }
      })
    );
};
```

### `config`

Both `deepKeyMirror` and `matrix` can take `config` object as a second argument, which has these three options

| prop             | type    | default | description                                                                                                                                                           |
|:-----------------|:--------|:--------|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `prependKeyPath` | boolean | true    | When set to `true` and if `deepKeyMirror` find a string value during object traversal, it uses the string prepended by concatenated object path as its mirrored path. |
| `keyJoinString`  | string  | `'.'`   | Separator for joining object paths.                                                                                                                                   |
| `makeUpperCase`  | boolean | false   | When set to `true`, values will be mirrored with uppercase.                                                                                                           |

#### examples

```js
let props = {
  color: {
    red: null,
    green: null,
    blue: 'not_an_yellow',
    other: {
      brown: 'maroon'
    }
  }
};

let propConfig = deepKeyMirror(props, { prependKeyPath: true });
/*
props = {
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

let propConfig = deepKeyMirror(props, { prependKeyPath: false });
/*
props = {
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

let propConfig = deepKeyMirror(props, { keyJoinString: '-' });
/*
props = {
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

let propConfig = deepKeyMirror(props, { makeUpperCase: true });
/*
props = {
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
