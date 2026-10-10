import pool from "../config/db.js";

// @desc    Create a new order
// @route   POST /api/orders
// @access  Public (Guest or Authenticated)
export const createOrder = async (req, res) => {
  const client = await pool.connect();
  try {
    const {
      fullName,
      email,
      phone,
      address,
      city,
      state,
      pincode,
      paymentMethod,
      orderNotes,
      items,
      subtotal,
      shippingFee = 99,
      total,
    } = req.body;

    if (!fullName || !email || !phone || !address || !city || !state || !pincode) {
      return res.status(400).json({ message: "Missing required contact or shipping fields." });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Cart cannot be empty when creating an order." });
    }

    const userId = req.user ? req.user.id : null;
    const orderNumber = `TDB-${Math.floor(100000 + Math.random() * 900000)}`;

    await client.query("BEGIN");

    // 1. Insert order
    const orderResult = await client.query(
      `INSERT INTO orders
        (order_number, user_id, customer_name, customer_email, customer_phone,
         shipping_address, city, state, pincode, payment_method, order_notes,
         subtotal, shipping_fee, total_amount, order_status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
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
        paymentMethod || "cod",
        orderNotes || "",
        subtotal,
        shippingFee,
        total,
        "Confirmed",
      ]
    );

    const order = orderResult.rows[0];

    // 2. Insert order items
    for (const item of items) {
      await client.query(
        `INSERT INTO order_items
          (order_id, product_id, product_name, size_ml, price, quantity, image_url)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          order.id,
          item.id || null,
          item.name,
          item.size_ml,
          item.price,
          item.quantity,
          item.image_url || null,
        ]
      );
    }

    // 3. If user is authenticated and doesn't have address saved, save it as default
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
      message: "Order placed successfully.",
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
    console.error("Order creation error:", error);
    res.status(500).json({ message: "Failed to place order. Please try again." });
  } finally {
    client.release();
  }
};

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
