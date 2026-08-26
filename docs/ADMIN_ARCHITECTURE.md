# Pratima — Admin Architecture

## Purpose

This document defines the technical architecture for the Pratima literary website's admin/content-management system.

Pratima is a Hindi literary archive containing the poems and stories written by Pratima.

The public website and admin portal will exist within the same React application and GitHub repository.

The admin system will allow authorized administrators to create, edit, manage, and publish poems and stories without modifying the React source code manually.

---

## Core Architecture

The application consists of two logical areas:

1. Public Website
2. Admin Portal

Both are part of the same React/Vite application.

```text
                    Pratima React Application
                              |
                +-------------+-------------+
                |                           |
         Public Website                Admin Portal
                |                           |
        /                              /admin/login
        /poems                         /admin/dashboard
        /poems/:slug                   /admin/poems
        /stories                       /admin/poems/new
        /stories/:slug                 /admin/poems/:id/edit
        /about                         /admin/stories
                                       /admin/stories/new
                                       /admin/stories/:id/edit
                                       /admin/categories
                |                           |
                +-------------+-------------+
                              |
                           Supabase
                              |
              +---------------+---------------+
              |               |               |
             Auth         PostgreSQL        Storage
```

---

## URL Strategy

### Public URLs

Use slug-based URLs for human-readable, SEO-friendly paths:

```text
/poems/barish
/poems/yaadein
/stories/ek-adhuri-kahani
/stories/woh-shaam
```

Do NOT expose UUIDs in public URLs.

### Admin URLs

Admin routes use internal IDs (UUIDs) for unambiguous identification:

```text
/admin/poems/550e8400-e29b-41d4-a716-446655440000/edit
```

---

## Routing Structure

### Public Routes (MainLayout)

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | HomePage | Landing page with featured content |
| `/poems` | PoemsPage | Poems listing |
| `/poems/:slug` | PoemDetailPage | Single poem reading |
| `/stories` | StoriesPage | Stories listing |
| `/stories/:slug` | StoryDetailPage | Single story reading |
| `/about` | AboutPage | Author information |
| `*` | NotFoundPage | 404 page |

### Admin Routes (AdminLayout)

| Route | Component | Description |
|-------|-----------|-------------|
| `/admin/login` | LoginPage | Authentication |
| `/admin/dashboard` | DashboardPage | Overview |
| `/admin/poems` | PoemsListPage | All poems management |
| `/admin/poems/new` | PoemEditorPage | Create poem |
| `/admin/poems/:id/edit` | PoemEditorPage | Edit poem |
| `/admin/stories` | StoriesListPage | All stories management |
| `/admin/stories/new` | StoryEditorPage | Create story |
| `/admin/stories/:id/edit` | StoryEditorPage | Edit story |
| `/admin/categories` | CategoriesPage | Category management |

---

## Data Flow

### Public Website Data Flow

```text
Public Page
    │
    ▼
Service Layer (e.g., poemService.js)
    │
    ▼
Supabase Client (anon key)
    │
    ▼
Supabase PostgreSQL (RLS enforced)
    │
    └── Only status='published' rows returned
```

### Admin Portal Data Flow

```text
Admin Page
    │
    ▼
Auth Context (check session)
    │
    ▼
Service Layer
    │
    ▼
Supabase Client (authenticated session)
    │
    ▼
Supabase PostgreSQL (RLS enforced)
    │
    └── All rows accessible for authenticated users
```

---

## Component Architecture

### Shared Components

Used by both public and admin:

```text
src/components/
├── common/          (buttons, headers, dividers)
├── content/         (PoemCard, StoryCard - display only)
└── navigation/      (public Navbar, Footer)
```

### Admin-Specific Components

```text
src/components/admin/
├── AdminNavbar.jsx
├── AdminSidebar.jsx
├── ContentEditor.jsx
├── StatusBadge.jsx
├── ImageUploader.jsx
├── CategorySelect.jsx
└── ConfirmDialog.jsx
```

### Layouts

