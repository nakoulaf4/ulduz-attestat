// Ulduz — the data contract shared by the app and all subject modules.
// Subject authors: read this file top to bottom. It is the single source of truth.
//
// Files:
//   site/js/core/rng.js                 seeded PRNG  (createRng(seed) → Rng)
//   site/js/core/contract.js            this file (types, validateTask, checkAnswer)
//   site/js/subjects/<id>/index.js      default export: SubjectModule
//   site/js/subjects/index.js           registry (owned by frontend)
//   site/data/original/<id>.json        original tasks from the PDFs: Task[] (source:'original')
//   site/assets/<id>/...                images for that subject (referenced as 'assets/<id>/x.png')
//
// Subject ids: 'math' | 'ru' | 'en' | 'az'.
// Import paths from a subject module:  import { createRng } from '../../core/rng.js';
//                                      import { validateTask } from '../../core/contract.js';

/**
 * Rich text ("HTML subset"). Used in stem, options, pairs, explanation, passage.html, rubric.
 * Allowed tags: p br b strong i em u s sub sup small span div ul ol li table thead tbody tr th td
 *               blockquote code hr img figure figcaption.
 * Allowed attributes: class, src, alt, width, height, colspan, rowspan, lang.
 * No scripts, no inline event handlers, no style attributes (use classes below).
 * Math: KaTeX delimiters  $...$ inline,  $$...$$ display.  Escape a literal dollar as \$.
 *   Write math in LaTeX: $\frac{3}{4}$, $\sqrt{2}$, $x^2-5x+6=0$, $\angle ABC = 30^\circ$.
 * Conventions (CSS classes provided by the app):
 *   <span class="gap"></span>      a blank to fill (renders as a line); or text "___"
 *   <span class="mark">word</span> highlighted/underlined word the question refers to
 *   <span class="num">(1)</span>   numbered marker inside a passage
 *   <b>, <i>, <u>                  as usual (e.g. stress, emphasis)
 *   <div class="note">…</div>      side note in explanations
 * @typedef {string} Html
 */

/**
 * @typedef {Object} Passage           shared text for reading tasks (several tasks may share one id)
 * @property {string} id               stable id, e.g. 'en-reading-1' (tasks with same id are grouped)
 * @property {string} [title]
 * @property {Html}   html
 */

/**
 * @typedef {Object} TaskImage
 * @property {string} [src]            path relative to site/, e.g. 'assets/math/tri-1.svg'
 * @property {string} [svg]            OR inline SVG markup (preferred for generated geometry)
 * @property {string} alt              text alternative (required, Russian)
 * @property {string} [caption]
 * @property {number} [width]          max display width in CSS px (default: fit)
 */

/**
 * Task formats and the shape of `answer` for each:
 *
 *  'single'  options: Html[] (2–6)          answer: number      index of the correct option (0-based)
 *  'multi'   options: Html[]                answer: number[]    indices of ALL correct options (sorted)
 *  'short'   (typed answer)                 answer: string      canonical answer, shown to user
 *            accept?: string[]              other accepted spellings/forms
 *            Checking: trim, collapse spaces, case-insensitive, ё=е, unify quotes/dashes;
 *            numbers: '0,5' == '0.5' == '1/2' (numeric compare, tolerance 1e-9).
 *            For several numbers in order write e.g. answer:'2; 3' (compared item-wise, separators ; or ,space).
 *  'match'   pairs: {left: Html[], right: Html[]}  (right may be longer than left)
 *                                           answer: number[]    answer[i] = index in right matched to left[i]
 *  'order'   options: Html[] (shown in this order, already shuffled)
 *                                           answer: number[]    correct sequence of option indices
 *  'open'    (essay / written answer, self-assessed against rubric)
 *                                           answer: Html        model answer / key points
 *            rubric: Html                   criteria; user self-assigns 0..points
 *
 * @typedef {'single'|'multi'|'short'|'match'|'order'|'open'} TaskFormat
 */

