/**
 * Migration: Add Fragrance Profile Columns to Products Table
 * Adds: top_notes, middle_notes, base_notes, accords, vibe, longevity, projection, when_to_wear
 * Run once: node server/migrations/add_fragrance_profile_columns.js
 */

import pool from "../config/db.js";
import dotenv from "dotenv";
dotenv.config();

async function migrate() {
  const client = await pool.connect();
  try {
    console.log("🔄 Running fragrance profile migration...");

    await client.query(`
      ALTER TABLE products
        ADD COLUMN IF NOT EXISTS top_notes     TEXT[]    DEFAULT '{}',
        ADD COLUMN IF NOT EXISTS middle_notes  TEXT[]    DEFAULT '{}',
        ADD COLUMN IF NOT EXISTS base_notes    TEXT[]    DEFAULT '{}',
        ADD COLUMN IF NOT EXISTS accords       JSONB     DEFAULT '[]',
        ADD COLUMN IF NOT EXISTS vibe          VARCHAR(255),
        ADD COLUMN IF NOT EXISTS longevity     VARCHAR(100),
        ADD COLUMN IF NOT EXISTS projection    VARCHAR(100),
        ADD COLUMN IF NOT EXISTS when_to_wear  JSONB     DEFAULT '{}'
    `);

    console.log("✅ Migration complete! New columns added to products table:");
    console.log("   - top_notes    (TEXT[])");
    console.log("   - middle_notes (TEXT[])");
    console.log("   - base_notes   (TEXT[])");
    console.log("   - accords      (JSONB)");
    console.log("   - vibe         (VARCHAR)");
    console.log("   - longevity    (VARCHAR)");
    console.log("   - projection   (VARCHAR)");
    console.log("   - when_to_wear (JSONB)");
  } catch (err) {
    console.error("❌ Migration failed:", err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();
