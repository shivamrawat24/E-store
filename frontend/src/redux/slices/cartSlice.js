import { createSlice } from '@reduxjs/toolkit';
import { getStoredCart } from '../../utils/cartStorage';

const initialState = {
  items: getStoredCart(), // [{ productId, name, slug, price, image, stock, quantity }]
  isMiniCartOpen: false,
};

const clampQuantity = (quantity, stock) => {
  const normalizedQuantity = Number.isFinite(quantity) ? Math.max(1, Math.floor(quantity)) : 1;
  const normalizedStock = Number.isFinite(stock) ? Math.max(0, stock) : normalizedQuantity;
  return normalizedStock > 0 ? Math.min(normalizedQuantity, normalizedStock) : 1;
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    /**
     * Adds a product to the cart, or increases its quantity if it's already
     * present. Quantity is always clamped to available stock.
     */
    addToCart: (state, action) => {
      const { product, quantity = 1 } = action.payload;
      if (!product || product.status !== 'active' || product.stock <= 0 || Number(quantity) <= 0) {
        return;
      }

      const existing = state.items.find((item) => item.productId === product._id);

      if (existing) {
        existing.quantity = clampQuantity(existing.quantity + Number(quantity), product.stock);
      } else {
        state.items.push({
          productId: product._id,
          name: product.name,
          slug: product.slug,
          price: product.price,
          image: product.images?.[0]?.url || '',
          stock: product.stock,
          quantity: clampQuantity(Number(quantity), product.stock),
        });
      }
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.productId !== action.payload);
    },

    increaseQuantity: (state, action) => {
      const item = state.items.find((i) => i.productId === action.payload);
      if (item) item.quantity = clampQuantity(item.quantity + 1, item.stock);
    },

    decreaseQuantity: (state, action) => {
      const item = state.items.find((i) => i.productId === action.payload);
      if (item) {
        if (item.quantity <= 1) {
          state.items = state.items.filter((i) => i.productId !== action.payload);
        } else {
          item.quantity -= 1;
        }
      }
    },

    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find((i) => i.productId === productId);
      if (item) {
        const normalizedQuantity = Number(quantity);
        if (!Number.isFinite(normalizedQuantity) || normalizedQuantity <= 0) {
          item.quantity = 1;
          return;
        }
        item.quantity = clampQuantity(normalizedQuantity, item.stock);
      }
    },

    clearCart: (state) => {
      state.items = [];
    },

    openMiniCart: (state) => {
      state.isMiniCartOpen = true;
    },
    closeMiniCart: (state) => {
      state.isMiniCartOpen = false;
    },
    toggleMiniCart: (state) => {
      state.isMiniCartOpen = !state.isMiniCartOpen;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  updateQuantity,
  clearCart,
  openMiniCart,
  closeMiniCart,
  toggleMiniCart,
} = cartSlice.actions;

// ---------- Selectors ----------
export const selectCartItems = (state) => state.cart.items;
export const selectCartCount = (state) => state.cart.items.reduce((sum, item) => sum + item.quantity, 0);
export const selectCartSubtotal = (state) => state.cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

export default cartSlice.reducer;
