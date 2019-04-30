import jwt from 'jsonwebtoken';
import config from 'config';

function authenticate(req, res, next) {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).send('access denied no token provided');
  jwt.verify(token, config.get('jwtPrivateKey'), (err, decoded) => {
    if (decoded) {
      req.user = decoded;
      next();
    } else res.status(401).send('access denied, invalid signature');
  });
}

export default authenticate;
