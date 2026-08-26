# Pratima — Admin Workflow

## Purpose

This document defines the intended workflow for managing literary content through the admin portal.

The primary objective is:

> Allow the administrator to publish a new poem or story without modifying the React source code.

---

## Administrator Workflow

```text
/admin/login
      |
      v
/admin/dashboard
      |
      +---- Poems Management
      |         |
      |         +---- View all poems (drafts, published, archived)
      |         +---- Create new poem
      |         +---- Edit existing poem
      |         +---- Publish/archive poem
      |         +---- Upload manuscript image
      |
      +---- Stories Management
      |         |
      |         +---- View all stories (drafts, published, archived)
      |         +---- Create new story
      |         +---- Edit existing story
      |         +---- Publish/archive story
      |         +---- Upload cover image
      |         +---- Upload manuscript image
      |
      +---- Categories Management
                |
                +---- View all categories
                +---- Create new category
                +---- Edit existing category
                +---- Delete category (if unused)
```

---

## Content Lifecycle

### Creating Content

1. Admin navigates to Poems or Stories section
2. Clicks "नई कविता" or "नई कहानी"
3. Fills in required fields:
   - Title (शीर्षक)
   - Slug (URL identifier)
   - Content (पाठ)
4. Optionally fills:
   - Subtitle
   - Excerpt
   - Category
   - Written date
   - Reading time
   - Featured flag
   - Display order
5. Saves as draft (default)
6. Can upload manuscript image

### Publishing Content

```text
Draft → Review → Publish
```

1. Admin opens draft content
2. Reviews content and metadata
3. Clicks "प्रकाशित करें" (Publish)
4. Status changes to `published`
5. `published_at` timestamp is set
6. Content becomes visible on public website

### Archiving Content

```text
Published → Archive
```

1. Admin opens published content
2. Clicks "संग्रहित करें" (Archive)
3. Status changes to `archived`
4. Content is removed from public website
5. Content remains accessible to admin

### Restoring Content

```text
Archived → Published (or Draft)
```

1. Admin opens archived content
2. Clicks "पुनः प्रकाशित करें" or "ड्राफ़्ट में वापस"
3. Status changes accordingly
4. If published, content reappears on public website

---

## Featured Content Curation

Homepage displays manually selected featured content.

### Setting Featured Content

1. Admin opens poem/story editor
2. Enables "मुखपृष्ठ पर दिखाएँ" (Show on homepage)
3. Sets display order (1, 2, 3, etc.)
4. Saves changes

### Ordering Featured Content

- Lower `display_order` values appear first
- Items with same order sorted by `published_at` descending
- Recommended: Use clear sequential numbers (1, 2, 3)

### Removing from Featured

1. Admin opens featured item
2. Disables "मुखपृष्ठ पर दिखाएँ"
3. Saves changes
4. Item no longer appears on homepage (but remains published)

---

## Category Management

### Creating Categories

1. Admin navigates to Categories section
2. Clicks "नई श्रेणी"
3. Enters:
   - Name (Hindi): e.g., "प्रकृति"
   - Slug: e.g., "prakriti"
   - Type: poem, story, or both
   - Description (optional)
   - Display order
4. Saves category

### Assigning Categories

1. Admin opens poem/story editor
2. Selects category from dropdown
3. Each item can have ONE category
4. Category is optional

### Deleting Categories

1. Admin opens category
2. If no content uses this category, delete is allowed
3. If content uses this category, show warning
4. Option to reassign content before deletion

---

## Image Upload Workflow

### Cover Images (Stories)

1. Admin opens story editor
2. Clicks "कवर चित्र अपलोड करें"
3. Selects image file (JPG, PNG, WebP)
4. Image uploads to Supabase Storage `covers` bucket
5. `cover_url` field is updated
6. Preview shows in editor

### Manuscript Images

1. Admin opens poem/story editor
2. Clicks "हस्तलिखित पृष्ठ अपलोड करें"
3. Selects scan image (JPG, PNG, WebP)
4. Image uploads to Supabase Storage `manuscripts` bucket
5. `manuscript_url` field is updated
6. Preview shows in editor

Note: Public manuscript viewer is a future feature.

---

## Admin UI Sections

### Dashboard

Overview showing:
- Total poems (by status)
- Total stories (by status)
- Recent activity
- Quick links to create content

### Poems List

Table/grid showing:
- Title
- Status (color-coded badge)
- Category
- Featured indicator
- Last updated
- Actions (edit, publish/archive, delete)

Filters:
- Status (all, draft, published, archived)
- Category
- Featured only

### Stories List

Same structure as Poems List with:
- Cover image thumbnail

### Poem/Story Editor

Form with:
- Title field
- Slug field (auto-generated option)
- Content textarea (large, preserves formatting)
- Subtitle field
- Excerpt field
- Category dropdown
- Written date picker
- Reading time field
- Featured checkbox
- Display order field
- Manuscript upload
- Cover upload (stories only)
- Status indicator
- Action buttons (save, publish, archive, delete)

### Categories List

Table showing:
- Name
- Slug
- Type
- Content count
- Actions (edit, delete)

---

## Admin Navigation

```text
┌─────────────────────────────────────────────┐
│ प्रतिमा Admin          [User] [Logout]      │
├─────────────────────────────────────────────┤
│                                             │
│  Dashboard                                  │
│  कविताएँ (Poems)                            │
│  कहानियाँ (Stories)                         │
│  श्रेणियाँ (Categories)                     │
│                                             │
│  ─────────────────                          │
│  [साइट देखें] (View Site)                   │
│                                             │
└─────────────────────────────────────────────┘
```

---

## Status Badges

| Status | Hindi | Color |
|--------|-------|-------|
| draft | ड्राफ़्ट | Gray |
| published | प्रकाशित | Green |
| archived | संग्रहित | Orange |

---

## Deferred Features

The following are NOT part of the current admin workflow:

- Appreciation/सराहना management
- Reader responses/अनुभूति moderation
- Search configuration
- Analytics dashboard
- Bulk operations
- Content scheduling
- Version history

These may be added in future iterations.