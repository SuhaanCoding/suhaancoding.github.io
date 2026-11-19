import './defaults.mjs';
import CMS from '@sveltia/cms';
import DOMPurify from 'dompurify';
import { editorConfig } from './config.mjs';
import { renderMarkdown, renderEquation } from '../render.mjs';
import { validateNote, validateSite } from '../content.mjs';
import 'katex/dist/katex.min.css';
import './editor.css';
import { installPreviewFrameCompatibility } from './frame-compat.mjs';
installPreviewFrameCompatibility();
import { installWriterUI } from './writer-ui.mjs';
installWriterUI();

const localTest = ['localhost','127.0.0.1'].includes(location.hostname) && new URLSearchParams(location.search).has('test');
if (localTest) {
  const seed = document.createElement('link');
  seed.rel = 'cms-seed-url'; seed.href = '/admin/test-seed/manifest.json'; document.head.append(seed);
}
const { createElement: h } = CMS.React;
const clean = html => DOMPurify.sanitize(html, { ADD_ATTR: ['tabindex','role','aria-label'] });

CMS.registerEditorComponent({
  id:'equation',label:'Equation',icon:'function',
  fields:[{name:'latex',label:'Equation (LaTeX)',widget:'text',hint:'Fractions: \\frac{a}{b} · sums: \\sum_{i=1}^n x_i · matrices: \\begin{pmatrix}a & b \\\\ c & d\\end{pmatrix}'}],
  pattern:/^\$\$\n(?<latex>[\s\S]*?)\n\$\$$/m,
  toBlock:({latex=''}) => `$$\n${latex}\n$$`,
  toPreview:({latex=''}) => clean(renderEquation(latex,true)),
});
CMS.registerEditorComponent({
  id:'inline-equation',label:'Inline equation',icon:'function',mode:'dialog',
  fields:[{name:'latex',label:'Equation (LaTeX)',widget:'string'}],
  pattern:/\$(?<latex>[^$\n]+)\$/,
  toBlock:({latex=''})=>`$${latex}$`,
  toPreview:({latex=''})=>clean(renderEquation(latex,false)),
});

function NotePreview({entry,getAsset}) {
  const data=entry.get('data').toJS();
  let html=clean(renderMarkdown(data.body || '',false));
  const template=document.createElement('template');
  template.innerHTML=html;
  for(const img of template.content.querySelectorAll('img')) {
    const asset=getAsset(img.getAttribute('src'));
    if(asset) img.src=asset.url;
  }
  html=template.innerHTML;
  const invalid=html.includes('katex-error');
  return h('div',{className:'site-wrap'},
    h('article',{className:'article'},
      h('header',{},h('h1',{},data.title || ''),h('time',{},String(data.date || '').slice(0,10))),
      invalid && h('p',{role:'alert',className:'math-error'},'An equation has a syntax error. Fix the highlighted formula before saving.'),
      h('div',{className:'prose',dangerouslySetInnerHTML:{__html:html}}),
    ));
}
function SitePreview({entry,getAsset}) {
  const d=entry.get('data').toJS();
  const picture=d.profileImage && (getAsset(d.profileImage)?.url || d.profileImage);
  return h('div',{className:'site-wrap'},
    h('header',{className:'profile'},h('div',{className:'profile-info'},h('h1',{},d.name || ''),h('p',{},d.profile || ''),h('div',{className:'profile-links'},...(d.links || []).map((l,i)=>h('span',{key:i},l.label)))),picture && h('img',{className:'profile-image',src:picture,alt:d.profileImageAlt || ''})),
    h('section',{className:'thoughts'},h('h2',{},d.labels?.notes || 'Notes')),
    h('section',{},h('h2',{},d.labels?.experience || 'Experience'),...(d.experience || []).map((r,i)=>h('article',{key:i,className:'experience-row'},h('div',{className:'job-heading'},h('h3',{},r.organization),h('span',{className:'period'},r.period)),h('p',{className:'role'},r.role),h('p',{className:'job-description'},r.description)))));
}
CMS.registerPreviewTemplate('notes',NotePreview);
CMS.registerPreviewTemplate('site',SitePreview);
CMS.registerPreviewStyle(__STYLE_URL__);
CMS.registerPreviewStyle('/admin/preview.css');
CMS.registerPreviewStyle('/vendor/katex/katex.min.css');
CMS.registerEventListener({name:'preSave',handler:({entry})=>{
  const data=entry.get('data').toJS();
  if(entry.get('collection')==='notes') validateNote({...data,date:String(data.date || '').slice(0,10)});
  else validateSite(data);
}});
CMS.init({config:editorConfig({localTest})});
document.querySelector('#editor-loading')?.remove();
