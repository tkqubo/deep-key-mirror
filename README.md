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

```js
let breakfast = {
  bread: null,
  beverage: {
    milk: null,
    coffee: null
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
  },
  fruits: {
    orange: 'fruits.orange',
    apple: 'fruits.apple'
  }
}
*/
```