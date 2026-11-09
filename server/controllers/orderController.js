import pool from "../config/db.js";
import { getPrimaryAdminEmail } from "../config/adminConfig.js";
import { invalidateProductCache } from "./productController.js";
import { sendOrderConfirmationEmail } from "../services/orderEmailService.js";
import Razorpay from "razorpay";
import crypto from "node:crypto";
import { blockDisabledOnlinePayments } from "../config/paymentAvailability.js";

// Lock the variant before reading holds so competing online and COD checkouts serialize.
async function availableStock(client, variantId, excludedOrderId = null) {
  const { rows } = await client.query(
    "SELECT stock FROM product_variants WHERE id = $1 FOR UPDATE", [variantId]
  );
  if (!rows.length) return 0;
  if (rows[0].stock == null) return Infinity;
  const held = await client.query(
    `SELECT COALESCE(SUM(i.quantity), 0) AS units FROM order_items i
     JOIN orders o ON o.id = i.order_id
     WHERE i.variant_id = $1 AND o.order_status = 'Awaiting payment'
       AND o.payment_hold_until > clock_timestamp() AND o.id IS DISTINCT FROM $2`,
    [variantId, excludedOrderId]
  );
  return rows[0].stock - Number(held.rows[0].units);
}

/**
 * Server-side cart validation and price calculation helper.
 * Never trust unit prices or totals provided by the frontend.
 * Queries database records directly for each variant and product.
 */
async function validateAndCalculateCart(client, items) {
  if (!items || !Array.isArray(items) || items.length === 0) {
    throw new Error("Cart cannot be empty when creating an order.");
  }

  const validatedItems = [];
  let subtotal = 0;

  for (const item of items) {
    const qty = Number(item.quantity);
    if (!Number.isSafeInteger(qty) || qty <= 0) {
      throw new Error(`Invalid quantity for item "${item.name || "Fragrance"}".`);
    }

    let variantRow = null;

    if (item.variantId) {
      const vRes = await client.query(
        `SELECT pv.id, pv.product_id, pv.size_ml, pv.price, pv.stock,
                p.name AS product_name, p.image_url
         FROM product_variants pv
         JOIN products p ON pv.product_id = p.id
         WHERE pv.id = $1 AND pv.active IS NOT FALSE`,
        [item.variantId]
      );
      if (vRes.rows.length > 0) {
        variantRow = vRes.rows[0];
      }
    }

    if (!variantRow && (item.productId || item.id) && item.size_ml) {
      const vRes = await client.query(
        `SELECT pv.id, pv.product_id, pv.size_ml, pv.price, pv.stock,
                p.name AS product_name, p.image_url
         FROM product_variants pv
         JOIN products p ON pv.product_id = p.id
         WHERE pv.product_id = $1 AND pv.size_ml = $2 AND pv.active IS NOT FALSE`,
        [item.productId || item.id, item.size_ml]
      );
      if (vRes.rows.length > 0) {
        variantRow = vRes.rows[0];
      }
    }

    if (!variantRow) {
      throw new Error(
        `Fragrance variant not found for "${item.name || "Selected item"}" (${item.size_ml || ""}ml).`
      );
    }

    if (validatedItems.some(line => line.variantId === variantRow.id)) {
      throw new Error("Please combine duplicate sizes in your cart.");
    }
    const unitPrice = Number(variantRow.price);
    if (!Number.isFinite(unitPrice) || unitPrice <= 0 || !Number.isSafeInteger(Math.round(unitPrice * 100) * qty)) {
      throw new Error("This product has an invalid price. Please contact support.");
    }
    const lineTotal = unitPrice * qty;
    subtotal += lineTotal;

    validatedItems.push({
      productId: variantRow.product_id,
      variantId: variantRow.id,
      name: variantRow.product_name,
      size_ml: variantRow.size_ml,
      price: unitPrice,
      quantity: qty,
      image_url: variantRow.image_url || item.image_url || null,
      lineTotal,
    });
  }

  // Every checkout locks shared variants in the same order to prevent deadlocks.
  subtotal = 0;
  for (const item of [...validatedItems].sort((a, b) => a.variantId - b.variantId)) {
    if (await availableStock(client, item.variantId) < item.quantity) {
      throw new Error(`Insufficient available stock for ${item.name} (${item.size_ml}ml).`);
    }
    const current = await client.query("SELECT price, active FROM product_variants WHERE id = $1", [item.variantId]);
    if (!current.rows[0] || current.rows[0].active === false) throw new Error("This size is no longer available.");
    const price = Number(current.rows[0].price);
    if (!Number.isFinite(price) || price <= 0 || !Number.isSafeInteger(Math.round(price * 100) * item.quantity)) {
      throw new Error("This product has an invalid price. Please contact support.");
    }
    item.price = price;
    item.lineTotal = Math.round(price * 100) * item.quantity / 100;
    subtotal += item.lineTotal;
  }

  // Shipping calculation:
  // - Subtotal below â‚¹500: â‚¹80 shipping fee
  // - Subtotal â‚¹500 or above: FREE shipping (â‚¹0)
  const shippingFee = subtotal >= 500 ? 0 : (subtotal > 0 ? 80 : 0);
  const total = subtotal + shippingFee;

  return { validatedItems, subtotal, shippingFee, total };
}

