/**
 * Fragrance Notes Rollback Script
 * Restores products table fragrance note columns from a specified backup table.
 * 
 * Usage:
 *   node server/scripts/rollback_fragrance_notes.js <backup_table_name>
 */

import pool from '../config/db.js';

async function runRollback() {
  const backupTable = process.argv[2];

  if (!backupTable) {
    console.error('Error: Please provide the backup table name to rollback from.');
    console.error('Example: node server/scripts/rollback_fragrance_notes.js products_fragrance_backup_20261115183000');
    process.exit(1);
  }

  // Sanitize backup table name to prevent SQL injection
  if (!/^products_fragrance_backup_\w+$/.test(backupTable)) {
    console.error('Invalid backup table name format.');
    process.exit(1);
  }

  const client = await pool.connect();

  try {
    console.log(`Starting rollback from table: ${backupTable}...`);
    await client.query('BEGIN');

    // Check if backup table exists
    const checkTable = await client.query(
      `SELECT to_regclass($1) as exists`,
      [backupTable]
    );

    if (!checkTable.rows[0].exists) {
      throw new Error(`Backup table "${backupTable}" does not exist in database.`);
    }

    const restoreQuery = `
      UPDATE products p
      SET 
        top_notes = b.top_notes,
        middle_notes = b.middle_notes,
        base_notes = b.base_notes,
        accords = b.accords,
        vibe = b.vibe,
        longevity = b.longevity,
        projection = b.projection,
        when_to_wear = b.when_to_wear
      FROM ${backupTable} b
      WHERE p.id = b.id;
    `;

    const res = await client.query(restoreQuery);
    console.log(`Successfully restored ${res.rowCount} products from ${backupTable}.`);

    await client.query('COMMIT');
    console.log('Rollback completed successfully.');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Rollback failed. Transaction rolled back.');
    console.error(err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

runRollback();
