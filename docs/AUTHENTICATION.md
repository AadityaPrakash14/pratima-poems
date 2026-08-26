# Pratima — Authentication Architecture

## Purpose

This document defines authentication and authorization for the Pratima admin portal.

---

## Public Users

Public visitors do NOT need accounts.

Visitors can:

- browse published poems
- browse published stories
- search/filter content (when implemented)
- read individual published works
- view the author page
- view categories

No login should be required for public content.

Public users CANNOT:

- view draft or archived content
- create, update, or delete any content
- access admin pages
- upload files

---

## Administrator

Only authorized administrators can access the admin portal.

### Authentication Method

- Supabase Authentication
- Email/password login only
- NO public registration
- NO social login providers
- NO magic link authentication

### Admin Creation

The first administrator is created manually through the Supabase dashboard:

1. Go to Supabase Dashboard → Authentication → Users
2. Click "Add user"
3. Enter email and password
4. Confirm email if required

Do NOT create any self-registration flow.

### Admin Capabilities

Authenticated administrators can:

- View all poems (draft, published, archived)
- Create new poems
- Edit existing poems
- Publish/archive poems
- Delete poems
- View all stories (draft, published, archived)
- Create new stories
- Edit existing stories
- Publish/archive stories
- Delete stories
- Manage categories
- Upload cover images
- Upload manuscript scans

---

## Authentication Flow

```text
/admin/login
      |
      v
Supabase Auth (signInWithPassword)
      |
      +---- Authentication successful
      |              |
      |              v
      |        Store session
      |              |
      |              v
      |        /admin/dashboard
      |
      +---- Authentication failed
                     |
                     v
               Show error message
                     |
                     v
               Remain on /admin/login
```

### Session Management

- Use Supabase JS client session management
- Sessions persist across page refreshes
- Auto-refresh tokens handled by Supabase client
- Logout clears session and redirects to /admin/login

---

## Route Protection

### Frontend Protection

Admin routes require authentication check:

```text
/admin/*  →  Check session  →  Allow or redirect to /admin/login
```

Protected routes:
- `/admin/dashboard`
- `/admin/poems`
- `/admin/poems/new`
- `/admin/poems/:id/edit`
- `/admin/stories`
- `/admin/stories/new`
- `/admin/stories/:id/edit`
- `/admin/categories`

### Backend Protection (CRITICAL)

Frontend route protection alone is NOT sufficient.

Supabase Row Level Security (RLS) MUST be enabled:

```sql
-- Public can only read published content
CREATE POLICY "Public can view published poems"
  ON poems FOR SELECT
  TO anon
  USING (status = 'published');

-- Authenticated users have full access
CREATE POLICY "Admin full access to poems"
  ON poems FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
```

This ensures:
- Even if frontend is bypassed, database enforces access rules
- API calls from unauthenticated users cannot access draft/archived content
- API calls from unauthenticated users cannot modify any content

---

## Security Requirements

### Service Role Key

NEVER expose the Supabase service-role key in frontend code.

The frontend must use ONLY the anon key:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

The service-role key should only be used in:
- Server-side code (if any)
- Database migrations
- Supabase dashboard

### Password Requirements

Supabase default password requirements apply.
Recommend strong passwords for admin accounts.

### Session Security

- HTTPS required in production
- Secure cookie settings managed by Supabase
- Token refresh handled automatically

---

## Error Handling

### Login Errors

| Error | User Message |
|-------|--------------|
| Invalid credentials | "ईमेल या पासवर्ड गलत है।" |
| Network error | "कनेक्शन में समस्या है। कृपया पुनः प्रयास करें।" |
| Unknown error | "कुछ गलत हो गया। कृपया पुनः प्रयास करें।" |

### Session Errors

| Error | Action |
|-------|--------|
| Session expired | Redirect to /admin/login |
| No session | Redirect to /admin/login |
| Refresh failed | Redirect to /admin/login |

---

## Logout

Logout process:

1. Call `supabase.auth.signOut()`
2. Clear any local state
3. Redirect to `/admin/login`

Logout should be available from:
- Admin navigation header
- Any admin page