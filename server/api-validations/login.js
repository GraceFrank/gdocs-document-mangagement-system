const Joi = require ('joi');

//function to validate that user provides required valid login details
function validateLoginDetails(payload) {
  //defining the schema of the payload
  const schema = {
    email: Joi.string()
      .email()
      .max(255)
      .min(5)
      .required(),
    password: Joi.string().required()
  };

  return Joi.validate(payload, schema);
}

module.exports = validateLoginDetails;
