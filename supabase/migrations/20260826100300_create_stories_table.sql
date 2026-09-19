-- Migration: 20260826100300_create_stories_table
-- Purpose: Create stories table for storing literary stories
-- Status: draft (default), published, archived
-- Public can only view published stories via RLS

-- ============================================
-- TABLE: stories
-- ============================================

CREATE TABLE stories (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title           TEXT NOT NULL,
  slug            TEXT UNIQUE NOT NULL,
  excerpt         TEXT,
  content         TEXT NOT NULL,
  subtitle        TEXT,
  cover_url       TEXT,
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
COMMENT ON TABLE stories IS 'Literary stories in the Pratima archive.';
COMMENT ON COLUMN stories.slug IS 'URL-friendly identifier for public URLs, e.g., ek-adhuri-kahani';
COMMENT ON COLUMN stories.content IS 'Full story text with paragraphs separated by \n\n';
COMMENT ON COLUMN stories.cover_url IS 'Supabase Storage path to cover image';
COMMENT ON COLUMN stories.status IS 'Visibility status: draft, published, or archived';
COMMENT ON COLUMN stories.featured IS 'Whether to display on homepage featured section';
COMMENT ON COLUMN stories.display_order IS 'Sort order for featured content (lower = first)';
COMMENT ON COLUMN stories.manuscript_url IS 'Supabase Storage path to handwritten scan image';

-- ============================================
-- INDEXES: stories
-- ============================================

CREATE INDEX idx_stories_status ON stories(status);
CREATE INDEX idx_stories_slug ON stories(slug);
CREATE INDEX idx_stories_featured ON stories(featured) WHERE featured = true;
CREATE INDEX idx_stories_category ON stories(category_id);
CREATE INDEX idx_stories_published_at ON stories(published_at DESC) WHERE status = 'published';

-- ============================================
-- TRIGGER: updated_at
-- ============================================

CREATE TRIGGER stories_updated_at
  BEFORE UPDATE ON stories
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- ============================================
-- RLS: stories
-- ============================================

ALTER TABLE stories ENABLE ROW LEVEL SECURITY;

-- Public (anon) can only read published stories
CREATE POLICY "Public can view published stories"
  ON stories FOR SELECT
  TO anon
  USING (status = 'published');

-- Authenticated users can read all stories only if they are admin
CREATE POLICY "Admin can view all stories"
  ON stories FOR SELECT
  TO authenticated
  USING (
    -- Admin can see all stories
    is_admin()
    -- Non-admin authenticated users can only see published
    OR status = 'published'
  );

-- Only admins can insert stories
CREATE POLICY "Admin can insert stories"
  ON stories FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

-- Only admins can update stories
CREATE POLICY "Admin can update stories"
  ON stories FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Only admins can delete stories
CREATE POLICY "Admin can delete stories"
  ON stories FOR DELETE
  TO authenticated
  USING (is_admin());
