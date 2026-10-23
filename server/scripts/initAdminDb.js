import pool from "../config/db.js";
import { getAdminEmails } from "../config/adminConfig.js";

export async function ensureAdminSchema() {
  try {
    // 1. Ensure is_admin on users
    await pool.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;
    `);

    // 2. Ensure courier_name and tracking_number on orders
    await pool.query(`
      ALTER TABLE orders 
      ADD COLUMN IF NOT EXISTS courier_name VARCHAR(100),
      ADD COLUMN IF NOT EXISTS tracking_number VARCHAR(100),
      ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;
    `);

    // 3. Ensure stock on product_variants
    await pool.query(`
      ALTER TABLE product_variants 
      ADD COLUMN IF NOT EXISTS stock INTEGER DEFAULT 50,
      ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT true;
    `);

    // 4. Auto-promote emails configured in .env (ADMIN_EMAILS / ADMIN_EMAIL)
    const adminEmails = getAdminEmails();

    if (adminEmails.length > 0) {
      const updateRes = await pool.query(
        `UPDATE users SET is_admin = true WHERE LOWER(email) = ANY($1::text[]) RETURNING email`,
        [adminEmails]
      );
      if (updateRes.rows.length > 0) {
        console.log(`Auto-promoted ${updateRes.rows.length} administrator(s) from .env:`, updateRes.rows.map(r => r.email).join(", "));
      }
    }

    console.log("Admin schema columns verified successfully.");
  } catch (err) {
    console.error("Warning ensuring admin schema columns:", err.message);
  }
}

export async function promoteToAdmin(email) {
  try {
    await ensureAdminSchema();
    const result = await pool.query(
      "UPDATE users SET is_admin = true WHERE LOWER(email) = LOWER($1) RETURNING id, full_name, email, is_admin",
      [email.trim()]
    );
    if (result.rows.length === 0) {
      console.log(`No user found with email: ${email}`);
      return null;
    }
    console.log(`User ${result.rows[0].email} (${result.rows[0].full_name}) is now an Administrator.`);
    return result.rows[0];
  } catch (err) {
    console.error("Failed to promote user to admin:", err.message);
  }
}

// If run directly
if (process.argv[1] && process.argv[1].endsWith("initAdminDb.js")) {
  const targetEmail = process.argv[2];
  if (targetEmail) {
    promoteToAdmin(targetEmail).then(() => pool.end());
  } else {
    ensureAdminSchema().then(() => pool.end());
  }
}

