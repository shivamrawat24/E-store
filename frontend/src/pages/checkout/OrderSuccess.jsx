import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { HiCheckCircle } from 'react-icons/hi';
import { fetchOrder, clearActiveOrder } from '../../redux/slices/orderSlice';
import { formatCurrency } from '../../utils/formatCurrency';
import Spinner from '../../components/common/Spinner';
import Button from '../../components/common/Button';

const OrderSuccess = () => {
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const { activeOrder: order, detailStatus } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrder(orderId));
    return () => {
      dispatch(clearActiveOrder());
    };
  }, [dispatch, orderId]);

  if (detailStatus === 'loading' || detailStatus === 'idle') {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
        <HiCheckCircle className="h-9 w-9 text-green-500" />
      </div>
      <h1 className="mt-5 text-2xl font-bold text-ink-900">Order Confirmed!</h1>
      <p className="mt-2 text-sm text-gray-500">
        Thank you for your purchase. A confirmation has been recorded for order{' '}
        <span className="font-semibold text-ink-900">#{orderId.slice(-8).toUpperCase()}</span>.
      </p>

      {order && (
        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 text-left">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Order Total</span>
            <span className="font-semibold text-ink-900">{formatCurrency(order.totalPrice)}</span>
          </div>
          <div className="mt-2 flex justify-between text-sm">
            <span className="text-gray-500">Payment Status</span>
            <span className="font-semibold capitalize text-green-600">{order.paymentStatus}</span>
          </div>
          <div className="mt-2 flex justify-between text-sm">
            <span className="text-gray-500">Items</span>
            <span className="font-semibold text-ink-900">{order.orderItems.length}</span>
          </div>
        </div>
      )}

      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Link to={`/orders/${orderId}`}>
          <Button variant="outline">View Order Details</Button>
        </Link>
        <Link to="/shop">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;
