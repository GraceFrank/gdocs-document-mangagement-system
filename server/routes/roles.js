const express = require('express');
const authenticate = require('../middleware/authentication');
const adminAuthorization = require('../middleware/admin-authorization');
const validateId = require('../middleware/validate-id');
const role = require('../controller/role');

const router = express.Router();

//endpoint to create a new role
router.post('/', [authenticate, adminAuthorization], role.post);

//endpoint to get all roles
router.get('/', [authenticate, adminAuthorization], role.get);

//endpoint to get a role by its id
router.get('/:id', [validateId, authenticate, adminAuthorization], role.getById);

//endpoint to update an existing role
router.put('/:id', [validateId, authenticate, adminAuthorization], role.put);

module.exports = router;
