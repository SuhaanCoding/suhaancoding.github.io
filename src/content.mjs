import { parse, stringify } from 'yaml';
import { renderMarkdown } from './render.mjs';

export const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const slugify = text => String(text).normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
export function validateNote(data) {
  if (!data.title?.trim()) throw new Error('Enter a note title.');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data.date) || Number.isNaN(Date.parse(data.date)) || new Date(data.date).toISOString().slice(0,10) !== data.date) throw new Error('Choose a valid date.');
  if (data.order != null && (!Number.isFinite(Number(data.order)) || Number(data.order) < 0)) throw new Error('Order must be a positive number or zero.');
  if (data.draft !== true) {
    try { renderMarkdown(data.body || ''); }
    catch (error) { throw new Error(`Fix the equation before publishing: ${error.rawMessage || 'Check the LaTeX syntax in the preview.'}`); }
  }
}
export function parseNote(source, filename) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)([\s\S]*)$/);
  if (!match) throw new Error(`Missing front matter: ${filename}`);
  const meta = parse(match[1], { maxAliasCount: 0 });
  if (!meta || typeof meta !== 'object' || Array.isArray(meta)) throw new Error(`Invalid front matter: ${filename}`);
  if (meta.draft === true || meta.draft === 'true' || meta.example === true || meta.example === 'true') return null;
  const data = { ...meta, title: String(meta.title || ''), date: String(meta.date || ''), body: match[2] };
  validateNote(data);
  const slug = filename.replace(/\.md$/, '');
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error(`Use a lowercase hyphenated filename: ${filename}`);
  const tags = (Array.isArray(meta.tags) ? meta.tags : String(meta.tags || '').split(',')).map(t => String(t).trim()).filter(Boolean);
  return { ...data, tags: [...new Set(tags)], section: String(meta.section || '').trim(), pinned: meta.pinned === true, order: Number(meta.order || 0), slug, url: `/writing/${slug}/`, html: renderMarkdown(data.body) };
}
export function serializeNote(data) {
  const { body = '', ...meta } = data;
  return `---\n${stringify(meta).trimEnd()}\n---\n\n${body}\n`;
}
export const sortNotes = posts => [...posts].sort((a,b) => Number(b.pinned)-Number(a.pinned) || a.order-b.order || b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
export function validateSite(config) {
  if (!String(config.name || '').trim()) throw new Error('Enter your name.');
  const siteURL = new URL(config.url);
  if (siteURL.protocol !== 'https:') throw new Error('Website URL must start with https://.');
  for (const link of config.links || []) {
    const url = new URL(link.url);
    if (!['https:','http:','mailto:'].includes(url.protocol)) throw new Error('Use an https://, http://, or mailto: link.');
    if (!link.label?.trim()) throw new Error('Give each link a label.');
  }
  for (const role of config.experience || []) if (!role.organization?.trim() || !role.role?.trim()) throw new Error('Give each experience an organization and role.');
}
