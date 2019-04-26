import Role from '../models/role';

async function authAdmin(req, res, next) {
  const admin = await Role.findOne({ title: 'admin' });

  if (req.user.role !== admin._id.toHexString())
    return res.status(403).send('forbidden, unauthorized access');
  next();
}

export default authAdmin;
