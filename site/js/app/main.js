// Ulduz — Factory Records Archival Shell, Hairline Grid Navigation, Signal Impulse & Editions Drawer.

import {
  getTheme,
  setTheme,
  getFxMode,
  setFxMode,
  getUnseenThemesCount,
  getLang,
  setLang,
  getSettings,
  getActiveMistakesCount,
  hydrateFromNativeStorage,
} from '../core/storage.js';
import { getThemeDef, applyThemeToDocument } from '../core/themes.js';
import { isNativeApp, isAndroidNative, haptic, setHapticsEnabled, installNativeBackHandler } from '../core/native.js';
import {
  checkForAppUpdate,
  getCachedUpdateResult,
  dismissUpdateVersion,
  isUpdateDismissed,
  downloadAndInstallUpdate,
} from '../core/updater.js';
import { fxEngine, facFireImpulse } from './fx-engine.js';
import { t } from './i18n.js';
import { icon } from './icons.js';
import { escapeHtml } from './math.js';
import { openThemeModal, closeThemeModal, isThemeModalOpen } from './theme-modal.js';
import { renderHomeView } from './views/home.js';
import { renderSubjectView } from './views/subject.js';
import { renderPracticeView } from './views/practice.js';
import { renderExamView } from './views/exam.js';
import { renderOriginalsView } from './views/originals.js';
import { renderMistakesView } from './views/mistakes.js';
import { renderStatsView } from './views/stats.js';
import { renderAiView } from './views/ai.js';
import { renderSettingsView } from './views/settings.js';

let currentCleanup = null;
let activeKeyHandler = null;
let activeRouteCache = 'home';
let toastTimer = null;

function parseHash() {
  const raw = window.location.hash || '#/';
  const clean = raw.startsWith('#') ? raw.slice(1) : raw;
  const [pathPart, queryPart = ''] = clean.split('?');
  const normalizedPath = pathPart.startsWith('/') ? pathPart : `/${pathPart}`;
  const segments = normalizedPath.split('/').filter(Boolean);
  const query = new URLSearchParams(queryPart);
  return { path: normalizedPath, segments, query };
}

function navigate(hashUrl) {
  if (window.location.hash === hashUrl) {
    void handleRoute(true);
  } else {
    window.location.hash = hashUrl;
  }
}

function applyThemeToDom(themeId, animate = false) {
  applyThemeToDocument(themeId, { animate });
}

function applyFxToApp(mode, { announce = false } = {}) {
  const applied = setFxMode(mode);
  fxEngine.setMode(applied);
  window.dispatchEvent(new CustomEvent('ulduz:fx-change', { detail: { mode: applied } }));
  if (applied !== 'minimal') facFireImpulse('nav');
  if (announce) {
    showToast({
      message: t('fxSwitchedToast', { name: t(`fxName_${applied}`) }),
      duration: 2400,
    });
  }
}

function applyLangToDom() {
  const lang = getLang();
  document.documentElement.lang = lang;
  document.title = t('docTitle');
  const skip = document.getElementById('skip-link');
  if (skip) skip.textContent = t('skipToContent');
}

function applyUserPrefsToDom() {
  const settings = getSettings();
  setHapticsEnabled(settings.haptics !== false);
  document.body.classList.toggle('is-hide-key-hints', settings.showKeyHints === false);
}

