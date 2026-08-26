# Pratima — Database Schema

## Purpose

This document defines the PostgreSQL data model for the Pratima literary archive.

The database is hosted on Supabase PostgreSQL.

The database should remain intentionally simple.

---

## Design Decisions

### URL Strategy
- Use slug-based URLs for public content
- Examples: `/poems/barish`, `/stories/ek-adhuri-kahani`
- UUIDs are internal identifiers only

### Categories
- Each poem/story has ONE category (single foreign key)
- No many-to-many junction tables

### Content Status
Three states:
- `draft` — not visible publicly, work in progress
- `published` — visible on public website
- `archived` — hidden from public, preserved for admin

### Featured Content
- Manual curation via `featured` boolean and `display_order` integer
- Homepage retrieves featured content by this ordering

### Authorization Model
- The `profiles` table links `auth.users` to application roles
- For v1, only `admin` role is permitted
- The `is_admin()` helper function is used in ALL RLS policies to verify admin status
- Do NOT use `auth.role() = 'authenticated'` as admin verification

### Deferred Features
The following are NOT included in this schema:
- Appreciation/सराहना counters
- Reader responses/अनुभूति
- Search indexes (future)

---

## Core Tables

```text
profiles    -- User authorization (links auth.users to roles)
categories  -- Content organization
poems       -- Literary poems
stories     -- Literary stories
```

---

## Table: profiles

The profiles table links Supabase `auth.users` to application roles and enables proper admin authorization.

```sql
CREATE TABLE profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name  TEXT,
  role          TEXT NOT NULL DEFAULT 'admin'
                CHECK (role IN ('admin')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### Field Notes

| Field | Description |
|-------|-------------|
| `id` | Links to `auth.users(id)` — the Supabase auth user |
| `display_name` | Optional admin display name |
| `role` | Application role. For v1, only `'admin'` is permitted |
| `created_at` | When the profile was created |
| `updated_at` | Auto-updated on modification |

### Constraints

- `PRIMARY KEY (id)` — one profile per auth user
- `REFERENCES auth.users(id) ON DELETE CASCADE` — profile deleted when auth user deleted
- `CHECK (role IN ('admin'))` — only admin role permitted in v1

### Admin Creation Process

The first admin is created manually:

1. Create user in Supabase Dashboard → Authentication → Users
2. Insert profile row:

```sql
INSERT INTO profiles (id, display_name, role)
VALUES ('user-uuid-from-auth', 'Pratima Admin', 'admin');
```

---

## Helper Function: is_admin()

This function is used in ALL content table RLS policies to verify admin authorization.

```sql
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

**Why SECURITY DEFINER?**
- Allows the function to read `profiles` even when called from RLS context
- The function checks `auth.uid()` to get the current user's ID
- Only returns `true` if that user has a profile with `role = 'admin'`

**Usage in RLS policies:**
```sql
-- Only admins can insert
WITH CHECK (is_admin());

-- Only admins can update/delete
USING (is_admin());
```

---

## Helper Function: handle_updated_at()

Auto-updates the `updated_at` column on row modifications.

