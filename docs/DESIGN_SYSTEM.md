# DESIGN SYSTEM — Pratima साहित्य संग्रह

This is the visual language for the project. Follow this document together with `DESIGN_BRIEF.md`.

## 1. Color System

### Light Theme

| Token | Value | Purpose |
|---|---|---|
| `--color-paper` | `#F1ECE3` | Main page background |
| `--color-paper-light` | `#F8F5EF` | Elevated surfaces |
| `--color-paper-deep` | `#E9E0D2` | Secondary sections |
| `--color-ink` | `#302A24` | Primary text |
| `--color-ink-soft` | `#5C5147` | Secondary text |
| `--color-muted` | `#80756A` | Metadata |
| `--color-maroon` | `#6F1D2A` | Primary accent |
| `--color-maroon-hover` | `#861F2D` | Accent hover |
| `--color-walnut` | `#684A37` | Secondary accent |
| `--color-gold` | `#A88955` | Decorative accent |
| `--color-border` | `#D4C6B3` | Subtle borders |

The background should be slightly dimmed/warm rather than bright white.

Use maroon sparingly. Use gold for small decorative details. Avoid saturated purple, electric blue, neon colors, and loud gradients.

### Dark Theme — Future
A dark theme may be added later using warm charcoal/brown tones rather than pure black. Do not implement it unless approved.

## 2. Typography

Because all literary content is Devanagari, typography is a first-class visual element.

### Literary headings
Prefer **Noto Serif Devanagari** or **Tiro Devanagari Hindi**.

### Reading/body text
Prefer **Mukta**.

### Utility/UI text
Use **Inter** selectively for technical controls, small labels, and utility UI.

Principles:
- Prioritize Devanagari readability.
- Use generous line-height.
- Avoid condensed or tiny text.
- Avoid decorative fonts for long passages.

## 3. Type Scale

| Purpose | Desktop | Mobile |
|---|---:|---:|
| Hero title | 64–80px | 42–52px |
| Page title | 48–56px | 36–42px |
| Section title | 32–40px | 28–32px |
| Card title | 24–28px | 22–24px |
| Body | 18–20px | 17–19px |
| Poem reading text | 20–24px | 18–21px |
| Metadata | 14–16px | 13–15px |

## 4. Spacing
Use a generous scale:
`4, 8, 12, 16, 24, 32, 48, 64, 80, 96, 128px`.

Literary pages should generally have more whitespace than ordinary content websites.

## 5. Layout
- General content: approximately `1200–1280px`
- Reading content: approximately `680–760px`
- Hero text: approximately `720–900px`

Long-form text must not span the full desktop viewport.

## 6. Borders and Radius
Preferred radius:
- Small: 4px
- Medium: 8px
- Large: 12px

Use subtle warm borders. Avoid heavy black borders and excessive pill-shaped controls.

## 7. Shadows
Use soft, low-opacity shadows only where elevation helps. Avoid heavy, glowing, or neon shadows.

## 8. Buttons
Primary button:
- Deep maroon background
- Warm light text
- Subtle radius
- Comfortable padding
- Gentle hover transition

Example: **साहित्य पढ़ें**

Secondary button:
- Paper/transparent background
- Warm border
- Ink text

Avoid generic gradient buttons.

## 9. Decoration
Possible motifs:
- Thin botanical line drawings
- Small ornamental separators
- Ink/pen motifs
- Bookmark-inspired accents
- Fine horizontal rules

Decoration must never interfere with reading.

## 10. Animation
Animation should feel calm.

Allowed:
- Fade-in
- Gentle upward reveal
- Soft hover elevation
- Subtle opacity transitions
- Smooth page transitions

Avoid:
- Bounce
- Shake
- Flash
- Excessive parallax
- Large spinning animations

Prefer roughly 200–500ms for UI transitions.

Respect `prefers-reduced-motion`.

## 11. Accessibility
Target WCAG 2.1 AA.

Requirements:
- Keyboard navigation
- Visible focus states
- Semantic HTML
- Accessible names for icon buttons
- Sufficient contrast
- Responsive text
- Reduced-motion support
- Never rely on color alone
- Meaningful image alt text

## 12. Responsive Design
Mobile is not simply a compressed desktop.

On mobile:
- Preserve comfortable reading typography.
- Reduce decorative elements.
- Use a simple hamburger menu.
- Avoid horizontal overflow.
- Keep touch targets comfortable.

## 13. Core Rule
The strongest visual element should always be the literature itself.

If decoration competes with the poem, remove it. If animation distracts from reading, remove it.
