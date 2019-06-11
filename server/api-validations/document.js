import Joi from 'joi';
// import objId from 'joi-objectid';
// Joi.objectId = objId(Joi);

function validateDoc(document) {
  const schema = {
    title: Joi.string()
      .required()
      .max(1000),
    content: Joi.string().max(100000),
    access: Joi.string().valid(['public', 'private', 'role'])
  };
  return Joi.validate(document, schema);
}

export default validateDoc;
