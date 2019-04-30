import express from 'express';
import _ from 'lodash';
import validate from '../api-validations/role';
import Role from '../models/role';
import authenticate from '../middleware/authentication';
import adminAuthorization from '../middleware/admin-authorization';
import validateId from '../middleware/validate-id';

const router = express.Router();

//endpoint to create a new role
router.post('/', [authenticate, adminAuthorization], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //search if a role with given title exist
  const existingRole = await Role.findOne({ title: req.body.title });
  if (existingRole) return res.status(400).send('role already exists');

  const newRole = await Role.create(_.pick(req.body, 'title'));
  return res.status(201).send(newRole);
});

//endpoint to get all routes
router.get('/', async (req, res) => {
  res.send(await Role.find());
});

//endpoint to get route by its id
router.get('/:id', validateId, async (req, res) => {
  res.send(await Role.findById(req.params.id));
});

//endpoint to create a new role
router.put(
  '/:id',
  [validateId, authenticate, adminAuthorization],
  async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //search if a role with given title exist
    const existingRole = await Role.findOne({ title: req.body.title });
    if (existingRole) return res.status(400).send('role already exists');

    const role = await Role.findByIdAndUpdate(req.params.id);
    if (!role) return res.status(404).send('no such role');
    return res.status(201).send(role);
  }
);

export default router;