function renderUpdateBanner(info = getCachedUpdateResult()) {
  const host = document.getElementById('update-banner-host');
  if (!host) return;
  if (!info || !info.hasUpdate || isUpdateDismissed(info.latestVersion)) {
    host.innerHTML = '';
    return;
  }

  host.innerHTML = `
    <div class="update-banner" role="region" aria-label="${escapeHtml(t('updateAvailableTitle', { version: info.latestVersion }))}">
      <div class="update-banner__inner">
        <div class="update-banner__text">
          <span class="update-banner__tag mono-code">v${escapeHtml(info.latestVersion)}</span>
          <span>${escapeHtml(t('updateBannerText', { version: info.latestVersion }))}</span>
        </div>
        <div class="update-banner__actions">
          <button type="button" class="btn btn--primary btn--xs" data-action="banner-install-update">
            ${icon('download', { size: 13 })}
            <span>${escapeHtml(isAndroidNative() && info.apkUrl ? t('updateDownloadShortBtn') : t('updateOpenReleaseBtn'))}</span>
          </button>
          <a href="#/settings" class="btn btn--ghost btn--xs">${escapeHtml(t('navSettings'))}</a>
          <button type="button" class="btn-icon btn-icon--sm" data-action="banner-dismiss-update" aria-label="${escapeHtml(t('btnCancel'))}">
            ${icon('x', { size: 14 })}
          </button>
        </div>
      </div>
    </div>
  `;

  host.querySelector('[data-action="banner-dismiss-update"]')?.addEventListener('click', () => {
    dismissUpdateVersion(info.latestVersion);
    host.innerHTML = '';
  });

  host.querySelector('[data-action="banner-install-update"]')?.addEventListener('click', async (e) => {
    const btn = e.currentTarget;
    btn.disabled = true;
    try {
      const res = await downloadAndInstallUpdate(info, {
        onProgress(ev) {
          const span = btn.querySelector('span');
          if (span) span.textContent = `${ev.pct}%`;
        },
      });
      if (res.status === 'permission_required') {
        showToast({ message: t('updatePermissionRequired'), duration: 6000 });
      } else if (res.status === 'launched') {
        showToast({ message: t('updateInstallLaunched'), duration: 4000 });
      }
    } catch (err) {
      showToast({ message: t('updateDownloadError', { err: err?.message || err }), duration: 5000 });
    } finally {
      btn.disabled = false;
    }
  });
}

export function setFocusedExamMode(active) {
  document.body.classList.toggle('is-exam-focused', Boolean(active));
}

export function updateHeaderBadges() {
  const cnt = getActiveMistakesCount();
  const text = String(cnt);
  const hide = cnt <= 0;
  for (const id of ['header-mistakes-badge', 'mobile-mistakes-badge']) {
    const badge = document.getElementById(id);
    if (!badge) continue;
    badge.textContent = text;
    badge.hidden = hide;
  }
  const themeDot = document.getElementById('theme-unseen-dot');
  if (themeDot) {
    themeDot.hidden = getUnseenThemesCount() <= 0;
  }
}

export function showToast({ message, actionLabel = null, onAction = null, duration = 5000, tone = '' }) {
  const region = document.getElementById('toast-region');
  if (!region) return;
  if (toastTimer) {
    clearTimeout(toastTimer);
    toastTimer = null;
  }

  const toneCls = tone ? ` toast--${escapeHtml(tone)}` : '';
  region.innerHTML = `
    <div class="toast${toneCls}" role="status">
      <span class="toast__msg">${escapeHtml(message)}</span>
      ${actionLabel && onAction ? `
        <button type="button" class="toast__action" data-action="toast-undo">
          ${icon(tone === 'unlock' ? 'sparkles' : 'undo', { size: 14 })}
          <span>${escapeHtml(actionLabel)}</span>
        </button>
      ` : ''}
      <button type="button" class="toast__close" data-action="toast-close" aria-label="${escapeHtml(t('btnCancel'))}">
        ${icon('x', { size: 14 })}
      </button>
    </div>
  `;

  const clearToast = () => {
    if (toastTimer) {
      clearTimeout(toastTimer);
      toastTimer = null;
    }
    region.innerHTML = '';
  };

  region.querySelector('[data-action="toast-undo"]')?.addEventListener('click', () => {
    haptic('light');
    clearToast();
    if (onAction) onAction();
  });
  region.querySelector('[data-action="toast-close"]')?.addEventListener('click', clearToast);
  toastTimer = setTimeout(clearToast, duration);
}

