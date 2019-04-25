import express from 'express';
import _ from 'lodash';
import validate from '../api-validations/role';
import Role from '../models/role';

import 'babel-polyfill';

const router = express.Router();

//endpoint to create a new router
router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const newRole = await Role.create(_.pick(req.body, 'title'));
  return res.status(201).send(newRole);
});

export default router;
