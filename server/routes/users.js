const express = require('express');
const authenticate = require('../middleware/authentication');
const authorizeAdmin = require('../middleware/admin-authorization');
const login = require('../middleware/login');
const userController = require('../controller/user');
const router = express.Router();

//end point to create a new user
router.post('/', userController.post);

//endpoint to  view all users, only admin can view all users
router.get('/', [authenticate, authorizeAdmin], userController.get);

//endpoint for logged in user to view his details
router.get('/me', [authenticate], userController.getMe);

//endpoint to update details, only a logged in user can update his own account
router.put('/', authenticate, userController.put);

//endpoint to delete a user, only a logged in user can delete his own record
router.delete('/', authenticate, userController.delete);

module.exports = router;
