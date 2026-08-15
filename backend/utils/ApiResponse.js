/**
 * Standardized successful API response shape.
 * Keeps every endpoint's response envelope consistent for the frontend.
 */
class ApiResponse {
  constructor(statusCode, data = null, message = 'Success') {
    this.statusCode = statusCode;
    this.success = statusCode < 400;
    this.message = message;
    this.data = data;
  }
}

module.exports = ApiResponse;
