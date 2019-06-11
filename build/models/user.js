"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _config = _interopRequireDefault(require("config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

//name schema
var nameschema = new _mongoose["default"].Schema({
  first: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 255,
    lowercase: true
  },
  last: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 255,
    lowercase: true
  }
}); //defining the user schema,

var userSchema = new _mongoose["default"].Schema({
  name: {
    type: nameschema,
    required: true
  },
  userName: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255,
    lowercase: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    lowercase: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 255
  },
  role: {
    type: _mongoose["default"].Types.ObjectId,
    ref: 'roles',
    required: true
  }
});

userSchema.methods.generateToken = function () {
  return _jsonwebtoken["default"].sign({
    _id: this._id,
    role: this.role
  }, _config["default"].get('jwtPrivateKey'));
}; //defining the user model


var User = _mongoose["default"].model('users', userSchema);

var _default = User;
exports["default"] = _default;