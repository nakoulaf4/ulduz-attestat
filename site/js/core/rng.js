// Seeded pseudo-random generator (mulberry32) used by every task generator.
// Same seed ⇒ same sequence, so generated tasks are reproducible from (typeId, seed).

/** Hash an arbitrary string/number into a 32-bit unsigned seed. */
export function hashSeed(value) {
  const s = String(value);
  let h = 1779033703 ^ s.length;
  for (let i = 0; i < s.length; i++) {
    h = Math.imul(h ^ s.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  h = Math.imul(h ^ (h >>> 16), 2246822507);
  h = Math.imul(h ^ (h >>> 13), 3266489909);
  return (h ^= h >>> 16) >>> 0;
}

/** A fresh random seed (non-deterministic). */
export function randomSeed() {
  if (globalThis.crypto?.getRandomValues) {
    return globalThis.crypto.getRandomValues(new Uint32Array(1))[0];
  }
  return (Math.random() * 2 ** 32) >>> 0;
}

/**
 * @typedef {Object} Rng
 * @property {number} seed               the initial 32-bit seed
 * @property {() => number} float        uniform in [0, 1)
 * @property {(a:number, b:number) => number} int   integer in [a, b] inclusive
 * @property {<T>(arr:T[]) => T} pick    random element
 * @property {<T>(arr:T[]) => T[]} shuffle  NEW shuffled copy (input not mutated)
 * @property {<T>(arr:T[], k:number) => T[]} sample  k distinct elements (order random)
 * @property {(p:number) => boolean} chance  true with probability p
 * @property {() => number} sign         -1 or 1
 * @property {(a:number, b:number, exclude:number[]) => number} intExcept  int in [a,b] not in exclude
 * @property {(label?:string|number) => Rng} fork  independent child rng (deterministic)
 */

/**
 * Create a seeded RNG.
 * @param {number|string} [seed] number or string; omitted ⇒ random seed
 * @returns {Rng}
 */
export function createRng(seed) {
  const initial = seed === undefined ? randomSeed()
    : typeof seed === 'number' && Number.isInteger(seed) ? seed >>> 0
    : hashSeed(seed);
  let state = initial;

  const float = () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const int = (a, b) => {
    if (b < a) [a, b] = [b, a];
    return a + Math.floor(float() * (b - a + 1));
  };
  const pick = (arr) => {
    if (!arr || arr.length === 0) throw new Error('rng.pick: empty array');
    return arr[Math.floor(float() * arr.length)];
  };
  const shuffle = (arr) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(float() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  const sample = (arr, k) => {
    if (k > arr.length) throw new Error(`rng.sample: k=${k} > length=${arr.length}`);
    return shuffle(arr).slice(0, k);
  };
  const chance = (p) => float() < p;
  const sign = () => (float() < 0.5 ? -1 : 1);
  const intExcept = (a, b, exclude = []) => {
    const ex = new Set(exclude);
    const pool = [];
    for (let v = Math.min(a, b); v <= Math.max(a, b); v++) if (!ex.has(v)) pool.push(v);
    return pick(pool);
  };
  const fork = (label = '') => createRng(hashSeed(`${initial}:${label}:${Math.floor(float() * 2 ** 32)}`));

  return { seed: initial, float, int, pick, shuffle, sample, chance, sign, intExcept, fork };
}

export default createRng;
