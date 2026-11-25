// Unified Settings Console (#/settings)
// Consolidates AI Gateways (OpenCode Zen / Kilo Gateway / Custom + DeepSeek default),
// Auto-Updater (GitHub Releases + Android APK download & install),
// Interface / Language / Editions / Pulsar FX / Reading Font / Haptics / Key Hints,
// and Local Data / Backups / Reset controls.

import {
  loadState,
  getLang,
  setLang,
  getTheme,
  getFxMode,
  getSettings,
  updateSettings,
  updateAiSettings,
  clearAiChatHistory,
  resetTimingStats,
  resetAllProgress,
  exportProgressJson,
  importProgressJson,
} from '../../core/storage.js';
import { getThemeDef } from '../../core/themes.js';
import {
  isNativeApp,
  isAndroidNative,
  exportNativeProgress,
  openExternalUrl,
  setHapticsEnabled,
  haptic,
} from '../../core/native.js';
import {
  AI_PROVIDERS,
  getProviderModels,
  resolveActiveAiConfig,
  fetchLiveModels,
  testGatewayConnection,
} from '../../core/ai-gateway.js';
import {
  APP_VERSION,
  GITHUB_REPO_URL,
  getCachedUpdateResult,
  checkForAppUpdate,
  downloadAndInstallUpdate,
} from '../../core/updater.js';
import { buildStudentTelemetrySnapshot, formatStudyTime } from '../../core/telemetry.js';
import { t, formatDateTime } from '../i18n.js';
import { icon } from '../icons.js';
import { escapeHtml } from '../math.js';
import { openThemeModal } from '../theme-modal.js';
import { VALID_FX_MODES, buildSignalMeterHtml } from '../fx-engine.js';

const FONT_SCALES = [
  { val: 0.85, label: '85%' },
  { val: 1, label: '100%' },
  { val: 1.15, label: '115%' },
  { val: 1.3, label: '130%' },
];

