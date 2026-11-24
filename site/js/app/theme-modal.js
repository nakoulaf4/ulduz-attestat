// Accessible Obsidian Atelier Studio Drawer / Mobile Bottom-Sheet (#theme-modal).
// Houses TWO live interactive controls:
//   1. 3-Way Interactive FX Engine Switcher (Minimal / Tactile 60 FPS / Ultra WebGL)
//   2. 5 Unlockable Pure Monochrome Modes (Obsidian, Prism [i], Pulse [n], Monolith [a], Eclipse · Мастер)
// Includes proper initial focus, keyboard Tab focus trap, and body scroll lock.

import { THEMES, getThemeDef } from '../core/themes.js';
import { loadState, getTheme, setTheme, getFxMode, markUnseenThemesSeen } from '../core/storage.js';
import { haptic } from '../core/native.js';
import { t } from './i18n.js';
import { icon } from './icons.js';
import { escapeHtml } from './math.js';

let modalOpen = false;
let modalCallbacks = { navigate: null, onThemeChanged: null, onFxChanged: null };
let trapKeyHandler = null;

const FX_MODES_META = [
  { id: 'minimal', iconName: 'circle-dot' },
  { id: 'tactile', iconName: 'sparkles' },
  { id: 'webgl', iconName: 'waves' },
];

const SWATCH_SPECIMEN = {
  atelier:  'Аа · Əə · 01',
  prism:    'XY · 2px · [i]',
  pulse:    'V2 · CUT · [n]',
  monolith: 'SLAB · [a]',
  eclipse:  '100% · ★',
};

export function isThemeModalOpen() {
  return modalOpen;
}

function uninstallFocusTrap() {
  if (trapKeyHandler) {
    document.removeEventListener('keydown', trapKeyHandler);
    trapKeyHandler = null;
  }
}

function installFocusTrap(modalEl) {
  uninstallFocusTrap();
  if (!modalEl) return;
  trapKeyHandler = (e) => {
    if (e.key !== 'Tab' || !modalOpen) return;
    const focusables = [...modalEl.querySelectorAll(
      'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )].filter((el) => el.offsetParent !== null);
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first || !modalEl.contains(document.activeElement)) {
        e.preventDefault();
        last.focus();
      }
    } else if (document.activeElement === last || !modalEl.contains(document.activeElement)) {
      e.preventDefault();
      first.focus();
    }
  };
  document.addEventListener('keydown', trapKeyHandler);
}

export function closeThemeModal({ restoreFocus = true } = {}) {
  const host = document.getElementById('theme-modal-host');
  modalOpen = false;
  uninstallFocusTrap();
  document.body.classList.remove('is-modal-open');
  if (host) host.innerHTML = '';
  if (restoreFocus) {
    document.getElementById('btn-theme-toggle')?.focus();
  }
}

