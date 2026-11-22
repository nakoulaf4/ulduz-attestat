// Shared helpers for English task generators.

import { normalizeText } from '../../core/contract.js';

export const GAP = '<span class="gap"></span>';

/**
 * Build a validated 'single' (5-option) task payload with deduplicated distractors
 * and shuffled options.
 */
export function buildSingle(rng, {
  stem,
  correct,
  distractors,
  explanation,
  hint,
  difficulty = 2,
  points = 1,
  passage,
}) {
  const corrNorm = normalizeText(correct);
  const seen = new Set([corrNorm]);
  const pool = [];
  for (const d of distractors) {
    if (!d) continue;
    const norm = normalizeText(d);
    if (!norm || seen.has(norm)) continue;
    seen.add(norm);
    pool.push(d);
  }
  if (pool.length < 4) {
    throw new Error(`buildSingle: need >=4 unique distractors for stem "${stem.slice(0, 60)}" (got ${pool.length})`);
  }
  const chosenDistractors = rng.sample(pool, 4);
  const options = rng.shuffle([correct, ...chosenDistractors]);
  const answer = options.indexOf(correct);

  const task = {
    stem,
    format: 'single',
    options,
    answer,
    points,
    difficulty,
    explanation,
  };
  if (hint) task.hint = hint;
  if (passage) task.passage = passage;
  return task;
}

/**
 * Build DİM-style pair options ("1, 3", "2, 4", etc.) for 4 numbered statements
 * where exactly `correctPair` ([a, b], 1-based sorted) are correct.
 */
export function buildFourChooseTwo(rng, correctPair) {
  const [c1, c2] = [...correctPair].sort((a, b) => a - b);
  const correct = `${c1}, ${c2}`;
  const allPairs = ['1, 2', '1, 3', '1, 4', '2, 3', '2, 4', '3, 4'];
  const distractors = allPairs.filter((p) => p !== correct);
  const picked = rng.sample(distractors, 4);
  const options = rng.shuffle([correct, ...picked]);
  return { options, answer: options.indexOf(correct), correct };
}

/**
 * Filter a bank array by difficulty (falls back to all items if fewer than minCount match).
 */
export function pickByDifficulty(rng, items, difficulty, minCount = 3) {
  const exact = items.filter((item) => item.diff === difficulty);
  if (exact.length >= minCount) return rng.pick(exact);
  const near = items.filter((item) => !item.diff || Math.abs(item.diff - difficulty) <= 1);
  if (near.length >= minCount) return rng.pick(near);
  return rng.pick(items);
}

/**
 * Format passage paragraphs cleanly into Html.
 */
export function formatPassageHtml(paragraphs, numbered = false) {
  return paragraphs
    .map((p, idx) => (numbered ? `<p><b>${idx + 1}.</b> ${p}</p>` : `<p>${p}</p>`))
    .join('');
}
