import express from 'express';
import _ from 'lodash';
import validate from '../api-validations/user';
import User from '../models/user';
import Role from '../models/role';
import bcrypt from 'bcrypt';

const router = express.Router();
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

  //assigning default role of regular to user
  const regular = await Role.findOne({ title: 'regular' });
  newUser.role = regular._id;

  //saving new user to data base and returning response
  newUser = await newUser.save();
  return res.status(201).send(newUser);
});

export default router;
