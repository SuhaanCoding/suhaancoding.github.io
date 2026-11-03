# Suhaan’s personal site

A static personal website for essays, blog posts, notes, a profile, and experience. Built for `https://suhaancoding.github.io` with no database or paid hosting.

## Preview locally

Install Node.js 20 or newer, then run:

```sh
npm ci
npm run build
npm run preview
```

Open `http://127.0.0.1:4173`. After editing content, run `npm run build` again and refresh. The preview command uses Python 3; any static server can serve `dist/` instead.

## Publish a post

1. Copy `content/post-template.md` into `content/posts/your-post-title.md`.
2. Edit its title, date, summary, and tags. Choose `Essay`, `Blog`, or `Note` for `type`.
3. Write below the second `---` line using Markdown.
4. Change `draft: true` to `draft: false` when ready.
5. Commit the file to `main`. GitHub Actions rebuilds and publishes the site.

You can do all of this in GitHub’s web editor using **Add file → Create new file**. No local software is required for future posts. Keep a post’s filename stable after publishing: it determines its URL. Front matter uses one `key: value` per line, with comma-separated tags. Headings in the body should start at `##` because the post title is already the page’s main heading. Local images can go in `public/images/`, referenced as `![Description](/images/photo.jpg)`.

Posts marked `draft: true` never enter the published site, search, RSS, or sitemap. The source file is still visible if the repository is public, so keep private drafts outside the repository. Future dates do not schedule publishing; use `draft: true` until ready.

## Sample writing

Three clearly labeled example posts demonstrate the layouts. They are not attributed to Suhaan. Delete them or leave `draft: true` when you have your own writing. `example: true` adds the example notices and excludes the post from RSS and the sitemap. Set `example: false` on your own writing. Example pages request no search indexing.

## Edit your profile and experience

Edit `site.config.json`. Your name, bio, About paragraphs, links, education, interests, and experience live here. Each experience entry has its own `organization`, `role`, `period`, `description`, and `tags` fields. These are intentionally broad and independent of your application résumé. There is no résumé PDF, phone number, personal email address, or performance metric in the site.

The opening bio and About prose are editable drafts based on your supplied background. Review wording before sharing widely.

## First deployment to GitHub Pages

1. Create the public repository **SuhaanCoding/suhaancoding.github.io**. If it already exists, preserve its files and review before replacing anything.
2. Upload this project’s source files to the root of its `main` branch, including `.github/workflows/pages.yml` and `package-lock.json`. Do not upload `node_modules/` or `dist/`.
3. In **Settings → Pages → Build and deployment → Source**, select **GitHub Actions**.
4. Open **Actions → Publish personal site → Run workflow**, or commit a change to `main`.
5. After deployment succeeds, visit `https://suhaancoding.github.io`.

The workflow automatically publishes future commits. Root-relative links assume this is your account’s `suhaancoding.github.io` repository, rather than a project site under `/another-repository/`. The `url` field in `site.config.json` sets the canonical, RSS, and sitemap origin; change it if you add a custom domain.

## Structure

- `site.config.json`: profile and experience
- `content/posts/*.md`: writing
- `public/style.css`: colors, typography, responsive layouts, and themes
- `public/site.js`: archive search/filter, theme choice, and copy-link controls
- `src/build.mjs`: static site generator
- `.github/workflows/pages.yml`: automatic deployment
- `dist/`: generated output, ignored by Git

All writing, navigation, and profile content work without JavaScript. JavaScript adds archive filtering, theme switching, and link copying. RSS is at `/feed.xml`. No tracking, external font service, backend, or visitor accounts are included. Markdown is trusted author content; only grant repository write access to people allowed to publish HTML on your site.
