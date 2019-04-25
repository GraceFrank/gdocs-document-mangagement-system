import Joi from 'joi';
import joiObjectId from 'joi-objectid';
Joi.objectId = joiObjectId(Joi);

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
      .min(5)
      .max(255),
    userName: Joi.string()
      .required()
      .min(3)
      .max(255),
    password: Joi.string()
      .required()
      .min(8)
      .max(255),
    roleId: Joi.objectId().required()
  };
  return Joi.validate(user, schema);
}

export default validateUser;
