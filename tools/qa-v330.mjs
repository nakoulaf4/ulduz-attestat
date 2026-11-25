#!/usr/bin/env node
// Automated E2E QA for Ulduz v3.3.0 — Automatic SHA-256 Verified OTA Auto-Updater:
// 1. Boot confirms OTA health (confirmOtaBoot bridge + confirm_ota_boot IPC)
// 2. Automatic background OTA install & reload outside exam on newer GitHub release
// 3. Mid-exam reload protection (installs silently in background without interrupting exam)
// 4. Settings SET 02 shows active OTA version, OTA platform tag, and functional "Reset OTA" button
// 5. AZ localization purity on #/settings (zero Cyrillic leaks) + zero console/page errors

import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const BASE_URL = process.env.ULDUZ_URL || 'http://127.0.0.1:8123/';

async function loadPlaywright() {
  const candidates = [
    'playwright',
    'playwright-core',
    pathToFileURL('C:/Users/runbo/.bun/install/cache/playwright-core@1.60.0@@@1/index.mjs').href,
  ];
  for (const mod of candidates) {
    try {
      const pw = await import(mod);
      if (pw?.chromium) return pw;
      if (pw?.default?.chromium) return pw.default;
    } catch {
      // next
    }
  }
  throw new Error('Playwright not found');
}

function findChromeExecutable() {
  const paths = [
    process.env.CHROME_PATH,
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  ].filter(Boolean);
  for (const p of paths) {
    if (fs.existsSync(p)) return p;
  }
  return undefined;
}

let passed = 0;
let failed = 0;

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'Assertion failed');
}

async function test(name, fn) {
  try {
    const detail = await fn();
    passed++;
    console.log(`  [PASS] ${name}${detail ? ` — ${detail}` : ''}`);
  } catch (err) {
    failed++;
    console.error(`  [FAIL] ${name} — ${err?.message || err}`);
  }
}

const pw = await loadPlaywright();
const browser = await pw.chromium.launch({
  headless: true,
  executablePath: findChromeExecutable(),
});

console.log('\n=== ULDUZ v3.3.0 OTA AUTO-UPDATE QA SUITE ===');

await test('1. Boot calls confirmOtaBoot() and automatically installs + reloads on newer GitHub OTA release', async () => {
  const context = await browser.newContext({ viewport: { width: 412, height: 915 } });
  const page = await context.newPage();
  const pageErrors = [];
  page.on('pageerror', (e) => pageErrors.push(e.message));

  await page.addInitScript(() => {
    window.__QA_LOG__ = {
      confirmBridgeCalls: 0,
      reloadCalls: 0,
      invokes: [],
    };
    window.UlduzAndroid = {
      openUrl: () => true,
      getActiveOtaVersion: () => '',
      confirmOtaBoot: () => {
        window.__QA_LOG__.confirmBridgeCalls += 1;
        return true;
      },
      reloadApp: () => {
        window.__QA_LOG__.reloadCalls += 1;
        return true;
      },
    };
    window.__TAURI_INTERNALS__ = {
      invoke: async (cmd, args) => {
        window.__QA_LOG__.invokes.push({ cmd, args });
        if (cmd === 'load_progress') return null;
        if (cmd === 'confirm_ota_boot') return true;
        if (cmd === 'check_github_update') {
          return {
            currentVersion: '3.3.0',
            latestVersion: '3.4.0',
            hasUpdate: true,
            title: 'Ulduz v3.4.0',
            notes: 'New practice pack',
            releaseUrl: 'https://github.com/nakoulaf4/ulduz-attestat/releases/tag/v3.4.0',
            publishedAt: '2026-12-01T00:00:00Z',
            apkUrl: 'https://github.com/nakoulaf4/ulduz-attestat/releases/download/v3.4.0/Ulduz-v3.4.0-android-arm64.apk',
            apkName: 'Ulduz-v3.4.0-android-arm64.apk',
            apkSize: 9500000,
            otaUrl: 'https://github.com/nakoulaf4/ulduz-attestat/releases/download/v3.4.0/Ulduz-v3.4.0-web-ota.zip',
            otaSha256Url: 'https://github.com/nakoulaf4/ulduz-attestat/releases/download/v3.4.0/Ulduz-v3.4.0-web-ota.sha256',
            otaSize: 1850000,
          };
        }
        if (cmd === 'install_ota_update') {
          return {
            version: args.version,
            sha256: 'deadbeef'.repeat(8),
            filesExtracted: 42,
            installedAtMs: Date.now(),
          };
        }
        return null;
      },
    };
  });

  await page.goto(`${BASE_URL}#/`, { waitUntil: 'networkidle' });
  // Wait for 1800ms auto-update trigger + 1600ms auto-reload timer
  await page.waitForTimeout(4000);

  const log = await page.evaluate(() => window.__QA_LOG__);
  assert(pageErrors.length === 0, `Page errors: ${pageErrors.join('; ')}`);
  assert(log.confirmBridgeCalls >= 1, `confirmOtaBoot bridge not called (${log.confirmBridgeCalls})`);
  assert(log.invokes.some((i) => i.cmd === 'confirm_ota_boot'), 'confirm_ota_boot IPC not called');
  const installCall = log.invokes.find((i) => i.cmd === 'install_ota_update');
  assert(installCall, 'install_ota_update was NOT called automatically!');
  assert(installCall.args.version === '3.4.0', `Expected version 3.4.0, got ${installCall.args.version}`);
  assert(installCall.args.zipUrl.endsWith('web-ota.zip'), 'Unexpected zipUrl');
  assert(installCall.args.sha256Url.endsWith('web-ota.sha256'), 'Unexpected sha256Url');
  assert(log.reloadCalls >= 1, `reloadApp() was NOT triggered automatically (${log.reloadCalls})`);

  await context.close();
  return `confirmOtaBoot=${log.confirmBridgeCalls}, install_ota_update=v3.4.0, autoReload=${log.reloadCalls}`;
});

