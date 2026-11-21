import pool from "../config/db.js";
import fs from "fs";

async function exportCatalog() {
  try {
    const res = await pool.query(`
      SELECT 
        id, 
        name, 
        brand, 
        category, 
        type, 
        gender,
        top_notes, 
        middle_notes, 
        base_notes,
        accords,
        vibe
      FROM products 
      ORDER BY id ASC
    `);

    console.log(`Fetched ${res.rows.length} products from database.`);
    fs.writeFileSync("server/scripts/catalog_export.json", JSON.stringify(res.rows, null, 2));
    console.log("Saved to server/scripts/catalog_export.json");
  } catch (err) {
    console.error("Export error:", err);
  } finally {
    await pool.end();
  }
}

exportCatalog();
