import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { HiOutlineClipboardList } from 'react-icons/hi';
import { fetchAllOrders, updateOrderStatus } from '../../redux/slices/orderSlice';
import { formatCurrency } from '../../utils/formatCurrency';
import OrderStatusBadge from '../../components/orders/OrderStatusBadge';
import EmptyState from '../../components/common/EmptyState';
import Spinner from '../../components/common/Spinner';
import Pagination from '../../components/shop/Pagination';
import SearchBar from '../../components/shop/SearchBar';

const ORDER_STATUS_OPTIONS = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

const AdminOrders = () => {
  const dispatch = useDispatch();
  const { adminOrders, adminOrdersPagination, adminListStatus } = useSelector((state) => state.orders);
  const [orderStatusFilter, setOrderStatusFilter] = useState('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(
      fetchAllOrders({
        page,
        limit: 20,
        orderStatus: orderStatusFilter || undefined,
        paymentStatus: paymentStatusFilter || undefined,
        search: searchTerm || undefined,
        sort: sortOrder,
      })
    );
  }, [dispatch, page, orderStatusFilter, paymentStatusFilter, searchTerm, sortOrder]);

  const handleStatusChange = async (order, newStatus) => {
    const result = await dispatch(updateOrderStatus({ id: order._id, orderStatus: newStatus }));
    if (result.type.endsWith('/fulfilled')) {
      toast.success(`Order #${order._id.slice(-8).toUpperCase()} marked as ${newStatus}.`);
    } else {
      toast.error(result.payload || 'Failed to update order status.');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink-900">Orders</h1>
      <p className="mt-1 text-sm text-gray-500">View and manage customer orders.</p>

      <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex w-full flex-col gap-3 md:flex-row md:items-center">
          <div className="w-full md:max-w-xs">
            <SearchBar
              value={searchTerm}
              onChange={(value) => {
                setSearchTerm(value);
                setPage(1);
              }}
              placeholder="Search by order ID, name, or email"
            />
          </div>

          <select
            value={orderStatusFilter}
            onChange={(e) => {
              setOrderStatusFilter(e.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-gray-300 px-3.5 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/40"
          >
            <option value="">All Order Statuses</option>
            {ORDER_STATUS_OPTIONS.map((status) => (
              <option key={status} value={status} className="capitalize">
                {status}
              </option>
            ))}
          </select>

          <select
            value={paymentStatusFilter}
            onChange={(e) => {
              setPaymentStatusFilter(e.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-gray-300 px-3.5 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/40"
          >
            <option value="">All Payment Statuses</option>
            {['pending', 'paid', 'failed', 'refunded'].map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <select
          value={sortOrder}
          onChange={(e) => {
            setSortOrder(e.target.value);
            setPage(1);
          }}
          className="rounded-lg border border-gray-300 px-3.5 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/40"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
        </select>
      </div>

      <div className="mt-6">
        {adminListStatus === 'loading' ? (
          <div className="flex justify-center py-16">
            <Spinner size="lg" />
          </div>
        ) : adminOrders.length === 0 ? (
          <EmptyState icon={HiOutlineClipboardList} title="No orders found" description="Try adjusting your filters." />
        ) : (
          <>
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-gray-500">Order</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-500">Customer</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-500">Total</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-500">Payment</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-500">Status</th>
                      <th className="px-4 py-3 text-right font-semibold text-gray-500">Update Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {adminOrders.map((order) => (
                      <tr key={order._id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <Link to={`/orders/${order._id}`} className="font-medium text-brand-600 hover:text-brand-700">
                            #{order._id.slice(-8).toUpperCase()}
                          </Link>
                          <p className="text-xs text-gray-400">
                            {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                          </p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-ink-900">{order.user?.name || 'Unknown'}</p>
                          <p className="text-xs text-gray-400">{order.user?.email}</p>
                        </td>
                        <td className="px-4 py-3 font-medium text-ink-900">{formatCurrency(order.totalPrice)}</td>
                        <td className="px-4 py-3">
                          <OrderStatusBadge status={order.paymentStatus} type="payment" />
                        </td>
                        <td className="px-4 py-3">
                          <OrderStatusBadge status={order.orderStatus} type="order" />
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={order.orderStatus}
                            onChange={(e) => handleStatusChange(order, e.target.value)}
                            className="ml-auto block rounded-lg border border-gray-300 px-2.5 py-1.5 text-xs outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/40"
                          >
                            {ORDER_STATUS_OPTIONS.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-6">
              <Pagination
                page={adminOrdersPagination.page}
                totalPages={adminOrdersPagination.totalPages}
                onPageChange={setPage}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