await test('2. Mid-exam protection: OTA downloads in background WITHOUT reloading during active exam', async () => {
  const context = await browser.newContext({ viewport: { width: 412, height: 915 } });
  const page = await context.newPage();
  const pageErrors = [];
  page.on('pageerror', (e) => pageErrors.push(e.message));

  await page.addInitScript(() => {
    window.__QA_EXAM__ = { reloadCalls: 0, installCalls: 0 };
    window.UlduzAndroid = {
      openUrl: () => true,
      getActiveOtaVersion: () => '',
      confirmOtaBoot: () => true,
      reloadApp: () => {
        window.__QA_EXAM__.reloadCalls += 1;
        return true;
      },
    };
    window.__TAURI_INTERNALS__ = {
      invoke: async (cmd, args) => {
        if (cmd === 'load_progress') return null;
        if (cmd === 'confirm_ota_boot') return true;
        if (cmd === 'check_github_update') {
          return {
            currentVersion: '3.3.0',
            latestVersion: '3.5.0',
            hasUpdate: true,
            title: 'Ulduz v3.5.0',
            notes: 'Mid-exam OTA test',
            releaseUrl: 'https://github.com/nakoulaf4/ulduz-attestat/releases/tag/v3.5.0',
            publishedAt: '2026-12-02T00:00:00Z',
            apkUrl: null,
            apkName: null,
            apkSize: null,
            otaUrl: 'https://github.com/nakoulaf4/ulduz-attestat/releases/download/v3.5.0/Ulduz-v3.5.0-web-ota.zip',
            otaSha256Url: 'https://github.com/nakoulaf4/ulduz-attestat/releases/download/v3.5.0/Ulduz-v3.5.0-web-ota.sha256',
            otaSize: 1900000,
          };
        }
        if (cmd === 'install_ota_update') {
          window.__QA_EXAM__.installCalls += 1;
          return { version: args.version, sha256: 'a'.repeat(64), filesExtracted: 50, installedAtMs: Date.now() };
        }
        return null;
      },
    };
  });

  await page.goto(`${BASE_URL}#/exam/physics`, { waitUntil: 'networkidle' });
  // Start exam immediately BEFORE the 1800ms auto-update timer fires
  await page.waitForSelector('[data-action="begin-exam"]');
  await page.click('[data-action="begin-exam"]');
  await page.waitForSelector('.exam-topbar');
  await page.waitForTimeout(3800);

  const state = await page.evaluate(() => ({
    examFocused: document.body.classList.contains('is-exam-focused'),
    toastText: document.getElementById('toast-region')?.textContent?.trim() || '',
    ...window.__QA_EXAM__,
  }));

  assert(pageErrors.length === 0, `Page errors: ${pageErrors.join('; ')}`);
  assert(state.examFocused, 'Expected exam to be in focused mode');
  assert(state.installCalls === 1, `Expected background installCalls=1, got ${state.installCalls}`);
  assert(state.reloadCalls === 0, `MUST NOT reload mid-exam! Got reloadCalls=${state.reloadCalls}`);
  assert(state.toastText.includes('3.5.0'), `Expected deferred reload toast mentioning 3.5.0, got: "${state.toastText}"`);

  await context.close();
  return `examFocused=true, installCalls=1, reloadCalls=0 (protected!)`;
});

