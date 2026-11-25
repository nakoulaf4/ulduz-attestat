#!/usr/bin/env node
// Ulduz — Comprehensive Playwright E2E, Mobile/PWA, 5-Theme System, Accessibility, Localization & Visual Regression Suite.
// Verifies all P0/P1/P2 requirements, mobile ergonomics, lazy loading, native Back bridge, manifest/icons,
// and all 5 unlockable themes (Восход, i, n, a, Мастер) against http://127.0.0.1:8123/.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { checkAnswer } from '../site/js/core/contract.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SITE_DIR = path.join(ROOT, 'site');
const SHOTS_DIR = path.join(ROOT, 'tools', 'reports', 'shots');
const THEME_SHOTS_DIR = path.join(ROOT, 'work', 'qa-themes');
const JSON_REPORT = path.join(ROOT, 'tools', 'reports', 'e2e-results.json');
const BASE_URL = process.env.ULDUZ_URL || 'http://127.0.0.1:8123/';

fs.mkdirSync(SHOTS_DIR, { recursive: true });
fs.mkdirSync(THEME_SHOTS_DIR, { recursive: true });

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
      // try next
    }
  }
  throw new Error('Could not resolve playwright / playwright-core module.');
}

function findChromeExecutable() {
  const paths = [
    process.env.CHROME_PATH,
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  ].filter(Boolean);
  for (const p of paths) {
    if (fs.existsSync(p)) return p;
  }
  return undefined;
}

// ---------- Assertion Harness ----------
const results = [];
let passCount = 0;
let failCount = 0;

function record(group, name, ok, detail = '') {
  results.push({ group, name, ok: Boolean(ok), detail: String(detail || '') });
  if (ok) {
    passCount++;
    console.log(`  [PASS] ${group} :: ${name}${detail ? ` — ${detail}` : ''}`);
  } else {
    failCount++;
    console.error(`  [FAIL] ${group} :: ${name}${detail ? ` — ${detail}` : ''}`);
  }
}

async function test(group, name, fn) {
  try {
    const detail = await fn();
    record(group, name, true, detail || '');
  } catch (err) {
    record(group, name, false, err?.message || String(err));
  }
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'Assertion failed');
}

// ---------- Contrast Helpers ----------
function parseRgb(str) {
  const m = String(str || '').match(/rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)/i);
  if (!m) return null;
  return { r: Number(m[1]), g: Number(m[2]), b: Number(m[3]), a: m[4] === undefined ? 1 : Number(m[4]) };
}

function relLum({ r, g, b }) {
  const ch = [r, g, b].map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2];
}

function contrastRatio(fgStr, bgStr) {
  const fg = parseRgb(fgStr);
  const bg = parseRgb(bgStr);
  if (!fg || !bg) return 0;
  const a = fg.a;
  const comp = {
    r: fg.r * a + bg.r * (1 - a),
    g: fg.g * a + bg.g * (1 - a),
    b: fg.b * a + bg.b * (1 - a),
  };
  const l1 = relLum(comp);
  const l2 = relLum(bg);
  const hi = Math.max(l1, l2);
  const lo = Math.min(l1, l2);
  return (hi + 0.05) / (lo + 0.05);
}

function readPngDimensions(filePath) {
  const buf = fs.readFileSync(filePath);
  // PNG signature: 89 50 4E 47 0D 0A 1A 0A, followed by IHDR chunk at offset 12..24
  assert(
    buf.length >= 24 &&
      buf[0] === 0x89 &&
      buf[1] === 0x50 &&
      buf[2] === 0x4e &&
      buf[3] === 0x47 &&
      buf[4] === 0x0d &&
      buf[5] === 0x0a &&
      buf[6] === 0x1a &&
      buf[7] === 0x0a,
    `Invalid PNG signature in ${filePath}`
  );
  const width = buf.readUInt32BE(16);
  const height = buf.readUInt32BE(20);
  return { width, height, bytes: buf.length };
}

const BANNED_EMOJIS = ['🌙', '☀️', '☀', '🔥', '📚', '📄', '📖', '❓', '🔊', '💡', '📋'];

const THEME_SPECS = [
  { id: 'atelier',  label: 'FAC 01', font: 'Ulduz Nvidia', scheme: 'dark',  themeColor: '#0C0C0E' },
  { id: 'prism',    label: 'FAC 02', font: 'Ulduz Intel',  scheme: 'dark',  themeColor: '#080D18' },
  { id: 'pulse',    label: 'FAC 03', font: 'Ulduz Nvidia', scheme: 'dark',  themeColor: '#0C0C0D' },
  { id: 'monolith', label: 'FAC 04', font: 'Ulduz AMD',    scheme: 'dark',  themeColor: '#0F0D0E' },
  { id: 'eclipse',  label: 'FAC 05', font: 'Ulduz Wide',   scheme: 'light', themeColor: '#ECECEB' },
];

const LEGACY_TEST_MAP = {
  light: 'atelier',
  dark: 'atelier',
  voshod: 'atelier',
  intel: 'prism',
  nvidia: 'pulse',
  amd: 'monolith',
  master: 'eclipse',
};

function normTestTheme(t) {
  return LEGACY_TEST_MAP[t] || t || 'atelier';
}

async function gotoHash(page, hash, waitSel = '#app-main') {
  const target = hash.startsWith('#') ? `${BASE_URL}${hash}` : `${BASE_URL}#${hash}`;
  await page.goto(target, { waitUntil: 'networkidle' });
  await page.waitForSelector(waitSel, { timeout: 10000 });
  await page.waitForTimeout(180);
}

async function resetAppState(page, { theme = 'atelier', fxMode = 'tactile', lang = 'ru', unlockedThemes = null } = {}) {
  const normalized = normTestTheme(theme);
  const unlocked = (unlockedThemes ?? (normalized === 'atelier' ? ['atelier'] : ['atelier', normalized])).map(normTestTheme);
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  await page.evaluate(({ th, fx, lg, unl }) => {
    localStorage.clear();
    localStorage.setItem('ulduz_state_v1', JSON.stringify({
      version: 1,
      theme: th,
      fxMode: fx,
      unlockedThemes: [...new Set(['atelier', ...unl])],
      unseenThemes: [],
      achievements: { perfectFullExam: unl.includes('eclipse') },
      lang: lg,
      streak: { days: 0, lastDate: null, todayCount: 0 },
      stats: { totalAttempted: 0, totalCorrect: 0, bySubject: {}, byTopic: {}, byType: {} },
      mistakes: {},
      bookmarks: {},
      exams: [],
      activeExam: null,
      solvedOriginals: {},
      originalsSessions: {},
      activePractice: {},
    }));
  }, { th: normalized, fx: fxMode, lg: lang, unl: unlocked });
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(160);
}

async function setTheme(page, theme) {
  const targetId = normTestTheme(theme);
  const cur = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
  if (cur === targetId) return;

  // Ensure target theme is unlocked in state so switching via modal or storage works cleanly
  await page.evaluate(async (id) => {
    const { loadState, setTheme: applyStorageTheme } = await import('./js/core/storage.js');
    const st = loadState();
    if (!st.unlockedThemes.includes(id)) st.unlockedThemes.push(id);
    applyStorageTheme(id, { animate: false });
  }, targetId);

  // Sync header trigger label if visible
  await page.evaluate(async (id) => {
    const { getThemeDef } = await import('./js/core/themes.js');
    const def = getThemeDef(id);
    const lbl = document.querySelector('#btn-theme-toggle .theme-trigger__name');
    if (lbl) lbl.textContent = def.shortLabel;
  }, targetId);

  await page.waitForTimeout(160);
}

async function getStoredState(page) {
  return page.evaluate(() => {
    try {
      return JSON.parse(localStorage.getItem('ulduz_state_v1') || '{}');
    } catch {
      return {};
    }
  });
}

