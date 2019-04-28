import express from 'express';
import authenticate from '../middleware/authentication';
import validate from '../api-validations/document';
import Document from '../models/document';
import login from '../middleware/login';
import Role from '../models/role';
import validateId from '../middleware/validate-id';
import User from '../models/user';
const router = express.Router();

router.post('/', authenticate, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //search if role already exists
  //TODO: write a function that checks if a doc exist in db use the function in both roles and users too
  const existingDoc = await Document.findOne({ title: req.body.title });
  if (existingDoc) return res.status(400).send('document already exists');

  const doc = await Document.create({
    ownerId: req.user._id,
    title: req.body.title,
    content: req.body.content,
    access: req.body.access || 'public',
    role: req.user.role
  });

  res.status(201).send(doc);
});

router.put('/:id', [validateId, authenticate], async (req, res) => {
  //validating users input
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //checking if document exist on db
  const doc = await Document.findById(req.params.id);
  if (!doc) return res.status(404).send('document not found');
  //check if user is the author of document
  if (doc.ownerId.toHexString() !== req.user._id)
    return res.status(403).send('access denied, only author can modify docs');

  const update = await Document.findOneAndUpdate(
    { _id: req.params.id },
    req.body,
    {
      new: true
    }
  );
  res.send(update);
});

export default router;
