#!/usr/bin/env node
// Comprehensive E2E + Visual QA script for Ulduz v3.1.0 features:
// - Auto-update checker & top hairline banner
// - Free AI Gateways (OpenCode Zen DeepSeek default + Kilo Free auto-fallback)
// - Real per-task timing telemetry -> Visual Stats (SVG Oscillograph, Pace Matrix, Bottlenecks) + AI System Prompt
// - Unified Settings Console (#/settings) & topbar Settings button
// - RU/AZ localization purity, 360/390/1440 overflow, >=48px touch targets, and FAC 05 light contrast.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SHOTS_DIR = path.join(ROOT, 'tools', 'reports', 'shots');
const BASE_URL = process.env.ULDUZ_URL || 'http://127.0.0.1:8123/';

fs.mkdirSync(SHOTS_DIR, { recursive: true });

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
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
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

async function gotoHash(page, hash) {
  await page.evaluate((h) => { window.location.hash = h; }, hash);
  await page.waitForTimeout(260);
}

async function main() {
  const pw = await loadPlaywright();
  const browser = await pw.chromium.launch({
    headless: true,
    executablePath: findChromeExecutable(),
  });

  const consoleErrors = [];
  const pageErrors = [];

  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const txt = msg.text();
        // Ignore our intentional mocked HTTP 429 from the OpenCode -> Kilo Free fallback test
        if (txt.includes('status of 429')) return;
        consoleErrors.push(txt);
      }
    });
    page.on('pageerror', (err) => {
      pageErrors.push(err.message || String(err));
    });

    // Stub GitHub latest release API cleanly so silent startup check never hits live rate limits
    let mockLatestTag = 'v3.1.0';
    await page.route('https://api.github.com/repos/nakoulaf4/ulduz-attestat/releases/latest', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          tag_name: mockLatestTag,
          name: `Ulduz ${mockLatestTag}`,
          body: 'Auto-update test release notes: DeepSeek AI Tutor + Visual Timing Stats.',
          html_url: `https://github.com/nakoulaf4/ulduz-attestat/releases/tag/${mockLatestTag}`,
          published_at: '2026-11-25T12:00:00Z',
          assets: [
            {
              name: `Ulduz-${mockLatestTag}-android-arm64.apk`,
              browser_download_url: `https://github.com/nakoulaf4/ulduz-attestat/releases/download/${mockLatestTag}/Ulduz-${mockLatestTag}-android-arm64.apk`,
              size: 10940000,
            },
          ],
        }),
      });
    });

    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: 'networkidle' });

    console.log('\n=== ULDUZ v3.1.0 QA SUITE (AI + TIMING TELEMETRY + VISUAL STATS + SETTINGS + AUTO-UPDATE) ===');

    await test('Topbar Settings button & AI nav present on Desktop', async () => {
      assert(await page.locator('#btn-settings-link').isVisible(), '#btn-settings-link missing');
      assert(await page.locator('.main-nav a[href="#/ai"]').isVisible(), 'Desktop AI nav link missing');
      await page.locator('#btn-settings-link').click();
      await page.waitForTimeout(220);
      assert(page.url().includes('#/settings'), `Expected #/settings, got ${page.url()}`);
      assert(await page.locator('#settings-ai-heading').isVisible(), 'Settings AI section missing');
      assert(await page.locator('#settings-update-heading').isVisible(), 'Settings Auto-Update section missing');
      return 'Header gear -> #/settings verified';
    });

    await test('Default AI gateway is OpenCode Zen + DeepSeek model', async () => {
      const modelVal = await page.locator('#settings-ai-model').inputValue();
      assert(modelVal === 'deepseek-v4.1-flash-free', `Expected deepseek-v4.1-flash-free default, got "${modelVal}"`);
      const fallbackOn = await page.locator('[data-toggle-ai="autoFallback"]').getAttribute('aria-checked');
      const teleOn = await page.locator('[data-toggle-ai="shareTelemetry"]').getAttribute('aria-checked');
      assert(fallbackOn === 'true', 'Auto-fallback should default to true');
      assert(teleOn === 'true', 'Telemetry sharing should default to true');
      return `model=${modelVal}, autoFallback=true, shareTelemetry=true`;
    });

    await test('Per-task stopwatch records real durationSec across Practice & renders Ask AI button', async () => {
      await gotoHash(page, '#/practice/math?type=math.interval-count&seed=401');
      await page.waitForTimeout(1200); // >1s active solving time
      const st1 = await page.evaluate(() => JSON.parse(localStorage.getItem('ulduz_state_v1') || '{}'));
      const ans1 = Number(st1.activePractice?.math?.item?.task?.answer ?? 0);
      await page.locator(`[data-action="pick-single"][data-index="${ans1}"]`).click();
      await page.locator('[data-action="check-answer"]').click();
      await page.waitForTimeout(180);

      assert(await page.locator('[data-action="ask-ai-task"]').isVisible(), 'Ask AI button missing in explanation card');
      const timeBadge = (await page.locator('.explanation-card__time').textContent())?.trim() || '';
      assert(timeBadge.length > 0, 'Checked task duration badge missing');

      // Solve a 2nd task wrong to populate mistakes + wrong-pace telemetry
      await gotoHash(page, '#/practice/en?type=en.tenses&seed=402');
      await page.waitForTimeout(1200);
      const st2 = await page.evaluate(() => JSON.parse(localStorage.getItem('ulduz_state_v1') || '{}'));
      const ans2 = Number(st2.activePractice?.en?.item?.task?.answer ?? 0);
      const wrong2 = ans2 === 0 ? 1 : 0;
      await page.locator(`[data-action="pick-single"][data-index="${wrong2}"]`).click();
      await page.locator('[data-action="check-answer"]').click();
      await page.waitForTimeout(180);

      const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('ulduz_state_v1') || '{}'));
      assert((stored.timing?.totalTimedAttempts || 0) >= 2, `Expected >=2 timed attempts, got ${stored.timing?.totalTimedAttempts}`);
      assert((stored.timing?.totalSec || 0) >= 2, `Expected >=2 totalSec, got ${stored.timing?.totalSec}`);
      assert(Array.isArray(stored.recentAttempts) && stored.recentAttempts.length >= 2, 'recentAttempts missing');

      // Click Ask AI from task explanation
      await page.locator('[data-action="ask-ai-task"]').click();
      await page.waitForTimeout(220);
      assert(page.url().includes('#/ai?from=task'), `Expected #/ai?from=task, got ${page.url()}`);
      assert(await page.locator('.ai-task-context-card').isVisible(), 'Task context card missing in #/ai');
      return `timedAttempts=${stored.timing.totalTimedAttempts}, totalSec=${stored.timing.totalSec}s, timeBadge="${timeBadge}"`;
    });

    await test('AI Chat injects live student telemetry + auto-falls back OpenCode 429 -> Kilo Free + KaTeX', async () => {
      let capturedSystemPrompt = '';
      let openCodeHits = 0;
      let kiloHits = 0;

      await page.route('https://opencode.ai/zen/v1/chat/completions', async (route) => {
        openCodeHits++;
        await route.fulfill({
          status: 429,
          contentType: 'application/json',
          body: JSON.stringify({ error: { message: 'Anonymous rate limit reached' } }),
        });
      });

      await page.route('https://api.kilo.ai/api/gateway/chat/completions', async (route) => {
        kiloHits++;
        const post = route.request().postDataJSON();
        capturedSystemPrompt = post?.messages?.[0]?.content || '';
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            model: 'kilo-auto/free',
            choices: [
              {
                message: {
                  role: 'assistant',
                  reasoning: 'Проверяем активные ошибки и средний темп решения ученика.',
                  content: '### Разбор вашей телеметрии\n\n- Решено задач: **2** (есть активная ошибка по английскому).\n- Квадратное уравнение для проверки формул: $x^2 - 5x + 6 = 0$, корни $x_1 = 2, x_2 = 3$.\n\nРекомендую повторить времена глаголов и пройти 5 заданий в тренировке.',
                },
              },
            ],
          }),
        });
      });

      await page.locator('#ai-input').fill('Разбери мои ошибки и время решения');
      await page.locator('#ai-send-btn').click();
      await page.locator('.ai-msg--assistant').first().waitFor({ timeout: 5000 });
      await page.waitForTimeout(200);

      assert(openCodeHits === 1, `Expected 1 OpenCode attempt, got ${openCodeHits}`);
      assert(kiloHits === 1, `Expected 1 Kilo Free fallback attempt, got ${kiloHits}`);
      assert(capturedSystemPrompt.includes('АКТУАЛЬНАЯ СТАТИСТИКА И ТАЙМИНГ УЧЕНИКА'), 'System prompt missing live telemetry header');
      assert(capturedSystemPrompt.includes('Время решения'), 'System prompt missing timing metrics');
      assert(capturedSystemPrompt.includes('КОНТЕКСТ ТЕКУЩЕЙ ЗАДАЧИ'), 'System prompt missing active task context');

      const authorStamp = (await page.locator('.ai-msg--assistant .ai-msg__author').first().textContent()) || '';
      assert(authorStamp.includes('Kilo') && authorStamp.includes('OpenCode 429'), `Unexpected fallback stamp: "${authorStamp}"`);
      assert(await page.locator('.ai-msg--assistant .ai-reasoning-box').count() === 1, 'Reasoning collapsible missing');
      assert(await page.locator('.ai-msg--assistant .katex').count() >= 1, 'KaTeX did not hydrate in AI reply');
      return `OpenCode(429)->Kilo Free OK, telemetry+taskContext injected, KaTeX hydrated`;
    });

    await test('Auto-update check detects newer v3.9.0 release & renders top update banner', async () => {
      mockLatestTag = 'v3.9.0';
      await gotoHash(page, '#/settings');
      await page.locator('[data-action="check-update"]').click();
      await page.locator('.settings-update-card').waitFor({ timeout: 5000 });
      const cardText = (await page.locator('.settings-update-card').textContent()) || '';
      assert(cardText.includes('3.9.0'), `Update card missing version 3.9.0: "${cardText}"`);
      assert(await page.locator('#update-banner-host .update-banner').isVisible(), 'Top update banner did not appear');

      // Dismiss banner cleanly
      await page.locator('[data-action="banner-dismiss-update"]').click();
      await page.waitForTimeout(120);
      assert(await page.locator('#update-banner-host .update-banner').count() === 0, 'Banner did not dismiss');
      mockLatestTag = 'v3.2.0';
      return 'Detected v3.9.0, showed update card & dismissible top banner';
    });

    await test('Settings toggles (Key Hints & Reading Font Scale) persist and apply to DOM', async () => {
      await page.locator('[data-toggle-setting="showKeyHints"]').click();
      await page.waitForTimeout(120);
      const hasHideClass = await page.evaluate(() => document.body.classList.contains('is-hide-key-hints'));
      assert(hasHideClass, 'body.is-hide-key-hints not applied when key hints toggled OFF');
      await page.locator('[data-toggle-setting="showKeyHints"]').click();
      await page.waitForTimeout(100);

      await page.locator('[data-font-scale="1.15"]').click();
      await page.waitForTimeout(100);
      const scaleVal = await page.evaluate(() => JSON.parse(localStorage.getItem('ulduz_state_v1') || '{}').settings?.passageFontScale);
      assert(scaleVal === 1.15, `Expected passageFontScale 1.15, got ${scaleVal}`);
      return 'showKeyHints DOM class & passageFontScale=1.15 verified';
    });

    await test('AZ Localization Purity on #/ai, #/settings, #/stats (0 Cyrillic leaks)', async () => {
      await page.evaluate(() => {
        const st = JSON.parse(localStorage.getItem('ulduz_state_v1') || '{}');
        st.lang = 'az';
        st.aiChat = [];
        localStorage.setItem('ulduz_state_v1', JSON.stringify(st));
      });
      await page.reload({ waitUntil: 'networkidle' });

      for (const route of ['#/ai', '#/settings', '#/stats']) {
        await gotoHash(page, route);
        const uiText = await page.evaluate(() => {
          const clone = document.body.cloneNode(true);
          // Exclude user-generated Russian topic names / subject stems from task bank
          clone.querySelectorAll('.tb-row__title span:last-child, .stats-ledger-row__title span:last-child, .ai-task-context-card__stem').forEach((n) => n.remove());
          return clone.innerText || '';
        });
        // Check chrome headings & controls specifically
        const chromeText = await page.evaluate(() => {
          const els = document.querySelectorAll('#app-header, #mobile-bottom-nav, h1, h2, h3, .settings-label, .settings-hint, .btn, .stats-summary-cell__lbl');
          return [...els].map((el) => el.textContent || '').join(' ');
        });
        const cyrMatches = chromeText.match(/[А-Яа-яЁё]{3,}/g) || [];
        // Allow "Русский (RU)" explicit language self-name in language switcher
        const filtered = cyrMatches.filter((w) => w !== 'Русский');
        assert(filtered.length === 0, `Cyrillic chrome leak on ${route} in AZ mode: ${filtered.slice(0, 6).join(', ')}`);
      }
      return 'Zero Cyrillic chrome leaks across #/ai, #/settings, #/stats in AZ mode';
    });

    // Seed rich realistic telemetry state for high-value visual QA screenshots (Desktop Dark, FAC 05 Light, Mobile 390/360)
    await page.evaluate(() => {
      const now = Date.now();
      const seeded = {
        version: 1,
        theme: 'atelier',
        fxMode: 'tactile',
        unlockedThemes: ['atelier', 'prism', 'pulse', 'monolith', 'eclipse'],
        unseenThemes: [],
        achievements: { perfectFullExam: true },
        lang: 'ru',
        streak: { days: 6, lastDate: '2026-11-25', todayCount: 9, todayDate: '2026-11-25' },
        stats: {
          totalAttempted: 42,
          totalCorrect: 33,
          bySubject: {
            math: { attempted: 14, correct: 11, earned: 14, max: 18 },
            ru: { attempted: 10, correct: 8, earned: 10, max: 12 },
            en: { attempted: 10, correct: 7, earned: 8, max: 11 },
            az: { attempted: 8, correct: 7, earned: 9, max: 10 },
          },
          byTopic: {
            'math::Тригонометрия': { subject: 'math', topic: 'Тригонометрия', attempted: 5, correct: 2, earned: 3, max: 6 },
            'math::Стереометрия': { subject: 'math', topic: 'Стереометрия', attempted: 4, correct: 3, earned: 4, max: 5 },
            'math::Квадратные уравнения': { subject: 'math', topic: 'Квадратные уравнения', attempted: 5, correct: 5, earned: 5, max: 5 },
            'en::Времена глаголов': { subject: 'en', topic: 'Времена глаголов', attempted: 6, correct: 3, earned: 3, max: 6 },
            'ru::Синтаксис и пунктуация': { subject: 'ru', topic: 'Синтаксис и пунктуация', attempted: 6, correct: 5, earned: 5, max: 6 },
            'az::Morfologiya': { subject: 'az', topic: 'Morfologiya', attempted: 5, correct: 4, earned: 4, max: 5 },
          },
          byType: {},
        },
        timing: {
          totalSec: 1842,
          totalTimedAttempts: 42,
          bySubject: {
            math: { totalSec: 812, count: 14, correctSec: 540, correctCount: 11, wrongSec: 272, wrongCount: 3 },
            ru: { totalSec: 390, count: 10, correctSec: 280, correctCount: 8, wrongSec: 110, wrongCount: 2 },
            en: { totalSec: 380, count: 10, correctSec: 225, correctCount: 7, wrongSec: 155, wrongCount: 3 },
            az: { totalSec: 260, count: 8, correctSec: 205, correctCount: 7, wrongSec: 55, wrongCount: 1 },
          },
          byTopic: {
            'math::Тригонометрия': { subject: 'math', topic: 'Тригонометрия', totalSec: 425, count: 5, maxSec: 118, minSec: 54 },
            'math::Стереометрия': { subject: 'math', topic: 'Стереометрия', totalSec: 276, count: 4, maxSec: 88, minSec: 52 },
            'en::Времена глаголов': { subject: 'en', topic: 'Времена глаголов', totalSec: 258, count: 6, maxSec: 65, minSec: 29 },
            'ru::Синтаксис и пунктуация': { subject: 'ru', topic: 'Синтаксис и пунктуация', totalSec: 234, count: 6, maxSec: 56, minSec: 24 },
            'az::Morfologiya': { subject: 'az', topic: 'Morfologiya', totalSec: 165, count: 5, maxSec: 46, minSec: 22 },
            'math::Квадратные уравнения': { subject: 'math', topic: 'Квадратные уравнения', totalSec: 111, count: 5, maxSec: 31, minSec: 16 },
          },
          byFormat: {
            single: { format: 'single', totalSec: 680, count: 22 },
            short: { format: 'short', totalSec: 462, count: 9 },
            open: { format: 'open', totalSec: 495, count: 6 },
            match: { format: 'match', totalSec: 205, count: 5 },
          },
        },
        recentAttempts: [
          { at: now - 200000, subject: 'math', topic: 'Квадратные уравнения', format: 'single', correct: true, durationSec: 22 },
          { at: now - 190000, subject: 'math', topic: 'Тригонометрия', format: 'short', correct: false, durationSec: 94 },
          { at: now - 180000, subject: 'ru', topic: 'Синтаксис и пунктуация', format: 'single', correct: true, durationSec: 31 },
          { at: now - 170000, subject: 'en', topic: 'Времена глаголов', format: 'single', correct: false, durationSec: 58 },
          { at: now - 160000, subject: 'az', topic: 'Morfologiya', format: 'single', correct: true, durationSec: 27 },
          { at: now - 150000, subject: 'math', topic: 'Стереометрия', format: 'open', correct: true, durationSec: 84 },
          { at: now - 140000, subject: 'math', topic: 'Тригонометрия', format: 'short', correct: false, durationSec: 112 },
          { at: now - 130000, subject: 'ru', topic: 'Синтаксис и пунктуация', format: 'match', correct: true, durationSec: 43 },
          { at: now - 120000, subject: 'en', topic: 'Времена глаголов', format: 'single', correct: true, durationSec: 35 },
          { at: now - 110000, subject: 'math', topic: 'Квадратные уравнения', format: 'single', correct: true, durationSec: 19 },
          { at: now - 100000, subject: 'az', topic: 'Morfologiya', format: 'single', correct: true, durationSec: 24 },
          { at: now - 90000, subject: 'en', topic: 'Времена глаголов', format: 'single', correct: false, durationSec: 63 },
          { at: now - 80000, subject: 'math', topic: 'Стереометрия', format: 'open', correct: true, durationSec: 76 },
          { at: now - 70000, subject: 'ru', topic: 'Синтаксис и пунктуация', format: 'single', correct: true, durationSec: 29 },
          { at: now - 60000, subject: 'math', topic: 'Тригонометрия', format: 'single', correct: true, durationSec: 54 },
          { at: now - 50000, subject: 'az', topic: 'Morfologiya', format: 'match', correct: true, durationSec: 38 },
        ],
        settings: {
          autoUpdateCheck: true,
          haptics: true,
          showKeyHints: true,
          passageFontScale: 1,
          lastUpdateCheckAt: now - 60000,
          dismissedUpdateVersion: '',
          ai: {
            provider: 'opencode',
            model: 'deepseek-v4.1-flash-free',
            kiloModel: 'kilo-auto/free',
            opencodeApiKey: '',
            kiloApiKey: '',
            customBaseUrl: '',
            customApiKey: '',
            customModel: 'deepseek-chat',
            autoFallback: true,
            shareTelemetry: true,
            systemStyle: 'coach',
          },
        },
        aiChat: [
          {
            id: 'u-1',
            role: 'user',
            content: 'Проанализируй мою статистику, ошибки и время решения — что исправить первым делом?',
            at: now - 40000,
          },
          {
            id: 'a-1',
            role: 'assistant',
            provider: 'opencode',
            model: 'deepseek-v4.1-flash-free',
            reasoning: 'Сравниваем точность (79%), средний темп верных (38 с) и ошибочных (66 с) решений. Основные потери — тригонометрия (85 с, 40%) и времена глаголов (43 с, 50%).',
            content: '### Диагностика по вашей телеметрии\n\nВаша общая точность **79%** (33 из 42), при этом на ошибочные задачи вы тратите в среднем **66 с** против **38 с** на верные — это признак «застревания» на конкретных формулах.\n\n1. **Приоритет №1 — Математика · Тригонометрия** (40% точность, ср. **1 м 25 с**): повторите основное тождество $\\sin^2 x + \\cos^2 x = 1$ и формулы двойного угла $\\sin 2x = 2\\sin x\\cos x$.\n2. **Приоритет №2 — Английский · Времена глаголов** (50% точность, ср. **43 с**): разберите маркеры Present Perfect vs. Past Simple.\n3. **Сильная база** — Квадратные уравнения (100%, **22 с**) и Азербайджанский язык (88%, **33 с**).',
            at: now - 35000,
          },
        ],
        mistakes: {
          'm-1': { task: { id: 'm-1', subject: 'math', topic: 'Тригонометрия', format: 'short', stem: 'Вычислите $\\sin 2\\alpha$, если $\\cos \\alpha = 0{,}6$.' }, wrongCount: 2, lastWrongAt: now - 140000, resolved: false },
          'm-2': { task: { id: 'm-2', subject: 'en', topic: 'Времена глаголов', format: 'single', stem: 'Choose the correct tense form for the sentence.' }, wrongCount: 2, lastWrongAt: now - 90000, resolved: false },
        },
        bookmarks: {},
        exams: [
          { id: 'ex-1', targetId: 'math', title: 'Математика · Симуляция ДИМ', completedAt: now - 86400000, elapsedSec: 2940, scaledScore: 84.4, scaledMax: 100, rawEarned: 27, rawMax: 32, pct: 84, counts: { correct: 21, total: 25 } },
        ],
        activeExam: null,
        activePractice: {},
        originalsSessions: {},
      };
      localStorage.setItem('ulduz_state_v1', JSON.stringify(seeded));
    });
    await page.reload({ waitUntil: 'networkidle' });

    await test('Capture & verify visual layouts + 0px overflow across Desktop (1440), FAC 05 Light, Mobile (390 & 360)', async () => {
      // Desktop 1440x900 (Dark FAC 01)
      await page.setViewportSize({ width: 1440, height: 900 });
      for (const [route, shot] of [
        ['#/stats', 'v310-stats-desktop.png'],
        ['#/ai', 'v310-ai-desktop.png'],
        ['#/settings', 'v310-settings-desktop.png'],
      ]) {
        await gotoHash(page, route);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        assert(overflow <= 0, `Desktop 1440 overflow=${overflow}px on ${route}`);
        await page.screenshot({ path: path.join(SHOTS_DIR, shot), fullPage: true });
      }

      // FAC 05 Master Press (Light daylight paper) on #/stats
      await page.evaluate(() => {
        const st = JSON.parse(localStorage.getItem('ulduz_state_v1') || '{}');
        st.theme = 'eclipse';
        localStorage.setItem('ulduz_state_v1', JSON.stringify(st));
      });
      await page.reload({ waitUntil: 'networkidle' });
      await gotoHash(page, '#/stats');
      await page.screenshot({ path: path.join(SHOTS_DIR, 'v310-stats-light.png'), fullPage: true });

      // Restore FAC 01 Dark for mobile screenshots
      await page.evaluate(() => {
        const st = JSON.parse(localStorage.getItem('ulduz_state_v1') || '{}');
        st.theme = 'atelier';
        localStorage.setItem('ulduz_state_v1', JSON.stringify(st));
      });
      await page.reload({ waitUntil: 'networkidle' });

      // Mobile 390x844
      await page.setViewportSize({ width: 390, height: 844 });
      for (const [route, shot] of [
        ['#/stats', 'v310-stats-mobile.png'],
        ['#/ai', 'v310-ai-mobile.png'],
        ['#/settings', 'v310-settings-mobile.png'],
      ]) {
        await gotoHash(page, route);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        assert(overflow <= 0, `Mobile 390 overflow=${overflow}px on ${route}`);
        const settingsBtnBox = await page.locator('#btn-settings-link').boundingBox();
        assert(settingsBtnBox && settingsBtnBox.width >= 48 && settingsBtnBox.height >= 48, `Mobile settings btn <48px: ${JSON.stringify(settingsBtnBox)}`);
        await page.screenshot({ path: path.join(SHOTS_DIR, shot), fullPage: false });
      }

      // Narrow Mobile 360x800 zero-overflow + 5-cell dock check
      await page.setViewportSize({ width: 360, height: 800 });
      for (const route of ['#/', '#/ai', '#/settings', '#/stats']) {
        await gotoHash(page, route);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        assert(overflow <= 0, `Narrow 360px overflow=${overflow}px on ${route}`);
      }
      const dockItems = await page.locator('#mobile-bottom-nav .mobile-bottom-nav__item').count();
      assert(dockItems === 5, `Expected 5 mobile dock items, got ${dockItems}`);
      return '0px overflow at 1440/390/360px, 5-cell dock, >=48px settings touch target, 7 screenshots captured';
    });

    await test('Zero console errors & zero uncaught page errors', async () => {
      assert(consoleErrors.length === 0, `Console errors: ${consoleErrors.join(' | ')}`);
      assert(pageErrors.length === 0, `Page errors: ${pageErrors.join(' | ')}`);
      return '0 console errors, 0 page errors';
    });
  } finally {
    await browser.close();
  }

  console.log(`\nSUMMARY: ${passed} passed, ${failed} failed\n`);
  if (failed > 0) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
