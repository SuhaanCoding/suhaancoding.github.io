// Establish an initial appearance, while preserving explicit user preferences.
try {
  const prefs = JSON.parse(localStorage.getItem('sveltia-cms.prefs') || '{}');
  if (!prefs.theme) localStorage.setItem('sveltia-cms.prefs', JSON.stringify({...prefs, theme:'light'}));
} catch { /* CMS reports unavailable browser storage. */ }
