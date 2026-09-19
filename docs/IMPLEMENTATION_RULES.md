# Pratima — Admin Implementation Rules

## General

The existing public website is already implemented and visually approved.

Do not redesign existing public pages while implementing the admin portal.

---

## Branch

Admin development occurs on:

```
feature/admin-portal
```

Do not make admin implementation changes directly on main.

---

## Existing Public Website

Do not unnecessarily modify:

- HomePage
- PoemsPage
- StoriesPage
- AboutPage
- Navbar
- Footer
- Reading pages
- existing design system

Only modify public components when required to replace placeholder/static content with Supabase data.

---

## Backend

Use Supabase.

Do not create a separate custom backend server unless explicitly approved.

---

## Database

Use Supabase PostgreSQL.

Database schema must follow DATABASE_SCHEMA.md.

Do not create additional tables without documenting and justifying them.

### Required Tables

```
poems
stories
categories
```

### Schema Requirements

- Use slug-based URLs (not UUIDs) for public content
- Each poem/story has ONE category (no many-to-many)
- Status field: `draft`, `published`, `archived`
- Featured content: `featured` boolean + `display_order` integer
- Manuscript images: `manuscript_url` field pointing to storage

---

## Authentication

Use Supabase Authentication.

### Requirements

- Email/password login only
- No public registration
- No social login providers
- No magic link authentication
- First admin created manually in Supabase dashboard

### Prohibited

- Do not create a custom authentication system
- Never expose service-role credentials in frontend code
- Do not create self-registration flows

---

## Content

Follow CONTENT_MODEL.md.

### Content Rules

- Preserve Hindi Devanagari content exactly
- Do not invent literary content
- Do not auto-correct or transliterate
- Preserve line breaks and formatting

### Content Status

| Status | Public Visible | Description |
|--------|----------------|-------------|
| `draft` | No | Work in progress |
| `published` | Yes | Live on website |
| `archived` | No | Hidden but preserved |

---

## Security

### Row Level Security (CRITICAL)

Use Supabase Row Level Security.

Frontend route protection alone is NOT sufficient.

```sql
-- Public can ONLY read published content
CREATE POLICY "Public read published"
  ON poems FOR SELECT TO anon
  USING (status = 'published');

-- Authenticated admins have full access
CREATE POLICY "Admin full access"
  ON poems FOR ALL TO authenticated
  USING (true) WITH CHECK (true);
```

### Public Access Rules

Public users can:
- Read published poems
- Read published stories
- Read categories
- View public media (covers, manuscripts)

Public users CANNOT:
- Read draft or archived content
- Create, update, or delete any content
- Access admin routes
- Upload files

### Admin Access Rules

Authenticated admins can:
- Manage all poems (all statuses)
- Manage all stories (all statuses)
- Manage categories
- Upload and manage media files
- Publish/archive content

### Credential Security

| Key | Allowed In Frontend | Notes |
|-----|---------------------|-------|
| `VITE_SUPABASE_URL` | Yes | Public URL |
| `VITE_SUPABASE_ANON_KEY` | Yes | Public key, RLS enforced |
| Service Role Key | **NO** | Dashboard/migrations only |

---

## Storage

### Buckets

| Bucket | Purpose | Public Read |
|--------|---------|-------------|
| `covers` | Story cover images | Yes |
| `manuscripts` | Handwritten page scans | Yes |

### File Naming

```
covers/{story_slug}.{ext}
manuscripts/poems/{poem_slug}.{ext}
manuscripts/stories/{story_slug}.{ext}
```

### Storage Security

- Public can read all bucket contents
- Only authenticated users can upload/delete
- RLS policies on storage.objects table

---

## URL Strategy

### Public URLs

Use slugs for human-readable URLs:

```
/poems/barish
/stories/ek-adhuri-kahani
```

Do NOT use UUIDs in public URLs.

### Admin URLs

Admin routes may use internal IDs:

```
/admin/poems/550e8400-e29b-41d4.../edit
```

---

## Pagination

Use "Load More" pattern:

```sql
SELECT * FROM poems
WHERE status = 'published'
ORDER BY published_at DESC
LIMIT 10 OFFSET 0;  -- increment offset for load more
```

Do NOT implement numbered pagination.

---

## Featured Content

Homepage featured content is manually curated:

- `featured = true` marks content for homepage
- `display_order` controls sort order
- Lower numbers appear first

---

## Deferred Features

Do NOT implement these in Stage 2:

| Feature | Status |
|---------|--------|
| Appreciation/सराहना | Deferred |
| Reader responses/अनुभूति | Deferred |
| Search functionality | Deferred (keep UI disabled) |
| Multi-user admin | Deferred |
| Content scheduling | Deferred |
| Analytics | Deferred |

---

## Validation

After implementation:

```bash
npm run lint
npm run build
```

Do not automatically run:

```bash
npm run dev
```

unless explicitly requested.

---

## Implementation Discipline

Before implementing a major feature:

1. Read the relevant documentation
2. Inspect the existing code
3. Explain the proposed approach
4. Wait for approval if approach is significant
5. Implement the smallest appropriate change
6. Validate the implementation
7. Report files changed and validation results

### Prohibited Actions

- Do not perform unrelated refactoring
- Do not modify public UI styling
- Do not add unnecessary dependencies
- Do not create tables not in DATABASE_SCHEMA.md
- Do not implement deferred features

---

## Documentation References

| Document | Purpose |
|----------|---------|
| ADMIN_ARCHITECTURE.md | Technical architecture |
| DATABASE_SCHEMA.md | Table definitions and RLS |
| CONTENT_MODEL.md | Data model and field definitions |
| AUTHENTICATION.md | Auth flow and security |
| ADMIN_WORKFLOW.md | Admin user workflows |
| DESIGN_SYSTEM.md | Visual design (public only) |
| COMPONENT_LIBRARY.md | Component guidelines |

Always read relevant documentation before implementing.