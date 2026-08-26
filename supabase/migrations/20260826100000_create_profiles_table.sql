-- Migration: 20260826100000_create_profiles_table
-- Purpose: Create profiles table for admin authorization
-- The profiles table links auth.users to application roles.
-- For v1, the only permitted role is 'admin'.

-- ============================================
-- TABLE: profiles
-- ============================================

CREATE TABLE profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name  TEXT,
  role          TEXT NOT NULL DEFAULT 'admin'
                CHECK (role IN ('admin')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add comment explaining the table purpose
COMMENT ON TABLE profiles IS 'User profiles with role-based authorization. Links to auth.users.';
COMMENT ON COLUMN profiles.role IS 'User role. For v1, only "admin" is permitted.';

-- ============================================
-- RLS: profiles
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Admins can view their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Users can update their own profile row
-- Protected columns (id, role, created_at) are enforced by trigger below
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Only service role can insert/delete profiles (done via Supabase dashboard or backend)
-- No INSERT/DELETE policies for authenticated users

-- ============================================
-- TRIGGER: protect_profiles_immutable_columns
-- Prevents users from modifying id, role, or created_at
-- ============================================

CREATE OR REPLACE FUNCTION protect_profiles_immutable_columns()
RETURNS TRIGGER AS $$
BEGIN
  -- Prevent modification of immutable columns
  IF NEW.id IS DISTINCT FROM OLD.id THEN
    RAISE EXCEPTION 'Cannot modify id column';
  END IF;
  
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    RAISE EXCEPTION 'Cannot modify role column';
  END IF;
  
  IF NEW.created_at IS DISTINCT FROM OLD.created_at THEN
    RAISE EXCEPTION 'Cannot modify created_at column';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_protect_immutable
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION protect_profiles_immutable_columns();

-- ============================================
-- FUNCTION: is_admin()
-- Helper function to check if current user is an admin
-- Used in RLS policies for content tables
-- ============================================

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE public.profiles.id = auth.uid()
    AND public.profiles.role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

COMMENT ON FUNCTION is_admin() IS 'Returns true if the current authenticated user has admin role in profiles table.';

-- ============================================
-- FUNCTION: handle_updated_at()
-- Trigger function to auto-update updated_at column
-- ============================================

CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to profiles
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();
