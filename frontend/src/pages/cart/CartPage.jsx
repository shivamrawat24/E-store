import { Link, useNavigate } from 'react-router-dom';
import { HiOutlineShoppingCart, HiOutlineArrowLeft, HiOutlineTrash } from 'react-icons/hi';
import useCart from '../../hooks/useCart';
import CartItem from '../../components/cart/CartItem';
import CartSummary from '../../components/cart/CartSummary';
import EmptyState from '../../components/common/EmptyState';
import Button from '../../components/common/Button';

const CartPage = () => {
  const navigate = useNavigate();
  const { items, count, subtotal, clear } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <EmptyState
          icon={HiOutlineShoppingCart}
          title="Your cart is empty"
          description="Looks like you haven't added anything yet. Start browsing to find something you'll love."
          action={
            <Link to="/shop">
              <Button>Start Shopping</Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        to="/shop"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-brand-600"
      >
        <HiOutlineArrowLeft className="h-4 w-4" />
        Continue Shopping
      </Link>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ink-900">
          Your Cart ({count})
        </h1>

        <button
          type="button"
          onClick={clear}
          className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-red-500"
        >
          <HiOutlineTrash className="h-4 w-4" />
          Clear Cart
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="divide-y divide-gray-100 rounded-2xl border border-gray-200 bg-white px-5 lg:col-span-2">
          {items.map((item) => (
            <CartItem key={item.productId} item={item} />
          ))}
        </div>

        <div className="lg:col-span-1">
          <CartSummary subtotal={subtotal} itemCount={count}>
            <Button
              fullWidth
              className="mt-4"
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout
            </Button>
          </CartSummary>
        </div>
      </div>
    </div>
  );
};

export default CartPage;