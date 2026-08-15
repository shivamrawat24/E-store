const baseWrapper = (title, bodyHtml) => `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>${title}</title>
  </head>
  <body style="margin:0;padding:0;background-color:#f4f4f7;font-family:Arial,Helvetica,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f7;padding:32px 0;">
      <tr>
        <td align="center">
          <table width="480" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;">
            <tr>
              <td style="background-color:#111827;padding:24px;text-align:center;">
                <span style="color:#ffffff;font-size:20px;font-weight:bold;letter-spacing:0.5px;">ECOMMERCE STORE</span>
              </td>
            </tr>
            <tr>
              <td style="padding:32px;color:#374151;font-size:15px;line-height:1.6;">
                ${bodyHtml}
              </td>
            </tr>
            <tr>
              <td style="padding:16px 32px;background:#f9fafb;color:#9ca3af;font-size:12px;text-align:center;">
                &copy; ${new Date().getFullYear()} Ecommerce Store. All rights reserved.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;

const verificationEmailTemplate = ({ name, verifyUrl, expiresInMinutes }) =>
  baseWrapper(
    'Verify your email',
    `
      <h2 style="color:#111827;">Hi ${name},</h2>
      <p>Thanks for creating an account. Please verify your email address to activate your account.</p>
      <p style="text-align:center;margin:32px 0;">
        <a href="${verifyUrl}" style="background:#111827;color:#ffffff;padding:12px 28px;border-radius:6px;text-decoration:none;font-weight:bold;">
          Verify Email
        </a>
      </p>
      <p>This link expires in ${expiresInMinutes} minutes. If you did not create an account, you can safely ignore this email.</p>
      <p style="word-break:break-all;color:#6b7280;font-size:12px;">${verifyUrl}</p>
    `
  );

const passwordResetEmailTemplate = ({ name, resetUrl, expiresInMinutes }) =>
  baseWrapper(
    'Reset your password',
    `
      <h2 style="color:#111827;">Hi ${name},</h2>
      <p>We received a request to reset your password. Click the button below to choose a new one.</p>
      <p style="text-align:center;margin:32px 0;">
        <a href="${resetUrl}" style="background:#111827;color:#ffffff;padding:12px 28px;border-radius:6px;text-decoration:none;font-weight:bold;">
          Reset Password
        </a>
      </p>
      <p>This link expires in ${expiresInMinutes} minutes. If you did not request this, please ignore this email — your password will remain unchanged.</p>
      <p style="word-break:break-all;color:#6b7280;font-size:12px;">${resetUrl}</p>
    `
  );

module.exports = { verificationEmailTemplate, passwordResetEmailTemplate };
