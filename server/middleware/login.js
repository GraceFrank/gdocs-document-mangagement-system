const jwt = require('jsonwebtoken');
const config = require('../../config/default');

//this middle ware is routes that can be accessed by both logged in and not logged in users like the document.get all
function login(req, res, next) {
  const token = req.header('x-auth-token');
  //if token is not provided just move to the next
  if (!token) {
    return next();
  }
  //if token is provided and its valid, move to the next function in the route handler
  jwt.verify(token, config.privateKey, (err, decoded) => {
    if (decoded) {
      req.user = decoded;
      next();
    } else return res.status(401).send({ error: 'access denied, invalid signature' });
  });
}

module.exports = login;
