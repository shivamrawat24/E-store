const rateLimit = require('express-rate-limit');
const env = require('../config/env');

/**
 * General API rate limiter applied to all routes.
 */
const apiLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MIN * 60 * 1000,
  max: env.RATE_LIMIT_MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP. Please try again later.',
  },
});

/**
 * Stricter limiter for sensitive authentication endpoints
 * (login, register, forgot-password) to mitigate brute-force / spam.
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again in 15 minutes.',
  },
});

module.exports = { apiLimiter, authLimiter };
