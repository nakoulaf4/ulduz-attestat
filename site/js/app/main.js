// Ulduz — Main Application Shell, Hash Router, Mobile Tab Bar, 5-Theme Gallery & Native Bridge.

import {
  getTheme,
  setTheme,
  getUnseenThemesCount,
  getLang,
  setLang,
  getActiveMistakesCount,
  hydrateFromNativeStorage,
} from '../core/storage.js';
import { getThemeDef, applyThemeToDocument } from '../core/themes.js';
import { isNativeApp, haptic, installNativeBackHandler } from '../core/native.js';
import { t } from './i18n.js';
import { icon, ulduzBrandStarSvg } from './icons.js';
import { escapeHtml } from './math.js';
import { openThemeModal, closeThemeModal, isThemeModalOpen } from './theme-modal.js';
import { renderHomeView } from './views/home.js';
import { renderSubjectView } from './views/subject.js';
import { renderPracticeView } from './views/practice.js';
import { renderExamView } from './views/exam.js';
import { renderOriginalsView } from './views/originals.js';
import { renderMistakesView } from './views/mistakes.js';
import { renderStatsView } from './views/stats.js';

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
    handleRoute();
  } else {
    window.location.hash = hashUrl;
  }
}

function applyThemeToDom(themeId, animate = false) {
  applyThemeToDocument(themeId, { animate });
}

function applyLangToDom() {
  const lang = getLang();
  document.documentElement.lang = lang;
  document.title = t('docTitle');
  const skip = document.getElementById('skip-link');
  if (skip) skip.textContent = t('skipToContent');
}

/**
 * Toggle Focused Exam Mode on the app shell (hides global nav/footer & mobile tab bar so Exam owns focus).
 */
export function setFocusedExamMode(active) {
  document.body.classList.toggle('is-exam-focused', Boolean(active));
}

/**
 * Refresh live mistakes counter badges (desktop + mobile) and newly-unlocked theme indicator dot.
 */
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

/**
 * Show a calm bottom toast with an optional action button (Undo / Apply Theme).
 */
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
    <div class="header-inner">
      <a href="#/" class="brand-link" aria-label="${escapeHtml(t('brandHomeAria'))}">
        <img src="./assets/favicon.svg" alt="" class="brand-logo" width="28" height="28" />
        <div class="brand-text">
          <span class="brand-name">${escapeHtml(t('brand'))}</span>
          <span class="brand-sub hide-sm">${escapeHtml(t('brandSub'))}</span>
        </div>
      </a>

      <nav class="main-nav" aria-label="${escapeHtml(t('navAria'))}">
        <a href="#/" class="nav-link ${activeRouteName === 'home' ? 'is-active' : ''}" ${activeRouteName === 'home' ? 'aria-current="page"' : ''}>${escapeHtml(t('navHome'))}</a>
        <a href="#/mistakes" class="nav-link ${activeRouteName === 'mistakes' ? 'is-active' : ''}" ${activeRouteName === 'mistakes' ? 'aria-current="page"' : ''}>
          <span>${escapeHtml(t('navMistakes'))}</span>
          <span class="nav-badge tabular-nums" id="header-mistakes-badge" ${mistakesCount <= 0 ? 'hidden' : ''}>${mistakesCount}</span>
        </a>
        <a href="#/stats" class="nav-link ${activeRouteName === 'stats' ? 'is-active' : ''}" ${activeRouteName === 'stats' ? 'aria-current="page"' : ''}>${escapeHtml(t('navStats'))}</a>
      </nav>

      <div class="header-actions">
        <button
          type="button"
          class="btn-icon-pill"
          id="btn-lang-toggle"
          title="${escapeHtml(t('langToggleTitle'))}"
          aria-label="${escapeHtml(t('langToggleAria'))}: ${lang.toUpperCase()}"
        >${lang.toUpperCase()}</button>

        <button
          type="button"
          class="btn-icon-pill theme-trigger"
          id="btn-theme-toggle"
          title="${escapeHtml(t('themePickerTitle', { name: themeDef.shortLabel }))}"
          aria-label="${escapeHtml(t('themePickerAria', { name: themeDef.shortLabel }))}"
          aria-haspopup="dialog"
          aria-expanded="${isThemeModalOpen()}"
        >
          ${icon('palette', { size: 16 })}
          <span class="theme-trigger__name">${escapeHtml(themeDef.shortLabel)}</span>
          <span class="theme-trigger__dot" id="theme-unseen-dot" ${unseenThemes <= 0 ? 'hidden' : ''} aria-hidden="true"></span>
        </button>
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
    handleRoute(false);
  });
}

