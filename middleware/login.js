import jwt from 'jsonwebtoken';
import config from 'config';

function login(req, res, next) {
  const token = req.header('x-auth-token');
  if (!token) return next();
  jwt.verify(token, config.get('jwtPrivateKey'), (err, decoded) => {
    if (decoded) {
      req.user = decoded;
      next();
    } else return res.status(401).send('access denied, invalid signature');
  });
}

export default login;