/**
 * Server-side validation for customer contact and shipping details.
 * Rejects whitespace-only inputs, invalid Indian phone numbers, invalid emails,
 * and invalid 6-digit Indian PIN codes.
 */
export function validateCustomerAndShippingDetails({
  fullName,
  email,
  phone,
  address,
  city,
  state,
  pincode,
  orderNotes,
}) {
  const cleanName = String(fullName || "").trim();
  const cleanEmail = String(email || "").trim().toLowerCase();
  const rawPhone = String(phone || "").trim();
  const cleanPhone = rawPhone.replace(/^(\+91|91|0)/, "").replace(/[\s-]/g, "");
  const cleanAddress = String(address || "").trim();
  const cleanCity = String(city || "").trim();
  const cleanState = String(state || "").trim();
  const cleanPincode = String(pincode || "").trim();
  const cleanNotes = String(orderNotes || "").trim().slice(0, 500);

  if (!cleanName || cleanName.length < 2) {
    return { error: "Please enter your full name (minimum 2 characters)." };
  }
  if (!/^[A-Za-z\s.'-]+$/.test(cleanName)) {
    return { error: "Full name contains invalid characters." };
  }

  // Mobile number validation (10 digits starting with 6, 7, 8, or 9)
  if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
    return { error: "Please provide a valid 10-digit Indian mobile number." };
  }

  // Standard email validation
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(cleanEmail)) {
    return { error: "Please provide a valid email address." };
  }

  // Delivery address validation
  if (!cleanAddress || cleanAddress.length < 5) {
    return { error: "Please enter a complete delivery address (minimum 5 characters)." };
  }

  // City & state validation
  if (!cleanCity) {
    return { error: "Please provide a valid delivery city." };
  }
  if (!cleanState) {
    return { error: "Please provide a valid delivery state." };
  }

  // 6-digit Indian PIN code validation
  if (!/^[1-9]\d{5}$/.test(cleanPincode)) {
    return { error: "Please provide a valid 6-digit Indian PIN code." };
  }

  return {
    validDetails: {
      fullName: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      address: cleanAddress,
      city: cleanCity,
      state: cleanState,
      pincode: cleanPincode,
      orderNotes: cleanNotes,
    },
  };
}

