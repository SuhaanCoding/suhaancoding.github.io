# Suhaan’s personal site

Live at https://suhaancoding.github.io.

Profile, My Thoughts, and experience on one page. No sample writing or RSS.

## Publish a post

Create a Markdown file in `content/posts/`, using a lowercase hyphenated filename. Begin with front matter containing `title` and `date` (YYYY-MM-DD) between two `---` lines, then write your post below. Optional `summary` sets the page description. Use `draft: true` to exclude an unfinished post from the website. Commit to `main` to publish automatically.

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
- `src/build.mjs`: static site generator
- `.github/workflows/pages.yml`: publishing

GitHub Pages uses the GitHub Actions source. Every commit to `main` builds and publishes `dist/`. Markdown is trusted author content. There are no visitor accounts, tracking, or backend services.