```sql
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

Applied to all tables with `updated_at` column via triggers.

---

## Table: categories

```sql
CREATE TABLE categories (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL UNIQUE,
  slug            TEXT UNIQUE NOT NULL,
  description     TEXT,
  type            TEXT NOT NULL CHECK (type IN ('poem', 'story', 'both')),
  display_order   INTEGER,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_categories_type ON categories(type);
CREATE INDEX idx_categories_slug ON categories(slug);
```

### Field Notes

| Field | Description |
|-------|-------------|
| `name` | Hindi category name, e.g., `प्रकृति`, `प्रेम` |
| `slug` | URL-friendly identifier, e.g., `prakriti` |
| `type` | Whether category applies to `poem`, `story`, or `both` |

---

## Table: poems

```sql
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

CREATE INDEX idx_poems_status ON poems(status);
CREATE INDEX idx_poems_slug ON poems(slug);
CREATE INDEX idx_poems_featured ON poems(featured) WHERE featured = true;
CREATE INDEX idx_poems_category ON poems(category_id);
CREATE INDEX idx_poems_published_at ON poems(published_at DESC) WHERE status = 'published';
```

### Field Notes

| Field | Description |
|-------|-------------|
| `slug` | URL-friendly identifier, e.g., `barish` |
| `content` | Full poem text with line breaks (`\n`) preserved |
| `written_date` | Original composition date (may differ from published_at) |
| `reading_time` | Estimated minutes to read |
| `status` | `draft`, `published`, or `archived` |
| `featured` | Manual flag for homepage display |
| `display_order` | Manual sort order for featured content |
| `manuscript_url` | Supabase Storage path to handwritten scan |

---

## Table: stories

```sql
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

CREATE INDEX idx_stories_status ON stories(status);
CREATE INDEX idx_stories_slug ON stories(slug);
CREATE INDEX idx_stories_featured ON stories(featured) WHERE featured = true;
CREATE INDEX idx_stories_category ON stories(category_id);
CREATE INDEX idx_stories_published_at ON stories(published_at DESC) WHERE status = 'published';
```

### Field Notes

| Field | Description |
|-------|-------------|
| `slug` | URL-friendly identifier, e.g., `ek-adhuri-kahani` |
| `content` | Full story text, paragraphs separated by `\n\n` |
| `cover_url` | Supabase Storage path to cover image |
| `manuscript_url` | Supabase Storage path to handwritten scan |

---

## Row Level Security (RLS)

RLS is REQUIRED. Frontend route protection alone is NOT sufficient.

**Authorization Strategy:**
- All write operations require `is_admin()` check
- Public users (`anon`) can only read `published` content
- Authenticated non-admins are treated same as public for content access

### RLS: profiles

```sql
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Users can update their own profile (display_name only)
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- No INSERT/DELETE policies for authenticated users
-- Profile creation/deletion done via service role (Supabase dashboard)
```

### RLS: categories

```sql
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Public can read all categories
CREATE POLICY "Public can view categories"
  ON categories FOR SELECT
  TO anon
  USING (true);

-- Authenticated can read all categories
CREATE POLICY "Authenticated can view categories"
  ON categories FOR SELECT
  TO authenticated
  USING (true);

-- Only admins can manage categories
CREATE POLICY "Admin can insert categories"
  ON categories FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Admin can update categories"
  ON categories FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admin can delete categories"
  ON categories FOR DELETE
  TO authenticated
  USING (is_admin());
```

### RLS: poems

```sql
ALTER TABLE poems ENABLE ROW LEVEL SECURITY;

-- Public can only read published poems
CREATE POLICY "Public can view published poems"
  ON poems FOR SELECT
  TO anon
  USING (status = 'published');

-- Admin can view all, others only published
CREATE POLICY "Admin can view all poems"
  ON poems FOR SELECT
  TO authenticated
  USING (is_admin() OR status = 'published');

-- Only admins can manage poems
CREATE POLICY "Admin can insert poems"
  ON poems FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Admin can update poems"
  ON poems FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admin can delete poems"
  ON poems FOR DELETE
  TO authenticated
  USING (is_admin());
```

### RLS: stories

```sql
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;

-- Public can only read published stories
CREATE POLICY "Public can view published stories"
  ON stories FOR SELECT
  TO anon
  USING (status = 'published');

-- Admin can view all, others only published
CREATE POLICY "Admin can view all stories"
  ON stories FOR SELECT
  TO authenticated
  USING (is_admin() OR status = 'published');

-- Only admins can manage stories
CREATE POLICY "Admin can insert stories"
  ON stories FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Admin can update stories"
  ON stories FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admin can delete stories"
  ON stories FOR DELETE
  TO authenticated
  USING (is_admin());
```

---

## Storage Buckets

Supabase Storage buckets for media files:

| Bucket | Purpose | Public Access | Size Limit | Allowed Types |
|--------|---------|---------------|------------|---------------|
| `covers` | Story cover images | Yes (public read) | 5MB | JPEG, PNG, WebP |
| `manuscripts` | Handwritten page scans | Yes (public read) | 10MB | JPEG, PNG, WebP, PDF |

### Storage Bucket Configuration

```sql
-- Create 'covers' bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'covers',
  'covers',
  true,
  5242880,  -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/webp']
);

