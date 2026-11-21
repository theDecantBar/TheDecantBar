export function onlinePaymentsEnabled() {
  if (process.env.ONLINE_PAYMENTS_ENABLED === "false") return false;
  // Production must never offer simulated payments to customers.
  if (process.env.VERCEL_ENV === "production" ||
      (process.env.NODE_ENV === "production" && process.env.VERCEL_ENV !== "preview")) {
    return Boolean(process.env.RAZORPAY_KEY_ID?.startsWith("rzp_live_") && process.env.RAZORPAY_KEY_SECRET);
  }
  return Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
}

export function blockDisabledOnlinePayments(res) {
  if (onlinePaymentsEnabled()) return false;
  res.status(503).json({ message: "Online payments are currently unavailable. Please contact support or try again later." });
  return true;
}