export async function renderSettingsView(container, ctx) {
  const { navigate, setKeyHandler, setFxMode, showToast, onShellRefresh } = ctx;
  if (setKeyHandler) setKeyHandler(null);

  let revealKey = false;
  let modelsBusy = false;
  let modelsNotice = null;
  let testBusy = false;
  let testResult = null; // { ok, text }

  let updateBusy = false;
  let updateInfo = getCachedUpdateResult();
  let updateStatus = null;
  let downloadPct = null; // null | 0..100
  let downloadBusy = false;

  let dataNotice = null;
  let confirmReset = false;

  function applyBodyPrefs(settings) {
    setHapticsEnabled(settings.haptics !== false);
    document.body.classList.toggle('is-hide-key-hints', settings.showKeyHints === false);
  }

  function render() {
    const state = loadState();
    const lang = getLang();
    const settings = getSettings();
    const ai = settings.ai;
    const activeCfg = resolveActiveAiConfig(ai);
    const providerObj = AI_PROVIDERS[activeCfg.provider] || AI_PROVIDERS.opencode;
    const models = getProviderModels(activeCfg.provider);
    const hasModelInList = models.some((m) => m.id === activeCfg.model);
    const themeDef = getThemeDef(getTheme());
    const fxMode = getFxMode();
    const snap = buildStudentTelemetrySnapshot(state);

    const platformLabel = isAndroidNative()
      ? 'Android Native (APK)'
      : isNativeApp()
      ? 'Tauri Native'
      : 'Web / PWA';

    const activeKeyValue = activeCfg.provider === 'kilo'
      ? (ai.kiloApiKey || '')
      : activeCfg.provider === 'custom'
      ? (ai.customApiKey || '')
      : (ai.opencodeApiKey || '');

    const currentScale = Number(settings.passageFontScale || 1);

    container.innerHTML = `
      <div class="page-container">
        <nav class="breadcrumbs" aria-label="${escapeHtml(t('breadcrumbsAria'))}">
          <a href="#/">${escapeHtml(t('navHome'))}</a>
          <span aria-hidden="true">/</span>
          <span aria-current="page">${escapeHtml(t('navSettings'))}</span>
        </nav>

        <div class="section-header section-header--split">
          <div>
            <h1 class="page-title">${escapeHtml(t('settingsTitle'))}</h1>
            <p class="page-lead text-secondary">${escapeHtml(t('settingsSubtitle'))}</p>
          </div>
          <div class="stats-head-actions">
            <a href="#/ai" class="btn btn--primary btn--sm">
              ${icon('bot', { size: 15 })}
              <span>${escapeHtml(t('navAi'))}</span>
            </a>
            <a href="#/stats" class="btn btn--secondary btn--sm">
              ${icon('bar-chart', { size: 15 })}
              <span>${escapeHtml(t('navStats'))}</span>
            </a>
          </div>
        </div>

        <div class="settings-sections">
          <!-- 01. AI GATEWAYS & MODEL CONFIGURATION -->
          <section class="settings-panel" aria-labelledby="settings-ai-heading">
            <div class="settings-panel__head">
              <div class="settings-panel__title-row">
                <span class="settings-cat-code mono-code">SET 01</span>
                <h2 id="settings-ai-heading" class="settings-panel__title">${escapeHtml(t('settingsAiHeading'))}</h2>
              </div>
              <p class="text-secondary">${escapeHtml(t('settingsAiSub'))}</p>
            </div>

            <div class="settings-panel__body">
              <!-- Provider Selector -->
              <div class="settings-row settings-row--stack">
                <div class="settings-row__info">
                  <span class="settings-label">${escapeHtml(t('settingsAiProviderLabel'))}</span>
                  <span class="text-secondary settings-hint">${escapeHtml(t('settingsAiProviderHint'))}</span>
                </div>
                <div class="setup-pills" role="radiogroup" aria-label="${escapeHtml(t('settingsAiProviderLabel'))}">
                  <button type="button" role="radio" aria-checked="${activeCfg.provider === 'opencode'}" class="seg-btn ${activeCfg.provider === 'opencode' ? 'is-active' : ''}" data-ai-provider="opencode">
                    <span>OpenCode Zen</span>
                  </button>
                  <button type="button" role="radio" aria-checked="${activeCfg.provider === 'kilo'}" class="seg-btn ${activeCfg.provider === 'kilo' ? 'is-active' : ''}" data-ai-provider="kilo">
                    <span>Kilo Gateway</span>
                  </button>
                  <button type="button" role="radio" aria-checked="${activeCfg.provider === 'custom'}" class="seg-btn ${activeCfg.provider === 'custom' ? 'is-active' : ''}" data-ai-provider="custom">
                    <span>Custom OpenAI</span>
                  </button>
                </div>
              </div>

              ${activeCfg.provider === 'custom' ? `
                <div class="settings-row settings-row--stack">
                  <label class="settings-label" for="settings-custom-url">${escapeHtml(t('settingsAiCustomUrlLabel'))}</label>
                  <input
                    id="settings-custom-url"
                    type="url"
                    class="settings-input mono-code"
                    value="${escapeHtml(ai.customBaseUrl || '')}"
                    placeholder="https://api.deepseek.com/v1"
                    autocomplete="off"
                    spellcheck="false"
                  />
                </div>
              ` : ''}

              <!-- Model Picker + Live Refresh -->
              <div class="settings-row settings-row--stack">
                <div class="settings-row__info">
                  <label class="settings-label" for="settings-ai-model">${escapeHtml(t('settingsAiModelLabel'))}</label>
                  <span class="text-secondary settings-hint">${escapeHtml(t('settingsAiModelHint'))}</span>
                </div>
                <div class="settings-inline-group">
                  ${activeCfg.provider === 'custom' ? `
                    <input
                      id="settings-ai-model"
                      type="text"
                      class="settings-input mono-code"
                      value="${escapeHtml(activeCfg.model)}"
                      placeholder="deepseek-chat"
                      autocomplete="off"
                    />
                  ` : `
                    <select id="settings-ai-model" class="control-select settings-select">
                      ${!hasModelInList ? `<option value="${escapeHtml(activeCfg.model)}" selected>${escapeHtml(activeCfg.model)}</option>` : ''}
                      ${models.map((m) => `
                        <option value="${escapeHtml(m.id)}" ${m.id === activeCfg.model ? 'selected' : ''}>${escapeHtml(m.label)}</option>
                      `).join('')}
                    </select>
                  `}
                  <button type="button" class="btn btn--secondary btn--sm" data-action="refresh-models" ${modelsBusy ? 'disabled' : ''}>
                    ${icon('refresh', { size: 14 })}
                    <span>${escapeHtml(modelsBusy ? t('loading') : t('settingsAiRefreshModelsBtn'))}</span>
                  </button>
                </div>
                ${modelsNotice ? `<div class="settings-inline-status mono-code">${escapeHtml(modelsNotice)}</div>` : ''}
              </div>

              <!-- Optional API Key -->
              <div class="settings-row settings-row--stack">
                <div class="settings-row__info">
                  <label class="settings-label" for="settings-ai-key">
                    ${icon('key', { size: 14 })}
                    <span>${escapeHtml(t('settingsAiKeyLabel', { provider: providerObj.name }))}</span>
                  </label>
                  <span class="text-secondary settings-hint">${escapeHtml(t('settingsAiKeyHint'))}</span>
                </div>
                <div class="settings-inline-group">
                  <input
                    id="settings-ai-key"
                    type="${revealKey ? 'text' : 'password'}"
                    class="settings-input mono-code"
                    value="${escapeHtml(activeKeyValue)}"
                    placeholder="${escapeHtml(t('settingsAiKeyPlaceholder'))}"
                    autocomplete="off"
                    spellcheck="false"
                  />
                  <button type="button" class="btn btn--ghost btn--sm" data-action="toggle-reveal-key" aria-label="${escapeHtml(t('settingsAiKeyRevealAria'))}">
                    ${icon(revealKey ? 'eye-off' : 'eye', { size: 15 })}
                  </button>
                  ${providerObj.docsUrl ? `
                    <button type="button" class="btn btn--ghost btn--sm" data-action="open-provider-docs" data-url="${escapeHtml(providerObj.docsUrl)}">
                      <span>Docs</span>
                      ${icon('arrow-right', { size: 13 })}
                    </button>
                  ` : ''}
                </div>
              </div>

              <!-- Auto-Fallback Toggle -->
              <div class="settings-row">
                <div class="settings-row__info">
                  <span class="settings-label">${escapeHtml(t('settingsAiFallbackLabel'))}</span>
                  <span class="text-secondary settings-hint">${escapeHtml(t('settingsAiFallbackHint'))}</span>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked="${ai.autoFallback !== false}"
                  class="fac-switch ${ai.autoFallback !== false ? 'is-on' : ''}"
                  data-toggle-ai="autoFallback"
                >
                  <span class="fac-switch__state mono-code">${escapeHtml(ai.autoFallback !== false ? t('toggleOn') : t('toggleOff'))}</span>
                </button>
              </div>

              <!-- Telemetry Sharing Toggle -->
              <div class="settings-row">
                <div class="settings-row__info">
                  <span class="settings-label">${escapeHtml(t('settingsAiTelemetryLabel'))}</span>
                  <span class="text-secondary settings-hint">${escapeHtml(t('settingsAiTelemetryHint'))}</span>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked="${ai.shareTelemetry !== false}"
                  class="fac-switch ${ai.shareTelemetry !== false ? 'is-on' : ''}"
                  data-toggle-ai="shareTelemetry"
                >
                  <span class="fac-switch__state mono-code">${escapeHtml(ai.shareTelemetry !== false ? t('toggleOn') : t('toggleOff'))}</span>
                </button>
              </div>

              <!-- Tutor Coaching Style -->
              <div class="settings-row settings-row--stack">
                <div class="settings-row__info">
                  <span class="settings-label">${escapeHtml(t('settingsAiStyleLabel'))}</span>
                  <span class="text-secondary settings-hint">${escapeHtml(t('settingsAiStyleHint'))}</span>
                </div>
                <div class="setup-pills" role="radiogroup" aria-label="${escapeHtml(t('settingsAiStyleLabel'))}">
                  ${['coach', 'strict', 'concise'].map((stKey) => `
                    <button type="button" role="radio" aria-checked="${(ai.systemStyle || 'coach') === stKey}" class="seg-btn ${(ai.systemStyle || 'coach') === stKey ? 'is-active' : ''}" data-ai-style="${stKey}">
                      <span>${escapeHtml(t(`settingsAiStyle_${stKey}`))}</span>
                    </button>
                  `).join('')}
                </div>
              </div>

              <!-- Connection Test -->
              <div class="settings-row settings-row--actions">
                <button type="button" class="btn btn--secondary btn--sm" data-action="test-ai" ${testBusy ? 'disabled' : ''}>
                  ${icon('zap', { size: 15 })}
                  <span>${escapeHtml(testBusy ? t('settingsAiTesting') : t('settingsAiTestBtn'))}</span>
                </button>
                <a href="#/ai" class="btn btn--primary btn--sm">
                  ${icon('bot', { size: 15 })}
                  <span>${escapeHtml(t('settingsOpenAiChatBtn'))}</span>
                </a>
                ${testResult ? `
                  <span class="settings-ping-result mono-code ${testResult.ok ? 'is-ok' : 'is-err'}" role="status">
                    ${escapeHtml(testResult.text)}
                  </span>
                ` : ''}
              </div>
            </div>
          </section>

          <!-- 02. AUTO-UPDATE & VERSIONING -->
          <section class="settings-panel" aria-labelledby="settings-update-heading">
            <div class="settings-panel__head">
              <div class="settings-panel__title-row">
                <span class="settings-cat-code mono-code">SET 02</span>
                <h2 id="settings-update-heading" class="settings-panel__title">${escapeHtml(t('settingsUpdateHeading'))}</h2>
              </div>
              <p class="text-secondary">${escapeHtml(t('settingsUpdateSub'))}</p>
            </div>

            <div class="settings-panel__body">
              <div class="settings-version-strip mono-code">
                <div>
                  <span class="text-muted">${escapeHtml(t('settingsVersionLabel'))}</span>
                  <strong>v${escapeHtml(APP_VERSION)}</strong>
                </div>
                <div>
                  <span class="text-muted">${escapeHtml(t('settingsPlatformLabel'))}</span>
                  <strong>${escapeHtml(platformLabel)}</strong>
                </div>
                <div>
                  <span class="text-muted">${escapeHtml(t('settingsLastCheckLabel'))}</span>
                  <strong>${escapeHtml(settings.lastUpdateCheckAt ? formatDateTime(settings.lastUpdateCheckAt) : '—')}</strong>
                </div>
              </div>

              <div class="settings-row">
                <div class="settings-row__info">
                  <span class="settings-label">${escapeHtml(t('settingsAutoUpdateLabel'))}</span>
                  <span class="text-secondary settings-hint">${escapeHtml(t('settingsAutoUpdateHint'))}</span>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked="${settings.autoUpdateCheck !== false}"
                  class="fac-switch ${settings.autoUpdateCheck !== false ? 'is-on' : ''}"
                  data-toggle-setting="autoUpdateCheck"
                >
                  <span class="fac-switch__state mono-code">${escapeHtml(settings.autoUpdateCheck !== false ? t('toggleOn') : t('toggleOff'))}</span>
                </button>
              </div>

              <div class="settings-row settings-row--actions">
                <button type="button" class="btn btn--secondary btn--sm" data-action="check-update" ${updateBusy || downloadBusy ? 'disabled' : ''}>
                  ${icon('refresh', { size: 15 })}
                  <span>${escapeHtml(updateBusy ? t('updateChecking') : t('updateCheckBtn'))}</span>
                </button>
                <button type="button" class="btn btn--ghost btn--sm" data-action="open-releases">
                  <span>GitHub Releases</span>
                  ${icon('arrow-right', { size: 13 })}
                </button>
              </div>

              ${updateStatus ? `<div class="settings-update-status mono-code" role="status">${escapeHtml(updateStatus)}</div>` : ''}

              ${updateInfo && updateInfo.hasUpdate ? `
                <div class="settings-update-card">
                  <div class="settings-update-card__head">
                    <strong>${escapeHtml(t('updateAvailableTitle', { version: updateInfo.latestVersion }))}</strong>
                    ${updateInfo.apkSize ? `<span class="mono-code text-muted">${(updateInfo.apkSize / (1024 * 1024)).toFixed(1)} MB</span>` : ''}
                  </div>
                  ${updateInfo.notes ? `<p class="text-secondary settings-update-card__notes">${escapeHtml(updateInfo.notes.slice(0, 320))}</p>` : ''}
                  ${downloadPct !== null ? `
                    <div class="settings-update-progress">
                      ${buildSignalMeterHtml(downloadPct, '#D63031', { ariaLabel: t('updateDownloading', { pct: downloadPct }) })}
                      <span class="mono-code tabular-nums">${escapeHtml(t('updateDownloading', { pct: downloadPct }))}</span>
                    </div>
                  ` : ''}
                  <div class="settings-update-card__actions">
                    <button type="button" class="btn btn--primary btn--sm" data-action="install-update" ${downloadBusy ? 'disabled' : ''}>
                      ${icon('download', { size: 15 })}
                      <span>${escapeHtml(isAndroidNative() && updateInfo.apkUrl ? t('updateDownloadInstallBtn') : t('updateOpenReleaseBtn'))}</span>
                    </button>
                  </div>
                </div>
              ` : ''}
            </div>
          </section>

          <!-- 03. INTERFACE, EDITIONS & ERGONOMICS -->
          <section class="settings-panel" aria-labelledby="settings-ui-heading">
            <div class="settings-panel__head">
              <div class="settings-panel__title-row">
                <span class="settings-cat-code mono-code">SET 03</span>
                <h2 id="settings-ui-heading" class="settings-panel__title">${escapeHtml(t('settingsUiHeading'))}</h2>
              </div>
              <p class="text-secondary">${escapeHtml(t('settingsUiSub'))}</p>
            </div>

            <div class="settings-panel__body">
              <!-- Language -->
              <div class="settings-row">
                <div class="settings-row__info">
                  <span class="settings-label">${escapeHtml(t('langToggleAria'))}</span>
                  <span class="text-secondary settings-hint">${escapeHtml(t('settingsLangHint'))}</span>
                </div>
                <div class="setup-pills" role="radiogroup" aria-label="${escapeHtml(t('langToggleAria'))}">
                  <button type="button" role="radio" aria-checked="${lang === 'ru'}" class="seg-btn ${lang === 'ru' ? 'is-active' : ''}" data-set-lang="ru">Русский (RU)</button>
                  <button type="button" role="radio" aria-checked="${lang === 'az'}" class="seg-btn ${lang === 'az' ? 'is-active' : ''}" data-set-lang="az">Azərbaycan (AZ)</button>
                </div>
              </div>

              <!-- Archival Editions -->
              <div class="settings-row">
                <div class="settings-row__info">
                  <span class="settings-label">${escapeHtml(t('themeModalTitle'))}</span>
                  <span class="text-secondary settings-hint mono-code">${escapeHtml(themeDef.name)}</span>
                </div>
                <button type="button" class="btn btn--secondary btn--sm" data-action="open-editions">
                  ${icon('palette', { size: 15 })}
                  <span>${escapeHtml(t('settingsOpenEditionsBtn'))}</span>
                </button>
              </div>

              <!-- Pulsar FX Mode -->
              <div class="settings-row settings-row--stack">
                <div class="settings-row__info">
                  <span class="settings-label">${escapeHtml(t('fxSectionTitle'))}</span>
                  <span class="text-secondary settings-hint">${escapeHtml(t('fxSectionSub'))}</span>
                </div>
                <div class="setup-pills" role="radiogroup" aria-label="${escapeHtml(t('fxSectionTitle'))}">
                  ${VALID_FX_MODES.map((modeId) => `
                    <button type="button" role="radio" aria-checked="${fxMode === modeId}" class="seg-btn ${fxMode === modeId ? 'is-active' : ''}" data-set-fx="${modeId}">
                      <span>${escapeHtml(t(`fxName_${modeId}`))}</span>
                    </button>
                  `).join('')}
                </div>
              </div>

              <!-- Default Reading Passage Font Scale -->
              <div class="settings-row">
                <div class="settings-row__info">
                  <span class="settings-label">${escapeHtml(t('settingsReadingFontLabel'))}</span>
                  <span class="text-secondary settings-hint">${escapeHtml(t('settingsReadingFontHint'))}</span>
                </div>
                <div class="setup-pills" role="radiogroup" aria-label="${escapeHtml(t('settingsReadingFontLabel'))}">
                  ${FONT_SCALES.map((sc) => `
                    <button type="button" role="radio" aria-checked="${Math.abs(currentScale - sc.val) < 0.03}" class="seg-btn ${Math.abs(currentScale - sc.val) < 0.03 ? 'is-active' : ''}" data-font-scale="${sc.val}">
                      <span class="mono-code">${sc.label}</span>
                    </button>
                  `).join('')}
                </div>
              </div>

              <!-- Haptics Toggle -->
              <div class="settings-row">
                <div class="settings-row__info">
                  <span class="settings-label">${escapeHtml(t('settingsHapticsLabel'))}</span>
                  <span class="text-secondary settings-hint">${escapeHtml(t('settingsHapticsHint'))}</span>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked="${settings.haptics !== false}"
                  class="fac-switch ${settings.haptics !== false ? 'is-on' : ''}"
                  data-toggle-setting="haptics"
                >
                  <span class="fac-switch__state mono-code">${escapeHtml(settings.haptics !== false ? t('toggleOn') : t('toggleOff'))}</span>
                </button>
              </div>

              <!-- Keyboard Hints Toggle -->
              <div class="settings-row">
                <div class="settings-row__info">
                  <span class="settings-label">${escapeHtml(t('settingsKeyHintsLabel'))}</span>
                  <span class="text-secondary settings-hint">${escapeHtml(t('settingsKeyHintsHint'))}</span>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked="${settings.showKeyHints !== false}"
                  class="fac-switch ${settings.showKeyHints !== false ? 'is-on' : ''}"
                  data-toggle-setting="showKeyHints"
                >
                  <span class="fac-switch__state mono-code">${escapeHtml(settings.showKeyHints !== false ? t('toggleOn') : t('toggleOff'))}</span>
                </button>
              </div>
            </div>
          </section>

          <!-- 04. DATA, BACKUPS & STORAGE -->
          <section class="settings-panel" aria-labelledby="settings-data-heading">
            <div class="settings-panel__head">
              <div class="settings-panel__title-row">
                <span class="settings-cat-code mono-code">SET 04</span>
                <h2 id="settings-data-heading" class="settings-panel__title">${escapeHtml(t('statsDataHeading'))}</h2>
              </div>
              <p class="text-secondary">${escapeHtml(t('statsDataDesc'))}</p>
            </div>

            <div class="settings-panel__body">
              <div class="settings-storage-strip mono-code tabular-nums">
                <div><span class="text-muted">${escapeHtml(t('statSolved'))}</span><strong>${snap.overall.attempted}</strong></div>
                <div><span class="text-muted">${escapeHtml(t('settingsTimedCountLabel'))}</span><strong>${snap.overall.totalTimedAttempts} (${escapeHtml(formatStudyTime(snap.overall.totalSec, lang))})</strong></div>
                <div><span class="text-muted">${escapeHtml(t('statMistakes'))}</span><strong>${snap.overall.activeMistakes}</strong></div>
                <div><span class="text-muted">${escapeHtml(t('settingsAiMsgsCountLabel'))}</span><strong>${(state.aiChat || []).length}</strong></div>
              </div>

              ${dataNotice ? `<div class="notice-banner" role="status">${escapeHtml(dataNotice)}</div>` : ''}

              <div class="stats-tools">
                <button type="button" class="btn btn--secondary btn--sm" data-action="export-json">
                  ${icon('download', { size: 15 })}
                  <span>${escapeHtml(t('statsExportBtn'))}</span>
                </button>
                <label class="btn btn--secondary btn--sm stats-import-label">
                  ${icon('upload', { size: 15 })}
                  <span>${escapeHtml(t('statsImportBtn'))}</span>
                  <input type="file" accept="application/json" class="sr-only" id="settings-import-json" />
                </label>
                <button type="button" class="btn btn--ghost btn--sm" data-action="clear-ai-chat">
                  ${icon('trash', { size: 14 })}
                  <span>${escapeHtml(t('settingsClearAiChatBtn'))}</span>
                </button>
                <button type="button" class="btn btn--ghost btn--sm" data-action="reset-timing">
                  ${icon('clock', { size: 14 })}
                  <span>${escapeHtml(t('settingsResetTimingBtn'))}</span>
                </button>
                ${!confirmReset ? `
                  <button type="button" class="btn btn--ghost btn--sm" data-action="ask-reset">
                    ${icon('trash', { size: 15 })}
                    <span>${escapeHtml(t('statsResetBtn'))}</span>
                  </button>
                ` : `
                  <button type="button" class="btn btn--danger btn--sm" data-action="confirm-reset">${escapeHtml(t('statsResetConfirm'))}</button>
                  <button type="button" class="btn btn--ghost btn--sm" data-action="cancel-reset">${escapeHtml(t('btnCancel'))}</button>
                `}
              </div>
            </div>
          </section>
        </div>
      </div>
    `;

    // --- 01. AI Gateway bindings ---
    container.querySelectorAll('[data-ai-provider]').forEach((btn) => {
      btn.addEventListener('click', () => {
        haptic('selection');
        const nextProvider = btn.dataset.aiProvider;
        updateAiSettings({ provider: nextProvider });
        testResult = null;
        modelsNotice = null;
        render();
      });
    });

    container.querySelector('#settings-custom-url')?.addEventListener('input', (e) => {
      updateAiSettings({ customBaseUrl: e.target.value.trim() });
    });

    const modelInput = container.querySelector('#settings-ai-model');
    if (modelInput) {
      const saveModel = (val) => {
        const clean = val.trim();
        if (!clean) return;
        if (activeCfg.provider === 'kilo') updateAiSettings({ kiloModel: clean });
        else if (activeCfg.provider === 'custom') updateAiSettings({ customModel: clean });
        else updateAiSettings({ model: clean });
      };
      modelInput.addEventListener('change', (e) => {
        haptic('selection');
        saveModel(e.target.value);
      });
      if (modelInput.tagName === 'INPUT') {
        modelInput.addEventListener('input', (e) => saveModel(e.target.value));
      }
    }

    container.querySelector('#settings-ai-key')?.addEventListener('input', (e) => {
      const val = e.target.value.trim();
      if (activeCfg.provider === 'kilo') updateAiSettings({ kiloApiKey: val });
      else if (activeCfg.provider === 'custom') updateAiSettings({ customApiKey: val });
      else updateAiSettings({ opencodeApiKey: val });
    });

    container.querySelector('[data-action="toggle-reveal-key"]')?.addEventListener('click', () => {
      revealKey = !revealKey;
      render();
    });

    container.querySelector('[data-action="open-provider-docs"]')?.addEventListener('click', (e) => {
      const url = e.currentTarget.dataset.url;
      if (url) openExternalUrl(url);
    });

    container.querySelector('[data-action="refresh-models"]')?.addEventListener('click', async () => {
      modelsBusy = true;
      modelsNotice = null;
      render();
      try {
        const list = await fetchLiveModels(activeCfg.provider, {
          apiKey: activeCfg.apiKey,
          customBaseUrl: activeCfg.baseUrl,
        });
        modelsNotice = t('settingsAiModelsLoaded', { n: list.length });
        haptic('success');
      } catch (err) {
        modelsNotice = `${t('aiErrorTitle')}: ${err?.message || err}`;
        haptic('error');
      } finally {
        modelsBusy = false;
        render();
      }
    });

    container.querySelectorAll('[data-toggle-ai]').forEach((btn) => {
      btn.addEventListener('click', () => {
        haptic('selection');
        const key = btn.dataset.toggleAi;
        const curVal = getSettings().ai[key] !== false;
        updateAiSettings({ [key]: !curVal });
        render();
      });
    });

    container.querySelectorAll('[data-ai-style]').forEach((btn) => {
      btn.addEventListener('click', () => {
        haptic('selection');
        updateAiSettings({ systemStyle: btn.dataset.aiStyle });
        render();
      });
    });

    container.querySelector('[data-action="test-ai"]')?.addEventListener('click', async () => {
      testBusy = true;
      testResult = null;
      render();
      try {
        const res = await testGatewayConnection(getSettings().ai);
        const fb = res.fallbackNote ? ` (${t('aiFallbackTag', { reason: res.fallbackNote })})` : '';
        testResult = {
          ok: true,
          text: `${t('settingsAiTestOk', { ms: res.latencyMs })} · ${res.model}${fb}`,
        };
        haptic('success');
      } catch (err) {
        testResult = {
          ok: false,
          text: err?.code === 'cors_blocked' ? t('aiErrCors') : (err?.message || t('aiErrGeneric')),
        };
        haptic('error');
      } finally {
        testBusy = false;
        render();
      }
    });

    // --- 02. Auto-Update bindings ---
    container.querySelector('[data-action="check-update"]')?.addEventListener('click', async () => {
      updateBusy = true;
      updateStatus = null;
      render();
      try {
        const res = await checkForAppUpdate({ force: true, silent: false });
        updateInfo = res;
        if (res?.hasUpdate) {
          updateStatus = t('updateAvailableTitle', { version: res.latestVersion });
          haptic('success');
        } else {
          updateStatus = t('updateUpToDate', { version: APP_VERSION });
          haptic('light');
        }
      } catch (err) {
        updateStatus = t('updateCheckError', { err: err?.message || err });
        haptic('error');
      } finally {
        updateBusy = false;
        render();
      }
    });

    container.querySelector('[data-action="open-releases"]')?.addEventListener('click', () => {
      openExternalUrl(`${GITHUB_REPO_URL}/releases`);
    });

    container.querySelector('[data-action="install-update"]')?.addEventListener('click', async () => {
      if (!updateInfo) return;
      downloadBusy = true;
      downloadPct = isAndroidNative() && updateInfo.apkUrl ? 0 : null;
      updateStatus = null;
      render();
      try {
        const res = await downloadAndInstallUpdate(updateInfo, {
          onProgress(ev) {
            downloadPct = ev.pct;
            const progHost = container.querySelector('.settings-update-progress');
            if (progHost) {
              progHost.innerHTML = `
                ${buildSignalMeterHtml(downloadPct, '#D63031', { ariaLabel: t('updateDownloading', { pct: downloadPct }) })}
                <span class="mono-code tabular-nums">${escapeHtml(t('updateDownloading', { pct: downloadPct }))}</span>
              `;
            }
          },
        });
        if (res.status === 'launched') {
          updateStatus = t('updateInstallLaunched');
          haptic('success');
        } else if (res.status === 'permission_required') {
          updateStatus = t('updatePermissionRequired');
          haptic('warning');
        } else {
          updateStatus = t('updateOpenedReleases');
        }
      } catch (err) {
        updateStatus = t('updateDownloadError', { err: err?.message || err });
        haptic('error');
      } finally {
        downloadBusy = false;
        render();
      }
    });

    // --- 03. UI, Editions & Ergonomics bindings ---
    container.querySelectorAll('[data-set-lang]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const nextLang = btn.dataset.setLang;
        if (nextLang === getLang()) return;
        haptic('selection');
        setLang(nextLang);
        document.documentElement.lang = nextLang;
        document.title = t('docTitle');
        if (onShellRefresh) onShellRefresh();
        render();
      });
    });

    container.querySelector('[data-action="open-editions"]')?.addEventListener('click', () => {
      haptic('selection');
      openThemeModal({
        navigate,
        onThemeChanged() {
          if (onShellRefresh) onShellRefresh();
          render();
        },
        onFxChanged(nextFx) {
          if (setFxMode) setFxMode(nextFx);
          render();
        },
      });
    });

    container.querySelectorAll('[data-set-fx]').forEach((btn) => {
      btn.addEventListener('click', () => {
        haptic('selection');
        if (setFxMode) setFxMode(btn.dataset.setFx);
        render();
      });
    });

    container.querySelectorAll('[data-font-scale]').forEach((btn) => {
      btn.addEventListener('click', () => {
        haptic('selection');
        const nextScale = Number(btn.dataset.fontScale) || 1;
        updateSettings({ passageFontScale: nextScale });
        render();
      });
    });

    container.querySelectorAll('[data-toggle-setting]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const key = btn.dataset.toggleSetting;
        const curVal = getSettings()[key] !== false;
        const updated = updateSettings({ [key]: !curVal });
        applyBodyPrefs(updated);
        haptic('selection');
        render();
      });
    });

    // --- 04. Data & Storage bindings ---
    container.querySelector('[data-action="export-json"]')?.addEventListener('click', async () => {
      const json = exportProgressJson();
      const filename = `ulduz-progress-${new Date().toISOString().slice(0, 10)}.json`;
      if (isNativeApp()) {
        const savedPath = await exportNativeProgress(filename, json);
        if (savedPath) {
          haptic('success');
          dataNotice = t('statsNoticeExportedNative', { path: savedPath });
          render();
          return;
        }
      }
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
      dataNotice = t('statsNoticeExported');
      render();
    });

    container.querySelector('#settings-import-json')?.addEventListener('change', async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      try {
        const text = await file.text();
        importProgressJson(text);
        applyBodyPrefs(getSettings());
        if (onShellRefresh) onShellRefresh();
        dataNotice = t('statsNoticeImported');
      } catch (err) {
        dataNotice = t('statsNoticeImportErr', { err: err?.message ?? err });
      }
      render();
    });

    container.querySelector('[data-action="clear-ai-chat"]')?.addEventListener('click', () => {
      haptic('light');
      clearAiChatHistory();
      dataNotice = t('settingsNoticeAiCleared');
      render();
    });

    container.querySelector('[data-action="reset-timing"]')?.addEventListener('click', () => {
      haptic('light');
      resetTimingStats();
      dataNotice = t('settingsNoticeTimingReset');
      render();
    });

    container.querySelector('[data-action="ask-reset"]')?.addEventListener('click', () => {
      confirmReset = true;
      render();
      container.querySelector('[data-action="cancel-reset"]')?.focus();
    });
    container.querySelector('[data-action="cancel-reset"]')?.addEventListener('click', () => {
      confirmReset = false;
      render();
      container.querySelector('[data-action="ask-reset"]')?.focus();
    });
    container.querySelector('[data-action="confirm-reset"]')?.addEventListener('click', () => {
      resetAllProgress();
      confirmReset = false;
      dataNotice = t('statsNoticeReset');
      if (showToast) showToast({ message: t('statsNoticeReset'), duration: 2800 });
      if (onShellRefresh) onShellRefresh();
      render();
    });
  }

  render();
}
