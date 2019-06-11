"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _joi = _interopRequireDefault(require("joi"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function validateRole(roleObject) {
  var schema = {
    title: _joi["default"].string().required().min(2).max(20)
  };
  return _joi["default"].validate(roleObject, schema);
}

var _default = validateRole;
exports["default"] = _default;