await test('3. Settings SET 02 displays active OTA version & Reset OTA clears + reloads cleanly', async () => {
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  const pageErrors = [];
  page.on('pageerror', (e) => pageErrors.push(e.message));

  await page.addInitScript(() => {
    window.__QA_SET__ = { clearCalls: 0, reloadCalls: 0 };
    window.UlduzAndroid = {
      openUrl: () => true,
      getActiveOtaVersion: () => '3.4.0',
      confirmOtaBoot: () => true,
      reloadApp: () => {
        window.__QA_SET__.reloadCalls += 1;
        return true;
      },
    };
    window.__TAURI_INTERNALS__ = {
      invoke: async (cmd) => {
        if (cmd === 'load_progress') return null;
        if (cmd === 'confirm_ota_boot') return true;
        if (cmd === 'clear_ota_update') {
          window.__QA_SET__.clearCalls += 1;
          return true;
        }
        if (cmd === 'check_github_update') {
          return {
            currentVersion: '3.4.0',
            latestVersion: '3.4.0',
            hasUpdate: false,
            title: 'Ulduz v3.4.0',
            notes: '',
            releaseUrl: 'https://github.com/nakoulaf4/ulduz-attestat/releases/tag/v3.4.0',
            publishedAt: '',
            apkUrl: null,
            apkName: null,
            apkSize: null,
            otaUrl: null,
            otaSha256Url: null,
            otaSize: null,
          };
        }
        return null;
      },
    };
  });

  await page.goto(`${BASE_URL}#/settings`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(300);

  const info = await page.evaluate(() => ({
    versionStrip: document.querySelector('.settings-version-strip')?.textContent || '',
    hasResetBtn: Boolean(document.querySelector('[data-action="clear-ota"]')),
  }));

  assert(info.versionStrip.includes('v3.4.0 (OTA)'), `Expected v3.4.0 (OTA) in strip, got: ${info.versionStrip}`);
  assert(info.versionStrip.includes('Android Native (OTA)'), `Expected Android Native (OTA), got: ${info.versionStrip}`);
  assert(info.hasResetBtn, 'Expected data-action="clear-ota" button when OTA is active');

  await page.locator('[data-action="clear-ota"]').click();
  await page.waitForTimeout(600);

  const res = await page.evaluate(() => window.__QA_SET__);
  assert(pageErrors.length === 0, `Page errors: ${pageErrors.join('; ')}`);
  assert(res.clearCalls === 1, `Expected clear_ota_update call=1, got ${res.clearCalls}`);
  assert(res.reloadCalls === 1, `Expected reloadApp call=1 after clear, got ${res.reloadCalls}`);

  await context.close();
  return `v3.4.0 (OTA) shown, clear_ota_update=1, reload=1`;
});

await test('4. Settings SET 02 in AZ locale has zero Cyrillic leaks', async () => {
  const context = await browser.newContext({ viewport: { width: 412, height: 915 } });
  const page = await context.newPage();

  await page.addInitScript(() => {
    window.UlduzAndroid = {
      openUrl: () => true,
      getActiveOtaVersion: () => '3.4.0',
      confirmOtaBoot: () => true,
      reloadApp: () => true,
    };
  });

  await page.goto(`${BASE_URL}#/settings`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(250);
  await page.locator('[data-set-lang="az"]').click();
  await page.waitForTimeout(250);

  const set02Text = await page.evaluate(() => {
    const panels = [...document.querySelectorAll('.settings-panel')];
    return panels[1]?.textContent || '';
  });
  const cyrillic = set02Text.match(/[А-Яа-яЁё]+/g);
  assert(!cyrillic, `Found Cyrillic leak in AZ SET 02: ${cyrillic?.join(', ')}`);
  assert(set02Text.includes('Avtomatik yenilənmə'), 'Missing AZ heading in SET 02');
  assert(set02Text.includes('OTA sıfırla'), 'Missing AZ OTA reset button');

  await context.close();
  return `0 Cyrillic leaks in AZ SET 02`;
});

await browser.close();

console.log(`\nSUMMARY: ${passed} passed, ${failed} failed\n`);
process.exit(failed > 0 ? 1 : 0);