function renderShellHeader(activeRouteName) {
  const headerEl = document.getElementById('app-header');
  if (!headerEl) return;
  const themeDef = getThemeDef(getTheme());
  const unseenThemes = getUnseenThemesCount();
  const lang = getLang();
  const mistakesCount = getActiveMistakesCount();

  headerEl.innerHTML = `
    <div class="fac-topbar">
      <div class="fac-topbar__left">
        <a href="#/" class="brand-link" aria-label="${escapeHtml(t('brandHomeAria'))}">
          <span class="brand-name">${escapeHtml(t('brand'))}</span>
          <span class="brand-sep hide-sm" aria-hidden="true">·</span>
          <span class="brand-sub hide-sm mono-code">${escapeHtml(t('brandSub'))}</span>
        </a>
        <div class="fac-color-strip hide-sm" aria-hidden="true">
          <span class="fac-color-strip__blk" style="background:var(--fac-steel)"></span>
          <span class="fac-color-strip__blk" style="background:var(--fac-red)"></span>
          <span class="fac-color-strip__blk" style="background:var(--fac-blue)"></span>
          <span class="fac-color-strip__blk" style="background:var(--fac-yellow)"></span>
          <span class="fac-color-strip__blk" style="background:var(--fac-green)"></span>
        </div>
      </div>

      <nav class="main-nav" aria-label="${escapeHtml(t('navAria'))}">
        <a href="#/" class="nav-link ${activeRouteName === 'home' ? 'is-active' : ''}" ${activeRouteName === 'home' ? 'aria-current="page"' : ''}>
          <span>${escapeHtml(t('navHome'))}</span>
        </a>
        <a href="#/ai" class="nav-link ${activeRouteName === 'ai' ? 'is-active' : ''}" ${activeRouteName === 'ai' ? 'aria-current="page"' : ''}>
          <span>${escapeHtml(t('navAi'))}</span>
        </a>
        <a href="#/mistakes" class="nav-link ${activeRouteName === 'mistakes' ? 'is-active' : ''}" ${activeRouteName === 'mistakes' ? 'aria-current="page"' : ''}>
          <span>${escapeHtml(t('navMistakes'))}</span>
          <span class="nav-badge tabular-nums" id="header-mistakes-badge" ${mistakesCount <= 0 ? 'hidden' : ''}>${mistakesCount}</span>
        </a>
        <a href="#/stats" class="nav-link ${activeRouteName === 'stats' ? 'is-active' : ''}" ${activeRouteName === 'stats' ? 'aria-current="page"' : ''}>
          <span>${escapeHtml(t('navStats'))}</span>
        </a>
      </nav>

      <div class="header-actions">
        <button
          type="button"
          class="fac-top-btn"
          id="btn-lang-toggle"
          title="${escapeHtml(t('langToggleTitle'))}"
          aria-label="${escapeHtml(t('langToggleAria'))}: ${lang.toUpperCase()}"
        >${lang.toUpperCase()}</button>

        <button
          type="button"
          class="fac-top-btn fac-top-btn--edition"
          id="btn-theme-toggle"
          title="${escapeHtml(t('themePickerTitle', { name: themeDef.shortLabel }))}"
          aria-label="${escapeHtml(t('themePickerAria', { name: themeDef.shortLabel }))}"
          aria-haspopup="dialog"
          aria-expanded="${isThemeModalOpen()}"
        >
          <span class="theme-trigger__name mono-code">${escapeHtml(themeDef.shortLabel)}</span>
          <span class="theme-trigger__mark" id="theme-unseen-dot" ${unseenThemes <= 0 ? 'hidden' : ''} aria-hidden="true"></span>
        </button>

        <a
          href="#/settings"
          class="fac-top-btn fac-top-btn--settings ${activeRouteName === 'settings' ? 'is-active' : ''}"
          id="btn-settings-link"
          title="${escapeHtml(t('navSettings'))}"
          aria-label="${escapeHtml(t('navSettings'))}"
          ${activeRouteName === 'settings' ? 'aria-current="page"' : ''}
        >
          ${icon('settings', { size: 17 })}
        </a>
      </div>
    </div>
  `;

  document.getElementById('btn-theme-toggle')?.addEventListener('click', () => {
    haptic('selection');
    openThemeModal({
      navigate,
      onThemeChanged() {
        renderShellHeader(activeRouteCache);
        renderMobileBottomNav(activeRouteCache);
        updateHeaderBadges();
        facFireImpulse('milestone');
      },
      onFxChanged(nextFx) {
        applyFxToApp(nextFx, { announce: false });
      },
    });
    updateHeaderBadges();
  });

  document.getElementById('btn-lang-toggle')?.addEventListener('click', () => {
    haptic('selection');
    const next = getLang() === 'ru' ? 'az' : 'ru';
    setLang(next);
    applyLangToDom();
    if (isThemeModalOpen()) closeThemeModal({ restoreFocus: false });
    void handleRoute(false);
  });
}

