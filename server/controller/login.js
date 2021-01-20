const validate = require("../api-validations/login");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const _ = require("lodash");

class Login {
  async post(req, res) {
    const { error } = validate(req.body);
    if (error) return res.status(400).send({ error: error.details[0].message });

    //checking if email exist in db
    const user = await User.findOne({ email: req.body.email });
    if (!user)
      return res.status(400).send({ error: "invalid email or password" });

    //validating the user password is correct
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!validPassword)
      return res.status(400).send({ error: "invalid email or password" });

    const token = user.generateToken();
    res.cookie("token", token, { httpOnly: true });

    res.send({
      Authorization: token,
      message: "ok",
      data: _.pick(user, ["_id", "name", "email", "userName", "role"]),
    });
  }
}

module.exports = new Login();
