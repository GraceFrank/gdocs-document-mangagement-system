import Joi from 'joi';

//function to validate that user provides required valid login details
function validateLoginDetails(payload) {
  //defining the schema of the payload
  const schema = {
    email: Joi.string()
      .email()
      .max(1)
      .min(5),
    password: Joi.string().min(8)
  };

  return Joi.validate(payload, schema);
}

export default validateLoginDetails;
