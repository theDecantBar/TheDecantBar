import pool from "../config/db.js";

export const getProducts = async (req, res) => {
  
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
          '[]'
        ) AS variants
      FROM products p
      LEFT JOIN product_variants pv
        ON p.id = pv.product_id
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching products:", error.message);

    res.status(500).json({
      message: "Failed to fetch products",
    });
  }
};