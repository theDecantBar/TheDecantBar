import pool from "../config/db.js";

async function createTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS email_otps (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        otp_code VARCHAR(10) NOT NULL,
        purpose VARCHAR(50) NOT NULL,
        attempts INT DEFAULT 0,
        expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_email_otps_lookup ON email_otps(email, purpose);
    `);
    console.log("TABLE email_otps CREATED SUCCESSFULLY");
    process.exit(0);
  } catch (error) {
    console.error("DB ERROR:", error.message);
    process.exit(1);
  }
}

createTable();
