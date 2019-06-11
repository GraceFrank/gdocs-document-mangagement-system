"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = validateId;

var mongoose = require('mongoose');

function validateId(req, res, next) {
  //checking if provided id is a valid mongoose id
  var validId = mongoose.Types.ObjectId.isValid(req.params.id); //deny access if id is invalid

  if (!validId) return res.status(404).send({
    error: 'invalid Id'
  });
  next();
}