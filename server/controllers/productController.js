
console.log("PRODUCT CONTROLLER FILE LOADED");

import pool from "../config/db.js";

const parseMultiParam = (param) => {
  if (!param) return [];
  if (Array.isArray(param)) {
    return param.flatMap((p) => String(p).split(",")).map((s) => s.trim()).filter(Boolean);
  }
  return String(param).split(",").map((s) => s.trim()).filter(Boolean);
};

export const getProducts = async (req, res) => {
  try {
    const { search, category, gender, weather, type } = req.query;

    const conditions = [];
    const values = [];

    // Storefront only displays perfumes with valid image URLs
    conditions.push("p.image_url IS NOT NULL AND TRIM(p.image_url) != ''");

    // Search query by product name
    if (search && search.trim() !== "") {
      values.push(`%${search.trim()}%`);
      conditions.push(`p.name ILIKE $${values.length}`);
    }

    // Fragrance Classification / Category (supports single or multiple values)
    const categories = parseMultiParam(category);
    if (categories.length > 0) {
      const catClauses = [];
      categories.forEach((cat) => {
        values.push(`%${cat}%`);
        catClauses.push(`p.category ILIKE $${values.length}`);
      });
      conditions.push(`(${catClauses.join(" OR ")})`);
    }

    // Gender (supports multiple: Men, Women, Unisex)
    const genders = parseMultiParam(gender).map((g) => g.toUpperCase());
    if (genders.length > 0) {
      const genderClauses = [];
      if (genders.some((g) => ["M", "MEN"].includes(g))) {
        genderClauses.push(`UPPER(TRIM(p.gender)) IN ('M', 'MEN')`);
      }
      if (genders.some((g) => ["W", "WOMEN"].includes(g))) {
        genderClauses.push(`UPPER(TRIM(p.gender)) IN ('W', 'WOMEN')`);
      }
      if (genders.some((g) => ["M/W", "UNISEX", "U"].includes(g))) {
        genderClauses.push(`UPPER(TRIM(p.gender)) IN ('M/W', 'UNISEX', 'U')`);
      }
      if (genderClauses.length > 0) {
        conditions.push(`(${genderClauses.join(" OR ")})`);
      }
    }

    // Season / Weather (supports Summer, Winter)
    const seasons = parseMultiParam(weather).map((w) => w.toLowerCase());
    if (seasons.length > 0) {
      const seasonClauses = [];
      if (seasons.includes("summer")) {
        seasonClauses.push(
          `(p.weather ILIKE '%summer%' OR p.weather ILIKE '%summeer%' OR p.weather ILIKE '%all season%')`
        );
      }
      if (seasons.includes("winter")) {
        seasonClauses.push(
          `(p.weather ILIKE '%winter%' OR p.weather ILIKE '%all season%')`
        );
      }
      seasons.forEach((s) => {
        if (s !== "summer" && s !== "winter") {
          values.push(`%${s}%`);
          seasonClauses.push(`p.weather ILIKE $${values.length}`);
        }
      });
      if (seasonClauses.length > 0) {
        conditions.push(`(${seasonClauses.join(" OR ")})`);
      }
    }

    // Type filter (EDP, EDT, Parfum, etc.)
    if (type && type.trim() !== "") {
      values.push(`%${type.trim()}%`);
      conditions.push(`p.type ILIKE $${values.length}`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const query = `
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
      ${whereClause}
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `;

    const result = await pool.query(query, values);
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

    const numericId = parseInt(id, 10);
    if (!Number.isInteger(numericId) || numericId <= 0 || !/^\d+$/.test(String(id).trim())) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

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
      [numericId]
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
