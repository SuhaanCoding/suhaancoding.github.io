import { connectThemeControl } from '../theme-control.mjs';
import { getEditorTheme, setEditorTheme } from './cms-preferences.mjs';

export function installEditorAppearance() {
  const root = document.documentElement;
  const button = document.querySelector('[data-editor-theme]');
  const currentTheme = () => {
    const pref = getEditorTheme();
    return ['dark','light'].includes(pref) ? pref : root.dataset.theme || 'light';
  };
  const sync = connectThemeControl(button, {getTheme:currentTheme,setTheme:setEditorTheme});
  const syncFrames = () => {
    sync();
    for (const frame of document.querySelectorAll('iframe.preview')) {
      const doc = frame.contentDocument;
      if (doc) doc.documentElement.dataset.theme = currentTheme();
    }
  };
  new MutationObserver(syncFrames).observe(root,{attributes:true,attributeFilter:['data-theme']});
  document.addEventListener('load', event => {
    if (event.target instanceof HTMLIFrameElement && event.target.classList.contains('preview')) syncFrames();
  },true);
  // Hide the vendor's promotional infobar; keep save/auth/network notices intact.
  const removePromos = () => {
    for (const bar of document.querySelectorAll('.infobar')) {
      if (bar.textContent.includes('Sveltia CMS')) bar.classList.add('vendor-promo');
    }
  };
  new MutationObserver(removePromos).observe(document.body,{subtree:true,childList:true});
  removePromos(); syncFrames();
}
