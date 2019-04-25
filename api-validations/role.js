import Joi from 'joi';
import { join } from 'path';

function validateRole(roleObject) {
  const schema = {
    title: Joi.string()
      .required()
      .min(2)
      .max(20)
  };
  return Joi.validate(roleObject, schema);
}

export default validateRole;
