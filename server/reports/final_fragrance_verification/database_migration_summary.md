# Database Migration Summary — Fragrance Pyramids Audit
**The Decant Bar — PostgreSQL (Supabase)**

## 1. Safety Architecture & Non-Destructive Principles
- **Target Table**: `products` in PostgreSQL (`aws-0-ap-southeast-2.pooler.supabase.com`).
- **Target Columns**: `top_notes TEXT[]`, `middle_notes TEXT[]`, `base_notes TEXT[]`.
- **Untouched Columns**: `id`, `name`, `brand`, `description`, `image_url`, `category`, `gender`, `weather`, `type`, `full_bottle_price`, `accords`, `vibe`, `longevity`, `projection`, `when_to_wear`, `created_at`.
- **No Nonexistent Columns**: Zero references to `updated_at`.
- **No Data Pollution**: Verification metadata is not written into `when_to_wear` JSONB.

## 2. Pre-Migration Backup Snapshot
Before any write operation in apply mode:
```sql
CREATE TABLE products_fragrance_backup_YYYYMMDDHHMMSS AS 
SELECT id, name, top_notes, middle_notes, base_notes, accords, vibe, longevity, projection, when_to_wear 
FROM products;
```
- Row count of the snapshot is verified to match the live catalog (99 rows) before updates proceed.

## 3. Transaction Isolation & Scope
```sql
BEGIN;
-- Exactly 76 verified updates executed via parameterized queries:
UPDATE products 
SET 
  top_notes = $1::text[],
  middle_notes = $2::text[],
  base_notes = $3::text[]
WHERE id = $4;

-- Post-migration integrity check:
-- Verifies that all 23 excluded products retained their exact original notes:
SELECT COUNT(*) FROM products p JOIN backup b ON p.id = b.id 
WHERE p.id = ANY(excluded_ids) 
  AND (p.top_notes IS DISTINCT FROM b.top_notes OR p.middle_notes IS DISTINCT FROM b.middle_notes OR p.base_notes IS DISTINCT FROM b.base_notes);

COMMIT; -- Or ROLLBACK on any failure
```

## 4. Rollback Verification
Restoration query verified in an isolated SQL transaction:
```sql
UPDATE products p
SET 
  top_notes = b.top_notes,
  middle_notes = b.middle_notes,
  base_notes = b.base_notes
FROM products_fragrance_backup_YYYYMMDDHHMMSS b
WHERE p.id = b.id;
```
- Test result: 100% restoration of notes with 0 alterations to unrelated fields.

## 5. Execution Status
- **Current State**: Staged and verified in dry-run mode.
- **Production Writes**: **0 rows modified**. Awaiting explicit user approval before running `--apply`.
