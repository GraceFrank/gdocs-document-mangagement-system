import validate from '../api-validations/document';
import Document from '../models/document';
import Role from '../models/role';
import { client, connectToRedis } from '../startup/cache';
import logger from '../startup/logger';

class Documents {
  async post(req, res) {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //search if role already exists
    const existingDoc = await Document.findOne({ title: req.body.title });
    if (existingDoc) return res.status(400).send('document already exists');

    const doc = await Document.create({
      ownerId: req.user._id,
      title: req.body.title,
      content: req.body.content,
      access: req.body.access || 'public',
      role: req.user.role
    });
    //clear cache
    await client.del('documents');

    res.status(201).send(doc);
  }

  async get(req, res, next) {
    // validate query
    const page = req.query.page * 1;
    const limit = req.query.limit * 1;

    if (!page || !limit) res.status(400).send('invalid query');

    if (!req.user) {
      const cachedDocs = await client.hget(
        'documents',
        `public-${page}-${limit}`
      );
      if (cachedDocs) {
        logger.info('fetching from cache');
        return res.send(JSON.parse(cachedDocs));
      }
      const docs = await Document.find({ access: 'public' })
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ date: -1 });

      logger.info('fetcing from MongoDB');
      res.send(docs);

      client.hset('documents', `public-${page}-${limit}`, JSON.stringify(docs));
      return;
    }

    const admin = await Role.findOne({ title: 'admin' });
    let docs;

    if (req.user.role == admin._id.toHexString()) {
      const cachedDocs = await client.hget(
        'documents',
        `${req.user._id}-${page}-${limit}`
      );
      if (cachedDocs) {
        logger.info('fetching from cache');
        return res.send(JSON.parse(cachedDocs));
      }

      docs = await Document.find()
        .or([
          { access: 'private', ownerId: req.user._id },
          { access: { $ne: 'private' } }
        ])
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ date: -1 });
      res.send(docs);
      logger.info('fetching from mongoDb');
      client.hset(
        'documents',
        `${req.user._id}-${page}-${limit}`,
        JSON.stringify(docs)
      );
      return;
    }

    const cachedDocs = await client.hget(
      'documents',
      `${req.user._id}-${page}-${limit}`
    );
    if (cachedDocs) {
      logger.info('fetching from cache');
      return res.send(JSON.parse(cachedDocs));
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
    res.send(docs);
    client.hset(
      'documents',
      `${req.user._id}-${page}-${limit}`,
      JSON.stringify(docs)
    );
    return;
  }

  async put(req, res) {
    //validating users input
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //checking if document exist on db, and is authored by user
    const doc = await Document.findOne({
      _id: req.params.id,
      ownerId: req.user._id
    });
    if (!doc) return res.status(404).send('document not found');

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
    await client.del('documents');
    const docIsCached = await client.hexists('documentById', req.params.id);
    if (docIsCached) await client.hdel('documentById', req.params.id);
    res.send(update);
  }

  async delete(req, res) {
    //checking if document exist on db
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).send('document not found');

    //check if user is the author of document
    if (doc.ownerId.toHexString() != req.user._id)
      return res.status(403).send('access denied, only author can modify docs');

    const deleted = await Document.findByIdAndDelete(doc._id);
    await client.del('documents');
    const docIsCached = await client.hexists('documentById', req.params.id);
    if (docIsCached) await client.hdel('documentById', req.params.id);
    res.send(deleted);
  }

  async getById(req, res) {
    let doc = await client.hget('documentById', req.params.id);
    if (doc) {
      doc = JSON.parse(doc);
      logger.info('fetching from cache');
    } else {
      doc = await Document.findById(req.params.id);
      if (!doc) return res.status(404).send('document not found');
      logger.info('fetching from MongoDB');
      await client.hset('documentById', req.params.id, JSON.stringify(doc));
    }
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
  }
}

export default new Documents();
