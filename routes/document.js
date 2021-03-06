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

  //Todo: refactor
  //check if user is the author of document
  if (doc.ownerId.toHexString() !== req.user._id)
    return res.status(403).send('access denied, only author can modify docs');

  //check that doc title is unique
  const existingDoc = await Document.findOne({ title: req.body.title });
  if (existingDoc) return res.status(400).send('document already exists');

  const update = await Document.findOneAndUpdate(
    { _id: req.params.id },
    req.body,
    {
      new: true
    }
  );
  res.send(update);
});

router.get('/all', login, async (req, res) => {
  //Todo: validate query
  const page = req.query.page * 1;
  const limit = req.query.limit * 1;

  if (!page || !limit) res.status(400).send('invalid query');

  if (!req.user) {
    docs = await Document.find({ access: 'public' })
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ date: -1 });
    return res.send(docs);
  }

  const admin = await Role.findOne({ title: 'admin' });
  let docs;

  if (req.user.role == admin._id.toHexString()) {
    docs = await Document.find()
      .or([
        { access: 'private', ownerId: req.user._id },
        { access: { $ne: 'private' } }
      ])
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ date: -1 });
    return res.send(docs);
  }

  docs = await Document.find()
    .or([
      { access: 'private', ownerId: req.user._id },
      { access: 'public' },
      { role: req.user.role, access: 'role' }
    ])
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ date: -1 });
  return res.send(docs);
});

router.delete('/:id', [validateId, authenticate], async (req, res) => {
  //checking if document exist on db
  const doc = await Document.findById(req.params.id);
  if (!doc) return res.status(404).send('document not found');

  //check if user is the author of document
  if (doc.ownerId.toHexString() != req.user._id)
    return res.status(403).send('access denied, only author can modify docs');

  const deleted = await Document.findByIdAndDelete(doc._id);
  res.send(deleted);
});

router.get('/:id', [validateId, login], async (req, res) => {
  const doc = await Document.findById(req.params.id);
  if (!doc) return res.status(404).send('document not found');

  class GrantAccess {
    isAdmin() {
      const admin = Role.findOne({ title: admin });
      return req.user.role == admin._id;
    }
    public() {
      res.send(doc);
    }

    role() {
      if (doc.role == req.user.role || this.isAdmin()) {
        return res.send(doc);
      } else return res.status(403).send('unauthorized access denied');
    }

    private() {
      if (doc.ownerId == req.user._id) {
        return res.send(doc);
      } else
        return res
          .status(403)
          .send('unauthorized access denied, private document ');
    }
  }

  new GrantAccess()[doc.access]();
});

export default router;
