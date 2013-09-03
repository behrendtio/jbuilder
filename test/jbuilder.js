var expect    = require('expect.js');
var jbuilder  = require('../');

describe('jbuilder', function() {
  it('returns a converted json string', function() {
    var json = jbuilder.encode(function(json) {
      json.set('name', 'foo');
    });

    expect(json).to.eql('{"name":"foo"}');
  });

  it('adds first level attributes', function() {
    var user = this.user;

    var output = jbuilder.create(function(json) {
      json.set('name', 'bar');
    });

    expect(output.content).to.eql({ name: 'bar' });
  });

  it('adds second and third level attributes', function() {
    var profile = this.profile;

    var output = jbuilder.create(function(json) {
      json.set('profile', function(json) {
        json.set('imagePath', '/0815.jpg');

        json.set('chuck', function(json) {
          json.set('name', 'Norris');
        })
      });
    });

    expect(output.content).to.eql({ profile: {
      imagePath: '/0815.jpg',
      chuck: { name: 'Norris' }
    }});
  });

  it('ignores false values', function() {
    var output = jbuilder.create(function(json) {
      json.setIgnoreFalse(true);
      json.set('username', false);
    });

    expect(output.content).to.eql({});
  });

  it('extracts given keys', function() {
    var output = jbuilder.create(function(json) {
      json.extract({ one: 1, two: 2, three: 3 }, 'one', 'two');
    });

    expect(output.content).to.eql({ one: 1, two: 2 });
  });

  it('throws if only one parameter is given to json.extract()', function() {
    expect(function() {
      jbuilder.encode(function(json) {
        json.extract({});
      });
    }).to.throwError();
  });

  it('extracts from arrays', function() {
    var output = jbuilder.create(function(json) {
      json.extract([{ foo: 1, bar: 1 }, { foo: 2, bar: 2 }, { foo: 3, bar: 3 }], 'foo');
    });

    expect(output.content).to.eql([{ foo: 1 }, { foo: 2 }, { foo: 3 }]);
  });

  it('turns given object into array', function() {
    var output = jbuilder.create(function(json) {
      json.set('users', function(json) {
        json.child(function(json) {
          json.set('name', 'foo');
        });
        json.child(function(json) {
          json.set('bar', 'baz');
        });
      });
    });

    expect(output.content).to.eql({ users: [{ name: 'foo' }, { bar: 'baz' }]});
  });

  it('runs convert function if present', function() {
    var convert = function(value) { return value.toLowerCase() };

    var output = jbuilder.create(function(json) {
      json.setConvert(convert);

      json.set('name', 'TEST');
      json.set('choices', function(json) {
        json.setConvert(convert);
        json.extract({ yes: 'TRUE', no: 'FALSE' }, 'yes');
      });
      json.set('products', function(json) {
        json.setConvert(convert);
        json.extract([{ id: 1, name: 'PROD 1' }, { id: 2, name: 'PROD 2' }], 'name');
      });
      json.set('orders', function(json) {
        json.child(function(json) {
          json.setConvert(convert);
          json.set('number', '1ABC2');
        });
      });
    });

    expect(output.content).to.eql({ name: 'test', choices: { yes: 'true' },
      products: [{ name: 'prod 1' }, { name: 'prod 2' }], orders: [{ number: '1abc2' }]}
    );
  });
});
