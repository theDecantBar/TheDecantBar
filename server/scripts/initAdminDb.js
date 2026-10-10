import pool from "../config/db.js";
import dotenv from "dotenv";

dotenv.config();

async function initAdminDb() {
  const client = await pool.connect();
  try {
    console.log("Checking and updating database schema for Admin capabilities...");
    await client.query("BEGIN");

    // Add is_admin column to users if it doesn't already exist
    await client.query(`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;
    `);

    // If ADMIN_EMAILS are defined in .env, mark those users as admins in DB
    const adminEmails = (process.env.ADMIN_EMAILS || "")
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);

    if (adminEmails.length > 0) {
      const result = await client.query(
        `UPDATE users
         SET is_admin = TRUE
         WHERE LOWER(email) = ANY($1::text[])
         RETURNING id, full_name, email, is_admin`,
        [adminEmails]
      );
      if (result.rows.length > 0) {
        console.log(`Updated ${result.rows.length} existing user(s) to admin:`, result.rows.map((r) => r.email));
      }
    }

    await client.query("COMMIT");
    console.log("Admin database configuration updated successfully!");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Admin DB initialization failed:", error.message);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

initAdminDb();
