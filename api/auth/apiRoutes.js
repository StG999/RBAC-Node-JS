import express from 'express';
import login from './login.js';
import logout from './logout.js';
import register from './register.js';
import authorize from '../../middleware/authorization.js';
import refresh from './refresh.js';

const router = express.Router();

router.use('/login', login);
router.use('/logout', authorize(['admin', 'user']), logout);
router.use('/register', register);
router.use('/refresh', authorize(['admin', 'user']), refresh);

export default router;
