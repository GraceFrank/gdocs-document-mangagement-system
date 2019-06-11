"use strict";

var _bcrypt = _interopRequireDefault(require("bcrypt"));

var _lodash = _interopRequireDefault(require("lodash"));

var _user = _interopRequireDefault(require("../api-validations/user"));

var _user2 = _interopRequireDefault(require("../models/user"));

var _role = _interopRequireDefault(require("../models/role"));

var _document = _interopRequireDefault(require("../models/document"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var UserController =
/*#__PURE__*/
function () {
  function UserController() {
    _classCallCheck(this, UserController);
  }

  _createClass(UserController, [{
    key: "get",
    value: function () {
      var _get = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee(req, res) {
        var users;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return _user2["default"].find();

              case 2:
                users = _context.sent;
                return _context.abrupt("return", res.send({
                  message: 'ok',
                  data: users
                }));

              case 4:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function get(_x, _x2) {
        return _get.apply(this, arguments);
      }

      return get;
    }()
  }, {
    key: "put",
    value: function () {
      var _put = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2(req, res) {
        var _validate, error, update, user;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                //validating the payload sent by client
                _validate = (0, _user["default"])(req.body), error = _validate.error;

                if (!error) {
                  _context2.next = 3;
                  break;
                }

                return _context2.abrupt("return", res.status(400).send({
                  error: error.details[0].message
                }));

              case 3:
                update = req.body;
                _context2.next = 6;
                return _bcrypt["default"].hash(update.password, 10);

              case 6:
                update.password = _context2.sent;
                _context2.next = 9;
                return _user2["default"].findByIdAndUpdate(req.user._id, update, {
                  "new": true
                });

              case 9:
                user = _context2.sent;
                _context2.next = 12;
                return _document["default"].updateMany({
                  ownerId: user._id
                }, {
                  role: user.role
                });

              case 12:
                return _context2.abrupt("return", res.send({
                  message: 'ok',
                  data: _lodash["default"].pick(user, ['name', 'email', 'userName', 'role'])
                }));

              case 13:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      function put(_x3, _x4) {
        return _put.apply(this, arguments);
      }

      return put;
    }()
  }, {
    key: "delete",
    value: function () {
      var _delete2 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee3(req, res) {
        var user;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return _user2["default"].findByIdAndDelete(req.user._id);

              case 2:
                user = _context3.sent;
                return _context3.abrupt("return", res.send(user));

              case 4:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));

      function _delete(_x5, _x6) {
        return _delete2.apply(this, arguments);
      }

      return _delete;
    }()
  }, {
    key: "getMe",
    value: function () {
      var _getMe = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee4(req, res) {
        var user;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return _user2["default"].findById(req.user._id);

              case 2:
                user = _context4.sent;
                return _context4.abrupt("return", res.send({
                  message: 'ok',
                  data: user
                }));

              case 4:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      }));

      function getMe(_x7, _x8) {
        return _getMe.apply(this, arguments);
      }

      return getMe;
    }()
  }, {
    key: "post",
    value: function () {
      var _post = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee5(req, res) {
        var _validate2, error, existingUser, newUser, salt, regular;

        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                //validating request payload
                _validate2 = (0, _user["default"])(req.body), error = _validate2.error;

                if (!error) {
                  _context5.next = 3;
                  break;
                }

                return _context5.abrupt("return", res.status(400).send(error.details[0].message));

              case 3:
                _context5.next = 5;
                return _user2["default"].findOne().or([{
                  email: req.body.email
                }, {
                  userName: req.body.userName
                }]);

              case 5:
                existingUser = _context5.sent;

                if (!existingUser) {
                  _context5.next = 8;
                  break;
                }

                return _context5.abrupt("return", res.status(409).send('email or username already in use'));

              case 8:
                //instantiating new user
                newUser = new _user2["default"](req.body); //hashing new user password

                _context5.next = 11;
                return _bcrypt["default"].genSalt(10);

              case 11:
                salt = _context5.sent;
                _context5.next = 14;
                return _bcrypt["default"].hash(newUser.password, salt);

              case 14:
                newUser.password = _context5.sent;
                _context5.next = 17;
                return _role["default"].findOne({
                  title: 'regular'
                });

              case 17:
                regular = _context5.sent;
                newUser.role = regular._id; //saving new user to data base and returning response

                _context5.next = 21;
                return newUser.save();

              case 21:
                newUser = _context5.sent;
                return _context5.abrupt("return", res.status(201).send(_lodash["default"].pick(newUser, ['_id', 'name', 'email', 'userName', 'role'])));

              case 23:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5);
      }));

      function post(_x9, _x10) {
        return _post.apply(this, arguments);
      }

      return post;
    }()
  }, {
    key: "getUserDocs",
    value: function () {
      var _getUserDocs = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee6(req, res) {
        var page, limit, admin, docs;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                page = req.query.page * 1;
                limit = req.query.limit * 1; //validating that valid query strings are provided

                if (!page || !limit) res.status(400).send('invalid query'); //if the user is not logged in send only documents with public access

                if (req.user) {
                  _context6.next = 8;
                  break;
                }

                _context6.next = 6;
                return _document["default"].find({
                  ownerId: req.params.id,
                  access: 'public'
                }).skip((page - 1) * limit).limit(limit).sort({
                  date: -1
                });

              case 6:
                docs = _context6.sent;
                return _context6.abrupt("return", res.send(docs));

              case 8:
                _context6.next = 10;
                return _role["default"].findOne({
                  title: 'admin'
                });

              case 10:
                admin = _context6.sent;

                if (!(req.user.role == admin._id.toHexString())) {
                  _context6.next = 16;
                  break;
                }

                _context6.next = 14;
                return _document["default"].find({
                  access: {
                    $ne: 'private'
                  },
                  ownerId: req.params.id
                }).skip((page - 1) * limit).limit(limit).sort({
                  date: -1
                });

              case 14:
                docs = _context6.sent;
                return _context6.abrupt("return", res.send(docs));

              case 16:
                _context6.next = 18;
                return _document["default"].find().or([{
                  access: 'public',
                  ownerId: req.params.id
                }, {
                  role: req.user.role,
                  access: 'role',
                  ownerId: req.params.id
                }]).skip((page - 1) * limit).limit(limit).sort({
                  date: -1
                });

              case 18:
                docs = _context6.sent;
                return _context6.abrupt("return", res.send(docs));

              case 20:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6);
      }));

      function getUserDocs(_x11, _x12) {
        return _getUserDocs.apply(this, arguments);
      }

      return getUserDocs;
    }()
  }]);

  return UserController;
}();

module.exports = new UserController();