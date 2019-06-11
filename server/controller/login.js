import validate from '../api-validations/login';
import User from '../models/user';
import bcrypt from 'bcrypt';

class Login {
  async post(req, res) {
    const { error } = validate(req.body);
    if (error) return res.status(400).send({ error: error.details[0].message });

    //checking if email exist in db
    const user = await User.findOne({ email: req.body.email });
    if (!user)
      return res.status(400).send({ error: 'invalid email or password' });

    //validating the user password is correct
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!validPassword)
      return res.status(400).send({ error: 'invalid email or password' });

    const token = user.generateToken();

    res.send({ 'x-auth-token': token, message: `welcome ${user.name.first}` });
  }
}
module.exports = new Login();
