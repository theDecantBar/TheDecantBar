import pool from "../config/db.js";

async function createFragranceNotesTable() {
  try {
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
    console.log("TABLE fragrance_notes CREATED / VERIFIED SUCCESSFULLY");
    process.exit(0);
  } catch (error) {
    console.error("DB ERROR creating fragrance_notes table:", error.message);
    process.exit(1);
  }
}

createFragranceNotesTable();
