#!/usr/bin/env node
/**
 * Ulduz Content & Generator Self-Test (tools/selftest.mjs)
 *
 * Usage:
 *   node tools/selftest.mjs [--count 1000] [--exams 20] [--subjects math,ru,en,az] [--sample 0]
 *
 * Checks for every available subject module:
 *  1. SubjectModule contract & TaskType metadata
 *  2. N (default 1000) generated tasks per TaskType across consecutive seeds:
 *     - Determinism (same seed -> identical task; no Math.random() calls)
 *     - validateTask() from site/js/core/contract.js
 *     - Answer index in range, checkAnswer(task, task.answer) === true, distractors !== true
 *     - Exactly one correct option / no duplicate options (string, normalized, and numeric equivalence)
 *     - Option shuffle fairness for 'single' tasks
 *     - No NaN, undefined, "[object", Infinity, empty strings, unformatted "+-" / "-+"
 *     - Balanced KaTeX delimiters ($ / $$), balanced braces {}, actual KaTeX parse via vendored katex.min.js,
 *       no raw "<letter" inside math that innerHTML would eat
 *     - Balanced HTML tags & allowed HTML subset; SVG sanity check on image.svg
 *     - Duplicate rate across N seeds
 *  3. buildExam(rng) across M seeds: determinism, valid tasks, no duplicate task IDs or identical tasks,
 *     exam counts, section coverage, points, and scoring checks against docs/research.md
 *  4. Originals JSON (site/data/original/<subject>.json): valid JSON, validateTask, origin fields, no duplicate (pdf, number)
 *  5. Outputs summary table to stdout and detailed reports to tools/reports/<subject>.md
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRng } from '../site/js/core/rng.js';
import {
  SUBJECT_IDS,
  FORMATS,
  validateTask,
  finalizeTask,
  checkAnswer,
  normalizeText,
  parseNumber,
} from '../site/js/core/contract.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const SITE_DIR = path.join(ROOT_DIR, 'site');
const REPORTS_DIR = path.join(__dirname, 'reports');

// Load vendored KaTeX for real LaTeX syntax checking
const require = createRequire(import.meta.url);
let katex = null;
try {
  katex = require(path.join(SITE_DIR, 'vendor', 'katex', 'katex.min.js'));
} catch {
  // Optional fallback if vendor/katex is absent
}
const katexCache = new Map(); // key: `${displayMode}:${expr}` -> null | errorMsg

function validateKatexExpr(expr, displayMode) {
  if (!katex) return null;
  const key = `${displayMode ? 1 : 0}:${expr}`;
  if (katexCache.has(key)) return katexCache.get(key);
  let errMsg = null;
  try {
    katex.renderToString(expr, {
      displayMode,
      throwOnError: true,
      strict: false,
      trust: false,
    });
  } catch (err) {
    errMsg = err.message || String(err);
  }
  if (katexCache.size < 200000) katexCache.set(key, errMsg);
  return errMsg;
}

// ---------- CLI args ----------
function parseArgs(argv) {
  const opts = {
    count: 1000,
    exams: 20,
    subjects: [...SUBJECT_IDS],
    sample: 0,
    verbose: false,
  };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if ((a === '--count' || a === '-n') && argv[i + 1]) {
      opts.count = Math.max(1, parseInt(argv[++i], 10) || 1000);
    } else if (a === '--exams' && argv[i + 1]) {
      opts.exams = Math.max(1, parseInt(argv[++i], 10) || 20);
    } else if ((a === '--subjects' || a === '--subject' || a === '-s') && argv[i + 1]) {
      opts.subjects = argv[++i].split(',').map((s) => s.trim()).filter(Boolean);
    } else if (a === '--sample' && argv[i + 1]) {
      opts.sample = Math.max(0, parseInt(argv[++i], 10) || 0);
    } else if (a === '--verbose' || a === '-v') {
      opts.verbose = true;
    } else if (!a.startsWith('-') && SUBJECT_IDS.includes(a)) {
      if (opts.subjects.length === SUBJECT_IDS.length) opts.subjects = [a];
      else opts.subjects.push(a);
    }
  }
  return opts;
}

// ---------- HTML & KaTeX Validation Helpers ----------

const ALLOWED_TAGS = new Set([
  'p', 'br', 'b', 'strong', 'i', 'em', 'u', 's', 'sub', 'sup', 'small',
  'span', 'div', 'ul', 'ol', 'li', 'table', 'thead', 'tbody', 'tr', 'th', 'td',
  'blockquote', 'code', 'hr', 'img', 'figure', 'figcaption',
  // Inline SVG tags if ever placed directly in rich HTML
  'svg', 'g', 'path', 'circle', 'rect', 'line', 'polyline', 'polygon', 'text', 'defs', 'marker', 'tspan',
]);

const VOID_TAGS = new Set(['br', 'hr', 'img', 'path', 'circle', 'rect', 'line', 'polyline', 'polygon']);

/**
 * Check a single string field for:
 * - NaN / undefined / [object / Infinity
 * - KaTeX delimiter balance, brace balance inside math, KaTeX parser check, innerHTML-unsafe `<letter` inside math
 * - HTML tag balance and allowed tags
 */
