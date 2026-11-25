// Auto-Updater Client for Ulduz (GitHub Releases + Android FileProvider APK Installer + PWA).

import {
  isNativeApp,
  isAndroidNative,
  checkNativeUpdate,
  openExternalUrl,
} from './native.js';
import { getSettings, updateSettings } from './storage.js';

export const APP_VERSION = '3.2.0';
export const GITHUB_REPO_URL = 'https://github.com/nakoulaf4/ulduz-attestat';
export const GITHUB_RELEASES_API = 'https://api.github.com/repos/nakoulaf4/ulduz-attestat/releases/latest';
const AUTO_CHECK_INTERVAL_MS = 6 * 60 * 60 * 1000; // 6 hours

let cachedUpdateResult = null;

/**
 * Parse semver `vX.Y.Z` or `X.Y.Z` into `[major, minor, patch]`.
 */
export function parseSemver(raw) {
  const cleaned = String(raw || '').trim().replace(/^[vV]/, '').split(/[-+]/)[0];
  const parts = cleaned.split('.').map((p) => Number.parseInt(p, 10));
  if (parts.length === 0 || Number.isNaN(parts[0])) return null;
  return [parts[0] || 0, parts[1] || 0, parts[2] || 0];
}

/**
 * True strictly when `latest` > `current`.
 */
export function isNewerVersion(current, latest) {
  const a = parseSemver(current);
  const b = parseSemver(latest);
  if (!a || !b) return false;
  for (let i = 0; i < 3; i++) {
    if (b[i] > a[i]) return true;
    if (b[i] < a[i]) return false;
  }
  return false;
}

export function getCachedUpdateResult() {
  return cachedUpdateResult;
}

export function dismissUpdateVersion(version) {
  updateSettings({ dismissedUpdateVersion: String(version || '') });
}

export function isUpdateDismissed(version) {
  if (!version) return false;
  return getSettings().dismissedUpdateVersion === String(version);
}

/**
 * Check GitHub Releases (`nakoulaf4/ulduz-attestat`) for a newer release.
 * Uses native Rust `reqwest` in Tauri builds or standard `fetch` + SW update in Web/PWA.
 * @param {{ force?: boolean, silent?: boolean }} [opts]
 */
export async function checkForAppUpdate({ force = false, silent = false } = {}) {
  const settings = getSettings();
  if (!force) {
    if (!settings.autoUpdateCheck) return null;
    const elapsed = Date.now() - Number(settings.lastUpdateCheckAt || 0);
    if (elapsed >= 0 && elapsed < AUTO_CHECK_INTERVAL_MS && cachedUpdateResult) {
      return cachedUpdateResult;
    }
    if (elapsed >= 0 && elapsed < AUTO_CHECK_INTERVAL_MS && settings.lastUpdateCheckAt > 0) {
      return null;
    }
  }

  try {
    let result;
    if (isNativeApp()) {
      result = await checkNativeUpdate(APP_VERSION);
    } else {
      // Also nudge PWA service worker quietly when checking on web
      if (typeof navigator !== 'undefined' && navigator.serviceWorker?.getRegistration) {
        navigator.serviceWorker.getRegistration().then((reg) => reg?.update()).catch(() => {});
      }
      const resp = await fetch(GITHUB_RELEASES_API, {
        headers: { Accept: 'application/vnd.github+json' },
      });
      if (!resp.ok) {
        throw new Error(`GitHub API HTTP ${resp.status}`);
      }
      const rel = await resp.json();
      const tag = String(rel?.tag_name || APP_VERSION);
      const latestVersion = tag.trim().replace(/^[vV]/, '');
      const assets = Array.isArray(rel?.assets) ? rel.assets : [];
      const apkAsset = assets.find((a) => {
        const n = String(a?.name || '').toLowerCase();
        return n.endsWith('.apk') && n.includes('arm64');
      }) || assets.find((a) => String(a?.name || '').toLowerCase().endsWith('.apk'));

      result = {
        currentVersion: APP_VERSION,
        latestVersion,
        hasUpdate: isNewerVersion(APP_VERSION, latestVersion),
        title: String(rel?.name || tag),
        notes: String(rel?.body || ''),
        releaseUrl: String(rel?.html_url || `${GITHUB_REPO_URL}/releases/latest`),
        publishedAt: String(rel?.published_at || ''),
        apkUrl: apkAsset?.browser_download_url || null,
        apkName: apkAsset?.name || null,
        apkSize: typeof apkAsset?.size === 'number' ? apkAsset.size : null,
      };
    }

    if (result) {
      cachedUpdateResult = result;
      updateSettings({ lastUpdateCheckAt: Date.now() });
      if (result.hasUpdate && typeof window !== 'undefined' && typeof CustomEvent === 'function') {
        window.dispatchEvent(new CustomEvent('ulduz:update-available', { detail: result }));
      }
    }
    return result;
  } catch (err) {
    if (silent) return null;
    throw err;
  }
}

/**
 * Open the official GitHub Release / APK download in the system browser (100% safe, zero dropper permissions).
 * @param {object} updateInfo
 */
export async function downloadAndInstallUpdate(updateInfo) {
  const targetUrl = (isAndroidNative() && updateInfo?.apkUrl)
    ? updateInfo.apkUrl
    : (updateInfo?.releaseUrl || `${GITHUB_REPO_URL}/releases/latest`);
  openExternalUrl(targetUrl);
  return { status: 'opened_browser', url: targetUrl };
}