/**
 * @typedef {Object} Task
 * @property {string}  id            unique. Generated: `${typeId}#${seed}` (app fills if omitted).
 *                                   Original: `${subject}-${pdfTag}-${number}`, e.g. 'math-0903-17'
 * @property {'math'|'ru'|'en'|'az'} subject
 * @property {string}  typeId        TaskType.id it came from (originals: closest type id, or 'original')
 * @property {'original'|'generated'} source
 * @property {{pdf:string, number:number|string}} [origin]  for originals: PDF file name + task number
 * @property {Passage} [passage]
 * @property {Html}    stem          the question
 * @property {TaskImage} [image]
 * @property {TaskFormat} format
 * @property {Html[]}  [options]     single | multi | order
 * @property {{left:Html[], right:Html[]}} [pairs]   match
 * @property {number|number[]|string} answer         see formats above
 * @property {string[]} [accept]     short only
 * @property {Html}    [rubric]      open only
 * @property {number}  points        max points for this task in the real exam
 * @property {Html}    explanation   step-by-step solution / reasoning (required, never empty)
 * @property {1|2|3}   difficulty
 * @property {string}  topic         human-readable topic (Russian), same as TaskType.topic for generated
 * @property {Html}    [hint]        optional short hint shown on request in practice mode
 * @property {boolean} [partial]     multi/match/order: proportional partial credit (default false = all-or-nothing)
 */

/**
 * @typedef {Object} TaskType
 * @property {string} id             globally unique, prefix with subject: 'math.linear-eq', 'en.tenses'
 * @property {'math'|'ru'|'en'|'az'} subject
 * @property {string} title          short Russian title shown in practice picker, e.g. 'Линейные уравнения'
 * @property {string} topic          topic group (Russian); picker groups types by topic
 * @property {TaskFormat} format
 * @property {number} weight         relative frequency in mixed practice (1 = normal)
 * @property {(rng: import('./rng.js').Rng, opts: {difficulty: 1|2|3}) => Task} generate
 *     Must be deterministic given rng (use ONLY rng, never Math.random/Date).
 *     May omit id/subject/typeId/source/topic — finalizeTask() fills them from the type.
 *     Options for 'single'/'multi' must already be shuffled by the generator (use rng.shuffle),
 *     and must be pairwise distinct.
 */

/**
 * @typedef {Object} ExamSection
 * @property {string} title          e.g. 'Чтение', 'Закрытые задания'
 * @property {number} from           index of first task in buildExam() array (0-based, inclusive)
 * @property {number} to             index of last task (inclusive)
 */

/**
 * @typedef {Object} ExamInfo
 * @property {number} durationMin    minutes for this subject block in the simulation
 * @property {number} [maxPoints]    nominal maximum (if differs from sum of task points)
 * @property {ExamSection[]} [sections]
 * @property {Html}   [intro]        instructions shown before the start
 */

/**
 * @typedef {Object} SubjectModule   default export of site/js/subjects/<id>/index.js
 * @property {'math'|'ru'|'en'|'az'} id
 * @property {string} title          Russian, e.g. 'Математика'
 * @property {TaskType[]} taskTypes
 * @property {(rng: import('./rng.js').Rng) => Task[]} buildExam   full variant in real exam order
 * @property {ExamInfo} [exam]
 * @property {() => Promise<Task[]>} [originals]   loads site/data/original/<id>.json
 *     Tip: `originals: () => loadOriginals('ru')` using the helper exported below.
 * @property {(tasks: Task[], earned: number[]) => {score:number, max:number, label?:string}} [score]
 *     Optional custom exam scoring (raw points → reported score). Default: sum of points.
 */

export const SUBJECT_IDS = [
  'math',
  'ru',
  'en',
  'az',
  'physics',
  'chemistry',
  'biology',
  'history',
  'geography',
  'informatics',
];
export const FORMATS = ['single', 'multi', 'short', 'match', 'order', 'open'];

/** Fill defaulted fields of a generated task from its TaskType. Returns the same object. */
export function finalizeTask(type, rng, task) {
  task.subject ??= type.subject;
  task.typeId ??= type.id;
  task.source ??= 'generated';
  task.topic ??= type.topic;
  task.format ??= type.format;
  task.points ??= 1;
  task.difficulty ??= 2;
  task.id ??= `${type.id}#${rng.seed}`;
  return task;
}

/** Generate one task from a type with a given seed (deterministic). */
export async function generateTask(type, seed, difficulty = 2) {
  const { createRng } = await import('./rng.js');
  const rng = createRng(seed);
  const task = type.generate(rng, { difficulty });
  return finalizeTask(type, rng, task);
}

/** Fetch originals JSON relative to site root. Resolves to [] if missing. */
export async function loadOriginals(subjectId) {
  try {
    const url = new URL(`../../data/original/${subjectId}.json`, import.meta.url);
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : (data.tasks ?? []);
  } catch {
    return [];
  }
}

const isInt = (n) => Number.isInteger(n);
const isStr = (s) => typeof s === 'string';
const nonEmpty = (s) => isStr(s) && s.trim().length > 0;

/**
 * Validate a task against the contract.
 * @param {Task} task
 * @returns {{ok:boolean, errors:string[]}}
 */
