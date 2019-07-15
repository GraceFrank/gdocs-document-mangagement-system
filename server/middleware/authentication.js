import jwt from 'jsonwebtoken';
import config from '../../config/default';

function authenticate(req, res, next) {
  const token = req.header('x-auth-token');
  if (!token)
    return res.status(401).send({ error: 'access denied no token provided' });
  jwt.verify(token, config.privateKey, (err, decoded) => {
    if (decoded) {
      req.user = decoded;
      next();
    } else res.status(401).send({ error: 'access denied, invalid signature' });
  });
}

export default authenticate;
