"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _config = _interopRequireDefault(require("config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function authenticate(req, res, next) {
  var token = req.header('x-auth-token');
  if (!token) return res.status(401).send({
    error: 'access denied no token provided'
  });

  _jsonwebtoken["default"].verify(token, _config["default"].get('jwtPrivateKey'), function (err, decoded) {
    if (decoded) {
      req.user = decoded;
      next();
    } else res.status(401).send({
      error: 'access denied, invalid signature'
    });
  });
}

var _default = authenticate;
exports["default"] = _default;