export function validateTask(task) {
  const e = [];
  if (!task || typeof task !== 'object') return { ok: false, errors: ['task is not an object'] };
  const t = task;
  if (!nonEmpty(t.id)) e.push('id missing');
  if (!SUBJECT_IDS.includes(t.subject)) e.push(`subject invalid: ${t.subject}`);
  if (!nonEmpty(t.typeId)) e.push('typeId missing');
  if (!['original', 'generated'].includes(t.source)) e.push(`source invalid: ${t.source}`);
  if (t.source === 'original' && (!t.origin || !t.origin.pdf)) e.push('origin {pdf, number} required for originals');
  if (!nonEmpty(t.stem) && !t.passage) e.push('stem empty');
  if (!FORMATS.includes(t.format)) e.push(`format invalid: ${t.format}`);
  if (typeof t.points !== 'number' || !(t.points > 0)) e.push('points must be > 0');
  if (!nonEmpty(t.explanation)) e.push('explanation empty');
  if (![1, 2, 3].includes(t.difficulty)) e.push('difficulty must be 1|2|3');
  if (!nonEmpty(t.topic)) e.push('topic missing');
  if (t.passage && (!nonEmpty(t.passage.id) || !nonEmpty(t.passage.html))) e.push('passage needs id and html');
  if (t.image && !(nonEmpty(t.image.src) || nonEmpty(t.image.svg))) e.push('image needs src or svg');
  if (t.image && !nonEmpty(t.image.alt)) e.push('image.alt required');

  const opts = t.options;
  const checkOptions = (min) => {
    if (!Array.isArray(opts) || opts.length < min) { e.push(`options: need ≥${min}`); return false; }
    if (opts.some((o) => !isStr(o) || o.trim() === '')) e.push('options: empty option');
    const norm = opts.map((o) => String(o).replace(/\s+/g, ' ').trim().toLowerCase());
    if (new Set(norm).size !== norm.length) e.push('options: duplicates');
    return true;
  };
  switch (t.format) {
    case 'single':
      if (checkOptions(2) && !(isInt(t.answer) && t.answer >= 0 && t.answer < opts.length)) e.push('single: answer must be option index');
      break;
    case 'multi':
      if (checkOptions(2)) {
        if (!Array.isArray(t.answer) || t.answer.length === 0) e.push('multi: answer must be non-empty index array');
        else if (t.answer.some((i) => !isInt(i) || i < 0 || i >= opts.length)) e.push('multi: answer index out of range');
        else if (new Set(t.answer).size !== t.answer.length) e.push('multi: duplicate indices');
      }
      break;
    case 'short':
      if (!nonEmpty(String(t.answer ?? ''))) e.push('short: answer empty');
      if (t.accept && !Array.isArray(t.accept)) e.push('short: accept must be array');
      break;
    case 'match': {
      const p = t.pairs;
      if (!p || !Array.isArray(p.left) || !Array.isArray(p.right) || p.left.length < 2) { e.push('match: pairs.left/right required'); break; }
      if (p.right.length < p.left.length) e.push('match: right shorter than left');
      if (!Array.isArray(t.answer) || t.answer.length !== p.left.length) e.push('match: answer length must equal left length');
      else if (t.answer.some((i) => !isInt(i) || i < 0 || i >= p.right.length)) e.push('match: answer index out of range');
      break;
    }
    case 'order':
      if (checkOptions(2)) {
        const a = t.answer;
        if (!Array.isArray(a) || a.length !== opts.length || [...a].sort((x, y) => x - y).some((v, i) => v !== i)) e.push('order: answer must be a permutation of option indices');
      }
      break;
    case 'open':
      if (!nonEmpty(String(t.answer ?? ''))) e.push('open: answer (model answer) empty');
      if (!nonEmpty(t.rubric)) e.push('open: rubric required');
      break;
  }
  // Unbalanced $ (ignoring \$) is a common KaTeX bug.
  const texts = [t.stem, t.explanation, ...(opts ?? []), ...(t.pairs?.left ?? []), ...(t.pairs?.right ?? [])].filter(isStr);
  for (const s of texts) {
    const n = (s.replace(/\\\$/g, '').match(/\$/g) || []).length;
    if (n % 2) { e.push(`unbalanced $ in: ${s.slice(0, 60)}`); break; }
  }
  if (/<script|\son\w+\s*=|style\s*=/i.test(texts.join(' ') + (t.passage?.html ?? ''))) e.push('forbidden HTML (script/on*/style)');
  return { ok: e.length === 0, errors: e };
}

// ---------- answer checking (used by the app; authors may use it in tests) ----------

