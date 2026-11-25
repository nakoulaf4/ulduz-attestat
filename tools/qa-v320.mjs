#!/usr/bin/env node
// Comprehensive E2E + Visual + Landscape QA for Ulduz v3.2.0:
// 1. 6 new DİM Block subjects (Physics, Chemistry, Biology, History, Geography, Informatics) + 30-task Exams
// 2. Topic Lesson Studio (#/lesson/:id): written theory, KaTeX, SVG diagrams, inline RU YouTube iframe + playlist switcher
// 3. Landscape Phone Ergonomics (800x360, 844x390, 915x412): 0px horizontal overflow across all key routes
// 4. Xiaomi / Android top safe clearance on .exam-topbar & .app-header
// 5. AZ localization purity on new screens + visual screenshots for inspection.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SHOTS_DIR = path.join(ROOT, 'tools', 'reports', 'shots-v320');
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

const consoleErrors = [];
const pageErrors = [];

const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();
page.on('console', (msg) => {
  if (msg.type() === 'error') {
    const text = msg.text();
    // Ignore third-party YouTube iframe network errors in headless offline/sandbox if any
    if (!/youtube|googlevideo|doubleclick|ytimg/i.test(text)) consoleErrors.push(text);
  }
});
page.on('pageerror', (err) => pageErrors.push(err.message));

async function gotoHash(hash) {
  await page.goto(`${BASE_URL}${hash}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(350);
}

async function checkZeroOverflow(label) {
  const m = await page.evaluate(() => ({
    sw: document.documentElement.scrollWidth,
    cw: document.documentElement.clientWidth,
  }));
  assert(m.sw <= m.cw + 1, `${label}: horizontal overflow ${m.sw} > ${m.cw}`);
  return `${m.sw}/${m.cw}px`;
}

console.log('\n=== ULDUZ v3.2.0 QA SUITE ===');

await test('1. Home renders 4 Buraxılış rows + 6 DİM Block Subject cards', async () => {
  await gotoHash('#/');
  const counts = await page.evaluate(() => ({
    burax: document.querySelectorAll('.fac-catalog-row').length,
    blocks: document.querySelectorAll('.fac-block-card').length,
    blockLinks: [...document.querySelectorAll('.fac-block-card__title a')].map((a) => a.textContent.trim()),
  }));
  assert(counts.burax === 4, `Expected 4 Buraxılış rows, got ${counts.burax}`);
  assert(counts.blocks === 6, `Expected 6 Block cards, got ${counts.blocks}`);
  await checkZeroOverflow('Home 1440');
  await page.screenshot({ path: path.join(SHOTS_DIR, 'home-blocks-1440.png'), fullPage: true });
  return `4 Buraxılış + 6 Block (${counts.blockLinks.join(', ')})`;
});

await test('2. All 6 new Subject Hubs load cleanly with Lessons & 30-task Exam cards', async () => {
  const ids = ['physics', 'chemistry', 'biology', 'history', 'geography', 'informatics'];
  const summary = [];
  for (const id of ids) {
    await gotoHash(`#/subject/${id}`);
    const info = await page.evaluate(() => ({
      title: document.querySelector('.subject-hero__title')?.textContent?.trim() || '',
      lessonBtn: Boolean(document.querySelector('a[href^="#/lesson/"]')),
      examBtn: Boolean(document.querySelector('a[href^="#/exam/"]')),
      topics: document.querySelectorAll('.topic-group').length,
      topicLessonBtns: document.querySelectorAll('.topic-group a[href^="#/lesson/"]').length,
    }));
    assert(info.title.length > 3, `${id}: missing hero title`);
    assert(info.lessonBtn, `${id}: missing hero lesson button`);
    assert(info.examBtn, `${id}: missing hero exam button`);
    assert(info.topics >= 6, `${id}: expected >=6 topics, got ${info.topics}`);
    assert(info.topicLessonBtns === info.topics, `${id}: every topic must have a Lesson button`);
    summary.push(`${id}(${info.topics})`);
  }
  return summary.join(', ');
});

