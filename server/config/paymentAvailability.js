export function onlinePaymentsEnabled() {
  if (process.env.ONLINE_PAYMENTS_ENABLED !== "true") return false;
  // Production must never offer simulated payments to customers.
  if (process.env.VERCEL_ENV === "production" ||
      (process.env.NODE_ENV === "production" && process.env.VERCEL_ENV !== "preview")) {
    return Boolean(process.env.RAZORPAY_KEY_ID?.startsWith("rzp_live_") && process.env.RAZORPAY_KEY_SECRET);
  }
  return true;
}

export function blockDisabledOnlinePayments(res) {
  if (onlinePaymentsEnabled()) return false;
  res.status(503).json({ message: "Online payments are currently unavailable. Please choose Cash on Delivery." });
  return true;
}
