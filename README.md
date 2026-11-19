# Suhaan’s personal site

Live at https://suhaancoding.github.io.

Profile, Notes, and experience on one page. No sample writing or RSS.

## Browser editor

Open https://suhaancoding.github.io/admin/. This address is intentionally absent from public navigation. Editing still requires repository authorization.

Use the top-right sun/moon button to switch themes. The public site and editor remember separate preferences.

First-time sign-in: follow https://suhaancoding.github.io/admin/help.html. Create a fine-grained GitHub access token limited to this repository with Contents read/write, then enter it directly in the editor. The existing GitHub browser session by itself cannot authorize repository API writes. Never share the token in chat or commit it. The editor remembers the session until sign-out or expiration; revoke the token in GitHub if needed.

- **Notes:** create, edit, duplicate, delete, and organize notes. New notes are drafts. Use sections, tags, pins, and order for curation.
- **Website:** edit the name, profile line, image, links, experience, search description, and section labels. Add/remove/reorder experience and link entries.
- **Assets:** upload and manage images. Supported uploads: PNG, JPEG, WebP, GIF, AVIF, and PDF; maximum editor upload size is 10 MB. Removing a referenced image can break a page, so review references before confirming.
- **Formatting:** bold, italic, strikeout, headings, lists, task lists, links, tables, code, images, inline equations, and displayed equations. The Insert menu includes equation controls. You can switch to Markdown at any time.
- **Preview:** uses the public site's typography and math renderer. It updates while editing. Narrow screens toggle between edit/preview; larger screens show panes together.
- **Saving:** Save writes to GitHub; the existing publish workflow updates the live site, usually after a minute or two. A save is not an instant production deployment. Invalid public equations are caught before save; unfinished formulas can be saved as drafts. Drafts saved to this public repository remain public source files.
- **Recovery:** the editor offers to restore browser draft backups after an interrupted session. Git history keeps prior committed versions.

The content editor does not expose layout, style, workflow, or authentication files. Public pages allow only the exact bundled theme script through a content security policy. All editor libraries are pinned and bundled locally; there is no separate CMS subscription.

## Publish a note using GitHub

You can publish entirely in your browser, without Codex or a terminal:

1. Open [your posts folder](https://github.com/SuhaanCoding/suhaancoding.github.io/tree/main/content/posts).
2. Choose **Add file → Create new file**. Name it something like `first-thought.md`.
3. Write a title and date between `---` lines, then your post below:

```markdown
---
title: Your title
date: 2026-11-03
---

Your writing goes here.
```

4. Click **Commit changes**, choose to commit directly to `main`, then confirm **Commit changes**. The site publishes automatically; allow a minute or two. Check the [Actions page](https://github.com/SuhaanCoding/suhaancoding.github.io/actions) for progress.

To edit a post, open its file and click the pencil icon, edit, then commit again. A commit is a saved version of a file. **GitHub’s Preview tab previews Markdown, not the exact website design.**

Use lowercase hyphenated filenames. Optional `summary` sets the page description. Use `draft: true` to exclude an unfinished post from the website. If a math expression has a syntax error, the new build will fail and the previous live site stays up; the Actions log names the file and equation error.

## Math

Use LaTeX notation between `$` signs for math in a sentence, or between separate `$$` lines for a displayed equation:

```markdown
An inline equation: $E = mc^2$.

$$
\int_0^1 x^2\,dx = \frac{1}{3}
$$
```

KaTeX typesets math when the site builds, including accessible MathML. No browser JavaScript or external math CDN is needed. Wide displayed equations scroll horizontally on phones. Put a space before and after inline math (punctuation can follow the closing `$`). Use `\$` for a literal dollar sign and backticks/code blocks when showing LaTeX source. Fractions, sums, integrals, matrices, and aligned equations are supported; see [supported notation](https://katex.org/docs/supported).

You can also write `.md` files in a Markdown editor on your computer, then use **Add file → Upload files** in the posts folder. Keep the title/date header in every file.

Only put your own writing in this folder. Public repository source is visible even for drafts. The filename determines the URL, so keep it stable after publishing. Use `##` for headings within a post. Images can go in `public/images/` and use `/images/filename.jpg` links.

## Edit your profile and experience

Edit `site.config.json`. Profile facts and experience descriptions are independent of your résumé. The site does not include the résumé PDF, phone number, or personal email.

## Preview locally

With Node.js 22.12+ and Python 3 installed:

```sh
npm ci
npm run build
npm run preview
```

Open http://127.0.0.1:4173. Rebuild and refresh after edits.

## Files

- `site.config.json`: profile, links, and experience
- `content/posts/`: your writing
- `public/style.css`: appearance and responsive layout
- `public/images/shark.png`: supplied profile image
- `src/build.mjs`: static site generator
- `.github/workflows/pages.yml`: publishing

GitHub Pages uses the GitHub Actions source. Every commit to `main` builds and publishes `dist/`. Markdown is trusted author content. There are no visitor accounts, tracking, or backend services.

## Verification

Run `npm run check`, `npm test`, and `npm run build`. For browser-only CRUD testing, build with `EDITOR_TEST_SEED=1 npm run build`, serve `dist/`, and open `/admin/?test=1` on localhost. This uses a separate browser repository and never publishes test notes. Always make a normal production build before deployment; it omits the test seed.

The editor theme adapter targets the pinned CMS 0.269.2 preference-store export. When upgrading that dependency, verify or update src/admin/cms-preferences.mjs and check both the top switch and Settings > Appearance. Open-source attribution is retained in public/editor-license.txt.
