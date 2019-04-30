import bcrypt from 'bcrypt';
import express from 'express';
import _ from 'lodash';
import fawn from 'fawn';

import validate from '../api-validations/user';
import User from '../models/user';
import Role from '../models/role';
import authenticate from '../middleware/authentication';
import authorizeAdmin from '../middleware/admin-authorization';
import Document from '../models/document';
import login from '../middleware/login';

const router = express.Router();
//end point to create a route
router.post('/', async (req, res) => {
  //validating request payload
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //validating that new user is unique by checking if email or username is already in use
  const email = await User.findOne({ email: req.body.email });
  if (email) return res.status(400).send('email already in use');

  const userName = await User.findOne({ userName: req.body.userName });
  if (userName) return res.status(400).send('user name not available');

  //instantiating new user
  let newUser = new User(req.body);

  //hashing new user password
  const salt = await bcrypt.genSalt(10);
  newUser.password = await bcrypt.hash(newUser.password, salt);

  //assigning default role of regular to user when
  let role;
  if (req.body.roleId) {
    role = await Role.findById(req.body.roleId);
  }
  const regular = await Role.findOne({ title: 'regular' });
  newUser.role = role || regular._id;

  //saving new user to data base and returning response
  newUser = await newUser.save();
  return res
    .status(201)
    .send(_.pick(newUser, ['name', 'email', 'userName', 'role']));
});

//endpoint to get all document authored by a user
router.get('/:id/documents', login, async (req, res) => {
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
});

//endpoint to  view all users, only admin can view all users
router.get('/', [authenticate, authorizeAdmin], async (req, res) => {
  const users = await User.find();
  return res.send(users);
});

//endpoint for logged in user to view his details
router.get('/me', [authenticate], async (req, res) => {
  const users = await User.findById(req.user._id);

  return res.send(users);
});
export default router;

//endpoint to update details, only a logged in user can update his own account
router.put('/', authenticate, async (req, res) => {
  //validating the payload sent by client
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findByIdAndUpdate(req.user._id, req.body, {
    new: true
  });
  //any update the role of all documents created by the user
  await Document.updateMany({ ownerId: user._id }, { role: user.role });
  return res.send(_.pick(user, ['name', 'email', 'userName', 'role']));
});

//endpoint to delete a user, only a logged in user can delete his own record
router.delete('/', authenticate, async (req, res) => {
  const user = await User.findByIdAndDelete(req.user._id);
  return res.send(user);
});
