// Accessible Theme Gallery Modal / Mobile Bottom-Sheet (#theme-modal).
// Displays all 5 unlockable themes with live miniature theme swatches, progress bars & 1-tap apply.

import { THEMES, getThemeDef } from '../core/themes.js';
import { loadState, getTheme, setTheme, markUnseenThemesSeen } from '../core/storage.js';
import { haptic } from '../core/native.js';
import { t } from './i18n.js';
import { icon } from './icons.js';
import { escapeHtml } from './math.js';

let modalOpen = false;
let modalCallbacks = { navigate: null, onThemeChanged: null };

export function isThemeModalOpen() {
  return modalOpen;
}

export function closeThemeModal({ restoreFocus = true } = {}) {
  const host = document.getElementById('theme-modal-host');
  modalOpen = false;
  document.body.classList.remove('is-modal-open');
  if (host) host.innerHTML = '';
  if (restoreFocus) {
    document.getElementById('btn-theme-toggle')?.focus();
  }
}

function renderMiniPreviewSwatch(theme) {
  // Miniature authentic preview of each theme's backdrop, display font & distinct button layout
  const sunAccent = theme.id === 'voshod'
    ? '<span class="theme-swatch__sun" aria-hidden="true"></span><span class="theme-swatch__clouds" aria-hidden="true"></span>'
    : theme.id === 'master'
    ? '<span class="theme-swatch__beam" aria-hidden="true"></span>'
    : '';

  const btnBar = theme.id === 'intel'
    ? '<span class="theme-swatch__btn theme-swatch__btn--p"></span><span class="theme-swatch__btn theme-swatch__btn--s"></span>'
    : theme.id === 'nvidia'
    ? '<span class="theme-swatch__btn theme-swatch__btn--s"></span><span class="theme-swatch__btn theme-swatch__btn--p"></span>'
    : theme.id === 'amd'
    ? '<span class="theme-swatch__btn theme-swatch__btn--p"></span><span class="theme-swatch__btn theme-swatch__btn--s"></span>'
    : theme.id === 'master'
    ? '<span class="theme-swatch__btn theme-swatch__btn--p"></span>'
    : '<span class="theme-swatch__btn theme-swatch__btn--s"></span><span class="theme-swatch__btn theme-swatch__btn--p"></span>';

  return `
    <div class="theme-swatch theme-swatch--${escapeHtml(theme.id)}" aria-hidden="true">
      ${sunAccent}
      <div class="theme-swatch__inner">
        <span class="theme-swatch__word" style="font-family:${theme.displayFont}">${escapeHtml(theme.shortLabel)}</span>
        <div class="theme-swatch__bars theme-swatch__bars--${escapeHtml(theme.id)}">
          ${btnBar}
        </div>
      </div>
    </div>
  `;
}

