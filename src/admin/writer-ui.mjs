/** A presentation adapter only; Sveltia retains all field, save and validation behavior. */
export function installWriterUI() {
  let pending = false;
  function update() {
    pending = false;
    for (const body of document.querySelectorAll('section.field[data-key-path="body"]')) {
      const parent = body.parentElement;
      if (!parent?.querySelector(':scope > section.field[data-key-path="title"]')) continue;
      parent.classList.add('note-canvas');
      const title = parent.querySelector('[data-key-path="title"] input');
      if (title) title.placeholder = 'Untitled';
      const settings = [...parent.querySelectorAll(':scope > section.field')].filter(field => !['title','body'].includes(field.dataset.keyPath));
      let toggle = parent.querySelector(':scope > .note-settings-toggle');
      if (!toggle) {
        toggle = document.createElement('button');
        toggle.type = 'button'; toggle.className = 'note-settings-toggle';
        toggle.textContent = 'Note settings'; toggle.setAttribute('aria-expanded','false');
        settings[0]?.before(toggle);
        toggle.addEventListener('click', () => {
          toggle.setAttribute('aria-expanded',String(toggle.getAttribute('aria-expanded') !== 'true'));
          update();
        });
      }
      const invalid = settings.some(field => field.querySelector('[aria-invalid="true"]'));
      if (invalid) toggle.setAttribute('aria-expanded','true');
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      settings.forEach((field,index) => {
        field.classList.add('note-setting');
        field.id ||= `note-setting-${index}`;
        field.hidden = !expanded;
      });
      toggle.setAttribute('aria-controls',settings.map(field=>field.id).join(' '));
    }
  }
  new MutationObserver(() => {
    if (!pending) { pending = true; requestAnimationFrame(update); }
  }).observe(document.body,{childList:true,subtree:true});
  update();
}
