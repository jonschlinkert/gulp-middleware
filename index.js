/*!
 * gulp-middleware (https://github.com/jonschlinkert/gulp-middleware)
 *
 * Copyright (c) 2016, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var debug = require('debug')('gulp-middleware');

module.exports = function(config) {
  return function(app) {
    if (this.isRegistered('gulp-middleware')) return;
    debug('initializing "%s", from "%s"', __filename, module.parent.id);

    this.define('middleware', function() {
      debug('running middleware');
      
    });
  };
};
