import express from 'express';
import view from './view.js';
import create from './create.js';
import authorize from '../../middleware/authorization.js';

const router = express.Router();

router.use('/view', authorize(['user', 'admin']), view);
router.use('/create', authorize(['admin']), create);

export default router;