await test('3. Block Exam Simulation (Physics 30-task DİM Exam start & submit)', async () => {
  await gotoHash('#/exam/physics');
  await page.waitForSelector('[data-action="begin-exam"]');
  const rulesText = await page.textContent('.exam-rules-strip');
  assert(rulesText.includes('30') && rulesText.includes('90') && rulesText.includes('100'), `Unexpected rules: ${rulesText}`);
  await page.click('[data-action="begin-exam"]');
  await page.waitForSelector('.exam-topbar');
  await page.waitForSelector('.task-card');
  // Answer first question & finish exam
  const firstOpt = page.locator('[data-action="select-single"]').first();
  if (await firstOpt.count()) await firstOpt.click();
  await page.click('[data-action="ask-finish"]');
  await page.waitForSelector('[data-action="confirm-finish"]');
  await page.click('[data-action="confirm-finish"]');
  await page.waitForSelector('.results-hero');
  const scoreText = await page.textContent('.results-hero');
  assert(scoreText.includes('/ 100') || scoreText.includes('100'), `Expected 100-point scale in results`);
  return 'Physics 30-task exam started, answered & scored on 100-pt scale';
});

await test('4. Lesson Studio: Written Theory, KaTeX, SVG Visuals & Inline RU YouTube Player', async () => {
  for (const subj of ['physics', 'math', 'history', 'informatics']) {
    await gotoHash(`#/lesson/${subj}`);
    await page.waitForSelector('#lesson-yt-iframe');
    const info = await page.evaluate(() => {
      const iframe = document.querySelector('#lesson-yt-iframe');
      const svg = document.querySelector('.lesson-svg');
      const svgRect = svg ? svg.getBoundingClientRect() : null;
      return {
        title: document.querySelector('.lesson-hero__title')?.textContent?.trim(),
        iframeSrc: iframe?.getAttribute('src') || '',
        playlistCount: document.querySelectorAll('.lesson-video-card').length,
        svgWidth: svgRect ? Math.round(svgRect.width) : 0,
        katexCount: document.querySelectorAll('.katex').length,
        examplePresent: Boolean(document.querySelector('.lesson-example-section')),
        trapsPresent: Boolean(document.querySelector('.lesson-traps-section')),
      };
    });
    assert(info.iframeSrc.startsWith('https://www.youtube-nocookie.com/embed/'), `${subj}: bad iframe src ${info.iframeSrc}`);
    assert(info.playlistCount >= 2, `${subj}: expected >=2 RU videos, got ${info.playlistCount}`);
    assert(info.svgWidth > 150, `${subj}: SVG diagram did not render (width=${info.svgWidth})`);
    assert(info.examplePresent && info.trapsPresent, `${subj}: missing worked example or traps`);
    if (subj === 'physics') {
      assert(info.katexCount >= 3, `physics: expected KaTeX formulas, got ${info.katexCount}`);
      // Test switching to video #2 in playlist
      const firstSrc = info.iframeSrc;
      await page.locator('.lesson-video-card').nth(1).click();
      await page.waitForTimeout(200);
      const secondSrc = await page.getAttribute('#lesson-yt-iframe', 'src');
      assert(secondSrc && secondSrc !== firstSrc, 'Switching playlist video did not update iframe src');
      // Test switching to topic #2
      await page.locator('.lesson-topic-chip').nth(1).click();
      await page.waitForTimeout(200);
      const nextTitle = await page.textContent('.lesson-hero__title');
      assert(nextTitle.trim() !== info.title, 'Switching topic chip did not change lesson');
      await page.locator('.lesson-topic-chip').nth(0).click();
      await page.waitForTimeout(250);
      await page.screenshot({ path: path.join(SHOTS_DIR, 'lesson-physics-1440.png'), fullPage: true });
    }
  }
  return '4 subjects verified (inline youtube-nocookie iframe + playlist switch + SVG >150px + KaTeX + example + traps)';
});

