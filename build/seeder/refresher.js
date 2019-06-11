"use strict";

var _user = _interopRequireDefault(require("../models/user"));

var _document = _interopRequireDefault(require("../models/document"));

var _role = _interopRequireDefault(require("../models/role"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var refresher =
/*#__PURE__*/
function () {
  function refresher() {
    _classCallCheck(this, refresher);
  }

  _createClass(refresher, [{
    key: "dropUsers",
    value: function () {
      var _dropUsers = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return _user["default"].deleteMany({});

              case 2:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function dropUsers() {
        return _dropUsers.apply(this, arguments);
      }

      return dropUsers;
    }()
  }, {
    key: "dropDocuments",
    value: function () {
      var _dropDocuments = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2() {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return _document["default"].deleteMany({});

              case 2:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      function dropDocuments() {
        return _dropDocuments.apply(this, arguments);
      }

      return dropDocuments;
    }()
  }]);

  return refresher;
}();