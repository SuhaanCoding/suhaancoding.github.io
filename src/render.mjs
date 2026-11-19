import { Marked } from 'marked';
import markedKatex from 'marked-katex-extension';
import katex from 'katex';

export function makeRenderer(strict = true) {
  const math = markedKatex({ throwOnError: strict, trust: false, output: 'htmlAndMathml' });
  for (const extension of math.extensions) {
    const original = extension.renderer;
    extension.renderer = token => token.displayMode
      ? `<span class="math-block" role="region" aria-label="Equation" tabindex="0">${original(token)}</span>`
      : original(token);
  }
  return new Marked(math);
}
const strictRenderer = makeRenderer(true);
const previewRenderer = makeRenderer(false);
export const renderMarkdown = (source, strict = true) => (strict ? strictRenderer : previewRenderer).parse(source || '');
export const renderEquation = (source = '', displayMode = true) => katex.renderToString(source, { displayMode, throwOnError: false, trust: false, output: 'htmlAndMathml' });
