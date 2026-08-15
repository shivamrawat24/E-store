// Mirrors the free-shipping/tax rules shown to the customer in
// frontend/src/components/cart/CartSummary.jsx. Keep both in sync if the
// business rules change — this file is the one that actually charges money.
const FREE_SHIPPING_THRESHOLD = 999;
const FLAT_SHIPPING_FEE = 79;
const TAX_RATE = 0.18; // 18% GST placeholder

/**
 * @param {number} itemsPrice - sum of (product.price * quantity) across order items
 * @returns {{ shippingPrice: number, taxPrice: number, totalPrice: number }}
 */
const calculateOrderPricing = (itemsPrice) => {
  const shippingPrice = itemsPrice === 0 || itemsPrice >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING_FEE;
  const taxPrice = Math.round(itemsPrice * TAX_RATE);
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  return { shippingPrice, taxPrice, totalPrice };
};

module.exports = calculateOrderPricing;
