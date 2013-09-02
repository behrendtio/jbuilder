var expect    = require('expect.js');
var jbuilder  = require('../');

function parsedOutput(output) {
  return JSON.parse(output);
}

describe('jbuilder', function() {
  before(function() {
    this.user = { name: 'foo' };
    this.profile = { imagePath: '/0815.jpg' };
  });

  it('adds first level attributes', function() {
    var user = this.user;

    var output = parsedOutput(jbuilder.encode(function(json) {
      json.set('name', user.name);
    }));

    expect(output).to.eql({ name: user.name });
  });

  it('adds second and third level attributes', function() {
    var profile = this.profile;

    var output = parsedOutput(jbuilder.encode(function(json) {
      json.set('profile', function(json) {
        json.set('imagePath', profile.imagePath);

        json.set('chuck', function(json) {
          json.set('name', 'Norris');
        })
      });
    }));

    expect(output).to.eql({ profile: {
      imagePath: profile.imagePath,
      chuck: { name: 'Norris' }
    }});
  });

  it('ignores falsy values', function() {
    var output = parsedOutput(jbuilder.encode(function(json) {
      json.ignoreFalsy = true;
      json.set('username', false);
    }));

    expect(output).to.eql({});
  });

  it('extracts given keys', function() {
    var output = parsedOutput(jbuilder.encode(function(json) {
      json.extract({ one: 1, two: 2, three: 3 }, 'one', 'two');
    }));

    expect(output).to.eql({ one: 1, two: 2 });
  });

  it('throws if only one parameter is given to json.extract()', function() {
    expect(function() {
      jbuilder.encode(function(json) {
        json.extract({});
      });
    }).to.throwError();
  });

  it('turns given object into array', function() {
    var output = parsedOutput(jbuilder.encode(function(json) {
      json.set('users', function(json) {
        json.child(function(json) {
          json.set('name', 'foo');
        });
        json.child(function(json) {
          json.set('bar', 'baz');
        });
      });
    }));

    expect(output).to.eql({ users: [{ name: 'foo' }, { bar: 'baz' }]});
  });
});