function renderMiniPreviewSwatch(theme) {
  const accent = theme.id === 'eclipse'
    ? '<span class="theme-swatch__beam" aria-hidden="true"></span>'
    : theme.id === 'prism'
    ? '<span class="theme-swatch__crosshair" aria-hidden="true"></span>'
    : theme.id === 'monolith'
    ? '<span class="theme-swatch__brackets" aria-hidden="true"></span>'
    : theme.id === 'atelier'
    ? '<span class="theme-swatch__orbit" aria-hidden="true"></span>'
    : '';

  const btnBar = theme.id === 'prism'
    ? '<span class="theme-swatch__btn theme-swatch__btn--p"></span><span class="theme-swatch__btn theme-swatch__btn--s"></span>'
    : theme.id === 'pulse'
    ? '<span class="theme-swatch__btn theme-swatch__btn--s"></span><span class="theme-swatch__btn theme-swatch__btn--p"></span>'
    : theme.id === 'monolith'
    ? '<span class="theme-swatch__btn theme-swatch__btn--p"></span><span class="theme-swatch__btn theme-swatch__btn--s"></span>'
    : theme.id === 'eclipse'
    ? '<span class="theme-swatch__btn theme-swatch__btn--p"></span>'
    : '<span class="theme-swatch__btn theme-swatch__btn--p"></span><span class="theme-swatch__btn theme-swatch__btn--s"></span>';

  const specimen = SWATCH_SPECIMEN[theme.id] || theme.shortLabel;

  return `
    <div class="theme-swatch theme-swatch--${escapeHtml(theme.id)}" aria-hidden="true">
      ${accent}
      <div class="theme-swatch__inner">
        <span class="theme-swatch__word" style="font-family:${theme.displayFont}">${escapeHtml(specimen)}</span>
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
  const activeFx = getFxMode();
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
        <!-- Live 3-Tier Interactive Animation & FX Engine Selector -->
        <div class="fx-studio-section">
          <div class="fx-studio-section__head">
            <h3 class="fx-studio-section__title">${escapeHtml(t('fxSectionTitle'))}</h3>
            <p class="fx-studio-section__sub text-secondary">${escapeHtml(t('fxSectionSub'))}</p>
          </div>
          <div class="fx-mode-grid" role="radiogroup" aria-label="${escapeHtml(t('fxSectionTitle'))}">
            ${FX_MODES_META.map(({ id, iconName }) => {
              const selected = activeFx === id;
              return `
                <button
                  type="button"
                  role="radio"
                  aria-checked="${selected}"
                  class="fx-mode-card ${selected ? 'is-active' : ''}"
                  data-action="select-fx"
                  data-fx-id="${id}"
                  data-ripple
                >
                  <div class="fx-mode-card__top">
                    <span class="fx-mode-card__icon" aria-hidden="true">${icon(iconName, { size: 16 })}</span>
                    <strong class="fx-mode-card__name">${escapeHtml(t(`fxName_${id}`))}</strong>
                    <span class="fx-mode-card__tag mono-code">${escapeHtml(t(`fxTag_${id}`))}</span>
                  </div>
                  <p class="fx-mode-card__desc">${escapeHtml(t(`fxDesc_${id}`))}</p>
                </button>
              `;
            }).join('')}
          </div>
          <p class="fx-studio-mobile-desc text-secondary" aria-live="polite">
            ${escapeHtml(t(`fxDesc_${activeFx}`))}
          </p>
        </div>

        <!-- 5 Unlockable Pure Monochrome Modes -->
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
                        ${theme.id === 'eclipse' ? `${icon('crown', { size: 14 })} ` : ''}${escapeHtml(theme.name)}
                      </h3>
                      <span class="theme-card__sub text-muted">${escapeHtml(t(theme.subtitleKey))}</span>
                    </div>
                    <span class="badge ${isActive ? 'badge--grade-correct' : isUnlocked ? 'badge--subtle' : 'badge--warn'}">
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
                        class="btn ${isActive ? 'btn--ghost theme-card__apply--active' : 'btn--primary'} btn--sm theme-card__apply"
                        data-action="apply-theme"
                        data-theme-id="${escapeHtml(theme.id)}"
                        aria-pressed="${isActive}"
                      >
                        ${isActive ? `${icon('check', { size: 14 })} <span>${escapeHtml(t('themeStatusActive'))}</span>` : `<span>${escapeHtml(t('themeApplyBtn'))}</span>`}
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

  installFocusTrap(host.querySelector('#theme-modal'));

  host.querySelectorAll('[data-action="close-theme-modal"]').forEach((el) => {
    el.addEventListener('click', () => {
      haptic('light');
      closeThemeModal({ restoreFocus: true });
    });
  });

  host.querySelectorAll('[data-action="select-fx"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const fxId = btn.dataset.fxId;
      if (!fxId) return;
      haptic('selection');
      if (modalCallbacks.onFxChanged) modalCallbacks.onFxChanged(fxId);
      renderModalContent();
      host.querySelector(`[data-action="select-fx"][data-fx-id="${fxId}"]`)?.focus({ preventScroll: true });
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

export function openThemeModal({ navigate = null, onThemeChanged = null, onFxChanged = null } = {}) {
  modalCallbacks = { navigate, onThemeChanged, onFxChanged };
  markUnseenThemesSeen();
  modalOpen = true;
  document.body.classList.add('is-modal-open');
  renderModalContent();
  const host = document.getElementById('theme-modal-host');
  host?.querySelector('.theme-modal__close')?.focus({ preventScroll: true });
}