function checkRichText(str, fieldName) {
  const issues = [];
  if (typeof str !== 'string') {
    issues.push(`${fieldName}: not a string (${typeof str})`);
    return issues;
  }

  // 1. Forbidden JS stringification artifacts
  if (/\bNaN\b/.test(str)) issues.push(`${fieldName}: contains "NaN"`);
  if (/\bundefined\b/.test(str)) issues.push(`${fieldName}: contains "undefined"`);
  if (/\[object\s/i.test(str)) issues.push(`${fieldName}: contains "[object ..."`);
  if (/(?<![a-zA-Z\\])Infinity\b/.test(str)) issues.push(`${fieldName}: contains "Infinity"`);

  // 2. KaTeX delimiter & math block inspection
  const cleanDollars = str.replace(/\\\$/g, '__');
  const mathRegex = /\$\$([\s\S]*?)\$\$|\$([^$]*?)\$/g;
  let mathMatch;

  const leftover = cleanDollars.replace(mathRegex, '');
  if (leftover.includes('$')) {
    issues.push(`${fieldName}: unbalanced KaTeX "$" delimiter`);
  }

  while ((mathMatch = mathRegex.exec(cleanDollars)) !== null) {
    const isDisplay = mathMatch[1] !== undefined;
    const mathBody = (mathMatch[1] ?? mathMatch[2] ?? '').trim();
    if (mathBody.length === 0) {
      issues.push(`${fieldName}: empty KaTeX math block`);
      continue;
    }
    const noEscBraces = mathBody.replace(/\\[{}]/g, '');
    let depth = 0;
    for (const ch of noEscBraces) {
      if (ch === '{') depth++;
      else if (ch === '}') {
        depth--;
        if (depth < 0) break;
      }
    }
    if (depth !== 0) {
      issues.push(`${fieldName}: unbalanced braces {} in KaTeX "${mathBody.slice(0, 40)}"`);
    }
    // Raw "<letter" inside math gets parsed as an HTML tag by innerHTML before KaTeX runs!
    if (/<[a-zA-Z/]/.test(mathBody)) {
      issues.push(`${fieldName}: raw "<letter" inside math "${mathBody.slice(0, 40)}" (use "< " with space or \\lt)`);
    }
    if (/\+\s*-|-\s*\+/.test(mathBody)) {
      issues.push(`${fieldName}: unformatted "+-" or "-+" in math "${mathBody.slice(0, 40)}"`);
    }
    const katexErr = validateKatexExpr(mathBody, isDisplay);
    if (katexErr) {
      issues.push(`${fieldName}: KaTeX parse error in "${mathBody.slice(0, 40)}": ${katexErr}`);
    }
  }

  // Strip math blocks before checking HTML tags and stray LaTeX commands
  const strippedMath = cleanDollars.replace(mathRegex, 'MATH_BLOCK');
  const strayTexMatch = strippedMath.match(/\\(text|frac|dfrac|sqrt|cdot|times|circ|angle|triangle|le|ge|neq|pm|approx|infty)\b/);
  if (strayTexMatch) {
    issues.push(`${fieldName}: LaTeX command "${strayTexMatch[0]}" outside $...$ delimiters`);
  }

  // 3. HTML tag balance
  const tagRegex = /<\/?([a-zA-Z][a-zA-Z0-9]*)\b[^>]*\/?>/g;
  const stack = [];
  let tagMatch;
  while ((tagMatch = tagRegex.exec(strippedMath)) !== null) {
    const fullTag = tagMatch[0];
    const tagName = tagMatch[1].toLowerCase();
    const isClosing = fullTag.startsWith('</');
    const isSelfClosing = fullTag.endsWith('/>') || VOID_TAGS.has(tagName);

    if (!ALLOWED_TAGS.has(tagName)) {
      issues.push(`${fieldName}: disallowed or unknown HTML tag <${tagName}>`);
      continue;
    }
    if (isSelfClosing) {
      if (isClosing && !VOID_TAGS.has(tagName)) {
        // e.g. </path> after <path> without /> is valid SVG, handle normally if needed
      } else if (isClosing && ['br', 'hr', 'img'].includes(tagName)) {
        issues.push(`${fieldName}: unnecessary closing tag </${tagName}>`);
      }
      continue;
    }
    if (isClosing) {
      if (stack.length === 0) {
        issues.push(`${fieldName}: unexpected closing tag </${tagName}>`);
      } else {
        const top = stack.pop();
        if (top !== tagName) {
          issues.push(`${fieldName}: mismatched HTML tags <${top}> ... </${tagName}>`);
        }
      }
    } else {
      stack.push(tagName);
    }
  }
  if (stack.length > 0) {
    issues.push(`${fieldName}: unclosed HTML tag(s): ${stack.map((t) => `<${t}>`).join(', ')}`);
  }

  return issues;
}

/**
 * Deep check a single Task object beyond contract.validateTask().
 */
function deepCheckTask(task) {
  const issues = [];
  const v = validateTask(task);
  if (!v.ok) {
    for (const err of v.errors) issues.push(`validateTask: ${err}`);
  }

  // Check all rich text fields
  if (typeof task.stem === 'string') issues.push(...checkRichText(task.stem, 'stem'));
  if (typeof task.explanation === 'string') issues.push(...checkRichText(task.explanation, 'explanation'));
  if (task.hint !== undefined) issues.push(...checkRichText(task.hint, 'hint'));
  if (task.rubric !== undefined) issues.push(...checkRichText(task.rubric, 'rubric'));
  if (task.passage) {
    if (task.passage.title) issues.push(...checkRichText(task.passage.title, 'passage.title'));
    if (task.passage.html) issues.push(...checkRichText(task.passage.html, 'passage.html'));
  }
  if (task.image) {
    if (task.image.alt && /\b(NaN|undefined|Infinity)\b|\[object/i.test(task.image.alt)) {
      issues.push('image.alt: contains NaN/undefined/Infinity/[object]');
    }
    if (task.image.caption) {
      issues.push(...checkRichText(task.image.caption, 'image.caption'));
    }
    if (task.image.svg) {
      const svg = task.image.svg;
      if (/\b(NaN|undefined|Infinity)\b|\[object/i.test(svg)) {
        issues.push('image.svg: contains NaN/undefined/Infinity/[object]');
      }
      if (!/<svg\b/i.test(svg) || !/<\/svg>/i.test(svg)) {
        issues.push('image.svg: missing <svg> or </svg>');
      }
      if (!/viewBox\s*=/i.test(svg)) {
        issues.push('image.svg: missing viewBox attribute for responsive scaling');
      }
    }
  }

  // Options checks
  if (Array.isArray(task.options)) {
    task.options.forEach((opt, idx) => {
      issues.push(...checkRichText(opt, `options[${idx}]`));
    });

    if (task.format === 'single' || task.format === 'multi' || task.format === 'order') {
      const normSet = new Set();
      const numSet = new Map();
      task.options.forEach((opt, idx) => {
        const norm = normalizeText(opt);
        if (!norm && !/<img|<svg/i.test(opt)) {
          issues.push(`options[${idx}]: empty after normalizeText`);
        } else if (normSet.has(norm)) {
          issues.push(`options: normalized duplicate option "${opt}"`);
        }
        normSet.add(norm);

        // Numeric equivalence check (e.g. "0.5" vs "1/2")
        const num = parseNumber(opt);
        if (!Number.isNaN(num)) {
          for (const [prevIdx, prevNum] of numSet.entries()) {
            if (Math.abs(num - prevNum) < 1e-9 * Math.max(1, Math.abs(prevNum))) {
              issues.push(`options: numerically identical options[${prevIdx}]="${task.options[prevIdx]}" and options[${idx}]="${opt}"`);
            }
          }
          numSet.set(idx, num);
        }
      });
    }
  }

  // Pairs checks for 'match'
  if (task.format === 'match' && task.pairs) {
    const { left = [], right = [] } = task.pairs;
    left.forEach((item, idx) => issues.push(...checkRichText(item, `pairs.left[${idx}]`)));
    right.forEach((item, idx) => issues.push(...checkRichText(item, `pairs.right[${idx}]`)));

    const leftNorm = left.map(normalizeText);
    if (new Set(leftNorm).size !== leftNorm.length) {
      issues.push('pairs.left: contains duplicate items');
    }
    const rightNorm = right.map(normalizeText);
    if (new Set(rightNorm).size !== rightNorm.length) {
      issues.push('pairs.right: contains duplicate items');
    }
  }

  // Check answer via checkAnswer()
  if (v.ok) {
    switch (task.format) {
      case 'single': {
        const res = checkAnswer(task, task.answer);
        if (!res.correct || res.earned !== task.points) {
          issues.push(`single: checkAnswer(task, task.answer=${task.answer}) failed`);
        }
        for (let j = 0; j < task.options.length; j++) {
          if (j !== task.answer && checkAnswer(task, j).correct) {
            issues.push(`single: distractor index ${j} also marked correct`);
          }
        }
        break;
      }
      case 'multi': {
        const res = checkAnswer(task, task.answer);
        if (!res.correct) issues.push('multi: checkAnswer(task, task.answer) failed');
        const sorted = [...task.answer].sort((a, b) => a - b);
        if (task.answer.some((val, i) => val !== sorted[i])) {
          issues.push(`multi: answer indices not sorted: [${task.answer.join(', ')}]`);
        }
        break;
      }
      case 'short': {
        const ansStr = String(task.answer);
        if (/\b(NaN|undefined|Infinity)\b|\[object/i.test(ansStr)) {
          issues.push(`short: invalid answer string "${ansStr}"`);
        }
        const res = checkAnswer(task, task.answer);
        if (!res.correct) issues.push(`short: checkAnswer(task, task.answer="${ansStr}") failed`);
        if (Array.isArray(task.accept)) {
          for (const alt of task.accept) {
            if (!alt || typeof alt !== 'string' || !alt.trim()) {
              issues.push('short: accept contains empty string');
            } else if (!checkAnswer(task, alt).correct) {
              issues.push(`short: checkAnswer(task, accept="${alt}") failed`);
            }
          }
        }
        break;
      }
      case 'match':
      case 'order': {
        const res = checkAnswer(task, task.answer);
        if (!res.correct) issues.push(`${task.format}: checkAnswer(task, task.answer) failed`);
        break;
      }
      case 'open': {
        const res = checkAnswer(task, { self: task.points });
        if (!res.correct) issues.push('open: checkAnswer(task, {self: task.points}) failed');
        break;
      }
    }
  }

  return issues;
}

// ---------- Guard against Math.random() ----------
function withForbiddenMathRandom(fn) {
  const origRandom = Math.random;
  let called = false;
  Math.random = () => {
    called = true;
    return origRandom();
  };
  try {
    const result = fn();
    return { result, usedMathRandom: called };
  } finally {
    Math.random = origRandom;
  }
}

// ---------- Exam expectations from docs/research.md ----------
async function loadResearchExpectations() {
  // Exact DİM 11th-grade Buraxılış rules from docs/research.md:
  // - math: 25 tasks (13×1pt single + 5×1pt short + 7×2pt = 32 raw max), 60 min
  // - ru:   30 tasks (20×1pt single + 10×2pt open = 40 raw max), 60 min
  // - az:   30 tasks (20×1pt single + 10×2pt open = 40 raw max), 60 min
  // - en:   30 tasks (23×1pt single + 7×2pt written = 37 raw max), 60 min
  const expected = {
    researchFound: false,
    subjects: {
      math: { tasks: 25, rawMax: 32, scaledMax: 100, durationMin: 60 },
      ru:   { tasks: 30, rawMax: 40, scaledMax: 100, durationMin: 60 },
      az:   { tasks: 30, rawMax: 40, scaledMax: 100, durationMin: 60 },
      en:   { tasks: 30, rawMax: 37, scaledMax: 100, durationMin: 60 },
    },
  };
  try {
    const researchPath = path.join(ROOT_DIR, 'docs', 'research.md');
    const text = await fs.readFile(researchPath, 'utf8');
    expected.researchFound = true;
    expected.rawText = text;
  } catch {
    // docs/research.md not found
  }
  return expected;
}

// ---------- Load Originals from Disk ----------
async function loadOriginalsFromDisk(subjectId) {
  const jsonPath = path.join(SITE_DIR, 'data', 'original', `${subjectId}.json`);
  try {
    const raw = await fs.readFile(jsonPath, 'utf8');
    const parsed = JSON.parse(raw);
    const tasks = Array.isArray(parsed) ? parsed : (parsed?.tasks ?? null);
    if (!Array.isArray(tasks)) {
      return { exists: true, validJson: false, error: 'Root must be Task[] or { tasks: Task[] }', tasks: [] };
    }
    return { exists: true, validJson: true, error: null, tasks };
  } catch (err) {
    if (err.code === 'ENOENT') {
      return { exists: false, validJson: false, error: 'File does not exist', tasks: [] };
    }
    return { exists: true, validJson: false, error: `Invalid JSON: ${err.message}`, tasks: [] };
  }
}

// ---------- Per-Subject Verification ----------
async function verifySubject(subjectId, opts, research) {
  const report = {
    subjectId,
    available: false,
    loadError: null,
    moduleErrors: [],
    title: '',
    taskTypeCount: 0,
    typeResults: [],
    examResult: {
      tested: false,
      runs: 0,
      deterministic: true,
      taskCounts: [],
      pointSums: [],
      scoreCheck: null,
      errors: [],
    },
    originalsResult: {
      exists: false,
      validJson: false,
      count: 0,
      byPdf: {},
      errors: [],
    },
    samples: {
      generated: [],
      originals: [],
    },
    totalErrors: 0,
    totalWarnings: 0,
  };

  const modPath = path.join(SITE_DIR, 'js', 'subjects', subjectId, 'index.js');
  let mod;
  try {
    await fs.access(modPath);
  } catch {
    report.loadError = `Module file missing: site/js/subjects/${subjectId}/index.js`;
    return report;
  }

  try {
    const imported = await import(pathToFileURL(modPath).href);
    mod = imported.default ?? imported;
  } catch (err) {
    report.loadError = `Import error: ${err.stack || err.message}`;
    report.totalErrors++;
    return report;
  }

  if (!mod || typeof mod !== 'object') {
    report.loadError = 'Default export is not an object';
    report.totalErrors++;
    return report;
  }

  report.available = true;
  report.title = mod.title || subjectId;

  const moduleErrors = [];
  if (mod.id !== subjectId) {
    moduleErrors.push(`SubjectModule.id="${mod.id}" does not match "${subjectId}"`);
  }
  if (!Array.isArray(mod.taskTypes) || mod.taskTypes.length === 0) {
    moduleErrors.push('SubjectModule.taskTypes is missing or empty');
  }
  if (typeof mod.buildExam !== 'function') {
    moduleErrors.push('SubjectModule.buildExam is not a function');
  }
  const spec = research.subjects[subjectId];
  if (mod.exam?.durationMin !== undefined && spec?.durationMin && mod.exam.durationMin !== spec.durationMin) {
    moduleErrors.push(`SubjectModule.exam.durationMin=${mod.exam.durationMin} !== ${spec.durationMin} (per docs/research.md)`);
  }
  report.moduleErrors = moduleErrors;
  report.totalErrors += moduleErrors.length;

  const taskTypes = Array.isArray(mod.taskTypes) ? mod.taskTypes : [];
  report.taskTypeCount = taskTypes.length;
  const seenTypeIds = new Set();

  // 1. Test each TaskType over opts.count consecutive seeds
  for (const type of taskTypes) {
    const tr = {
      id: type?.id || '(missing-id)',
      title: type?.title || '',
      topic: type?.topic || '',
      format: type?.format || '',
      weight: type?.weight ?? 0,
      generated: 0,
      valid: 0,
      deterministic: true,
      usedMathRandom: false,
      uniqueStems: 0,
      duplicateRate: 0,
      answerDist: {},
      errors: [],
      warnings: [],
    };

    if (!type.id || typeof type.id !== 'string') tr.errors.push('TaskType.id missing');
    else if (seenTypeIds.has(type.id)) tr.errors.push(`Duplicate TaskType.id "${type.id}"`);
    seenTypeIds.add(type.id);

    if (type.subject !== subjectId) tr.errors.push(`TaskType.subject="${type.subject}" !== "${subjectId}"`);
    if (!type.title || typeof type.title !== 'string') tr.errors.push('TaskType.title missing');
    if (!type.topic || typeof type.topic !== 'string') tr.errors.push('TaskType.topic missing');
    if (!FORMATS.includes(type.format)) tr.errors.push(`TaskType.format invalid: "${type.format}"`);
    if (typeof type.weight !== 'number' || !(type.weight > 0)) tr.errors.push(`TaskType.weight invalid: ${type.weight}`);
    if (typeof type.generate !== 'function') {
      tr.errors.push('TaskType.generate is not a function');
      report.typeResults.push(tr);
      report.totalErrors += tr.errors.length;
      continue;
    }

    if (opts.verbose) process.stderr.write(`[selftest] ${subjectId}: ${tr.id} ...\n`);
    const stemsSeen = new Set();
    const MAX_ERRORS_PER_TYPE = 15;

    for (let s = 1; s <= opts.count; s++) {
      const seed = s;
      const difficulty = ((s - 1) % 3) + 1;

      let task1, task2;
      try {
        const run1 = withForbiddenMathRandom(() => {
          const rng1 = createRng(seed);
          const raw1 = type.generate(rng1, { difficulty });
          return finalizeTask(type, rng1, raw1);
        });
        task1 = run1.result;
        if (run1.usedMathRandom) tr.usedMathRandom = true;

        if (s <= 200) {
          const rng2 = createRng(seed);
          const raw2 = type.generate(rng2, { difficulty });
          task2 = finalizeTask(type, rng2, raw2);
          if (JSON.stringify(task1) !== JSON.stringify(task2)) {
            tr.deterministic = false;
            if (tr.errors.length < MAX_ERRORS_PER_TYPE) {
              tr.errors.push(`seed=${seed} (diff=${difficulty}): non-deterministic output`);
            }
          }
        }
      } catch (err) {
        if (tr.errors.length < MAX_ERRORS_PER_TYPE) {
          tr.errors.push(`seed=${seed} (diff=${difficulty}): threw ${err.message}`);
        }
        continue;
      }

      tr.generated++;

      const taskIssues = deepCheckTask(task1);
      if (taskIssues.length === 0) {
        tr.valid++;
      } else if (tr.errors.length < MAX_ERRORS_PER_TYPE) {
        tr.errors.push(`seed=${seed}: ${taskIssues.join('; ')}`);
      }

      const sig = `${task1.passage?.id ?? ''}||${task1.stem ?? ''}||${JSON.stringify(task1.options ?? task1.pairs ?? '')}`;
      stemsSeen.add(sig);

      if (task1.format === 'single' && Number.isInteger(task1.answer)) {
        tr.answerDist[task1.answer] = (tr.answerDist[task1.answer] || 0) + 1;
      }

      if (opts.sample > 0 && s <= 2 && report.samples.generated.length < opts.sample * taskTypes.length) {
        report.samples.generated.push({ seed, difficulty, task: task1 });
      }
    }

    if (tr.usedMathRandom) {
      tr.errors.push('Generator called Math.random() instead of using seeded rng');
    }

    tr.uniqueStems = stemsSeen.size;
    tr.duplicateRate = tr.generated > 0 ? Number(((1 - tr.uniqueStems / tr.generated) * 100).toFixed(1)) : 100;

    if (type.format === 'single' && tr.generated >= 50) {
      const counts = Object.values(tr.answerDist);
      const maxCount = Math.max(0, ...counts);
      if (counts.length <= 1 || maxCount / tr.generated > 0.85) {
        tr.errors.push(`Options do not appear shuffled: answer index distribution=${JSON.stringify(tr.answerDist)}`);
      }
    }

    if (tr.generated >= 100 && tr.uniqueStems < 10) {
      tr.warnings.push(`Very low variety: only ${tr.uniqueStems} unique tasks across ${tr.generated} seeds`);
    }

    report.totalErrors += tr.errors.length;
    report.totalWarnings += tr.warnings.length;
    report.typeResults.push(tr);
  }

  // 2. Test buildExam(rng) across opts.exams seeds
  if (typeof mod.buildExam === 'function') {
    report.examResult.tested = true;
    const spec = research.subjects[subjectId];
    for (let e = 1; e <= opts.exams; e++) {
      const seed = 10000 + e;
      try {
        const run1 = withForbiddenMathRandom(() => mod.buildExam(createRng(seed)));
        const exam1 = run1.result;
        if (run1.usedMathRandom && !report.examResult.errors.includes('buildExam called Math.random()')) {
          report.examResult.errors.push('buildExam called Math.random()');
        }
        if (e <= 5) {
          const exam2 = mod.buildExam(createRng(seed));
          if (JSON.stringify(exam1) !== JSON.stringify(exam2)) {
            report.examResult.deterministic = false;
            report.examResult.errors.push(`Exam seed=${seed}: non-deterministic buildExam output`);
          }
        }
        if (!Array.isArray(exam1) || exam1.length === 0) {
          report.examResult.errors.push(`Exam seed=${seed}: returned empty or non-array`);
          continue;
        }
        report.examResult.runs++;
        report.examResult.taskCounts.push(exam1.length);
        const pts = Math.round(exam1.reduce((acc, t) => acc + (Number(t?.points) || 0), 0) * 100) / 100;
        report.examResult.pointSums.push(pts);

        if (spec?.tasks && exam1.length !== spec.tasks && report.examResult.errors.length < 15) {
          report.examResult.errors.push(`Exam seed=${seed}: expected ${spec.tasks} tasks, got ${exam1.length}`);
        }
        if (spec?.rawMax && Math.abs(pts - spec.rawMax) > 1e-6 && report.examResult.errors.length < 15) {
          report.examResult.errors.push(`Exam seed=${seed}: expected raw max ${spec.rawMax} pts, got ${pts}`);
        }

        // Check custom score() if present on first run
        if (e === 1 && typeof mod.score === 'function') {
          const fullEarned = exam1.map((t) => t.points ?? 1);
          const zeroEarned = exam1.map(() => 0);
          const maxScore = mod.score(exam1, fullEarned);
          const minScore = mod.score(exam1, zeroEarned);
          report.examResult.scoreCheck = { max: maxScore, min: minScore };
          if (!maxScore || Math.abs(maxScore.score - 100) > 0.11) {
            report.examResult.errors.push(`SubjectModule.score() with full points returned ${maxScore?.score}, expected 100`);
          }
          if (!minScore || minScore.score !== 0) {
            report.examResult.errors.push(`SubjectModule.score() with 0 points returned ${minScore?.score}, expected 0`);
          }
        }

        // Validate exam sections bounds if provided
        if (e === 1 && Array.isArray(mod.exam?.sections)) {
          for (const sec of mod.exam.sections) {
            if (sec.from < 0 || sec.to >= exam1.length || sec.from > sec.to) {
              report.examResult.errors.push(`exam.sections "${sec.title}" bounds [${sec.from}, ${sec.to}] invalid for length ${exam1.length}`);
            }
          }
        }

        const ids = new Set();
        const taskSigs = new Set();
        exam1.forEach((t, idx) => {
          const issues = deepCheckTask(t);
          if (issues.length > 0 && report.examResult.errors.length < 15) {
            report.examResult.errors.push(`Exam seed=${seed} task[${idx}] (${t?.id}): ${issues.join('; ')}`);
          }
          if (ids.has(t?.id) && report.examResult.errors.length < 15) {
            report.examResult.errors.push(`Exam seed=${seed}: duplicate task.id "${t?.id}"`);
          }
          ids.add(t?.id);
          const sig = `${t?.passage?.id ?? ''}||${t?.stem ?? ''}||${JSON.stringify(t?.options ?? t?.pairs ?? '')}`;
          if (t?.stem && taskSigs.has(sig) && report.examResult.errors.length < 15) {
            report.examResult.errors.push(`Exam seed=${seed}: duplicate task at index ${idx}`);
          }
          if (t?.stem) taskSigs.add(sig);
        });
      } catch (err) {
        report.examResult.errors.push(`Exam seed=${seed} threw: ${err.message}`);
      }
    }
    report.totalErrors += report.examResult.errors.length;
  }

  // 3. Test originals JSON (site/data/original/<subjectId>.json)
  const origData = await loadOriginalsFromDisk(subjectId);
  report.originalsResult.exists = origData.exists;
  report.originalsResult.validJson = origData.validJson;
  if (!origData.exists) {
    report.originalsResult.errors.push(`Missing site/data/original/${subjectId}.json`);
  } else if (!origData.validJson) {
    report.originalsResult.errors.push(origData.error);
  } else {
    report.originalsResult.count = origData.tasks.length;
    if (origData.tasks.length === 0) {
      report.originalsResult.errors.push('Originals array is empty');
    }
    const seenIds = new Set();
    const seenOrigins = new Set();
    origData.tasks.forEach((t, idx) => {
      const label = t?.id || `index ${idx}`;
      if (t?.source !== 'original') {
        report.originalsResult.errors.push(`${label}: source must be "original" (got "${t?.source}")`);
      }
      if (t?.subject !== subjectId) {
        report.originalsResult.errors.push(`${label}: subject="${t?.subject}" !== "${subjectId}"`);
      }
      if (seenIds.has(t?.id)) {
        report.originalsResult.errors.push(`Duplicate original task.id "${t?.id}"`);
      }
      seenIds.add(t?.id);

      const pdfKey = t?.origin?.pdf || 'unknown';
      report.originalsResult.byPdf[pdfKey] = (report.originalsResult.byPdf[pdfKey] || 0) + 1;
      const originSig = `${t?.origin?.pdf}#${t?.origin?.number}`;
      if (t?.origin?.pdf && t?.origin?.number !== undefined) {
        if (seenOrigins.has(originSig)) {
          report.originalsResult.errors.push(`Duplicate origin {pdf, number}: ${originSig}`);
        }
        seenOrigins.add(originSig);
      }

      const issues = deepCheckTask(t);
      if (issues.length > 0 && report.originalsResult.errors.length < 30) {
        report.originalsResult.errors.push(`${label}: ${issues.join('; ')}`);
      }
    });
  }
  report.totalErrors += report.originalsResult.errors.length;

  return report;
}

// ---------- Markdown Report Formatter ----------
function formatSubjectMarkdown(r, opts) {
  const lines = [];
  const status = !r.available
    ? 'MISSING / NOT IMPLEMENTED'
    : r.totalErrors === 0
      ? 'PASS'
      : `FAIL (${r.totalErrors} error(s))`;

  lines.push(`# Self-Test Report: \`${r.subjectId}\` (${r.title || r.subjectId})`);
  lines.push('');
  lines.push(`- **Status**: **${status}**`);
  lines.push(`- **Seeds per TaskType**: ${opts.count}`);
  lines.push(`- **Exam runs**: ${opts.exams}`);
  lines.push(`- **TaskTypes count**: ${r.taskTypeCount}`);
  lines.push(`- **Originals count**: ${r.originalsResult.count} (${JSON.stringify(r.originalsResult.byPdf)})`);
  lines.push('');

  if (r.loadError) {
    lines.push(`## Module Load Error`);
    lines.push('```');
    lines.push(r.loadError);
    lines.push('```');
    return lines.join('\n');
  }

  if (r.moduleErrors?.length > 0) {
    lines.push('## Module Contract Errors');
    for (const e of r.moduleErrors) lines.push(`- **ERROR**: ${e}`);
    lines.push('');
  }

  lines.push(`## 1. TaskType Generators (${opts.count} seeds each)`);
  lines.push('');
  lines.push('| TaskType ID | Topic | Format | Valid / N | Determ. | Unique | Dup % | Errors |');
  lines.push('|---|---|---|---|---|---|---|---|');
  for (const t of r.typeResults) {
    const det = t.deterministic && !t.usedMathRandom ? 'YES' : 'NO';
    lines.push(
      `| \`${t.id}\` | ${t.topic} | \`${t.format}\` | ${t.valid}/${opts.count} | ${det} | ${t.uniqueStems} | ${t.duplicateRate}% | ${t.errors.length} |`
    );
  }
  lines.push('');

  const typesWithIssues = r.typeResults.filter((t) => t.errors.length > 0 || t.warnings.length > 0);
  if (typesWithIssues.length > 0) {
    lines.push('### Generator Issues');
    for (const t of typesWithIssues) {
      lines.push(`#### \`${t.id}\` (${t.title})`);
      for (const e of t.errors) lines.push(`- **ERROR**: ${e}`);
      for (const w of t.warnings) lines.push(`- *WARN*: ${w}`);
      lines.push('');
    }
  }

  lines.push('## 2. Exam Builder (`buildExam`)');
  lines.push('');
  const uniqueCounts = [...new Set(r.examResult.taskCounts)];
  const uniquePoints = [...new Set(r.examResult.pointSums)];
  lines.push(`- **Runs tested**: ${r.examResult.runs}/${opts.exams}`);
  lines.push(`- **Deterministic**: ${r.examResult.deterministic ? 'YES' : 'NO'}`);
  lines.push(`- **Task count per exam**: ${uniqueCounts.join(', ') || 'N/A'}`);
  lines.push(`- **Total raw points per exam**: ${uniquePoints.join(', ') || 'N/A'}`);
  if (r.examResult.scoreCheck) {
    lines.push(`- **Score check**: 0 pts → ${r.examResult.scoreCheck.min?.score}, full pts → ${r.examResult.scoreCheck.max?.score}`);
  }
  if (r.examResult.errors.length > 0) {
    lines.push('- **Errors**:');
    for (const e of r.examResult.errors) lines.push(`  - ${e}`);
  } else {
    lines.push('- **Errors**: None');
  }
  lines.push('');

  lines.push(`## 3. Originals (\`site/data/original/${r.subjectId}.json\`)`);
  lines.push('');
  lines.push(`- **File exists**: ${r.originalsResult.exists ? 'YES' : 'NO'}`);
  lines.push(`- **Valid JSON**: ${r.originalsResult.validJson ? 'YES' : 'NO'}`);
  lines.push(`- **Total tasks**: ${r.originalsResult.count}`);
  lines.push(`- **By PDF**: \`${JSON.stringify(r.originalsResult.byPdf)}\``);
  if (r.originalsResult.errors.length > 0) {
    lines.push('- **Errors**:');
    for (const e of r.originalsResult.errors) lines.push(`  - ${e}`);
  } else {
    lines.push('- **Errors**: None');
  }
  lines.push('');

  return lines.join('\n');
}

// ---------- Main ----------
async function main() {
  const opts = parseArgs(process.argv);
  await fs.mkdir(REPORTS_DIR, { recursive: true });
  const research = await loadResearchExpectations();

  const reports = [];
  for (const subjectId of opts.subjects) {
    const rep = await verifySubject(subjectId, opts, research);
    reports.push(rep);
    const md = formatSubjectMarkdown(rep, opts);
    await fs.writeFile(path.join(REPORTS_DIR, `${subjectId}.md`), md, 'utf8');
  }

  console.log(`\n=== ULDUZ CONTENT SELF-TEST (N=${opts.count} seeds/type, exams=${opts.exams}, katex=${katex ? 'ON' : 'OFF'}) ===`);
  console.log(
    pad('Subject', 8) +
    pad('Module', 10) +
    pad('Types', 8) +
    pad('Valid/Gen', 14) +
    pad('Unique%', 10) +
    pad('Exam(cnt/pts)', 16) +
    pad('Originals', 12) +
    'Status'
  );
  console.log('-'.repeat(92));

  for (const r of reports) {
    if (!r.available) {
      console.log(
        pad(r.subjectId, 8) +
        pad('MISSING', 10) +
        pad('-', 8) +
        pad('-', 14) +
        pad('-', 10) +
        pad('-', 16) +
        pad(String(r.originalsResult.count), 12) +
        'PENDING'
      );
      continue;
    }
    const totalGen = r.typeResults.reduce((a, t) => a + t.generated, 0);
    const totalVal = r.typeResults.reduce((a, t) => a + t.valid, 0);
    const totalUniq = r.typeResults.reduce((a, t) => a + t.uniqueStems, 0);
    const uniqPct = totalGen > 0 ? `${((totalUniq / totalGen) * 100).toFixed(1)}%` : '-';
    const examCnt = [...new Set(r.examResult.taskCounts)].join('/') || '-';
    const examPts = [...new Set(r.examResult.pointSums)].join('/') || '-';
    const status = r.totalErrors === 0 ? 'PASS' : `FAIL (${r.totalErrors} errs)`;

    console.log(
      pad(r.subjectId, 8) +
      pad('OK', 10) +
      pad(String(r.taskTypeCount), 8) +
      pad(`${totalVal}/${totalGen}`, 14) +
      pad(uniqPct, 10) +
      pad(`${examCnt} (${examPts}p)`, 16) +
      pad(String(r.originalsResult.count), 12) +
      status
    );
  }
  console.log('-'.repeat(92));
  console.log(`Reports written to: tools/reports/<subject>.md\n`);
}

function pad(str, len) {
  const s = String(str);
  return s.length >= len ? s + ' ' : s + ' '.repeat(len - s.length);
}

main().catch((err) => {
  console.error('Fatal error in selftest:', err);
  process.exit(1);
});
