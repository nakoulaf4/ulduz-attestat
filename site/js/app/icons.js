// Unified inline-SVG icon system (1.75px stroke, currentColor, rounded caps/joins)
// + Ulduz 8-Ray Mastery Star SVG component.

const PATHS = {
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
  moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
  'arrow-right': '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  'arrow-left': '<path d="M19 12H5"/><path d="m12 19-7-7 7-7"/>',
  'arrow-up': '<path d="M12 19V5"/><path d="m5 12 7-7 7 7"/>',
  'arrow-down': '<path d="M12 5v14"/><path d="m19 12-7 7-7-7"/>',
  'chevron-down': '<path d="m6 9 6 6 6-6"/>',
  'chevron-up': '<path d="m18 15-6-6-6 6"/>',
  'chevron-right': '<path d="m9 18 6-6-6-6"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  'check-circle': '<circle cx="12" cy="12" r="9"/><path d="m9 12 2 2 4-4"/>',
  x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  minus: '<path d="M5 12h14"/>',
  partial: '<circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 0 0 18Z" fill="currentColor" stroke="none"/>',
  bookmark: '<path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z"/>',
  'bookmark-filled': '<path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z" fill="currentColor"/>',
  flag: '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" x2="4" y1="22" y2="15"/>',
  'flag-filled': '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" fill="currentColor"/><line x1="4" x2="4" y1="22" y2="15"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  pause: '<rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/>',
  play: '<polygon points="6 4 20 12 6 20 6 4" fill="currentColor" stroke="currentColor" stroke-width="1.5"/>',
  'book-open': '<path d="M2 5.5A2.5 2.5 0 0 1 4.5 3H12v17H4.5A2.5 2.5 0 0 1 2 17.5z"/><path d="M22 5.5A2.5 2.5 0 0 0 19.5 3H12v17h7.5a2.5 2.5 0 0 0 2.5-2.5z"/>',
  'help-circle': '<circle cx="12" cy="12" r="9"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><circle cx="12" cy="17" r="0.6" fill="currentColor"/>',
  'file-text': '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/>',
  layers: '<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 12 12 17 22 12"/><polyline points="2 17 12 22 22 17"/>',
  sparkles: '<path d="M12 3 13.9 8.6 19.5 10.5 13.9 12.4 12 18 10.1 12.4 4.5 10.5 10.1 8.6 12 3Z"/>',
  lightbulb: '<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/>',
  'clipboard-list': '<rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M9 12h6"/><path d="M9 16h6"/>',
  refresh: '<path d="M3 12a9 9 0 0 1 15.36-6.36L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15.36 6.36L3 16"/><path d="M8 16H3v5"/>',
  trash: '<path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
  undo: '<path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>',
  upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
  sliders: '<line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="18" y2="18"/><circle cx="9" cy="6" r="2" fill="var(--bg-surface)"/><circle cx="15" cy="12" r="2" fill="var(--bg-surface)"/><circle cx="10" cy="18" r="2" fill="var(--bg-surface)"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>',
  volume: '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M18.8 5.2a9.5 9.5 0 0 1 0 13.6"/>',
  'stop-square': '<rect x="6" y="6" width="12" height="12" rx="1.5" fill="currentColor"/>',
  'alert-circle': '<circle cx="12" cy="12" r="9"/><line x1="12" x2="12" y1="8" y2="12"/><circle cx="12" cy="16" r="0.6" fill="currentColor"/>',
  strikethrough: '<path d="M16 4H9a3 3 0 0 0-2.83 4"/><path d="M14 12a4 4 0 0 1 0 8H6"/><line x1="4" x2="20" y1="12" y2="12"/>',
  'checkbox-off': '<rect x="4" y="4" width="16" height="16" rx="3"/>',
  'checkbox-on': '<rect x="4" y="4" width="16" height="16" rx="3" fill="currentColor"/><path d="m8.5 12 2.5 2.5 4.5-5" stroke="var(--on-primary)" stroke-width="2"/>',
  'list-checks': '<path d="m3 7 2 2 4-4"/><path d="m3 17 2 2 4-4"/><path d="M13 6h8"/><path d="M13 12h8"/><path d="M13 18h8"/>',
  'bar-chart': '<line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/>',
  palette: '<circle cx="13.5" cy="6.5" r="0.7" fill="currentColor"/><circle cx="17.5" cy="10.5" r="0.7" fill="currentColor"/><circle cx="8.5" cy="7.5" r="0.7" fill="currentColor"/><circle cx="6.5" cy="12.5" r="0.7" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2Z"/>',
  lock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  unlock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/>',
  crown: '<path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7z"/><path d="M5 20h14"/>',
  'link-anchor': '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
};

/**
 * Render an inline SVG icon in the unified Ulduz stroke style.
 * @param {keyof typeof PATHS} name
 * @param {{ size?: number, className?: string }} [opts]
 */
export function icon(name, { size = 16, className = '' } = {}) {
  const inner = PATHS[name] ?? '';
  const cls = className ? `ico ${className}` : 'ico';
  return `<svg class="${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;
}

/**
 * Render the Ulduz 8-Ray Mastery Star SVG.
 * Illuminates rays 1..litRays in warm Ulduz Gold as the student builds focus sprints.
 * @param {number} litRays  0..8
 * @param {{ size?: number, className?: string, label?: string }} [opts]
 */
export function ulduzStarSvg(litRays = 0, { size = 22, className = '', label = '' } = {}) {
  const lit = Math.max(0, Math.min(8, Math.floor(Number(litRays) || 0)));
  const isComplete = lit >= 8;
  const rays = [];
  for (let i = 0; i < 8; i++) {
    const angle = i * 45;
    const isLit = i < lit;
    // Bold geometric 8-point ray blade readable down to 16px
    rays.push(
      `<polygon class="ulduz-star__ray ${isLit ? 'is-lit' : ''}" data-ray="${i + 1}" points="16,1.4 19.6,10.6 16,13.6 12.4,10.6" transform="rotate(${angle} 16 16)" />`
    );
  }
  const aria = label
    ? `role="img" aria-label="${label}"`
    : 'aria-hidden="true"';
  return `<svg class="ulduz-star ${isComplete ? 'is-complete' : ''} ${className}" width="${size}" height="${size}" viewBox="0 0 32 32" ${aria}>
    ${rays.join('')}
    <circle class="ulduz-star__core ${isComplete ? 'is-lit' : ''}" cx="16" cy="16" r="3.6" />
  </svg>`;
}

/**
 * Crisp filled 8-pointed Rub el Hizb brand emblem legible at 16px (for footer/brand marks).
 */
export function ulduzBrandStarSvg({ size = 16, className = '' } = {}) {
  return `<svg class="ulduz-brand-star ${className}" width="${size}" height="${size}" viewBox="0 0 32 32" aria-hidden="true">
    <path class="ulduz-brand-star__outer" d="M16 1.5L19.9 7.1L26.2 5.8L24.9 12.1L30.5 16L24.9 19.9L26.2 26.2L19.9 24.9L16 30.5L12.1 24.9L5.8 26.2L7.1 19.9L1.5 16L7.1 12.1L5.8 5.8L12.1 7.1L16 1.5Z"/>
    <circle class="ulduz-brand-star__core" cx="16" cy="16" r="3.4"/>
  </svg>`;
}