/** Normalize a typed answer for comparison. */
export function normalizeText(s) {
  return String(s ?? '')
    .replace(/<[^>]*>/g, '')
    .replace(/\$/g, '')
    .toLowerCase()
    .replace(/ё/g, 'е')
    .replace(/[«»„“”"']/g, '')
    .replace(/[‐-―−]/g, '-')
    .replace(/\s+/g, ' ')
    .replace(/\s*([,;:])\s*/g, '$1')
    .trim()
    .replace(/[.!]$/, '');
}

/** Parse a number from '0,5' | '-3' | '1/2' | '\frac{1}{2}' | '50%'?. Returns NaN if not numeric. */
export function parseNumber(s) {
  let x = String(s ?? '').trim().replace(/\$/g, '').replace(/\s+/g, '').replace(/−/g, '-').replace(',', '.');
  const frac = x.match(/^(-?)\\d?frac\{(-?[\d.]+)\}\{(-?[\d.]+)\}$/);
  if (frac) return (frac[1] ? -1 : 1) * Number(frac[2]) / Number(frac[3]);
  const sl = x.match(/^(-?[\d.]+)\/(-?[\d.]+)$/);
  if (sl) return Number(sl[1]) / Number(sl[2]);
  if (!/^[-+]?(\d+\.?\d*|\.\d+)(e[-+]?\d+)?$/i.test(x)) return NaN;
  return Number(x);
}

function splitShortList(raw) {
  const s = String(raw ?? '')
    .replace(/<[^>]*>/g, '')
    .replace(/\$/g, '')
    .trim();
  if (!s) return [];
  if (s.includes(';')) {
    return s.split(';').map((x) => x.trim()).filter(Boolean);
  }
  // Split on comma+space or non-decimal commas, preserving decimal commas like "1,5"
  const parts = s.split(/,\s+|(?<!\d),(?!\d)/).map((x) => x.trim()).filter(Boolean);
  if (parts.length > 1) return parts;
  // Compact integer lists like "1,2,3" (2+ commas without spaces cannot be a single decimal number)
  if (!s.includes(' ') && (s.match(/,/g) || []).length >= 2) {
    return s.split(',').map((x) => x.trim()).filter(Boolean);
  }
  return parts;
}

function shortEquals(given, expected) {
  const a = parseNumber(given), b = parseNumber(expected);
  if (!Number.isNaN(a) && !Number.isNaN(b)) return Math.abs(a - b) < 1e-9 * Math.max(1, Math.abs(b));
  const na = normalizeText(given), nb = normalizeText(expected);
  if (na === nb) return true;
  // item-wise lists: "1,5; 2,5" == "1.5; 2.5", "2; 3" == "2, 3" while preserving decimal "0,5"
  const la = splitShortList(given);
  const lb = splitShortList(expected);
  if (la.length > 1 && la.length === lb.length) return la.every((x, i) => shortEquals(x, lb[i]));
  return false;
}

/**
 * Check a response. Response shapes mirror `answer` (index, index[], string, index[] for match/order;
 * for 'open' the response is {self: number} — self-assessed points).
 * Partial credit: multi/match/order get proportional credit only if task.partial === true.
 * @returns {{correct:boolean, earned:number, max:number}}
 */
export function checkAnswer(task, response) {
  const max = task.points ?? 1;
  const empty = response === undefined || response === null || response === '' || (Array.isArray(response) && response.length === 0);
  if (empty) return { correct: false, earned: 0, max };
  let correct = false, fraction = 0;
  switch (task.format) {
    case 'single':
      correct = Number(response) === task.answer;
      break;
    case 'multi': {
      const want = new Set(task.answer), got = new Set(response);
      correct = want.size === got.size && [...want].every((i) => got.has(i));
      if (!correct && task.partial) {
        const hits = [...got].filter((i) => want.has(i)).length, wrong = got.size - hits;
        fraction = Math.max(0, (hits - wrong) / want.size);
      }
      break;
    }
    case 'short':
      correct = [task.answer, ...(task.accept ?? [])].some((ans) => shortEquals(response, ans));
      break;
    case 'match':
    case 'order': {
      const hits = task.answer.filter((v, i) => response[i] === v).length;
      correct = hits === task.answer.length;
      if (!correct && task.partial) fraction = hits / task.answer.length;
      break;
    }
    case 'open': {
      const self = Math.max(0, Math.min(max, Number(response?.self ?? 0)));
      return { correct: self === max, earned: self, max };
    }
  }
  return { correct, earned: correct ? max : Math.round(fraction * max * 100) / 100, max };
}