function renderMobileBottomNav(activeRouteName) {
  const navEl = document.getElementById('mobile-bottom-nav');
  if (!navEl) return;
  const mistakesCount = getActiveMistakesCount();
  const isSubjectsTab = activeRouteName !== 'mistakes' && activeRouteName !== 'stats';

  navEl.setAttribute('aria-label', t('navAria'));
  navEl.innerHTML = `
    <a href="#/" class="mobile-bottom-nav__item ${isSubjectsTab ? 'is-active' : ''}" ${activeRouteName === 'home' ? 'aria-current="page"' : ''}>
      <span class="mobile-bottom-nav__pill" aria-hidden="true">
        ${icon('book-open', { size: 20 })}
      </span>
      <span class="mobile-bottom-nav__label">${escapeHtml(t('navHome'))}</span>
    </a>

    <a href="#/mistakes" class="mobile-bottom-nav__item ${activeRouteName === 'mistakes' ? 'is-active' : ''}" ${activeRouteName === 'mistakes' ? 'aria-current="page"' : ''}>
      <span class="mobile-bottom-nav__pill" aria-hidden="true">
        ${icon('alert-circle', { size: 20 })}
        <span class="mobile-nav-badge tabular-nums" id="mobile-mistakes-badge" ${mistakesCount <= 0 ? 'hidden' : ''}>${mistakesCount}</span>
      </span>
      <span class="mobile-bottom-nav__label">${escapeHtml(t('navMistakes'))}</span>
    </a>

    <a href="#/stats" class="mobile-bottom-nav__item ${activeRouteName === 'stats' ? 'is-active' : ''}" ${activeRouteName === 'stats' ? 'aria-current="page"' : ''}>
      <span class="mobile-bottom-nav__pill" aria-hidden="true">
        ${icon('bar-chart', { size: 20 })}
      </span>
      <span class="mobile-bottom-nav__label">${escapeHtml(t('navStats'))}</span>
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
      <span class="footer-brand-note">${ulduzBrandStarSvg({ size: 16 })} <span>${escapeHtml(t('footerNote'))}</span></span>
      <span class="footer-keys hide-sm">${escapeHtml(t('footerKeysLabel'))} <kbd>1–5</kbd> ${escapeHtml(t('footerKeySelect'))} · <kbd>Enter</kbd> ${escapeHtml(t('footerKeySubmit'))} · <kbd>F</kbd> ${escapeHtml(t('footerKeyFlag'))}</span>
    </div>
  `;
}

