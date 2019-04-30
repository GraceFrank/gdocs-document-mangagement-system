import express from 'express';
import validate from '../api-validations/login';
import User from '../models/user';
import bcrypt from 'bcrypt';
const router = express.Router();

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //checking if email exist in db
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send('invalid email or password');

  //validating the user password is correct
  const validPassword = await bcrypt.compare(req.body.password, user.password);

  if (!validPassword) return res.status(400).send('invalid email or password');

  const token = user.generateToken();
  res.header('x-auth-token', token).send(`welcome ${user.name.first}`);
});
export default router;
