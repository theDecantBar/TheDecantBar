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

    // Asynchronously dispatch Owner Alert & Customer Confirmation Emails
    (async () => {
      try {
        if (process.env.RESEND_API_KEY && process.env.EMAIL_FROM) {
          const { sendEmail } = await import("../services/emailService.js");
          const ownerEmail = (process.env.ADMIN_EMAILS || "thedecantbarofficial@gmail.com").split(",")[0].trim();

          const itemsHtml = items
            .map(
              (item) => `
              <tr style="border-bottom: 1px solid rgba(255,255,255,0.08);">
                <td style="padding: 10px 8px; color: #f4efe6;">${item.name}</td>
                <td style="padding: 10px 8px; color: #c6a15b; text-align: center;">${item.size_ml}ml</td>
                <td style="padding: 10px 8px; color: #f4efe6; text-align: center;">${item.quantity}</td>
                <td style="padding: 10px 8px; color: #f4efe6; text-align: right;">₹${item.price * item.quantity}</td>
              </tr>
            `
            )
            .join("");

          // 1. Send Owner Alert Email
          await sendEmail({
            to: ownerEmail,
            subject: `🛒 New Order: ${order.order_number} - ₹${order.total_amount} (${order.customer_name})`,
            html: `
              <div style="font-family: Arial, sans-serif; background: #11110f; color: #f4efe6; padding: 24px; border-radius: 8px; border: 1px solid rgba(198,161,91,0.3);">
                <h2 style="color: #c6a15b; margin-top: 0;">The Decant Bar · New Order Received</h2>
                <p>A new order has been paid and confirmed on your website:</p>
                <div style="background: #171715; border-left: 4px solid #c6a15b; padding: 14px 18px; margin: 16px 0;">
                  <p style="margin: 4px 0;"><strong>Order Number:</strong> ${order.order_number}</p>
                  <p style="margin: 4px 0;"><strong>Customer Name:</strong> ${order.customer_name}</p>
                  <p style="margin: 4px 0;"><strong>Email:</strong> ${order.customer_email}</p>
                  <p style="margin: 4px 0;"><strong>Phone:</strong> ${order.customer_phone}</p>
                  <p style="margin: 4px 0;"><strong>Shipping Address:</strong> ${order.shipping_address}, ${order.city}, ${order.state} - ${order.pincode}</p>
                  <p style="margin: 4px 0;"><strong>Total Paid:</strong> <span style="color: #c6a15b; font-weight: bold;">₹${order.total_amount}</span> (via Razorpay)</p>
                </div>
                <h4 style="color: #c6a15b; margin-bottom: 8px;">Ordered Items:</h4>
                <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                  <thead>
                    <tr style="border-bottom: 2px solid #c6a15b; color: #8e8a82; text-align: left;">
                      <th style="padding: 6px 8px;">Fragrance</th>
                      <th style="padding: 6px 8px; text-align: center;">Size</th>
                      <th style="padding: 6px 8px; text-align: center;">Qty</th>
                      <th style="padding: 6px 8px; text-align: right;">Total</th>
                    </tr>
                  </thead>
                  <tbody>${itemsHtml}</tbody>
                </table>
              </div>
            `,
            text: `New order ${order.order_number} received from ${order.customer_name} for ₹${order.total_amount}. Shipping to: ${order.shipping_address}, ${order.city}, ${order.pincode}.`,
          });

          // 2. Send Customer Order Confirmation Receipt
          try {
            await sendEmail({
              to: order.customer_email,
              subject: `✨ Order Confirmed: ${order.order_number} - The Decant Bar`,
              html: `
                <div style="font-family: Arial, sans-serif; background: #11110f; color: #f4efe6; padding: 24px; border-radius: 8px; border: 1px solid rgba(198,161,91,0.3);">
                  <h2 style="color: #c6a15b; margin-top: 0; text-align: center;">The Decant Bar</h2>
                  <p style="text-align: center; color: #8e8a82; font-size: 13px;">Authentic Handcrafted Fragrance Decants</p>
                  <hr style="border: 0; border-top: 1px solid rgba(198,161,91,0.2); margin: 20px 0;" />
                  <p>Dear ${order.customer_name},</p>
                  <p>Thank you for your order! We are preparing your authentic decants with precision glass atomizers.</p>
                  <div style="background: #171715; border-left: 4px solid #c6a15b; padding: 14px 18px; margin: 16px 0;">
                    <p style="margin: 4px 0;"><strong>Order Number:</strong> ${order.order_number}</p>
                    <p style="margin: 4px 0;"><strong>Estimated Delivery:</strong> 3–5 Business Days</p>
                    <p style="margin: 4px 0;"><strong>Shipping To:</strong> ${order.shipping_address}, ${order.city}, ${order.state} - ${order.pincode}</p>
                    <p style="margin: 4px 0;"><strong>Total Paid:</strong> <span style="color: #c6a15b; font-weight: bold;">₹${order.total_amount}</span></p>
                  </div>
                  <h4 style="color: #c6a15b; margin-bottom: 8px;">Order Summary:</h4>
                  <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                    <thead>
                      <tr style="border-bottom: 2px solid #c6a15b; color: #8e8a82; text-align: left;">
                        <th style="padding: 6px 8px;">Fragrance</th>
                        <th style="padding: 6px 8px; text-align: center;">Size</th>
                        <th style="padding: 6px 8px; text-align: center;">Qty</th>
                        <th style="padding: 6px 8px; text-align: right;">Total</th>
                      </tr>
                    </thead>
                    <tbody>${itemsHtml}</tbody>
                  </table>
                  <p style="margin-top: 24px; font-size: 12px; color: #8e8a82; text-align: center;">
                    If you have questions regarding your order, reply directly to this email or reach us on Instagram @thedecantbar.
                  </p>
                </div>
              `,
              text: `Thank you for your order ${order.order_number} with The Decant Bar! Estimated delivery is 3-5 business days. Total paid: ₹${order.total_amount}.`,
            });
          } catch (custEmailErr) {
            console.warn("Customer confirmation email skipped/failed (custom domain required for external recipients):", custEmailErr.message);
          }
        }
      } catch (err) {
        console.warn("Order email notification background error:", err.message);
      }
    })();

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
