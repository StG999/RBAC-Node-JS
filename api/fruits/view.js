import express from 'express';
import supabase from '../../db/supabase.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase.from('fruits').select();
    if (error) {
      req.logger.error('Error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
    return res.status(200).json({ data });
  } catch (error) {
    req.logger.error('Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
