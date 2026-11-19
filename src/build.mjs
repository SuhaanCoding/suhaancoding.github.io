import { readFile, readdir, mkdir, writeFile, cp, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { build as buildEditor } from 'vite';
import { parseNote, sortNotes, escapeHTML as esc, slugify, validateSite } from './content.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const config = JSON.parse(await readFile(path.join(root, 'site.config.json'), 'utf8'));
validateSite(config);
const origin = new URL(config.url).origin;
const labels = {notes:'Notes',experience:'Experience',empty:'No notes yet.',...config.labels};
const assetVersion = async file => createHash('sha256').update(await readFile(file)).digest('hex').slice(0,12);
const styleURL = `/style.css?v=${await assetVersion(path.join(root,'public/style.css'))}`;
const dateLabel = value => new Intl.DateTimeFormat('en-US', {month:'short',day:'numeric',year:'numeric',timeZone:'UTC'}).format(new Date(`${value}T12:00:00Z`));
const image = config.profileImage === undefined ? '/images/shark.png' : config.profileImage;
if (image && !/^\/images\/[a-zA-Z0-9_./% -]+\.(?:png|jpe?g|webp|gif|avif)$/i.test(image)) throw new Error('Choose a profile image from the image library.');
if (image?.includes('..')) throw new Error('Invalid image path.');
const imageFile = image ? path.resolve(root,'public',`.${decodeURIComponent(image)}`) : '';
if (imageFile && !imageFile.startsWith(path.join(root,'public/images')+path.sep)) throw new Error('Choose an image from the image library.');
const imageURL = image ? `${image}?v=${await assetVersion(imageFile)}` : '';
const readPosts = [];
for(const filename of (await readdir(path.join(root,'content/posts'))).filter(f=>f.endsWith('.md'))) {
  try { const post=parseNote(await readFile(path.join(root,'content/posts',filename),'utf8'),filename); if(post) readPosts.push(post); }
  catch(error) { throw new Error(`Could not render ${filename}: ${error.message}`,{cause:error}); }
}
const posts=sortNotes(readPosts);
await rm(dist,{recursive:true,force:true});
await mkdir(dist,{recursive:true});
const allowedUploads = /\.(?:png|jpe?g|webp|gif|avif|pdf)$/i;
for (const file of await readdir(path.join(root,'public/images'), {recursive:true,withFileTypes:true})) {
  if (file.isFile() && !file.name.startsWith('.') && !allowedUploads.test(file.name)) throw new Error(`Unsupported upload: ${file.name}. Use PNG, JPEG, WebP, GIF, AVIF, or PDF.`);
}
await cp(path.join(root,'public'),dist,{recursive:true});
const emit=async(name,content)=>{const file=path.join(dist,name);await mkdir(path.dirname(file),{recursive:true});await writeFile(file,content);};
// The editor preview always needs KaTeX; public pages only load it when they contain equations.
for(const file of ['katex.min.css','fonts']) {
  await mkdir(path.join(dist,'vendor/katex'),{recursive:true});
  await cp(path.join(root,'node_modules/katex/dist',file),path.join(dist,'vendor/katex',file),{recursive:true});
}
await cp(path.join(root,'node_modules/katex/LICENSE'),path.join(dist,'vendor/katex/LICENSE'));
const safeURL=value=>{const url=new URL(value);if(!['https:','http:','mailto:'].includes(url.protocol))throw new Error('Invalid link protocol');return esc(url.href);};
const links=(config.links || []).map(link=>`<a href="${safeURL(link.url)}">${esc(link.label)}</a>`).join('');
function shell({title=config.name,description=config.description || config.name,route='/',content,math=false,noindex=false,article=false}) {
  const fullTitle=title===config.name?title:`${title} — ${config.name}`;
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'none'; style-src 'self' 'unsafe-inline'; img-src 'self' https: data:; font-src 'self'; frame-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light dark"><title>${esc(fullTitle)}</title><meta name="description" content="${esc(description)}"><link rel="canonical" href="${origin}${route}">${noindex?'<meta name="robots" content="noindex">':''}<meta property="og:title" content="${esc(fullTitle)}"><meta property="og:description" content="${esc(description)}"><meta property="og:type" content="${article?'article':'website'}"><meta property="og:url" content="${origin}${route}"><link rel="icon" href="/favicon.svg">${math?'<link rel="stylesheet" href="/vendor/katex/katex.min.css">':''}<link rel="stylesheet" href="${styleURL}"></head><body><a class="skip-link" href="#main">Skip to content</a><div class="site-wrap"><nav class="site-nav" aria-label="Main navigation"><a href="/#thoughts">${esc(labels.notes)}</a><a href="/#experience">${esc(labels.experience)}</a><a href="/admin/" class="edit-link">Edit site</a></nav><main id="main" tabindex="-1">${content}</main></div></body></html>`;
}
function listing(list) {
  return `<ul class="post-list">${list.map(post=>`<li><div><a href="${post.url}">${esc(post.title)}</a>${post.pinned?'<span class="pinned-label">Pinned</span>':''}${post.tags.length?`<div class="note-tags">${post.tags.map(tag=>`<a href="/tags/${slugify(tag)}/">${esc(tag)}</a>`).join('')}</div>`:''}</div><time datetime="${post.date}">${dateLabel(post.date)}</time></li>`).join('')}</ul>`;
}
let notesHTML=`<p class="empty-state">${esc(labels.empty)}</p>`;
if(posts.length) {
  if(posts.some(post=>post.section)) {
    const sections=[...new Set(posts.map(post=>post.section))];
    notesHTML=sections.map(section=>`${section?`<h3 class="note-section"><a href="/sections/${slugify(section)}/">${esc(section)}</a></h3>`:''}${listing(posts.filter(p=>p.section===section))}`).join('');
  } else notesHTML=listing(posts);
}
await emit('index.html',shell({content:`<header class="profile"><div class="profile-info"><h1>${esc(config.name)}</h1><p>${esc(config.profile)}</p><div class="profile-links">${links}</div></div>${imageURL?`<img class="profile-image" src="${esc(imageURL)}" width="400" height="400" alt="${esc(config.profileImageAlt || '')}">`:''}</header><section class="thoughts" id="thoughts" aria-labelledby="thoughts-title"><h2 id="thoughts-title">${esc(labels.notes)}</h2>${notesHTML}</section><section class="experience" id="experience" aria-labelledby="experience-title"><h2 id="experience-title">${esc(labels.experience)}</h2>${(config.experience || []).map(job=>`<article class="experience-row"><div class="job-heading"><h3>${esc(job.organization)}</h3><span class="period">${esc(job.period)}</span></div><p class="role">${esc(job.role)}</p><p class="job-description">${esc(job.description)}</p></article>`).join('')}</section>`}));
for(const post of posts) await emit(`writing/${post.slug}/index.html`,shell({title:post.title,description:post.summary || post.title,route:post.url,math:post.html.includes('class="katex"'),article:true,content:`<article class="article"><a class="back-link" href="/#thoughts">← ${esc(labels.notes)}</a><header><h1>${esc(post.title)}</h1><time datetime="${post.date}">${dateLabel(post.date)}</time>${post.tags.length?`<div class="note-tags">${post.tags.map(tag=>`<a href="/tags/${slugify(tag)}/">${esc(tag)}</a>`).join('')}</div>`:''}</header><div class="prose">${post.html}</div></article>`}));
const taxonomyRoutes=[];
for(const [kind,names] of [['tags',[...new Set(posts.flatMap(p=>p.tags))]],['sections',[...new Set(posts.map(p=>p.section).filter(Boolean))]]]) {
  const used=new Set();
  for(const name of names) {
    const slug=slugify(name);
    if(!slug || used.has(slug)) throw new Error(`Use distinct ${kind} names with at least one English letter or number: ${name}`);
    used.add(slug);
    const route=`/${kind}/${slug}/`; taxonomyRoutes.push(route);
    await emit(`${kind}/${slug}/index.html`,shell({title:name,route,content:`<article class="article"><a class="back-link" href="/#thoughts">← ${esc(labels.notes)}</a><header><h1>${esc(name)}</h1></header>${listing(posts.filter(p=>kind==='tags'?p.tags.includes(name):p.section===name))}</article>`}));
  }
}
for(const [route,destination,label] of [['writing','/#thoughts',labels.notes],['about','/',config.name],['experience','/#experience',labels.experience]]) await emit(`${route}/index.html`,`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=${destination}"><meta name="robots" content="noindex"><title>${esc(label)}</title></head><body><a href="${destination}">${esc(label)}</a></body></html>`);
await emit('404.html',shell({title:'Page not found',route:'/404.html',noindex:true,content:'<section class="error-page"><h1>Page not found</h1><a href="/">Home</a></section>'}));
await emit('sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${['/',...posts.map(p=>p.url),...taxonomyRoutes].map(route=>`<url><loc>${origin}${route}</loc></url>`).join('')}</urlset>`);
await emit('robots.txt',`User-agent: *\nDisallow: /admin/\nSitemap: ${origin}/sitemap.xml\n`);
await emit('.nojekyll','');
await buildEditor({configFile:false,logLevel:'warn',root:path.join(root,'src/admin'),base:'/admin/',publicDir:false,define:{__STYLE_URL__:JSON.stringify(styleURL)},build:{outDir:path.join(dist,'admin'),emptyOutDir:true,target:'es2022',reportCompressedSize:false,chunkSizeWarningLimit:3500,rollupOptions:{input:{editor:path.join(root,'src/admin/index.html'),help:path.join(root,'src/admin/help.html')}}}});
await emit('admin/preview.css','.site-wrap{padding:28px!important;max-width:768px}.math-error{color:#b42318;font:14px system-ui;margin-top:20px}.profile-links span{color:var(--link)}');
if(process.env.EDITOR_TEST_SEED==='1') {
  await emit('admin/test-seed/manifest.json',JSON.stringify({files:['site.config.json']}));
  await emit('admin/test-seed/site.config.json',JSON.stringify(config));
}
console.log(`Built public site with ${posts.length} notes and the private editor.`);
