import express from 'express';
import _ from 'lodash';
import validate from '../api-validations/role';
import Role from '../models/role';

const router = express.Router();

//endpoint to create a new router
router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //search if a role with given title exist
  const existingRole = await Role.findOne({ title: req.body.title });
  if (existingRole) return res.status(400).send('role already exists');

  const newRole = await Role.create(_.pick(req.body, 'title'));
  return res.status(201).send(newRole);
});

export default router;
