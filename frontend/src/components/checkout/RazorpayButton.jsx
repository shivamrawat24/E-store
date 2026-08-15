import Button from '../common/Button';

/**
 * Deliberately "dumb": it just renders the submit button with a loading
 * state. It's rendered as `type="submit"` inside Checkout.jsx's single
 * react-hook-form <form>, so clicking it validates the shipping address
 * fields first — only then does Checkout's onSubmit handler run the actual
 * create-order → open-Razorpay → verify-payment flow.
 */
const RazorpayButton = ({ isProcessing, disabled, label = 'Place Order & Pay' }) => {
  return (
    <Button type="submit" fullWidth isLoading={isProcessing} disabled={disabled}>
      {isProcessing ? 'Processing...' : label}
    </Button>
  );
};

export default RazorpayButton;
