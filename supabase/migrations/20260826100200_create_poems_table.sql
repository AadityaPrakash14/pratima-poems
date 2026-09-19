-- Migration: 20260826100200_create_poems_table
-- Purpose: Create poems table for storing literary poems
-- Status: draft (default), published, archived
-- Public can only view published poems via RLS

-- ============================================
-- TABLE: poems
-- ============================================

CREATE TABLE poems (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title           TEXT NOT NULL,
  slug            TEXT UNIQUE NOT NULL,
  excerpt         TEXT,
  content         TEXT NOT NULL,
  subtitle        TEXT,
  category_id     UUID REFERENCES categories(id) ON DELETE SET NULL,
  written_date    DATE,
  reading_time    INTEGER,
  status          TEXT NOT NULL DEFAULT 'draft'
                  CHECK (status IN ('draft', 'published', 'archived')),
  featured        BOOLEAN NOT NULL DEFAULT false,
  display_order   INTEGER,
  manuscript_url  TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  published_at    TIMESTAMPTZ
);

-- Add comments
COMMENT ON TABLE poems IS 'Literary poems in the Pratima archive.';
COMMENT ON COLUMN poems.slug IS 'URL-friendly identifier for public URLs, e.g., barish';
COMMENT ON COLUMN poems.content IS 'Full poem text with line breaks preserved using \n';
COMMENT ON COLUMN poems.status IS 'Visibility status: draft, published, or archived';
COMMENT ON COLUMN poems.featured IS 'Whether to display on homepage featured section';
COMMENT ON COLUMN poems.display_order IS 'Sort order for featured content (lower = first)';
COMMENT ON COLUMN poems.manuscript_url IS 'Supabase Storage path to handwritten scan image';

-- ============================================
-- INDEXES: poems
-- ============================================

CREATE INDEX idx_poems_status ON poems(status);
CREATE INDEX idx_poems_slug ON poems(slug);
CREATE INDEX idx_poems_featured ON poems(featured) WHERE featured = true;
CREATE INDEX idx_poems_category ON poems(category_id);
CREATE INDEX idx_poems_published_at ON poems(published_at DESC) WHERE status = 'published';

-- ============================================
-- TRIGGER: updated_at
-- ============================================

CREATE TRIGGER poems_updated_at
  BEFORE UPDATE ON poems
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- ============================================
-- RLS: poems
-- ============================================

ALTER TABLE poems ENABLE ROW LEVEL SECURITY;

-- Public (anon) can only read published poems
CREATE POLICY "Public can view published poems"
  ON poems FOR SELECT
  TO anon
  USING (status = 'published');

-- Authenticated users can read all poems only if they are admin
CREATE POLICY "Admin can view all poems"
  ON poems FOR SELECT
  TO authenticated
  USING (
    -- Admin can see all poems
    is_admin()
    -- Non-admin authenticated users can only see published
    OR status = 'published'
  );

-- Only admins can insert poems
CREATE POLICY "Admin can insert poems"
  ON poems FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

-- Only admins can update poems
CREATE POLICY "Admin can update poems"
  ON poems FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Only admins can delete poems
CREATE POLICY "Admin can delete poems"
  ON poems FOR DELETE
  TO authenticated
  USING (is_admin());
