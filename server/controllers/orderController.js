import pool from "../config/db.js";
import { getPrimaryAdminEmail } from "../config/adminConfig.js";
import { invalidateProductCache } from "./productController.js";
import { sendOrderConfirmationEmail } from "../services/orderEmailService.js";
import Razorpay from "razorpay";
import crypto from "node:crypto";

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
    const qty = parseInt(item.quantity, 10);
    if (isNaN(qty) || qty <= 0) {
      throw new Error(`Invalid quantity for item "${item.name || "Fragrance"}".`);
    }

    let variantRow = null;

    if (item.variantId) {
      const vRes = await client.query(
        `SELECT pv.id, pv.product_id, pv.size_ml, pv.price, pv.stock,
                p.name AS product_name, p.image_url
         FROM product_variants pv
         JOIN products p ON pv.product_id = p.id
         WHERE pv.id = $1`,
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
         WHERE pv.product_id = $1 AND pv.size_ml = $2`,
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

    if (variantRow.stock !== null && variantRow.stock !== undefined && variantRow.stock < qty) {
      throw new Error(
        `Insufficient stock for "${variantRow.product_name}" (${variantRow.size_ml}ml). Only ${variantRow.stock} bottle(s) available.`
      );
    }

    const unitPrice = Number(variantRow.price);
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

  // Shipping calculation:
  // - Subtotal below ₹500: ₹80 shipping fee
  // - Subtotal ₹500 or above: FREE shipping (₹0)
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
  const client = await pool.connect();
  try {
    const { items, fullName, email, phone } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Cart cannot be empty." });
    }

    // Validate customer contact before creating Razorpay order
    const cleanName = String(fullName || "").trim();
    const cleanEmail = String(email || "").trim().toLowerCase();
    const cleanPhone = String(phone || "").trim().replace(/^(\+91|91|0)/, "").replace(/[\s-]/g, "");

    if (!cleanName || cleanName.length < 2) {
      return res.status(400).json({ message: "Please provide your full name before initiating payment." });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(cleanEmail)) {
      return res.status(400).json({ message: "Please provide a valid email address." });
    }
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      return res.status(400).json({ message: "Please provide a valid 10-digit Indian mobile number." });
    }

    // Server-side calculation of order total directly from database records
    let calculation;
    try {
      calculation = await validateAndCalculateCart(client, items);
    } catch (valErr) {
      return res.status(400).json({ message: valErr.message });
    }

    const { total } = calculation;

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

    const razorpay = new Razorpay({ key_id, key_secret });

    // Razorpay amount in paise (1 INR = 100 paise)
    const amountInPaise = Math.round(Number(total) * 100);

    const rzpOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `tdb_${Date.now()}`.slice(0, 40),
      notes: {
        customerName: fullName ? String(fullName).slice(0, 40) : "",
        customerEmail: email ? String(email).slice(0, 40) : "",
        customerPhone: phone ? String(phone).slice(0, 30) : "",
      },
    });

    res.status(200).json({
      orderId: rzpOrder.id,
      amount: rzpOrder.amount,
      currency: rzpOrder.currency,
      keyId: key_id,
      subtotal: calculation.subtotal,
      shippingFee: calculation.shippingFee,
      total: calculation.total,
    });
  } catch (error) {
    console.error("Razorpay order creation error:", error);
    let errorMessage =
      error.error?.description ||
      error.message ||
      "Failed to initiate online payment. Please try again.";

    if (
      error.statusCode === 401 ||
      errorMessage.toLowerCase().includes("authentication failed")
    ) {
      errorMessage =
        "Razorpay authentication failed. Please verify that your RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env are valid Test/Live keys.";
    }

    const responseStatus = error.statusCode === 401 ? 502 : (error.statusCode || 500);
    res.status(responseStatus).json({
      message: errorMessage,
      error: errorMessage,
    });
  } finally {
    client.release();
  }
};

// @desc    Verify Razorpay Payment Signature and Create Order
// @route   POST /api/orders/verify-payment
// @access  Public (Guest or Authenticated)
export const verifyPaymentAndCreateOrder = async (req, res) => {
  const client = await pool.connect();
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      items,
    } = req.body;

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

    // 2. Cryptographic signature verification
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        message: "Payment verification failed. Missing Razorpay payment credentials.",
      });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      console.error(
        "Razorpay verification error: Missing RAZORPAY_KEY_SECRET in server environment."
      );
      return res.status(500).json({
        message:
          "Razorpay payment gateway is not configured. Missing Secret Key on the server.",
      });
    }

    const generatedSignature = crypto
      .createHmac("sha256", secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      console.error("Razorpay signature mismatch for order:", razorpay_order_id);
      return res.status(400).json({
        message: "Payment verification failed. Invalid transaction signature.",
      });
    }

    // 3. Database Insertion inside Transaction
    await client.query("BEGIN");

    // Server-side validation of cart items & prices
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
        "Online (Razorpay)",
        orderNotes || "",
        subtotal,
        shippingFee,
        total,
        "Confirmed",
        razorpay_order_id,
        razorpay_payment_id,
        "Paid",
      ]
    );

    const order = orderResult.rows[0];

    // Insert order items & update inventory
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

    // Asynchronously dispatch Owner Alert & Customer Confirmation Emails
    sendOrderConfirmationEmail(order.id).catch((err) => {
      console.warn("[OrderController] Async order confirmation email error for order " + order.id + ":", err.message);
    });

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
      WHERE o.user_id = $1 OR LOWER(o.customer_email) = LOWER($2)
      GROUP BY o.id
      ORDER BY o.created_at DESC
      `,
      [req.user.id, req.user.email]
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
