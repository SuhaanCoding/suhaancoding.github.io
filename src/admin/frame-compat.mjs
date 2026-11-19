// Keep the CMS's sandbox and renderer, using srcdoc where blob navigation is
// unreliable. Ignore the iframe's initial about:blank load: mounting into that
// document would lose the React root when the real preview document arrives.
export function installPreviewFrameCompatibility() {
  const original = Object.getOwnPropertyDescriptor(HTMLIFrameElement.prototype, 'src');
  if (!original?.set || !original.configurable) return;
  Object.defineProperty(HTMLIFrameElement.prototype, 'src', {
    ...original,
    set(value) {
      if (this.classList.contains('preview') && String(value).startsWith(`blob:${location.origin}/`)) {
        const marker = 'cms-preview-ready';
        const waitForDocument = event => {
          if (!this.contentDocument?.querySelector(`meta[name="${marker}"]`)) {
            event.stopImmediatePropagation();
            return;
          }
          this.removeEventListener('load', waitForDocument, true);
        };
        this.addEventListener('load', waitForDocument, true);
        fetch(value).then(response => {
          if (!response.ok) throw new Error('Could not load the preview document.');
          return response.text();
        }).then(html => {
          if (this.isConnected) this.srcdoc = html.replace(/<head>/i, `<head><meta name="${marker}" content="true">`);
          else this.removeEventListener('load', waitForDocument, true);
        }).catch(() => {
          this.removeEventListener('load', waitForDocument, true);
          original.set.call(this,value);
        });
      } else original.set.call(this,value);
    },
  });
}
