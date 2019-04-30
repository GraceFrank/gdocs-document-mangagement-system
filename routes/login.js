import express from 'express';
import validate from '../api-validations/login';
import User from '../models/user';
import bcrypt from 'bcrypt';
const router = express.Router();

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findOne({ email: req.body.email });
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!user || !validPassword)
    return res.status(400).send('invalid email or password');

  const token = user.generateToken();
  res.header('x-auth-token', token).send(`welcome ${user.name.first}`);
});
export default router;
