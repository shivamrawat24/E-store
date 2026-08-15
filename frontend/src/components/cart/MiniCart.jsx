import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { HiOutlineShoppingCart, HiOutlineX } from 'react-icons/hi';
import useCart from '../../hooks/useCart';
import CartItem from './CartItem';
import Button from '../common/Button';
import { formatCurrency } from '../../utils/formatCurrency';

const MAX_PREVIEW_ITEMS = 4;

const MiniCart = () => {
  const { items, count, subtotal, isMiniCartOpen, closeCart } = useCart();

  return (
    <AnimatePresence>
      {isMiniCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/30"
            onClick={closeCart}
          />
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="fixed right-4 top-16 z-50 w-[calc(100%-2rem)] max-w-sm rounded-2xl border border-gray-200 bg-white p-4 shadow-xl sm:right-6"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-ink-900">Your Cart ({count})</h3>
              <button
                type="button"
                onClick={closeCart}
                className="flex h-7 w-7 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                aria-label="Close cart preview"
              >
                <HiOutlineX className="h-4 w-4" />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-10 text-center">
                <HiOutlineShoppingCart className="h-10 w-10 text-gray-300" />
                <p className="text-sm text-gray-500">Your cart is empty.</p>
              </div>
            ) : (
              <>
                <div className="mt-2 max-h-80 divide-y divide-gray-100 overflow-y-auto">
                  {items.slice(0, MAX_PREVIEW_ITEMS).map((item) => (
                    <CartItem key={item.productId} item={item} compact />
                  ))}
                </div>
                {items.length > MAX_PREVIEW_ITEMS && (
                  <p className="mt-2 text-center text-xs text-gray-400">
                    +{items.length - MAX_PREVIEW_ITEMS} more item{items.length - MAX_PREVIEW_ITEMS === 1 ? '' : 's'} in your cart
                  </p>
                )}

                <div className="mt-3 flex items-center justify-between border-t border-gray-200 pt-3">
                  <span className="text-sm font-medium text-gray-500">Subtotal</span>
                  <span className="text-sm font-bold text-ink-900">{formatCurrency(subtotal)}</span>
                </div>

                <Link to="/cart" onClick={closeCart} className="mt-3 block">
                  <Button fullWidth>View Cart</Button>
                </Link>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MiniCart;
