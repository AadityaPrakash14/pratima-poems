-- Migration: 20260826100400_create_storage_buckets
-- Purpose: Create Supabase Storage buckets for media files
-- Buckets: covers (story cover images), manuscripts (handwritten scans)
-- Both buckets are public read, admin write

-- ============================================
-- STORAGE BUCKETS
-- ============================================

-- Create 'covers' bucket for story cover images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'covers',
  'covers',
  true,
  5242880,  -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp']
);

-- Create 'manuscripts' bucket for handwritten page scans
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'manuscripts',
  'manuscripts',
  true,
  10485760,  -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
);

-- ============================================
-- STORAGE POLICIES: covers
-- ============================================

-- Public can read from covers bucket
CREATE POLICY "Public can view covers"
  ON storage.objects FOR SELECT
  TO anon
  USING (bucket_id = 'covers');

-- Authenticated users can also read covers
CREATE POLICY "Authenticated can view covers"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'covers');

-- Only admins can upload to covers
CREATE POLICY "Admin can upload covers"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'covers' AND is_admin());

-- Only admins can update covers
CREATE POLICY "Admin can update covers"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'covers' AND is_admin())
  WITH CHECK (bucket_id = 'covers' AND is_admin());

-- Only admins can delete covers
CREATE POLICY "Admin can delete covers"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'covers' AND is_admin());

-- ============================================
-- STORAGE POLICIES: manuscripts
-- ============================================

-- Public can read from manuscripts bucket
CREATE POLICY "Public can view manuscripts"
  ON storage.objects FOR SELECT
  TO anon
  USING (bucket_id = 'manuscripts');

-- Authenticated users can also read manuscripts
CREATE POLICY "Authenticated can view manuscripts"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'manuscripts');

-- Only admins can upload to manuscripts
CREATE POLICY "Admin can upload manuscripts"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'manuscripts' AND is_admin());

-- Only admins can update manuscripts
CREATE POLICY "Admin can update manuscripts"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'manuscripts' AND is_admin())
  WITH CHECK (bucket_id = 'manuscripts' AND is_admin());

-- Only admins can delete manuscripts
CREATE POLICY "Admin can delete manuscripts"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'manuscripts' AND is_admin());
