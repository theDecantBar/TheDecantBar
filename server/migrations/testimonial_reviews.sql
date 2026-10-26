-- Run before deploying the updated reviews API. Existing reviews are preserved.
BEGIN;
ALTER TABLE reviews
 ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ,
 ADD COLUMN IF NOT EXISTS deleted_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
 ADD COLUMN IF NOT EXISTS edited_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
 ADD COLUMN IF NOT EXISTS edited_by_admin BOOLEAN NOT NULL DEFAULT false;
-- Retained only for compatibility with parallel product-review work. Never displayed.
ALTER TABLE reviews ALTER COLUMN verified_buyer SET DEFAULT false;
CREATE INDEX IF NOT EXISTS idx_reviews_public ON reviews (created_at DESC, id DESC) WHERE deleted_at IS NULL;
COMMIT;
