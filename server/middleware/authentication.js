const jwt = require('jsonwebtoken');
const config = require('../../config/default');

function authenticate(req, res, next) {
  const token = req.header('x-auth-token');
  if (!token)
    return res.status(401).send({ error: 'access denied no token provided' });
  jwt.verify(token, config.privateKey, (err, decoded) => {
    console.log(err)
    if (decoded) {
      req.user = decoded;
      next();
    } else res.status(401).send({ error: 'access denied, invalid signature' });
  });
}

module.exports = authenticate;