function renderModalContent() {
  const host = document.getElementById('theme-modal-host');
  if (!host) return;

  const state = loadState();
  const activeId = getTheme();
  const unlockedTotal = THEMES.filter((th) => th.getProgress(state).unlocked).length;

  host.innerHTML = `
    <div class="theme-modal-backdrop" data-action="close-theme-modal"></div>
    <section
      id="theme-modal"
      class="theme-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="theme-modal-title"
    >
      <div class="theme-modal__handle" aria-hidden="true"></div>
      <header class="theme-modal__head">
        <div>
          <h2 id="theme-modal-title" class="theme-modal__title">${escapeHtml(t('themeModalTitle'))}</h2>
          <p class="theme-modal__sub text-secondary">
            ${escapeHtml(t('themeUnlockedCount', { done: unlockedTotal, total: THEMES.length }))} · ${escapeHtml(t('themeModalSubtitle'))}
          </p>
        </div>
        <button
          type="button"
          class="btn-icon theme-modal__close"
          data-action="close-theme-modal"
          aria-label="${escapeHtml(t('themeModalCloseAria'))}"
        >${icon('x', { size: 18 })}</button>
      </header>

      <div class="theme-modal__body">
        <div class="theme-cards-grid">
          ${THEMES.map((theme) => {
            const prog = theme.getProgress(state);
            const isUnlocked = prog.unlocked;
            const isActive = activeId === theme.id;
            const quickHref = typeof theme.quickHref === 'function' ? theme.quickHref(state) : '#/';

            const progressHtml = !isUnlocked && prog.items.length > 0
              ? `
                <div class="theme-card__progress">
                  <div class="theme-card__progress-row tabular-nums">
                    ${prog.items.map((it) => `<span>${escapeHtml(t(it.labelKey))}: <b>${it.done} / ${it.target}</b></span>`).join('<span class="meta-sep" aria-hidden="true">·</span>')}
                  </div>
                  <div class="progress-bar" role="progressbar" aria-valuenow="${prog.pct}" aria-valuemin="0" aria-valuemax="100">
                    <div class="progress-bar__fill" style="width:${prog.pct}%"></div>
                  </div>
                </div>
              `
              : '';

            return `
              <article class="theme-card theme-card--${escapeHtml(theme.id)} ${isActive ? 'is-active' : ''} ${isUnlocked ? 'is-unlocked' : 'is-locked'}">
                ${renderMiniPreviewSwatch(theme)}
                <div class="theme-card__content">
                  <div class="theme-card__top">
                    <div class="theme-card__titles">
                      <h3 class="theme-card__name" style="font-family:${theme.displayFont}">
                        ${theme.id === 'master' ? `${icon('crown', { size: 15 })} ` : ''}${escapeHtml(theme.name)}
                      </h3>
                      <span class="theme-card__sub text-muted">${escapeHtml(t(theme.subtitleKey))}</span>
                    </div>
                    <span class="badge ${isActive ? 'badge--grade-correct' : isUnlocked ? 'badge--subtle' : 'badge--gold'}">
                      ${isActive
                        ? `${icon('check', { size: 12 })} ${escapeHtml(t('themeStatusActive'))}`
                        : isUnlocked
                        ? `${icon('unlock', { size: 12 })} ${escapeHtml(t('themeStatusUnlocked'))}`
                        : `${icon('lock', { size: 12 })} ${escapeHtml(t('themeStatusLocked'))}`}
                    </span>
                  </div>

                  <p class="theme-card__desc text-secondary">${escapeHtml(t(theme.descKey))}</p>

                  ${!isUnlocked ? `
                    <div class="theme-card__rule">
                      <span class="theme-card__rule-text">${escapeHtml(t(theme.ruleKey))}</span>
                      ${progressHtml}
                    </div>
                  ` : ''}

                  <div class="theme-card__foot">
                    ${isUnlocked ? `
                      <button
                        type="button"
                        class="btn ${isActive ? 'btn--secondary' : 'btn--primary'} btn--sm theme-card__apply"
                        data-action="apply-theme"
                        data-theme-id="${escapeHtml(theme.id)}"
                        ${isActive ? 'aria-pressed="true"' : 'aria-pressed="false"'}
                      >
                        ${isActive ? `${icon('check', { size: 15 })} <span>${escapeHtml(t('themeStatusActive'))}</span>` : `<span>${escapeHtml(t('themeApplyBtn'))}</span>`}
                      </button>
                    ` : `
                      <a
                        href="${escapeHtml(quickHref)}"
                        class="btn btn--secondary btn--sm theme-card__go"
                        data-action="goto-unlock"
                        data-href="${escapeHtml(quickHref)}"
                      >
                        <span>${escapeHtml(t('themeUnlockGoBtn'))}</span>
                        ${icon('arrow-right', { size: 14 })}
                      </a>
                    `}
                  </div>
                </div>
              </article>
            `;
          }).join('')}
        </div>
      </div>
    </section>
  `;

  host.querySelectorAll('[data-action="close-theme-modal"]').forEach((el) => {
    el.addEventListener('click', () => {
      haptic('light');
      closeThemeModal({ restoreFocus: true });
    });
  });

  host.querySelectorAll('[data-action="apply-theme"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.themeId;
      if (!targetId) return;
      haptic('medium');
      setTheme(targetId, { animate: true });
      if (modalCallbacks.onThemeChanged) modalCallbacks.onThemeChanged(getThemeDef(targetId));
      renderModalContent();
      host.querySelector(`[data-action="apply-theme"][data-theme-id="${targetId}"]`)?.focus({ preventScroll: true });
    });
  });

  host.querySelectorAll('[data-action="goto-unlock"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const href = link.dataset.href || '#/';
      haptic('selection');
      closeThemeModal({ restoreFocus: false });
      if (modalCallbacks.navigate) modalCallbacks.navigate(href);
      else window.location.hash = href;
    });
  });
}

export function openThemeModal({ navigate = null, onThemeChanged = null } = {}) {
  modalCallbacks = { navigate, onThemeChanged };
  markUnseenThemesSeen();
  modalOpen = true;
  document.body.classList.add('is-modal-open');
  renderModalContent();
  const host = document.getElementById('theme-modal-host');
  host?.querySelector('[data-action="close-theme-modal"]')?.focus({ preventScroll: true });
}
