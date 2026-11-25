// Zero-dependency Tauri v2 Native Mobile Bridge (Android & iOS).
// 100% silent no-op when running in regular desktop/mobile browsers or Node.js.

let hapticsEnabled = true;

/**
 * Enable or disable native haptic feedback (controlled from Settings).
 * @param {boolean} enabled
 */
export function setHapticsEnabled(enabled) {
  hapticsEnabled = enabled !== false;
}

export function isHapticsEnabled() {
  return hapticsEnabled;
}

/**
 * Returns true only when running inside a Tauri v2 WebView with IPC available.
 */
export function isNativeApp() {
  return (
    typeof window !== 'undefined' &&
    Boolean(window.__TAURI_INTERNALS__ && typeof window.__TAURI_INTERNALS__.invoke === 'function')
  );
}

/**
 * Returns true when Android native bridge (`MainActivity.kt` -> `window.UlduzAndroid`) is attached.
 */
export function isAndroidNative() {
  return (
    typeof window !== 'undefined' &&
    Boolean(window.UlduzAndroid && typeof window.UlduzAndroid.openUrl === 'function')
  );
}

/**
 * Safely invoke a Tauri v2 Rust command or plugin command.
 * Never throws to UI callers; returns null outside Tauri or on unavailable plugin calls.
 */
async function invokeNative(cmd, args) {
  if (!isNativeApp()) return null;
  try {
    return await window.__TAURI_INTERNALS__.invoke(cmd, args);
  } catch (err) {
    if (typeof console !== 'undefined' && console.debug) {
      console.debug(`[ulduz:native] ${cmd} skipped:`, err?.message ?? err);
    }
    return null;
  }
}

/**
 * Invoke a Tauri v2 Rust command and propagate errors with clean messages.
 * Returns null only when not running inside Tauri.
 */
async function invokeNativeStrict(cmd, args) {
  if (!isNativeApp()) return null;
  try {
    return await window.__TAURI_INTERNALS__.invoke(cmd, args);
  } catch (err) {
    const msg = typeof err === 'string' ? err : (err?.message || String(err));
    throw new Error(msg);
  }
}

/**
 * Trigger crisp native haptic feedback via tauri-plugin-haptics v2.
 * Safe silent no-op in web browsers, desktop builds, or when disabled in Settings.
 * @param {'selection' | 'light' | 'medium' | 'success' | 'warning' | 'error'} kind
 */
export function haptic(kind = 'selection') {
  if (!hapticsEnabled || !isNativeApp()) return;
  switch (kind) {
    case 'selection':
      void invokeNative('plugin:haptics|selection_feedback');
      break;
    case 'light':
      void invokeNative('plugin:haptics|impact_feedback', { style: 'light' });
      break;
    case 'medium':
      void invokeNative('plugin:haptics|impact_feedback', { style: 'medium' });
      break;
    case 'success':
      void invokeNative('plugin:haptics|notification_feedback', { type: 'success' });
      break;
    case 'warning':
      void invokeNative('plugin:haptics|notification_feedback', { type: 'warning' });
      break;
    case 'error':
      void invokeNative('plugin:haptics|notification_feedback', { type: 'error' });
      break;
    default:
      void invokeNative('plugin:haptics|selection_feedback');
      break;
  }
}

/**
 * Load crash-safe persisted JSON progress string from Rust app data file.
 * @returns {Promise<string | null>}
 */
export async function loadNativeProgress() {
  const res = await invokeNative('load_progress');
  return typeof res === 'string' && res.trim().length > 0 ? res : null;
}

/**
 * Atomically persist progress JSON string via Rust backend (`ulduz_progress.json`).
 * @param {string} json
 * @returns {Promise<boolean>}
 */
export async function saveNativeProgress(json) {
  if (!isNativeApp() || typeof json !== 'string') return false;
  try {
    await window.__TAURI_INTERNALS__.invoke('save_progress', { data: json });
    return true;
  } catch (err) {
    if (typeof console !== 'undefined' && console.debug) {
      console.debug('[ulduz:native] save_progress failed:', err?.message ?? err);
    }
    return false;
  }
}

/**
 * Export progress backup file through Rust backend.
 * @param {string} filename
 * @param {string} json
 * @returns {Promise<string | null>} saved file path or null
 */
