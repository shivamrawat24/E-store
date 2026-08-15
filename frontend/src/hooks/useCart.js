import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import {
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  updateQuantity,
  clearCart,
  openMiniCart,
  closeMiniCart,
  toggleMiniCart,
  selectCartItems,
  selectCartCount,
  selectCartSubtotal,
} from '../redux/slices/cartSlice';

/**
 * Central hook for reading cart state and dispatching cart actions.
 */
export const useCart = () => {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const count = useSelector(selectCartCount);
  const subtotal = useSelector(selectCartSubtotal);
  const isMiniCartOpen = useSelector((state) => state.cart.isMiniCartOpen);

  const add = useCallback(
    (product, quantity = 1) => {
      if (!product || product.status !== 'active') {
        toast.error('This product is no longer available.');
        return;
      }
      if (product.stock <= 0) {
        toast.error('This product is out of stock.');
        return;
      }
      const safeQuantity = Number(quantity) > 0 ? Math.min(Number(quantity), product.stock) : 1;
      dispatch(addToCart({ product, quantity: safeQuantity }));
      toast.success(`${product.name} added to cart.`);
      dispatch(openMiniCart());
    },
    [dispatch]
  );

  const remove = useCallback((productId) => dispatch(removeFromCart(productId)), [dispatch]);
  const increase = useCallback((productId) => dispatch(increaseQuantity(productId)), [dispatch]);
  const decrease = useCallback((productId) => dispatch(decreaseQuantity(productId)), [dispatch]);
  const setQuantity = useCallback(
    (productId, quantity) => dispatch(updateQuantity({ productId, quantity })),
    [dispatch]
  );
  const clear = useCallback(() => dispatch(clearCart()), [dispatch]);
  const openCart = useCallback(() => dispatch(openMiniCart()), [dispatch]);
  const closeCart = useCallback(() => dispatch(closeMiniCart()), [dispatch]);
  const toggleCart = useCallback(() => dispatch(toggleMiniCart()), [dispatch]);

  return {
    items,
    count,
    subtotal,
    isMiniCartOpen,
    add,
    remove,
    increase,
    decrease,
    setQuantity,
    clear,
    openCart,
    closeCart,
    toggleCart,
  };
};

export default useCart;
