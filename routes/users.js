import express from 'express';
import _ from 'lodash';
import validate from '../api-validations/user';
import User from '../models/user';

const router = express.Router();
router.post('/', async (req, res) => {
  const email = await User.findOne({ email: req.body.email });
  if (email) return res.status(400).send('email already in use');

  const userName = await User.findOne({ userName: req.body.userName });
  if (userName) return res.status(400).send('user name not available');

  let newUser = new User(_.pick(req.body, ['name', 'email', 'userName']));
  newUser = await newUser.save();
  return res.status(201).send(newUser);
});

export default router;
