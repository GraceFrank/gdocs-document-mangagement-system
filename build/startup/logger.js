"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _config = _interopRequireDefault(require("config"));

var _winston = _interopRequireDefault(require("winston"));

require("winston-mongodb");

require("express-async-errors");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

//creating a winston logger object for logging errors
var logger = _winston["default"].createLogger({
  level: 'info',
  format: _winston["default"].format.json(),
  //transports are the means by which the errors or info are logged
  transports: [new _winston["default"].transports.File({
    filename: 'error.log',
    level: 'error'
  }), new _winston["default"].transports.Console() // new winston.transports.MongoDb({db: db, level: 'error'}),
  ],
  //winston exception handler
  exceptionHandlers: [new _winston["default"].transports.File({
    filename: 'exceptions.log'
  }), new _winston["default"].transports.Console()]
});
/* unhandled promise rejections throw an exception 
so that it can be caught by winston exception handler
*/


process.on('unhandledRejection', function (ex) {
  throw ex;
  process.exit(1);
});
var _default = logger;
exports["default"] = _default;