export async function exportNativeProgress(filename, json) {
  const res = await invokeNative('export_progress_file', {
    filename: String(filename || 'ulduz-progress.json'),
    data: String(json || '{}'),
  });
  return typeof res === 'string' && res.length > 0 ? res : null;
}

/**
 * Compute official DİM 100-point scaled score via Rust backend engine (optional verification helper).
 */
export async function scoreExamDimNative(subject, rawEarned, rawMax) {
  const args = { subject, rawEarned };
  if (typeof rawMax === 'number' && !Number.isNaN(rawMax)) {
    args.rawMax = rawMax;
  }
  return invokeNative('score_exam_dim', args);
}

/**
 * Query native Rust Tauri v2 runtime metadata (`{ version, platform, engine }`).
 */
export async function getNativeAppInfo() {
  return invokeNative('app_info');
}

/**
 * Check GitHub Releases for a newer version via Rust reqwest backend.
 * @param {string} [currentVersion]
 */
export async function checkNativeUpdate(currentVersion) {
  return invokeNativeStrict('check_github_update', {
    currentVersion: currentVersion || null,
  });
}

/**
 * Query active OTA bundle status from Rust backend (`{ bundledVersion, otaVersion, effectiveVersion, confirmed, active }`).
 */
export async function getNativeOtaStatus() {
  return invokeNative('get_ota_status');
}

/**
 * Download, SHA-256 verify, extract, and atomically activate an OTA web bundle from GitHub Releases.
 * @param {{ version: string, zipUrl: string, sha256Url: string }} params
 */
export async function installNativeOtaUpdate({ version, zipUrl, sha256Url }) {
  return invokeNativeStrict('install_ota_update', {
    version: String(version || ''),
    zipUrl: String(zipUrl || ''),
    sha256Url: String(sha256Url || ''),
  });
}

/**
 * Confirm that the currently booted OTA bundle initialized cleanly (resets crash-rollback counter).
 */
export async function confirmNativeOtaBoot() {
  try {
    if (typeof window !== 'undefined' && typeof window.UlduzAndroid?.confirmOtaBoot === 'function') {
      window.UlduzAndroid.confirmOtaBoot();
    }
  } catch {
    // ignore
  }
  return invokeNative('confirm_ota_boot');
}

/**
 * Remove any installed OTA overlay and fall back to the built-in APK bundle.
 */
export async function clearNativeOtaUpdate() {
  return invokeNativeStrict('clear_ota_update');
}

/**
 * Synchronously read active Android OTA version if running from an OTA bundle.
 */
export function getActiveOtaVersionSync() {
  try {
    if (typeof window !== 'undefined' && typeof window.UlduzAndroid?.getActiveOtaVersion === 'function') {
      return String(window.UlduzAndroid.getActiveOtaVersion() || '').trim();
    }
  } catch {
    // ignore
  }
  return '';
}

/**
 * Reload the WebView to activate a newly installed OTA update immediately.
 */
export function reloadNativeApp() {
  try {
    if (typeof window !== 'undefined' && typeof window.UlduzAndroid?.reloadApp === 'function') {
      return Boolean(window.UlduzAndroid.reloadApp());
    }
  } catch {
    // fall through
  }
  if (typeof window !== 'undefined' && window.location) {
    window.location.reload();
    return true;
  }
  return false;
}

/**
 * Open an external HTTPS URL safely (Android native Intent or browser tab).
 * @param {string} url
 */
