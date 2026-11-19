import test from 'node:test';
import assert from 'node:assert/strict';
import {parseNote,serializeNote,sortNotes,validateNote,validateSite,escapeHTML,slugify} from '../src/content.mjs';
import {renderMarkdown} from '../src/render.mjs';
import {editorConfig} from '../src/admin/config.mjs';

test('CMS-style YAML and Markdown survive a save/reload round trip',()=>{
  const data={title:'Math: a note',date:'2026-11-19',summary:'First line\nSecond line',tags:['AI','Linear algebra'],section:'Math',draft:false,pinned:true,order:2,body:'Inline $a_i^2$.\n\n$$\n\\frac{1}{2}\n$$'};
  const parsed=parseNote(serializeNote(data),'math-note.md');
  assert.equal(parsed.title,data.title); assert.equal(parsed.summary,data.summary); assert.deepEqual(parsed.tags,data.tags);
  assert.ok(parsed.pinned); assert.equal(parsed.section,'Math'); assert.ok(parsed.html.includes('class="katex"'));
});
test('drafts and legacy examples never enter public output, including unfinished formulas',()=>{
  assert.equal(parseNote('---\ndraft: true\n---\n$\\badcommand$','draft.md'),null);
  assert.equal(parseNote('---\nexample: true\n---\nExample','old.md'),null);
});
test('invalid public math and invalid calendar dates fail with a useful message',()=>{
  assert.throws(()=>validateNote({title:'A',date:'2026-11-19',body:'$\\badcommand$'}),/Fix the equation/);
  assert.doesNotThrow(()=>validateNote({title:'A',date:'2026-11-19',body:'$\\badcommand$',draft:true}));
  assert.throws(()=>validateNote({title:'A',date:'2026-02-30'}),/valid date/);
});
test('inline formulas, matrix blocks, escaped dollars, and source code stay distinct',()=>{
  const output=renderMarkdown('Inline $E=mc^2$ and \\$20. Code: `$x$`.\n\n$$\n\\begin{pmatrix}1 & 2 \\\\ 3 & 4\\end{pmatrix}\n$$');
  assert.ok(output.includes('application/x-tex')); assert.ok(output.includes('math-block')); assert.ok(output.includes('Literal')===false);
  assert.ok(output.includes('$20')); assert.ok(output.includes('<code>$x$</code>'));
});
test('pins and manual order override chronological ordering without mutating source',()=>{
  const a={slug:'a',date:'2026-11-19',pinned:false,order:0}, b={slug:'b',date:'2026-01-01',pinned:true,order:0}, c={slug:'c',date:'2026-11-19',pinned:true,order:2};
  assert.deepEqual(sortNotes([a,c,b]).map(p=>p.slug),['b','c','a']);
});
test('site validation rejects unsafe links; display data is escaped',()=>{
  assert.throws(()=>validateSite({name:'Suhaan',url:'https://example.com',links:[{label:'X',url:'javascript:alert(1)'}]}),/https/);
  assert.equal(escapeHTML('<script>'), '&lt;script&gt;'); assert.equal(slugify('Linear Algebra'),'linear-algebra');
});
test('production editor can write only configured content types and has no demo backend',()=>{
  const config=editorConfig(); assert.equal(config.backend.repo,'SuhaanCoding/suhaancoding.github.io'); assert.deepEqual(config.backend.auth_methods,['token']);
  assert.equal(config.collections[0].folder,'content/posts'); assert.equal(config.collections[1].files[0].file,'site.config.json');
  assert.equal(config.collections[0].fields.find(f=>f.name==='draft').default,true);
  assert.equal(editorConfig({localTest:true}).backend.name,'test-repo');
});
