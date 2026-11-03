# Suhaan — personal site

## Purpose and audience
A minimal personal page. Profile first, then “Notes”, then experience. Only the user's writing belongs in Notes. No generated essays, sample posts, invented biography, slogans, or RSS.

## Visual direction
A plain, narrow document with generous but compact spacing. System sans-serif, a 34px name, 20px section headings, ordinary blue links. No hero, sidebar, cards, decorative monogram, footer, or promotional copy.

The user's supplied smiling shark image sits to the right of the profile text at 132px square, reducing to 88px/72px on mobile. Show the entire image, with reserved dimensions and modest rounded corners. No generated replacement or added copy.

## Tokens and ownership
Runtime source: `public/style.css`, `:root`. Paper `#ffffff`, ink `#202124`, secondary `#65686d`, links `#244fa2`, dividers `#e5e7eb`. System dark colors use the same variables through the prefers-color-scheme media query. Maximum outer width 768px, 32px desktop padding, 24px mobile padding. Article body uses Georgia at 18px.

## Content and behavior
`site.config.json` contains only factual profile information, professional links, and broad experience summaries. Experience descriptions are the sole retained generated prose, as explicitly requested. Notes lists authored posts by title/date and otherwise says “No notes yet.” No search/filter controls for an empty collection. Markdown posts only require title/date; drafts and examples are excluded. Existing writing/about/experience URLs redirect to the corresponding part of the one-page site. RSS is not generated or linked.

## Accessibility and responsive layout
Native links, skip link, visible keyboard focus, visible tokenized scrollbars with forced-color fallback. Natural document scrolling. Job headings and post dates stack on mobile. No animations, remote fonts, or JavaScript required.

Math is typeset at build time with the maintained Marked KaTeX extension. Inline `$...$` and displayed `$$` blocks preserve LaTeX through Markdown parsing. Output includes HTML and accessible MathML. Only math posts load the bundled KaTeX CSS/fonts; displayed equations have a keyboard-focusable horizontal scrolling region so long equations never widen the page. Invalid math fails the build with its filename. Writing instructions live in the repository README, not on the public profile.

## Hosting
GitHub Pages publishes the `dist/` output through the existing workflow. Keep the existing repository and public URL.

Stylesheet and profile image URLs include content hashes to prevent old browser/CDN assets from being paired with a newer page after publishing.
