// Establish an initial appearance, while preserving explicit user preferences.
try {
  const prefs = JSON.parse(localStorage.getItem('sveltia-cms.prefs') || '{}');
  if (!prefs.theme) { prefs.theme = 'light'; localStorage.setItem('sveltia-cms.prefs', JSON.stringify(prefs)); }
  document.documentElement.dataset.theme = prefs.theme === 'auto' ? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : prefs.theme;
  document.documentElement.dataset.autoTheming = String(prefs.theme === 'auto');
} catch { /* CMS reports unavailable browser storage. */ }
