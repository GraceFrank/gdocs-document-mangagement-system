"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

//defining schema for the role model
var roleSchema = new _mongoose["default"].Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    maxlength: 20,
    lowercase: true
  }
}); //compiling the role schema into a model Class

var Role = _mongoose["default"].model('roles', roleSchema);

var _default = Role;
exports["default"] = _default;