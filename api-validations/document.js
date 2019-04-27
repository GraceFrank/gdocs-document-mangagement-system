import Joi from 'joi';
// import objId from 'joi-objectid';
// Joi.objectId = objId(Joi);

function validateDoc(document) {
  const schema = {
    ownerId: Joi.objectId().required(),
    title: Joi.string()
      .required()
      .maxlength(1000),
    content: Joi.string().maxlength(100000),
    access: Joi.string().valid(['public', 'private', 'role'])
  };
  return Joi.validate(document, schema);
}

export default validateDoc;
