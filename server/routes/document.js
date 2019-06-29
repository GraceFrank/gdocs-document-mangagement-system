import express from 'express';
import authenticate from '../middleware/authentication';
import login from '../middleware/login';
import validateId from '../middleware/validate-id';
import documentController from '../controller/documents';
const router = express.Router();

router.post('/', authenticate, documentController.post);

router.put('/:id', [validateId, authenticate], documentController.put);

router.get('/', login, documentController.get);

router.delete('/:id', [validateId, authenticate], documentController.delete);

router.get('/:id', [validateId, authenticate], documentController.getById);

export default router;
