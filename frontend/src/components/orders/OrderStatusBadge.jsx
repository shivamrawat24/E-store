const ORDER_STATUS_STYLES = {
  pending: 'bg-gray-100 text-gray-600',
  confirmed: 'bg-blue-50 text-blue-700',
  processing: 'bg-amber-50 text-amber-700',
  shipped: 'bg-indigo-50 text-indigo-700',
  delivered: 'bg-green-50 text-green-700',
  cancelled: 'bg-red-50 text-red-600',
};

const PAYMENT_STATUS_STYLES = {
  pending: 'bg-gray-100 text-gray-600',
  paid: 'bg-green-50 text-green-700',
  failed: 'bg-red-50 text-red-600',
  refunded: 'bg-amber-50 text-amber-700',
};

/**
 * @param status - one of the orderStatus or paymentStatus enum values
 * @param type - 'order' | 'payment', selects which style map + label prefix to use
 */
const OrderStatusBadge = ({ status, type = 'order' }) => {
  const styles = type === 'payment' ? PAYMENT_STATUS_STYLES : ORDER_STATUS_STYLES;
  return (
    <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${styles[status] || 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  );
};

export default OrderStatusBadge;
