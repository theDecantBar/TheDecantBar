export const FREE_SHIPPING_THRESHOLD = 499;
export const STANDARD_SHIPPING_FEE = 80;
export const DISCOUNT_THRESHOLD = 999;
export const DISCOUNT_RATE = 0.1;

export const DEFAULT_OFFERS = {
  freeShippingThreshold: 499,
  standardShippingFee: 80,
  discountActive: true,
  discountPercent: 10,
  discountMinSubtotal: 999,
  banners: [
    {
      id: "free-delivery",
      badge: "Free Delivery",
      text: "on orders of ₹499 or more",
      icon: "truck",
      link: "/products",
      active: true,
    },
    {
      id: "ten-percent-off",
      badge: "Flat 10% Off",
      text: "auto-applied on ₹999 or more",
      icon: "sparkles",
      link: "/products",
      active: true,
    },
    {
      id: "authentic-decants",
      badge: "100% Authentic",
      text: "Luxury decants in 2ml, 5ml & 10ml",
      icon: "shield",
      link: "/products",
      active: true,
    },
  ],
};

/**
 * Calculates shipping fee based on cart subtotal and dynamic store offer rules.
 *
 * @param {number|string} subtotal
 * @param {object} [rules]
 * @returns {number}
 */
export function calculateShippingFee(subtotal, rules = null) {
  const numericSubtotal = Number(subtotal) || 0;
  if (numericSubtotal <= 0) return 0;
  const threshold = Number(rules?.freeShippingThreshold ?? FREE_SHIPPING_THRESHOLD);
  const fee = Number(rules?.standardShippingFee ?? STANDARD_SHIPPING_FEE);
  return numericSubtotal >= threshold ? 0 : fee;
}

/**
 * Calculates automatic percentage discount based on store offer rules.
 *
 * @param {number|string} subtotal
 * @param {object} [rules]
 * @returns {number}
 */
export function calculateDiscount(subtotal, rules = null) {
  const numericSubtotal = Number(subtotal) || 0;
  const active = rules ? Boolean(rules.discountActive) : true;
  if (!active) return 0;
  const minSubtotal = Number(rules?.discountMinSubtotal ?? DISCOUNT_THRESHOLD);
  const rate = rules?.discountPercent !== undefined ? Number(rules.discountPercent) / 100 : DISCOUNT_RATE;
  if (rate <= 0 || numericSubtotal < minSubtotal) return 0;
  return Math.round(numericSubtotal * rate);
}

/**
 * Calculates final total amount after offer discount and shipping fee.
 *
 * @param {number|string} subtotal
 * @param {object} [rules]
 * @returns {number}
 */
export function calculateOrderTotal(subtotal, rules = null) {
  const numericSubtotal = Number(subtotal) || 0;
  const discount = calculateDiscount(numericSubtotal, rules);
  const shipping = calculateShippingFee(numericSubtotal, rules);
  return Math.max(0, numericSubtotal - discount + shipping);
}
