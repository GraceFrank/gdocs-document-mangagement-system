"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _document = _interopRequireDefault(require("../api-validations/document"));

var _document2 = _interopRequireDefault(require("../models/document"));

var _role = _interopRequireDefault(require("../models/role"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Documents =
/*#__PURE__*/
function () {
  function Documents() {
    _classCallCheck(this, Documents);
  }

  _createClass(Documents, [{
    key: "post",
    value: function () {
      var _post = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee(req, res) {
        var _validate, error, existingDoc, doc;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _validate = (0, _document["default"])(req.body), error = _validate.error;

                if (!error) {
                  _context.next = 3;
                  break;
                }

                return _context.abrupt("return", res.status(400).send(error.details[0].message));

              case 3:
                _context.next = 5;
                return _document2["default"].findOne({
                  title: req.body.title
                });

              case 5:
                existingDoc = _context.sent;

                if (!existingDoc) {
                  _context.next = 8;
                  break;
                }

                return _context.abrupt("return", res.status(400).send('document already exists'));

              case 8:
                _context.next = 10;
                return _document2["default"].create({
                  ownerId: req.user._id,
                  title: req.body.title,
                  content: req.body.content,
                  access: req.body.access || 'public',
                  role: req.user.role
                });

              case 10:
                doc = _context.sent;
                res.status(201).send(doc);

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
        var page, limit, admin, docs;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                // validate query
                page = req.query.page * 1;
                limit = req.query.limit * 1;
                if (!page || !limit) res.status(400).send('invalid query');

                if (req.user) {
                  _context2.next = 8;
                  break;
                }

                _context2.next = 6;
                return _document2["default"].find({
                  access: 'public'
                }).skip((page - 1) * limit).limit(limit).sort({
                  date: -1
                });

              case 6:
                docs = _context2.sent;
                return _context2.abrupt("return", res.send(docs));

              case 8:
                _context2.next = 10;
                return _role["default"].findOne({
                  title: 'admin'
                });

              case 10:
                admin = _context2.sent;

                if (!(req.user.role == admin._id.toHexString())) {
                  _context2.next = 16;
                  break;
                }

                _context2.next = 14;
                return _document2["default"].find().or([{
                  access: 'private',
                  ownerId: req.user._id
                }, {
                  access: {
                    $ne: 'private'
                  }
                }]).skip((page - 1) * limit).limit(limit).sort({
                  date: -1
                });

              case 14:
                docs = _context2.sent;
                return _context2.abrupt("return", res.send(docs));

              case 16:
                _context2.next = 18;
                return _document2["default"].find().or([{
                  access: 'private',
                  ownerId: req.user._id
                }, {
                  access: 'public'
                }, {
                  role: req.user.role,
                  access: 'role'
                }]).skip((page - 1) * limit).limit(limit).sort({
                  date: -1
                });

              case 18:
                docs = _context2.sent;
                return _context2.abrupt("return", res.send(docs));

              case 20:
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
    key: "put",
    value: function () {
      var _put = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee3(req, res) {
        var _validate2, error, doc, existingDoc, update;

        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                //validating users input
                _validate2 = (0, _document["default"])(req.body), error = _validate2.error;

                if (!error) {
                  _context3.next = 3;
                  break;
                }

                return _context3.abrupt("return", res.status(400).send(error.details[0].message));

              case 3:
                _context3.next = 5;
                return _document2["default"].findOne({
                  _id: req.params.id
                });

              case 5:
                doc = _context3.sent;

                if (doc) {
                  _context3.next = 8;
                  break;
                }

                return _context3.abrupt("return", res.status(404).send('document not found'));

              case 8:
                _context3.next = 10;
                return _document2["default"].findOne({
                  title: req.body.title
                });

              case 10:
                existingDoc = _context3.sent;

                if (!existingDoc) {
                  _context3.next = 13;
                  break;
                }

                return _context3.abrupt("return", res.status(400).send('document already exists'));

              case 13:
                _context3.next = 15;
                return _document2["default"].findOneAndUpdate({
                  _id: req.params.id
                }, req.body, {
                  "new": true
                });

              case 15:
                update = _context3.sent;
                res.send(update);

              case 17:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));

      function put(_x5, _x6) {
        return _put.apply(this, arguments);
      }

      return put;
    }()
  }, {
    key: "delete",
    value: function () {
      var _delete2 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee4(req, res) {
        var doc, deleted;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return _document2["default"].findById(req.params.id);

              case 2:
                doc = _context4.sent;

                if (doc) {
                  _context4.next = 5;
                  break;
                }

                return _context4.abrupt("return", res.status(404).send('document not found'));

              case 5:
                if (!(doc.ownerId.toHexString() != req.user._id)) {
                  _context4.next = 7;
                  break;
                }

                return _context4.abrupt("return", res.status(403).send('access denied, only author can modify docs'));

              case 7:
                _context4.next = 9;
                return _document2["default"].findByIdAndDelete(doc._id);

              case 9:
                deleted = _context4.sent;
                res.send(deleted);

              case 11:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      }));

      function _delete(_x7, _x8) {
        return _delete2.apply(this, arguments);
      }

      return _delete;
    }()
  }, {
    key: "getById",
    value: function () {
      var _getById = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee5(req, res) {
        var doc, GrantAccess;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.next = 2;
                return _document2["default"].findById(req.params.id);

              case 2:
                doc = _context5.sent;

                if (doc) {
                  _context5.next = 5;
                  break;
                }

                return _context5.abrupt("return", res.status(404).send('document not found'));

              case 5:
                GrantAccess =
                /*#__PURE__*/
                function () {
                  function GrantAccess() {
                    _classCallCheck(this, GrantAccess);
                  }

                  _createClass(GrantAccess, [{
                    key: "isAdmin",
                    value: function isAdmin() {
                      var admin = _role["default"].findOne({
                        title: admin
                      });

                      return req.user.role == admin._id;
                    }
                  }, {
                    key: "public",
                    value: function _public() {
                      res.send(doc);
                    }
                  }, {
                    key: "role",
                    value: function role() {
                      if (doc.role == req.user.role || this.isAdmin()) {
                        return res.send(doc);
                      } else return res.status(403).send('unauthorized access denied');
                    }
                  }, {
                    key: "private",
                    value: function _private() {
                      if (doc.ownerId == req.user._id) {
                        return res.send(doc);
                      } else return res.status(403).send('unauthorized access denied, private document ');
                    }
                  }]);

                  return GrantAccess;
                }();

                new GrantAccess()[doc.access]();

              case 7:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5);
      }));

      function getById(_x9, _x10) {
        return _getById.apply(this, arguments);
      }

      return getById;
    }()
  }]);

  return Documents;
}();

var _default = new Documents();

exports["default"] = _default;