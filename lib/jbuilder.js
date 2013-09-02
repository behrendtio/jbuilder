var jbuilder = {
  encode: function(property, mapper) {
    var container = new JsonContainer();

    if (undefined == mapper && 'function' == typeof property) {
      property(container);
    } else if('function' == typeof mapper) {
      var json = new JsonContainer();
      mapper(json);
      this.content[property] = json.content;
    } else {
      if (!this.ignoreFalsy || mapper) {
        this.content[property] = mapper;
      }
    }

    return container.target();
  }
};

var JsonContainer = function() {
  this.ignoreFalsy = false;
  this.content = {};
};

JsonContainer.prototype.target = function() {
  var json = this.content;
  return JSON.stringify(json);
};

JsonContainer.prototype.extract = function() {
  if (arguments.length < 2) {
    throw new Error('json.extract() requires at least two parameters');
  }

  var object = arguments[0]

  for(var i = 0; i < arguments.length; i++) {
    var property = arguments[i];
    this.content[property] = object[property];
  }
};

JsonContainer.prototype.child = function(mapper) {
  var tempContainer = new JsonContainer();
  mapper(tempContainer);

  if (Array.isArray(this.content)) {
    this.content.push(tempContainer.content);
  } else {
    this.content = [tempContainer.content];
  }
};

JsonContainer.prototype.set = jbuilder.encode;

module.exports = jbuilder;
