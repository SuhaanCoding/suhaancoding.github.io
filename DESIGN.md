# Suhaan — personal site

## Purpose and audience
A minimal personal page. Profile first, then “Notes”, then experience. Only the user's writing belongs in Notes. No generated essays, sample posts, invented biography, slogans, or RSS.

## Visual direction
A plain, narrow document with generous but compact spacing. System sans-serif, a 34px name, 20px section headings, ordinary blue links. No hero, sidebar, cards, decorative monogram, footer, or promotional copy.

The user's supplied smiling shark image sits to the right of the profile text at 132px square, reducing to 88px/72px on mobile. Show the entire image, with reserved dimensions and modest rounded corners. No generated replacement or added copy.

## Tokens and ownership
Runtime source: `public/style.css`, `:root`. Paper `#ffffff`, ink `#202124`, secondary `#65686d`, links `#244fa2`, dividers `#e5e7eb`. Light/dark colors share the same variables. Explicit data-theme overrides the system fallback; public theme preference is separate from the editor preference. Maximum outer width 768px, 32px desktop padding, 24px mobile padding. Article body uses Georgia at 18px.

## Content and behavior
`site.config.json` contains only factual profile information, professional links, and broad experience summaries. Experience descriptions are the sole retained generated prose, as explicitly requested. Notes lists authored posts by title/date and otherwise says “No notes yet.” No search/filter controls for an empty collection. Markdown posts only require title/date; drafts and examples are excluded. Existing writing/about/experience URLs redirect to the corresponding part of the one-page site. RSS is not generated or linked.

## Accessibility and responsive layout
Native links, skip link, visible keyboard focus, visible tokenized scrollbars with forced-color fallback. Natural document scrolling. Job headings and post dates stack on mobile. No animations or remote fonts on public pages. Content renders without JavaScript; a tiny hash-authorized script enables the optional theme switch.

Math is typeset at build time with the maintained Marked KaTeX extension. Inline `$...$` and displayed `$$` blocks preserve LaTeX through Markdown parsing. Output includes HTML and accessible MathML. Only math posts load the bundled KaTeX CSS/fonts; displayed equations have a keyboard-focusable horizontal scrolling region so long equations never widen the page. Invalid math fails the build with its filename. Writing instructions live in the repository README, not on the public profile.

## Hosting
GitHub Pages publishes the `dist/` output through the existing workflow. Keep the existing repository and public URL.

Stylesheet and profile image URLs include content hashes to prevent old browser/CDN assets from being paired with a newer page after publishing.


## Editing area
The user requested a comprehensive private editor while preserving the public layout. `/admin/` uses the pinned Sveltia CMS UI, with its own accessible system of fields, menus, notifications, draft recovery, and responsive panes. Project-specific changes are declarative schemas, a shared Markdown/math renderer, sanitized preview templates, and the preview frame compatibility adapter. `UX-CONTRACT.md` records authorization and behavior. Public navigation contains Notes, Experience, and a compact sun/moon switch; editing is reached directly at /admin/. Note metadata appears only when authored; no generated notes are added.

Content configuration now owns the name, profile line, image, image description, search description, links, experience, section labels, and empty-state label. Editor styling is owned by the CMS package plus `src/admin/editor.css`; public tokens remain owned by `public/style.css`. Both previews load the public stylesheet and bundled KaTeX fonts. Layout source and CSS are intentionally excluded from the editor's content schemas.

The editor opens on a light writing canvas by default, preserving any explicit theme preference. Notes place a large, borderless title directly above a Georgia writing area and compact formatting bar. Date, summary, draft visibility, section, tags, pins, and order live in one collapsed Note settings disclosure. Validation errors automatically expand it. `src/admin/writer-ui.mjs` owns this presentation adapter; vendor controls retain all editing and saving behavior.

## Appearance controls and editor branding
A 36px circular sun/moon button sits at the right end of public navigation; coarse pointers get a 44px target. The editor reuses the same semantic control in a reserved slot at the right of its existing top toolbar; no extra navigation row is added. No cards, labels, or extra settings menus are added. The public preference persists independently under suhaan-site-theme. The editor writes to the existing reactive CMS preference store through the pinned cms-preferences.mjs adapter; Settings > Appearance and the top switch therefore stay in sync. Editor previews inherit the selected editor theme. Shared icon/accessible-label behavior lives in src/theme-control.mjs. Visual tokens stay in public/style.css and the vendor theme adapter.

Visible vendor credit and promotional infobars are removed. Authentication, error, save, and network notices remain. The underlying editor remains installed, preserving formatting, math, drafts, and GitHub access. Its license is retained in public/editor-license.txt. There is no public Edit site link; GitHub authorization remains the actual editing permission check.
