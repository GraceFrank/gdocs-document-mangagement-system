"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _role = _interopRequireDefault(require("../models/role"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

//this middleware is for authorizing admins
function authAdmin(_x, _x2, _x3) {
  return _authAdmin.apply(this, arguments);
}

function _authAdmin() {
  _authAdmin = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(req, res, next) {
    var admin;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _role["default"].findOne({
              title: 'admin'
            });

          case 2:
            admin = _context.sent;

            if (!(req.user.role !== admin._id.toHexString())) {
              _context.next = 5;
              break;
            }

            return _context.abrupt("return", res.status(403).send({
              error: 'forbidden, unauthorized access'
            }));

          case 5:
            next();

          case 6:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _authAdmin.apply(this, arguments);
}

var _default = authAdmin;
exports["default"] = _default;