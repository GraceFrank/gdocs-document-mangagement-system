const _ = require ('lodash');
const validate = require ('../api-validations/role');
const Role = require ('../models/role');

class Roles {
  async post(req, res) {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //search if a role with given title exist as all role titles must be unique
    const existingRole = await Role.findOne({ title: req.body.title });
    if (existingRole) return res.status(400).send('role already exists');

    const newRole = await Role.create(_.pick(req.body, 'title'));
    return res.status(201).send(newRole);
  }

  async get(req, res) {
    res.send(await Role.find());
  }

  async getById(req, res) {
    res.send(await Role.findById(req.params.id));
  }

  async put(req, res) {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //search if a role with given title exist
    const existingRole = await Role.findOne({
      title: req.body.title,
      _id: { $ne: req.params._id }
    });
    if (existingRole) return res.status(409).send('role already exists');

    const role = await Role.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });
    if (!role) return res.status(404).send('no such role');
    return res.status(200).send(role);
  }
}

module.exports = new Roles();
