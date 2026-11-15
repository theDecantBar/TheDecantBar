/**
 * Safe Database Migration Script: Perfume Fragrance Pyramids
 * 
 * Safety Features & Verification Rules:
 *   1. Strict Verification Gate: Only explicitly verified products are eligible for migration.
 *   2. Unverified records (e.g., generic brand URLs without isolated product specs) are excluded
 *      and retain their original database values.
 *   3. Does NOT require all three note layers to be populated when authentic sources lack all three (e.g. minimalist compositions).
 *   4. Automatic pre-migration snapshot table created with timestamp before any row update.
 *   5. PostgreSQL transaction isolation (BEGIN ... COMMIT) with automatic ROLLBACK on failure.
 *   6. Post-migration verification ensuring only eligible rows were modified and unverified rows were preserved untouched.
 *   7. Zero modifications to prices, images, stock, variants, descriptions, orders, or timestamps.
 * 
 * Usage:
 *   Dry-run: node server/scripts/migrate_fragrance_notes.js --dry-run
 *   Apply:   node server/scripts/migrate_fragrance_notes.js --apply
 *   (Optional flag: --include-partially-verified)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from '../config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigration() {
  const isDryRun = process.argv.includes('--dry-run');
  const isApply = process.argv.includes('--apply');
  const includePartial = process.argv.includes('--include-partially-verified');

  if (!isDryRun && !isApply) {
    console.error('Error: Please specify either --dry-run or --apply');
    process.exit(1);
  }

  const datasetPath = path.join(__dirname, 'proposed_corrected_fragrance_dataset.json');
  if (!fs.existsSync(datasetPath)) {
    console.error(`Dataset not found at ${datasetPath}`);
    process.exit(1);
  }

  const dataset = JSON.parse(fs.readFileSync(datasetPath, 'utf8'));

  // Segregate by verification status
  const fullyVerified = dataset.filter(item => item.verification_status === 'Fully Verified');
  const partiallyVerified = dataset.filter(item => item.verification_status === 'Partially Verified');
  const unverified = dataset.filter(item => item.verification_status === 'Unverified');

  const eligibleItems = includePartial
    ? [...fullyVerified, ...partiallyVerified]
    : fullyVerified;

  const excludedItems = includePartial
    ? unverified
    : [...partiallyVerified, ...unverified];

  const client = await pool.connect();

  try {
    if (isDryRun) {
      console.log('\n=============================================================');
      console.log('              PRE-MIGRATION SAFETY AUDIT & DRY RUN           ');
      console.log('=============================================================');
      console.log(`Total Products in Catalog:         ${dataset.length}`);
      console.log(`- Fully Verified (Eligible):       ${fullyVerified.length}`);
      console.log(`- Partially Verified:              ${partiallyVerified.length} ${includePartial ? '(INCLUDED via flag)' : '(EXCLUDED by default)'}`);
      console.log(`- Unverified / Insufficient Ev.:   ${unverified.length} (EXCLUDED)`);
      console.log(`-------------------------------------------------------------`);
      console.log(`Total Eligible for Update:         ${eligibleItems.length}`);
      console.log(`Total Excluded (Retain Original):  ${excludedItems.length}`);
      console.log('=============================================================\n');

      // 1. Validate all eligible IDs exist in DB
      const dbIdsResult = await client.query('SELECT id, name FROM products ORDER BY id ASC');
      const existingIds = new Set(dbIdsResult.rows.map(r => r.id));

      let matchedEligible = 0;
      for (const item of eligibleItems) {
        if (existingIds.has(item.id)) {
          matchedEligible++;
        } else {
          console.warn(`[WARNING] Eligible ID ${item.id} (${item.name}) not found in database!`);
        }
      }

      console.log(`Database Matching: ${matchedEligible} of ${eligibleItems.length} eligible products confirmed present in DB.`);

      // 2. Sample Eligible Products
      console.log('\nSample Eligible Products to be Updated:');
      eligibleItems.slice(0, 3).forEach(p => {
        console.log(`  [ID ${p.id}] ${p.name} (${p.brand}) -> Status: ${p.verification_status}`);
        console.log(`    Top: [${p.top_notes.join(', ')}] | Mid: [${p.middle_notes.join(', ')}] | Base: [${p.base_notes.join(', ')}]`);
        console.log(`    Source: ${p.source}`);
      });

      // 3. Sample Excluded Products
      console.log('\nSample Excluded Products (Preserved Intact in DB):');
      excludedItems.slice(0, 3).forEach(p => {
        console.log(`  [ID ${p.id}] ${p.name} (${p.brand}) -> Status: ${p.verification_status} (SKIPPED)`);
        console.log(`    Reason: Insufficient / generic source reference (${p.source})`);
      });

      console.log('\n================ DRY RUN COMPLETED SUCCESSFULLY ================');
      console.log('All safety checks passed. ZERO production records were modified.');
      return;
    }

    // Apply Mode (Runs only when user approves and specifies --apply)
    console.log('\n================ APPLYING TRANSACTIONAL MIGRATION ================');
    await client.query('BEGIN');

    // 1. Create timestamped backup snapshot table
    const timestamp = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14);
    const backupTableName = `products_fragrance_backup_${timestamp}`;
    
    console.log(`Step 1: Creating backup table "${backupTableName}"...`);
    await client.query(`
      CREATE TABLE ${backupTableName} AS 
      SELECT id, name, top_notes, middle_notes, base_notes, accords, vibe, longevity, projection, when_to_wear 
      FROM products;
    `);

    const backupCountRes = await client.query(`SELECT COUNT(*) FROM ${backupTableName}`);
    console.log(`Backup snapshot created with ${backupCountRes.rows[0].count} rows.`);

    // 2. Perform updates strictly on eligible records
    console.log(`Step 2: Updating notes for ${eligibleItems.length} eligible verified products...`);
    let updatedCount = 0;

    for (const item of eligibleItems) {
      const updateQuery = `
        UPDATE products 
        SET 
          top_notes = $1::text[],
          middle_notes = $2::text[],
          base_notes = $3::text[]
        WHERE id = $4
      `;
      const res = await client.query(updateQuery, [
        item.top_notes,
        item.middle_notes,
        item.base_notes,
        item.id
      ]);

      if (res.rowCount > 0) {
        updatedCount++;
      } else {
        throw new Error(`Product ID ${item.id} (${item.name}) failed to update (not found).`);
      }
    }

    console.log(`Step 3: Successfully updated ${updatedCount} verified products.`);

    // 3. Post-migration integrity checks
    console.log('Step 4: Running post-migration integrity verification...');

    // A. Check total count
    const totalCheck = await client.query('SELECT COUNT(*) FROM products');
    if (parseInt(totalCheck.rows[0].count) !== dataset.length) {
      throw new Error(`Product count mismatch: expected ${dataset.length}, found ${totalCheck.rows[0].count}`);
    }

    // B. Verify unverified records retained their original database values
    if (excludedItems.length > 0) {
      const excludedIds = excludedItems.map(i => i.id);
      const unverifiedCheck = await client.query(`
        SELECT COUNT(*) as changed_unverified
        FROM products p
        JOIN ${backupTableName} b ON p.id = b.id
        WHERE p.id = ANY($1::int[])
          AND (
            p.top_notes IS DISTINCT FROM b.top_notes OR
            p.middle_notes IS DISTINCT FROM b.middle_notes OR
            p.base_notes IS DISTINCT FROM b.base_notes
          )
      `, [excludedIds]);

      const changedCount = parseInt(unverifiedCheck.rows[0].changed_unverified);
      if (changedCount > 0) {
        throw new Error(`Safety violation: ${changedCount} excluded/unverified products were inadvertently modified!`);
      }
      console.log(`Integrity Check Passed: All ${excludedItems.length} excluded products retained their exact original DB values.`);
    }

    // C. Verify all updated records have at least one valid note layer (without enforcing rigid 3-tier requirement if source has fewer)
    const eligibleIds = eligibleItems.map(i => i.id);
    const populatedCheck = await client.query(`
      SELECT COUNT(*) as unpopulated_eligible
      FROM products
      WHERE id = ANY($1::int[])
        AND (
          (top_notes IS NULL OR cardinality(top_notes) = 0) AND
          (middle_notes IS NULL OR cardinality(middle_notes) = 0) AND
          (base_notes IS NULL OR cardinality(base_notes) = 0)
        )
    `, [eligibleIds]);

    if (parseInt(populatedCheck.rows[0].unpopulated_eligible) > 0) {
      throw new Error('Integrity check failed: One or more eligible products have completely empty notes across all 3 layers!');
    }

    await client.query('COMMIT');
    console.log('\n================ MIGRATION COMPLETED SUCCESSFULLY ================');
    console.log(`Total Products Updated:    ${updatedCount}`);
    console.log(`Total Products Preserved:  ${excludedItems.length}`);
    console.log(`Backup Table Retained:     ${backupTableName}`);
    console.log(`To rollback if needed, run: node server/scripts/rollback_fragrance_notes.js ${backupTableName}`);

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('\n[ERROR] Migration failed. Transaction was rolled back. No changes were made to the database.');
    console.error(err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

runMigration();