function renderMobileBottomNav(activeRouteName) {
  const navEl = document.getElementById('mobile-bottom-nav');
  if (!navEl) return;
  const mistakesCount = getActiveMistakesCount();
  const isCatalog =
    activeRouteName !== 'mistakes' &&
    activeRouteName !== 'stats' &&
    activeRouteName !== 'exam' &&
    activeRouteName !== 'ai' &&
    activeRouteName !== 'settings';

  navEl.setAttribute('aria-label', t('navAria'));
  navEl.innerHTML = `
    <a href="#/" class="mobile-bottom-nav__item ${isCatalog ? 'is-active' : ''}" ${activeRouteName === 'home' ? 'aria-current="page"' : ''}>
      <span class="mobile-bottom-nav__icon" aria-hidden="true">${icon('book-open', { size: 17 })}</span>
      <span class="mobile-bottom-nav__label">${escapeHtml(t('navHome'))}</span>
    </a>
    <a href="#/ai" class="mobile-bottom-nav__item ${activeRouteName === 'ai' ? 'is-active' : ''}" ${activeRouteName === 'ai' ? 'aria-current="page"' : ''}>
      <span class="mobile-bottom-nav__icon" aria-hidden="true">${icon('bot', { size: 17 })}</span>
      <span class="mobile-bottom-nav__label">${escapeHtml(t('navAiShort'))}</span>
    </a>
    <a href="#/exam/all" class="mobile-bottom-nav__item ${activeRouteName === 'exam' ? 'is-active' : ''}" ${activeRouteName === 'exam' ? 'aria-current="page"' : ''}>
      <span class="mobile-bottom-nav__icon" aria-hidden="true">${icon('clock', { size: 17 })}</span>
      <span class="mobile-bottom-nav__label">${escapeHtml(t('navExam'))}</span>
    </a>
    <a href="#/mistakes" class="mobile-bottom-nav__item ${activeRouteName === 'mistakes' ? 'is-active' : ''}" ${activeRouteName === 'mistakes' ? 'aria-current="page"' : ''}>
      <span class="mobile-bottom-nav__icon" aria-hidden="true">
        ${icon('alert-circle', { size: 17 })}
        <span class="mobile-nav-badge tabular-nums" id="mobile-mistakes-badge" ${mistakesCount <= 0 ? 'hidden' : ''}>${mistakesCount}</span>
      </span>
      <span class="mobile-bottom-nav__label">${escapeHtml(t('navMistakes'))}</span>
    </a>
    <a href="#/stats" class="mobile-bottom-nav__item ${activeRouteName === 'stats' ? 'is-active' : ''}" ${activeRouteName === 'stats' ? 'aria-current="page"' : ''}>
      <span class="mobile-bottom-nav__icon" aria-hidden="true">${icon('bar-chart', { size: 17 })}</span>
      <span class="mobile-bottom-nav__label">${escapeHtml(t('navStatsShort'))}</span>
    </a>
  `;

  navEl.querySelectorAll('.mobile-bottom-nav__item').forEach((link) => {
    link.addEventListener('click', () => haptic('selection'));
  });
}

function renderShellFooter() {
  const footerEl = document.getElementById('app-footer');
  if (!footerEl) return;
  footerEl.innerHTML = `
    <div class="footer-inner">
      <span class="footer-brand-note mono-code">
        <span>${escapeHtml(t('footerNote'))}</span>
      </span>
      <span class="footer-keys hide-sm">
        <span>${escapeHtml(t('footerKeysLabel'))}</span>
        <kbd class="kbd">1–5</kbd>
        <span>${escapeHtml(t('footerKeySelect'))}</span>
        <span aria-hidden="true">·</span>
        <kbd class="kbd">Enter</kbd>
        <span>${escapeHtml(t('footerKeySubmit'))}</span>
        <span aria-hidden="true">·</span>
        <kbd class="kbd">F</kbd>
        <span>${escapeHtml(t('footerKeyFlag'))}</span>
      </span>
    </div>
  `;
}

function setKeyHandler(fn) {
  activeKeyHandler = typeof fn === 'function' ? fn : null;
}

document.addEventListener('keydown', (e) => {
  if (isThemeModalOpen()) return;
  if (activeKeyHandler) activeKeyHandler(e);
});

let routeGeneration = 0;

