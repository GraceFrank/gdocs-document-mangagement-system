"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _joi = _interopRequireDefault(require("joi"));

var _joiObjectid = _interopRequireDefault(require("joi-objectid"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_joi["default"].objectId = (0, _joiObjectid["default"])(_joi["default"]);

function validateUser(user) {
  var schema = {
    name: _joi["default"].object().keys({
      first: _joi["default"].string().required().min(2).max(255),
      last: _joi["default"].string().required().min(2).max(255)
    }).required(),
    email: _joi["default"].string().required().email(),
    userName: _joi["default"].string().required().min(3).max(255),
    password: _joi["default"].string().required().min(8).max(255)
  };
  return _joi["default"].validate(user, schema);
}

var _default = validateUser;
exports["default"] = _default;