const Razorpay = require('razorpay');
const env = require('./env');

/**
 * The Razorpay SDK throws synchronously in its constructor if key_id is
 * falsy — it does NOT wait until an API call is made. Since Razorpay is
 * intentionally left unconfigured in some environments, we pass a harmless
 * placeholder so `new Razorpay(...)` never crashes server startup. Real API
 * calls made with a placeholder key will simply fail with a Razorpay auth
 * error, which orderController already intercepts via isRazorpayConfigured()
 * before it ever reaches this client.
 */
const razorpay = new Razorpay({
  key_id: env.RAZORPAY_KEY_ID || 'rzp_unconfigured',
  key_secret: env.RAZORPAY_KEY_SECRET || 'rzp_unconfigured',
});

module.exports = razorpay;
