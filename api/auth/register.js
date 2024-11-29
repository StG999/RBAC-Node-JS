import express from 'express';
import supabase from '../../db/supabase.js';
import jsonwebtoken from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { generateTokens } from '../utils/utils.js';
import cache from '../../db/cache.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { user_id, password, role, device_id } = req.body;
  try {
    // CREATE USER
    // check if user exists
    const { data: userData, error } = await supabase
      .from('users')
      .select('id')
      .eq('user_id', user_id);
    if (error) {
      req.logger.error('Error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (userData.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // store user in db
    const { error: userError } = await supabase
      .from('users')
      .insert({ user_id: user_id, password_hash: hashedPassword, role: role });
    if (userError) {
      req.info('DB Error:', userError);
      return res.status(500).json({ error: 'Internal server error' });
    }

    // LOGIN USER
    // generate tokens
    const { accessToken, refreshToken } = generateTokens(
      user_id,
      role,
      device_id
    );

    // cache refresh token
    const key = `${user_id}:${device_id}`;
    cache.set(key, refreshToken);

    // return tokens
    req.logger.info(
      `User with user_id "${user_id}" registered and logged in successfully`
    );
    return res.status(200).json({
      message: 'User registered and logged in successfully',
      access_token: accessToken,
      refresh_token: refreshToken,
    });
  } catch (error) {
    req.logger.error('Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
