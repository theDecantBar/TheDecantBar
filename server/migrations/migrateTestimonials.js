import fs from "node:fs/promises";
import pool from "../config/db.js";

// Explicit CLI migration. Never imported by the running application.
try {
  const sql = await fs.readFile(new URL("./testimonial_reviews.sql", import.meta.url), "utf8");
  const client = await pool.connect();
  try {
    const before = await client.query("SELECT COUNT(*)::int AS count FROM reviews");
    await client.query(sql);
    const after = await client.query("SELECT COUNT(*)::int AS count FROM reviews");
    console.log(JSON.stringify({ migration: "testimonial_reviews", applied: true,
      existingReviewsPreserved: before.rows[0].count === after.rows[0].count,
      reviewCount: after.rows[0].count }));
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally { client.release(); }
} catch (error) {
  console.error("Testimonial migration failed:", error.message);
  process.exitCode = 1;
} finally { await pool.end(); }
