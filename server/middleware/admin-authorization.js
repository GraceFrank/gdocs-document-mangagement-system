const { Role } = require('../models/');

//this middleware is for authorizing admins
async function authAdmin(req, res, next) {
  const admin = await Role.findOne({ title: 'admin' });

  //check if the the person is and admin and grants access else deny access
  if (req.user.roleId !== admin._id.toHexString())
    return res.status(403).send({ error: 'forbidden, unauthorized access' });
  next();
}

module.exports = authAdmin;
