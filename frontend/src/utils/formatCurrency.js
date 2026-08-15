/**
 * Formats a number as INR currency (adjust locale/currency for your market).
 */
export const formatCurrency = (amount) => {
  if (amount == null || Number.isNaN(amount)) return '';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};
