'use strict';

require('mocha');
var assert = require('assert');
var middleware = require('./');
var vfs = require('vinyl-fs');

describe('gulp-middleware', function() {
  describe('plugin', function() {
    it('should export a function', function() {
      assert.equal(typeof middleware, 'function');
    });

    it('should return a stream', function() {
      assert(middleware());
      assert.equal(typeof middleware().pipe, 'function');
    });

    it('should expose a `parallel` method', function() {
      assert(middleware.parallel);
      assert.equal(typeof middleware.parallel, 'function');
    });

    it('should return a stream from the `parallel` method', function() {
      assert(middleware.parallel());
      assert.equal(typeof middleware.parallel().pipe, 'function');
    });
  });

  describe('series', function() {
    it('should run a middleware function', function(cb) {
      var count = 0;

      function fn(file, next) {
        assert.equal(file.stem, 'README');
        count++;
        next(null, next);
      }

      vfs.src('README.md')
        .pipe(middleware(fn))
        .on('data', function() {})
        .on('end', function() {
          assert.equal(count, 1);
          cb();
        });
    });

    it('should run a stack of middleware functions', function(cb) {
      var count = 0;

      function fn(file, next) {
        count++;
        assert.equal(file.stem, 'README');
        next();
      }

      vfs.src('README.md')
        .pipe(middleware(fn))
        .pipe(middleware(fn))
        .pipe(middleware(fn))
        .on('data', function(file) {})
        .on('end', function() {
          assert.equal(count, 3);
          cb();
        });
    });

    it('should run an array of middleware functions', function(cb) {
      var count = 0;

      function fn(file, next) {
        assert.equal(file.stem, 'README');
        count++;
        next();
      }

      vfs.src('README.md')
        .pipe(middleware([fn, fn, fn]))
        .on('data', function() {})
        .on('end', function() {
          assert.equal(count, 3);
          cb();
        });
    });

    it('should handle thrown errors', function(cb) {
      var count = 0;

      function fn(file, next) {
        count++;
        throw new Error('foo');
        next(); // eslint-disable-line
      }

      vfs.src('README.md')
        .pipe(middleware([fn, fn, fn]))
        .on('data', function() {})
        .on('error', function(err) {
          assert.equal(err.message, 'foo');
          cb();
        });
    });

    it('should handle errors in the callback', function(cb) {
      var count = 0;

      function fn(file, next) {
        count++;
        next(new Error('foo'));
      }

      vfs.src('README.md')
        .pipe(middleware([fn, fn, fn]))
        .on('data', function() {})
        .on('error', function(err) {
          assert.equal(err.message, 'foo');
          cb();
        });
    });
  });

  describe('parallel', function() {
    it('should run a middleware function', function(cb) {
      var count = 0;

      function fn(file, next) {
        assert.equal(file.stem, 'README');
        count++;
        next(null, next);
      }

      vfs.src('README.md')
        .pipe(middleware.parallel(fn))
        .on('data', function() {})
        .on('end', function() {
          assert.equal(count, 1);
          cb();
        });
    });

    it('should run a stack of middleware functions', function(cb) {
      var count = 0;

      function fn(file, next) {
        count++;
        assert.equal(file.stem, 'README');
        next();
      }

      vfs.src('README.md')
        .pipe(middleware.parallel(fn))
        .pipe(middleware.parallel(fn))
        .pipe(middleware.parallel(fn))
        .on('data', function(file) {})
        .on('end', function() {
          assert.equal(count, 3);
          cb();
        });
    });

    it('should run an array of middleware functions', function(cb) {
      var count = 0;

      function fn(file, next) {
        assert.equal(file.stem, 'README');
        count++;
        next();
      }

      vfs.src('README.md')
        .pipe(middleware.parallel([fn, fn, fn]))
        .on('data', function() {})
        .on('end', function() {
          assert.equal(count, 3);
          cb();
        });
    });

    it('should handle thrown errors', function(cb) {
      var count = 0;

      function fn(file, next) {
        count++;
        throw new Error('foo');
        next(); // eslint-disable-line
      }

      vfs.src('README.md')
        .pipe(middleware.parallel([fn, fn, fn]))
        .on('data', function() {})
        .on('error', function(err) {
          assert.equal(err.message, 'foo');
          cb();
        });
    });

    it('should handle errors in the callback', function(cb) {
      var count = 0;

      function fn(file, next) {
        count++;
        next(new Error('foo'));
      }

      vfs.src('README.md')
        .pipe(middleware.parallel([fn, fn, fn]))
        .on('data', function() {})
        .on('error', function(err) {
          assert.equal(err.message, 'foo');
          cb();
        });
    });
  });
});
