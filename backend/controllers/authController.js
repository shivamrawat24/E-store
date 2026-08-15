const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const env = require('../config/env');
const logger = require('../config/logger');
const sendEmail = require('../utils/sendEmail');
const { verificationEmailTemplate, passwordResetEmailTemplate } = require('../utils/emailTemplates');
const {
  generateAccessToken,
  generateRefreshToken,
  sendRefreshTokenCookie,
  clearRefreshTokenCookie,
} = require('../utils/generateTokens');

/**
 * Builds the auth payload (user + access token) and attaches the refresh
 * token as an httpOnly cookie on the response.
 */
const issueAuthSession = (user, res, statusCode, message) => {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  sendRefreshTokenCookie(res, refreshToken);

  return res.status(statusCode).json(
    new ApiResponse(
      statusCode,
      {
        user,
        accessToken,
      },
      message
    )
  );
};

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register a new user and send an email verification link
 * @access  Public
 */
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw ApiError.conflict('An account with this email already exists.');
  }

  const user = await User.create({ name, email, password });

  const rawToken = user.createEmailVerificationToken(env.EMAIL_VERIFY_TOKEN_EXPIRES_MIN);
  await user.save({ validateBeforeSave: false });

  const verifyUrl = `${env.CLIENT_URL}/verify-email/${rawToken}`;

  try {
    await sendEmail({
      to: user.email,
      subject: 'Verify your email address',
      html: verificationEmailTemplate({
        name: user.name,
        verifyUrl,
        expiresInMinutes: env.EMAIL_VERIFY_TOKEN_EXPIRES_MIN,
      }),
    });
  } catch (error) {
    logger.error(`Failed to send verification email to ${user.email}: ${error.message}`);
    // Registration still succeeds; user can request a resend later.
  }

  return res
    .status(201)
    .json(new ApiResponse(201, { user }, 'Registration successful. Please check your email to verify your account.'));
});

/**
 * @route   GET /api/v1/auth/verify-email/:token
 * @desc    Verify a user's email using the token emailed to them
 * @access  Public
 */
const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpires: { $gt: Date.now() },
  }).select('+emailVerificationToken +emailVerificationExpires');

  if (!user) {
    throw ApiError.badRequest('Verification link is invalid or has expired.');
  }

  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;
  await user.save({ validateBeforeSave: false });

  return res.status(200).json(new ApiResponse(200, { user }, 'Email verified successfully. You can now log in.'));
});

/**
 * @route   POST /api/v1/auth/resend-verification
 * @desc    Resend the email verification link
 * @access  Public
 */
const resendVerification = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) throw ApiError.badRequest('Email is required.');

  const user = await User.findOne({ email });
  // Respond generically either way to avoid leaking which emails are registered
  const genericMessage = 'If an account with that email exists and is unverified, a new verification link has been sent.';

  if (!user || user.isEmailVerified) {
    return res.status(200).json(new ApiResponse(200, null, genericMessage));
  }

  const rawToken = user.createEmailVerificationToken(env.EMAIL_VERIFY_TOKEN_EXPIRES_MIN);
  await user.save({ validateBeforeSave: false });

  const verifyUrl = `${env.CLIENT_URL}/verify-email/${rawToken}`;
  await sendEmail({
    to: user.email,
    subject: 'Verify your email address',
    html: verificationEmailTemplate({
      name: user.name,
      verifyUrl,
      expiresInMinutes: env.EMAIL_VERIFY_TOKEN_EXPIRES_MIN,
    }),
  });

  return res.status(200).json(new ApiResponse(200, null, genericMessage));
});

/**
 * @route   POST /api/v1/auth/login
 * @desc    Authenticate a user and issue access + refresh tokens
 * @access  Public
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw ApiError.unauthorized('Invalid email or password.');
  }

  if (!user.isActive) {
    throw ApiError.forbidden('This account has been deactivated. Contact support.');
  }

  user.lastLoginAt = new Date();
  await user.save({ validateBeforeSave: false });

  return issueAuthSession(user, res, 200, 'Login successful.');
});

/**
 * @route   POST /api/v1/auth/refresh-token
 * @desc    Issue a new access token using a valid refresh token cookie
 * @access  Public (requires valid refresh cookie)
 */
const refreshToken = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (!token) {
    throw ApiError.unauthorized('No refresh token provided. Please log in again.');
  }

  let decoded;
  try {
    decoded = jwt.verify(token, env.JWT_REFRESH_SECRET);
  } catch (error) {
    clearRefreshTokenCookie(res);
    throw ApiError.unauthorized('Invalid or expired refresh token. Please log in again.');
  }

  const user = await User.findById(decoded.id);
  if (!user || !user.isActive) {
    clearRefreshTokenCookie(res);
    throw ApiError.unauthorized('User no longer exists or is inactive.');
  }

  if ((user.tokenVersion || 0) !== decoded.tokenVersion) {
    clearRefreshTokenCookie(res);
    throw ApiError.unauthorized('Refresh token has been revoked. Please log in again.');
  }

  const accessToken = generateAccessToken(user);
  return res.status(200).json(new ApiResponse(200, { accessToken }, 'Access token refreshed.'));
});

/**
 * @route   POST /api/v1/auth/logout
 * @desc    Clear the refresh token cookie, ending the session
 * @access  Private
 */
const logout = asyncHandler(async (req, res) => {
  clearRefreshTokenCookie(res);
  return res.status(200).json(new ApiResponse(200, null, 'Logged out successfully.'));
});

/**
 * @route   POST /api/v1/auth/forgot-password
 * @desc    Send a password reset link to the user's email
 * @access  Public
 */
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  const genericMessage = 'If an account with that email exists, a password reset link has been sent.';
  if (!user) {
    return res.status(200).json(new ApiResponse(200, null, genericMessage));
  }

  const rawToken = user.createPasswordResetToken(env.PASSWORD_RESET_TOKEN_EXPIRES_MIN);
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${env.CLIENT_URL}/reset-password/${rawToken}`;

  try {
    await sendEmail({
      to: user.email,
      subject: 'Reset your password',
      html: passwordResetEmailTemplate({
        name: user.name,
        resetUrl,
        expiresInMinutes: env.PASSWORD_RESET_TOKEN_EXPIRES_MIN,
      }),
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    logger.error(`Failed to send password reset email to ${user.email}: ${error.message}`);
    throw ApiError.internal('Failed to send password reset email. Please try again later.');
  }

  return res.status(200).json(new ApiResponse(200, null, genericMessage));
});

/**
 * @route   PATCH /api/v1/auth/reset-password/:token
 * @desc    Reset password using the token emailed to the user
 * @access  Public
 */
const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  }).select('+passwordResetToken +passwordResetExpires');

  if (!user) {
    throw ApiError.badRequest('Password reset link is invalid or has expired.');
  }

  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  user.tokenVersion = (user.tokenVersion || 0) + 1; // invalidate existing refresh tokens
  await user.save();

  return issueAuthSession(user, res, 200, 'Password has been reset successfully.');
});

/**
 * @route   GET /api/v1/auth/me
 * @desc    Get the currently authenticated user's profile
 * @access  Private
 */
const getMe = asyncHandler(async (req, res) => {
  return res.status(200).json(new ApiResponse(200, { user: req.user }, 'Current user fetched.'));
});

module.exports = {
  register,
  verifyEmail,
  resendVerification,
  login,
  refreshToken,
  logout,
  forgotPassword,
  resetPassword,
  getMe,
};
