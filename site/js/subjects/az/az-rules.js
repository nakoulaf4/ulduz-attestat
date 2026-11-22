// Algorithmic Azerbaijani phonology, vowel harmony, morphology, and task helpers.
// Used by all `az` generators to build inflections, verify phonetic counts,
// and guarantee pairwise-distinct, properly shuffled options.

import { normalizeText } from '../../core/contract.js';

export const VOWELS = {
  a: { back: true, open: true, rounded: false },
  ı: { back: true, open: false, rounded: false },
  o: { back: true, open: true, rounded: true },
  u: { back: true, open: false, rounded: true },
  e: { back: false, open: true, rounded: false },
  ə: { back: false, open: true, rounded: false },
  i: { back: false, open: false, rounded: false },
  ö: { back: false, open: true, rounded: true },
  ü: { back: false, open: false, rounded: true },
};

export const VOICED_CONS = new Set(['b', 'c', 'd', 'g', 'ğ', 'j', 'l', 'm', 'n', 'q', 'r', 'v', 'y', 'z']);
export const VOICELESS_CONS = new Set(['ç', 'f', 'h', 'k', 'p', 's', 'ş', 't', 'x']);
export const SONORANTS = new Set(['l', 'm', 'n', 'r']);
// Consonants that have a voiced/voiceless pair in Azerbaijani school phonetics
export const PAIRED_CONS = {
  b: 'p', p: 'b',
  c: 'ç', ç: 'c',
  d: 't', t: 'd',
  g: 'k', k: 'g',
  ğ: 'x', x: 'ğ',
  j: 'ş', ş: 'j',
  v: 'f', f: 'v',
  z: 's', s: 'z',
};

/** Return the last vowel character in an Azerbaijani word (lowercased). */
export function lastVowel(word) {
  const w = word.toLowerCase();
  for (let i = w.length - 1; i >= 0; i--) {
    if (VOWELS[w[i]]) return w[i];
  }
  return 'a';
}

/** 2-way vowel harmony: 'a' (back) or 'ə' (front). */
export function harmony2(word, forceFront = false) {
  if (forceFront) return 'ə';
  return VOWELS[lastVowel(word)].back ? 'a' : 'ə';
}

/** 4-way vowel harmony: 'ı' | 'i' | 'u' | 'ü'. */
export function harmony4(word, forceFront = false) {
  const v = forceFront ? 'i' : lastVowel(word);
  const info = VOWELS[v];
  if (info.back) return info.rounded ? 'u' : 'ı';
  return info.rounded ? 'ü' : 'i';
}

/** Inflect plural suffix (-lar / -lər). */
export function inflectPlural(word, forceFront = false) {
  return `${word}l${harmony2(word, forceFront)}r`;
}

/**
 * Inflect a noun in Azerbaijani case or possessive form.
 * Supports vowel-drop stems (`dropType: 'possOnly' | 'both'`), `k→y` / `q→ğ` alternation,
 * and `su` / `nə` style linking consonant `y` when needed.
 */
export function inflectNoun(entry, { poss3 = false, caseName = 'adlıq' } = {}) {
  const { word, dropStem, dropType, noAlt, forceFront } = entry;
  const endsWithVowel = Boolean(VOWELS[word[word.length - 1]]);

  const altStem = (base) => {
    if (noAlt) return base;
    if (base.endsWith('k') && base.length > 2) return base.slice(0, -1) + 'y';
    if (base.endsWith('q') && base.length > 2) return base.slice(0, -1) + 'ğ';
    return base;
  };

  let stem = word;
  if (poss3) {
    if (dropStem && (dropType === 'possOnly' || dropType === 'both')) {
      stem = dropStem + harmony4(word, forceFront);
    } else if (endsWithVowel) {
      stem = word + 's' + harmony4(word, forceFront);
    } else {
      stem = altStem(word) + harmony4(word, forceFront);
    }
  }

  const h2 = harmony2(stem, forceFront);
  const h4 = harmony4(stem, forceFront);
  const stemEndsVowel = Boolean(VOWELS[stem[stem.length - 1]]);

  switch (caseName) {
    case 'adlıq':
      return stem;
    case 'yiyəlik':
      if (poss3) return `${stem}n${h4}n`;
      if (dropStem && dropType === 'both') return `${dropStem}${h4}n`;
      return stemEndsVowel ? `${stem}n${h4}n` : `${altStem(stem)}${h4}n`;
    case 'yönlük':
      if (poss3) return `${stem}n${h2}`;
      if (dropStem && dropType === 'both') return `${dropStem}${h2}`;
      return stemEndsVowel ? `${stem}y${h2}` : `${altStem(stem)}${h2}`;
    case 'təsirlik':
      if (poss3) return `${stem}n${h4}`;
      if (dropStem && dropType === 'both') return `${dropStem}${h4}`;
      return stemEndsVowel ? `${stem}y${h4}` : `${altStem(stem)}${h4}`;
    case 'yerlik':
      return poss3 ? `${stem}nd${h2}` : `${stem}d${h2}`;
    case 'çıxışlıq':
      return poss3 ? `${stem}nd${h2}n` : `${stem}d${h2}n`;
    default:
      return stem;
  }
}

/**
 * Parse a transcription string like "[uşaxcannı]" or "[tə:ssüf]" into phoneme tokens.
 * Handles palatalized `[k']` / `[x']` / `[g']` and long vowels `[a:]`, `[ə:]`, `[i:]`, `[ö:]`, `[ü:]`.
 */
