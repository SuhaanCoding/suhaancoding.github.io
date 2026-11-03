# Suhaan — personal site

## Purpose and audience
A personal home for writing, notes, a profile, and professional background. Visitors should find something to read within a few seconds. Content-site register; no admin or CMS interface.

## Visual direction
A blue notebook on a pale desk: quiet, personal, and precise. The signature is a large serif opening alongside a narrow notebook margin. Avoid dashboard cards, marketing claims, gradients, decorative metrics, and stock photos.

## Tokens and ownership
Runtime source of truth: `public/style.css`, `:root`. Cool paper `#f5f7fb`, white sheet `#ffffff`, ink `#172b4d`, secondary `#576376`, blue `#234cbd`, pale blue `#e8eff8`, highlight `#edf092`. Dark equivalents live in the same file. Georgia is the editorial face; the system sans-serif stack is for navigation and metadata. No remote fonts or font swaps. Spacing uses a 4px base; content max-width 1120px and article reading measure 680px. Subtle 8px surfaces, 1px boundaries.

## Content and behavior
Shared build-time shell owns navigation, footer, metadata, and theme control. All main content is server-rendered static HTML and readable without JavaScript. Search/type filters enhance the archive locally, preserve URL state, provide clear controls and a no-results state. Posts are Markdown with deliberately simple front matter. Drafts are excluded from HTML, search, RSS, and sitemap. Sample posts are visibly labeled everywhere. Experience is a broad overview; no résumé metrics, PDF, phone, or personal email are published.

## Accessibility and responsive layout
Semantic links/buttons, visible focus, skip link, local system fonts, reduced-motion support, high-contrast scrollbar fallback. Navigation wraps on narrow screens; article measure and tap targets stay usable. Theme follows the system until explicitly selected; storage failures fall back safely. No fixed-height content panes.

## Hosting
GitHub Pages is the requested destination. A reproducible Node build emits `dist/`; the GitHub Actions workflow deploys that directory. No Sites registration or alternate hosting is needed.