await test('5. Xiaomi / Android Portrait Exam Topbar Clearance (390x844)', async () => {
  await page.setViewportSize({ width: 390, height: 844 });
  await gotoHash('#/exam/math');
  await page.evaluate(() => document.documentElement.classList.add('is-native-app'));
  await page.click('[data-action="begin-exam"]');
  await page.waitForSelector('.exam-topbar');
  const metrics = await page.evaluate(() => {
    const bar = document.querySelector('.exam-topbar');
    const cs = getComputedStyle(bar);
    const rect = bar.getBoundingClientRect();
    const btns = [...bar.querySelectorAll('button, a')].map((el) => el.getBoundingClientRect());
    const minTop = Math.min(...btns.map((r) => r.top));
    return {
      paddingTop: parseFloat(cs.paddingTop),
      height: Math.round(rect.height),
      minBtnTop: Math.round(minTop),
    };
  });
  assert(metrics.paddingTop >= 12, `Expected native mobile exam-topbar paddingTop >= 12px, got ${metrics.paddingTop}px`);
  assert(metrics.minBtnTop >= 10, `Expected exam-topbar controls clear of top edge (>=10px), got ${metrics.minBtnTop}px`);
  await checkZeroOverflow('Exam Portrait 390x844');
  await page.screenshot({ path: path.join(SHOTS_DIR, 'exam-xiaomi-portrait-390x844.png') });
  // Exit exam cleanly via confirmation
  await page.click('[data-action="ask-finish"]');
  await page.waitForSelector('[data-action="confirm-finish"]');
  await page.click('[data-action="confirm-finish"]');
  await page.waitForSelector('.results-hero');
  await page.evaluate(() => document.documentElement.classList.remove('is-native-app'));
  return `paddingTop=${metrics.paddingTop}px, barHeight=${metrics.height}px, minBtnTop=${metrics.minBtnTop}px`;
});

await test('6. Landscape Phone Layout (800x360, 844x390, 915x412) — 0px overflow on all views', async () => {
  const sizes = [
    { width: 800, height: 360 },
    { width: 844, height: 390 },
    { width: 915, height: 412 },
  ];
  const routes = ['#/', '#/subject/physics', '#/lesson/physics', '#/ai', '#/stats', '#/settings'];
  const report = [];
  for (const vp of sizes) {
    await page.setViewportSize(vp);
    for (const r of routes) {
      await gotoHash(r);
      await checkZeroOverflow(`Landscape ${vp.width}x${vp.height} ${r}`);
      if (vp.width === 844 && r === '#/') {
        await page.screenshot({ path: path.join(SHOTS_DIR, 'landscape-home-844x390.png') });
      }
      if (vp.width === 844 && r === '#/lesson/physics') {
        await page.screenshot({ path: path.join(SHOTS_DIR, 'landscape-lesson-844x390.png') });
      }
    }
    report.push(`${vp.width}x${vp.height}:OK`);
  }
  // Also test running exam in landscape 844x390!
  await page.setViewportSize({ width: 844, height: 390 });
  await gotoHash('#/exam/informatics');
  await page.click('[data-action="begin-exam"]');
  await page.waitForSelector('.exam-topbar');
  await checkZeroOverflow('Landscape 844x390 Running Exam');
  await page.screenshot({ path: path.join(SHOTS_DIR, 'landscape-exam-844x390.png') });
  await page.click('[data-action="ask-finish"]');
  await page.waitForSelector('[data-action="confirm-finish"]');
  await page.click('[data-action="confirm-finish"]');
  await page.waitForSelector('.results-hero');
  return report.join(' · ') + ' + Running Exam OK';
});

await test('7. AZ Localization on Block Subjects & Lesson Studio', async () => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await gotoHash('#/');
  await page.click('#btn-lang-toggle');
  await page.waitForTimeout(250);
  const homeBlocksHeading = await page.textContent('#fac-blocks-heading');
  assert(/DİM Blok fənləri/i.test(homeBlocksHeading), `Expected AZ heading, got: ${homeBlocksHeading}`);
  await gotoHash('#/lesson/physics');
  const videoTitle = await page.textContent('.lesson-video-section .lesson-block__title');
  assert(/Rusdilli video dərslər/i.test(videoTitle), `Expected AZ video heading, got: ${videoTitle}`);
  // Switch back to RU
  await page.click('#btn-lang-toggle');
  return `AZ Home="${homeBlocksHeading.trim()}", AZ Lesson="${videoTitle.trim()}"`;
});

await test('8. Zero Console / Page Runtime Errors', async () => {
  assert(pageErrors.length === 0, `Page errors: ${pageErrors.join(' | ')}`);
  assert(consoleErrors.length === 0, `Console errors: ${consoleErrors.join(' | ')}`);
  return '0 console errors, 0 uncaught exceptions';
});

await browser.close();

console.log(`\n=== SUMMARY: ${passed} passed, ${failed} failed ===\n`);
process.exit(failed > 0 ? 1 : 0);
