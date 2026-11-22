#!/usr/bin/env node
/**
 * Helper to sample ≥20 generated tasks and ≥10 original tasks for manual QA verification.
 * Usage: node tools/sample.mjs <subjectId> [--gen 25] [--orig 12] [--seed 4242]
 * Writes tools/reports/<subjectId>-samples.md
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRng } from '../site/js/core/rng.js';
import { finalizeTask } from '../site/js/core/contract.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const SITE_DIR = path.join(ROOT_DIR, 'site');
const REPORTS_DIR = path.join(__dirname, 'reports');

function parseArgs(argv) {
  const opts = { subject: argv[2], gen: 24, orig: 12, seed: 202603 };
  for (let i = 3; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--gen' && argv[i + 1]) opts.gen = parseInt(argv[++i], 10) || 24;
    else if (a === '--orig' && argv[i + 1]) opts.orig = parseInt(argv[++i], 10) || 12;
    else if (a === '--seed' && argv[i + 1]) opts.seed = parseInt(argv[++i], 10) || 202603;
  }
  return opts;
}

function formatTaskMd(label, task) {
  const lines = [];
  lines.push(`### ${label}`);
  lines.push(`- **id**: \`${task.id}\` | **typeId**: \`${task.typeId}\` | **format**: \`${task.format}\` | **difficulty**: ${task.difficulty} | **points**: ${task.points} | **topic**: ${task.topic}`);
  if (task.origin) {
    lines.push(`- **origin**: \`${JSON.stringify(task.origin)}\``);
  }
  if (task.passage) {
    const snippet = task.passage.html.replace(/\s+/g, ' ').slice(0, 500);
    lines.push(`- **passage** (\`${task.passage.id}\`, title: ${task.passage.title ?? '—'}): ${snippet}${task.passage.html.length > 500 ? '…' : ''}`);
  }
  if (task.image) {
    lines.push(`- **image**: alt="${task.image.alt}" | src=${task.image.src ?? '(inline svg, len=' + (task.image.svg?.length ?? 0) + ')'}`);
  }
  lines.push(`- **stem**: ${task.stem}`);
  if (task.options) {
    lines.push('- **options**:');
    task.options.forEach((opt, i) => {
      const letter = String.fromCharCode(65 + i);
      const isAns = Array.isArray(task.answer) ? task.answer.includes(i) : task.answer === i;
      lines.push(`  - [${i}] ${letter}) ${opt}${isAns ? '  **<-- ANSWER**' : ''}`);
    });
  }
  if (task.pairs) {
    lines.push('- **pairs**:');
    task.pairs.left.forEach((l, i) => {
      const rIdx = task.answer?.[i];
      lines.push(`  - L[${i}]: ${l}  ==>  R[${rIdx}]: ${task.pairs.right[rIdx] ?? '?'}`);
    });
    lines.push(`  - All right: ${JSON.stringify(task.pairs.right)}`);
  }
  lines.push(`- **answer**: \`${JSON.stringify(task.answer)}\`${task.accept ? ` | **accept**: \`${JSON.stringify(task.accept)}\`` : ''}`);
  if (task.rubric) lines.push(`- **rubric**: ${task.rubric}`);
  lines.push(`- **explanation**: ${task.explanation}`);
  lines.push('');
  return lines.join('\n');
}

async function main() {
  const opts = parseArgs(process.argv);
  if (!opts.subject) {
    console.error('Usage: node tools/sample.mjs <math|ru|en|az>');
    process.exit(1);
  }

  const rng = createRng(opts.seed);
  const modPath = path.join(SITE_DIR, 'js', 'subjects', opts.subject, 'index.js');
  const mod = (await import(pathToFileURL(modPath).href)).default;

  const lines = [`# Manual QA Sample: \`${opts.subject}\` (seed=${opts.seed})\n`];

  // Sample generated tasks distributed across all taskTypes and difficulties
  lines.push(`## Generated Sample (${opts.gen} tasks across ${mod.taskTypes.length} taskTypes)\n`);
  const shuffledTypes = rng.shuffle(mod.taskTypes);
  for (let i = 0; i < opts.gen; i++) {
    const type = shuffledTypes[i % shuffledTypes.length];
    const seed = rng.int(1, 50000);
    const difficulty = ((i % 3) + 1);
    const taskRng = createRng(seed);
    const task = finalizeTask(type, taskRng, type.generate(taskRng, { difficulty }));
    lines.push(formatTaskMd(`GEN #${i + 1} (seed=${seed}, diff=${difficulty})`, task));
  }

  // Also sample 1 full exam summary
  const examRng = createRng(opts.seed + 777);
  const exam = mod.buildExam(examRng);
  lines.push(`## Exam Order & Points Check (seed=${opts.seed + 777})\n`);
  lines.push(`Total tasks: ${exam.length}, Total raw points: ${exam.reduce((s, t) => s + t.points, 0)}\n`);
  exam.forEach((t, idx) => {
    lines.push(`${idx + 1}. \`${t.typeId}\` (${t.format}, ${t.points} pt${t.points > 1 ? 's' : ''}, diff=${t.difficulty}) — ${t.stem.replace(/<[^>]+>/g, ' ').slice(0, 90)}`);
  });
  lines.push('');

  // Sample original tasks
  const origPath = path.join(SITE_DIR, 'data', 'original', `${opts.subject}.json`);
  try {
    const raw = JSON.parse(await fs.readFile(origPath, 'utf8'));
    const origs = Array.isArray(raw) ? raw : (raw.tasks ?? []);
    const picked = rng.sample(origs, Math.min(opts.orig, origs.length));
    lines.push(`## Originals Sample (${picked.length} of ${origs.length})\n`);
    picked.forEach((t, idx) => {
      lines.push(formatTaskMd(`ORIG #${idx + 1} (${t.id})`, t));
    });
  } catch (err) {
    lines.push(`## Originals Sample\nCould not load originals: ${err.message}\n`);
  }

  await fs.mkdir(REPORTS_DIR, { recursive: true });
  const outPath = path.join(REPORTS_DIR, `${opts.subject}-samples.md`);
  await fs.writeFile(outPath, lines.join('\n'), 'utf8');
  console.log(`Wrote ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
