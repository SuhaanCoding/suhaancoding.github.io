// Use srcdoc for the CMS-generated preview document. Some embedded browsers block
// blob: frame navigation. This adapter only handles the CMS's own sandboxed frames;
// the same generated HTML, sandbox, load listener, and React renderer are retained.
export function installPreviewFrameCompatibility() {
  const original = Object.getOwnPropertyDescriptor(HTMLIFrameElement.prototype, 'src');
  if (!original?.set || !original.configurable) return;
  Object.defineProperty(HTMLIFrameElement.prototype, 'src', {
    ...original,
    set(value) {
      if (this.classList.contains('preview') && String(value).startsWith(`blob:${location.origin}/`)) {
        fetch(value).then(response => response.text()).then(html => {
          if (this.isConnected) this.srcdoc = html;
        }).catch(() => original.set.call(this,value));
      } else original.set.call(this,value);
    },
  });
}
