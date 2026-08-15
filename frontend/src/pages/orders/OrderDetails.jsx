import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { HiOutlineArrowLeft } from 'react-icons/hi';
import { fetchOrder, clearActiveOrder, cancelOrder } from '../../redux/slices/orderSlice';
import { formatCurrency } from '../../utils/formatCurrency';
import OrderStatusBadge from '../../components/orders/OrderStatusBadge';
import Spinner from '../../components/common/Spinner';
import EmptyState from '../../components/common/EmptyState';
import Button from '../../components/common/Button';
import ConfirmDialog from '../../components/common/ConfirmDialog';

const OrderDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { activeOrder: order, detailStatus, error } = useSelector((state) => state.orders);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  useEffect(() => {
    dispatch(fetchOrder(id));
    return () => {
      dispatch(clearActiveOrder());
    };
  }, [dispatch, id]);

  const statusTimeline = useMemo(() => {
    if (!order) return [];

    const steps = [
      { key: 'pending', label: 'Order placed', date: order.createdAt },
      { key: 'confirmed', label: 'Confirmed', date: order.paidAt || order.createdAt },
      { key: 'processing', label: 'Processing', date: order.paidAt || order.createdAt },
      { key: 'shipped', label: 'Shipped', date: order.updatedAt || order.createdAt },
      { key: 'delivered', label: 'Delivered', date: order.deliveredAt || order.updatedAt || order.createdAt },
      { key: 'cancelled', label: 'Cancelled', date: order.updatedAt || order.createdAt },
    ];

    const activeIndex = steps.findIndex((step) => step.key === order.orderStatus);
    return steps.map((step, index) => ({
      ...step,
      isActive: index <= activeIndex && order.orderStatus !== 'cancelled' ? true : order.orderStatus === 'cancelled' && (step.key === 'cancelled' || index < steps.findIndex((s) => s.key === 'cancelled')),
      isCompleted: index < Math.max(activeIndex, 0) || (order.orderStatus === 'cancelled' && step.key === 'cancelled'),
    }));
  }, [order]);

  const canCancelOrder = order && ['pending', 'confirmed', 'processing'].includes(order.orderStatus);

  const handleCancelOrder = async () => {
    const result = await dispatch(cancelOrder(order._id));
    if (cancelOrder.fulfilled.match(result)) {
      toast.success('Order cancelled successfully.');
      setShowCancelDialog(false);
      return;
    }

    toast.error(result.payload || 'Unable to cancel this order.');
  };

  if (detailStatus === 'loading' || detailStatus === 'idle') {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (detailStatus === 'failed' || !order) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <EmptyState
          title="Order not found"
          description={error || "This order doesn't exist or you don't have permission to view it."}
          action={
            <Link to="/orders">
              <Button>Back to My Orders</Button>
            </Link>
          }
        />
      </div>
    );
  }

  const orderDate = new Date(order.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Link to="/orders" className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-brand-600">
        <HiOutlineArrowLeft className="h-4 w-4" />
        Back to Orders
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink-900">Order #{order._id.slice(-8).toUpperCase()}</h1>
          <p className="mt-1 text-sm text-gray-500">Placed on {orderDate}</p>
        </div>
        <div className="flex items-center gap-2">
          <OrderStatusBadge status={order.paymentStatus} type="payment" />
          <OrderStatusBadge status={order.orderStatus} type="order" />
        </div>
      </div>

      {canCancelOrder && (
        <div className="mt-5 flex justify-end">
          <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50" onClick={() => setShowCancelDialog(true)}>
            Cancel Order
          </Button>
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="divide-y divide-gray-100 rounded-2xl border border-gray-200 bg-white px-5">
            {order.orderItems.map((item) => (
              <div key={item.product} className="flex items-center gap-3 py-4">
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                  {item.image && <img src={item.image} alt="" className="h-full w-full object-cover" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink-900">{item.name}</p>
                  <p className="text-xs text-gray-400">
                    Qty {item.quantity} × {formatCurrency(item.price)}
                  </p>
                </div>
                <span className="text-sm font-semibold text-ink-900">{formatCurrency(item.subtotal)}</span>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <h3 className="mb-3 text-sm font-semibold text-ink-900">Shipping Address</h3>
            <p className="text-sm text-gray-600">{order.shippingAddress.fullName}</p>
            <p className="text-sm text-gray-600">{order.shippingAddress.phone}</p>
            <p className="mt-1 text-sm text-gray-600">
              {order.shippingAddress.addressLine1}
              {order.shippingAddress.addressLine2 && `, ${order.shippingAddress.addressLine2}`}
            </p>
            <p className="text-sm text-gray-600">
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
            </p>
            <p className="text-sm text-gray-600">{order.shippingAddress.country}</p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <h3 className="mb-4 text-sm font-semibold text-ink-900">Order Timeline</h3>
            <div className="space-y-4">
              {statusTimeline.map((step) => (
                <div key={step.key} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <span
                      className={`mt-1 h-3.5 w-3.5 rounded-full border-2 ${
                        step.isCompleted ? 'border-brand-600 bg-brand-600' : 'border-gray-300 bg-white'
                      }`}
                    />
                    {step.key !== 'cancelled' && <span className="mt-2 h-full w-px bg-gray-200" />}
                  </div>
                  <div className="flex-1 pb-1">
                    <p className={`text-sm font-medium ${step.isCompleted ? 'text-ink-900' : 'text-gray-500'}`}>
                      {step.label}
                    </p>
                    <p className="text-xs text-gray-400">
                      {step.date ? new Date(step.date).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : 'Pending'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-ink-900">Payment Summary</h3>
          <dl className="mt-4 space-y-2.5 text-sm">
            <div className="flex justify-between text-gray-500">
              <dt>Items</dt>
              <dd className="font-medium text-ink-900">{formatCurrency(order.itemsPrice)}</dd>
            </div>
            <div className="flex justify-between text-gray-500">
              <dt>Shipping</dt>
              <dd className="font-medium text-ink-900">{order.shippingPrice === 0 ? 'Free' : formatCurrency(order.shippingPrice)}</dd>
            </div>
            <div className="flex justify-between text-gray-500">
              <dt>Tax</dt>
              <dd className="font-medium text-ink-900">{formatCurrency(order.taxPrice)}</dd>
            </div>
          </dl>
          <div className="mt-4 flex justify-between border-t border-gray-200 pt-4">
            <span className="text-sm font-semibold text-ink-900">Total</span>
            <span className="text-lg font-bold text-ink-900">{formatCurrency(order.totalPrice)}</span>
          </div>
          {order.razorpayPaymentId && (
            <p className="mt-4 truncate text-xs text-gray-400">Payment ID: {order.razorpayPaymentId}</p>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={showCancelDialog}
        title="Cancel this order?"
        description="This action will mark the order as cancelled. It does not trigger a refund."
        confirmLabel="Cancel Order"
        isLoading={detailStatus === 'loading'}
        onConfirm={handleCancelOrder}
        onCancel={() => setShowCancelDialog(false)}
      />
    </div>
  );
};

export default OrderDetails;
