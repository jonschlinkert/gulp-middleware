/*!
 * gulp-middleware (https://github.com/jonschlinkert/gulp-middleware)
 *
 * Copyright (c) 2016, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var through = require('through2');
var eachSeries = require('async-each-series');
var each = require('async-each');

/**
 * Expose `middleware`
 */

module.exports = exports = middleware;

/**
 * Run middleware in series.
 *
 * ```js
 * var middleware = require('gulp-middleware');
 *
 * gulp.task('middleware', function() {
 *   return gulp.src('*.js')
 *     .pipe(middleware(fn('bar')))
 *     .pipe(middleware([
 *       fn('foo'),
 *       fn('bar'),
 *       fn('baz')
 *     ]))
 * });
 *
 * function fn(name) {
 *   return function(file, next) {
 *     console.log(name);
 *     next();
 *   };
 * }
 * ```
 * @param {Array|Function} `fns` Function or array of middleware functions
 * @api public
 */

function middleware(fns) {
  return through.obj(function(file, enc, cb) {
    eachSeries(arrayify(fns), function(fn, next) {
      try {
        fn(file, next);
      } catch (err) {
        next(err);
      }
    }, function(err) {
      cb(err, file);
    });
  });
};

/**
 * Run middleware in parallel.
 *
 * ```js
 * var middleware = require('gulp-middleware');
 *
 * gulp.task('middleware', function() {
 *   return gulp.src('*.js')
 *     .pipe(middleware(fn('bar')))
 *     .pipe(middleware.parallel([
 *       fn('foo'),
 *       fn('bar'),
 *       fn('baz')
 *     ]))
 * });
 *
 * function fn(name) {
 *   return function(file, next) {
 *     console.log(name);
 *     next();
 *   };
 * }
 * ```
 * @param {Array|Function} `fns` Function or array of middleware functions
 * @api public
 */

middleware.parallel = function(fns) {
  fns = arrayify.apply(null, arguments);
  return through.obj(function(file, enc, cb) {
    each(arrayify(fns), function(fn, next) {
      try {
        fn(file, next);
      } catch (err) {
        next(err);
      }
    }, function(err) {
      cb(err, file);
    });
  });
};

function arrayify(val) {
  return val ? (Array.isArray(val) ? val : [val]) : [];
}
