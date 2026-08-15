const env = require('./config/env');
const logger = require('./config/logger');
const connectDB = require('./config/db');
const app = require('./app');

// Catch synchronous programming errors early
process.on('uncaughtException', (err) => {
  logger.error(`UNCAUGHT EXCEPTION: ${err.message}`, { stack: err.stack });
  process.exit(1);
});

let server;

const startServer = async () => {
  await connectDB();

  server = app.listen(env.PORT, () => {
    logger.info(`Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
  });
};

startServer();

// Catch unhandled promise rejections (e.g. failed async DB calls)
process.on('unhandledRejection', (err) => {
  logger.error(`UNHANDLED REJECTION: ${err.message}`, { stack: err.stack });
  if (server) {
    server.close(() => process.exit(1));
  } else {
    process.exit(1);
  }
});

// Graceful shutdown on termination signals
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully.');
  if (server) {
    server.close(() => {
      logger.info('Process terminated.');
    });
  }
});

module.exports = server;
