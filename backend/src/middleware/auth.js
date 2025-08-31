const jwt = require('jsonwebtoken');
const logger = require('../config/logger');

// Extract Bearer token
function getToken(req) {
  const h = req.header('authorization') || req.header('Authorization');
  if (!h) return null;
  const parts = h.split(' ');
  if (parts.length === 2 && /^Bearer$/i.test(parts[0])) return parts[1];
  return null;
}

const authenticateToken = async function auth(req, res, next) {
  try {
    const token = getToken(req);
    if (!token) return res.status(401).json({ status: 'error', message: 'Missing Bearer token' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.user) {
      return res.status(401).json({ status: 'error', message: 'Invalid token' });
    }

    req.auth = {
      user: decoded.user,
      role: decoded.user.role,
      userId: decoded.user.id
    };
    return next();
  } catch (err) {
    logger.error('Auth middleware error:', err);
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
}

module.exports = authenticateToken;

