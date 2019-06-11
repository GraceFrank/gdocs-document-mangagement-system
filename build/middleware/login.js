"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _config = _interopRequireDefault(require("config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

//this middle ware is routes that can be accessed by both logged in and not logged in users like the document.get all
function login(req, res, next) {
  var token = req.header('x-auth-token'); //if token is not provided just move to the next

  if (!token) {
    return next();
  } //if token is provided and its valid, move to the next function in the route handler


  _jsonwebtoken["default"].verify(token, _config["default"].get('jwtPrivateKey'), function (err, decoded) {
    if (decoded) {
      req.user = decoded;
      next();
    } else return res.status(401).send({
      error: 'access denied, invalid signature'
    });
  });
}

var _default = login;
exports["default"] = _default;