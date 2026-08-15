import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import productReducer from './slices/productSlice';
import categoryReducer from './slices/categorySlice';
import brandReducer from './slices/brandSlice';
import cartReducer from './slices/cartSlice';
import orderReducer from './slices/orderSlice';
import { saveCart } from '../utils/cartStorage';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    categories: categoryReducer,
    brands: brandReducer,
    cart: cartReducer,
    orders: orderReducer,
  },
  devTools: import.meta.env.MODE !== 'production',
});

let previousCartItems = store.getState().cart.items;

store.subscribe(() => {
  const currentCartItems = store.getState().cart.items;

  if (currentCartItems !== previousCartItems) {
    previousCartItems = currentCartItems;
    saveCart(currentCartItems);
  }
});

export default store;