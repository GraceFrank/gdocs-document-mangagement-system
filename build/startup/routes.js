"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _roles = _interopRequireDefault(require("../routes/roles"));

var _users = _interopRequireDefault(require("../routes/users"));

var _login = _interopRequireDefault(require("../routes/login"));

var _document = _interopRequireDefault(require("../routes/document"));

var _swagger = _interopRequireDefault(require("../documentation/swagger"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function routes(app) {
  app.use(_express["default"].json());
  app.use('/api/roles', _roles["default"]);
  app.use('/api/users', _users["default"]);
  app.use('/api/login', _login["default"]);
  app.use('/api/documents', _document["default"]);
  app.use('/api-docs', _swagger["default"]);
}

var _default = routes;
exports["default"] = _default;