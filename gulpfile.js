'use strict';

var gulp = require('gulp');
var mocha = require('gulp-mocha');
var eslint = require('gulp-eslint');
var middleware = require('./');

gulp.task('test', function() {
  return gulp.src('test.js')
    .pipe(mocha());
});

gulp.task('lint', function() {
  return gulp.src('*.js')
    .pipe(eslint())
    .pipe(eslint.format());
});

gulp.task('middleware', function(cb) {
  return gulp.src('*.js')
    .pipe(middleware([
      fn('foo'),
      fn('bar'),
      fn('baz')
    ]))
});

function fn(name) {
  return function(file, next) {
    console.log(name);
    next();
  };
}

gulp.task('default', ['test', 'lint']);
