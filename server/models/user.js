const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('../../config/default');

//name schema
const nameschema = new mongoose.Schema({
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
});

//defining the user schema,
const userSchema = new mongoose.Schema({
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
    type: mongoose.Types.ObjectId,
    ref: 'roles',
    required: true
  }
});

userSchema.methods.generateToken = function() {
  return jwt.sign({ userId: this._id, roleId: this.role }, config.privateKey);
};

//defining the user model
const userModel = mongoose.model('users', userSchema);

module.exports = userModel;
