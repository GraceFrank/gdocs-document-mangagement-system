const _ = require('lodash');
const validate = require('../api-validations/role');
const Role = require('../models/role');
const response = require('../helpers/responses');

/**
 * Method to create a role
 * @param {object} req
 * @param {object} res
 * @return {object} JSON response
 */
class Roles {
  async post(req, res) {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //search if a role with given title exist as all role titles must be unique
    const existingRole = await Role.findOne({ title: req.body.title });
    if (existingRole) return res.status(400).send('role already exists');

    const newRole = await Role.create(_.pick(req.body, 'title'));
    return response.created(res, newRole);
  }

  /**
   * Method to fetch all roles
   * @param {object} req
   * @param {object} res
   * @return {object} JSON response
   */
  async get(req, res) {
    response.success(res, await Role.find());
  }

  /**
   * Method to fetch a role by it's id
   * @param {object} req
   * @param {object} res
   * @return {object} JSON response
   */
  async getById(req, res) {
    response.success(res, await Role.findById(req.params.id));
  }

  /**
   * Method to fetch a role by it's id
   * @param {object} req
   * @param {object} res
   * @return {object} JSON response
   */
  async put(req, res) {
    try {
      const { error } = validate(req.body);
      if (error)
        return response.badRequest(res, { message: error.details[0].message });

      //search if a role with given title exist
      const existingRole = await Role.findOne({
        title: req.body.title,
        _id: { $ne: req.params.id }
      });

      if (existingRole)
        return response.alreadyExists(res, { message: 'role already exists' });

      const role = await Role.findByIdAndUpdate(req.params.id, req.body);
      if (!role)
        return response.notFound(res, { message: 'document not found' });
      return response.success(res, role);
    } catch (error) {
      return response.internalError(res, { error });
    }
  }
}

module.exports = new Roles();
