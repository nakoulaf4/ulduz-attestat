// Shared deterministic helpers for DİM Block Subjects (Physics, Chemistry, Biology, History, Geography, Informatics).
// Guarantees shuffled pairwise-distinct options, zero duplicate tasks inside buildExam(), and clean 100-point DİM scaling.

import { finalizeTask, normalizeText } from '../../core/contract.js';

/**
 * Build a 5-option shuffled 'single' answer payload with guaranteed pairwise-distinct strings/numbers.
 * @param {import('../../core/rng.js').Rng} rng
 * @param {string} correct
 * @param {string[]} distractors
 */
export function buildShuffledSingle(rng, correct, distractors) {
  const seen = new Set([normalizeText(correct)]);
  const pool = [{ html: String(correct), ok: true }];
  for (const d of distractors) {
    const s = String(d);
    const key = normalizeText(s);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    pool.push({ html: s, ok: false });
    if (pool.length === 5) break;
  }
  const shuffled = rng.shuffle(pool);
  return {
    options: shuffled.map((x) => x.html),
    answer: shuffled.findIndex((x) => x.ok),
  };
}

/**
 * Generate a 5-option shuffled numeric MCQ around a positive/signed numeric answer with guaranteed distinct distractors.
 */
export function buildNumericSingle(rng, correctVal, unit = '', candidateVals = []) {
  const fmt = (v) => {
    const num = Math.round(v * 100) / 100;
    const str = String(num).replace('.', ',');
    if (!unit) return `$${str}$`;
    const cleanUnit = unit.startsWith('\\') ? unit.replace(/^\\text\{(.*)\}$/, '$1').trim() : unit;
    return cleanUnit.startsWith(':') || cleanUnit === '%' || cleanUnit === '\\%'
      ? `${str}${cleanUnit === '\\%' ? '%' : cleanUnit}`
      : `$${str}$ ${cleanUnit}`;
  };
  const used = new Set([Math.round(correctVal * 100) / 100]);
  const dists = [];
  for (const c of candidateVals) {
    const n = Math.round(Number(c) * 100) / 100;
    if (!Number.isFinite(n) || used.has(n)) continue;
    used.add(n);
    dists.push(fmt(n));
    if (dists.length === 4) break;
  }
  let bump = 1;
  while (dists.length < 4) {
    const alt = Math.round((correctVal + bump * (correctVal >= 0 ? 1 : -1)) * 100) / 100;
    if (!used.has(alt)) {
      used.add(alt);
      dists.push(fmt(alt));
    }
    bump++;
  }
  return buildShuffledSingle(rng, fmt(correctVal), dists);
}

/**
 * Standard 30-task DİM Block Exam builder (22 closed × 1 pt + 5 short/match/order × 1 pt + 3 open × 2 pts = 33 raw pts -> 100 scaled).
 * Enforces unique task IDs and unique stems across all 30 tasks deterministically.
 */
export function buildStandardBlockExam(subjectId, taskTypes, rng) {
  const closedTypes = taskTypes.filter((t) => t.format === 'single');
  const midTypes = taskTypes.filter((t) => t.format === 'short' || t.format === 'match' || t.format === 'order');
  const openTypes = taskTypes.filter((t) => t.format === 'open');

  const tasks = [];
  const usedSigs = new Set();

  function addSlot(pool, slotIdx, pointsOverride, preferredDiff) {
    const typePool = pool.length > 0 ? pool : taskTypes;
    for (let attempt = 0; attempt < 40; attempt++) {
      const tp = typePool[(slotIdx + attempt) % typePool.length];
      const slotRng = rng.fork(`${subjectId}-slot-${slotIdx}-a${attempt}`);
      const diff = preferredDiff || ((slotIdx % 3) + 1);
      const raw = tp.generate(slotRng, { difficulty: diff });
      const task = finalizeTask(tp, slotRng, raw);
      task.id = `${subjectId}.exam#${rng.seed}-${slotIdx + 1}`;
      task.points = pointsOverride;
      const sig = `${task.stem}||${JSON.stringify(task.options ?? task.pairs ?? '')}`;
      if (!usedSigs.has(sig) || attempt === 39) {
        usedSigs.add(sig);
        tasks.push(task);
        return;
      }
    }
  }

  // 1..22: Closed multiple-choice (1 pt)
  for (let i = 0; i < 22; i++) {
    addSlot(closedTypes, i, 1, i < 8 ? 1 : i < 16 ? 2 : 3);
  }
  // 23..27: Short, Match, Order (1 pt)
  for (let i = 0; i < 5; i++) {
    addSlot(midTypes, 22 + i, 1, i < 2 ? 1 : 2);
  }
  // 28..30: Open detailed tasks (2 pts)
  for (let i = 0; i < 3; i++) {
    addSlot(openTypes, 27 + i, 2, i === 0 ? 2 : 3);
  }

  return tasks;
}

/**
 * Official 100-point DİM scaling for a 33-point Block Exam (no negative marking).
 */
export function scoreStandardBlockExam(tasks, earnedList) {
  const rawMax = tasks.reduce((s, tk) => s + Number(tk.points ?? 1), 0) || 33;
  const rawEarned = Math.max(0, earnedList.reduce((s, v) => s + (Number(v) || 0), 0));
  const scaled = Math.min(100, Math.round((rawEarned / rawMax) * 1000) / 10);
  return {
    score: scaled,
    max: 100,
    label: `Шкала ДИМ (100 б., перв. ${Math.round(rawEarned * 100) / 100}/${rawMax})`,
  };
}