// @desc    Create Razorpay Order
// @route   POST /api/orders/create-razorpay-order
// @access  Public (Guest or Authenticated)
export const createRazorpayOrder = async (req, res) => {
  if (blockDisabledOnlinePayments(res)) return;
  const client = await pool.connect();
  let released = false;
  try {
    const validation = validateCustomerAndShippingDetails(req.body);
    if (validation.error) return res.status(400).json({ message: validation.error });
    const customer = validation.validDetails;
    const { items } = req.body;
    if (!Array.isArray(items) || !items.length) return res.status(400).json({ message: "Cart is empty." });
    const key_id = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_id || !key_secret) {
      console.error(
        "Razorpay order creation error: Missing RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET in server environment."
      );
      return res.status(500).json({
        message:
          "Razorpay payment gateway is not configured. Missing API credentials on the server.",
      });
    }

    const razorpay = paymentGateway();
    const paymentMode = key_id.startsWith("rzp_live_") ? "live" : "test";

    const fingerprint = crypto.createHash("sha256").update(JSON.stringify([
      customer, items.map(i => [i.variantId, i.productId || i.id, i.size_ml, Number(i.quantity)])
    ])).digest("hex");

    await client.query("BEGIN");
    await client.query("SELECT pg_advisory_xact_lock(7301, $1)", [req.user.id]);
    const existing = await client.query(
      `SELECT * FROM orders WHERE user_id = $1 AND checkout_key = $2 AND payment_mode = $3
       AND order_status = 'Awaiting payment' AND payment_hold_until > clock_timestamp()
       ORDER BY id DESC LIMIT 1 FOR UPDATE`, [req.user.id, fingerprint, paymentMode]
    );
    let order = existing.rows[0];
    if (order) {
      await client.query("COMMIT");
      client.release();
      released = true;
      return retrySavedPayment({ ...req, params: { id: order.id } }, res);
    }
    if (!order) {
      let cart;
      try {
        cart = await validateAndCalculateCart(client, items);
      } catch (error) {
        await client.query("ROLLBACK");
        return res.status(400).json({ message: error.message });
      }
      const reference = "TDB-" + crypto.randomUUID();
      const saved = await client.query(
        `INSERT INTO orders (order_number, user_id, customer_name, customer_email, customer_phone,
           shipping_address, city, state, pincode, order_notes, subtotal, shipping_fee, total_amount,
           payment_method, order_status, payment_status, checkout_key, payment_hold_until, payment_mode)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,'Online (Razorpay)',
           'Awaiting payment','Pending',$14,clock_timestamp() + interval '15 minutes',$15) RETURNING *`,
        [reference, req.user.id, customer.fullName, customer.email, customer.phone, customer.address,
         customer.city, customer.state, customer.pincode, customer.orderNotes, cart.subtotal,
         cart.shippingFee, cart.total, fingerprint, paymentMode]
      );
      order = saved.rows[0];
      for (const item of cart.validatedItems) {
        await client.query(
          `INSERT INTO order_items (order_id,variant_id,product_id,product_name,size_ml,price,quantity,image_url)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
          [order.id,item.variantId,item.productId,item.name,item.size_ml,item.price,item.quantity,item.image_url]
        );
      }
      const gateway = await razorpay.orders.create({
        amount: Math.round(Number(order.total_amount) * 100), currency: "INR", receipt: reference
      });
      order.razorpay_order_id = gateway.id;
      await client.query("UPDATE orders SET razorpay_order_id = $1 WHERE id = $2", [gateway.id, order.id]);
    }
    await client.query("COMMIT");
    return res.json({
      orderNumber: order.order_number, orderId: order.razorpay_order_id, keyId: key_id,
      amount: Math.round(Number(order.total_amount) * 100), currency: "INR",
      subtotal: Number(order.subtotal), shippingFee: Number(order.shipping_fee), total: Number(order.total_amount)
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Could not start online checkout:", error.message);
    res.status(502).json({ message: "Unable to start payment. Please try again." });
  } finally {
    if (!released) client.release();
  }
};

function validSignature(body, secret, signature) {
  if (!secret || typeof signature !== "string" || !/^[a-f0-9]{64}$/i.test(signature)) return false;
  const expected = crypto.createHmac("sha256", secret).update(body).digest();
  return crypto.timingSafeEqual(expected, Buffer.from(signature, "hex"));
}

function paymentGateway() {
  const gateway = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });
  if (gateway.api.rq.defaults) gateway.api.rq.defaults.timeout = 8000;
  return gateway;
}

export async function verifyPaymentAndCreateOrder(req, res) {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  if (!validSignature(`${razorpay_order_id}|${razorpay_payment_id}`, process.env.RAZORPAY_KEY_SECRET, razorpay_signature)) {
    return res.status(400).json({ message: "Invalid payment signature." });
  }
  try {
    const payment = await paymentGateway().payments.fetch(razorpay_payment_id);
    if (payment.order_id !== razorpay_order_id || payment.id !== razorpay_payment_id) {
      return res.status(400).json({ message: "Payment does not match the saved checkout." });
    }
    return await confirmCapturedPayment(payment, req.user.id, res);
  } catch {
    return res.status(503).json({ message: "Checking your payment. See My orders before paying again." });
  }
}

export async function receiveRazorpayWebhook(req, res) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) return res.sendStatus(503);
  if (!Buffer.isBuffer(req.body) || !validSignature(req.body, secret, req.get("x-razorpay-signature"))) {
    return res.sendStatus(401);
  }
  let event;
  try { event = JSON.parse(req.body); } catch { return res.sendStatus(400); }
  if (!["payment.captured", "payment.failed"].includes(event?.event)) return res.sendStatus(204);
  const payment = event.payload?.payment?.entity;
  if (!payment?.id || !payment.order_id || event.event !== `payment.${payment.status}`) return res.sendStatus(400);
  if (payment.status === "captured") return confirmCapturedPayment(payment, null, res);
  await pool.query(
    `UPDATE orders SET payment_status = 'Failed', razorpay_payment_id = $2, updated_at = NOW()
     WHERE razorpay_order_id = $1 AND order_status = 'Awaiting payment' AND payment_status <> 'Paid'`,
    [payment.order_id, payment.id]
  );
  return res.sendStatus(204);
}

// Both the signed notification and the customer's return update the same locked order.
async function confirmCapturedPayment(payment, userId, res) {
  const razorpay_payment_id = payment.id;
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const saved = await client.query(
      `SELECT * FROM orders WHERE razorpay_order_id = $1
       AND ($2::integer IS NULL OR user_id = $2) FOR UPDATE`,
      [payment.order_id, userId]
    );
    const order = saved.rows[0];
    if (!order) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Saved checkout not found." });
    }
    if (payment.currency !== "INR" || Number(payment.amount) !== Math.round(Number(order.total_amount) * 100) ||
        payment.status !== "captured") {
      await client.query("ROLLBACK");
      return res.status(409).json({ message: "Checking your payment. See My orders before paying again." });
    }
    const lines = await client.query(
      `SELECT variant_id AS "variantId", product_id AS "productId", product_name AS name,
              size_ml, price, quantity, image_url FROM order_items WHERE order_id = $1 ORDER BY variant_id`,
      [order.id]
    );
    const validatedItems = lines.rows;
    const alreadyPaid = Boolean(order.razorpay_payment_id) && ["Paid", "Refunded", "Partially refunded"].includes(order.payment_status);
    if (alreadyPaid && order.razorpay_payment_id !== razorpay_payment_id) {
      await client.query("ROLLBACK");
      return res.status(409).json({ message: "This order already has a different payment. Contact support." });
    }
    if (!alreadyPaid) {
      let stockAvailable = order.order_status === "Awaiting payment" && validatedItems.length > 0;
      for (const item of validatedItems) {
        if (!item.variantId || await availableStock(client, item.variantId, order.id) < item.quantity) stockAvailable = false;
      }
      order.order_status = stockAvailable ? "Confirmed" : "Stock review";
      order.payment_status = "Paid";
      // Keep only the payment category. Card numbers, bank details and UPI IDs
      // from the gateway response are never persisted here.
      const methodLabels = { upi: "UPI", card: "Card", netbanking: "Netbanking", wallet: "Wallet", emi: "EMI", paylater: "Pay later" };
      order.payment_method = methodLabels[payment.method]
        ? `Online (Razorpay) - ${methodLabels[payment.method]}`
        : "Online (Razorpay)";
      if (stockAvailable) {
        for (const item of validatedItems) {
          await client.query("UPDATE product_variants SET stock = stock - $1 WHERE id = $2", [item.quantity, item.variantId]);
        }
      }
      await client.query(
        `UPDATE orders SET order_status = $1, payment_status = 'Paid', razorpay_payment_id = $2,
         payment_hold_until = NULL, payment_method = $4, payment_mode = COALESCE(payment_mode, $5), updated_at = NOW() WHERE id = $3`,
        [order.order_status, razorpay_payment_id, order.id, order.payment_method, process.env.RAZORPAY_KEY_ID?.startsWith("rzp_live_") ? "live" : "test"]
      );
      await client.query(
        `UPDATE users SET address = COALESCE(address,$1), city = COALESCE(city,$2),
         state = COALESCE(state,$3), pincode = COALESCE(pincode,$4), phone = COALESCE(phone,$5)
         WHERE id = $6`,
        [order.shipping_address,order.city,order.state,order.pincode,order.customer_phone,order.user_id]
      );
    }
    await client.query("COMMIT");
    if (order.order_status === "Stock review") {
      if (userId === null) return res.sendStatus(204);
      return res.status(409).json({ message: `Payment received for ${order.order_number}. Stock needs staff review. Please contact support and do not pay again.` });
    }
    invalidateProductCache();
    // Await delivery while the request is active; replays can retry a failed email.
    await sendOrderConfirmationEmail(order.id, { client });

    if (userId === null) return res.sendStatus(204);
    res.status(201).json({
      message: "Payment verified and order placed successfully.",
      order: {
        id: order.id,
        orderNumber: order.order_number,
        customerName: order.customer_name,
        customerEmail: order.customer_email,
        customerPhone: order.customer_phone,
        shippingAddress: order.shipping_address,
        city: order.city,
        state: order.state,
        pincode: order.pincode,
        paymentMethod: order.payment_method,
        paymentStatus: order.payment_status,
        subtotal: order.subtotal,
        shippingFee: order.shipping_fee,
        total: order.total_amount,
        status: order.order_status,
        createdAt: order.created_at,
        items: validatedItems,
      },
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Order verification & creation error:", error);
    res.status(500).json({ message: "Failed to confirm order. Please contact support." });
  } finally {
    client.release();
  }
};

// Reopen the original gateway order, including after the initial stock hold has expired.
export async function retrySavedPayment(req, res) {
  if (blockDisabledOnlinePayments(res)) return;
  const client = await pool.connect();
  let released = false;
  try {
    await client.query("BEGIN");
    const { rows } = await client.query(
      "SELECT * FROM orders WHERE id = $1 AND user_id = $2 FOR UPDATE", [req.params.id, req.user.id]
    );
    const order = rows[0];
    if (!order || order.order_status !== "Awaiting payment" || !order.razorpay_order_id) {
      await client.query("ROLLBACK");
      return res.status(409).json({ message: "Check the latest order status before paying again." });
    }
    const configuredMode = process.env.RAZORPAY_KEY_ID?.startsWith("rzp_live_") ? "live" : "test";
    if (order.payment_mode && order.payment_mode !== configuredMode) {
      await client.query("ROLLBACK");
      return res.status(409).json({ message: "This order belongs to a different or unverified payment environment. Contact support." });
    }
    const { items } = await paymentGateway().orders.fetchPayments(order.razorpay_order_id);
    // A successful lookup with these credentials establishes the environment for older orders.
    if (!order.payment_mode) {
      await client.query("UPDATE orders SET payment_mode = $1 WHERE id = $2", [configuredMode, order.id]);
    }
    const captured = items.find(payment => payment.status === "captured");
    if (captured) {
      await client.query("ROLLBACK");
      client.release();
      released = true;
      return confirmCapturedPayment(captured, req.user.id, res);
    }
    if (items.some(payment => payment.status !== "failed")) {
      await client.query("ROLLBACK");
      return res.status(409).json({ message: "Your payment is being checked. Please do not pay again." });
    }
    const lines = await client.query("SELECT variant_id, quantity FROM order_items WHERE order_id = $1 ORDER BY variant_id", [order.id]);
    for (const line of lines.rows) {
      const available = await availableStock(client, line.variant_id, order.id);
      const variant = await client.query("SELECT active FROM product_variants WHERE id = $1", [line.variant_id]);
      if (available < line.quantity || variant.rows[0]?.active === false) {
        await client.query("ROLLBACK");
        return res.status(409).json({ message: "This size is unavailable. Your order has not been charged by this retry." });
      }
    }
    await client.query("UPDATE orders SET payment_hold_until = NOW() + interval '15 minutes' WHERE id = $1", [order.id]);
    await client.query("COMMIT");
    return res.json({ orderId: order.razorpay_order_id, amount: Math.round(Number(order.total_amount) * 100),
      currency: "INR", keyId: process.env.RAZORPAY_KEY_ID, orderNumber: order.order_number });
  } catch {
    await client.query("ROLLBACK");
    return res.status(503).json({ message: "Unable to check your payment. Please try checking later." });
  } finally {
    if (!released) client.release();
  }
}

// Read-only gateway lookup; it never initiates a charge or refund.
export async function checkAdminPayment(req, res, { background = false } = {}) {
  try {
    const saved = await pool.query("SELECT * FROM orders WHERE id = $1", [req.params.id]);
    const order = saved.rows[0];
    if (!order?.razorpay_order_id) return res.status(404).json({ message: "No Razorpay order is recorded." });
    const mode = process.env.RAZORPAY_KEY_ID?.startsWith("rzp_live_") ? "live" : "test";
    if (order.payment_mode && order.payment_mode !== mode) {
      return res.status(409).json({ message: "Use the matching Test or Live environment to check this order." });
    }
    const { items } = await paymentGateway().orders.fetchPayments(order.razorpay_order_id);
    const payment = items.find(item => ["captured", "refunded"].includes(item.status));
    await pool.query("UPDATE orders SET payment_mode = $1 WHERE id = $2", [mode, order.id]);
    if (!payment) {
      if (items.length && items.every(item => item.status === "failed")) {
        await pool.query(
          "UPDATE orders SET payment_status = 'Failed' WHERE id = $1 AND order_status = 'Awaiting payment'",
          [order.id]
        );
      }
      return res.json({ message: "Checked with Razorpay. No captured payment was found." });
    }
    if (payment.order_id !== order.razorpay_order_id || payment.currency !== "INR" ||
        Number(payment.amount) !== Math.round(Number(order.total_amount) * 100)) {
      return res.status(409).json({ message: "Payment details do not match. Contact Razorpay support." });
    }
    if (Number(payment.amount_refunded) > 0) {
      // A refund does not establish that shipped goods were returned. Stock is reviewed separately.
      await pool.query(
        `UPDATE orders SET payment_status = $1, refunded_amount = $2, razorpay_payment_id = $3,
         payment_hold_until = NULL,
         order_status = CASE WHEN order_status = 'Awaiting payment' THEN 'Stock review' ELSE order_status END,
           updated_at = NOW() WHERE id = $4 AND COALESCE(refunded_amount, 0) <= $2`,
        [Number(payment.amount_refunded) === Number(payment.amount) ? "Refunded" : "Partially refunded",
         Number(payment.amount_refunded) / 100, payment.id, order.id]
      );
      return res.json({ message: "Refund status updated from Razorpay. Review fulfillment and returned stock separately." });
    }
      return confirmCapturedPayment(payment, background ? null : order.user_id, res);
  } catch {
    return res.status(503).json({ message: "Could not check Razorpay. Please try again later." });
  }
}

// @desc    Create Cash on Delivery (COD) Order
// @route   POST /api/orders/cod or POST /api/orders
// @access  Public (Guest or Authenticated)
export const createCodOrder = async (req, res) => {
  const client = await pool.connect();
  try {
    const { items } = req.body;

    // 1. Validate required contact and shipping details
    const validation = validateCustomerAndShippingDetails(req.body);
    if (validation.error) {
      return res.status(400).json({ message: validation.error });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Cart cannot be empty when creating an order." });
    }

    const {
      fullName,
      email,
      phone,
      address,
      city,
      state,
      pincode,
      orderNotes,
    } = validation.validDetails;

    // 2. Begin transaction
    await client.query("BEGIN");

    // 3. Server-side validation of cart items & price calculation directly from DB
    let calculation;
    try {
      calculation = await validateAndCalculateCart(client, items);
    } catch (valErr) {
      await client.query("ROLLBACK");
      return res.status(400).json({ message: valErr.message });
    }

    const { validatedItems, subtotal, shippingFee, total } = calculation;

    const userId = req.user.id;
    const orderNumber = `TDB-${Math.floor(100000 + Math.random() * 900000)}`;

    const orderResult = await client.query(
      `INSERT INTO orders
        (order_number, user_id, customer_name, customer_email, customer_phone,
         shipping_address, city, state, pincode, payment_method, order_notes,
         subtotal, shipping_fee, total_amount, order_status, razorpay_order_id,
         razorpay_payment_id, payment_status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
       RETURNING *`,
      [
        orderNumber,
        userId,
        fullName.trim(),
        email.trim().toLowerCase(),
        phone.trim(),
        address.trim(),
        city.trim(),
        state.trim(),
        pincode.trim(),
        "cod",
        orderNotes || "",
        subtotal,
        shippingFee,
        total,
        "Confirmed",
        null,
        null,
        "Pending",
      ]
    );

    const order = orderResult.rows[0];

    // Insert verified order items & update inventory
    for (const item of validatedItems) {
      await client.query(
        `INSERT INTO order_items
          (order_id, product_id, product_name, size_ml, price, quantity, image_url)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          order.id,
          item.productId,
          item.name,
          item.size_ml,
          item.price,
          item.quantity,
          item.image_url,
        ]
      );

      if (item.variantId) {
        await client.query(
          `UPDATE product_variants SET stock = GREATEST(0, stock - $1) WHERE id = $2`,
          [item.quantity, item.variantId]
        );
      }
    }

    // Save default address for authenticated users if not already present
    if (userId) {
      await client.query(
        `UPDATE users
         SET address = COALESCE(address, $1),
             city = COALESCE(city, $2),
             state = COALESCE(state, $3),
             pincode = COALESCE(pincode, $4),
             phone = COALESCE(phone, $5)
         WHERE id = $6`,
        [address.trim(), city.trim(), state.trim(), pincode.trim(), phone.trim(), userId]
      );
    }

    await client.query("COMMIT");
    invalidateProductCache();

    // Asynchronously dispatch Owner Alert & Customer Confirmation Emails for COD
    sendOrderConfirmationEmail(order.id).catch((err) => {
      console.warn("[OrderController] Async COD order confirmation email error for order " + order.id + ":", err.message);
    });

    res.status(201).json({
      message: "Order placed successfully with Cash on Delivery.",
      order: {
        id: order.id,
        orderNumber: order.order_number,
        customerName: order.customer_name,
        customerEmail: order.customer_email,
        customerPhone: order.customer_phone,
        shippingAddress: order.shipping_address,
        city: order.city,
        state: order.state,
        pincode: order.pincode,
        paymentMethod: order.payment_method,
        paymentStatus: order.payment_status,
        subtotal: order.subtotal,
        shippingFee: order.shipping_fee,
        total: order.total_amount,
        status: order.order_status,
        createdAt: order.created_at,
        items: validatedItems,
      },
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("COD order creation error:", error);
    res.status(500).json({ message: error.message || "Failed to place COD order. Please contact support." });
  } finally {
    client.release();
  }
};

/**
 * Universal order placement handler.
 * Routes to COD order creation if paymentMethod === 'cod' or no razorpay credentials are supplied.
 * Otherwise routes to Razorpay payment verification.
 */
export const handlePlaceOrder = async (req, res) => {
  const method = String(req.body?.paymentMethod || "").toLowerCase().trim();
  if (method === "cod" || method === "cash on delivery" || (!req.body?.razorpay_payment_id && method !== "online")) {
    return createCodOrder(req, res);
  }
  return verifyPaymentAndCreateOrder(req, res);
};

export const createOrder = handlePlaceOrder;

// @desc    Get order history for logged-in user
// @route   GET /api/orders/my-orders
// @access  Private
export const getMyOrders = async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT
        o.*,
        COALESCE(
          json_agg(
            json_build_object(
              'id', oi.id,
              'product_id', oi.product_id,
              'name', oi.product_name,
              'size_ml', oi.size_ml,
              'price', oi.price,
              'quantity', oi.quantity,
              'image_url', oi.image_url
            )
          ) FILTER (WHERE oi.id IS NOT NULL),
          '[]'::json
        ) AS items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.user_id = $1
      GROUP BY o.id
      ORDER BY o.created_at DESC
      `,
      [req.user.id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Get my orders error:", error);
    res.status(500).json({ message: "Failed to fetch order history." });
  }
};

// @desc    Get single order by ID
// @route   GET /api/orders/:id
// @access  Private (Owner or Admin only)
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `
      SELECT
        o.*,
        COALESCE(
          json_agg(
            json_build_object(
              'id', oi.id,
              'product_id', oi.product_id,
              'name', oi.product_name,
              'size_ml', oi.size_ml,
              'price', oi.price,
              'quantity', oi.quantity,
              'image_url', oi.image_url
            )
          ) FILTER (WHERE oi.id IS NOT NULL),
          '[]'::json
        ) AS items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.id = $1
      GROUP BY o.id
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Order not found." });
    }

    const order = result.rows[0];

    // Ensure customer can only access their own order unless they are an admin
    const isOwner = Number(order.user_id) === Number(req.user.id);
    const isAdmin = Boolean(req.user.is_admin);

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Access denied. You can only view your own orders." });
    }

    res.json(order);
  } catch (error) {
    console.error("Get order by ID error:", error);
    res.status(500).json({ message: "Failed to fetch order details." });
  }
};

/**
 * Resend order confirmation email (Admin only).
 * Bypasses the duplicate prevention flag to allow manual customer email resend.
 */
export const resendOrderConfirmation = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await sendOrderConfirmationEmail(id, { forceResend: true });

    if (!result.success) {
      return res.status(400).json({
        message: result.error || "Failed to resend confirmation email.",
      });
    }

    res.json({
      message: `Confirmation email successfully sent for order ${result.orderNumber}.`,
      orderNumber: result.orderNumber,
      messageId: result.messageId,
    });
  } catch (error) {
    console.error("Resend confirmation email error:", error);
    res.status(500).json({ message: "Server error resending confirmation email." });
  }
};