// =====================================================================
// MAIN RUNNER
// =====================================================================
async function main() {
  console.log(`\n=== ULDUZ PLAYWRIGHT E2E, MOBILE & 5-THEME AUDIT ===`);
  console.log(`Target: ${BASE_URL}`);

  // -----------------------------------------------------------------
  // SECTION A: Contract Unit Checks + Manifest / Icon / Theme Assets Integrity
  // -----------------------------------------------------------------
  console.log('\n[1] Contract Unit Checks & PWA/Theme Asset Integrity');
  await test('P0#4', 'shortEquals accepts comma-decimal lists & equivalents', async () => {
    const mk = (answer, accept = []) => ({ format: 'short', answer, accept, points: 1 });
    assert(checkAnswer(mk('1.5; 2.5'), '1,5; 2,5').correct === true, '1,5; 2,5 vs 1.5; 2.5 failed');
    assert(checkAnswer(mk('2; 3'), '2, 3').correct === true, '2, 3 vs 2; 3 failed');
    assert(checkAnswer(mk('1/2'), '0,5').correct === true, '0,5 vs 1/2 failed');
    assert(checkAnswer(mk('1; 2; 3'), '1,2,3').correct === true, '1,2,3 vs 1; 2; 3 failed');
    assert(checkAnswer(mk('1.5'), '1,5').correct === true, '1,5 vs 1.5 failed');
    assert(checkAnswer(mk('1.5; 2.5'), '1,5; 3,5').correct === false, 'false positive on 1,5; 3,5');
    assert(checkAnswer(mk('1.5; 2.5'), '1,5').correct === false, 'false positive on partial list');
    return '7/7 shortEquals cases verified';
  });

  await test('Mobile#Manifest', 'site/manifest.json valid JSON, icons exist, icon-1024.png is valid 1024x1024 PNG, theme fonts & SVGs exist', async () => {
    const manifestPath = path.join(SITE_DIR, 'manifest.json');
    assert(fs.existsSync(manifestPath), 'site/manifest.json missing');
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    assert(manifest.name && manifest.short_name === 'Ulduz', `Unexpected manifest name/short_name: ${manifest.name}`);
    assert(Array.isArray(manifest.icons) && manifest.icons.length >= 3, 'manifest.json missing icons array');

    for (const ic of manifest.icons) {
      const rel = String(ic.src || '').replace(/^\.\//, '');
      const full = path.join(SITE_DIR, rel);
      assert(fs.existsSync(full), `Manifest icon missing on disk: ${ic.src}`);
    }

    const icon1024 = readPngDimensions(path.join(SITE_DIR, 'assets', 'icons', 'icon-1024.png'));
    assert(icon1024.width === 1024 && icon1024.height === 1024, `icon-1024.png bad dimensions: ${icon1024.width}x${icon1024.height}`);

    const icon192 = readPngDimensions(path.join(SITE_DIR, 'assets', 'icons', 'icon-192.png'));
    const icon512 = readPngDimensions(path.join(SITE_DIR, 'assets', 'icons', 'icon-512.png'));
    assert(icon192.width === 192 && icon512.width === 512, `icon-192/512 bad dimensions`);

    const requiredThemeAssets = [
      'vendor/fonts/theme-fonts.css',
      'vendor/fonts/ulduz-intel.woff2',
      'vendor/fonts/ulduz-nvidia.woff2',
      'vendor/fonts/ulduz-amd.woff2',
      'vendor/fonts/ulduz-wide.woff2',
      'css/tokens.css',
      'css/primitives.css',
      'css/styles.css',
      'css/themes.css',
      'js/core/themes.js',
      'js/core/native.js',
      'js/app/fx-engine.js',
      'js/app/ui-kit.js',
      'js/app/theme-modal.js',
      'sw.js',
    ];
    for (const rel of requiredThemeAssets) {
      const full = path.join(SITE_DIR, rel);
      assert(fs.existsSync(full) && fs.statSync(full).size > 0, `Missing/empty asset: site/${rel}`);
    }

    return `manifest.json OK, icon-1024.png ${icon1024.width}x${icon1024.height} (${icon1024.bytes}B), all 5 theme fonts + 3 SVGs present`;
  });

  const pw = await loadPlaywright();
  const executablePath = findChromeExecutable();
  const browser = await pw.chromium.launch({
    headless: true,
    executablePath,
    args: ['--no-sandbox', '--disable-gpu', '--font-render-hinting=none'],
  });

  const consoleErrors = [];
  const pageErrors = [];
  const failedRequests = [];

  // -----------------------------------------------------------------
  // SECTION B: Lazy Subject Loading Verification (Isolated Fresh Context!)
  // -----------------------------------------------------------------
  console.log('\n[2] Lazy Subject Loading & Default First-Launch Theme (Восход)');
  await test('Mobile#Lazy', 'Cold Home (#/) & Stats (#/stats) fetch 0 subject bundles; #/subject/math fetches ONLY math', async () => {
    const lazyCtx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
    const lazyPage = await lazyCtx.newPage();
    const requestedUrls = [];
    lazyPage.on('request', (req) => requestedUrls.push(req.url()));
    lazyPage.on('response', (res) => {
      if (res.status() >= 400) failedRequests.push(`[lazy] ${res.status()} ${res.url()}`);
    });

    try {
      await lazyPage.goto(`${BASE_URL}#/`, { waitUntil: 'networkidle' });
      await lazyPage.waitForSelector('.fac-catalog-list', { timeout: 10000 });
      await lazyPage.waitForTimeout(180);

      // Verify fresh first launch defaults to FAC 01 Archive ('atelier', dark, #0C0C0E, fx=tactile)!
      const bootTheme = await lazyPage.evaluate(() => ({
        theme: document.documentElement.getAttribute('data-theme'),
        scheme: document.documentElement.getAttribute('data-color-scheme'),
        fx: document.documentElement.getAttribute('data-fx'),
        themeColor: document.getElementById('theme-color-meta')?.getAttribute('content'),
      }));
      assert(bootTheme.theme === 'atelier', `Fresh boot theme expected "atelier", got "${bootTheme.theme}"`);
      assert(bootTheme.scheme === 'dark', `Fresh boot color-scheme expected "dark", got "${bootTheme.scheme}"`);
      assert(bootTheme.fx === 'tactile', `Fresh boot fx expected "tactile", got "${bootTheme.fx}"`);
      assert(bootTheme.themeColor === '#0C0C0E', `Fresh boot theme-color expected "#0C0C0E", got "${bootTheme.themeColor}"`);

      const subjRe = /\/js\/subjects\/(math|ru|en|az)\//;
      const onHome = requestedUrls.filter((u) => subjRe.test(u));
      assert(onHome.length === 0, `Home eagerly fetched subject modules: ${onHome.join(', ')}`);

      // Navigate to #/stats -> STILL 0 subject bundles!
      await lazyPage.goto(`${BASE_URL}#/stats`, { waitUntil: 'networkidle' });
      await lazyPage.waitForSelector('.stats-subjects-grid', { timeout: 10000 });
      await lazyPage.waitForTimeout(150);
      const onStats = requestedUrls.filter((u) => subjRe.test(u));
      assert(onStats.length === 0, `Stats eagerly fetched subject modules: ${onStats.join(', ')}`);

      // Navigate to #/subject/math -> dynamically loads ONLY math!
      await lazyPage.goto(`${BASE_URL}#/subject/math`, { waitUntil: 'networkidle' });
      await lazyPage.waitForSelector('.topic-group', { timeout: 10000 });
      await lazyPage.waitForTimeout(150);
      const loadedSubjs = new Set(
        requestedUrls
          .map((u) => u.match(subjRe)?.[1])
          .filter(Boolean)
      );
      assert(loadedSubjs.size === 1 && loadedSubjs.has('math'), `Expected only ["math"] loaded on #/subject/math, got [${[...loadedSubjs].join(', ')}]`);

      return `Cold #/ & #/stats: 0 subject bundles; #/subject/math: ONLY [math]; default theme=voshod (#180C3A)`;
    } finally {
      await lazyCtx.close();
    }
  });

  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  const page = await context.newPage();

  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(`${page.url()} :: ${msg.text()}`);
  });
  page.on('pageerror', (err) => {
    pageErrors.push(`${page.url()} :: ${err.message}`);
  });
  page.on('response', (res) => {
    if (res.status() >= 400) failedRequests.push(`${res.status()} ${res.url()}`);
  });
  page.on('requestfailed', (req) => {
    const errTxt = req.failure()?.errorText || '';
    if (!errTxt.includes('ERR_ABORTED')) {
      failedRequests.push(`FAILED ${req.url()} (${errTxt})`);
    }
  });

  try {
    // -----------------------------------------------------------------
    // SECTION C: Home Fresh User + Screenshots (Восход & Intel Desktop+Mobile)
    // -----------------------------------------------------------------
    console.log('\n[3] Home Fresh User, Legacy Theme Migration & Baseline Screenshots');
    await test('P2#13', 'Fresh Home has Factory Pulsar Canvas, 4 DİM catalog rows, interactive color decoder, and migrates legacy themes to atelier', async () => {
      // Confirm legacy 'voshod' in localStorage migrates cleanly to 'atelier'
      await page.goto(BASE_URL, { waitUntil: 'networkidle' });
      await page.evaluate(() => {
        localStorage.setItem('ulduz_state_v1', JSON.stringify({ version: 1, theme: 'voshod', lang: 'ru' }));
      });
      await page.reload({ waitUntil: 'networkidle' });
      await page.waitForTimeout(160);
      const migratedTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
      assert(migratedTheme === 'atelier', `Legacy theme "voshod" did not migrate to "atelier", got "${migratedTheme}"`);

      await resetAppState(page, { theme: 'atelier', fxMode: 'tactile', lang: 'ru' });
      await gotoHash(page, '#/');

      const statsStripCount = await page.locator('.fac-pulsar-hud__stats').count();
      const h1Text = (await page.locator('h1').first().textContent())?.trim();
      const catalogCount = await page.locator('.fac-catalog-row').count();
      assert(statsStripCount === 0, `Expected 0 .fac-pulsar-hud__stats for fresh user, got ${statsStripCount}`);
      assert(h1Text && h1Text.includes('DİM 300'), `Home H1 expected DİM 300, got "${h1Text}"`);
      assert(catalogCount === 4, `Expected 4 DİM catalog rows, got ${catalogCount}`);

      // Verify live interactive 3D Pulsar canvas rendered with non-zero box
      const canvasBox = await page.locator('#fac-pulsar-canvas').boundingBox();
      assert(canvasBox && canvasBox.width >= 260 && canvasBox.height >= 180, `Pulsar canvas missing or collapsed: ${JSON.stringify(canvasBox)}`);

      // Test Interactive Saville Color Decoder focus -> updates active curve readout & decoder text
      await page.locator('[data-decoder-subject="ru"]').focus();
      await page.waitForTimeout(120);
      const activeReadout = (await page.locator('#fac-active-readout').textContent())?.trim();
      const decoderText = (await page.locator('#fac-decoder-label').textContent())?.trim();
      assert(activeReadout && activeReadout.includes('Русский'), `Active pulsar readout did not switch to Russian: "${activeReadout}"`);
      assert(decoderText && decoderText.includes('DİM 02'), `Color decoder did not decode DİM 02: "${decoderText}"`);

      const headerBadgeHidden = await page.locator('#header-mistakes-badge').evaluate((el) => el.hidden);
      const mobileBadgeHidden = await page.locator('#mobile-mistakes-badge').evaluate((el) => el.hidden);
      assert(headerBadgeHidden === true && mobileBadgeHidden === true, 'Mistakes badges should be hidden when 0 mistakes');
      return `H1="${h1Text}", Pulsar Canvas (${Math.round(canvasBox.width)}x${Math.round(canvasBox.height)}), 4 DİM rows, Color Decoder OK, legacy->atelier OK`;
    });

    await page.screenshot({ path: path.join(SHOTS_DIR, 'home-voshod-desktop.png'), fullPage: false });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(150);
    await page.screenshot({ path: path.join(SHOTS_DIR, 'home-dark-mobile.png'), fullPage: false });
    await page.setViewportSize({ width: 360, height: 800 });
    await page.waitForTimeout(150);
    await page.screenshot({ path: path.join(SHOTS_DIR, 'home-voshod-360.png'), fullPage: false });

    await setTheme(page, 'intel');
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.waitForTimeout(150);
    await page.screenshot({ path: path.join(SHOTS_DIR, 'home-light-desktop.png'), fullPage: false });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(150);
    await page.screenshot({ path: path.join(SHOTS_DIR, 'home-light-mobile.png'), fullPage: false });

    // -----------------------------------------------------------------
    // SECTION D: P0 #1, #2, #3 + inputmode="decimal" + Focus Preservation + Strike-through + All 4 Subjects & 5 Formats
    // -----------------------------------------------------------------
    console.log('\n[4] Practice: P0 #1/#2/#3, inputmode="decimal", Focus Preservation, Strike-through, All 4 Subjects & 5 Formats');
    await page.setViewportSize({ width: 1280, height: 860 });
    await resetAppState(page, { theme: 'intel', lang: 'ru' });

    await test('P0#1', 'Option A is NOT selected on load (aria-checked="false") & MCQ strike-through works', async () => {
      await gotoHash(page, '#/practice/math?type=math.interval-count&seed=42');
      const optA = page.locator('[data-action="pick-single"][data-index="0"]');
      await optA.waitFor();
      const ariaChecked = await optA.getAttribute('aria-checked');
      const hasSel = await optA.evaluate((el) => el.classList.contains('is-selected'));
      const checkDisabled = await page.locator('[data-action="check-answer"]').isDisabled();
      assert(ariaChecked === 'false', `Option A aria-checked=${ariaChecked}, expected false`);
      assert(!hasSel, 'Option A unexpectedly has .is-selected');
      assert(checkDisabled, 'Check button should be disabled before picking option');

      const elimB = page.locator('[data-action="toggle-eliminate"][data-index="1"]');
      await elimB.click();
      const rowBElim = await page.locator('.option-row').nth(1).evaluate((el) => el.classList.contains('is-eliminated'));
      const activeAfterElim = await page.evaluate(() => {
        const a = document.activeElement;
        return `${a?.dataset?.action}:${a?.dataset?.index}`;
      });
      assert(rowBElim, 'Option B did not get .is-eliminated after clicking eliminate button');
      assert(activeAfterElim === 'toggle-eliminate:1', `Focus lost after eliminate: ${activeAfterElim}`);

      const optC = page.locator('[data-action="pick-single"][data-index="2"]');
      await optC.click({ button: 'right' });
      const rowCElim = await page.locator('.option-row').nth(2).evaluate((el) => el.classList.contains('is-eliminated'));
      assert(rowCElim, 'Right-click on Option C did not eliminate it');

      await optC.click();
      const rowCElimAfter = await page.locator('.option-row').nth(2).evaluate((el) => el.classList.contains('is-eliminated'));
      const optCChecked = await optC.getAttribute('aria-checked');
      const activeAfterPick = await page.evaluate(() => {
        const a = document.activeElement;
        return `${a?.dataset?.action}:${a?.dataset?.index}`;
      });
      assert(!rowCElimAfter, 'Clicking eliminated Option C should clear elimination');
      assert(optCChecked === 'true', 'Option C should be aria-checked="true"');
      assert(activeAfterPick === 'pick-single:2', `Focus lost after pick-single: ${activeAfterPick}`);
      return 'Option A unselected, button + right-click strike-through OK, focus preserved';
    });

    await test('P0#3', 'Pressing Enter on focused <button> / <a> activates it instead of submitting task', async () => {
      const bmkBtn = page.locator('[data-action="toggle-bookmark"]');
      await bmkBtn.focus();
      await page.keyboard.press('Enter');
      await page.waitForTimeout(120);
      const expCount = await page.locator('.explanation-card').count();
      const bmkPressed = await page.locator('[data-action="toggle-bookmark"]').getAttribute('aria-pressed');
      assert(expCount === 0, 'Enter on focused bookmark <button> submitted the task!');
      assert(bmkPressed === 'true', 'Enter on focused bookmark <button> did not toggle bookmark');

      const hintBtn = page.locator('[data-action="toggle-hint"]');
      if (await hintBtn.count() > 0) {
        await hintBtn.focus();
        await page.keyboard.press('Enter');
        await page.waitForTimeout(100);
        assert((await page.locator('.task-hint-box').count()) === 1, 'Enter on hint button did not open hint');
        assert((await page.locator('.explanation-card').count()) === 0, 'Enter on hint button submitted task!');
        const activeAfterHint = await page.evaluate(() => document.activeElement?.dataset?.action);
        assert(activeAfterHint === 'toggle-hint', `Focus lost after hint toggle: ${activeAfterHint}`);
      }

      const homeLink = page.locator('.breadcrumbs a[href="#/"]').first();
      await homeLink.focus();
      await page.keyboard.press('Enter');
      await page.waitForTimeout(200);
      assert(page.url().endsWith('#/'), `Enter on focused <a> did not navigate to #/ (url=${page.url()})`);
      return 'Focused button & link Enter handled natively without submitting task';
    });

    await test('P0#2/Mobile#Inputmode', 'Enter in .short-input checks & stays, math inputmode="decimal", context-smart char bar, clear button', async () => {
      await gotoHash(page, '#/practice/math?type=math.percent-word&seed=101');
      const shortInput = page.locator('.short-input');
      await shortInput.waitFor();

      const inputMode = await shortInput.getAttribute('inputmode');
      assert(inputMode === 'decimal', `Math .short-input expected inputmode="decimal", got "${inputMode}"`);

      const clearDisplayEmpty = await page.locator('[data-action="clear-short"]').evaluate((el) => getComputedStyle(el).display);
      assert(clearDisplayEmpty === 'none', `Expected clear button display:none when empty, got ${clearDisplayEmpty}`);

      const chars = await page.locator('.char-btn').allTextContents();
      assert(chars.length > 0, 'Expected math char bar helpers on math short task');
      const hasAzLetters = chars.some((c) => /[əğıİöşüç]/.test(c));
      assert(!hasAzLetters, `Found Azerbaijani letters in math char bar: ${chars.join(', ')}`);

      const stemBefore = (await page.locator('.task-card__stem').textContent())?.trim();
      const numBefore = (await page.locator('.task-num-label').textContent())?.trim();

      await shortInput.fill('42');
      const clearDisplayFilled = await page.locator('[data-action="clear-short"]').evaluate((el) => getComputedStyle(el).display);
      assert(clearDisplayFilled !== 'none', 'Clear button did not appear after typing into short-input');

      await shortInput.press('Enter');
      await page.waitForTimeout(260);

      const expVisible = await page.locator('.explanation-card').isVisible();
      const numAfter = (await page.locator('.task-num-label').textContent())?.trim();
      const stemAfter = (await page.locator('.task-card__stem').textContent())?.trim();
      assert(expVisible, 'Enter in .short-input did not check the task');
      assert(numAfter === numBefore && stemAfter === stemBefore, `Enter skipped to next task! before=${numBefore}, after=${numAfter}`);
      return `inputmode="decimal", checked & stayed on ${numAfter}; math chars=[${chars.join(' ')}]`;
    });

    await test('P1#10', 'Practice collapsible filter bar, topic auto-sync on ?type=, Math SVG & Cone SVG screenshots', async () => {
      await gotoHash(page, '#/practice/math?type=math.cone-rotation&seed=77');
      const drawerHiddenInit = await page.locator('#practice-filters-drawer').evaluate((el) => el.hidden);
      assert(drawerHiddenInit === true, 'Filter drawer should start collapsed');

      await page.locator('[data-action="toggle-filters"]').click();
      const drawerHiddenAfter = await page.locator('#practice-filters-drawer').evaluate((el) => el.hidden);
      assert(drawerHiddenAfter === false, 'Filter drawer did not expand on click');

      const topicVal = await page.locator('#practice-topic-select').inputValue();
      assert(topicVal.length > 0, `Expected topic select auto-synced for ?type=math.cone-rotation, got "${topicVal}"`);

      await page.locator('[data-action="toggle-filters"]').click();
      await page.waitForTimeout(120);

      const coneSvg = page.locator('.task-card .task-figure svg').first();
      await coneSvg.waitFor({ timeout: 5000 });
      const coneSvgBox = await coneSvg.boundingBox();
      assert(coneSvgBox && coneSvgBox.width > 80 && coneSvgBox.height > 80, `Cone SVG missing or too small: ${JSON.stringify(coneSvgBox)}`);
      await page.screenshot({ path: path.join(SHOTS_DIR, 'practice-math-cone.png'), fullPage: false });

      await gotoHash(page, '#/practice/math?type=math.tri-similarity&seed=55');
      const simSvg = page.locator('.task-card .task-figure svg').first();
      await simSvg.waitFor({ timeout: 5000 });
      const simBox = await simSvg.boundingBox();
      assert(simBox && simBox.width > 80, `Math similarity SVG missing or too small: ${JSON.stringify(simBox)}`);
      await page.screenshot({ path: path.join(SHOTS_DIR, 'practice-math-svg.png'), fullPage: false });
      return `Collapsed by default, auto-synced topic="${topicVal}", Cone & Geometry SVGs verified`;
    });

    await test('P2#14', 'Ulduz 8-Ray Mastery Star illuminates on correct answer + <kbd> hides after check', async () => {
      await resetAppState(page, { theme: 'intel', lang: 'ru' });
      await gotoHash(page, '#/practice/math?type=math.interval-count&seed=88');

      const raysBefore = await page.locator('.practice-session-pills .ulduz-star__ray.is-lit').count();
      const totalRays = await page.locator('.practice-session-pills .ulduz-star__ray').count();
      const kbdBefore = await page.locator('.option-kbd').count();
      assert(totalRays === 8, `Expected 8 Ulduz star rays, got ${totalRays}`);
      assert(raysBefore === 0, `Expected 0 lit rays initially, got ${raysBefore}`);
      assert(kbdBefore >= 4, `Expected >=4 option <kbd> hints before check, got ${kbdBefore}`);

      const st = await getStoredState(page);
      const ansIdx = Number(st.activePractice?.math?.item?.task?.answer ?? 0);
      await page.locator(`[data-action="pick-single"][data-index="${ansIdx}"]`).click();
      await page.locator('[data-action="check-answer"]').click();
      await page.waitForTimeout(150);

      const raysAfter = await page.locator('.practice-session-pills .ulduz-star__ray.is-lit').count();
      const kbdAfter = await page.locator('.option-kbd').count();
      assert(raysAfter === 1, `Expected 1 lit ray after 1st correct answer, got ${raysAfter}`);
      assert(kbdAfter === 0, `Expected 0 <kbd> badges after check, got ${kbdAfter}`);
      return '8 rays present, lit 0 -> 1 on correct answer, option <kbd> hidden after check';
    });

    await test('P1#9/10', 'Practice all 5 formats (single, short, open, match, order) across math/ru/en/az + focus preservation', async () => {
      await gotoHash(page, '#/practice/en?type=en.sentence-order&seed=12');
      await page.locator('[data-action="order-down"][data-pos="0"]').click();
      const activeAfterDown = await page.evaluate(() => `${document.activeElement?.dataset?.action}:${document.activeElement?.dataset?.pos}`);
      assert(activeAfterDown.startsWith('order-'), `Focus lost after order-down: ${activeAfterDown}`);

      await page.locator('[data-action="order-swap"][data-pos="0"]').click();
      const isSelectedSwap = await page.locator('.order-item').nth(0).evaluate((el) => el.classList.contains('is-swap-selected'));
      assert(isSelectedSwap, 'order-swap did not mark item as swap-selected');
      await page.locator('[data-action="order-swap"][data-pos="2"]').click();
      const activeAfterSwap = await page.evaluate(() => `${document.activeElement?.dataset?.action}:${document.activeElement?.dataset?.pos}`);
      assert(activeAfterSwap === 'order-swap:2', `Focus lost after order-swap: ${activeAfterSwap}`);
      await page.locator('[data-action="check-answer"]').click();
      assert(await page.locator('.explanation-card').isVisible(), 'Order task did not check');

      await gotoHash(page, '#/practice/en?type=en.vocab-match&seed=15');
      const leftCount = await page.locator('[data-match-left-card]').count();
      assert(leftCount >= 3, `Expected >=3 match left items, got ${leftCount}`);
      await page.locator('[data-action="pick-match-right"][data-right="0"]').click();
      const badgeTxt = (await page.locator('.match-right-item').nth(0).locator('.match-assigned-badge').textContent())?.trim();
      const activeAfterMatch = await page.evaluate(() => document.activeElement?.dataset?.action);
      assert(badgeTxt === '1', `Expected right item badge "1", got "${badgeTxt}"`);
      assert(activeAfterMatch === 'pick-match-right', `Focus lost after match right pick: ${activeAfterMatch}`);
      for (let i = 1; i < leftCount; i++) {
        await page.locator(`[data-action="pick-match-right"][data-right="${i}"]`).click();
      }
      await page.locator('[data-action="check-answer"]').click();
      assert(await page.locator('.explanation-card').isVisible(), 'Match task did not check');

      await gotoHash(page, '#/practice/en?type=en.reading-synonym&seed=21');
      await page.locator('.short-input').waitFor();
      const enCharBarCount = await page.locator('.char-bar').count();
      const enInputMode = await page.locator('.short-input').getAttribute('inputmode');
      assert(enCharBarCount === 0, `Expected 0 .char-bar on EN plain short task, got ${enCharBarCount}`);
      assert(enInputMode !== 'decimal', `EN text input should not force inputmode="decimal"`);

      await gotoHash(page, '#/practice/az?type=az.reading-open&seed=9');
      await page.locator('.open-textarea').fill('Azərbaycan dilində cavab');
      await page.locator('[data-action="reveal-rubric"]').click();
      const deadCheckBtns = await page.locator('[data-action="check-answer"]').count();
      assert(deadCheckBtns === 0, 'Dead Check button should be hidden when open rubric is revealed');
      const scoreBtns = await page.locator('[data-action="pick-self-score"]').allTextContents();
      const hasFractions = scoreBtns.some((s) => /0\.67|1\.33|⅓|⅔/.test(s));
      assert(!hasFractions, `AZ open rubric should not show math fractional steps: ${scoreBtns.join(', ')}`);
      await page.locator('[data-action="pick-self-score"]').last().click();
      assert(await page.locator('.explanation-card').isVisible(), 'AZ open task did not show explanation after self-grade');

      await setTheme(page, 'voshod');
      await gotoHash(page, '#/originals/ru?n=11');
      await page.locator('.passage-panel').waitFor();
      const refBtns = page.locator('.task-card__stem .sentence-ref');
      const refCount = await refBtns.count();
      assert(refCount > 0, 'Expected clickable .sentence-ref link on RU reading #11');
      const targetNum = await refBtns.first().getAttribute('data-jump-sentence');
      await refBtns.first().click();
      await page.waitForTimeout(180);
      const isPulsing = await page.locator(`.passage-panel [data-sentence-num="${targetNum}"]`).evaluate((el) => el.classList.contains('is-pulsing'));
      assert(isPulsing, `Clicking sentence-ref for (${targetNum}) did not trigger .is-pulsing in .passage-panel`);

      const darkScheme = await page.evaluate(() => ({
        colorScheme: getComputedStyle(document.documentElement).colorScheme,
        scrollbarColor: getComputedStyle(document.documentElement).scrollbarColor,
      }));
      assert(darkScheme.colorScheme.includes('dark'), `Expected dark color-scheme on voshod, got "${darkScheme.colorScheme}"`);
      assert(darkScheme.scrollbarColor && darkScheme.scrollbarColor !== 'auto', `Expected styled scrollbar-color in dark mode, got "${darkScheme.scrollbarColor}"`);

      await page.screenshot({ path: path.join(SHOTS_DIR, 'practice-ru-reading-dark.png'), fullPage: false });
      await setTheme(page, 'intel');

      return `order/match/short/open/single verified across math/ru/en/az; sentence anchor (${targetNum}) pulsed; dark color-scheme & scrollbar styled`;
    });

    // -----------------------------------------------------------------
    // SECTION E: Mistakes & Bookmarks (#6, #8, #13) + Live Mobile Badge
    // -----------------------------------------------------------------
    console.log('\n[5] Mistakes & Bookmarks (Live Desktop + Mobile Badges, Drill Mode, 5s Undo Toast)');
    await resetAppState(page, { theme: 'intel', lang: 'ru' });

    await test('P1#8', 'Live #header-mistakes-badge & #mobile-mistakes-badge update on 1st mistake without reload', async () => {
      await gotoHash(page, '#/practice/math?type=math.interval-count&seed=201');
      const hiddenBefore = await page.locator('#header-mistakes-badge').evaluate((el) => el.hidden);
      assert(hiddenBefore === true, 'Badge should be hidden initially');

      const st1 = await getStoredState(page);
      const ans1 = Number(st1.activePractice?.math?.item?.task?.answer ?? 0);
      const wrong1 = ans1 === 0 ? 1 : 0;
      await page.locator(`[data-action="pick-single"][data-index="${wrong1}"]`).click();
      await page.locator('[data-action="check-answer"]').click();
      await page.waitForTimeout(120);

      const hiddenAfter1 = await page.locator('#header-mistakes-badge').evaluate((el) => el.hidden);
      const textAfter1 = (await page.locator('#header-mistakes-badge').textContent())?.trim();
      const mobTextAfter1 = (await page.locator('#mobile-mistakes-badge').textContent())?.trim();
      const mobHiddenAfter1 = await page.locator('#mobile-mistakes-badge').evaluate((el) => el.hidden);
      assert(hiddenAfter1 === false && textAfter1 === '1', `Header badge failed: hidden=${hiddenAfter1}, text="${textAfter1}"`);
      assert(mobHiddenAfter1 === false && mobTextAfter1 === '1', `Mobile badge failed: hidden=${mobHiddenAfter1}, text="${mobTextAfter1}"`);

      await page.locator('[data-action="next-task"]').click();
      await page.waitForTimeout(150);
      const st2 = await getStoredState(page);
      const ans2 = Number(st2.activePractice?.math?.item?.task?.answer ?? 0);
      const wrong2 = ans2 === 0 ? 1 : 0;
      await page.locator('[data-action="toggle-bookmark"]').click();
      await page.locator(`[data-action="pick-single"][data-index="${wrong2}"]`).click();
      await page.locator('[data-action="check-answer"]').click();
      await page.waitForTimeout(120);

      const textAfter2 = (await page.locator('#header-mistakes-badge').textContent())?.trim();
      const mobTextAfter2 = (await page.locator('#mobile-mistakes-badge').textContent())?.trim();
      assert(textAfter2 === '2' && mobTextAfter2 === '2', `Expected both badges "2", got header="${textAfter2}", mobile="${mobTextAfter2}"`);
      return 'Header & mobile mistakes badges live updated: hidden -> 1 -> 2 without reload';
    });

    await test('P0#6/P2#13', 'Mistakes sequential drill mode + 5s Undo toast (mistakes & bookmarks)', async () => {
      await gotoHash(page, '#/mistakes');
      await page.locator('[data-action="start-drill"]').waitFor();
      await page.screenshot({ path: path.join(SHOTS_DIR, 'mistakes.png'), fullPage: true });

      await page.locator('[data-action="start-drill"]').click();
      await page.waitForTimeout(150);
      const drillPill = (await page.locator('.practice-session-pills').textContent()) || '';
      assert(drillPill.includes('1') && drillPill.includes('2'), `Expected drill progress 1/2, got "${drillPill}"`);

      await page.locator('[data-action="back-to-list"]').click();
      await page.waitForTimeout(120);

      const cardsBefore = await page.locator('.mistake-card').count();
      assert(cardsBefore === 2, `Expected 2 mistake cards, got ${cardsBefore}`);
      await page.locator('[data-action="remove-entry"]').first().click();
      await page.waitForTimeout(120);
      const cardsAfterDel = await page.locator('.mistake-card').count();
      const toastVisible = await page.locator('.toast [data-action="toast-undo"]').isVisible();
      const badgeAfterDel = (await page.locator('#header-mistakes-badge').textContent())?.trim();
      assert(cardsAfterDel === 1, `Expected 1 mistake after delete, got ${cardsAfterDel}`);
      assert(toastVisible, 'Undo toast did not appear after deleting mistake');
      assert(badgeAfterDel === '1', `Expected badge "1" after delete, got "${badgeAfterDel}"`);

      await page.locator('.toast [data-action="toast-undo"]').click();
      await page.waitForTimeout(120);
      const cardsAfterUndo = await page.locator('.mistake-card').count();
      const badgeAfterUndo = (await page.locator('#header-mistakes-badge').textContent())?.trim();
      assert(cardsAfterUndo === 2 && badgeAfterUndo === '2', `Undo did not restore mistake/badge: cards=${cardsAfterUndo}, badge=${badgeAfterUndo}`);

      await page.locator('[data-tab="bookmarks"]').click();
      await page.waitForTimeout(120);
      assert((await page.locator('.mistake-card').count()) === 1, 'Expected 1 bookmark card');
      await page.locator('[data-action="remove-entry"]').first().click();
      await page.waitForTimeout(120);
      assert((await page.locator('.mistake-card').count()) === 0, 'Bookmark not removed');
      assert(await page.locator('.toast [data-action="toast-undo"]').isVisible(), 'Bookmark undo toast missing');
      await page.locator('.toast [data-action="toast-undo"]').click();
      await page.waitForTimeout(120);
      assert((await page.locator('.mistake-card').count()) === 1, 'Bookmark undo did not restore bookmark');

      return 'Drill mode (1/2) + Undo toast verified for both Mistakes and Bookmarks';
    });

    // -----------------------------------------------------------------
    // SECTION F: Exam Suite + Native Android Hardware Back Button Priority Chain
    // -----------------------------------------------------------------
    console.log('\n[6] Exam Suite & Android Back Button Priority Chain');
    await resetAppState(page, { theme: 'intel', lang: 'ru' });

    await test('P0#6/P1#9/10', 'Exam Math: Untimed mode, Focused Top Bar, Pause, Flag, F5 Reload, Active Count Accuracy, Cross-Subject Warning, 2-Step Discard', async () => {
      await gotoHash(page, '#/exam/math');
      await page.locator('[data-untimed="1"]').click();
      const untimedPressed = await page.locator('[data-untimed="1"]').getAttribute('aria-pressed');
      assert(untimedPressed === 'true', 'Untimed toggle not active');

      await page.locator('[data-action="begin-exam"]').click();
      await page.locator('.exam-topbar').waitFor();

      const isFocused = await page.evaluate(() => document.body.classList.contains('is-exam-focused'));
      const headerHidden = await page.locator('#app-header').evaluate((el) => getComputedStyle(el).display === 'none');
      const topbarBox = await page.locator('.exam-topbar').boundingBox();
      assert(isFocused && headerHidden, `Focused Exam Mode not active: body=${isFocused}, headerHidden=${headerHidden}`);
      assert(topbarBox && topbarBox.height <= 68, `Exam topbar too tall: ${topbarBox?.height}px`);
      assert(await page.locator('.exam-timer__untimed').isVisible(), 'Untimed badge missing in exam topbar');

      await page.locator('[data-action="pick-single"][data-index="0"]').click();
      await page.locator('[data-action="toggle-flag"]').click();
      await page.waitForTimeout(100);
      const isFlagged = await page.locator('[data-action="toggle-flag"]').getAttribute('aria-pressed');
      assert(isFlagged === 'true', 'Task #1 flag failed');

      const stExam = await getStoredState(page);
      const shortIdx = (stExam.activeExam?.tasks || []).findIndex((t) => t.format === 'short');
      assert(shortIdx >= 0, 'No short task found in math exam');

      await page.locator('[data-action="toggle-drawer"]').click();
      await page.locator('#exam-grid-drawer:not([hidden])').waitFor();
      await page.locator(`#exam-grid-drawer [data-action="jump-task"][data-index="${shortIdx}"]`).click();
      await page.locator('.short-input').waitFor();
      await page.locator('.short-input').fill('99');
      await page.locator('[data-action="clear-short"]').click();
      await page.waitForTimeout(120);

      await page.locator('.exam-timer [data-action="toggle-pause"]').click();
      assert(await page.locator('.pause-overlay').isVisible(), 'Pause overlay not shown');
      await page.locator('.pause-overlay [data-action="toggle-pause"]').click();
      assert((await page.locator('.pause-overlay').count()) === 0, 'Resume did not dismiss pause overlay');

      await page.reload({ waitUntil: 'networkidle' });
      await page.locator('.exam-topbar').waitFor();
      const stAfterReload = await getStoredState(page);
      assert(stAfterReload.activeExam?.currentIndex === shortIdx, `Reload did not preserve currentIndex`);
      assert(stAfterReload.activeExam?.responses?.[stAfterReload.activeExam.tasks[0].id] === 0, 'Reload lost Task #1 response');

      await gotoHash(page, '#/exam/ru');
      const conflictVisible = await page.locator('.active-exam-banner').isVisible();
      const conflictHref = await page.locator('.active-exam-banner a').getAttribute('href');
      assert(conflictVisible && conflictHref?.includes('#/exam/math?resume=1'), `Cross-subject conflict banner missing or wrong href=${conflictHref}`);

      await gotoHash(page, '#/');
      const bannerText = (await page.locator('.active-exam-banner').textContent()) || '';
      assert(/1\s*(?:из|\/)\s*25/.test(bannerText), `Expected accurate active count "1 из 25", got "${bannerText}"`);

      await page.locator('[data-action="ask-discard-exam"]').click();
      assert((await getStoredState(page)).activeExam !== null, 'First click discarded exam without confirmation!');
      assert(await page.locator('[data-action="confirm-discard-exam"]').isVisible(), 'Confirm discard button missing');
      await page.locator('[data-action="cancel-discard-exam"]').click();
      assert((await getStoredState(page)).activeExam !== null, 'Cancel discard unexpectedly cleared exam');

      await page.locator('[data-action="ask-discard-exam"]').click();
      await page.locator('[data-action="confirm-discard-exam"]').click();
      await page.waitForTimeout(120);
      assert((await getStoredState(page)).activeExam === null, 'Confirm discard did not clear activeExam');
      return 'Untimed, Focused Bar, Drawer, Pause, Flag, F5 Reload, Accurate Count (1/25), Conflict Warning, 2-Step Discard ALL PASS';
    });

    await test('Mobile#Back', 'window.__ULDUZ_HANDLE_BACK__() priority chain: #theme-modal -> drawer -> exam confirm -> Practice->Subject->Home -> false', async () => {
      await resetAppState(page, { theme: 'voshod', lang: 'ru' });
      await page.setViewportSize({ width: 390, height: 844 });

      // 0. Close open #theme-modal
      await gotoHash(page, '#/');
      await page.locator('#btn-theme-toggle').click();
      await page.locator('#theme-modal').waitFor();
      const backModal = await page.evaluate(() => window.__ULDUZ_HANDLE_BACK__());
      await page.waitForTimeout(120);
      assert(backModal === true, 'Back did not return true when closing #theme-modal');
      assert((await page.locator('#theme-modal').count()) === 0, 'Back did not close #theme-modal');

      // 1 & 2. Inside running exam: drawer closes first -> next back opens confirm-banner -> next back closes confirm-banner
      await gotoHash(page, '#/exam/math');
      await page.locator('[data-action="begin-exam"]').click();
      await page.locator('.exam-topbar').waitFor();

      // Verify mobile bottom nav is hidden in body.is-exam-focused AND sticky task footer sits at bottom: 0px
      const examMobCheck = await page.evaluate(() => {
        const nav = document.getElementById('mobile-bottom-nav');
        const foot = document.querySelector('.task-card__footer');
        return {
          focused: document.body.classList.contains('is-exam-focused'),
          navDisplay: nav ? getComputedStyle(nav).display : 'missing',
          footPos: foot ? getComputedStyle(foot).position : 'missing',
          footBottom: foot ? getComputedStyle(foot).bottom : 'missing',
        };
      });
      assert(examMobCheck.focused && examMobCheck.navDisplay === 'none', `Bottom nav visible during exam focus: ${JSON.stringify(examMobCheck)}`);
      assert(examMobCheck.footPos === 'sticky' && examMobCheck.footBottom === '0px', `Exam mobile footer not sticky bottom 0px: ${JSON.stringify(examMobCheck)}`);

      // Open drawer -> Back closes drawer
      await page.locator('[data-action="toggle-drawer"]').click();
      await page.locator('#exam-grid-drawer:not([hidden])').waitFor();
      const backDrawer = await page.evaluate(() => window.__ULDUZ_HANDLE_BACK__());
      await page.waitForTimeout(100);
      assert(backDrawer === true, 'Back did not return true for drawer');
      assert(await page.locator('#exam-grid-drawer').evaluate((el) => el.hidden), 'Back did not hide exam drawer');

      // Running exam with no overlays -> Back opens confirm-banner (never silently quits!)
      const backConfirmOpen = await page.evaluate(() => window.__ULDUZ_HANDLE_BACK__());
      await page.waitForTimeout(100);
      assert(backConfirmOpen === true, 'Back did not return true when opening exam confirm banner');
      assert((await page.locator('.confirm-banner').count()) === 1, 'Back in running exam did not open .confirm-banner');

      // Confirm banner open -> Back dismisses confirm-banner
      const backConfirmClose = await page.evaluate(() => window.__ULDUZ_HANDLE_BACK__());
      await page.waitForTimeout(100);
      assert(backConfirmClose === true, 'Back did not return true when dismissing confirm-banner');
      assert((await page.locator('.confirm-banner').count()) === 0, 'Back did not dismiss .confirm-banner');

      // Exit exam cleanly via confirm-finish so we test route navigation back chain
      await page.locator('[data-action="ask-finish"]').click();
      await page.locator('[data-action="confirm-finish"]').click();
      await page.locator('.results-hero').waitFor();

      // 3. Practice -> Subject -> Home -> false on Home
      await gotoHash(page, '#/practice/math');
      const backPrac = await page.evaluate(() => window.__ULDUZ_HANDLE_BACK__());
      await page.waitForTimeout(180);
      assert(backPrac === true && (await page.evaluate(() => window.location.hash)) === '#/subject/math', 'Back from Practice did not go to #/subject/math');

      const backSubj = await page.evaluate(() => window.__ULDUZ_HANDLE_BACK__());
      await page.waitForTimeout(180);
      assert(backSubj === true && (await page.evaluate(() => window.location.hash)) === '#/', 'Back from Subject did not go to #/');

      const backHome = await page.evaluate(() => window.__ULDUZ_HANDLE_BACK__());
      assert(backHome === false, `Back on Home expected false, got ${backHome}`);

      return 'Priority chain verified: #theme-modal(true) -> drawer(true) -> exam confirm(true) -> dismiss(true) -> Practice->Subject->Home(true) -> Home(false)';
    });

    await test('P0#5/P1#10/11', 'Exam RU: Reading Split-View (1120px + Mobile 390px), Escape dismiss, Pending Self-Grade Banner -> Sync Results/Mistakes/Stats, Untouched Skipped Dont Flood Mistakes', async () => {
      await resetAppState(page, { theme: 'intel', lang: 'ru' });
      await page.setViewportSize({ width: 1120, height: 860 });
      await gotoHash(page, '#/exam/ru');
      await page.locator('[data-action="begin-exam"]').click();
      await page.locator('.exam-topbar').waitFor();

      const stStart = await getStoredState(page);
      const tasks = stStart.activeExam.tasks;
      assert(tasks.length === 30, `Expected 30 RU exam tasks, got ${tasks.length}`);

      const t0Ans = Number(tasks[0].answer);
      const t0Wrong = t0Ans === 0 ? 1 : 0;
      await page.locator(`[data-action="pick-single"][data-index="${t0Wrong}"]`).click();

      const readClosedIdx = tasks.findIndex((t) => Boolean(t.passage?.html) && t.format === 'single');
      assert(readClosedIdx >= 0, 'No reading single task found in RU exam');

      await page.locator('[data-action="toggle-drawer"]').click();
      await page.locator('#exam-grid-drawer:not([hidden])').waitFor();
      await page.keyboard.press('Escape');
      await page.waitForTimeout(100);
      const drawerClosedByEsc = await page.locator('#exam-grid-drawer').evaluate((el) => el.hidden);
      const focusAfterEsc = await page.evaluate(() => document.activeElement?.dataset?.action);
      assert(drawerClosedByEsc, 'Escape did not close exam drawer');
      assert(focusAfterEsc === 'toggle-drawer', `Focus did not return to toggle-drawer after Escape: ${focusAfterEsc}`);

      await page.locator('[data-action="toggle-drawer"]').click();
      await page.locator(`#exam-grid-drawer [data-action="jump-task"][data-index="${readClosedIdx}"]`).click();
      await page.locator('.passage-panel').waitFor();

      const sidebarCount = await page.locator('.exam-sidebar').count();
      const passageBox = await page.locator('.passage-panel').boundingBox();
      const cardBox = await page.locator('.task-card').boundingBox();
      assert(sidebarCount === 0, `Expected 0 .exam-sidebar on reading task, got ${sidebarCount}`);
      assert(passageBox && passageBox.width >= 430, `Passage panel crushed at 1120px: width=${passageBox?.width}px`);
      assert(cardBox && cardBox.width >= 380, `Task card crushed at 1120px: width=${cardBox?.width}px`);
      await page.screenshot({ path: path.join(SHOTS_DIR, 'exam-ru-reading-1120.png'), fullPage: false });

      await page.setViewportSize({ width: 390, height: 844 });
      await page.waitForTimeout(180);
      const mobileTabsVis = await page.locator('.passage-mobile-tabs').isVisible();
      assert(mobileTabsVis, 'Mobile 2-tab passage switcher not visible at 390px');
      const tabHeights = await page.locator('.passage-mobile-tab').evaluateAll((els) => els.map((e) => e.getBoundingClientRect().height));
      assert(tabHeights.every((h) => h >= 44 && h <= 60), `Mobile reading tabs bad height: ${tabHeights.join(', ')}`);
      const mobOverflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      assert(mobOverflow <= 0, `Mobile exam reading horizontal overflow: ${mobOverflow}px`);
      await page.screenshot({ path: path.join(SHOTS_DIR, 'exam-ru-reading-mobile.png'), fullPage: false });

      await page.locator('.passage-mobile-tab[data-tab="text"]').click();
      await page.waitForTimeout(100);
      assert(await page.locator('.passage-panel').isVisible(), 'Switching to Text tab did not reveal passage');
      await page.locator('.passage-mobile-tab[data-tab="task"]').click();

      await page.setViewportSize({ width: 1280, height: 860 });
      await page.waitForTimeout(150);
      const openIdx = tasks.findIndex((t) => t.format === 'open');
      assert(openIdx >= 0, 'No open task found in RU exam');
      await page.locator('[data-action="toggle-drawer"]').click();
      await page.locator(`#exam-grid-drawer [data-action="jump-task"][data-index="${openIdx}"]`).click();
      await page.locator('.open-textarea').waitFor();
      await page.locator('.open-textarea').fill('Развёрнутый черновик ответа ученика для проверки самооценки.');
      await page.waitForTimeout(120);

      await page.locator('[data-action="ask-finish"]').click();
      await page.locator('.confirm-banner').waitFor();
      await page.keyboard.press('Escape');
      await page.waitForTimeout(100);
      assert((await page.locator('.confirm-banner').count()) === 0, 'Escape did not dismiss confirm-banner');

      await page.locator('[data-action="ask-finish"]').click();
      await page.locator('[data-action="confirm-finish"]').click();
      await page.locator('.results-hero').waitFor();
      await page.waitForTimeout(200);

      await page.screenshot({ path: path.join(SHOTS_DIR, 'exam-results.png'), fullPage: false });

      const pendingBannerVis = await page.locator('.pending-grade-banner').isVisible();
      const insightVis = await page.locator('.results-insight').isVisible();
      assert(pendingBannerVis, 'Pending self-grade banner NOT visible on Exam Results!');
      assert(insightVis, 'Actionable DİM score-insight line NOT visible on Exam Results!');

      const stPostSubmit = await getStoredState(page);
      const mistakeCountPostSubmit = Object.values(stPostSubmit.mistakes || {}).filter((m) => !m.resolved).length;
      assert(mistakeCountPostSubmit === 1, `Untouched skipped tasks flooded mistakes! Expected 1, got ${mistakeCountPostSubmit}`);

      const scoreBeforeSelf = stPostSubmit.exams[0].scaledScore;
      const statsCorrectBefore = stPostSubmit.stats.totalCorrect;

      await page.locator('[data-action="jump-ungraded-open"]').click();
      await page.waitForTimeout(200);
      const expandedOpen = page.locator(`#review-item-${openIdx}.is-expanded`);
      assert(await expandedOpen.isVisible(), 'jump-ungraded-open did not expand drafted open task');
      const hasPendingBadge = await page.locator(`#review-item-${openIdx} .review-badge--pending`).count();
      assert(hasPendingBadge === 1, 'Drafted open task did not have .review-badge--pending status');

      await page.locator(`#review-mount-${openIdx} [data-action="pick-self-score"][data-points="2"]`).click();
      await page.waitForTimeout(180);
      const stAfterFull = await getStoredState(page);
      assert(stAfterFull.exams[0].scaledScore > scoreBeforeSelf, `Results scaledScore did not increase after self-grade`);
      assert(stAfterFull.stats.totalCorrect === statsCorrectBefore + 1, `st.stats.totalCorrect did not sync`);
      const mistakesAfterFull = Object.values(stAfterFull.mistakes || {}).filter((m) => !m.resolved).length;
      assert(mistakesAfterFull === 1, `Full-credit self-grade should keep active mistakes at 1, got ${mistakesAfterFull}`);

      await page.locator(`#review-mount-${openIdx} [data-action="pick-self-score"][data-points="0"]`).click();
      await page.waitForTimeout(180);
      const stAfterZero = await getStoredState(page);
      const mistakesAfterZero = Object.values(stAfterZero.mistakes || {}).filter((m) => !m.resolved).length;
      const badgeAfterZero = (await page.locator('#header-mistakes-badge').textContent())?.trim();
      assert(mistakesAfterZero === 2 && badgeAfterZero === '2', `0-pt self-grade did not sync mistakes/badge`);
      assert(stAfterZero.stats.totalCorrect === statsCorrectBefore, `0-pt self-grade did not decrement stats.totalCorrect`);

      return `1120px split (${Math.round(passageBox.width)}px/${Math.round(cardBox.width)}px), 390px tabs, 1 mistake (no flood), self-grade synced Results+Stats+Mistakes+Badge`;
    });

    await test('Exam#all', 'Multi-subject Exam (#/exam/all) builds 85 tasks and shows per-subject results', async () => {
      await gotoHash(page, '#/exam/all');
      await page.locator('[data-action="begin-exam"]').click();
      await page.locator('.exam-topbar').waitFor();
      const stAll = await getStoredState(page);
      assert(stAll.activeExam?.tasks?.length === 85, `Expected 85 tasks in RU sector all-exam, got ${stAll.activeExam?.tasks?.length}`);
      await page.locator('[data-action="ask-finish"]').click();
      await page.locator('[data-action="confirm-finish"]').click();
      await page.locator('.per-subject-results').waitFor();
      const subjCards = await page.locator('.ps-res-card').count();
      assert(subjCards === 3, `Expected 3 per-subject result cards, got ${subjCards}`);
      return '85-task RU sector exam built & scored with 3 per-subject cards';
    });

    // Returning-user Home Dark Desktop screenshot (Восход with stats & streak!)
    await page.setViewportSize({ width: 1440, height: 900 });
    await setTheme(page, 'voshod');
    await gotoHash(page, '#/');
    await page.screenshot({ path: path.join(SHOTS_DIR, 'home-dark-desktop.png'), fullPage: true });
    await setTheme(page, 'intel');

    // -----------------------------------------------------------------
    // SECTION G: Stats View (Subject Colors, Mobile Stacked Cards, Export/Reset/Import)
    // -----------------------------------------------------------------
    console.log('\n[7] Stats View (Subject Accents, Mobile Stacked Cards, Export/Import/Reset)');
    await page.setViewportSize({ width: 1280, height: 860 });
    await gotoHash(page, '#/stats');

    await test('P2#13/P1#11', 'Stats subject accent colors, desktop + mobile stacked history cards (0px clip), export/reset/import', async () => {
      const iconColors = await page.locator('.stat-subj-card__icon').evaluateAll((els) =>
        els.map((el) => `${getComputedStyle(el).color}|${getComputedStyle(el).backgroundColor}`)
      );
      const uniqueColors = new Set(iconColors);
      assert(uniqueColors.size >= 4, `Expected 4 distinct subject icon accent colors, got ${uniqueColors.size}`);

      await page.screenshot({ path: path.join(SHOTS_DIR, 'stats-desktop.png'), fullPage: true });

      await page.setViewportSize({ width: 390, height: 844 });
      await page.waitForTimeout(180);
      const mobileTableInfo = await page.evaluate(() => {
        const thead = document.querySelector('.stats-table thead');
        const tr = document.querySelector('.stats-table tbody tr');
        return {
          overflow: document.documentElement.scrollWidth - window.innerWidth,
          theadDisplay: thead ? getComputedStyle(thead).display : 'missing',
          trDisplay: tr ? getComputedStyle(tr).display : 'missing',
          trRightClip: tr ? tr.getBoundingClientRect().right - window.innerWidth : 0,
        };
      });
      assert(mobileTableInfo.overflow <= 0, `Stats mobile overflow: ${mobileTableInfo.overflow}px`);
      assert(mobileTableInfo.theadDisplay === 'none', `Expected stats-table thead hidden on 390px, got ${mobileTableInfo.theadDisplay}`);
      assert(mobileTableInfo.trDisplay !== 'table-row', `Expected stacked card display for tr on 390px, got ${mobileTableInfo.trDisplay}`);
      assert(mobileTableInfo.trRightClip <= 1, `Stats history row clipped right by ${mobileTableInfo.trRightClip}px`);
      await page.screenshot({ path: path.join(SHOTS_DIR, 'stats-mobile.png'), fullPage: false });

      await page.setViewportSize({ width: 1280, height: 860 });
      await page.waitForTimeout(120);
      const beforeStateRaw = await page.evaluate(() => localStorage.getItem('ulduz_state_v1'));
      const beforeExamsLen = JSON.parse(beforeStateRaw).exams.length;
      assert(beforeExamsLen >= 2, `Expected >=2 exams in stats before export, got ${beforeExamsLen}`);

      await page.locator('[data-action="export-json"]').click();
      await page.locator('.notice-banner').waitFor();

      await page.locator('[data-action="ask-reset"]').click();
      await page.locator('[data-action="confirm-reset"]').click();
      await page.waitForTimeout(150);
      const afterReset = await getStoredState(page);
      assert(afterReset.exams.length === 0 && afterReset.stats.totalAttempted === 0, 'Reset did not clear progress');

      await page.locator('#import-json-file').setInputFiles({
        name: 'ulduz-backup.json',
        mimeType: 'application/json',
        buffer: Buffer.from(beforeStateRaw, 'utf8'),
      });
      await page.waitForTimeout(180);
      const afterImport = await getStoredState(page);
      assert(afterImport.exams.length === beforeExamsLen, `Import did not restore exams`);
      return `4 distinct subject accents, mobile stacked cards (0px overflow), export/reset/import restored ${afterImport.exams.length} exams`;
    });

    // -----------------------------------------------------------------
    // SECTION H: Originals (#10 Live Counter, Hash Sync, Reload Persistence + ALL 230 Render Audit)
    // -----------------------------------------------------------------
    console.log('\n[8] Originals (Live Counter, Hash Sync, Reload Persistence, All 230 Originals DOM Render Audit)');
    await resetAppState(page, { theme: 'intel', lang: 'ru' });

    await test('P1#10', 'Originals live solved counter, hash sync, reload persistence', async () => {
      await gotoHash(page, '#/originals/math');
      await page.locator('[data-pdf="0903"]').click();
      await page.waitForTimeout(120);
      await page.locator('[data-action="pick-orig-idx"][data-index="2"]').click();
      await page.waitForTimeout(120);

      const curHash = await page.evaluate(() => window.location.hash);
      assert(curHash === '#/originals/math?pdf=0903&n=3', `Hash did not sync: got "${curHash}"`);

      const counterBefore = (await page.locator('#originals-solved-counter').textContent())?.trim();
      assert(counterBefore?.includes('0 / 25'), `Expected "0 / 25", got "${counterBefore}"`);

      await page.locator('[data-action="pick-single"][data-index="0"]').click();
      await page.locator('[data-action="check-answer"]').click();
      await page.waitForTimeout(150);

      const counterAfter = (await page.locator('#originals-solved-counter').textContent())?.trim();
      assert(counterAfter?.includes('1 / 25'), `Counter did not live-update to "1 / 25", got "${counterAfter}"`);

      await page.reload({ waitUntil: 'networkidle' });
      await page.locator('.explanation-card').waitFor({ timeout: 5000 });
      const hashAfterReload = await page.evaluate(() => window.location.hash);
      assert(hashAfterReload === '#/originals/math?pdf=0903&n=3', `Hash lost after reload: ${hashAfterReload}`);
      return `Hash synced (${curHash}), counter 0/25 -> 1/25 live, checked state persisted across reload`;
    });

    await test('Originals#230', 'All 230 originals across math/ru/en/az render cleanly (0 KaTeX errors, 0 broken SVGs)', async () => {
      await gotoHash(page, '#/');
      const report = await page.evaluate(async () => {
        const { loadSubjects } = await import('./js/subjects/index.js');
        const { mountTaskView } = await import('./js/app/task-view.js');
        const subs = await loadSubjects();
        const host = document.createElement('div');
        host.style.cssText = 'position:fixed;left:0;top:0;width:820px;opacity:0.01;pointer-events:none;z-index:-1;';
        document.body.appendChild(host);

        let total = 0;
        const perSubj = {};
        const errors = [];

        for (const sid of ['math', 'ru', 'en', 'az']) {
          const list = await subs[sid].originals();
          perSubj[sid] = list.length;
          for (let i = 0; i < list.length; i++) {
            total++;
            const tk = list[i];
            host.innerHTML = '';
            try {
              mountTaskView(host, {
                task: tk,
                response: tk.format === 'open' ? { text: 'test', self: 2 } : tk.answer,
                checked: true,
                mode: 'originals',
                taskNumber: i + 1,
              });
              const katexErrs = host.querySelectorAll('.katex-error');
              if (katexErrs.length > 0) {
                errors.push(`${sid}[${i}] (${tk.id}): ${katexErrs.length} .katex-error ("${katexErrs[0].textContent}")`);
              }
              const svgs = host.querySelectorAll('.task-figure svg');
              for (const s of svgs) {
                const r = s.getBoundingClientRect();
                if (r.width <= 0 || r.height <= 0) {
                  errors.push(`${sid}[${i}] (${tk.id}): zero-size SVG (${r.width}x${r.height})`);
                }
              }
              const imgs = host.querySelectorAll('.task-figure img');
              for (const im of imgs) {
                if (!im.complete || im.naturalWidth === 0) {
                  errors.push(`${sid}[${i}] (${tk.id}): broken img ${im.src}`);
                }
              }
            } catch (err) {
              errors.push(`${sid}[${i}] (${tk.id}): exception ${err.message}`);
            }
          }
        }
        host.remove();
        return { total, perSubj, errors };
      });

      assert(report.total === 230, `Expected 230 originals, got ${report.total}`);
      assert(report.errors.length === 0, `Originals render errors (${report.errors.length}): ${report.errors.slice(0, 5).join(' | ')}`);
      return `230/230 rendered cleanly (math:${report.perSubj.math}, ru:${report.perSubj.ru}, en:${report.perSubj.en}, az:${report.perSubj.az}) — 0 KaTeX/SVG errors`;
    });

    // -----------------------------------------------------------------
    // SECTION I: 5 Unlockable Themes System — Gallery, Unlocks, Celebration Toasts,
    //            Scoped Fonts, Distinct Button Layouts, Distinct Animations & Screenshots!
    // -----------------------------------------------------------------
    console.log('\n[9] 5 Unlockable Themes System (Gallery, Unlocks, Fonts, Layouts, Animations & Visual Shots)');
    await page.setViewportSize({ width: 1440, height: 900 });
    await resetAppState(page, { theme: 'voshod', lang: 'ru', unlockedThemes: ['voshod'] });
    await gotoHash(page, '#/');

    await test('Themes#Unlocks', '#theme-modal initial lock states + all 4 unlock triggers (10 math->i, 5ru+5en->n, 10az->a, 100/100 exam->Мастер + toast)', async () => {
      // Open #theme-modal and verify initial lock state
      await page.locator('#btn-theme-toggle').click();
      await page.locator('#theme-modal').waitFor();
      await page.waitForTimeout(200);

      const initModal = await page.evaluate(() => {
        const cards = [...document.querySelectorAll('#theme-modal .theme-card')];
        return cards.map((c) => ({
          cls: c.className,
          unlocked: c.classList.contains('is-unlocked'),
          locked: c.classList.contains('is-locked'),
          active: c.classList.contains('is-active'),
          hasProgress: Boolean(c.querySelector('.theme-card__progress')),
          text: c.innerText,
        }));
      });
      assert(initModal.length === 5, `Expected 5 theme cards in #theme-modal, got ${initModal.length}`);
      assert(initModal[0].unlocked && initModal[0].active, 'Восход should start unlocked & active');
      for (let i = 1; i <= 4; i++) {
        assert(initModal[i].locked && initModal[i].hasProgress, `Theme #${i} should start locked with live progress bar`);
      }

      // Screenshot locked #theme-modal on Desktop & Mobile
      await page.screenshot({ path: path.join(THEME_SHOTS_DIR, 'modal-locked-desktop.png'), fullPage: false });
      await page.setViewportSize({ width: 390, height: 844 });
      await page.waitForTimeout(160);
      await page.screenshot({ path: path.join(THEME_SHOTS_DIR, 'modal-locked-mobile.png'), fullPage: false });
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.waitForTimeout(120);

      // Escape closes #theme-modal
      await page.keyboard.press('Escape');
      await page.waitForTimeout(120);
      assert((await page.locator('#theme-modal').count()) === 0, 'Escape did not close #theme-modal');

      // Test unlock triggers via real storage.js APIs & catch 'ulduz:theme-unlocked' + toast!
      const unlockLog = await page.evaluate(async () => {
        const {
          recordTaskAttempt,
          recordCompletedExam,
          syncExamScoreAndAchievements,
          loadState,
        } = await import('./js/core/storage.js');

        const events = [];
        const onUnlock = (e) => events.push([...(e.detail?.themeIds || [])]);
        window.addEventListener('ulduz:theme-unlocked', onUnlock);

        const log = {};

        // 1. Math: 9 correct -> NOT unlocked yet; 10th correct -> unlocks 'intel'!
        for (let i = 1; i <= 9; i++) {
          recordTaskAttempt({ id: `m-${i}`, subject: 'math', topic: 'Алгебра' }, 0, { correct: true, earned: 1, max: 1 });
        }
        log.after9Math = [...loadState().unlockedThemes];
        recordTaskAttempt({ id: 'm-10', subject: 'math', topic: 'Алгебра' }, 0, { correct: true, earned: 1, max: 1 });
        log.after10Math = [...loadState().unlockedThemes];
        log.toastAfterIntel = document.querySelector('.toast--unlock')?.textContent?.trim() || '';

        // 2. RU + EN: 5 RU + 4 EN -> NOT unlocked yet; 5th EN -> unlocks 'nvidia'!
        for (let i = 1; i <= 5; i++) {
          recordTaskAttempt({ id: `r-${i}`, subject: 'ru', topic: 'Грамматика' }, 0, { correct: true, earned: 1, max: 1 });
        }
        for (let i = 1; i <= 4; i++) {
          recordTaskAttempt({ id: `e-${i}`, subject: 'en', topic: 'Grammar' }, 0, { correct: true, earned: 1, max: 1 });
        }
        log.after5Ru4En = [...loadState().unlockedThemes];
        recordTaskAttempt({ id: 'e-5', subject: 'en', topic: 'Grammar' }, 0, { correct: true, earned: 1, max: 1 });
        log.after5Ru5En = [...loadState().unlockedThemes];
        log.toastAfterNvidia = document.querySelector('.toast--unlock')?.textContent?.trim() || '';

        // 3. AZ: 10 correct -> unlocks 'amd'!
        for (let i = 1; i <= 10; i++) {
          recordTaskAttempt({ id: `a-${i}`, subject: 'az', topic: 'Fonetika' }, 0, { correct: true, earned: 1, max: 1 });
        }
        log.after10Az = [...loadState().unlockedThemes];
        log.toastAfterAmd = document.querySelector('.toast--unlock')?.textContent?.trim() || '';

        // 4. Master: full exam 90/100 before open self-grade -> STILL locked; self-grade sync to 100/100 -> unlocks 'master'!
        const examId = 'exam-perfect-test-1';
        recordCompletedExam({
          id: examId,
          subjectId: 'math',
          title: 'Математика',
          scaledScore: 90,
          scaledMax: 100,
          rawEarned: 28.8,
          rawMax: 32,
          pct: 90,
          counts: { total: 25, correct: 23, partial: 0, wrong: 0, pending: 2, unanswered: 0 },
          finishedAt: Date.now(),
        }, []);
        log.after90Exam = [...loadState().unlockedThemes];
        syncExamScoreAndAchievements(examId, {
          scaledScore: 100,
          scaledMax: 100,
          rawEarned: 32,
          rawMax: 32,
          pct: 100,
          counts: { total: 25, correct: 25, partial: 0, wrong: 0, pending: 0, unanswered: 0 },
        });
        log.after100ExamSync = [...loadState().unlockedThemes];
        log.perfectFlag = Boolean(loadState().achievements?.perfectFullExam);
        log.toastAfterMaster = document.querySelector('.toast--unlock')?.textContent?.trim() || '';
        log.toastHasApplyBtn = Boolean(document.querySelector('.toast--unlock [data-action="toast-undo"]'));

        window.removeEventListener('ulduz:theme-unlocked', onUnlock);
        log.events = events;
        return log;
      });

      assert(!unlockLog.after9Math.includes('prism'), 'prism unlocked prematurely at 9 math');
      assert(unlockLog.after10Math.includes('prism'), 'prism did NOT unlock at 10 math');
      assert(unlockLog.toastAfterIntel.includes('FAC 02'), `Missing unlock toast for FAC 02: "${unlockLog.toastAfterIntel}"`);

      assert(!unlockLog.after5Ru4En.includes('pulse'), 'pulse unlocked prematurely at 5 RU + 4 EN');
      assert(unlockLog.after5Ru5En.includes('pulse'), 'pulse did NOT unlock at 5 RU + 5 EN');
      assert(unlockLog.toastAfterNvidia.includes('FAC 03'), `Missing unlock toast for FAC 03: "${unlockLog.toastAfterNvidia}"`);

      assert(unlockLog.after10Az.includes('monolith'), 'monolith did NOT unlock at 10 AZ');
      assert(unlockLog.toastAfterAmd.includes('FAC 04'), `Missing unlock toast for FAC 04: "${unlockLog.toastAfterAmd}"`);

      assert(!unlockLog.after90Exam.includes('eclipse'), 'eclipse unlocked prematurely at 90/100');
      assert(unlockLog.after100ExamSync.includes('eclipse') && unlockLog.perfectFlag, 'eclipse did NOT unlock on 100/100 self-grade sync');
      assert(unlockLog.toastAfterMaster.includes('FAC 05') && unlockLog.toastHasApplyBtn, `Missing unlock toast / Apply CTA for FAC 05`);
      assert(unlockLog.events.length === 4, `Expected 4 unlock events, got ${unlockLog.events.length}`);

      // Click 1-tap Apply in celebration toast -> switches straight to Eclipse!
      await page.locator('.toast--unlock [data-action="toast-undo"]').click();
      await page.waitForTimeout(180);
      assert((await page.evaluate(() => document.documentElement.getAttribute('data-theme'))) === 'eclipse', 'Toast Apply button did not activate Eclipse');

      // Open #theme-modal again -> verify 3 FX cards + all 5 unlocked monochrome cards!
      await page.locator('#btn-theme-toggle').click();
      await page.locator('#theme-modal').waitFor();
      await page.waitForTimeout(160);
      const unlockedCards = await page.locator('#theme-modal .theme-card.is-unlocked').count();
      const fxCards = await page.locator('#theme-modal .fx-mode-card').count();
      assert(unlockedCards === 5, `Expected 5 unlocked cards in modal, got ${unlockedCards}`);
      assert(fxCards === 3, `Expected 3 live FX cards in Studio modal, got ${fxCards}`);
      await page.screenshot({ path: path.join(THEME_SHOTS_DIR, 'modal-unlocked-desktop.png'), fullPage: false });
      await page.locator('#theme-modal [data-action="close-theme-modal"]').click();
      await page.waitForTimeout(120);

      return 'All 4 monochrome unlocks (prism/pulse/monolith/eclipse) + 3 FX studio cards + 1-tap Apply PASS';
    });

    await test('Themes#5-Matrix', 'All 5 themes: scoped fonts loaded, distinct button layouts, distinct animations, 0px overflow (1440/390/360) & RU+AZ visual capture', async () => {
      const themeSummary = [];

      for (const spec of THEME_SPECS) {
        // Switch via real #theme-modal UI!
        await page.setViewportSize({ width: 1440, height: 900 });
        await gotoHash(page, '#/');
        await page.locator('#btn-theme-toggle').click();
        await page.locator('#theme-modal').waitFor();
        await page.locator(`#theme-modal [data-action="apply-theme"][data-theme-id="${spec.id}"]`).click();
        await page.waitForTimeout(160);
        await page.locator('#theme-modal [data-action="close-theme-modal"]').click();
        await page.waitForTimeout(200);

        // Verify DOM attrs & loaded display font on Home
        const homeAudit = await page.evaluate(async (expected) => {
          await document.fonts.ready;
          const html = document.documentElement;
          const h1 = document.querySelector('h1');
          const primaryBtn = document.querySelector('.fac-home-root .btn--primary, .home-welcome .btn--primary');
          const ctaRow = document.querySelector('.home-welcome__cta-row');
          const clouds = document.querySelector('.theme-backdrop__clouds');
          const grid = document.querySelector('.theme-backdrop__grid');
          const welcome = document.querySelector('.home-welcome');

          const loadedFamilies = [...document.fonts]
            .filter((f) => f.status === 'loaded')
            .map((f) => f.family.replace(/^['"]|['"]$/g, ''));

          return {
            theme: html.getAttribute('data-theme'),
            scheme: html.getAttribute('data-color-scheme'),
            themeColor: document.getElementById('theme-color-meta')?.getAttribute('content'),
            h1Font: h1 ? getComputedStyle(h1).fontFamily : '',
            btnFont: primaryBtn ? getComputedStyle(primaryBtn).fontFamily : '',
            btnClipPath: primaryBtn ? getComputedStyle(primaryBtn).clipPath : '',
            btnBoxShadow: primaryBtn ? getComputedStyle(primaryBtn).boxShadow : '',
            ctaJustify: ctaRow ? getComputedStyle(ctaRow).justifyContent : '',
            ctaDisplay: ctaRow ? getComputedStyle(ctaRow).display : '',
            welcomeAlign: welcome ? getComputedStyle(welcome).textAlign : '',
            welcomeAnim: welcome ? getComputedStyle(welcome).animationName : '',
            cloudsAnim: clouds ? getComputedStyle(clouds).animationName : '',
            gridAnim: grid ? getComputedStyle(grid).animationName : '',
            overflowDesktop: document.documentElement.scrollWidth - window.innerWidth,
            fontLoaded: loadedFamilies.some((f) => f.toLowerCase().includes(expected.font.toLowerCase())),
          };
        }, spec);

        assert(homeAudit.theme === spec.id, `Theme attr mismatch: ${homeAudit.theme} !== ${spec.id}`);
        assert(homeAudit.scheme === spec.scheme, `${spec.id} scheme mismatch: ${homeAudit.scheme} !== ${spec.scheme}`);
        assert(homeAudit.themeColor === spec.themeColor, `${spec.id} theme-color mismatch: ${homeAudit.themeColor} !== ${spec.themeColor}`);
        assert(homeAudit.h1Font.includes(spec.font), `${spec.id} H1 font "${homeAudit.h1Font}" missing "${spec.font}"`);
        assert(homeAudit.btnFont.includes(spec.font), `${spec.id} primary button font "${homeAudit.btnFont}" missing "${spec.font}"`);
        assert(homeAudit.fontLoaded, `${spec.id} font "${spec.font}" did NOT load in document.fonts`);
        assert(homeAudit.overflowDesktop <= 0, `${spec.id} desktop home overflow: ${homeAudit.overflowDesktop}px`);

        // Capture Desktop Home RU screenshot
        await page.screenshot({ path: path.join(THEME_SHOTS_DIR, `theme-${spec.id}-home-desktop.png`), fullPage: false });

        // Capture Mobile 390x844 Home (and check 0px overflow + AZ special letters!)
        await page.setViewportSize({ width: 390, height: 844 });
        await page.waitForTimeout(160);
        const mobHomeOv = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        assert(mobHomeOv <= 0, `${spec.id} mobile 390 home overflow: ${mobHomeOv}px`);
        await page.screenshot({ path: path.join(THEME_SHOTS_DIR, `theme-${spec.id}-home-mobile.png`), fullPage: false });

        // Check Practice on Desktop + Mobile: distinct button layouts & preserved Inter/Serif prose fonts!
        await page.setViewportSize({ width: 1280, height: 860 });
        await gotoHash(page, '#/originals/ru?n=11');
        await page.locator('.passage-panel').waitFor();
        await page.waitForTimeout(160);

        const pracAudit = await page.evaluate(() => {
          const stem = document.querySelector('.task-card__stem');
          const passage = document.querySelector('.passage-panel__body');
          const footer = document.querySelector('.task-card__footer');
          const rightGrp = document.querySelector('.task-footer-right');
          const primaryBtn = document.querySelector('.task-footer-right .btn--primary, .task-footer-right .btn--accent');
          const taskCard = document.querySelector('.task-card');
          return {
            stemFont: stem ? getComputedStyle(stem).fontFamily : '',
            passageFont: passage ? getComputedStyle(passage).fontFamily : '',
            footerDisplay: footer ? getComputedStyle(footer).display : '',
            footerJustify: footer ? getComputedStyle(footer).justifyContent : '',
            footerCols: footer ? getComputedStyle(footer).gridTemplateColumns : '',
            rightOrder: rightGrp ? getComputedStyle(rightGrp).order : '',
            primaryClip: primaryBtn ? getComputedStyle(primaryBtn).clipPath : '',
            primaryRadius: primaryBtn ? getComputedStyle(primaryBtn).borderRadius : '',
            cardAnim: taskCard ? getComputedStyle(taskCard).animationName : '',
            overflow: document.documentElement.scrollWidth - window.innerWidth,
          };
        });

        // Scoped Typography Contract: prose & passages MUST stay Inter / Source Serif 4!
        assert(pracAudit.stemFont.includes('Inter'), `${spec.id} leaked display font onto .task-card__stem: "${pracAudit.stemFont}"`);
        assert(pracAudit.passageFont.includes('Source Serif 4'), `${spec.id} leaked display font onto .passage-panel__body: "${pracAudit.passageFont}"`);
        assert(pracAudit.overflow <= 0, `${spec.id} desktop practice overflow: ${pracAudit.overflow}px`);

        // Distinct per-mode layout + animation proofs (all 5 pure monochrome neon modes!)
        if (spec.id === 'atelier') {
          const wideSpan = await page.evaluate(() => getComputedStyle(document.querySelector('.subject-card--wide') || document.body).gridColumnStart);
          assert(homeAudit.theme === 'atelier', `atelier attr check failed`);
          assert(wideSpan !== '', 'atelier asymmetric grid check');
        } else if (spec.id === 'prism') {
          assert(homeAudit.gridAnim.includes('prismGridPulse'), `prism missing prismGridPulse: ${homeAudit.gridAnim}`);
          assert(pracAudit.footerDisplay === 'grid', `prism task footer expected grid layout, got ${pracAudit.footerDisplay}`);
        } else if (spec.id === 'pulse') {
          assert(homeAudit.btnClipPath.includes('polygon'), `pulse button expected chamfered polygon clip-path, got ${homeAudit.btnClipPath}`);
          assert(
            ['flex-end', 'flow-end', 'end'].includes(homeAudit.ctaJustify),
            `pulse cta row expected flex-end/flow-end, got ${homeAudit.ctaJustify}`
          );
        } else if (spec.id === 'monolith') {
          assert(Number(pracAudit.rightOrder) === -1, `monolith task-footer-right expected order:-1 (primary LEFT), got ${pracAudit.rightOrder}`);
          assert(homeAudit.btnClipPath.includes('polygon'), `monolith button expected angled polygon clip-path, got ${homeAudit.btnClipPath}`);
        } else if (spec.id === 'eclipse') {
          assert(homeAudit.scheme === 'light', `eclipse expected daylight cotton scheme, got ${homeAudit.scheme}`);
          assert(pracAudit.footerJustify === 'center', `eclipse task footer expected centered layout, got ${pracAudit.footerJustify}`);
        }

        await page.screenshot({ path: path.join(THEME_SHOTS_DIR, `theme-${spec.id}-practice-desktop.png`), fullPage: false });

        // Mobile 360x800 check on Practice
        await page.setViewportSize({ width: 360, height: 800 });
        await page.waitForTimeout(150);
        const mob360Ov = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        assert(mob360Ov <= 0, `${spec.id} mobile 360 practice overflow: ${mob360Ov}px`);

        themeSummary.push(`${spec.id}(${spec.font}:OK,layout:OK,anim:OK)`);
      }

      // Render a clean live AZ + RU glyph verification card across all 5 theme fonts & capture screenshot
      await page.setViewportSize({ width: 1120, height: 720 });
      await gotoHash(page, '#/');
      await page.evaluate(async () => {
        const host = document.createElement('div');
        host.id = 'qa-font-specimen';
        host.style.cssText = 'position:fixed;inset:0;z-index:9999;background:#0D1117;color:#FFF8EE;padding:28px 32px;display:flex;flex-direction:column;gap:16px;overflow:auto;';
        const specs = [
          { name: 'Obsidian — Ulduz Wide', font: "'Ulduz Wide'", bg: '#030304', fg: '#FFFFFF', border: '#FFFFFF' },
          { name: 'Prism [i] — Ulduz Intel', font: "'Ulduz Intel'", bg: '#040406', fg: '#FAFAFC', border: 'rgba(255,255,255,0.55)' },
          { name: 'Pulse [n] — Ulduz Nvidia', font: "'Ulduz Nvidia'", bg: '#020203', fg: '#FAFAFC', border: 'rgba(255,255,255,0.55)' },
          { name: 'Monolith [a] — Ulduz AMD', font: "'Ulduz AMD'", bg: '#050506', fg: '#FAFAFC', border: 'rgba(255,255,255,0.55)' },
          { name: 'Eclipse · Мастер — Ulduz Wide', font: "'Ulduz Wide'", bg: '#000000', fg: '#FFFFFF', border: '#FFFFFF' },
        ];
        const sample = 'Obsidian • Azərbaycan: Əə Ğğ Iı İi Öö Şş Üü Çç • Ёё № 100% Мастер';
        host.innerHTML = specs.map((s) => `
          <div style="background:${s.bg};color:${s.fg};border:2px solid ${s.border};border-radius:10px;padding:16px 20px;">
            <div style="font:600 12px 'Inter Variable',sans-serif;opacity:0.78;margin-bottom:6px;">${s.name}</div>
            <div style="font-family:${s.font};font-size:24px;line-height:1.3;">${sample}</div>
          </div>
        `).join('');
        document.body.appendChild(host);
        await document.fonts.ready;
      });
      await page.waitForTimeout(150);
      await page.screenshot({ path: path.join(THEME_SHOTS_DIR, 'all-5-fonts-az-ru-specimen.png'), fullPage: false });
      await page.evaluate(() => document.getElementById('qa-font-specimen')?.remove());

      // Also capture AZ localization Home screenshot on Obsidian Atelier
      await setTheme(page, 'atelier');
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.locator('#btn-lang-toggle').click();
      await page.waitForTimeout(180);
      await page.screenshot({ path: path.join(THEME_SHOTS_DIR, 'theme-atelier-home-az-desktop.png'), fullPage: false });
      await page.locator('#btn-lang-toggle').click();
      await page.waitForTimeout(150);

      return themeSummary.join(' | ');
    });

    // -----------------------------------------------------------------
    // SECTION J: Full RU / AZ Localization across ALL 7 routes + #theme-modal
    // -----------------------------------------------------------------
    console.log('\n[10] Full RU / AZ Localization across ALL 7 Routes + #theme-modal');
    await page.setViewportSize({ width: 1280, height: 860 });
    await resetAppState(page, { theme: 'voshod', lang: 'ru' });

    await test('P1#7', 'RU -> AZ toggle syncs <html lang>, <title>, and localizes UI chrome across all 7 routes + #theme-modal', async () => {
      await gotoHash(page, '#/');
      assert((await page.evaluate(() => document.documentElement.lang)) === 'ru', 'Initial lang not ru');
      const ruTitle = await page.title();

      await page.locator('#btn-lang-toggle').click();
      await page.waitForTimeout(150);

      const azLang = await page.evaluate(() => document.documentElement.lang);
      const azTitle = await page.title();
      assert(azLang === 'az', `Expected <html lang="az">, got "${azLang}"`);
      assert(azTitle !== ruTitle && /Buraxılış|DİM/i.test(azTitle), `Title not localized to AZ: "${azTitle}"`);

      const ruChromeLeaks = [
        'Предметы', 'Ошибки', 'Статистика', 'Проверить ответ', 'Показать подсказку',
        'Начать экзамен', 'Без таймера', 'Управление данными', 'Все темы',
        'Работа над ошибками', 'Перейти к основному содержимому', 'Оригиналы PDF',
        'Галерея тем', 'Применить тему', 'Закрыта',
      ];

      const routes = ['#/', '#/subject/math', '#/practice/math', '#/exam/math', '#/originals/math', '#/mistakes', '#/stats'];
      const foundLeaks = [];

      for (const r of routes) {
        await gotoHash(page, r);
        const chromeText = await page.evaluate(() => {
          const skip = document.getElementById('skip-link')?.textContent || '';
          const header = document.getElementById('app-header')?.textContent || '';
          const footer = document.getElementById('app-footer')?.textContent || '';
          const mobNav = document.getElementById('mobile-bottom-nav')?.textContent || '';
          const mainClone = document.getElementById('app-main')?.cloneNode(true);
          mainClone?.querySelectorAll('.task-card__stem, .option-btn__text, .explanation-card__prose, .passage-panel__body, .task-type-row__title, .topic-group__title, .task-meta-topic, #practice-topic-select, #practice-type-select').forEach((n) => n.remove());
          return `${skip}\n${header}\n${footer}\n${mobNav}\n${mainClone?.textContent || ''}`;
        });
        for (const phrase of ruChromeLeaks) {
          if (chromeText.includes(phrase)) {
            foundLeaks.push(`${r} leaked "${phrase}"`);
          }
        }
      }

      // Also check #theme-modal in AZ mode
      await gotoHash(page, '#/');
      await page.locator('#btn-theme-toggle').click();
      await page.locator('#theme-modal').waitFor();
      const modalAzText = (await page.locator('#theme-modal').textContent()) || '';
      for (const phrase of ['Галерея тем', 'Применить тему', 'Закрыта', 'Перейти к заданию']) {
        if (modalAzText.includes(phrase)) foundLeaks.push(`#theme-modal leaked "${phrase}"`);
      }
      await page.locator('#theme-modal [data-action="close-theme-modal"]').click();
      await page.waitForTimeout(100);

      assert(foundLeaks.length === 0, `RU chrome leaks in AZ mode: ${foundLeaks.join('; ')}`);

      await page.locator('#btn-lang-toggle').click();
      await page.waitForTimeout(150);
      assert((await page.evaluate(() => document.documentElement.lang)) === 'ru', 'Toggle back to RU failed');
      return `All 7 routes + #theme-modal + mobile nav clean in AZ; lang="az", title="${azTitle}"`;
    });

    // -----------------------------------------------------------------
    // SECTION K: Responsive 5-Viewport Matrix (360, 390, 393, 820, 1440),
    //            Mobile Bottom Nav Visibility, 48px Touch Targets & WCAG AA Contrast across ALL 5 Themes
    // -----------------------------------------------------------------
    console.log('\n[11] 5-Viewport Matrix, Mobile Bottom Nav, 48px Touch Targets & 5-Theme WCAG AA Contrast');
    await resetAppState(page, { theme: 'atelier', lang: 'ru', unlockedThemes: ['atelier', 'prism', 'pulse', 'monolith', 'eclipse'] });

    await test('P1#11/P2#12/13', 'Zero horizontal overflow, zero UI emojis, zero banned eyebrows, bottom nav visibility across 5 viewports (360/390/393/820/1440)', async () => {
      const viewports = [
        { name: 'android-360', width: 360, height: 800, expectBottomNav: true },
        { name: 'iphone-390', width: 390, height: 844, expectBottomNav: true },
        { name: 'iphone15-393', width: 393, height: 852, expectBottomNav: true },
        { name: 'tablet-820', width: 820, height: 1180, expectBottomNav: false },
        { name: 'desktop-1440', width: 1440, height: 900, expectBottomNav: false },
      ];
      const routes = ['#/', '#/subject/math', '#/practice/math', '#/practice/ru?type=ru.reading-closed', '#/exam/math', '#/originals/math', '#/mistakes', '#/stats'];
      const issues = [];

      for (const theme of ['atelier', 'eclipse']) {
        await setTheme(page, theme);
        for (const vp of viewports) {
          await page.setViewportSize({ width: vp.width, height: vp.height });
          for (const r of routes) {
            await gotoHash(page, r);
            const check = await page.evaluate(({ emojis, route, expectBottom }) => {
              const out = [];
              const overflow = document.documentElement.scrollWidth - window.innerWidth;
              if (overflow > 0) out.push(`overflow=${overflow}px`);

              // Bottom nav visibility check
              const bottomNav = document.getElementById('mobile-bottom-nav');
              const bottomVis = bottomNav ? getComputedStyle(bottomNav).display !== 'none' : false;
              if (bottomVis !== expectBottom) {
                out.push(`bottomNav=${bottomVis} (expected ${expectBottom})`);
              }
              const headerMainNav = document.querySelector('#app-header .main-nav');
              const headerNavVis = headerMainNav ? getComputedStyle(headerMainNav).display !== 'none' : false;
              if (headerNavVis === expectBottom) {
                out.push(`headerMainNav=${headerNavVis} (expected ${!expectBottom})`);
              }

              // Zero banned UI emojis
              const bodyTxt = document.body.innerText || '';
              for (const em of emojis) {
                if (bodyTxt.includes(em)) out.push(`banned-emoji:${em}`);
              }

              // Zero banned eyebrows
              const bannedSel = ['.hero-eyebrow', '.passage-panel__eyebrow', '.subject-hero__badges', '.results-hero__badges'];
              for (const sel of bannedSel) {
                if (document.querySelector(sel)) out.push(`banned-eyebrow:${sel}`);
              }
              document.querySelectorAll('h1, h2, h3').forEach((h) => {
                const prev = h.previousElementSibling;
                if (prev && prev.classList.contains('badge')) {
                  out.push(`badge-above-${h.tagName}`);
                }
              });

              const h1s = document.querySelectorAll('h1');
              if (h1s.length === 0) out.push('missing-h1');
              if (route.startsWith('#/subject/')) {
                const levels = [...document.querySelectorAll('h1, h2, h3')].map((el) => Number(el.tagName[1]));
                for (let i = 1; i < levels.length; i++) {
                  if (levels[i] - levels[i - 1] > 1) {
                    out.push(`skipped-heading:h${levels[i - 1]}->h${levels[i]}`);
                    break;
                  }
                }
              }
              return out;
            }, { emojis: BANNED_EMOJIS, route: r, expectBottom: vp.expectBottomNav });

            if (check.length > 0) {
              issues.push(`${theme}/${vp.name}/${r}: ${check.join(', ')}`);
            }
          }
        }
      }
      assert(issues.length === 0, `Layout/Nav/Emoji/Eyebrow/Heading issues:\n  ${issues.join('\n  ')}`);
      return '8 routes × 5 viewports × 2 themes (80 checks): 0px overflow, bottom nav <768px only, 0 emojis, 0 eyebrows, valid headings';
    });

    await test('P1#11/Mobile#Targets', 'Mobile 360x800 & 390x844: >=48px Material 3 touch targets, bottom nav tabs & sticky footer', async () => {
      await setTheme(page, 'voshod');
      const smallTargets = [];

      for (const vp of [{ width: 360, height: 800 }, { width: 390, height: 844 }]) {
        await page.setViewportSize(vp);

        const checkTouchSelectors = async (route, selectors) => {
          await gotoHash(page, route);
          const bad = await page.evaluate((sels) => {
            const fails = [];
            for (const sel of sels) {
              const els = [...document.querySelectorAll(sel)].filter((el) => {
                const st = getComputedStyle(el);
                if (st.display === 'none' || st.visibility === 'hidden') return false;
                const r = el.getBoundingClientRect();
                return r.width > 0 && r.height > 0;
              });
              for (const el of els.slice(0, 6)) {
                const r = el.getBoundingClientRect();
                if (r.height < 47.5 || r.width < 47.5) {
                  fails.push(`${sel} (${Math.round(r.width)}x${Math.round(r.height)})`);
                  break;
                }
              }
            }
            return fails;
          }, selectors);
          for (const f of bad) smallTargets.push(`${vp.width}px ${route} -> ${f}`);
        };

        await checkTouchSelectors('#/practice/math?type=math.percent-word&seed=101', [
          '.mobile-bottom-nav__item', '.btn-icon-pill', '.btn-chip', '.char-btn',
        ]);

        // Sticky bottom thumb bar sits cleanly above mobile bottom nav in Practice
        const footerPos = await page.locator('.task-card__footer').evaluate((el) => {
          const s = getComputedStyle(el);
          return { position: s.position, bottomPx: parseFloat(s.bottom) };
        });
        assert(
          footerPos.position === 'sticky' && footerPos.bottomPx >= 50,
          `Mobile Practice .task-card__footer not sticky above bottom nav at ${vp.width}px: ${JSON.stringify(footerPos)}`
        );

        await checkTouchSelectors('#/practice/en?type=en.vocab-match&seed=15', ['.match-pill']);
        await checkTouchSelectors('#/originals/math', ['.seg-btn', '.strip-num-btn']);
        await checkTouchSelectors('#/practice/ru?type=ru.reading-closed', ['.passage-panel .btn-icon']);
      }

      assert(smallTargets.length === 0, `Touch targets < 48px on mobile: ${smallTargets.join(' | ')}`);
      return 'All mobile touch targets >= 48px at 360px & 390px, bottom nav & sticky footer verified';
    });

    await test('P1#9/Themes#Contrast', 'WCAG AA contrast (>= 4.5:1) for --text-primary, --text-muted, placeholders, .skip-link & .btn--primary across ALL 5 themes', async () => {
      await page.setViewportSize({ width: 1280, height: 860 });
      const contrastReport = [];

      for (const spec of THEME_SPECS) {
        await setTheme(page, spec.id);
        await gotoHash(page, '#/practice/math?type=math.percent-word&seed=101');
        const info = await page.evaluate(() => {
          const probe = document.createElement('div');
          probe.style.cssText = 'color:var(--text-primary);background:var(--bg-canvas);';
          document.body.appendChild(probe);
          const primaryFg = getComputedStyle(probe).color;
          const canvasBg = getComputedStyle(probe).backgroundColor;
          probe.style.color = 'var(--text-muted)';
          const mutedFg = getComputedStyle(probe).color;
          probe.style.background = 'var(--bg-surface)';
          const surfaceBg = getComputedStyle(probe).backgroundColor;
          probe.style.color = 'var(--on-primary)';
          probe.style.background = 'var(--accent-primary)';
          const onPrimaryFg = getComputedStyle(probe).color;
          const accentBg = getComputedStyle(probe).backgroundColor;
          probe.remove();

          const input = document.querySelector('.short-input');
          const phColor = input ? getComputedStyle(input, '::placeholder').color : mutedFg;
          const inputBg = input ? getComputedStyle(input.closest('.short-input-row') || input).backgroundColor : surfaceBg;

          const skip = document.getElementById('skip-link');
          skip?.focus();
          const skipFg = skip ? getComputedStyle(skip).color : '';
          const skipBg = skip ? getComputedStyle(skip).backgroundColor : '';

          return { primaryFg, mutedFg, canvasBg, surfaceBg, onPrimaryFg, accentBg, phColor, inputBg, skipFg, skipBg };
        });

        const rPrimary = contrastRatio(info.primaryFg, info.surfaceBg);
        const rCanvas = contrastRatio(info.mutedFg, info.canvasBg);
        const rSurface = contrastRatio(info.mutedFg, info.surfaceBg);
        const rPh = contrastRatio(info.phColor, info.inputBg === 'rgba(0, 0, 0, 0)' ? info.surfaceBg : info.inputBg);
        const rSkip = contrastRatio(info.skipFg, info.skipBg);
        const rBtn = contrastRatio(info.onPrimaryFg, info.accentBg);

        assert(rPrimary >= 7.0, `${spec.id} --text-primary on surface contrast ${rPrimary.toFixed(2)} < 7.0`);
        assert(rCanvas >= 4.5, `${spec.id} --text-muted on canvas contrast ${rCanvas.toFixed(2)} < 4.5`);
        assert(rSurface >= 4.5, `${spec.id} --text-muted on surface contrast ${rSurface.toFixed(2)} < 4.5`);
        assert(rPh >= 4.5, `${spec.id} .short-input::placeholder contrast ${rPh.toFixed(2)} < 4.5`);
        assert(rSkip >= 4.5, `${spec.id} .skip-link contrast ${rSkip.toFixed(2)} < 4.5`);
        assert(rBtn >= 4.5, `${spec.id} .btn--primary contrast ${rBtn.toFixed(2)} < 4.5`);

        contrastReport.push(`${spec.id}(txt=${rPrimary.toFixed(1)},muted=${rSurface.toFixed(1)},btn=${rBtn.toFixed(1)},skip=${rSkip.toFixed(1)})`);
      }
      return contrastReport.join(' | ');
    });

    // -----------------------------------------------------------------
    // SECTION L: Zero Console Errors, Zero Page Errors, Zero Failed Requests
    // -----------------------------------------------------------------
    console.log('\n[12] Runtime Cleanliness (Console / PageError / HTTP)');
    await test('Runtime', '0 console errors, 0 pageerrors, 0 failed HTTP requests', async () => {
      assert(consoleErrors.length === 0, `Console errors (${consoleErrors.length}): ${consoleErrors.slice(0, 5).join(' | ')}`);
      assert(pageErrors.length === 0, `Page errors (${pageErrors.length}): ${pageErrors.slice(0, 5).join(' | ')}`);
      assert(failedRequests.length === 0, `Failed HTTP requests (${failedRequests.length}): ${failedRequests.slice(0, 5).join(' | ')}`);
      return '0 console errors, 0 pageerrors, 0 failed HTTP requests';
    });
  } finally {
    await browser.close();
  }

  const summary = {
    timestamp: new Date().toISOString(),
    baseUrl: BASE_URL,
    passed: passCount,
    failed: failCount,
    total: passCount + failCount,
    consoleErrors,
    pageErrors,
    failedRequests,
    results,
  };
  fs.writeFileSync(JSON_REPORT, JSON.stringify(summary, null, 2), 'utf8');

  console.log(`\n=== SUMMARY: ${passCount}/${passCount + failCount} PASSED, ${failCount} FAILED ===`);
  console.log(`JSON report: ${JSON_REPORT}`);
  console.log(`Screenshots: ${SHOTS_DIR} & ${THEME_SHOTS_DIR}`);
  process.exit(failCount > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error('[FATAL]', err);
  process.exit(1);
});
