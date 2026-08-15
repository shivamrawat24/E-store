import { Link } from 'react-router-dom';
import { formatCurrency } from '../../utils/formatCurrency';
import OrderStatusBadge from './OrderStatusBadge';

const OrderCard = ({ order }) => {
  const orderDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <Link
      to={`/orders/${order._id}`}
      className="block rounded-2xl border border-gray-200 bg-white p-5 transition-shadow hover:shadow-md"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-ink-900">Order #{order._id.slice(-8).toUpperCase()}</p>
          <p className="mt-0.5 text-xs text-gray-400">Placed on {orderDate}</p>
        </div>
        <div className="flex items-center gap-2">
          <OrderStatusBadge status={order.paymentStatus} type="payment" />
          <OrderStatusBadge status={order.orderStatus} type="order" />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
        <p className="text-xs text-gray-500">
          {order.orderItems.length} item{order.orderItems.length === 1 ? '' : 's'}
        </p>
        <p className="text-sm font-bold text-ink-900">{formatCurrency(order.totalPrice)}</p>
      </div>
    </Link>
  );
};

export default OrderCard;
