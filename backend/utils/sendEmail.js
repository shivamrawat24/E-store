const nodemailer = require('nodemailer');
const env = require('../config/env');
const logger = require('../config/logger');

let transporter;

/**
 * Lazily creates a singleton Nodemailer transporter.
 */
const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_PORT === 465,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
    });
  }
  return transporter;
};

/**
 * Sends an email. Throws so the caller (controller) can decide how to
 * respond to the client if delivery fails.
 *
 * @param {{to: string, subject: string, html: string, text?: string}} options
 */
const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const info = await getTransporter().sendMail({
      from: env.EMAIL_FROM,
      to,
      subject,
      html,
      text,
    });
    logger.info(`Email sent to ${to} | messageId: ${info.messageId}`);
    return info;
  } catch (error) {
    logger.error(`Email sending failed to ${to}: ${error.message}`);
    throw error;
  }
};

module.exports = sendEmail;
