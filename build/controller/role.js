"use strict";

var _lodash = _interopRequireDefault(require("lodash"));

var _role = _interopRequireDefault(require("../api-validations/role"));

var _role2 = _interopRequireDefault(require("../models/role"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Roles =
/*#__PURE__*/
function () {
  function Roles() {
    _classCallCheck(this, Roles);
  }

  _createClass(Roles, [{
    key: "post",
    value: function () {
      var _post = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee(req, res) {
        var _validate, error, existingRole, newRole;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _validate = (0, _role["default"])(req.body), error = _validate.error;

                if (!error) {
                  _context.next = 3;
                  break;
                }

                return _context.abrupt("return", res.status(400).send(error.details[0].message));

              case 3:
                _context.next = 5;
                return _role2["default"].findOne({
                  title: req.body.title
                });

              case 5:
                existingRole = _context.sent;

                if (!existingRole) {
                  _context.next = 8;
                  break;
                }

                return _context.abrupt("return", res.status(400).send('role already exists'));

              case 8:
                _context.next = 10;
                return _role2["default"].create(_lodash["default"].pick(req.body, 'title'));

              case 10:
                newRole = _context.sent;
                return _context.abrupt("return", res.status(201).send(newRole));

              case 12:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function post(_x, _x2) {
        return _post.apply(this, arguments);
      }

      return post;
    }()
  }, {
    key: "get",
    value: function () {
      var _get = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2(req, res) {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.t0 = res;
                _context2.next = 3;
                return _role2["default"].find();

              case 3:
                _context2.t1 = _context2.sent;

                _context2.t0.send.call(_context2.t0, _context2.t1);

              case 5:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      function get(_x3, _x4) {
        return _get.apply(this, arguments);
      }

      return get;
    }()
  }, {
    key: "getById",
    value: function () {
      var _getById = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee3(req, res) {
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.t0 = res;
                _context3.next = 3;
                return _role2["default"].findById(req.params.id);

              case 3:
                _context3.t1 = _context3.sent;

                _context3.t0.send.call(_context3.t0, _context3.t1);

              case 5:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));

      function getById(_x5, _x6) {
        return _getById.apply(this, arguments);
      }

      return getById;
    }()
  }, {
    key: "put",
    value: function () {
      var _put = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee4(req, res) {
        var _validate2, error, existingRole, role;

        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _validate2 = (0, _role["default"])(req.body), error = _validate2.error;

                if (!error) {
                  _context4.next = 3;
                  break;
                }

                return _context4.abrupt("return", res.status(400).send(error.details[0].message));

              case 3:
                _context4.next = 5;
                return _role2["default"].findOne({
                  title: req.body.title,
                  _id: {
                    $ne: req.params._id
                  }
                });

              case 5:
                existingRole = _context4.sent;

                if (!existingRole) {
                  _context4.next = 8;
                  break;
                }

                return _context4.abrupt("return", res.status(409).send('role already exists'));

              case 8:
                _context4.next = 10;
                return _role2["default"].findByIdAndUpdate(req.params.id, req.body, {
                  "new": true
                });

              case 10:
                role = _context4.sent;

                if (role) {
                  _context4.next = 13;
                  break;
                }

                return _context4.abrupt("return", res.status(404).send('no such role'));

              case 13:
                return _context4.abrupt("return", res.status(200).send(role));

              case 14:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      }));

      function put(_x7, _x8) {
        return _put.apply(this, arguments);
      }

      return put;
    }()
  }]);

  return Roles;
}();

module.exports = new Roles();