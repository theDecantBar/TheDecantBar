export const FREE_SHIPPING_THRESHOLD = 500;
export const STANDARD_SHIPPING_FEE = 80;

/**
 * Calculates shipping fee based on cart subtotal:
 * - Subtotal below ₹500: ₹80 shipping
 * - Subtotal ₹500 or above: FREE shipping (₹0)
 * - Empty / 0 subtotal: 0
 *
 * @param {number|string} subtotal
 * @returns {number}
 */
export function calculateShippingFee(subtotal) {
  const numericSubtotal = Number(subtotal) || 0;
  if (numericSubtotal <= 0) return 0;
  return numericSubtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
}

/**
 * Calculates final total amount including shipping fee.
 *
 * @param {number|string} subtotal
 * @returns {number}
 */
export function calculateOrderTotal(subtotal) {
  const numericSubtotal = Number(subtotal) || 0;
  return numericSubtotal + calculateShippingFee(numericSubtotal);
}

