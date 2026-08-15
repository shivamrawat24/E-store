const RAZORPAY_SCRIPT_SRC = 'https://checkout.razorpay.com/v1/checkout.js';

let loadPromise = null;

/**
 * Loads the Razorpay Checkout script on demand (not on every page load),
 * and only once even if called from multiple places. Resolves `true` on
 * success, `false` if the script fails to load (e.g. offline, blocked).
 */
export const loadRazorpayScript = () => {
  if (window.Razorpay) return Promise.resolve(true);

  if (!loadPromise) {
    loadPromise = new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = RAZORPAY_SCRIPT_SRC;
      script.onload = () => resolve(true);
      script.onerror = () => {
        loadPromise = null; // allow retrying on a later attempt
        resolve(false);
      };
      document.body.appendChild(script);
    });
  }

  return loadPromise;
};

export default loadRazorpayScript;
