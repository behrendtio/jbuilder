var jbuilder = {
  create: function(property, mapper) {
    var container = new JsonContainer();

    if (undefined == mapper && 'function' == typeof property) {
      property(container);
    } else if ('function' == typeof mapper) {
      var json = new JsonContainer();
      mapper(json);
      this.content[property] = json.content;
    } else {
      if (!this.ignoreFalse || mapper) {
        this.content[property] = this.prepareValue(mapper);
      }
    }

    return container;
  },

  encode: function(property, mapper) {
    return jbuilder.create(property, mapper).target();
  }
};

var JsonContainer = function() {
  this.ignoreFalse = false;
  this.convert = false;
  this.content = {};
};

JsonContainer.prototype.setIgnoreFalse = function(value) {
  this.ignoreFalse = value;
};

JsonContainer.prototype.setConvert = function(fn) {
  this.convert = fn;
};

JsonContainer.prototype.prepareValue = function(value) {
  if (this.convert) {
    value = this.convert(value);
  }

  return value;
};

JsonContainer.prototype.target = function() {
  var json = this.content;
  return JSON.stringify(json);
};

JsonContainer.prototype.extract = function() {
  if (arguments.length < 2) {
    throw new Error('json.extract() requires at least two parameters');
  }

  var args = arguments;
  var object = args[0];
  var self = this;

  if (Array.isArray(object)) {
    self.content = [];
    object.forEach(function(item) {
      self.content.push(self.extractFromObject(item, args));
    });
  } else {
    self.content = self.extractFromObject(object, args);
  }
};

JsonContainer.prototype.extractFromObject = function(item, keys) {
  var result = {};

  for (var i = 1; i < keys.length; i++) {
    var property = keys[i];
    result[property] = this.prepareValue(item[property]);
  }

  return result;
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

JsonContainer.prototype.set = jbuilder.create;

module.exports = jbuilder;
