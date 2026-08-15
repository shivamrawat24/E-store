import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { HiOutlineClipboardList } from 'react-icons/hi';
import { fetchMyOrders } from '../../redux/slices/orderSlice';
import OrderCard from '../../components/orders/OrderCard';
import Pagination from '../../components/shop/Pagination';
import EmptyState from '../../components/common/EmptyState';
import Spinner from '../../components/common/Spinner';
import Button from '../../components/common/Button';

const Orders = () => {
  const dispatch = useDispatch();
  const { myOrders, myOrdersPagination, myOrdersStatus, error } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchMyOrders({ page: 1, limit: 10 }));
  }, [dispatch]);

  const handlePageChange = (page) => {
    dispatch(fetchMyOrders({ page, limit: 10 }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRetry = () => {
    dispatch(fetchMyOrders({ page: myOrdersPagination.page || 1, limit: 10 }));
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-ink-900">My Orders</h1>
      <p className="mt-1 text-sm text-gray-500">Track and review your past purchases.</p>

      <div className="mt-6">
        {myOrdersStatus === 'loading' ? (
          <div className="flex justify-center py-16">
            <Spinner size="lg" />
          </div>
        ) : myOrdersStatus === 'failed' ? (
          <EmptyState
            icon={HiOutlineClipboardList}
            title="Unable to load your orders"
            description={error || 'Please try again in a moment.'}
            action={
              <Button onClick={handleRetry} variant="outline">
                Retry
              </Button>
            }
          />
        ) : myOrders.length === 0 ? (
          <EmptyState
            icon={HiOutlineClipboardList}
            title="No orders yet"
            description="Once you place an order, it will show up here."
            action={
              <Link to="/shop">
                <Button>Start Shopping</Button>
              </Link>
            }
          />
        ) : (
          <>
            <div className="space-y-4">
              {myOrders.map((order) => (
                <OrderCard key={order._id} order={order} />
              ))}
            </div>
            {myOrdersPagination.totalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  page={myOrdersPagination.page}
                  totalPages={myOrdersPagination.totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Orders;
