/**
 * Centralized environment configuration.
 * Loads and validates all required environment variables in one place
 * so the rest of the app never touches `process.env` directly.
 */
const dotenv = require('dotenv');
dotenv.config();

const requiredInProduction = [
  'MONGO_URI',
  'JWT_ACCESS_SECRET',
  'JWT_REFRESH_SECRET',
  'SMTP_HOST',
  'SMTP_USER',
  'SMTP_PASS',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
  'RAZORPAY_KEY_ID',
  'RAZORPAY_KEY_SECRET',
];

const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT, 10) || 5000,
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',

  MONGO_URI: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecommerce_db',

  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES || '15m',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  JWT_REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES || '7d',
  JWT_COOKIE_EXPIRES_DAYS: parseInt(process.env.JWT_COOKIE_EXPIRES_DAYS, 10) || 7,

  EMAIL_VERIFY_TOKEN_EXPIRES_MIN: parseInt(process.env.EMAIL_VERIFY_TOKEN_EXPIRES_MIN, 10) || 30,
  PASSWORD_RESET_TOKEN_EXPIRES_MIN: parseInt(process.env.PASSWORD_RESET_TOKEN_EXPIRES_MIN, 10) || 15,

  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: parseInt(process.env.SMTP_PORT, 10) || 587,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  EMAIL_FROM: process.env.EMAIL_FROM || 'Ecommerce Store <no-reply@ecommercestore.com>',

  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,

  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET,

  RATE_LIMIT_WINDOW_MIN: parseInt(process.env.RATE_LIMIT_WINDOW_MIN, 10) || 15,
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100,
};

function validateEnv() {
  if (env.NODE_ENV === 'production') {
    const missing = requiredInProduction.filter((key) => !process.env[key]);
    if (missing.length > 0) {
      // eslint-disable-next-line no-console
      console.error(`FATAL ERROR: Missing required environment variables: ${missing.join(', ')}`);
      process.exit(1);
    }
  } else if (!env.JWT_ACCESS_SECRET || !env.JWT_REFRESH_SECRET) {
    // eslint-disable-next-line no-console
    console.warn(
      'WARNING: JWT_ACCESS_SECRET / JWT_REFRESH_SECRET not set. Using insecure development fallback secrets. Never do this in production.'
    );
    env.JWT_ACCESS_SECRET = env.JWT_ACCESS_SECRET || 'dev_access_secret_change_me';
    env.JWT_REFRESH_SECRET = env.JWT_REFRESH_SECRET || 'dev_refresh_secret_change_me';
  }
}

validateEnv();

module.exports = env;
