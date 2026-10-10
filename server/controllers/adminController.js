import pool from "../config/db.js";

// @desc    Get dashboard metrics & summary
// @route   GET /api/admin/stats
// @access  Admin Private
export const getAdminStats = async (req, res) => {
  try {
    // 1. Orders count and revenue
    const ordersStatsResult = await pool.query(`
      SELECT
        COUNT(*)::int AS total_orders,
        COALESCE(SUM(total_amount), 0)::numeric AS total_revenue,
        COUNT(CASE WHEN order_status = 'Confirmed' THEN 1 END)::int AS count_confirmed,
        COUNT(CASE WHEN order_status = 'Processing' THEN 1 END)::int AS count_processing,
        COUNT(CASE WHEN order_status = 'Shipped' THEN 1 END)::int AS count_shipped,
        COUNT(CASE WHEN order_status = 'Delivered' THEN 1 END)::int AS count_delivered,
        COUNT(CASE WHEN order_status = 'Cancelled' THEN 1 END)::int AS count_cancelled
      FROM orders
    `);

    // 2. Users count
    const usersCountResult = await pool.query(`
      SELECT COUNT(*)::int AS total_users FROM users
    `);

    // 3. Products count
    const productsCountResult = await pool.query(`
      SELECT COUNT(*)::int AS total_products FROM products
    `);

    // 4. Recent 5 orders
    const recentOrdersResult = await pool.query(`
      SELECT id, order_number, customer_name, customer_email, total_amount, order_status, created_at
      FROM orders
      ORDER BY created_at DESC
      LIMIT 5
    `);

    const stats = ordersStatsResult.rows[0];
    const totalUsers = usersCountResult.rows[0].total_users;
    const totalProducts = productsCountResult.rows[0].total_products;

    res.json({
      totalRevenue: Number(stats.total_revenue),
      totalOrders: stats.total_orders,
      totalUsers,
      totalProducts,
      statusCounts: {
        confirmed: stats.count_confirmed,
        processing: stats.count_processing,
        shipped: stats.count_shipped,
        delivered: stats.count_delivered,
        cancelled: stats.count_cancelled,
      },
      recentOrders: recentOrdersResult.rows,
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    res.status(500).json({ message: "Failed to load dashboard metrics." });
  }
};

// @desc    Get all orders with filtering and search
// @route   GET /api/admin/orders
// @access  Admin Private
export const getAllOrders = async (req, res) => {
  try {
    const { status, search } = req.query;

    let queryText = `
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
      WHERE 1=1
    `;

    const queryParams = [];

    if (status && status !== "All") {
      queryParams.push(status);
      queryText += ` AND o.order_status = $${queryParams.length}`;
    }

    if (search && search.trim()) {
      queryParams.push(`%${search.trim()}%`);
      queryText += ` AND (
        o.order_number ILIKE $${queryParams.length}
        OR o.customer_name ILIKE $${queryParams.length}
        OR o.customer_email ILIKE $${queryParams.length}
        OR o.customer_phone ILIKE $${queryParams.length}
        OR o.city ILIKE $${queryParams.length}
      )`;
    }

    queryText += `
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `;

    const result = await pool.query(queryText, queryParams);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching admin orders:", error);
    res.status(500).json({ message: "Failed to fetch orders." });
  }
};

// @desc    Update order status
// @route   PUT /api/admin/orders/:id/status
// @access  Admin Private
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["Confirmed", "Processing", "Shipped", "Delivered", "Cancelled"];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        message: `Invalid status. Valid values: ${validStatuses.join(", ")}`,
      });
    }

    const result = await pool.query(
      `UPDATE orders
       SET order_status = $1
       WHERE id = $2
       RETURNING *`,
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Order not found." });
    }

    res.json({
      message: `Order status updated to ${status}.`,
      order: result.rows[0],
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Failed to update order status." });
  }
};

// @desc    Get all registered customers with aggregate order stats
// @route   GET /api/admin/customers
// @access  Admin Private
export const getAllCustomers = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        u.id,
        u.full_name,
        u.email,
        u.phone,
        u.city,
        u.state,
        u.pincode,
        u.is_admin,
        u.created_at,
        COUNT(o.id)::int AS orders_count,
        COALESCE(SUM(o.total_amount), 0)::numeric AS total_spent
      FROM users u
      LEFT JOIN orders o ON u.id = o.user_id
      GROUP BY u.id
      ORDER BY u.created_at DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({ message: "Failed to fetch customers list." });
  }
};
