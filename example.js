'use strict';

var fs = require('fs');
var File = require('vinyl');
var through = require('through2');
var middleware = require('./');

function toStream(path) {
  return fs.createReadStream(path)
    .pipe(through.obj(function(contents, enc, next) {
      next(null, new File({path, contents}));
    }))
}

toStream('README.md')
  .pipe(middleware([fn, fn, fn]))
  .pipe(middleware([fn, fn, fn]))
  .pipe(middleware([fn, fn, fn]))

function fn(file, next) {
  console.log(file);
  next();
}
