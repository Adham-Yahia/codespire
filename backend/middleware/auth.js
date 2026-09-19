/**
 * auth.js  (middleware)
 * ---------------------
 * Protects routes by verifying the Bearer JWT supplied in the
 * Authorization header.  On success, attaches the authenticated
 * user document (without password) to req.user and calls next().
 */

const jwt  = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Cleanly extracts a Bearer token from the Authorization header.
 * Handles:
 * - Direct strings: 'Bearer <token>'
 * - Array of headers (if multiple were received)
 * - Comma-separated values (if duplicate headers were merged by proxies)
 * - Extra quotes or whitespace around the token
 * @param {string|string[]} authHeader
 * @returns {string|null} - extracted token or null
 */
const extractBearerToken = (authHeader) => {
  if (!authHeader) return null;
  const raw = Array.isArray(authHeader) ? authHeader[0] : authHeader;
  if (typeof raw !== 'string') return null;

  const entries = raw.split(',');
  for (const entry of entries) {
    const trimmed = entry.trim();
    const match = trimmed.match(/^Bearer\s+(.+)$/i);
    if (match) {
      const token = match[1].trim().replace(/^"+|"+$/g, '');
      if (token) return token;
    }
  }
  return null;
};

/**
 * protect  — Express middleware
 * Expects:  Authorization: Bearer <token>
 * Sets:     req.user  (Mongoose User document, password excluded)
 */
const protect = async (req, res, next) => {
  const token = extractBearerToken(req.headers.authorization);

  // Require a Bearer token
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No token provided — authorization denied'
    });
  }

  try {
    // Verify and decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Load the user, excluding the hashed password
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User belonging to this token no longer exists'
      });
    }

    req.user = user;
    next();
  } catch (err) {
    // Distinguish between common JWT error types for clear client messages
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token has expired' });
    }
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, message: 'Token is invalid' });
    }

    // Unexpected error — log it but don't leak details
    console.error('Auth middleware error:', err.message);
    return res.status(401).json({ success: false, message: 'Not authorized' });
  }
};

/**
 * optionalProtect — Express middleware
 * If a Bearer token is provided and valid, attaches req.user.
 * If no token or invalid, simply proceeds without failing.
 */
const optionalProtect = async (req, res, next) => {
  const token = extractBearerToken(req.headers.authorization);
  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    req.user = user || null;
  } catch (err) {
    req.user = null;
  }
  next();
};

module.exports = { protect, optionalProtect };
