import express from 'express';
import authenticate from '../middleware/authentication';
import adminAuthorization from '../middleware/admin-authorization';
import validateId from '../middleware/validate-id';
import role from '../controller/role';

const router = express.Router();

//endpoint to create a new role
router.post('/', [authenticate, adminAuthorization], role.post);

//endpoint to get all roles
router.get('/', role.get);

//endpoint to get a role by its id
router.get('/:id', validateId, role.getById);

//endpoint to update an existing role
router.put('/:id', [validateId, authenticate, adminAuthorization], role.put);

export default router;
