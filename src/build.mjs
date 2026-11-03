import { readFile, readdir, mkdir, writeFile, cp, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { marked } from 'marked';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const config = JSON.parse(await readFile(path.join(root, 'site.config.json'), 'utf8'));
const origin = new URL(config.url).origin;
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const dateLabel = value => new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${value}T12:00:00Z`));
const safeURL = value => { const url = new URL(value); if (!['https:', 'http:'].includes(url.protocol)) throw new Error('Links must use HTTP or HTTPS'); return esc(url.href); };
const posts = [];
for (const file of (await readdir(path.join(root, 'content/posts'))).filter(f => f.endsWith('.md'))) {
  const source = await readFile(path.join(root, 'content/posts', file), 'utf8');
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) throw new Error(`Missing front matter: ${file}`);
  const meta = {};
  for (const line of match[1].split(/\r?\n/)) {
    const separator = line.indexOf(':');
    if (separator < 0 || !line.trim()) continue;
    const key = line.slice(0, separator).trim();
    let value = line.slice(separator + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1);
    meta[key] = value;
  }
  if (meta.draft === 'true' || meta.example === 'true') continue;
  for (const key of ['title', 'date']) if (!meta[key]) throw new Error(`Missing ${key}: ${file}`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(meta.date) || Number.isNaN(Date.parse(meta.date)) || new Date(meta.date).toISOString().slice(0, 10) !== meta.date) throw new Error(`Invalid date: ${file}`);
  const slug = file.slice(0, -3);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error(`Use a lowercase hyphenated filename: ${file}`);
  posts.push({...meta, slug, url: `/writing/${slug}/`, html: marked.parse(match[2])});
}
posts.sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
await rm(dist, {recursive: true, force: true});
await mkdir(dist, {recursive: true});
await cp(path.join(root, 'public'), dist, {recursive: true});
const emit = async (name, content) => { const target = path.join(dist, name); await mkdir(path.dirname(target), {recursive: true}); await writeFile(target, content); };
const links = config.links.map(l => `<a href="${safeURL(l.url)}">${esc(l.label)}</a>`).join('');
function shell({title = config.name, description = config.name, route = '/', content, article = false, noindex = false}) {
  const fullTitle = title === config.name ? title : `${title} — ${config.name}`;
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="color-scheme" content="light dark"><title>${esc(fullTitle)}</title><meta name="description" content="${esc(description)}"><link rel="canonical" href="${origin}${route}">${noindex ? '<meta name="robots" content="noindex">' : ''}<meta property="og:title" content="${esc(fullTitle)}"><meta property="og:description" content="${esc(description)}"><meta property="og:type" content="${article ? 'article' : 'website'}"><meta property="og:url" content="${origin}${route}"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><link rel="stylesheet" href="/style.css"></head><body><a class="skip-link" href="#main">Skip to content</a><div class="site-wrap"><nav class="site-nav" aria-label="Main navigation"><a href="/#thoughts">My Thoughts</a><a href="/#experience">Experience</a></nav><main id="main" tabindex="-1">${content}</main></div></body></html>`;
}
await emit('index.html', shell({content: `
  <header class="profile"><h1>${esc(config.name)}</h1><p>${esc(config.profile)}</p><div class="profile-links">${links}</div></header>
  <section class="thoughts" id="thoughts" aria-labelledby="thoughts-title"><h2 id="thoughts-title">My Thoughts</h2>${posts.length ? `<ul class="post-list">${posts.map(post => `<li><a href="${post.url}">${esc(post.title)}</a><time datetime="${post.date}">${dateLabel(post.date)}</time></li>`).join('')}</ul>` : '<p class="empty-state">No posts yet.</p>'}</section>
  <section class="experience" id="experience" aria-labelledby="experience-title"><h2 id="experience-title">Experience</h2>${config.experience.map(job => `<article class="experience-row"><div class="job-heading"><h3>${esc(job.organization)}</h3><span class="period">${esc(job.period)}</span></div><p class="role">${esc(job.role)}</p><p class="job-description">${esc(job.description)}</p></article>`).join('')}</section>`}));
for (const post of posts) {
  await emit(`writing/${post.slug}/index.html`, shell({title: post.title, description: post.summary || post.title, route: post.url, article: true, content: `<article class="article"><a class="back-link" href="/#thoughts">← My Thoughts</a><header><h1>${esc(post.title)}</h1><time datetime="${post.date}">${dateLabel(post.date)}</time></header><div class="prose">${post.html}</div></article>`}));
}
for (const [route, destination, label] of [['writing', '/#thoughts', 'My Thoughts'], ['about', '/', config.name], ['experience', '/#experience', 'Experience']]) {
  await emit(`${route}/index.html`, `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta http-equiv="refresh" content="0;url=${destination}"><meta name="robots" content="noindex"><link rel="canonical" href="${origin}${destination}"><title>${esc(label)}</title></head><body><a href="${destination}">${esc(label)}</a></body></html>`);
}
await emit('404.html', shell({title: 'Page not found', route: '/404.html', noindex: true, content: '<section class="error-page"><h1>Page not found</h1><a href="/">Home</a></section>'}));
await emit('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${['/', ...posts.map(p => p.url)].map(route => `<url><loc>${origin}${route}</loc></url>`).join('')}</urlset>`);
await emit('robots.txt', `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`);
await emit('.nojekyll', '');
console.log(`Built profile, experience, and ${posts.length} authored posts. Drafts and examples excluded.`);
