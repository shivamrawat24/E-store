const { validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');

/**
 * Runs after any validator chain; throws a formatted ApiError if any rule failed.
 * Shared across auth, category, and product validators to avoid duplication.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formatted = errors.array().map((e) => ({ field: e.path, message: e.msg }));
    throw ApiError.badRequest('Validation failed', formatted);
  }
  next();
};

module.exports = { validate };
