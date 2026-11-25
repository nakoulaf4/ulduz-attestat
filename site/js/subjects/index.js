// Subject registry with static metadata and on-demand lazy dynamic import().
// Home (#/) and Stats (#/stats) render instantly from SUBJECTS_META without parsing
// all 4 heavy subject bundles (~650 KB) on cold mobile start.

import { buildFallbackSubject } from '../app/demo-tasks.js';
import { loadOriginals } from '../core/contract.js';

export const BURAXILISH_SUBJECTS_META = [
  { id: 'math', title: 'Математика', short: 'Мат', icon: '∑', color: 'math', group: 'buraxilish', topics: 14, types: 53, originals: 50 },
  { id: 'ru', title: 'Русский язык', short: 'Рус', icon: 'Я', color: 'ru', group: 'buraxilish', topics: 7, types: 14, originals: 60 },
  { id: 'en', title: 'Английский язык', short: 'Eng', icon: 'En', color: 'en', group: 'buraxilish', topics: 8, types: 37, originals: 60 },
  { id: 'az', title: 'Азербайджанский язык', short: 'Az', icon: 'Ə', color: 'az', group: 'buraxilish', topics: 8, types: 11, originals: 60 },
];

export const BLOCK_SUBJECTS_META = [
  { id: 'physics', title: 'Физика', short: 'Физ', icon: 'Φ', color: 'physics', group: 'block', dimGroup: 'I', topics: 6, types: 11, originals: 0 },
  { id: 'chemistry', title: 'Химия', short: 'Хим', icon: 'H₂', color: 'chemistry', group: 'block', dimGroup: 'I · IV', topics: 6, types: 11, originals: 0 },
  { id: 'biology', title: 'Биология', short: 'Био', icon: 'Ω', color: 'biology', group: 'block', dimGroup: 'IV', topics: 6, types: 11, originals: 0 },
  { id: 'history', title: 'История', short: 'Ист', icon: 'IX', color: 'history', group: 'block', dimGroup: 'II · III', topics: 6, types: 10, originals: 0 },
  { id: 'geography', title: 'География', short: 'Гео', icon: 'N°', color: 'geography', group: 'block', dimGroup: 'II', topics: 6, types: 11, originals: 0 },
  { id: 'informatics', title: 'Информатика', short: 'Инф', icon: '01', color: 'informatics', group: 'block', dimGroup: 'I RI', topics: 6, types: 11, originals: 0 },
];

export const SUBJECTS_META = [...BURAXILISH_SUBJECTS_META, ...BLOCK_SUBJECTS_META];

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
