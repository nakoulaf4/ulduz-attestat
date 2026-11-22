// Subject registry with static metadata and on-demand lazy dynamic import().
// Home (#/) and Stats (#/stats) render instantly from SUBJECTS_META without parsing
// all 4 heavy subject bundles (~650 KB) on cold mobile start.

import { buildFallbackSubject } from '../app/demo-tasks.js';
import { loadOriginals } from '../core/contract.js';

export const SUBJECTS_META = [
  { id: 'math', title: 'Математика', short: 'Мат', icon: '∑', color: 'math', topics: 14, types: 53, originals: 50 },
  { id: 'ru', title: 'Русский язык', short: 'Рус', icon: 'Я', color: 'ru', topics: 7, types: 14, originals: 60 },
  { id: 'en', title: 'Английский язык', short: 'Eng', icon: 'En', color: 'en', topics: 8, types: 37, originals: 60 },
  { id: 'az', title: 'Азербайджанский язык', short: 'Az', icon: 'Ə', color: 'az', topics: 8, types: 11, originals: 60 },
];

const subjectCache = new Map();
const pendingLoads = new Map();

/**
 * Dynamically import ONLY a single subject module on demand (cached in a Map).
 * @param {string} id
 * @param {boolean} [force]
 */
export async function getSubject(id, force = false) {
  const meta = SUBJECTS_META.find((m) => m.id === id);
  if (!meta) return undefined;

  if (!force && subjectCache.has(id)) {
    return subjectCache.get(id);
  }
  if (!force && pendingLoads.has(id)) {
    return pendingLoads.get(id);
  }

  const loader = (async () => {
    let mod;
    try {
      const m = await import(`./${meta.id}/index.js`);
      mod = m.default ?? m;
      if (!mod || !Array.isArray(mod.taskTypes)) throw new Error('invalid SubjectModule export');
      mod.title ??= meta.title;
      mod.originals ??= () => loadOriginals(meta.id);
    } catch (err) {
      console.info(`[ulduz] subject "${meta.id}" module not yet built, using preview stub:`, err?.message ?? err);
      mod = buildFallbackSubject(meta);
      mod.originals = () => loadOriginals(meta.id);
      mod.error = err ? String(err?.message ?? err) : 'module not found';
    }
    mod.meta = meta;
    subjectCache.set(id, mod);
    return mod;
  })().finally(() => {
    pendingLoads.delete(id);
  });

  pendingLoads.set(id, loader);
  return loader;
}

/**
 * Load all 4 subject modules (used by full multi-subject exam #/exam/all and test harnesses).
 * @returns {Promise<Record<string, import('../core/contract.js').SubjectModule & {stub?:boolean, meta:object}>>}
 */
export async function loadSubjects(force = false) {
  const entries = await Promise.all(
    SUBJECTS_META.map(async (meta) => [meta.id, await getSubject(meta.id, force)])
  );
  return Object.fromEntries(entries);
}
