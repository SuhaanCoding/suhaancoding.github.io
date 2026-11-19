# Website editor behavior

## Scope and business sources
The public profile layout is preserved. `/admin/` edits notes and `site.config.json` using Sveltia CMS 0.269.2. Content authorization is enforced by GitHub's repository API, not by hiding client-side controls. A repository writer can edit; read-only visitors cannot save. Open authoring is disabled. The user explicitly authorized signing in and editing the existing site on 2026-11-19.

Sources: the current user request; Sveltia's GitHub backend requirements (`https://sveltiacms.app/en/docs/backends/github`); the editor collection schema in `src/admin/config.mjs`; GitHub API repository permissions. No additional account, cloud database, or public write endpoint is introduced.

## Canonical UI Map
| Capability | Canonical owner | Source of truth | Allowed variants | Verification |
|---|---|---|---|---|
| Select/Listbox | Sveltia CMS field components | Pinned CMS package and config schema | Authored library controls | Browser Insert menu, field menus, and keyboard checks |
| Date | Sveltia DateTime field | Notes date schema | Native date popup with en locale; date-only UTC storage | Today action and saved date round trip |
| Form | Sveltia CMS schema-driven forms | src/admin/config.mjs | Notes and website file fields | Browser create/edit and validation checks |
| Scrollbar | Public stylesheet and admin/editor.css | DESIGN.md token ownership | Document and equation geometry | Narrow viewport and equation scrolling |
| Toast | Sveltia CMS feedback system | Pinned CMS package | Save success, errors, confirmations | Browser save and invalid-equation errors |
| CRUD | Sveltia CMS GitHub and local-test backends | Backend API contract and collection schema | Notes, website file, media library | Browser local-test create/read/update/delete; production auth checked separately |

## Save, preview, and publishing
The rich text editor supports formatting, Markdown mode, image insertion, code blocks, tables, inline equations, and displayed equations. Preview uses the same Marked/KaTeX renderer as the public build. It updates with editing; it does not claim the public deployment updates instantly. Public changes require Save, followed by the existing GitHub Pages workflow. No autosave to production.

New notes default to Draft. Draft files are omitted from public pages and the sitemap, but saved drafts remain visible in the existing public GitHub repository. Browser draft backups are managed by Sveltia; restoration requires a user choice after interrupted editing. Invalid equations can be saved as drafts. A non-draft save is rejected before commit if title, date, order, or math is invalid. Field errors preserve input. A GitHub failure does not report save success. Concurrent edits and session expiration use the CMS's recovery/error UI; no silent overwrites are added by project code.

Note filename determines its public URL and is preserved during normal edits. Pins sort first; lower order values sort before higher values; remaining ties use reverse date and then slug. Sections and tags are optional. Empty collections keep an honest empty state and no fabricated notes. Changing a title does not deliberately rename an existing URL.

## Authentication and session policy
Authentication uses the supported GitHub token method, with a fine-grained token limited to `SuhaanCoding/suhaancoding.github.io` and Contents read/write. GitHub adds Metadata read automatically. No workflow permission is required. The owner creates the credential and enters it directly in the editor. The CMS remembers its session in this browser and clears it on sign-out; expiration and revocation stay under GitHub control. Never include tokens in source, logs, URLs, the repository, or previews. Setup help is `/admin/help.html`. Normal GitHub website cookies cannot be reused as an API credential.

The public site forbids script execution through a document CSP and does not load editor assets. Preview HTML is sanitized with DOMPurify; math runs with KaTeX `trust: false`. Uploaded executable web documents are rejected by the site build; image fields only accept common raster image types. CMS field schemas expose only content and config, not CSS, templates, or workflows. Versioned local bundles avoid mutable external script CDNs. A targeted preview-frame adapter uses the CMS-generated HTML as `srcdoc` because embedded browsers may block `blob:` frame navigation.

## Navigation, confirmations, locale, and accessibility
Successful note saves return to the owning Notes list; website saves use the same CMS flow. Cancel/unsaved changes and deletion use the CMS's accessible confirmations. Deleting a note removes its Markdown file in a recoverable Git commit. Media deletion should be reviewed for references before confirming. Native semantic controls, library focus management and keyboard menus are canonical. Dates are date-only UTC; UI follows the CMS locale preference. The public site remains English and follows the system light/dark preference. Narrow screens use the CMS's single editing/preview pane; wide screens can show both.

## Local verification boundary
`?test=1` selects a browser-only test repository only on `localhost` and `127.0.0.1`; the public origin always uses GitHub authorization. Test data never writes to GitHub. Seed files are generated only with `EDITOR_TEST_SEED=1` and excluded from production builds. Browser QA evidence is recorded in `verification.json`; automated content tests are in `test/content.test.mjs`.

## Writing presentation
Title and body precede metadata. The writer presentation adapter adds a native button with aria-expanded and aria-controls; it collapses only sibling metadata fields without moving vendor-owned nodes or changing field values. Invalid metadata expands automatically. New notes receive today’s date in UTC. Site metadata lists start collapsed. The owner elected to retain public repository visibility to keep GitHub Free Pages online.
