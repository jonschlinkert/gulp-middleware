'use strict';

require('mocha');
var assert = require('assert');
var middleware = require('./');

describe('gulp-middleware', function() {
  it('should export a function', function() {
    assert.equal(typeof middleware, 'function');
  });

  it('should export an object', function() {
    assert(middleware);
    assert.equal(typeof middleware, 'object');
  });

  it('should throw an error when invalid args are passed', function(cb) {
    try {
      middleware();
      cb(new Error('expected an error'));
    } catch (err) {
      assert(err);
      assert.equal(err.message, 'expected first argument to be a string');
      assert.equal(err.message, 'expected callback to be a function');
      cb();
    }
  });
});
