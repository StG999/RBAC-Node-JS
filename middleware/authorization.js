import { verifyToken } from '../api/utils/utils.js';

const authorize = (allowedRoles) => (req, res, next) => {
  const { authorization } = req.headers;
  // check auth header
  if (!authorization) {
    req.logger.warn('Unauthorized: No authorization header');
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const token = authorization.split(' ')[1];

  // verify token
  const decoded = verifyToken(token);
  if (!decoded) {
    req.logger.warn('Unauthorized: Invalid token');
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // check if user has the right role
  if (!allowedRoles.includes(decoded.role)) {
    req.logger.warn('Forbidden User:' + decoded.user_id);
    return res.status(403).json({ error: 'Forbidden' });
  }

  // create user object on request
  req.user = decoded;

  next();
};

export default authorize;
