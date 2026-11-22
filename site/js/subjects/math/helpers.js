// Shared math formatting, arithmetic, and MCQ option helpers for Ulduz math generators.
import { normalizeText, parseNumber } from '../../core/contract.js';

/** Greatest common divisor (non-negative). */
export function gcd(a, b) {
  a = Math.abs(Math.trunc(a));
  b = Math.abs(Math.trunc(b));
  while (b !== 0) {
    const t = a % b;
    a = b;
    b = t;
  }
  return a || 1;
}

/** Least common multiple (positive). */
export function lcm(a, b) {
  return Math.abs(Math.trunc(a) * Math.trunc(b)) / gcd(a, b);
}

/** Exact factorial for small n <= 12. */
export function fact(n) {
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}

/** Exact binomial coefficient C(n, k). */
export function comb(n, k) {
  if (k < 0 || k > n) return 0;
  k = Math.min(k, n - k);
  let res = 1;
  for (let i = 1; i <= k; i++) {
    res = (res * (n - k + i)) / i;
  }
  return Math.round(res);
}

/** Round floating point noise to at most 9 decimal digits and avoid -0. */
export function cleanNum(n) {
  const r = Math.round(n * 1e9) / 1e9;
  return Object.is(r, -0) ? 0 : r;
}

/** Format number for Russian display (comma as decimal separator, no -0). */
export function fmtRu(n) {
  const c = cleanNum(n);
  return String(c).replace('.', ',');
}

/** Format number inside KaTeX math ($...$), using {,} for Russian decimal comma. */
export function fmtTexNum(n) {
  const c = cleanNum(n);
  const s = String(c);
  return s.includes('.') ? s.replace('.', '{,}') : s;
}

/** Format canonical short answer (comma decimal, clean string). */
export function fmtShortAns(n) {
  return fmtRu(n);
}

/** Build `accept` list for a numeric short answer (comma & dot variants, plus optional fraction). */
export function numAccept(n, extra = []) {
  const c = cleanNum(n);
  const dot = String(c);
  const comma = dot.replace('.', ',');
  const set = new Set([comma, dot, ...extra]);
  set.delete(comma); // canonical goes in `answer`, others in `accept`
  return [...set];
}

/** Format reduced fraction as LaTeX: integer if den===1, else \frac{num}{den} with sign outside. */
export function fmtFracTex(num, den) {
  if (den < 0) {
    num = -num;
    den = -den;
  }
  const g = gcd(num, den);
  num /= g;
  den /= g;
  if (den === 1) return String(num);
  const sign = num < 0 ? '-' : '';
  return `${sign}\\frac{${Math.abs(num)}}{${den}}`;
}

/** Format reduced fraction as plain text "p/q" or integer. */
export function fmtFracText(num, den) {
  if (den < 0) {
    num = -num;
    den = -den;
  }
  const g = gcd(num, den);
  num /= g;
  den /= g;
  if (den === 1) return String(num);
  return `${num}/${den}`;
}

/**
 * Format a linear term `coeff * sym` safely without `+-` or `1x`.
 * @param {number} coeff
 * @param {string} sym e.g. 'x', 'a^2', ''
 * @param {boolean} isFirst true if leading term in expression
 */
export function fmtTerm(coeff, sym = '', isFirst = false) {
  if (coeff === 0) return isFirst ? '0' : '';
  const abs = Math.abs(coeff);
  const signStr = coeff < 0 ? (isFirst ? '-' : ' - ') : (isFirst ? '' : ' + ');
  const coefStr = sym && abs === 1 ? '' : fmtTexNum(abs);
  return `${signStr}${coefStr}${sym}`;
}

/** Format a polynomial from descending terms [[coeff, sym], ...], omitting zero terms. */
export function fmtPoly(terms) {
  const parts = [];
  for (const [c, sym] of terms) {
    if (c === 0) continue;
    parts.push(fmtTerm(c, sym, parts.length === 0));
  }
  return parts.length > 0 ? parts.join('') : '0';
}

/** Format signed constant `+ c` or `- c` (empty if 0). */
export function fmtConst(c, isFirst = false) {
  if (c === 0) return isFirst ? '0' : '';
  return fmtTerm(c, '', isFirst);
}

/** Russian pluralization for integer n: one (1, 21), few (2..4, 22..24), many (0, 5..20). */
export function pluralRu(n, one, few, many) {
  const abs = Math.abs(Math.trunc(n));
  const m100 = abs % 100;
  const m10 = abs % 10;
  if (m100 >= 11 && m100 <= 14) return many;
  if (m10 === 1) return one;
  if (m10 >= 2 && m10 <= 4) return few;
  return many;
}

/**
 * Build 5 distinct, shuffled MCQ options for 'single' format.
 * Guarantees no normalized string duplicates and no numerically equal options.
 *
 * @param {import('../../core/rng.js').Rng} rng
 * @param {string} correctOpt
 * @param {string[]} candidates
 * @param {(step: number) => string} [fallbackFn] generates extra distinct option if needed
 * @returns {{ options: string[], answer: number }}
 */
export function buildMcqOptions(rng, correctOpt, candidates, fallbackFn) {
  const seenNorm = new Set();
  const seenNums = [];

  const isDup = (opt) => {
    const norm = normalizeText(opt);
    if (!norm || seenNorm.has(norm)) return true;
    const num = parseNumber(opt);
    if (!Number.isNaN(num)) {
      for (const prev of seenNums) {
        if (Math.abs(num - prev) < 1e-9 * Math.max(1, Math.abs(prev))) return true;
      }
    }
    return false;
  };

  const acceptOpt = (opt) => {
    seenNorm.add(normalizeText(opt));
    const num = parseNumber(opt);
    if (!Number.isNaN(num)) seenNums.push(num);
  };

  acceptOpt(correctOpt);
  const distractors = [];
  for (const c of candidates) {
    if (distractors.length >= 4) break;
    if (typeof c !== 'string' || !c.trim()) continue;
    if (!isDup(c)) {
      acceptOpt(c);
      distractors.push(c);
    }
  }

  let step = 1;
  while (distractors.length < 4 && step < 100) {
    const extra = fallbackFn ? fallbackFn(step) : `$${step + 100}$`;
    if (extra && !isDup(extra)) {
      acceptOpt(extra);
      distractors.push(extra);
    }
    step++;
  }

  if (distractors.length < 4) {
    throw new Error(`buildMcqOptions: could not generate 4 distinct distractors for "${correctOpt}"`);
  }

  const all = [
    { text: correctOpt, ok: true },
    ...distractors.map((text) => ({ text, ok: false })),
  ];
  const shuffled = rng.shuffle(all);
  const answer = shuffled.findIndex((x) => x.ok);
  return {
    options: shuffled.map((x) => x.text),
    answer,
  };
}