```text
src/layouts/
├── MainLayout.jsx    (public: Navbar + content + Footer)
└── AdminLayout.jsx   (admin: AdminNavbar + Sidebar + content)
```

---

## State Management

### Authentication State

```text
src/context/AuthContext.jsx

Provides:
- user (current user object or null)
- session (current session or null)
- loading (auth check in progress)
- signIn(email, password)
- signOut()
```

### Content State

Content is fetched per-page, not globally cached.

Each page fetches its own data via service functions.

React Query or SWR may be added later for caching if needed.

---

## Service Layer

```text
src/services/
├── authService.js      (login, logout, session check)
├── poemService.js      (CRUD for poems)
├── storyService.js     (CRUD for stories)
├── categoryService.js  (CRUD for categories)
└── storageService.js   (file upload/delete)
```

### Service Pattern

```javascript
// Example: poemService.js
import { supabase } from '../lib/supabase';

export async function getPublishedPoems(limit = 10, offset = 0) {
  const { data, error } = await supabase
    .from('poems')
    .select('id, title, slug, excerpt, reading_time, category_id')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .range(offset, offset + limit - 1);
  
  if (error) throw error;
  return data;
}

export async function getPoemBySlug(slug) {
  const { data, error } = await supabase
    .from('poems')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();
  
  if (error) throw error;
  return data;
}
```

---

## Security Architecture

### Layer 1: Frontend Route Protection

```text
/admin/* routes check AuthContext
- If no session → redirect to /admin/login
- If session → render admin component
```

### Layer 2: Supabase Row Level Security (CRITICAL)

Frontend protection can be bypassed. RLS cannot.

```sql
-- Poems: public can only read published
CREATE POLICY "Public read published poems"
  ON poems FOR SELECT TO anon
  USING (status = 'published');

-- Poems: authenticated has full access
CREATE POLICY "Admin full access poems"
  ON poems FOR ALL TO authenticated
  USING (true) WITH CHECK (true);
```

### Layer 3: Storage Security

```sql
-- Public can read media files
CREATE POLICY "Public read covers"
  ON storage.objects FOR SELECT TO anon
  USING (bucket_id = 'covers');

-- Only authenticated can upload
CREATE POLICY "Admin upload covers"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'covers');
```

### Credential Security

| Key | Location | Usage |
|-----|----------|-------|
| `VITE_SUPABASE_URL` | `.env.local` | Frontend client |
| `VITE_SUPABASE_ANON_KEY` | `.env.local` | Frontend client |
| Service Role Key | Supabase Dashboard only | NEVER in frontend |

---

## Supabase Configuration

### Database Tables

- `poems` (see DATABASE_SCHEMA.md)
- `stories` (see DATABASE_SCHEMA.md)
- `categories` (see DATABASE_SCHEMA.md)

### Storage Buckets

| Bucket | Purpose | Public |
|--------|---------|--------|
| `covers` | Story cover images | Yes |
| `manuscripts` | Handwritten page scans | Yes |

### Authentication

- Provider: Email/Password only
- No public registration
- Admin created manually in dashboard

---

## Pagination Strategy

Use "Load More" pattern, not numbered pagination.

```text
Initial load: LIMIT 10 OFFSET 0
Load more:    LIMIT 10 OFFSET 10
Load more:    LIMIT 10 OFFSET 20
...
```

Frontend maintains offset state and appends results.

---

## Featured Content

Homepage featured content is manually curated:

1. Admin sets `featured = true` on content
2. Admin sets `display_order` for sorting
3. Homepage query:

```sql
SELECT * FROM poems
WHERE status = 'published' AND featured = true
ORDER BY display_order ASC NULLS LAST, published_at DESC
LIMIT 3;
```

---

## Deferred Features

NOT included in current architecture:

| Feature | Status |
|---------|--------|
| Appreciation/likes | Deferred |
| Reader responses/comments | Deferred |
| Full-text search | Deferred |
| Analytics | Deferred |
| Multi-user admin | Deferred |
| Content scheduling | Deferred |
| Version history | Deferred |

These may be added in future iterations.