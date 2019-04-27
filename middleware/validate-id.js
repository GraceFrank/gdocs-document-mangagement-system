const mongoose = require('mongoose');

export default function validateId(req, res, next) {
  const validId = mongoose.Types.ObjectId.isValid(req.params.id);
  if (!validId) return res.status(404).send('invalid Id');
  next();
}
