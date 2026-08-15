import { formatCurrency } from '../../utils/formatCurrency';
import CartSummary from '../cart/CartSummary';

/**
 * Reuses CartSummary for the price breakdown (subtotal/shipping/tax/total)
 * so the checkout estimate and the cart page always agree — the real,
 * authoritative total is still recalculated server-side in orderController.
 */
const OrderSummary = ({ items, subtotal, children }) => {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <h3 className="mb-4 text-sm font-semibold text-ink-900">Items ({items.length})</h3>
        <div className="max-h-64 space-y-3 overflow-y-auto">
          {items.map((item) => (
            <div key={item.productId} className="flex items-center gap-3">
              <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                {item.image && <img src={item.image} alt="" className="h-full w-full object-cover" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-ink-900">{item.name}</p>
                <p className="text-xs text-gray-400">Qty {item.quantity}</p>
              </div>
              <span className="text-xs font-semibold text-ink-900">{formatCurrency(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>
      </div>

      <CartSummary subtotal={subtotal} itemCount={items.reduce((sum, i) => sum + i.quantity, 0)}>
        {children}
      </CartSummary>
    </div>
  );
};

export default OrderSummary;