async function handleRoute(shouldScrollTop = true) {
  const gen = ++routeGeneration;
  const { segments, query } = parseHash();

  if (currentCleanup) {
    try { currentCleanup(); } catch { /* ignore */ }
    currentCleanup = null;
  }
  setKeyHandler(null);
  setFocusedExamMode(false);

  const mainEl = document.getElementById('app-main');
  if (!mainEl) return;

  const first = segments[0] || '';
  const second = segments[1] || '';

  let activeNav = 'home';
  if (first === 'mistakes') activeNav = 'mistakes';
  else if (first === 'stats') activeNav = 'stats';
  else if (first === 'exam') activeNav = 'exam';
  else if (first === 'ai') activeNav = 'ai';
  else if (first === 'settings') activeNav = 'settings';
  else if (first) activeNav = first;
  activeRouteCache = activeNav;

  renderShellHeader(activeNav);
  renderMobileBottomNav(activeNav);
  renderShellFooter();
  renderUpdateBanner();

  mainEl.innerHTML = `<div class="page-container"><div class="loading-box mono-code">${escapeHtml(t('loading'))}</div></div>`;

  const ctx = {
    params: { id: second },
    query,
    navigate,
    setKeyHandler,
    setFocusedExamMode,
    updateHeaderBadges,
    showToast,
    setFxMode: (mode) => applyFxToApp(mode, { announce: false }),
    onShellRefresh: () => {
      applyLangToDom();
      applyUserPrefsToDom();
      renderShellHeader(activeRouteCache);
      renderMobileBottomNav(activeRouteCache);
      renderShellFooter();
      renderUpdateBanner();
      updateHeaderBadges();
    },
    setCleanup: (fn) => { currentCleanup = fn; },
  };

  try {
    if (!first) {
      await renderHomeView(mainEl, ctx);
    } else if (first === 'subject' && second) {
      await renderSubjectView(mainEl, ctx);
    } else if (first === 'practice' && second) {
      await renderPracticeView(mainEl, ctx);
    } else if (first === 'exam' && second) {
      await renderExamView(mainEl, ctx);
    } else if (first === 'originals' && second) {
      await renderOriginalsView(mainEl, ctx);
    } else if (first === 'mistakes') {
      await renderMistakesView(mainEl, ctx);
    } else if (first === 'stats') {
      await renderStatsView(mainEl, ctx);
    } else if (first === 'ai') {
      await renderAiView(mainEl, ctx);
    } else if (first === 'settings') {
      await renderSettingsView(mainEl, ctx);
    } else {
      await renderHomeView(mainEl, ctx);
    }

    if (gen !== routeGeneration) return;
    if (shouldScrollTop) window.scrollTo({ top: 0, behavior: 'instant' });
    updateHeaderBadges();

    mainEl.classList.remove('is-route-entering');
    void mainEl.offsetWidth;
    mainEl.classList.add('is-route-entering');
  } catch (err) {
    if (gen !== routeGeneration) return;
    console.error('Route render failed:', err);
    mainEl.innerHTML = `
      <div class="page-container">
        <div class="empty-card">
          <h2>${escapeHtml(t('routeErrorTitle'))}</h2>
          <p class="text-secondary">${escapeHtml(err?.message || String(err))}</p>
          <a href="#/" class="btn btn--primary">${escapeHtml(t('backToHome'))}</a>
        </div>
      </div>
    `;
  }
}

window.addEventListener('ulduz:state-change', () => {
  updateHeaderBadges();
});

window.addEventListener('ulduz:mistakes-change', () => {
  updateHeaderBadges();
});

window.addEventListener('ulduz:theme-unlocked', (e) => {
  const ids = e.detail?.themeIds || [];
  updateHeaderBadges();
  if (!ids.length) return;
  const firstDef = getThemeDef(ids[0]);
  if (!firstDef) return;
  haptic('success');
  facFireImpulse('unlock');
  showToast({
    message: t('themeUnlockedToast', { name: firstDef.name }),
    actionLabel: t('themeApplyBtn'),
    tone: 'unlock',
    duration: 7000,
    onAction: () => {
      setTheme(firstDef.id);
      applyThemeToDom(firstDef.id, true);
      renderShellHeader(activeRouteCache);
      renderMobileBottomNav(activeRouteCache);
      updateHeaderBadges();
      facFireImpulse('milestone');
    },
  });
});

window.addEventListener('ulduz:update-available', (e) => {
  renderUpdateBanner(e.detail);
});

window.addEventListener('hashchange', () => {
  void handleRoute(true);
});

async function boot() {
  if (isNativeApp()) {
    document.documentElement.classList.add('is-native-app');
  }
  await hydrateFromNativeStorage();
  applyThemeToDom(getTheme(), false);
  applyLangToDom();
  applyUserPrefsToDom();
  fxEngine.init(getFxMode());
  installNativeBackHandler({ navigate, parseHash });

  if (!isNativeApp() && 'serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === '127.0.0.1' || location.hostname === 'localhost')) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }

  void handleRoute(false);

  // Silent background auto-update check (only runs when enabled & throttled every 6h)
  setTimeout(() => {
    void checkForAppUpdate({ force: false, silent: true });
  }, 2200);
}

void boot();