export function tokenizeTrans(trans) {
  const clean = trans.replace(/^\[|\]$/g, '').replace(/[- ]/g, '').toLowerCase();
  const tokens = [];
  for (let i = 0; i < clean.length; i++) {
    const ch = clean[i];
    if (clean[i + 1] === '\'' || clean[i + 1] === ':') {
      tokens.push(ch + clean[i + 1]);
      i++;
    } else {
      tokens.push(ch);
    }
  }
  return tokens;
}

/**
 * Analyze orthographic word + DİM phonetic transcription.
 * Returns exact counts used by `az.phonetics`.
 */
export function analyzePhonetics(word, trans, diffsCount) {
  const letters = word.replace(/[- ]/g, '').toLowerCase().split('');
  const sounds = tokenizeTrans(trans);
  const vowels = [];
  const consonants = [];
  for (const s of sounds) {
    const base = s[0];
    if (VOWELS[base]) vowels.push(s);
    else consonants.push(s);
  }
  const openVowels = vowels.filter((v) => VOWELS[v[0]].open).length;
  const closedVowels = vowels.length - openVowels;
  const backVowels = vowels.filter((v) => VOWELS[v[0]].back).length;
  const frontVowels = vowels.length - backVowels;
  const voiced = consonants.filter((c) => VOICED_CONS.has(c[0])).length;
  const voiceless = consonants.length - voiced;
  const equalCount = letters.length === sounds.length;
  const sameWriting = word.replace(/[- ]/g, '').toLowerCase() === trans.replace(/^\[|\]$/g, '').replace(/[- :']/g, '').toLowerCase() && !trans.includes(':') && !trans.includes("'");
  const actualDiffs = typeof diffsCount === 'number' ? diffsCount : (sameWriting ? 0 : 1);

  return {
    word,
    trans,
    letterCount: letters.length,
    soundCount: sounds.length,
    equalCount,
    sameWriting,
    diffsCount: actualDiffs,
    vowels,
    consonants,
    openVowels,
    closedVowels,
    backVowels,
    frontVowels,
    voiced,
    voiceless,
    hasLongVowel: trans.includes(':'),
    harmonyOk: backVowels === 0 || frontVowels === 0,
  };
}

/**
 * Build a validated 5-option `single` task from a correct option + pool of distractors.
 * Guarantees pairwise-distinct options after `normalizeText` and shuffled placement.
 */
export function buildSingleOptions(rng, correctOpt, distractorPool, count = 5) {
  const seen = new Set([normalizeText(correctOpt)]);
  const distractors = [];
  for (const d of rng.shuffle(distractorPool)) {
    const norm = normalizeText(d);
    if (!norm || seen.has(norm)) continue;
    seen.add(norm);
    distractors.push(d);
    if (distractors.length === count - 1) break;
  }
  if (distractors.length < count - 1) {
    throw new Error(`Not enough unique distractors for "${correctOpt}" (got ${distractors.length})`);
  }
  const combined = [
    { text: correctOpt, isCorrect: true },
    ...distractors.map((text) => ({ text, isCorrect: false })),
  ];
  const shuffled = rng.shuffle(combined);
  return {
    options: shuffled.map((x) => x.text),
    answer: shuffled.findIndex((x) => x.isCorrect),
  };
}

/** Format an array of 1-based item numbers as "1, 3, 5". */
export function fmtNums(arr) {
  return [...arr].sort((a, b) => a - b).join(', ');
}

/**
 * Generate distinct numeric-list distractors (e.g. "2, 3, 6") from items 1..maxN.
 */
export function buildComboOptions(rng, correctNums, maxN = 6, optionCount = 5) {
  const correctStr = fmtNums(correctNums);
  const allNums = Array.from({ length: maxN }, (_, i) => i + 1);
  const wrongPool = [];
  const seen = new Set([correctStr]);

  // Perturbations: flip 1 or 2 items around the correct subset for plausible distractors
  for (let attempt = 0; attempt < 80 && wrongPool.length < optionCount - 1; attempt++) {
    const cand = new Set(correctNums);
    const flips = rng.int(1, 2);
    for (let f = 0; f < flips; f++) {
      const k = rng.pick(allNums);
      if (cand.has(k) && cand.size > 2) cand.delete(k);
      else cand.add(k);
    }
    if (cand.size < 2 || cand.size > maxN - 1) continue;
    const str = fmtNums([...cand]);
    if (!seen.has(str)) {
      seen.add(str);
      wrongPool.push(str);
    }
  }
  // Deterministic fallback if random perturbations collided
  for (let a = 1; a <= maxN && wrongPool.length < optionCount - 1; a++) {
    for (let b = a + 1; b <= maxN && wrongPool.length < optionCount - 1; b++) {
      const str = `${a}, ${b}`;
      if (!seen.has(str)) {
        seen.add(str);
        wrongPool.push(str);
      }
    }
  }
  return buildSingleOptions(rng, correctStr, wrongPool, optionCount);
}

/** Generate 5 distinct 2-item numeric options (e.g. "2, 4") from 1..maxN. */
export function buildPairComboOptions(rng, correctPair, maxN = 5, optionCount = 5) {
  const correctStr = fmtNums(correctPair);
  const pairs = [];
  for (let a = 1; a <= maxN; a++) {
    for (let b = a + 1; b <= maxN; b++) {
      const s = `${a}, ${b}`;
      if (s !== correctStr) pairs.push(s);
    }
  }
  return buildSingleOptions(rng, correctStr, pairs, optionCount);
}
