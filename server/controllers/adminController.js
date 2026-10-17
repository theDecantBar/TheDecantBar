import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pool from "../config/db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// @desc    Get dashboard executive KPI statistics
// @route   GET /api/admin/stats
// @access  Private / Admin
export const getAdminStats = async (req, res) => {
  try {
    // 1. Total revenue & orders count
    const revenueRes = await pool.query(`
      SELECT 
        COALESCE(SUM(total_amount), 0) AS total_revenue,
        COUNT(*) AS total_orders,
        COUNT(*) FILTER (WHERE order_status = 'Confirmed') AS confirmed_orders,
        COUNT(*) FILTER (WHERE order_status = 'In Packaging') AS packaging_orders,
        COUNT(*) FILTER (WHERE order_status = 'Shipped') AS shipped_orders,
        COUNT(*) FILTER (WHERE order_status = 'Delivered') AS delivered_orders,
        COUNT(*) FILTER (WHERE order_status = 'Cancelled') AS cancelled_orders
      FROM orders
    `);

    // 2. Product & variant metrics
    const productRes = await pool.query(`
      SELECT 
        COUNT(DISTINCT p.id) AS total_products,
        COUNT(pv.id) FILTER (WHERE pv.stock <= 5 AND pv.active = true) AS low_stock_count,
        COUNT(pv.id) FILTER (WHERE pv.stock = 0 AND pv.active = true) AS out_of_stock_count
      FROM products p
      LEFT JOIN product_variants pv ON p.id = pv.product_id
    `);

    // 3. Recent 5 orders
    const recentOrdersRes = await pool.query(`
      SELECT 
        o.id,
        o.order_number,
        o.customer_name,
        o.customer_email,
        o.total_amount,
        o.order_status,
        o.payment_method,
        o.created_at,
        COUNT(oi.id) AS items_count
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      GROUP BY o.id
      ORDER BY o.created_at DESC
      LIMIT 5
    `);

    res.json({
      revenue: Number(revenueRes.rows[0].total_revenue),
      totalOrders: Number(revenueRes.rows[0].total_orders),
      confirmedOrders: Number(revenueRes.rows[0].confirmed_orders),
      packagingOrders: Number(revenueRes.rows[0].packaging_orders),
      shippedOrders: Number(revenueRes.rows[0].shipped_orders),
      deliveredOrders: Number(revenueRes.rows[0].delivered_orders),
      cancelledOrders: Number(revenueRes.rows[0].cancelled_orders),
      totalProducts: Number(productRes.rows[0].total_products),
      lowStockCount: Number(productRes.rows[0].low_stock_count),
      outOfStockCount: Number(productRes.rows[0].out_of_stock_count),
      recentOrders: recentOrdersRes.rows,
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    res.status(500).json({ message: "Failed to load admin statistics." });
  }
};

// @desc    Get all orders with optional search and status filter
// @route   GET /api/admin/orders
// @access  Private / Admin
export const getAdminOrders = async (req, res) => {
  try {
    const { status, search } = req.query;

    let query = `
      SELECT 
        o.*,
        COALESCE(
          json_agg(
            json_build_object(
              'id', oi.id,
              'productId', oi.product_id,
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

    const params = [];

    if (status && status !== "All") {
      params.push(status);
      query += ` AND o.order_status = $${params.length}`;
    }

    if (search && search.trim() !== "") {
      params.push(`%${search.trim().toLowerCase()}%`);
      query += ` AND (
        LOWER(o.order_number) LIKE $${params.length}
        OR LOWER(o.customer_name) LIKE $${params.length}
        OR LOWER(o.customer_email) LIKE $${params.length}
        OR LOWER(o.customer_phone) LIKE $${params.length}
        OR LOWER(o.city) LIKE $${params.length}
      )`;
    }

    query += ` GROUP BY o.id ORDER BY o.created_at DESC`;

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error("Admin orders error:", error);
    res.status(500).json({ message: "Failed to retrieve orders." });
  }
};

// @desc    Update order status and tracking details
// @route   PUT /api/admin/orders/:id/status
// @access  Private / Admin
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus, courierName, trackingNumber } = req.body;

    const validStatuses = [
      "Confirmed",
      "In Packaging",
      "Shipped",
      "Out for Delivery",
      "Delivered",
      "Cancelled",
    ];

    if (orderStatus && !validStatuses.includes(orderStatus)) {
      return res.status(400).json({
        message: `Invalid order status. Must be one of: ${validStatuses.join(", ")}`,
      });
    }

    const result = await pool.query(
      `UPDATE orders
       SET 
         order_status = COALESCE($1, order_status),
         courier_name = COALESCE($2, courier_name),
         tracking_number = COALESCE($3, tracking_number),
         updated_at = CURRENT_TIMESTAMP
       WHERE id = $4
       RETURNING *`,
      [orderStatus || null, courierName || null, trackingNumber || null, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Order not found." });
    }

    const updatedOrder = result.rows[0];

    // Trigger Order Shipped notification email if status is Shipped
    if (orderStatus === "Shipped" && updatedOrder.customer_email) {
      (async () => {
        try {
          if (process.env.RESEND_API_KEY && process.env.EMAIL_FROM) {
            const { sendEmail } = await import("../services/emailService.js");
            await sendEmail({
              to: updatedOrder.customer_email,
              subject: `📦 Your Order Has Shipped: ${updatedOrder.order_number} - The Decant Bar`,
              html: `
                <div style="font-family: Arial, sans-serif; background: #11110f; color: #f4efe6; padding: 24px; border-radius: 8px; border: 1px solid rgba(198,161,91,0.3);">
                  <h2 style="color: #c6a15b; margin-top: 0; text-align: center;">The Decant Bar</h2>
                  <p style="text-align: center; color: #8e8a82; font-size: 13px;">Your Handcrafted Decants Are On The Way!</p>
                  <hr style="border: 0; border-top: 1px solid rgba(198,161,91,0.2); margin: 20px 0;" />
                  <p>Dear ${updatedOrder.customer_name},</p>
                  <p>Great news! Your fragrance decants have been securely packaged and handed over to our courier partner.</p>
                  <div style="background: #171715; border-left: 4px solid #c6a15b; padding: 14px 18px; margin: 16px 0;">
                    <p style="margin: 4px 0;"><strong>Order Number:</strong> ${updatedOrder.order_number}</p>
                    <p style="margin: 4px 0;"><strong>Courier Partner:</strong> ${updatedOrder.courier_name || "Express Courier"}</p>
                    <p style="margin: 4px 0;"><strong>Tracking AWB:</strong> <span style="color: #c6a15b; font-weight: bold;">${updatedOrder.tracking_number || "Provided upon pickup"}</span></p>
                    <p style="margin: 4px 0;"><strong>Delivery Destination:</strong> ${updatedOrder.shipping_address}, ${updatedOrder.city} - ${updatedOrder.pincode}</p>
                  </div>
                  <p style="font-size: 13px; color: #c5c1b9;">
                    Your parcel will typically arrive within 2–4 business days. Allow your decants 24 hours to settle after transit before sampling for optimal fragrance notes.
                  </p>
                </div>
              `,
              text: `Your order ${updatedOrder.order_number} has shipped via ${updatedOrder.courier_name || "Express Courier"}. Tracking: ${updatedOrder.tracking_number || "In transit"}.`,
            });
          }
        } catch (emailErr) {
          console.warn("Order shipped email skipped/failed:", emailErr.message);
        }
      })();
    }

    res.json({
      message: "Order updated successfully.",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Update order error:", error);
    res.status(500).json({ message: "Failed to update order status." });
  }
};

// @desc    Get all catalog products with all size variants & stocks
// @route   GET /api/admin/products
// @access  Private / Admin
export const getAdminProducts = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        p.*,
        COALESCE(
          json_agg(
            json_build_object(
              'id', pv.id,
              'size_ml', pv.size_ml,
              'price', pv.price,
              'stock', pv.stock,
              'active', pv.active
            )
            ORDER BY pv.size_ml
          ) FILTER (WHERE pv.id IS NOT NULL),
          '[]'::json
        ) AS variants
      FROM products p
      LEFT JOIN product_variants pv ON p.id = pv.product_id
      GROUP BY p.id
      ORDER BY p.name ASC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("Admin products error:", error);
    res.status(500).json({ message: "Failed to retrieve products." });
  }
};

// @desc    Create new fragrance product with decant variants
// @route   POST /api/admin/products
// @access  Private / Admin
export const createProduct = async (req, res) => {
  const client = await pool.connect();
  try {
    const {
      name,
      brand,
      description,
      imageUrl,
      category,
      gender,
      weather,
      type,
      fullBottlePrice,
      variants = [],
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Product name is required." });
    }

    await client.query("BEGIN");

    // 1. Insert product
    const productResult = await client.query(
      `INSERT INTO products 
        (name, brand, description, image_url, category, gender, weather, type, full_bottle_price)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        name.trim(),
        brand ? brand.trim() : null,
        description ? description.trim() : null,
        imageUrl ? imageUrl.trim() : null,
        category || "Designer",
        gender || "Unisex",
        weather || "All-Season",
        type || "EDP",
        fullBottlePrice ? Number(fullBottlePrice) : null,
      ]
    );

    const product = productResult.rows[0];

    // 2. Insert variants (if provided)
    const insertedVariants = [];
    if (Array.isArray(variants) && variants.length > 0) {
      for (const v of variants) {
        if (!v.size_ml || !v.price) continue;
        const vResult = await client.query(
          `INSERT INTO product_variants 
            (product_id, size_ml, price, stock, active)
           VALUES ($1, $2, $3, $4, $5)
           RETURNING *`,
          [
            product.id,
            Number(v.size_ml),
            Number(v.price),
            v.stock !== undefined ? Number(v.stock) : 50,
            v.active !== undefined ? Boolean(v.active) : true,
          ]
        );
        insertedVariants.push(vResult.rows[0]);
      }
    }

    await client.query("COMMIT");

    res.status(201).json({
      message: "Fragrance created successfully.",
      product: {
        ...product,
        variants: insertedVariants,
      },
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Create product error:", error);
    res.status(500).json({ message: "Failed to create fragrance." });
  } finally {
    client.release();
  }
};

// @desc    Update existing product and its decant variants
// @route   PUT /api/admin/products/:id
// @access  Private / Admin
export const updateProduct = async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    const {
      name,
      brand,
      description,
      imageUrl,
      category,
      gender,
      weather,
      type,
      fullBottlePrice,
      variants = [],
    } = req.body;

    await client.query("BEGIN");

    // 1. Update product base info
    const updateResult = await client.query(
      `UPDATE products
       SET 
         name = COALESCE(NULLIF(TRIM($1), ''), name),
         brand = TRIM($2),
         description = TRIM($3),
         image_url = TRIM($4),
         category = COALESCE(NULLIF(TRIM($5), ''), category),
         gender = COALESCE(NULLIF(TRIM($6), ''), gender),
         weather = TRIM($7),
         type = TRIM($8),
         full_bottle_price = $9
       WHERE id = $10
       RETURNING *`,
      [
        name ? name.trim() : null,
        brand ? brand.trim() : null,
        description !== undefined ? (description ? description.trim() : null) : null,
        imageUrl !== undefined ? (imageUrl ? imageUrl.trim() : null) : null,
        category ? category.trim() : "Designer",
        gender ? gender.trim() : "Unisex",
        weather !== undefined ? (weather ? weather.trim() : null) : null,
        type !== undefined ? (type ? type.trim() : null) : null,
        fullBottlePrice !== undefined && fullBottlePrice !== "" ? Number(fullBottlePrice) : null,
        id,
      ]
    );

    if (updateResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Product not found." });
    }

    // 2. Synchronize variants if provided
    if (Array.isArray(variants)) {
      for (const v of variants) {
        if (v.id) {
          // Update existing variant
          await client.query(
            `UPDATE product_variants
             SET 
               size_ml = $1,
               price = $2,
               stock = $3,
               active = $4
             WHERE id = $5 AND product_id = $6`,
            [
              Number(v.size_ml),
              Number(v.price),
              Number(v.stock || 0),
              v.active !== undefined ? Boolean(v.active) : true,
              v.id,
              id,
            ]
          );
        } else if (v.size_ml && v.price) {
          // Insert new variant
          await client.query(
            `INSERT INTO product_variants
              (product_id, size_ml, price, stock, active)
             VALUES ($1, $2, $3, $4, $5)`,
            [
              id,
              Number(v.size_ml),
              Number(v.price),
              Number(v.stock || 0),
              v.active !== undefined ? Boolean(v.active) : true,
            ]
          );
        }
      }
    }

    await client.query("COMMIT");

    // Re-fetch updated product with all variants
    const finalResult = await pool.query(
      `
      SELECT 
        p.*,
        COALESCE(
          json_agg(
            json_build_object(
              'id', pv.id,
              'size_ml', pv.size_ml,
              'price', pv.price,
              'stock', pv.stock,
              'active', pv.active
            )
            ORDER BY pv.size_ml
          ) FILTER (WHERE pv.id IS NOT NULL),
          '[]'::json
        ) AS variants
      FROM products p
      LEFT JOIN product_variants pv ON p.id = pv.product_id
      WHERE p.id = $1
      GROUP BY p.id
    `,
      [id]
    );

    res.json({
      message: "Product updated successfully.",
      product: finalResult.rows[0],
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Update product error:", error);
    res.status(500).json({ message: "Failed to update fragrance." });
  } finally {
    client.release();
  }
};

// @desc    Delete fragrance product and its variants
// @route   DELETE /api/admin/products/:id
// @access  Private / Admin
export const deleteProduct = async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    await client.query("BEGIN");
    await client.query("DELETE FROM product_variants WHERE product_id = $1", [id]);
    const result = await client.query("DELETE FROM products WHERE id = $1 RETURNING id, name", [id]);
    await client.query("COMMIT");

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Product not found." });
    }

    res.json({
      message: `Product '${result.rows[0].name}' deleted successfully.`,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Delete product error:", error);
    res.status(500).json({ message: "Failed to delete product." });
  } finally {
    client.release();
  }
};

// @desc    Get all reviews for moderation
// @route   GET /api/admin/reviews
// @access  Private / Admin
export const getAdminReviews = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM reviews ORDER BY created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error("Admin reviews error:", error);
    res.status(500).json({ message: "Failed to retrieve reviews." });
  }
};

