# Pratima — Content Model

## Purpose

This document defines how poems and stories are represented within the application.

Pratima is a literary archive of Hindi writing.

The content model must prioritize:

- preservation of the original writing
- correct Devanagari formatting
- readability
- simple content management
- future maintainability

---

## Content Types

```text
Poem
Story
Category
```

---

## Poem

A poem is a single literary work, typically short-form verse.

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `title` | Text | Hindi title in Devanagari |
| `slug` | Text | URL-friendly identifier (e.g., `barish`) |
| `content` | Text | Full poem text with line breaks preserved |
| `status` | Enum | `draft`, `published`, or `archived` |

### Optional Fields

| Field | Type | Description |
|-------|------|-------------|
| `subtitle` | Text | Optional secondary title |
| `excerpt` | Text | Short preview for cards/listings |
| `category_id` | UUID | Single category reference |
| `written_date` | Date | Original composition date |
| `reading_time` | Integer | Estimated minutes to read |
| `featured` | Boolean | Display on homepage |
| `display_order` | Integer | Sort order for featured content |
| `manuscript_url` | Text | Path to handwritten scan in storage |

### Content Formatting

- Line breaks within stanzas: single `\n`
- Stanza breaks: double `\n\n`
- Preserve original Devanagari exactly
- Do not auto-correct or transliterate

### Example

```text
Title: बारिश
Slug: barish
Content:
बूँदें गिरती हैं छत पर
टप टप टप की आवाज़

खिड़की से देखती हूँ मैं
भीगती हुई सड़क
```

---

## Story

A story is a longer prose narrative.

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `title` | Text | Hindi title in Devanagari |
| `slug` | Text | URL-friendly identifier |
| `content` | Text | Full story text |
| `status` | Enum | `draft`, `published`, or `archived` |

### Optional Fields

| Field | Type | Description |
|-------|------|-------------|
| `subtitle` | Text | Optional secondary title |
| `excerpt` | Text | Short preview for cards/listings |
| `cover_url` | Text | Path to cover image in storage |
| `category_id` | UUID | Single category reference |
| `written_date` | Date | Original composition date |
| `reading_time` | Integer | Estimated minutes to read |
| `featured` | Boolean | Display on homepage |
| `display_order` | Integer | Sort order for featured content |
| `manuscript_url` | Text | Path to handwritten scan in storage |

### Content Formatting

- Paragraph breaks: double `\n\n`
- Preserve original Devanagari exactly
- Do not auto-correct or transliterate

---

## Category

Categories organize poems and stories by theme.

### Fields

| Field | Type | Description |
|-------|------|-------------|
| `name` | Text | Hindi category name (e.g., `प्रकृति`) |
| `slug` | Text | URL-friendly identifier (e.g., `prakriti`) |
| `description` | Text | Optional description |
| `type` | Enum | `poem`, `story`, or `both` |
| `display_order` | Integer | Sort order in UI |

### Assignment Rules

- Each poem has at most ONE category
- Each story has at most ONE category
- Categories are optional (content can be uncategorized)
- No many-to-many relationships at this stage

### Example Categories

| Name | Slug | Type |
|------|------|------|
| प्रकृति | prakriti | both |
| प्रेम | prem | both |
| जीवन | jeevan | both |
| बचपन | bachpan | both |
| यादें | yaadein | both |

---

## Content Status

Three states control visibility:

| Status | Public Visible | Admin Visible | Description |
|--------|----------------|---------------|-------------|
| `draft` | No | Yes | Work in progress |
| `published` | Yes | Yes | Live on public website |
| `archived` | No | Yes | Hidden but preserved |

### Transitions

```text
draft → published     (publish action)
published → archived  (archive action)
archived → published  (restore action)
draft → archived      (archive without publishing)
archived → draft      (restore to draft)
```

---

## Featured Content

Homepage displays manually curated featured content.

### Selection Criteria

- `featured = true`
- `status = 'published'`

### Ordering

- Primary: `display_order ASC` (lower numbers first)
- Secondary: `published_at DESC` (newest first if same order)

### Admin Workflow

1. Set `featured = true` on selected items
2. Assign `display_order` values (e.g., 1, 2, 3)
3. Homepage query retrieves in this order

---

## URL Strategy

Public URLs use slugs, not UUIDs:

```text
/poems/{slug}
/stories/{slug}
```

Examples:
- `/poems/barish`
- `/stories/ek-adhuri-kahani`

### Slug Requirements

- Lowercase
- Hyphens for word separation
- No special characters
- Unique within content type
- Transliterated from Hindi or descriptive

---

## Manuscript Images

Original handwritten pages can be associated with content.

### Storage

- Bucket: `manuscripts`
- Path: `manuscripts/poems/{slug}.{ext}` or `manuscripts/stories/{slug}.{ext}`
- Formats: JPG, PNG, WebP

### Display (Future)

- "मूल हस्तलिखित पृष्ठ देखें" button on reading page
- Modal/lightbox viewer
- Implementation deferred to later stage

---

## Deferred Features

The following are NOT part of the current content model:

### Appreciation / सराहना
- No `appreciation_count` field
- No appreciations table
- No like/heart functionality

### Reader Responses / अनुभूति
- No responses table
- No comment functionality

### Search
- No full-text search indexes
- Search UI remains disabled

These may be added in future iterations.