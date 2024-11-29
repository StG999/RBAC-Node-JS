import express from 'express';
import { refreshAccessToken } from '../utils/utils.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { refresh_token, device_id } = req.body;
  try {
    const { newAccessToken, newRefreshToken } = refreshAccessToken(
      refresh_token,
      device_id
    );

    req.logger.info(`User "${req.user.user_id}" refreshed access token`);
    return res.status(200).json({
      message: 'Access token refreshed successfully',
      refresh_token: newRefreshToken,
      access_token: newAccessToken,
    });
  } catch (error) {
    req.logger.error('Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
