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

export default router;
