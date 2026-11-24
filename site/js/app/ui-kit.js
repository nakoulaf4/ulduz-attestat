// Ulduz — Obsidian Atelier Reusable UI Template Kit
// Provides composable HTML builders and kinetic micro-animation utilities so any
// new screen or feature added to Ulduz automatically matches the Obsidian Atelier style.

import { escapeHtml } from './math.js';

/**
 * Render an Obsidian Atelier breadcrumb trail.
 * @param {Array<{ label: string, href?: string }>} items
 * @param {string} ariaLabel
 */
export function oaBreadcrumbs(items, ariaLabel = 'Навигация') {
  return `
    <nav class="breadcrumbs" aria-label="${escapeHtml(ariaLabel)}">
      ${items
        .map((item, idx) => {
          const sep = idx > 0 ? '<span aria-hidden="true">/</span>' : '';
          if (item.href && idx < items.length - 1) {
            return `${sep}<a href="${escapeHtml(item.href)}">${escapeHtml(item.label)}</a>`;
          }
          return `${sep}<span aria-current="page">${escapeHtml(item.label)}</span>`;
        })
        .join('')}
    </nav>
  `;
}

/**
 * Render a luminous monochrome progress filament bar.
 * @param {number} pct 0..100
 * @param {{ tone?: ''|'correct'|'partial'|'wrong', ariaLabel?: string }} [opts]
 */
export function oaProgressFilament(pct, { tone = '', ariaLabel = '' } = {}) {
  const clamped = Math.max(0, Math.min(100, Math.round(Number(pct) || 0)));
  const toneCls = tone ? ` progress-bar--${escapeHtml(tone)}` : '';
  const aria = ariaLabel ? ` aria-label="${escapeHtml(ariaLabel)}"` : '';
  return `
    <div class="progress-bar${toneCls}" role="progressbar" aria-valuenow="${clamped}" aria-valuemin="0" aria-valuemax="100"${aria}>
      <div class="progress-bar__fill" style="width:${clamped}%"></div>
    </div>
  `;
}

/**
 * Dispatch a reactive monochrome FX pulse into the active Canvas/WebGL engine.
 * Safe no-op in `minimal` mode or `prefers-reduced-motion`.
 * @param {'correct'|'wrong'|'milestone'|'unlock'|'nav'} kind
 * @param {{ x?: number, y?: number, intensity?: number }} [opts]
 */
export function oaFireFxPulse(kind, { x = null, y = null, intensity = 1 } = {}) {
  if (typeof window === 'undefined' || typeof CustomEvent !== 'function') return;
  window.dispatchEvent(
    new CustomEvent('ulduz:fx-pulse', {
      detail: { kind, x, y, intensity },
    })
  );
}

/**
 * Animate a numeric readout smoothly with exponential deceleration (odometer count-up).
 * Respects `prefers-reduced-motion: reduce` by landing immediately on target.
 * @param {HTMLElement | null} el
 * @param {number} targetVal
 * @param {{ duration?: number, decimals?: number, suffix?: string }} [opts]
 */
export function oaAnimateCounter(el, targetVal, { duration = 560, decimals = 0, suffix = '' } = {}) {
  if (!el) return;
  const end = Number(targetVal);
  if (!Number.isFinite(end)) return;

  const fmt = (n) => (decimals > 0 ? n.toFixed(decimals).replace(/\.0$/, '') : String(Math.round(n))) + suffix;
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  if (reduced || duration <= 0 || end === 0) {
    el.textContent = fmt(end);
    return;
  }

  const startTime = performance.now();
  function tick(now) {
    const t = Math.min(1, (now - startTime) / duration);
    const eased = 1 - Math.pow(1 - t, 3.4);
    el.textContent = fmt(end * eased);
    if (t < 1) {
      requestAnimationFrame(tick);
    } else {
      el.textContent = fmt(end);
    }
  }
  requestAnimationFrame(tick);
}

const DECODE_GLYPHS = '◇◈○●□■╱╲─│+×·';

/**
 * Subtle monochrome light-slit character resolve for display headings (WebGL / mode transitions).
 * Never leaves text garbled — always resolves cleanly to exact original UTF-8 text.
 * @param {HTMLElement | null} el
 * @param {{ duration?: number }} [opts]
 */
export function oaKineticDecode(el, { duration = 260 } = {}) {
  if (!el) return;
  const fx = document.documentElement.getAttribute('data-fx');
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  if (reduced || fx !== 'webgl') return;

  const original = el.dataset.oaOriginalText || el.textContent || '';
  if (!original || original.length > 64) return;
  el.dataset.oaOriginalText = original;

  const chars = [...original];
  const start = performance.now();
  let rafId = 0;

  function step(now) {
    const p = Math.min(1, (now - start) / duration);
    const revealedCount = Math.floor(p * chars.length);
    let out = '';
    for (let i = 0; i < chars.length; i++) {
      if (i < revealedCount || /\s/.test(chars[i])) {
        out += chars[i];
      } else if (i < revealedCount + 3) {
        out += DECODE_GLYPHS[(i + Math.floor(now / 36)) % DECODE_GLYPHS.length];
      } else {
        out += chars[i];
      }
    }
    el.textContent = out;
    if (p < 1) {
      rafId = requestAnimationFrame(step);
    } else {
      el.textContent = original;
    }
  }

  if (el._oaDecodeRaf) cancelAnimationFrame(el._oaDecodeRaf);
  rafId = requestAnimationFrame(step);
  el._oaDecodeRaf = rafId;
}
