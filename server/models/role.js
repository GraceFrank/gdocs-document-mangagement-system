const mongoose = require('mongoose');

//defining schema for the role model
const roleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    maxlength: 20,
    lowercase: true
  }
});

//compiling the role schema into a model Class
const Role = mongoose.model('roles', roleSchema);

//Intermediary Class
class Roles {
  constructor(model) {
    this.model = model;
  }

  async create(object) {
    return await this.model.create(object);
  }

  async findOne(queryObject) {
    return await this.model.findOne(queryObject);
  }

  async findById(roleId) {
    return await this.model.findById(roleId);
  }

  async find(queryObject) {
    return await this.model.find(queryObject);
  }
}

module.exports = new Roles(Role);

//Todo: add caching for find one role
