import express from 'express';
import apiRouter from './api/fruits/apiRoutes.js';
import apiAuthRouter from './api/auth/apiRoutes.js';
import rateLimiter from './middleware/rateLimiter.js';
import { attachLogger } from './middleware/logger.js';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(rateLimiter);
app.use(attachLogger);

// Heartbeat endpoint
app.get('/heartbeat', (req, res) => {
  req.logger.info('Server is alive');
  return res.status(200).json({ message: 'Server is alive 🚀' });
});

// API routes
app.use('/auth', apiAuthRouter);
app.use('/api/', apiRouter);

// 404 error handling middleware
app.use((req, res) => {
  req.logger.warn('Error 404: Route not found');
  return res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  const errorDetails = {
    url: req.originalUrl,
    method: req.method,
    message: err.message,
    stack: err.stack,
  };
  req.logger.error('Error:', errorDetails);
  return res
    .status(500)
    .json({ error: 'Unforeseen error. Something went wrong' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
