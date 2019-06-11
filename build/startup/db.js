"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.connectToDb = connectToDb;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _config = _interopRequireDefault(require("config"));

var _logger = _interopRequireDefault(require("./logger"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

//module dependencies
function connectToDb() {
  //get db from config module, depending on the node environment
  var db = _config["default"].get('db'); //connect to the database


  _mongoose["default"].connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true
  }).then(function () {
    _logger["default"].info("connected to database ".concat(db));
  });
}