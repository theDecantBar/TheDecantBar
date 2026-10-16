import pool from "../config/db.js";
import Razorpay from "razorpay";
import crypto from "node:crypto";

// @desc    Create Razorpay Order
// @route   POST /api/orders/create-razorpay-order
// @access  Public (Guest or Authenticated)
export const createRazorpayOrder = async (req, res) => {
  try {
    const { total, items, fullName, email, phone } = req.body;

    if (!total || Number(total) <= 0) {
      return res.status(400).json({ message: "Invalid order amount." });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Cart cannot be empty." });
    }

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

    res.status(error.statusCode || 500).json({
      message: errorMessage,
      error: errorMessage,
    });
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
      fullName,
      email,
      phone,
      address,
      city,
      state,
      pincode,
      orderNotes,
      items,
      subtotal,
      shippingFee = 99,
      total,
    } = req.body;

    // 1. Validate required contact and shipping details
    if (!fullName || !email || !phone || !address || !city || !state || !pincode) {
      return res.status(400).json({ message: "Missing required contact or shipping fields." });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Cart cannot be empty when creating an order." });
    }

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
    const userId = req.user ? req.user.id : null;
    const orderNumber = `TDB-${Math.floor(100000 + Math.random() * 900000)}`;

    await client.query("BEGIN");

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

    // Insert order items
    for (const item of items) {
      await client.query(
        `INSERT INTO order_items
          (order_id, product_id, product_name, size_ml, price, quantity, image_url)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          order.id,
          item.productId || item.id || null,
          item.name,
          item.size_ml,
          item.price,
          item.quantity,
          item.image_url || null,
        ]
      );
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
        items,
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

export const createOrder = verifyPaymentAndCreateOrder;

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
