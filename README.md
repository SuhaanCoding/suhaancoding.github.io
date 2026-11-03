# Suhaan’s personal site

Live at https://suhaancoding.github.io.

Profile, Notes, and experience on one page. No sample writing or RSS.

## Publish a note

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

With Node.js 20+ and Python 3 installed:

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