async function handleRoute(resetScroll = true) {
  if (isThemeModalOpen()) closeThemeModal({ restoreFocus: false });
  if (resetScroll) window.scrollTo(0, 0);
  if (currentCleanup) {
    try { currentCleanup(); } catch { /* ignore */ }
    currentCleanup = null;
  }
  activeKeyHandler = null;
  setFocusedExamMode(false);
  applyLangToDom();

  const mainEl = document.getElementById('app-main');
  if (!mainEl) return;

  const { segments, query } = parseHash();
  const rootSeg = segments[0] || '';
  const paramId = segments[1] || '';

  const ctx = {
    params: { id: paramId },
    query,
    navigate,
    showToast,
    setFocusedExamMode,
    updateHeaderBadges,
    setKeyHandler(fn) {
      activeKeyHandler = fn;
    },
    setCleanup(fn) {
      currentCleanup = fn;
    },
  };

  let routeName = 'home';
  if (rootSeg === 'subject' && paramId) routeName = 'subject';
  else if (rootSeg === 'practice' && paramId) routeName = 'practice';
  else if (rootSeg === 'exam' && paramId) routeName = 'exam';
  else if (rootSeg === 'originals' && paramId) routeName = 'originals';
  else if (rootSeg === 'mistakes') routeName = 'mistakes';
  else if (rootSeg === 'stats') routeName = 'stats';

  activeRouteCache = routeName;
  renderShellHeader(routeName);
  renderMobileBottomNav(routeName);
  renderShellFooter();

  // Only show loading placeholder for routes that may dynamically import subject chunks
  if (routeName !== 'home' && routeName !== 'stats' && routeName !== 'mistakes') {
    mainEl.innerHTML = `<div class="page-container"><div class="loading-card">${escapeHtml(t('loading'))}</div></div>`;
  }

  try {
    switch (routeName) {
      case 'subject':
        await renderSubjectView(mainEl, ctx);
        break;
      case 'practice':
        await renderPracticeView(mainEl, ctx);
        break;
      case 'exam':
        await renderExamView(mainEl, ctx);
        break;
      case 'originals':
        await renderOriginalsView(mainEl, ctx);
        break;
      case 'mistakes':
        await renderMistakesView(mainEl, ctx);
        break;
      case 'stats':
        await renderStatsView(mainEl, ctx);
        break;
      default:
        await renderHomeView(mainEl, ctx);
        break;
    }
  } catch (err) {
    console.error('[ulduz] route error:', err);
    mainEl.innerHTML = `
      <div class="page-container">
        <div class="empty-card">
          <h2>${escapeHtml(t('routeErrorTitle'))}</h2>
          <p class="text-secondary">${escapeHtml(String(err?.message ?? err))}</p>
          <a href="#/" class="btn btn--primary">${escapeHtml(t('backToHome'))}</a>
        </div>
      </div>
    `;
  }

  updateHeaderBadges();
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && isThemeModalOpen()) {
    e.preventDefault();
    haptic('light');
    closeThemeModal({ restoreFocus: true });
    return;
  }
  if (isThemeModalOpen()) return;
  if (activeKeyHandler) activeKeyHandler(e);
});

// Live reactive badge sync on every state mutation
window.addEventListener('ulduz:state-change', updateHeaderBadges);

// Celebratory toast whenever a new theme is unlocked!
window.addEventListener('ulduz:theme-unlocked', (e) => {
  const ids = e?.detail?.themeIds;
  if (!Array.isArray(ids) || ids.length === 0) return;
  const latestId = ids[ids.length - 1];
  const def = getThemeDef(latestId);
  haptic('success');
  updateHeaderBadges();
  showToast({
    message: t('themeUnlockedToast', { name: def.shortLabel }),
    actionLabel: t('themeApplyBtn'),
    duration: 8000,
    tone: 'unlock',
    onAction() {
      haptic('medium');
      setTheme(def.id, { animate: true });
      renderShellHeader(activeRouteCache);
      renderMobileBottomNav(activeRouteCache);
      updateHeaderBadges();
    },
  });
});

// Register Android hardware Back button handler (window.__ULDUZ_HANDLE_BACK__)
installNativeBackHandler({ navigate, parseHash });

// Register lightweight offline PWA Service Worker ONLY in regular web browsers (never in Tauri native WebView)
function registerPwaServiceWorker() {
  if (isNativeApp()) return;
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;
  if (window.location.protocol !== 'https:' && window.location.protocol !== 'http:') return;
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js', { scope: './' }).catch(() => {
      // Silently ignore when SW cannot register (e.g., restricted origin)
    });
  });
}

// Boot
async function boot() {
  applyThemeToDom(getTheme(), false);
  applyLangToDom();

  if (isNativeApp()) {
    const hydrated = await hydrateFromNativeStorage();
    if (hydrated) {
      applyThemeToDom(getTheme(), false);
      applyLangToDom();
    }
  }

  window.addEventListener('hashchange', () => handleRoute(true));
  await handleRoute(true);
  registerPwaServiceWorker();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => { void boot(); });
} else {
  void boot();
}
