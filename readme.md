[![Build Status](https://travis-ci.org/behrendtio/jbuilder.png?branch=master)](https://travis-ci.org/behrendtio/jbuilder)

# Jbuilder for Node.js

## Purpose

Tiny WIP node.js port of rails' jbuilder.

## Installation

```bash
$ npm i jbuilder
```

## Usage

```javascript
var jbuilder = require('jbuilder');

var user = {
  admin: true,
  name: 'Foo',
  profile: {
    imagePath: '/0815.jpg',

    chuck: {
      name: 'Norris'
    }
  }
};

var product = {
  price: 12.99,
  weight: '1kg',
  name: 'Awesome thing',
  currency: 'Euro',
  available: true
};

var output = jbuilder.create(function(json) {
  // Set values
  json.set('name', user.name);

  // Conditions
  if (user.admin) {
    json.set('secretLink', 'http://...');
  }

  // Set second level values
  json.set('profile', function(json) {
    json.set('imagePath', user.profile.imagePath);

    // Set third level values
    json.set('chuck', function(json) {
      json.set('name', user.profile.chuck.name);
    });
  });

  // Ignore falsy values
  json.set('admin', false); // Present
  json.ignoreFalsy = true;

  var value = false;
  json.set('value', value); // Not present

  // Extract values of object
  json.set('product', function(json) {
    json.extract(product, 'price', 'name', 'weight');
  });

  // Extract values of array
  json.set('product', function(json) {
    json.extract([product, product], 'price', 'name', 'weight');
  });

  // Turns object into array
  json.set('orders', function(json) {
    json.child(function(json) {
      json.set('id', 1);
    });
    json.child(function(json) {
      json.set('id', 2);
    });
  });
})

console.log(output.target());
// {"name":"Foo","secretLink":"http://...","profile":{"imagePath":"/0815.jpg","chuck":{"name":"Norris"}},"admin":false,"product":[{"price":12.99,"name":"Awesome thing","weight":"1kg"},{"price":12.99,"name":"Awesome thing","weight":"1kg"}],"orders":[{"id":1},{"id":2}]}

// Return json string instead of container
var output = jbuilder.encode(function(json) {
  json.set('name', 'foo');
});

console.log(output);
// {"name":"foo"}
```

## API

### #create(fn)

Returns JSON container. Call `target()` on the container to get the JSON
representation as string.

### encode(fn)

Same as `create()`, but returns JSON string instead.

## License

(The MIT License)

Copyright (c) 2013 Mario Behrendt info@mario-behrendt.de

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
