[![Build Status](https://travis-ci.org/behrendtio/jbuilder.png?branch=master)](https://travis-ci.org/behrendtio/jbuilder)

# Jbuilder for Node.js

## Purpose

Tiny WIP node.js port of rails' jbuilder.

## Installation

```bash
$ npm i jbuilder
```

## Usage

#### jbuilder#create(fn)

Returns JSON container. Call `target()` on the container to get the JSON
representation as string.

#### jbuilder#encode(fn)

Same as `#create()`, but returns JSON string instead.

#### json.target()

Converts JSON container to JSON string and returns it.

```javascript
var output = jbuilder.create(function(json) {
  json.set('key', 'value');
});

console.log(output.target());
// {"key":"value"}
```

#### json.set(key, value)

Sets the value for the given key.

```javascript
var output = jbuilder.encode(function(json) {
  json.set('name', 'Mario');
});

console.log(output);
// {"name":"Mario"}

// Set second level values
var output = jbuilder.encode(function(json) {
  json.set('profile', function(json) {
    json.set('imagePath', '/0815.jpg');

    // Set third level values
    json.set('chuck', function(json) {
      json.set('name', 'Norris');
    });
  });
});

console.log(output);
// {"profile":{"imagePath":"/0815.jpg","chuck":{"name":"Norris"}}}
```

#### json.extract(obj, [...])

Extracts all keys for the given object. The parameter list is dynamic, but must
have at least an object and one key. If the first parameter is an array, it will
extract the keys from all objects within the array and add the whole result set
as an array to the json container.

```javascript
var product = { price: 12.99, name: 'Foo', weight: '1kg', test: 'bar' };

var output = jbuilder.encode(function(json) {
  json.set('product', function(json) {
    json.extract(product, 'price', 'name', 'weight');
  });
});

console.log(output);
// {"product":{"price":12.99,"name":"Foo","weight":"1kg"}}

// Extract values of array
var output = jbuilder.encode(function(json) {
  json.set('products', function(json) {
    json.extract([product, product], 'price', 'name', 'weight');
  });
});

console.log(output);
// {"products":[{"price":12.99,"name":"Foo","weight":"1kg"},{"price":12.99,"name":"Foo","weight":"1kg"}]}
```

#### json.child(fn)

Adds all values set in the given callback within an array instead of a plain
object. Useful in loops.

```javascript
// Turns object into array
var output = jbuilder.encode(function(json) {
  json.set('orders', function(json) {
    json.child(function(json) {
      json.set('id', 1);
    });
    json.child(function(json) {
      json.set('id', 2);
    });
  });
})

console.log(output);
// {"orders":[{"id":1},{"id":2}]}
```

#### json.setIgnoreFalse(bool)

If set to true, all values that are set afterwards are ignored if they are sort
of false (undefined, 0, false).

```javascript
// Ignore false values
var output = jbuilder.encode(function(json) {
  json.set('admin', false); // Present
  json.setIgnoreFalse(true);
  json.set('value', false); // Not present
});

console.log(output);
// {"admin":false}
```

## License

(The MIT License)

Copyright (c) 2013 Mario Behrendt info@mario-behrendt.de

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the 'Software'), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
