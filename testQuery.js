import pool from "./server/config/db.js";

async function test() {
  console.log("Starting test query...");
  console.time("getProducts query");
  try {
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
      WHERE p.image_url IS NOT NULL AND TRIM(p.image_url) != ''
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `;
    const r = await pool.query(query);
    console.timeEnd("getProducts query");
    console.log("Returned rows:", r.rows.length);
  } catch (err) {
    console.error("Test query error:", err);
  } finally {
    await pool.end();
  }
}

test();