// @desc    Delete a review
// @route   DELETE /api/admin/reviews/:id
// @access  Private / Admin
export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("DELETE FROM reviews WHERE id = $1 RETURNING id", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Review not found." });
    }
    res.json({ message: "Review removed successfully." });
  } catch (error) {
    console.error("Delete review error:", error);
    res.status(500).json({ message: "Failed to delete review." });
  }
};

// @desc    Update single decant variant stock quantity & active state
// @route   PUT /api/admin/variants/:id/stock
// @access  Private / Admin
export const updateVariantStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { stock, active } = req.body;

    if (stock === undefined && active === undefined) {
      return res.status(400).json({ message: "Stock quantity or active state is required." });
    }

    const cleanStock = stock !== undefined ? Math.max(0, parseInt(stock, 10) || 0) : null;

    let query;
    let params;

    if (cleanStock !== null && active !== undefined) {
      query = `
        UPDATE product_variants
        SET stock = $1, active = $2
        WHERE id = $3
        RETURNING *
      `;
      params = [cleanStock, Boolean(active), id];
    } else if (cleanStock !== null) {
      query = `
        UPDATE product_variants
        SET stock = $1
        WHERE id = $2
        RETURNING *
      `;
      params = [cleanStock, id];
    } else {
      query = `
        UPDATE product_variants
        SET active = $1
        WHERE id = $2
        RETURNING *
      `;
      params = [Boolean(active), id];
    }

    const result = await pool.query(query, params);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Decant variant not found." });
    }

    const updatedVariant = result.rows[0];

    // Trigger low stock email alert to owner when stock drops to <= 5
    if (cleanStock !== null && cleanStock <= 5) {
      (async () => {
        try {
          const prodRes = await pool.query(
            "SELECT name, brand FROM products WHERE id = $1",
            [updatedVariant.product_id]
          );
          const productName = prodRes.rows[0]?.name || "Fragrance";
          const ownerEmail = (process.env.ADMIN_EMAILS || "thedecantbarofficial@gmail.com").split(",")[0].trim();

          if (process.env.RESEND_API_KEY && process.env.EMAIL_FROM) {
            const { sendEmail } = await import("../services/emailService.js");
            await sendEmail({
              to: ownerEmail,
              subject: `🚨 Low Stock Alert: ${productName} (${updatedVariant.size_ml}ml) has only ${cleanStock} bottle(s) left!`,
              html: `
                <div style="font-family: Arial, sans-serif; background: #11110f; color: #f4efe6; padding: 24px; border-radius: 8px; border: 1px solid rgba(198,161,91,0.3);">
                  <h2 style="color: #c6a15b; margin-top: 0;">The Decant Bar · Inventory Alert</h2>
                  <p>Attention Owner,</p>
                  <p>A decant size is running low on inventory and requires restocking:</p>
                  <div style="background: #171715; border-left: 4px solid #c6a15b; padding: 16px; margin: 16px 0;">
                    <p style="margin: 4px 0;"><strong>Fragrance:</strong> ${productName}</p>
                    <p style="margin: 4px 0;"><strong>Decant Size:</strong> ${updatedVariant.size_ml}ml</p>
                    <p style="margin: 4px 0;"><strong>Remaining Stock:</strong> <span style="color: ${cleanStock === 0 ? '#ef4444' : '#f59e0b'}; font-weight: bold;">${cleanStock} bottle(s) ${cleanStock === 0 ? '(SOLD OUT)' : ''}</span></p>
                  </div>
                  <p>You can adjust bottle stock directly from your <a href="http://localhost:5173/admin/inventory" style="color: #c6a15b; font-weight: bold;">Inventory Operations Hub</a>.</p>
                </div>
              `,
              text: `Low Stock Alert: ${productName} (${updatedVariant.size_ml}ml) has only ${cleanStock} bottle(s) left. Please restock in your inventory hub.`,
            });
          }
        } catch (emailErr) {
          console.warn("Low stock alert email skipped/failed:", emailErr.message);
        }
      })();
    }

    res.json({
      message: "Variant stock updated successfully.",
      variant: updatedVariant,
    });
  } catch (error) {
    console.error("Update variant stock error:", error);
    res.status(500).json({ message: "Failed to update decant variant stock." });
  }
};

