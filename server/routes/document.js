const express = require ('express');
const authenticate = require ('../middleware/authentication');
const login = require ('../middleware/login');
const validateId = require ('../middleware/validate-id');
const documentController = require ('../controller/documents');
const router = express.Router();

router.post('/', authenticate, documentController.post);

router.put('/:id', [validateId, authenticate], documentController.put);

router.get('/', login, documentController.get);

router.delete('/:id', [validateId, authenticate], documentController.delete);

router.get('/:id', [validateId, authenticate], documentController.getById);

module.exports = router;