-- Create 'manuscripts' bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'manuscripts',
  'manuscripts',
  true,
  10485760,  -- 10MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
);
```

### Storage Policies

```sql
-- PUBLIC READ: covers
CREATE POLICY "Public can view covers"
  ON storage.objects FOR SELECT
  TO anon
  USING (bucket_id = 'covers');

CREATE POLICY "Authenticated can view covers"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'covers');

-- ADMIN WRITE: covers
CREATE POLICY "Admin can upload covers"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'covers' AND is_admin());

CREATE POLICY "Admin can update covers"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'covers' AND is_admin())
  WITH CHECK (bucket_id = 'covers' AND is_admin());

CREATE POLICY "Admin can delete covers"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'covers' AND is_admin());

-- PUBLIC READ: manuscripts
CREATE POLICY "Public can view manuscripts"
  ON storage.objects FOR SELECT
  TO anon
  USING (bucket_id = 'manuscripts');

CREATE POLICY "Authenticated can view manuscripts"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'manuscripts');

-- ADMIN WRITE: manuscripts
CREATE POLICY "Admin can upload manuscripts"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'manuscripts' AND is_admin());

CREATE POLICY "Admin can update manuscripts"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'manuscripts' AND is_admin())
  WITH CHECK (bucket_id = 'manuscripts' AND is_admin());

CREATE POLICY "Admin can delete manuscripts"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'manuscripts' AND is_admin());
```

### File Naming Convention

```text
covers/{story_slug}.{ext}
manuscripts/poems/{poem_slug}.{ext}
manuscripts/stories/{story_slug}.{ext}
```

---

## Migration Files

The schema is implemented via ordered SQL migrations in Supabase CLI format:

| Order | File | Purpose |
|-------|------|---------|
| 1 | `20260826100000_create_profiles_table.sql` | profiles table, is_admin(), handle_updated_at() |
| 2 | `20260826100100_create_categories_table.sql` | categories table with RLS |
| 3 | `20260826100200_create_poems_table.sql` | poems table with RLS |
| 4 | `20260826100300_create_stories_table.sql` | stories table with RLS |
| 5 | `20260826100400_create_storage_buckets.sql` | Storage buckets and policies |

---

## Query Patterns

### Public: Featured poems for homepage

```sql
SELECT id, title, slug, excerpt, reading_time, category_id
FROM poems
WHERE status = 'published' AND featured = true
ORDER BY display_order ASC NULLS LAST, published_at DESC
LIMIT 3;
```

### Public: Poems listing with "Load More"

```sql
SELECT id, title, slug, excerpt, reading_time, category_id
FROM poems
WHERE status = 'published'
ORDER BY published_at DESC
LIMIT 10 OFFSET 0;  -- increment OFFSET for load more
```

### Public: Single poem by slug

```sql
SELECT *
FROM poems
WHERE slug = $1 AND status = 'published';
```

### Admin: All poems including drafts and archived

```sql
-- RLS automatically filters based on is_admin()
SELECT *
FROM poems
ORDER BY updated_at DESC;
```

### Admin: Create new poem

```sql
INSERT INTO poems (title, slug, content, status)
VALUES ($1, $2, $3, 'draft')
RETURNING *;
```

### Admin: Publish poem

```sql
UPDATE poems
SET status = 'published', published_at = now()
WHERE id = $1;
```
