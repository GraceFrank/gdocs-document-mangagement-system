"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _faker = _interopRequireDefault(require("faker"));

var _user = _interopRequireDefault(require("../models/user"));

var _bcrypt = _interopRequireDefault(require("bcrypt"));

var _document = _interopRequireDefault(require("../models/document"));

var _role = _interopRequireDefault(require("../models/role"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Seeder =
/*#__PURE__*/
function () {
  function Seeder() {
    _classCallCheck(this, Seeder);
  }

  _createClass(Seeder, [{
    key: "insertDefaultRoles",
    //method to insert default roles to the role collection in database
    value: function () {
      var _insertDefaultRoles = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee() {
        var roles;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return _role["default"].find();

              case 2:
                roles = _context.sent;

                if (!(!roles.length > 0)) {
                  _context.next = 7;
                  break;
                }

                _context.next = 6;
                return _role["default"].insertMany([{
                  title: 'admin'
                }, {
                  title: 'regular'
                }]);

              case 6:
                return _context.abrupt("return", _context.sent);

              case 7:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function insertDefaultRoles() {
        return _insertDefaultRoles.apply(this, arguments);
      }

      return insertDefaultRoles;
    }() //method to seed the users collection in database

  }, {
    key: "insertUsers",
    value: function () {
      var _insertUsers = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2(quantity) {
        var roles, i;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return _role["default"].find();

              case 2:
                roles = _context2.sent;
                i = 1;

              case 4:
                if (!(i <= quantity)) {
                  _context2.next = 19;
                  break;
                }

                _context2.t0 = _user["default"];
                _context2.t1 = {
                  first: _faker["default"].fake('{{name.firstName}}'),
                  last: _faker["default"].fake('{{name.lastName}}')
                };
                _context2.t2 = _faker["default"].fake('{{internet.email}}');
                _context2.t3 = _faker["default"].fake('{{internet.userName}}');
                _context2.next = 11;
                return _bcrypt["default"].hash('sweetlove', 10);

              case 11:
                _context2.t4 = _context2.sent;
                _context2.t5 = roles[Math.floor(Math.random() * roles.length)]._id;
                _context2.t6 = {
                  name: _context2.t1,
                  email: _context2.t2,
                  userName: _context2.t3,
                  password: _context2.t4,
                  role: _context2.t5
                };
                _context2.next = 16;
                return _context2.t0.create.call(_context2.t0, _context2.t6);

              case 16:
                i++;
                _context2.next = 4;
                break;

              case 19:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      function insertUsers(_x) {
        return _insertUsers.apply(this, arguments);
      }

      return insertUsers;
    }() //seedUsers method
    //method to seed the documents collection in database

  }, {
    key: "insertDocuments",
    value: function () {
      var _insertDocuments = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee3(quantity) {
        var users, access, i, user;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return _user["default"].find();

              case 2:
                users = _context3.sent;
                access = ['public', 'private', 'role'];
                i = 1;

              case 5:
                if (!(i <= quantity)) {
                  _context3.next = 12;
                  break;
                }

                //any user is drawn randomly from the fetched users as the document owner
                user = users[Math.floor(Math.random() * users.length)];
                _context3.next = 9;
                return _document["default"].create({
                  ownerId: user._id,
                  title: _faker["default"].fake('{{lorem.words}}'),
                  content: _faker["default"].fake('{{lorem.sentences}}'),
                  role: user.role,
                  //access type is assigned randomly to documents
                  access: access[Math.floor(Math.random() * 3)]
                });

              case 9:
                i++;
                _context3.next = 5;
                break;

              case 12:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));

      function insertDocuments(_x2) {
        return _insertDocuments.apply(this, arguments);
      }

      return insertDocuments;
    }() //fakeDocuments Method

  }]);

  return Seeder;
}(); //seeder class


var _default = new Seeder();

exports["default"] = _default;