export function openExternalUrl(url) {
  if (typeof url !== 'string' || !/^https?:\/\//i.test(url.trim())) return false;
  const clean = url.trim();
  if (typeof window !== 'undefined' && window.UlduzAndroid && typeof window.UlduzAndroid.openUrl === 'function') {
    try {
      return Boolean(window.UlduzAndroid.openUrl(clean));
    } catch {
      // fall through
    }
  }
  if (typeof window !== 'undefined' && typeof window.open === 'function') {
    window.open(clean, '_blank', 'noopener,noreferrer');
    return true;
  }
  return false;
}

/**
 * Send OpenAI-compatible chat completion JSON POST via CORS-free Rust HTTP client.
 * @param {{ url: string, apiKey?: string, body: string }} params
 * @returns {Promise<{ status: number, body: string } | null>}
 */
export async function nativeAiChatCompletion({ url, apiKey = '', body }) {
  return invokeNativeStrict('ai_chat_completion', {
    url: String(url || ''),
    apiKey: apiKey ? String(apiKey) : null,
    body: String(body || '{}'),
  });
}

/**
 * Fetch OpenAI-compatible `/models` catalog JSON via CORS-free Rust HTTP client.
 * @param {{ url: string, apiKey?: string }} params
 * @returns {Promise<{ status: number, body: string } | null>}
 */
export async function nativeAiListModels({ url, apiKey = '' }) {
  return invokeNativeStrict('ai_list_models', {
    url: String(url || ''),
    apiKey: apiKey ? String(apiKey) : null,
  });
}

/**
 * Register Android hardware Back button / predictive back gesture handler on `window.__ULDUZ_HANDLE_BACK__`.
 * Returns `true` when handled inside the app, or `false` on Home so Android exits/minimizes cleanly.
 *
 * Priority order:
 * 1. Close open `.exam-drawer` or `.confirm-banner`
 * 2. In running Exam (`body.is-exam-focused`), open exit/finish confirmation banner (never silently quit!)
 * 3. On `#/practice/:id`, `#/exam/:id` (setup/results), `#/originals/:id` -> `#/subject/:id` (or `#/` for `all`)
 * 4. On `#/subject/:id`, `#/mistakes` (exiting drill/detail first if open), `#/stats` -> `#/`
 * 5. On `#/` -> return `false`
 */
export function installNativeBackHandler({ navigate, parseHash }) {
  if (typeof window === 'undefined') return;

  window.__ULDUZ_HANDLE_BACK__ = function handleNativeBack() {
    // 0. Close open Theme Gallery modal/sheet first
    const themeModal = document.querySelector('#theme-modal:not([hidden])');
    if (themeModal) {
      const closeModalBtn = themeModal.querySelector('[data-action="close-theme-modal"]');
      if (closeModalBtn) {
        closeModalBtn.click();
        haptic('light');
        return true;
      }
    }

    // 1a. Close open exam grid drawer
    const openDrawer = document.querySelector('#exam-grid-drawer:not([hidden]), .exam-drawer.is-open:not([hidden])');
    if (openDrawer) {
      const closeBtn = openDrawer.querySelector('[data-action="close-drawer"]') || document.querySelector('[data-action="close-drawer"]');
      if (closeBtn) {
        closeBtn.click();
        haptic('light');
        return true;
      }
    }

    // 1b. Dismiss open exam confirmation banner
    const confirmBanner = document.querySelector('.confirm-banner');
    if (confirmBanner) {
      const cancelBtn = confirmBanner.querySelector('[data-action="cancel-finish"]');
      if (cancelBtn) {
        cancelBtn.click();
        haptic('light');
        return true;
      }
    }

    // 2. Running Exam: NEVER silently quit — open confirmation banner!
    if (document.body.classList.contains('is-exam-focused')) {
      const askFinishBtn = document.querySelector('[data-action="ask-finish"]');
      if (askFinishBtn) {
        askFinishBtn.click();
        haptic('warning');
        return true;
      }
      return true;
    }

    const { segments } = parseHash();
    const rootSeg = segments[0] || '';
    const paramId = segments[1] || '';

    // 3. Practice, Exam (setup/results), Originals, Lesson -> Subject Hub (or Home for 'all')
    if (rootSeg === 'practice' || rootSeg === 'exam' || rootSeg === 'originals' || rootSeg === 'lesson') {
      haptic('selection');
      if (paramId && paramId !== 'all') {
        navigate(`#/subject/${encodeURIComponent(paramId)}`);
      } else {
        navigate('#/');
      }
      return true;
    }

    // 4a. Mistakes active task/drill -> return to mistakes list first
    if (rootSeg === 'mistakes') {
      const backToListBtn = document.querySelector('[data-action="back-to-list"]');
      if (backToListBtn) {
        backToListBtn.click();
        haptic('selection');
        return true;
      }
    }

    // 4b. Subject Hub, Mistakes list, Stats, AI Tutor, Settings -> Home
    if (
      rootSeg === 'subject' ||
      rootSeg === 'mistakes' ||
      rootSeg === 'stats' ||
      rootSeg === 'ai' ||
      rootSeg === 'settings'
    ) {
      haptic('selection');
      navigate('#/');
      return true;
    }

    // 5. Home (`#/`) -> let Android exit / minimize cleanly
    return false;
  };
}
