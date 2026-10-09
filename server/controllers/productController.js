
console.log("PRODUCT CONTROLLER FILE LOADED");

import pool from "../config/db.js";

export const getProducts = async (req, res) => {
  console.log("NEW PRODUCT CONTROLLER IS RUNNING");

  try {
    const { search, category, gender, weather, type } = req.query;

    const result = await pool.query(
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
      LEFT JOIN product_variants pv
        ON p.id = pv.product_id
      WHERE
        ($1 = '' OR p.name ILIKE '%' || $1 || '%')
        AND ($2 = '' OR p.category ILIKE '%' || $2 || '%')
        AND ($3 = '' OR p.gender ILIKE '%' || $3 || '%')
        AND ($4 = '' OR p.weather ILIKE '%' || $4 || '%')
        AND ($5 = '' OR p.type ILIKE '%' || $5 || '%')
      GROUP BY p.id
      ORDER BY p.created_at DESC
      `,
      [
        search || "",
        category || "",
        gender || "",
        weather || "",
        type || "",
      ]
    );

    console.log(`Successfully fetched ${result.rows.length} products`);

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching products:", error);

    res.status(500).json({
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
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
      LEFT JOIN product_variants pv
        ON p.id = pv.product_id
      WHERE p.id = $1
      GROUP BY p.id
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching product:", error);

    res.status(500).json({
      message: "Failed to fetch product",
      error: error.message,
    });
  }
};
