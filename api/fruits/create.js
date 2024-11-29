import express from 'express';
import supabase from '../../db/supabase.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { name, rating } = req.body;
  try {
    const { data, error } = await supabase
      .from('fruits')
      .insert({ name: name, rating: rating })
      .select('id');
    if (error) {
      req.logger.error('Error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }

    req.logger.info(`Fruit successfully added with id: ${data[0].id}!`);
    return res
      .status(200)
      .json({ message: `Fruit successfully added with id: ${data[0].id}!` });
  } catch (error) {
    req.logger.error('Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
