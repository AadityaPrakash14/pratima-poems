-- Migration: 20260826100100_create_categories_table
-- Purpose: Create categories table for organizing poems and stories
-- Categories can apply to poems, stories, or both.
-- Each poem/story has at most ONE category (no many-to-many).

-- ============================================
-- TABLE: categories
-- ============================================

CREATE TABLE categories (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL UNIQUE,
  slug          TEXT UNIQUE NOT NULL,
  description   TEXT,
  type          TEXT NOT NULL CHECK (type IN ('poem', 'story', 'both')),
  display_order INTEGER,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add comments
COMMENT ON TABLE categories IS 'Categories for organizing poems and stories by theme.';
COMMENT ON COLUMN categories.name IS 'Hindi category name in Devanagari, e.g., प्रकृति';
COMMENT ON COLUMN categories.slug IS 'URL-friendly identifier, e.g., prakriti';
COMMENT ON COLUMN categories.type IS 'Whether category applies to poem, story, or both';

-- ============================================
-- INDEXES: categories
-- ============================================

CREATE INDEX idx_categories_type ON categories(type);
CREATE INDEX idx_categories_slug ON categories(slug);

-- ============================================
-- RLS: categories
-- ============================================

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Public can read all categories (needed for filters/display)
CREATE POLICY "Public can view categories"
  ON categories FOR SELECT
  TO anon
  USING (true);

-- Authenticated users can also read categories
CREATE POLICY "Authenticated can view categories"
  ON categories FOR SELECT
  TO authenticated
  USING (true);

-- Only admins can insert categories
CREATE POLICY "Admin can insert categories"
  ON categories FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

-- Only admins can update categories
CREATE POLICY "Admin can update categories"
  ON categories FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Only admins can delete categories
CREATE POLICY "Admin can delete categories"
  ON categories FOR DELETE
  TO authenticated
  USING (is_admin());
