import express from 'express';
import supabase from '../../db/supabase.js';
import { comparePassword, generateTokens } from '../utils/utils.js';
import cache from '../../db/cache.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { user_id, password, device_id } = req.body;
  try {
    // check if user exists
    const { data: userData, error } = await supabase
      .from('users')
      .select('id, password_hash, role')
      .eq('user_id', user_id);
    if (error) {
      req.logger.error('DB Error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (userData.length === 0) {
      req.logger.info('User not found:', user_id);
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // compare passwords
    const match = await comparePassword(password, userData[0].password_hash);
    if (!match) {
      req.logger.info('Invalid credentials for user:', user_id);
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // generate tokens
    const { accessToken, refreshToken } = generateTokens(
      user_id,
      userData[0].role,
      device_id
    );

    // cache refresh token
    const key = `${user_id}:${device_id}`;
    cache.set(key, refreshToken);

    // return tokens
    req.logger.info(`User with user_id "${user_id}" logged in successfully`);
    return res.status(200).json({
      message: 'User logged in successfully',
      access_token: accessToken,
      refresh_token: refreshToken,
    });
  } catch (error) {
    req.logger.error('Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
