import { formatCurrency } from '../../utils/formatCurrency';

// Simple, transparent estimate rules — swap for real shipping/tax services
// once the Order/Checkout module (with Razorpay) is built.
const FREE_SHIPPING_THRESHOLD = 999;
const FLAT_SHIPPING_FEE = 79;
const TAX_RATE = 0.18; // 18% GST placeholder

const CartSummary = ({ subtotal, itemCount, children }) => {
  const shipping = subtotal === 0 ? 0 : subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING_FEE;
  const tax = Math.round(subtotal * TAX_RATE);
  const grandTotal = subtotal + shipping + tax;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      <h3 className="text-sm font-semibold text-ink-900">Order Summary</h3>

      <dl className="mt-4 space-y-2.5 text-sm">
        <div className="flex justify-between text-gray-500">
          <dt>Subtotal ({itemCount} item{itemCount === 1 ? '' : 's'})</dt>
          <dd className="font-medium text-ink-900">{formatCurrency(subtotal)}</dd>
        </div>
        <div className="flex justify-between text-gray-500">
          <dt>Shipping</dt>
          <dd className="font-medium text-ink-900">{shipping === 0 ? 'Free' : formatCurrency(shipping)}</dd>
        </div>
        <div className="flex justify-between text-gray-500">
          <dt>Tax (18% GST est.)</dt>
          <dd className="font-medium text-ink-900">{formatCurrency(tax)}</dd>
        </div>
        {subtotal > 0 && subtotal < FREE_SHIPPING_THRESHOLD && (
          <p className="rounded-lg bg-brand-50 px-3 py-2 text-xs text-brand-700">
            Add {formatCurrency(FREE_SHIPPING_THRESHOLD - subtotal)} more to get free shipping.
          </p>
        )}
      </dl>

      <div className="mt-4 flex justify-between border-t border-gray-200 pt-4">
        <span className="text-sm font-semibold text-ink-900">Grand Total</span>
        <span className="text-lg font-bold text-ink-900">{formatCurrency(grandTotal)}</span>
      </div>

      {children}
    </div>
  );
};

export default CartSummary;
