const CART_STORAGE_KEY = 'ecommerce_cart_items_v1';

/**
 * Reads the persisted cart from localStorage. Cart is intentionally scoped
 * to the browser/device rather than per-user: it survives login/logout so a
 * guest can add items, sign in, and still see them (a common storefront
 * pattern). Server-side, per-account cart sync is a future backend module.
 */
export const getStoredCart = () => {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
};

export const saveCart = (items) => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    // localStorage may be unavailable (private browsing, quota exceeded, etc.)
    // Cart still works in-memory for the session; it just won't persist.
  }
};

export default { getStoredCart, saveCart };
