import fs from 'fs';
import pool from '../config/db.js';

async function exportLiveCatalog() {
  try {
    const res = await pool.query(`
      SELECT 
        id, 
        name, 
        brand, 
        category, 
        type, 
        gender,
        weather,
        full_bottle_price,
        top_notes, 
        middle_notes, 
        base_notes,
        accords,
        vibe,
        longevity,
        projection,
        when_to_wear,
        created_at
      FROM products 
      ORDER BY id ASC;
    `);

    console.log(`Successfully fetched ${res.rows.length} products from live PostgreSQL database.`);
    
    fs.writeFileSync(
      'server/scripts/final_live_catalog.json', 
      JSON.stringify(res.rows, null, 2)
    );
    console.log('Saved authoritative export to server/scripts/final_live_catalog.json');

    // Also print out the exact ID and Name of all rows to analyze any discrepancy
    res.rows.forEach(r => {
      console.log(`[ID ${r.id}] Brand: "${r.brand}" | Name: "${r.name}" | Type: "${r.type}"`);
    });

  } catch (err) {
    console.error('Error fetching live catalog:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

exportLiveCatalog();
