import { connectThemeControl } from './theme-control.mjs';

const key = 'suhaan-site-theme';
const root = document.documentElement;
const system = matchMedia('(prefers-color-scheme: dark)');
let preference;
try { preference = localStorage.getItem(key); } catch { /* Preference is optional. */ }
if (!['light','dark'].includes(preference)) preference = null;
const apply = () => { root.dataset.theme = preference || (system.matches ? 'dark' : 'light'); };
apply();
let sync;
system.addEventListener('change', () => { if (!preference) { apply(); sync?.(); } });
addEventListener('storage', event => {
  if (event.key !== key) return;
  preference = ['light','dark'].includes(event.newValue) ? event.newValue : null;
  apply(); sync?.();
});
document.addEventListener('DOMContentLoaded', () => {
  const button = document.querySelector('[data-site-theme]');
  if (!button) return;
  sync = connectThemeControl(button, {
    getTheme: () => root.dataset.theme,
    setTheme: theme => {
      preference = theme; apply();
      try { localStorage.setItem(key, theme); } catch { /* Still works for this visit. */ }
    },
  });
}, { once:true });
