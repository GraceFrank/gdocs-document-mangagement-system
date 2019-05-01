const mongoose = require('mongoose');

export default function validateId(req, res, next) {

  //checking if provided id is a valid mongoose id
  const validId = mongoose.Types.ObjectId.isValid(req.params.id);

  //deny access if id is invalid
  if (!validId) return res.status(404).send('invalid Id');
  next();
}
