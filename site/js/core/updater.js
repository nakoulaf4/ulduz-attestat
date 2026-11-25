// Automatic Over-The-Air (OTA) & GitHub Releases Updater Client for Ulduz.
// On Android native builds, automatically downloads SHA-256 verified web bundles
// (`Ulduz-vX.Y.Z-web-ota.zip` + `.sha256`) from GitHub Releases and applies them seamlessly
// with crash-loop rollback protection — zero REQUEST_INSTALL_PACKAGES, zero antivirus triggers.

import {
  isNativeApp,
  isAndroidNative,
  checkNativeUpdate,
  installNativeOtaUpdate,
  getActiveOtaVersionSync,
  reloadNativeApp,
  openExternalUrl,
} from './native.js';
import { getSettings, updateSettings } from './storage.js';

export const APP_VERSION = '3.3.0';
export const GITHUB_REPO_URL = 'https://github.com/nakoulaf4/ulduz-attestat';
export const GITHUB_RELEASES_API = 'https://api.github.com/repos/nakoulaf4/ulduz-attestat/releases/latest';
const AUTO_CHECK_INTERVAL_MS = 30 * 60 * 1000; // 30 minutes

let cachedUpdateResult = null;
let autoOtaInFlight = false;
let pendingOtaVersion = null;

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

/**
 * Return the effective running version (highest of bundled APP_VERSION and active Android OTA version).
 */
export function getRunningVersion() {
  const otaVer = getActiveOtaVersionSync();
  if (otaVer && isNewerVersion(APP_VERSION, otaVer)) {
    return otaVer;
  }
  return APP_VERSION;
}

export function isRunningOtaBundle() {
  const otaVer = getActiveOtaVersionSync();
  return Boolean(otaVer && isNewerVersion(APP_VERSION, otaVer));
}

export function getPendingOtaVersion() {
  return pendingOtaVersion;
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
 * When `autoApply` is enabled on Android native builds and a verified OTA asset exists,
 * downloads + SHA-256 verifies + activates it automatically in the background!
 * @param {{ force?: boolean, silent?: boolean, autoApply?: boolean }} [opts]
 */
export async function checkForAppUpdate({ force = false, silent = false, autoApply = true } = {}) {
  const settings = getSettings();
  const runningVer = getRunningVersion();

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
      result = await checkNativeUpdate(runningVer);
    } else {
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
      const tag = String(rel?.tag_name || runningVer);
      const latestVersion = tag.trim().replace(/^[vV]/, '');
      const assets = Array.isArray(rel?.assets) ? rel.assets : [];
      const apkAsset = assets.find((a) => {
        const n = String(a?.name || '').toLowerCase();
        return n.endsWith('.apk') && n.includes('arm64');
      }) || assets.find((a) => String(a?.name || '').toLowerCase().endsWith('.apk'));
      const otaZip = assets.find((a) => String(a?.name || '').toLowerCase().endsWith('web-ota.zip'));
      const otaSha = assets.find((a) => String(a?.name || '').toLowerCase().endsWith('web-ota.sha256'));

      result = {
        currentVersion: runningVer,
        latestVersion,
        hasUpdate: isNewerVersion(runningVer, latestVersion),
        title: String(rel?.name || tag),
        notes: String(rel?.body || ''),
        releaseUrl: String(rel?.html_url || `${GITHUB_REPO_URL}/releases/latest`),
        publishedAt: String(rel?.published_at || ''),
        apkUrl: apkAsset?.browser_download_url || null,
        apkName: apkAsset?.name || null,
        apkSize: typeof apkAsset?.size === 'number' ? apkAsset.size : null,
        otaUrl: otaZip?.browser_download_url || null,
        otaSha256Url: otaSha?.browser_download_url || null,
        otaSize: typeof otaZip?.size === 'number' ? otaZip.size : null,
      };
    }

    if (result) {
      cachedUpdateResult = result;
      updateSettings({ lastUpdateCheckAt: Date.now() });

      // Automatic background OTA installation when enabled & supported on Android native
      if (
        autoApply &&
        settings.autoUpdateCheck !== false &&
        result.hasUpdate &&
        isAndroidNative() &&
        result.otaUrl &&
        result.otaSha256Url &&
        !autoOtaInFlight &&
        pendingOtaVersion !== result.latestVersion
      ) {
        autoOtaInFlight = true;
        try {
          const otaRes = await installNativeOtaUpdate({
            version: result.latestVersion,
            zipUrl: result.otaUrl,
            sha256Url: result.otaSha256Url,
          });
          pendingOtaVersion = otaRes?.version || result.latestVersion;
          result.otaInstalled = true;
          if (typeof window !== 'undefined' && typeof CustomEvent === 'function') {
            window.dispatchEvent(new CustomEvent('ulduz:ota-installed', {
              detail: { version: pendingOtaVersion, sha256: otaRes?.sha256 || '', result },
            }));
          }
          return result;
        } catch (otaErr) {
          if (typeof console !== 'undefined' && console.warn) {
            console.warn('[ulduz:ota] auto-apply failed, showing manual banner:', otaErr);
          }
        } finally {
          autoOtaInFlight = false;
        }
      }

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
 * Apply an available update:
 * - On Android native with verified OTA bundle: downloads, checks SHA-256, activates & reloads automatically!
 * - Otherwise opens the official GitHub Release / APK URL safely in the browser.
 * @param {object} updateInfo
 */
export async function downloadAndInstallUpdate(updateInfo) {
  if (isAndroidNative() && updateInfo?.otaUrl && updateInfo?.otaSha256Url) {
    if (pendingOtaVersion === updateInfo.latestVersion) {
      reloadNativeApp();
      return { status: 'reloading', version: pendingOtaVersion };
    }
    const res = await installNativeOtaUpdate({
      version: updateInfo.latestVersion,
      zipUrl: updateInfo.otaUrl,
      sha256Url: updateInfo.otaSha256Url,
    });
    pendingOtaVersion = res?.version || updateInfo.latestVersion;
    setTimeout(() => reloadNativeApp(), 400);
    return { status: 'ota_installed', version: pendingOtaVersion };
  }

  const targetUrl = (isAndroidNative() && updateInfo?.apkUrl)
    ? updateInfo.apkUrl
    : (updateInfo?.releaseUrl || `${GITHUB_REPO_URL}/releases/latest`);
  openExternalUrl(targetUrl);
  return { status: 'opened_browser', url: targetUrl };
}
