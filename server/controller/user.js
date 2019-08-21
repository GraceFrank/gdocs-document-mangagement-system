const bcrypt = require('bcrypt');
const _ = require('lodash');
const validate = require('../api-validations/user');
const { User, Document, Role } = require('../models/');
const response = require('../helpers/responses');

class UserController {
  /**
   * Method to get users
   * @param {object} req
   * @param {object} res
   * @return {object} JSON response
   */
  async get(req, res) {
    try {
      // convert query to number
      let page = Number(req.query.page);
      let limit = Number(req.query.limit);

      //assign default values if query params are invalid
      page = page ? page : 1;
      limit = limit ? limit : 20;

      const users = await User.find(
        {},
        {
          skip: (page - 1) * limit,
          limit: limit
        }
      );

      const message =
        'Array of 0 or more documents has been fetched successfully';
      return response.success(res, { message, users });
    } catch (error) {
      return response.internalError(res, { error });
    }
  }

  /**
   * Method to update a user
   * @param {object} req
   * @param {object} res
   * @return {object} JSON response
   */
  async put(req, res) {
    try {
      //validating the payload sent by client
      const { error } = validate(req.body);
      if (error)
        return res.status(400).send({ error: error.details[0].message });
      const update = req.body;

      //hash new passworkd
      update.password = await bcrypt.hash(update.password, 10);

      //check if new email address is unique
      const userWithSameEmail = await User.findOne({
        email: req.body.email,
        _id: { $ne: req.user.userId }
      });
      if (userWithSameEmail)
        return response.alreadyExists(res, { message: 'email already in use' });
      //update the user in database
      const user = await User.findByIdAndUpdate(req.user.userId, req.body);

      return response.success(
        res,
        _.pick(user, ['name', 'email', 'userName', 'role'])
      );
    } catch (error) {
      return response.send(res, { error });
    }
  }

  /**
   * Method to delete a user
   * @param {object} req
   * @param {object} res
   * @return {object} JSON response
   */
  async delete(req, res) {
    try {
      const user = await User.findByIdAndDelete(req.user._id);
      return response.success(res, user);
    } catch (error) {
      return response.internalError(res, {
        message: 'error deleting user',
        error
      });
    }
  }

  /**
   * Method to fetch logedin  user
   * @param {object} req
   * @param {object} res
   * @return {object} JSON response
   */
  async getMe(req, res) {
    try {
      const user = await User.findById(req.user.userId);
      return response.success(res, user);
    } catch (error) {
      return response.internalError(res, { error });
    }
  }

  /**
   * Method to create a user
   * @param {object} req
   * @param {object} res
   * @return {object} JSON response
   */
  async post(req, res) {
    try {
      //validating request payload
      const { error } = validate(req.body);
      if (error) return res.status(400).send(error.details[0].message);

      //validating that new user is unique by checking if email or username is already in use
      const existingUser = await User.findOne({
        $or: [{ email: req.body.email }, { userName: req.body.userName }]
      });
      if (existingUser)
        return res.status(409).send('email or username already in use');

      //instantiating new user
      let newUser = req.body;

      //hashing new user password
      const salt = await bcrypt.genSalt(10);
      newUser.password = await bcrypt.hash(newUser.password, salt);

      //assigning default role of regular to user when
      const regular = await Role.findOne({ title: 'regular' });
      newUser.role = regular._id;

      //saving new user to data base and returning response
      newUser = await User.create(newUser);
      return response.created(
        res,
        _.pick(newUser, ['_id', 'name', 'email', 'userName', 'role'])
      );
    } catch (error) {
      return response.internalError(res, { error });
    }
  }
}

module.exports = new UserController();
