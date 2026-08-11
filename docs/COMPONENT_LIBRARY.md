# COMPONENT LIBRARY — Pratima साहित्य संग्रह

Reusable components should be semantic, accessible, focused, and consistent with `DESIGN_SYSTEM.md`.

## 1. Application Shell

### MainLayout
Contains:
```text
MainLayout
├── Navbar
├── Main / Outlet
└── Footer
```

Uses React Router `<Outlet />`.

## 2. Navigation

### Navbar
Contains:
- Brand
- मुखपृष्ठ
- कविताएँ
- कहानियाँ
- लेखिका
- Mobile menu toggle

Requirements:
- Semantic `<nav>`
- Keyboard accessible
- Responsive
- Active route indication
- Accessible hamburger control

### MobileMenu
Requirements:
- Keyboard accessible
- Escape-to-close
- Clear open/closed state
- Appropriate ARIA attributes

## 3. Footer

### Footer
May contain:
- प्रतिमा साहित्य संग्रह
- Short literary statement
- Navigation
- Copyright
- Optional approved social/contact links

Keep it quiet and minimal.

## 4. Hero

### LiteraryHero
Contains:
- Author name
- Subtitle
- Tagline
- Primary CTA

Direction:
- Centered
- Generous whitespace
- Devanagari typography
- Optional subtle botanical/ink decoration

## 5. Author

### AuthorIntro
Contains:
- Portrait
- Name
- Short introduction
- Link to author page

### AuthorProfile
Contains:
- Portrait
- Biography
- Writing journey
- Inspiration
- Optional handwritten signature

## 6. Literary Cards

### PoemCard
Contains:
- Title
- Short excerpt
- Reading time
- Appreciation count
- Optional date/category

The card/title links to the poem detail page. An appreciation control must not accidentally navigate.

### StoryCard
Contains:
- Cover image
- Title
- Excerpt
- Reading time
- Optional category/year

### LiteraryCard
Optional shared abstraction. Do not force poems and stories into one abstraction if it makes the UX less clear.

## 7. Reading

### ReadingLayout
Shared long-form container:
- Controlled reading width
- Responsive typography
- Comfortable line-height
- Semantic content
- Minimal distractions

### PoemReader
Structure:
```text
Title
Metadata
Poem content
Author attribution
Engagement
Manuscript action
Previous/Next
```

### StoryReader
Structure:
```text
Title
Cover
Metadata
Story content
Author attribution
Engagement
Manuscript action
Previous/Next
```

### LiteraryMetadata
Displays:
- Date
- Category
- Reading time
- Other approved metadata

## 8. Engagement

### AppreciationButton
Use:
**सराहना करें**

States:
- Default
- Appreciated
- Loading
- Error

Requirements:
- Accessible name
- Keyboard support
- Prevent accidental double submission

### ReaderResponse
Use:
**अपनी अनुभूति लिखें**

Support:
- Empty
- Form
- Submitting
- Error
- Success states

### ResponseList
Display reader responses calmly. It should not resemble a social-media comment feed.

## 9. Manuscript / Archive

### ManuscriptButton
Label:
**मूल हस्तलिखित पृष्ठ देखें**

### ManuscriptViewer
Requirements:
- Accessible dialog
- Close button
- Keyboard support
- Responsive image
- Caption/alt text
- Zoom only when useful

## 10. Quotes

### LiteraryQuote
Structure:
```text
Quote
— प्रतिमा
```

### QuoteOfTheDay
Optional future feature. Use only if there is an approved quote dataset and a clear reason for rotation.

## 11. Content Sections

### SectionHeader
Shared heading for homepage sections.

Example:
```text
कविताएँ
────────────
```

Optional action:
**सभी कविताएँ →**

### FeaturedPoems
Uses `PoemCard`.

### FeaturedStories
Uses `StoryCard`.

## 12. Search / Filtering

### SearchInput
Requirements:
- Accessible label
- Clear action
- Keyboard support
- Debounce only when appropriate

### CategoryFilter
Use only after categories have been defined.

## 13. Loading / Error

### LiterarySkeleton
Subtle loading placeholder compatible with the paper aesthetic.

### EmptyState
Example:
**अभी यहाँ कोई रचना उपलब्ध नहीं है।**

### ErrorState
Example:
**रचना लोड नहीं हो सकी। कृपया कुछ देर बाद पुनः प्रयास करें।**

Provide retry where appropriate.

## 14. Buttons / Links

### PrimaryButton
Main page action, e.g. **साहित्य पढ़ें**.

### SecondaryButton
Secondary actions.

### TextLink
Navigation and low-emphasis actions.

### IconButton
For icon-only actions:
- Accessible `aria-label`
- Visible focus
- Comfortable touch target
- Tooltip when useful

## 15. Decorative Components

### OrnamentalDivider
Subtle section separator.

### BotanicalDecoration
Optional decorative illustration. Never convey essential meaning.

## 16. Component Rules

1. Prefer semantic HTML.
2. Keep components focused on one responsibility.
3. Prefer composition over large conditional components.
4. Avoid premature abstraction.
5. Keep content/data separate from presentation where practical.
6. Do not hardcode repeated content inside reusable components.
7. Keep interaction state local unless multiple components genuinely need it.
8. Give icon-only controls accessible names.
9. Follow `DESIGN_SYSTEM.md`.
10. Follow `DESIGN_BRIEF.md` for decisions not covered elsewhere.

## 17. Naming

Use PascalCase:
- `Navbar.jsx`
- `PoemCard.jsx`
- `StoryCard.jsx`
- `ReadingLayout.jsx`
- `AuthorIntro.jsx`

Avoid vague names such as:
- `Box.jsx`
- `Thing.jsx`
- `Card2.jsx`
- `Common.jsx`

## 18. Data Flow

Presentation components should not directly contain Supabase queries.

Preferred future flow:
```text
Page
 ↓
Service / data layer
 ↓
Component props
 ↓
UI
```

## 19. Scope

This is the intended component library, not a request to implement everything immediately.

Build components incrementally as each feature is approved.
