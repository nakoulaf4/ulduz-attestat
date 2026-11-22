// Rich HTML + KaTeX math rendering & SVG/image helpers.

export function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Convert HTML + basic LaTeX math into clean Unicode plain text (for <select> options, etc.).
 */
export function plainReadableText(str) {
  if (!str) return '';
  let s = String(str).replace(/<[^>]*>/g, ' ');
  s = s.replace(/\$\$?/g, '');
  s = s
    .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1)/($2)')
    .replace(/\\sqrt\{([^}]+)\}/g, '√($1)')
    .replace(/\\parallel/g, '∥')
    .replace(/\\perp/g, '⊥')
    .replace(/\\angle/g, '∠')
    .replace(/\\triangle/g, '△')
    .replace(/\^\\circ|\\circ/g, '°')
    .replace(/\\cdot/g, '·')
    .replace(/\\times/g, '×')
    .replace(/\\le\b/g, '≤')
    .replace(/\\ge\b/g, '≥')
    .replace(/\\neq\b/g, '≠')
    .replace(/\\approx/g, '≈')
    .replace(/\\infty/g, '∞')
    .replace(/\\pi\b/g, 'π')
    .replace(/\\alpha/g, 'α')
    .replace(/\\beta/g, 'β')
    .replace(/\\gamma/g, 'γ')
    .replace(/\\varphi|\\phi/g, 'φ')
    .replace(/\\in\b/g, '∈')
    .replace(/\\subset/g, '⊂')
    .replace(/\\cup/g, '∪')
    .replace(/\\cap/g, '∩')
    .replace(/\\setminus/g, '\\')
    .replace(/\\text\{([^}]+)\}/g, '$1')
    .replace(/\\(sin|cos|tg|ctg|tan|cot|log|lg|ln)\b/g, '$1')
    .replace(/[{}]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return s;
}

/**
 * Build an HTML-safe, KaTeX-safe preview snippet from a task stem (keeps inline $...$ intact).
 */
export function safePreviewHtml(html, maxLen = 140) {
  const plain = String(html ?? '')
    .replace(/<(?:br|\/p|\/div|\/li|\/tr)\b[^>]*>/gi, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (plain.length <= maxLen) return escapeHtml(plain);
  let cut = plain.slice(0, maxLen);
  // Don't cut in the middle of a $...$ or $$...$$ delimiter
  const dollarCount = (cut.replace(/\\\$/g, '').match(/\$/g) || []).length;
  if (dollarCount % 2 === 1) {
    const closeIdx = plain.indexOf('$', maxLen);
    if (closeIdx !== -1 && closeIdx - maxLen < 40) {
      cut = plain.slice(0, closeIdx + 1);
    } else {
      const lastDollar = cut.lastIndexOf('$');
      if (lastDollar > 10) cut = cut.slice(0, lastDollar).trim();
    }
  }
  return `${escapeHtml(cut)}…`;
}

/**
 * Prepare rich HTML string from contract (replace ___ blanks outside $...$, strip forbidden attributes).
 */
export function prepareRichHtml(html) {
  if (!html) return '';
  let s = String(html);
  // Strip any accidental script/on* attributes
  s = s.replace(/<script[\s\S]*?<\/script>/gi, '');
  s = s.replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '');

  // Replace 3+ underscores with visual blank pill outside $...$ blocks
  const parts = s.split(/(\$\$[\s\S]*?\$\$|\$(?:\\.|[^$\\])*\$)/g);
  for (let i = 0; i < parts.length; i += 2) {
    parts[i] = parts[i].replace(/_{3,}/g, '<span class="gap" aria-label="пропуск"></span>');
  }
  return parts.join('');
}

/**
 * Hydrate all KaTeX expressions inside a DOM element.
 */
export function hydrateMath(rootEl) {
  if (!rootEl) return;
  if (typeof window.renderMathInElement === 'function') {
    try {
      window.renderMathInElement(rootEl, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '$', right: '$', display: false },
          { left: '\\(', right: '\\)', display: false },
          { left: '\\[', right: '\\]', display: true },
        ],
        throwOnError: false,
        strict: false,
        trust: false,
      });
    } catch (err) {
      console.warn('[ulduz] KaTeX render warning:', err);
    }
  }
}

/**
 * Render HTML + KaTeX into a target element.
 */
export function setRichHtml(el, html) {
  if (!el) return;
  el.innerHTML = prepareRichHtml(html);
  hydrateMath(el);
}

/**
 * Render a TaskImage ({ src, svg, alt, caption, width }) as an HTML string.
 */
export function renderTaskImageHtml(image) {
  if (!image) return '';
  const maxW = image.width ? `style="max-width:${Number(image.width)}px"` : '';
  const alt = escapeHtml(image.alt || 'Иллюстрация к заданию');
  const caption = image.caption
    ? `<figcaption class="task-figure__caption">${prepareRichHtml(image.caption)}</figcaption>`
    : '';

  if (image.svg) {
    return `<figure class="task-figure" role="img" aria-label="${alt}" ${maxW}>
      <div class="task-figure__svg">${image.svg}</div>
      ${caption}
    </figure>`;
  }
  if (image.src) {
    const src = escapeHtml(image.src);
    return `<figure class="task-figure" ${maxW}>
      <img class="task-figure__img" src="${src}" alt="${alt}" loading="lazy" />
      ${caption}
    </figure>`;
  }
  return '';
}
