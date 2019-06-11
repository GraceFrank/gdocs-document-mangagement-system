"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _joi = _interopRequireDefault(require("joi"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// import objId from 'joi-objectid';
// Joi.objectId = objId(Joi);
function validateDoc(document) {
  var schema = {
    title: _joi["default"].string().required().max(1000),
    content: _joi["default"].string().max(100000),
    access: _joi["default"].string().valid(['public', 'private', 'role'])
  };
  return _joi["default"].validate(document, schema);
}

var _default = validateDoc;
exports["default"] = _default;