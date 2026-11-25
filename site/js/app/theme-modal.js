// Archival Editions & Signal Mode Drawer (#theme-modal)
// Factory Records pressing catalog (FAC 01–05) + 3 live Pulsar signal tiers.

import { THEMES, applyThemeToDocument } from '../core/themes.js';
import { loadState, getTheme, setTheme, getFxMode, markUnseenThemesSeen } from '../core/storage.js';
import { haptic } from '../core/native.js';
import { t } from './i18n.js';
import { icon } from './icons.js';
import { escapeHtml } from './math.js';

let modalOpen = false;
let keydownListener = null;
let prevFocusEl = null;

const FX_CARDS = [
  { id: 'minimal', icon: 'circle-dot' },
  { id: 'tactile', icon: 'sparkles' },
  { id: 'webgl',   icon: 'waves' },
];

export function isThemeModalOpen() {
  return modalOpen;
}

export function closeThemeModal({ restoreFocus = true } = {}) {
  const host = document.getElementById('theme-modal-host');
  if (host) host.innerHTML = '';
  document.body.classList.remove('is-modal-open');
  modalOpen = false;
  if (keydownListener) {
    document.removeEventListener('keydown', keydownListener);
    keydownListener = null;
  }
  const trigger = document.getElementById('btn-theme-toggle');
  if (trigger) trigger.setAttribute('aria-expanded', 'false');
  if (restoreFocus && prevFocusEl && typeof prevFocusEl.focus === 'function') {
    prevFocusEl.focus();
  }
  prevFocusEl = null;
}

