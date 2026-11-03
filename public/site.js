const themeButton = document.querySelector('.theme-button');
const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
const getTheme = () => document.documentElement.dataset.theme || (systemTheme.matches ? 'dark' : 'light');
function syncThemeLabel() {
  const dark = getTheme() === 'dark';
  themeButton?.setAttribute('aria-label', `Switch to ${dark ? 'light' : 'dark'} theme`);
}
if (themeButton) {
  themeButton.hidden = false;
  syncThemeLabel();
  themeButton.addEventListener('click', () => {
    const next = getTheme() === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem('site-theme', next); } catch { /* Theme remains usable without storage. */ }
    syncThemeLabel();
  });
  systemTheme.addEventListener('change', syncThemeLabel);
}
const search = document.querySelector('#writing-search');
if (search) {
  const tools = document.querySelector('[data-archive-tools]');
  const clear = document.querySelector('[data-clear-search]');
  const reset = document.querySelector('[data-reset-filters]');
  const filters = [...document.querySelectorAll('[data-filter]')];
  const rows = [...document.querySelectorAll('[data-post]')];
  const count = document.querySelector('[data-result-count]');
  const empty = document.querySelector('[data-no-results]');
  let type = 'All';
  tools.hidden = false;
  reset.hidden = false;
  function apply(updateURL = true) {
    const query = search.value.trim().toLowerCase();
    let visible = 0;
    for (const row of rows) {
      row.hidden = !((type === 'All' || row.dataset.type === type) && (!query || row.dataset.search.includes(query)));
      if (!row.hidden) visible++;
    }
    filters.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === type)));
    clear.hidden = search.value.length === 0;
    empty.hidden = visible !== 0;
    count.textContent = `${visible} ${visible === 1 ? 'piece' : 'pieces'}${type !== 'All' || query ? ` of ${rows.length}` : ''}`;
    if (updateURL) {
      const url = new URL(location.href);
      if (query) url.searchParams.set('q', search.value.trim()); else url.searchParams.delete('q');
      if (type !== 'All') url.searchParams.set('type', type); else url.searchParams.delete('type');
      history.replaceState(null, '', url);
    }
  }
  function restore() {
    const params = new URLSearchParams(location.search);
    search.value = params.get('q') || '';
    const candidate = params.get('type');
    type = filters.some(b => b.dataset.filter === candidate) ? candidate : 'All';
    apply(false);
  }
  search.addEventListener('input', event => { if (!event.isComposing) apply(); });
  search.addEventListener('compositionend', () => apply());
  clear.addEventListener('click', () => { search.value = ''; apply(); search.focus(); });
  filters.forEach(button => button.addEventListener('click', () => { type = button.dataset.filter; apply(); }));
  reset.addEventListener('click', () => { type = 'All'; search.value = ''; apply(); search.focus(); });
  window.addEventListener('popstate', restore);
  restore();
}
const copyButton = document.querySelector('[data-copy-link]');
if (copyButton && navigator.clipboard?.writeText) {
  copyButton.hidden = false;
  let copyTimer;
  copyButton.addEventListener('click', async () => {
    const status = document.querySelector('[data-copy-status]');
    clearTimeout(copyTimer);
    try { await navigator.clipboard.writeText(location.href); status.textContent = 'Link copied.'; }
    catch { status.textContent = 'Copy the address from your browser to share this page.'; }
    copyTimer = setTimeout(() => { status.textContent = ''; }, 5000);
  });
}
