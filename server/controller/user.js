import bcrypt from 'bcrypt';
import _ from 'lodash';
import validate from '../api-validations/user';
import User from '../models/user';
import Role from '../models/role';
import Document from '../models/document';
import { client } from '../startup/cache.js';
import logger from '../startup/logger';

class UserController {
  async get(req, res) {
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 20;

    let users = await client.hget(users, `page=${page}&limit=${limit}`);
    if (doc) {
      logger.info('fetching users from cache');
      return res.send({ message: 'ok', data: JSON.parse(users) });
    } else {
      users = await User.find()
        .skip((page - 1) * limit)
        .limit(limit);
      await client.hset(
        users,
        `page=${page}&limit=${limit}`,
        JSON.stringify(users)
      );
      return res.send({ message: 'ok', data: users });
    }
  }

  async put(req, res) {
    //validating the payload sent by client
    const { error } = validate(req.body);
    if (error) return res.status(400).send({ error: error.details[0].message });
    const update = req.body;
    update.password = await bcrypt.hash(update.password, 10);
    const user = await User.findByIdAndUpdate(req.user._id, update, {
      new: true
    });
    //any update the role of all documents created by the user
    await Document.updateMany({ ownerId: user._id }, { role: user.role });
    return res.send({
      message: 'ok',
      data: _.pick(user, ['name', 'email', 'userName', 'role'])
    });
  }

  async delete(req, res) {
    const user = await User.findByIdAndDelete(req.user._id);
    return res.send(user);
  }

  async getMe(req, res) {
    let user = await client.hget('userById', req.user._id);

    if (!user) {
      user = await User.findById(req.user._id);
      await client.hset('userById', req.user._id, JSON.stringify(user));
      return res.send({ message: 'ok', data: user });
    }
    return res.send({ message: 'ok', data: JSON.parse(user) });
  }

  async post(req, res) {
    //validating request payload
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //validating that new user is unique by checking if email or username is already in use
    const existingUser = await User.findOne().or([
      { email: req.body.email },
      { userName: req.body.userName }
    ]);
    if (existingUser)
      return res.status(409).send('email or username already in use');

    //instantiating new user
    let newUser = new User(req.body);

    //hashing new user password
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(newUser.password, salt);

    //assigning default role of regular to user when
    const regular = await Role.findOne({ title: 'regular' });
    newUser.role = regular._id;

    //saving new user to data base and returning response
    newUser = await newUser.save();
    return res
      .status(201)
      .send(_.pick(newUser, ['_id', 'name', 'email', 'userName', 'role']));
  }

  async getUserDocs(req, res) {
    const page = req.query.page * 1;
    const limit = req.query.limit * 1;

    //validating that valid query strings are provided
    if (!page || !limit) res.status(400).send('invalid query');

    //if the user is not logged in send only documents with public access
    if (!req.user) {
      docs = await Document.find({ ownerId: req.params.id, access: 'public' })
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ date: -1 });
      return res.send(docs);
    }

    const admin = await Role.findOne({ title: 'admin' });
    let docs;

    //if the user is an admin send him all documents except private access docs
    if (req.user.role == admin._id.toHexString()) {
      docs = await Document.find({
        access: { $ne: 'private' },
        ownerId: req.params.id
      })
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ date: -1 });
      return res.send(docs);
    }

    //if user is logged in and not an admin send him public documents and documents the one that matches same role as the user
    docs = await Document.find()
      .or([
        { access: 'public', ownerId: req.params.id },
        { role: req.user.role, access: 'role', ownerId: req.params.id }
      ])
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ date: -1 });
    return res.send(docs);
  }
}

module.exports = new UserController();
