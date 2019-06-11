"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _joi = _interopRequireDefault(require("joi"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

//function to validate that user provides required valid login details
function validateLoginDetails(payload) {
  //defining the schema of the payload
  var schema = {
    email: _joi["default"].string().email().max(255).min(5).required(),
    password: _joi["default"].string().required()
  };
  return _joi["default"].validate(payload, schema);
}

var _default = validateLoginDetails;
exports["default"] = _default;