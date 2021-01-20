const jwt = require("jsonwebtoken");
const config = require("../../config/default");

function authenticate(req, res, next) {
  console.log("Cookie", req.cookie);
  const token = req.header("Authorization");
  if (!token)
    return res.status(401).send({ error: "access denied no token provided" });
  jwt.verify(token, config.privateKey, (err, decoded) => {
    if (decoded) {
      req.user = decoded;
      next();
    } else res.status(401).send({ error: "access denied, invalid signature" });
  });
}

module.exports = authenticate;
