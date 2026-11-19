// Shared accessible control for the public site and the editor.
export function connectThemeControl(button, { getTheme, setTheme }) {
  button.innerHTML = '<svg class="theme-sun" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/></svg><svg class="theme-moon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20.9 13.1A9 9 0 0 1 10.9 3.1 9 9 0 1 0 20.9 13.1Z"/></svg>';
  const sync = () => {
    const dark = getTheme() === 'dark';
    const label = `Switch to ${dark ? 'light' : 'dark'} mode`;
    button.setAttribute('aria-label', label);
    button.title = label;
    button.dataset.theme = dark ? 'dark' : 'light';
    button.hidden = false;
    button.disabled = false;
  };
  button.addEventListener('click', () => {
    setTheme(getTheme() === 'dark' ? 'light' : 'dark');
    sync();
  });
  sync();
  return sync;
}
