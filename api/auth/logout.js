import express from 'express';
import { removeRefreshKey } from '../utils/utils.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { user_id, device_id } = req.body;
  try {
    removeRefreshKey(user_id, device_id);
    req.logger.info(`User "${user_id}" logged out`);
    return res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    req.logger.error('Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
