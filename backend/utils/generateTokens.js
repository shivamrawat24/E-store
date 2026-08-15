const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const env = require('../config/env');

/**
 * Generates a short-lived JWT access token carrying the user's id and role.
 */
const generateAccessToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES,
  });
};

/**
 * Generates a long-lived JWT refresh token carrying only the user's id.
 */
const generateRefreshToken = (user) => {
  return jwt.sign({ id: user._id, tokenVersion: user.tokenVersion || 0 }, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES,
  });
};

/**
 * Sends the refresh token as an httpOnly, secure cookie.
 * httpOnly prevents JS access (XSS mitigation); sameSite mitigates CSRF.
 */
const sendRefreshTokenCookie = (res, token) => {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: env.JWT_COOKIE_EXPIRES_DAYS * 24 * 60 * 60 * 1000,
    path: '/api/v1/auth',
  });
};

const clearRefreshTokenCookie = (res) => {
  res.clearCookie('refreshToken', { path: '/api/v1/auth' });
};

/**
 * Generates a random token + its SHA-256 hash.
 * The raw token is emailed to the user; only the hash is stored in the DB,
 * so a leaked database never exposes usable tokens.
 */
const generateHashedToken = () => {
  const rawToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');
  return { rawToken, hashedToken };
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  sendRefreshTokenCookie,
  clearRefreshTokenCookie,
  generateHashedToken,
};
