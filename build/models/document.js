"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var docSchema = new _mongoose["default"].Schema({
  ownerId: {
    type: _mongoose["default"].Types.ObjectId,
    required: true,
    ref: 'users'
  },
  title: {
    type: String,
    required: true,
    maxlength: 1000,
    unique: true
  },
  content: {
    type: String,
    maxlength: 100000
  },
  access: {
    type: String,
    "enum": ['public', 'private', 'role'],
    "default": 'public'
  },
  role: {
    type: _mongoose["default"].Types.ObjectId,
    required: true,
    ref: 'roles'
  },
  timestamp: {
    type: Number,
    "default": new Date().getTime()
  }
}, {
  timestamps: true
});

var Document = _mongoose["default"].model('documents', docSchema);

var _default = Document;
exports["default"] = _default;