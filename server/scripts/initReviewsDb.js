import pool from "../config/db.js";

async function initReviewsDb() {
  const client = await pool.connect();
  try {
    console.log("Initializing database schema for Reviews...");
    await client.query("BEGIN");

    await client.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        author_name VARCHAR(255) NOT NULL,
        author_email VARCHAR(255),
        city VARCHAR(100),
        fragrance VARCHAR(255),
        order_number VARCHAR(100),
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        review_text TEXT NOT NULL,
        photo TEXT,
        verified_buyer BOOLEAN DEFAULT true,
        is_edited BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
    `);

    await client.query("COMMIT");
    console.log("Reviews database table created successfully!");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Failed to initialize reviews schema:", error.message);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

initReviewsDb();
