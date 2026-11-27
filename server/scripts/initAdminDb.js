import pool from "../config/db.js";
import { getAdminEmails } from "../config/adminConfig.js";
import { DEFAULT_OFFERS_CONFIG } from "../services/offersService.js";

export async function ensureAdminSchema() {
  try {
    // 1. Ensure is_admin and OAuth columns on users
    await pool.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false,
      ADD COLUMN IF NOT EXISTS google_id VARCHAR(255),
      ADD COLUMN IF NOT EXISTS avatar_url TEXT,
      ADD COLUMN IF NOT EXISTS auth_provider VARCHAR(50) DEFAULT 'email';
    `);

    // Safely attempt to allow null passwords for OAuth users if constrained
    try {
      await pool.query(`ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;`);
    } catch {
      // Ignore if already nullable or permission restricted
    }

    // 2. Ensure courier_name and tracking_number on orders
    await pool.query(`
      ALTER TABLE orders 
      ADD COLUMN IF NOT EXISTS courier_name VARCHAR(100),
      ADD COLUMN IF NOT EXISTS tracking_number VARCHAR(100),
      ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50) DEFAULT 'Pending',
      ADD COLUMN IF NOT EXISTS checkout_key TEXT,
      ADD COLUMN IF NOT EXISTS payment_mode VARCHAR(10),
      ADD COLUMN IF NOT EXISTS payment_checked_at TIMESTAMPTZ,
      ADD COLUMN IF NOT EXISTS payment_check_after TIMESTAMPTZ,
      ADD COLUMN IF NOT EXISTS payment_check_error TEXT,
      ADD COLUMN IF NOT EXISTS refunded_amount NUMERIC(10,2) DEFAULT 0,
      ADD COLUMN IF NOT EXISTS payment_hold_until TIMESTAMPTZ,
      ADD COLUMN IF NOT EXISTS razorpay_order_id VARCHAR(100),
      ADD COLUMN IF NOT EXISTS razorpay_payment_id VARCHAR(100),
      ADD COLUMN IF NOT EXISTS confirmation_email_sent BOOLEAN DEFAULT false,
      ADD COLUMN IF NOT EXISTS confirmation_email_sent_at TIMESTAMP WITH TIME ZONE,
      ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;
    `);

    await pool.query(`ALTER TABLE order_items ADD COLUMN IF NOT EXISTS variant_id INTEGER;
      CREATE INDEX IF NOT EXISTS idx_order_items_holds ON order_items(variant_id) WHERE variant_id IS NOT NULL;
    `);

    // 3. Ensure stock on product_variants
    await pool.query(`
      ALTER TABLE product_variants 
      ADD COLUMN IF NOT EXISTS stock INTEGER DEFAULT 50,
      ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT true;
    `);

    // 4. Ensure fragrance_notes table exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS fragrance_notes (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        key VARCHAR(100) UNIQUE NOT NULL,
        image_url TEXT NOT NULL,
        source VARCHAR(50) DEFAULT 'auto',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_fragrance_notes_key ON fragrance_notes(key);
    `);

    // 4b. Ensure store_offers_config table exists & seed defaults once
    await pool.query(`
      CREATE TABLE IF NOT EXISTS store_offers_config (
        id INTEGER PRIMARY KEY DEFAULT 1,
        free_shipping_threshold INTEGER NOT NULL DEFAULT 499,
        standard_shipping_fee INTEGER NOT NULL DEFAULT 80,
        discount_active BOOLEAN NOT NULL DEFAULT true,
        discount_percent INTEGER NOT NULL DEFAULT 10,
        discount_min_subtotal INTEGER NOT NULL DEFAULT 999,
        banners JSONB NOT NULL DEFAULT '[]'::jsonb,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(
      `INSERT INTO store_offers_config
        (id, free_shipping_threshold, standard_shipping_fee, discount_active, discount_percent, discount_min_subtotal, banners)
       VALUES
        (1, $1, $2, $3, $4, $5, $6::jsonb)
       ON CONFLICT (id) DO NOTHING`,
      [
        DEFAULT_OFFERS_CONFIG.freeShippingThreshold,
        DEFAULT_OFFERS_CONFIG.standardShippingFee,
        DEFAULT_OFFERS_CONFIG.discountActive,
        DEFAULT_OFFERS_CONFIG.discountPercent,
        DEFAULT_OFFERS_CONFIG.discountMinSubtotal,
        JSON.stringify(DEFAULT_OFFERS_CONFIG.banners),
      ]
    );

    // 5. Auto-promote emails configured in .env (ADMIN_EMAILS / ADMIN_EMAIL)
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
    console.error("Unable to prepare database columns:", err.message);
    throw err;
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

