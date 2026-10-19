import dotenv from "dotenv";
dotenv.config();
import pg from "pg";

const pool = new pg.Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 6543,
  ssl: { rejectUnauthorized: false },
});

async function check() {
  try {
    const res = await pool.query(`
      SELECT id, name, length(image_url) as img_len, substring(image_url from 1 for 30) as img_preview
      FROM products
      ORDER BY length(image_url) DESC NULLS LAST
      LIMIT 15
    `);
    console.log("Top image sizes in DB:");
    res.rows.forEach((r) => {
      console.log(`ID: ${r.id} | ${r.name} | Size: ${r.img_len} chars (${(r.img_len / 1024 / 1024).toFixed(2)} MB) | Preview: ${r.img_preview}`);
    });

    const sumRes = await pool.query(`
      SELECT SUM(length(image_url)) as total_chars FROM products
    `);
    console.log(`\nTOTAL image data across all products: ${(sumRes.rows[0].total_chars / 1024 / 1024).toFixed(2)} MB`);
  } catch (err) {
    console.error("Check error:", err.message);
  } finally {
    await pool.end();
  }
}

check();
