const jwt = require('jsonwebtoken');
const env = require('../config/env');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const User = require('../models/User');

/**
 * Protects a route: requires a valid access token in the Authorization header.
 * Attaches the authenticated user document to req.user.
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    throw ApiError.unauthorized('You are not logged in. Please log in to access this resource.');
  }

  let decoded;
  try {
    decoded = jwt.verify(token, env.JWT_ACCESS_SECRET);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw ApiError.unauthorized('Your session has expired. Please log in again.');
    }
    throw ApiError.unauthorized('Invalid authentication token.');
  }

  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    throw ApiError.unauthorized('The user belonging to this token no longer exists.');
  }

  if (!currentUser.isActive) {
    throw ApiError.forbidden('This account has been deactivated.');
  }

  if (currentUser.changedPasswordAfter(decoded.iat)) {
    throw ApiError.unauthorized('Password was recently changed. Please log in again.');
  }

  req.user = currentUser;
  next();
});

/**
 * Restricts a route to specific roles.
 * Usage: restrictTo('admin') or restrictTo('admin', 'user')
 */
const restrictTo = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    throw ApiError.forbidden('You do not have permission to perform this action.');
  }
  next();
};

/**
 * Optional authentication: attaches req.user if a valid access token is
 * present, but never throws if it's missing or invalid. Used on public
 * GET routes that want to slightly change behavior for logged-in admins
 * (e.g. showing inactive categories) without requiring a login.
 */
const softAuth = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return next();

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET);
    const currentUser = await User.findById(decoded.id);
    if (currentUser && currentUser.isActive && !currentUser.changedPasswordAfter(decoded.iat)) {
      req.user = currentUser;
    }
  } catch (error) {
    // Silently ignore invalid/expired tokens on optional-auth routes
  }
  next();
});

module.exports = { protect, restrictTo, softAuth };
