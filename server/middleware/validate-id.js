const mongoose = require('mongoose');
const response = require('../helpers/responses');

module.exports = function validateId(req, res, next) {
  //checking if provided id is a valid mongoose id
  const validId = mongoose.Types.ObjectId.isValid(req.params.id);

  //deny access if id is invalid
  if (!validId) return response.badRequest(res, { message: 'invalid Id' });
  next();
};
