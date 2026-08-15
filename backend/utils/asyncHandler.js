/**
 * Wraps an async Express route handler so any thrown error / rejected
 * promise is automatically forwarded to the global error middleware
 * via next(err), removing the need for try/catch in every controller.
 *
 * @param {Function} requestHandler
 * @returns {Function}
 */
const asyncHandler = (requestHandler) => (req, res, next) => {
  Promise.resolve(requestHandler(req, res, next)).catch(next);
};

module.exports = asyncHandler;
