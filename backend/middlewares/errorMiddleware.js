const env = require('../config/env');
const logger = require('../config/logger');
const ApiError = require('../utils/ApiError');

/**
 * Converts known third-party / native errors (Mongoose, JWT, etc.) into
 * our own ApiError so the response shape stays consistent.
 */
const normalizeError = (err) => {
  if (err instanceof ApiError) return err;

  // Mongoose invalid ObjectId
  if (err.name === 'CastError') {
    return ApiError.badRequest(`Invalid value for field "${err.path}": ${err.value}`);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0];
    return ApiError.conflict(`${field ? field.charAt(0).toUpperCase() + field.slice(1) : 'Field'} already exists.`);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => ({ field: e.path, message: e.message }));
    return ApiError.badRequest('Validation failed', errors);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return ApiError.unauthorized('Invalid token. Please log in again.');
  }
  if (err.name === 'TokenExpiredError') {
    return ApiError.unauthorized('Your token has expired. Please log in again.');
  }

  // Multer errors
  if (err.name === 'MulterError') {
    return ApiError.badRequest(`File upload error: ${err.message}`);
  }

  return new ApiError(err.statusCode || 500, err.message || 'Internal Server Error', [], err.stack);
};

/**
 * Global error handling middleware. Must be registered last, after all routes.
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  const error = normalizeError(err);

  if (error.statusCode >= 500) {
    logger.error(`${req.method} ${req.originalUrl} - ${error.message}`, { stack: error.stack });
  } else {
    logger.warn(`${req.method} ${req.originalUrl} - ${error.message}`);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message,
    errors: error.errors && error.errors.length > 0 ? error.errors : undefined,
    stack: env.NODE_ENV === 'development' ? error.stack : undefined,
  });
};

/**
 * Catches requests to undefined routes.
 */
const notFound = (req, res, next) => {
  next(ApiError.notFound(`Route not found: ${req.originalUrl}`));
};

module.exports = { errorHandler, notFound };
