'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = void 0;

require('babel-polyfill');
require('babel-core');

var _express = _interopRequireDefault(require('express'));

var _db = require('./startup/db');

var _routes = _interopRequireDefault(require('./startup/routes'));

var _logger = _interopRequireDefault(require('./startup/logger'));

var _prod = _interopRequireDefault(require('./startup/prod'));

var _seeder = _interopRequireDefault(require('./seeder/seeder'));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var app = (0, _express['default'])(); //connecting to database

(0, _db.connectToDb)(); //defining routes

(0, _routes['default'])(app);
(0, _prod['default'])(app);
var port = process.env.PORT || 3000;
var server = app.listen(port, function() {
  _logger['default'].info('listening on port '.concat(port));
});
var _default = server;
exports['default'] = _default;
