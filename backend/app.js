const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const env = require('./config/env');
const logger = require('./config/logger');
const routes = require('./routes');
const { errorHandler, notFound } = require('./middlewares/errorMiddleware');
const { apiLimiter } = require('./middlewares/rateLimiter');

const app = express();

// Behind a proxy (Render, Heroku, Nginx) - needed for correct IPs / secure cookies
app.set('trust proxy', 1);

// ---------- Security middleware ----------
app.use(helmet());
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  })
);
app.use(mongoSanitize()); // strips $ and . operators from req.body/query/params
app.use(xss()); // sanitizes user input against basic XSS payloads
app.use(hpp()); // prevents HTTP parameter pollution

// ---------- Body / cookie parsing ----------
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// ---------- Logging ----------
if (env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
} else {
  app.use(
    morgan('combined', {
      stream: { write: (message) => logger.info(message.trim()) },
    })
  );
}

// ---------- Rate limiting ----------
app.use('/api', apiLimiter);

// ---------- Static uploads (local fallback; Cloudinary used for persistent storage) ----------
app.use('/uploads', express.static('uploads'));

// ---------- Routes ----------
app.get('/', (req, res) => {
  res.status(200).json({ success: true, message: 'Ecommerce API is running.' });
});
app.use('/api/v1', routes);

// ---------- 404 + Global error handler ----------
app.use(notFound);
app.use(errorHandler);

module.exports = app;
