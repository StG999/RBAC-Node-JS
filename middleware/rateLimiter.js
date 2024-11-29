import { rateLimit } from 'express-rate-limit';

const limitHandler = (req, res, options) => {
  req.logger.warn(`Rate limit exceeded for IP- ${req.ip}`);
  res.status(options.statusCode).json({ message: options.message });
};

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  limit: 50, // Limit each IP to 50 requests per `window` (here, per 1 minute)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res, next, options) => limitHandler(req, res, options),
  keyGenerator: (req) => {
    const forwardedFor = req.headers['x-forwarded-for']
      ? req.headers['x-forwarded-for'].toString().split(':')[0]
      : req.ip;
    return forwardedFor;
  },
});

export default limiter;
