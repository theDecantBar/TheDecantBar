import crypto from "node:crypto";
import pool from "../config/db.js";
import { checkAdminPayment } from "../controllers/orderController.js";

// Durable per-order leases allow overlapping invocations and recover after a crash.
export async function recoverPayments({ maxOrders = 20, budgetMs = 35000 } = {}) {
  const key = process.env.RAZORPAY_KEY_ID || "";
  if (!/^rzp_(test|live)_/.test(key) || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error("Razorpay credentials are not configured.");
  }
  const mode = key.startsWith("rzp_live_") ? "live" : "test";
  const started = Date.now();
  const summary = { checked: 0, errors: 0 };
  while (summary.checked < maxOrders && Date.now() - started < budgetMs) {
    const claimed = await pool.query(
      `WITH candidate AS (
         SELECT id FROM orders
         WHERE razorpay_order_id IS NOT NULL AND (payment_mode = $1 OR payment_mode IS NULL)
           AND (payment_check_after IS NULL OR payment_check_after <= NOW())
           AND (order_status = 'Awaiting payment'
             OR (payment_status IN ('Paid', 'Partially refunded') AND created_at > NOW() - interval '180 days'))
         ORDER BY payment_checked_at NULLS FIRST, id
         FOR UPDATE SKIP LOCKED LIMIT 1
       )
       UPDATE orders o SET payment_check_after = NOW() + interval '5 minutes'
       FROM candidate c WHERE o.id = c.id RETURNING o.id`, [mode]
    );
    if (!claimed.rows.length) break;
    const id = claimed.rows[0].id;
    let code = 200;
    const response = {
      status(value) { code = value; return this; },
      json() { return this; },
      sendStatus(value) { code = value; return this; },
    };
    try {
      await checkAdminPayment({ params: { id } }, response, { background: true });
    } catch {
      code = 503;
    }
    // Stock review is an explicit staff action, not a failure to record the money.
    const failed = code >= 400;
    await pool.query(
      `UPDATE orders SET payment_checked_at = NOW(),
         payment_check_after = NOW() + CASE
           WHEN $2 THEN interval '5 minutes'
           WHEN order_status = 'Awaiting payment' THEN interval '5 minutes'
           ELSE interval '1 day' END,
         payment_check_error = $3 WHERE id = $1`,
      [id, failed, failed ? `Payment check returned HTTP ${code}; check with Razorpay or contact support.` : null]
    );
    summary.checked++;
    if (failed) summary.errors++;
  }
  return summary;
}

export async function paymentRecoveryJob(req, res) {
  const secret = process.env.CRON_SECRET;
  const supplied = req.get("authorization") || "";
  const expected = secret ? `Bearer ${secret}` : "";
  if (!secret || Buffer.byteLength(supplied) !== Buffer.byteLength(expected) ||
      !crypto.timingSafeEqual(Buffer.from(supplied), Buffer.from(expected))) {
    return res.sendStatus(401);
  }
  try {
    const result = await recoverPayments();
    res.status(result.errors ? 503 : 200).json(result);
  } catch {
    res.status(503).json({ message: "Payment recovery could not finish. It will be retried." });
  }
}