// @desc    Bulk set all variants stock in database (e.g. Set all to 10)
// @route   POST /api/admin/variants/bulk-stock
// @access  Private / Admin
export const bulkUpdateAllStock = async (req, res) => {
  try {
    const { stock = 10 } = req.body;
    const cleanStock = Math.max(0, parseInt(stock, 10) || 0);
    const result = await pool.query("UPDATE product_variants SET stock = $1 RETURNING id", [cleanStock]);
    res.json({
      message: `All ${result.rowCount} bottle variants successfully updated to ${cleanStock} units.`,
      updatedCount: result.rowCount,
    });
  } catch (error) {
    console.error("Bulk stock update error:", error);
    res.status(500).json({ message: "Failed to bulk update variant stock." });
  }
};

// @desc    Upload product bottle image (saves to public/images/perfumes or returns data URI fallback)
// @route   POST /api/admin/upload-image
// @access  Private / Admin
export const uploadProductImage = async (req, res) => {
  try {
    const { image, filename } = req.body;
    if (!image) {
      return res.status(400).json({ message: "No image data provided" });
    }

    // Match data URI scheme: data:image/png;base64,....
    const matches = image.match(/^data:image\/([a-zA-Z0-9+.-]+);base64,(.+)$/);
    if (!matches) {
      // If it's already a URL or path, just echo it back
      return res.json({ success: true, imageUrl: image });
    }

    let ext = matches[1].toLowerCase();
    if (ext === "jpeg") ext = "jpg";
    if (ext.includes("svg")) ext = "svg";
    if (ext.includes("webp")) ext = "webp";
    if (ext.includes("avif")) ext = "avif";
    if (ext.includes("png")) ext = "png";

    ext = ext.replace(/[^a-z0-9]/g, "");
    if (!ext) ext = "jpg";

    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, "base64");

    const cleanBaseName = filename
      ? path.parse(filename).name.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 40)
      : "bottle";
    const uniqueFileName = `${cleanBaseName}_${Date.now()}.${ext}`;

    const uploadsDir = path.resolve(__dirname, "../../public/images/perfumes");
    try {
      await fs.mkdir(uploadsDir, { recursive: true });
      const targetPath = path.join(uploadsDir, uniqueFileName);
      await fs.writeFile(targetPath, buffer);

      return res.json({
        success: true,
        imageUrl: `/images/perfumes/${uniqueFileName}`,
      });
    } catch (fsErr) {
      console.warn(
        "Could not save to local filesystem, returning base64 data URI fallback:",
        fsErr.message
      );
      return res.json({
        success: true,
        imageUrl: image,
      });
    }
  } catch (error) {
    console.error("Upload image error:", error);
    res.status(500).json({ message: "Failed to process image upload." });
  }
};