export function openThemeModal({ navigate, onThemeChanged, onFxChanged } = {}) {
  const host = document.getElementById('theme-modal-host');
  if (!host) return;
  prevFocusEl = document.activeElement;
  markUnseenThemesSeen();

  function render() {
    const state = loadState();
    const activeTheme = getTheme();
    const activeFx = getFxMode();
    const unlockedCount = THEMES.filter((th) => th.getProgress(state).unlocked).length;

    host.innerHTML = `
      <div class="theme-modal-backdrop" data-action="close-theme-modal"></div>
      <section
        class="theme-modal"
        id="theme-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="theme-modal-title"
      >
        <div class="theme-modal__handle" aria-hidden="true"></div>

        <header class="theme-modal__head">
          <div>
            <h2 id="theme-modal-title" class="theme-modal__title">${escapeHtml(t('themeModalTitle'))}</h2>
            <p class="theme-modal__sub text-secondary">
              <strong class="tabular-nums mono-code">${escapeHtml(t('themeUnlockedCount', { done: unlockedCount, total: THEMES.length }))}</strong>
              · ${escapeHtml(t('themeModalSubtitle'))}
            </p>
          </div>
          <button type="button" class="btn-icon" data-action="close-theme-modal" aria-label="${escapeHtml(t('themeModalCloseAria'))}">
            ${icon('x', { size: 18 })}
          </button>
        </header>

        <div class="theme-modal__body">
          <!-- 3-Tier Live Signal & Pulsar Engine Switcher -->
          <section class="fx-studio-section" aria-labelledby="fx-studio-heading">
            <div class="fx-studio-head">
              <h3 id="fx-studio-heading" class="fx-studio-title">${escapeHtml(t('fxSectionTitle'))}</h3>
              <p class="fx-studio-sub text-muted">${escapeHtml(t('fxSectionSub'))}</p>
            </div>
            <div class="fx-studio-grid" role="radiogroup" aria-label="${escapeHtml(t('fxSectionTitle'))}">
              ${FX_CARDS.map((fx) => {
                const isActive = activeFx === fx.id;
                return `
                  <button
                    type="button"
                    class="fx-mode-card ${isActive ? 'is-active' : ''}"
                    role="radio"
                    aria-checked="${isActive}"
                    data-action="select-fx"
                    data-fx-id="${fx.id}"
                  >
                    <div class="fx-mode-card__top">
                      <span class="fx-mode-card__title">
                        ${icon(fx.icon, { size: 15 })}
                        <span>${escapeHtml(t(`fxName_${fx.id}`))}</span>
                      </span>
                      <span class="fx-mode-card__badge">${escapeHtml(t(`fxTag_${fx.id}`))}</span>
                    </div>
                    <p class="fx-mode-card__desc">${escapeHtml(t(`fxDesc_${fx.id}`))}</p>
                  </button>
                `;
              }).join('')}
            </div>
          </section>

          <!-- 5 Unlockable Archival Pressing Editions (FAC 01–05) -->
          <div class="theme-grid">
            ${THEMES.map((th) => {
              const prog = th.getProgress(state);
              const isActive = activeTheme === th.id;
              const statusCls = prog.unlocked ? (isActive ? 'is-unlocked is-active' : 'is-unlocked') : 'is-locked';
              return `
                <article class="theme-card ${statusCls}">
                  <div class="theme-card__preview theme-card__preview--${th.id}" aria-hidden="true">
                    <span class="theme-card__specimen" style="font-family:${th.displayFont}">${escapeHtml(th.catNo)}</span>
                    <div class="theme-card__swatches">
                      ${(th.swatches || []).map((hex) => `<span class="theme-card__sw" style="background:${hex}"></span>`).join('')}
                    </div>
                  </div>

                  <div class="theme-card__body">
                    <div class="theme-card__head">
                      <div>
                        <h3 class="theme-card__name" style="font-family:${th.displayFont}">${escapeHtml(th.name)}</h3>
                        <p class="theme-card__sub">${escapeHtml(t(th.subtitleKey))}</p>
                      </div>
                      ${isActive
                        ? `<span class="badge badge--accent">${icon('check', { size: 12 })} ${escapeHtml(t('themeStatusActive'))}</span>`
                        : prog.unlocked
                        ? `<span class="badge badge--ok">${escapeHtml(t('themeStatusUnlocked'))}</span>`
                        : `<span class="badge badge--subtle">${icon('lock', { size: 12 })} ${escapeHtml(t('themeStatusLocked'))}</span>`}
                    </div>

                    <p class="theme-card__desc">${escapeHtml(t(th.descKey))}</p>

                    ${!prog.unlocked ? `
                      <div class="theme-card__progress">
                        <p class="theme-card__rule">${escapeHtml(t(th.ruleKey))}</p>
                        <div class="theme-card__prog-rows">
                          ${prog.items.map((it) => `
                            <div class="theme-card__prog-row tabular-nums">
                              <span>${escapeHtml(t(it.labelKey))}</span>
                              <span>${it.done} / ${it.target}</span>
                            </div>
                          `).join('')}
                        </div>
                        <div class="progress-bar" role="progressbar" aria-valuenow="${prog.pct}" aria-valuemin="0" aria-valuemax="100">
                          <div class="progress-bar__fill" style="width:${prog.pct}%"></div>
                        </div>
                      </div>
                    ` : ''}

                    ${!isActive ? `
                      <div class="theme-card__actions">
                        ${prog.unlocked ? `
                          <button
                            type="button"
                            class="btn btn--primary btn--sm"
                            data-action="apply-theme"
                            data-theme-id="${th.id}"
                          >${escapeHtml(t('themeApplyBtn'))}</button>
                        ` : `
                          <button
                            type="button"
                            class="btn btn--secondary btn--sm"
                            data-action="goto-unlock"
                            data-href="${escapeHtml(th.quickHref(state))}"
                          >
                            <span>${escapeHtml(t('themeUnlockGoBtn'))}</span>
                            ${icon('arrow-right', { size: 14 })}
                          </button>
                        `}
                      </div>
                    ` : ''}
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
        closeThemeModal();
      });
    });

    host.querySelectorAll('[data-action="select-fx"]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const nextFx = btn.dataset.fxId;
        if (!nextFx) return;
        haptic('selection');
        if (onFxChanged) onFxChanged(nextFx);
        render();
      });
    });

    host.querySelectorAll('[data-action="apply-theme"]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.themeId;
        if (!id) return;
        haptic('success');
        setTheme(id);
        applyThemeToDocument(id, { animate: true });
        if (onThemeChanged) onThemeChanged(id);
        render();
      });
    });

    host.querySelectorAll('[data-action="goto-unlock"]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const href = btn.dataset.href || '#/';
        haptic('light');
        closeThemeModal({ restoreFocus: false });
        if (navigate) navigate(href);
        else window.location.hash = href;
      });
    });
  }

  document.body.classList.add('is-modal-open');
  modalOpen = true;
  const trigger = document.getElementById('btn-theme-toggle');
  if (trigger) trigger.setAttribute('aria-expanded', 'true');
  render();

  const closeBtn = host.querySelector('#theme-modal [data-action="close-theme-modal"]');
  if (closeBtn) closeBtn.focus();

  keydownListener = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      closeThemeModal();
    }
  };
  document.addEventListener('keydown', keydownListener);
}
