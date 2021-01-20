const Joi = require('joi');
const objId = require('joi-objectid');
Joi.objectId = objId(Joi);

function validateUser(user) {
  const schema = {
    name: Joi.object()
      .keys({
        first: Joi.string()
          .required()
          .min(2)
          .max(255),
        last: Joi.string()
          .required()
          .min(2)
          .max(255)
      })
      .required(),

    email: Joi.string()
      .required()
      .email(),
    userName: Joi.string()
      .required()
      .min(3)
      .max(255),
    password: Joi.string()
      .required()
      .min(8)
      .max(255)
  };
  return Joi.validate(user, schema);
}
module.exports = validateUser;
