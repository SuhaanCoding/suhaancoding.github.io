# Suhaan — personal site

## Purpose and audience
A minimal personal page. Profile first, then “My Thoughts”, then experience. Only the user's writing belongs in My Thoughts. No generated essays, sample posts, invented biography, slogans, or RSS.

## Visual direction
A plain, narrow document with generous but compact spacing. System sans-serif, a 34px name, 20px section headings, ordinary blue links. No hero, sidebar, cards, decorative monogram, footer, or promotional copy.

## Tokens and ownership
Runtime source: `public/style.css`, `:root`. Paper `#ffffff`, ink `#202124`, secondary `#65686d`, links `#244fa2`, dividers `#e5e7eb`. System dark colors use the same variables through the prefers-color-scheme media query. Maximum outer width 768px, 32px desktop padding, 24px mobile padding. Article body uses Georgia at 18px.

## Content and behavior
`site.config.json` contains only factual profile information, professional links, and broad experience summaries. Experience descriptions are the sole retained generated prose, as explicitly requested. My Thoughts lists authored posts by title/date and otherwise says “No posts yet.” No search/filter controls for an empty collection. Markdown posts only require title/date; drafts and examples are excluded. Existing writing/about/experience URLs redirect to the corresponding part of the one-page site. RSS is not generated or linked.

## Accessibility and responsive layout
Native links, skip link, visible keyboard focus, visible tokenized scrollbars with forced-color fallback. Natural document scrolling. Job headings and post dates stack on mobile. No animations, remote fonts, or JavaScript required.

## Hosting
GitHub Pages publishes the `dist/` output through the existing workflow. Keep the existing repository and public URL.
