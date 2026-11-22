import { finalizeTask, loadOriginals } from '../../core/contract.js';
import { numberTypes } from './numbers.js';
import { algebraTypes } from './algebra.js';
import { equationTypes } from './equations.js';
import { functionTypes } from './functions.js';
import { trigonometryTypes } from './trigonometry.js';
import { geometryTypes } from './geometry.js';

export const taskTypes = [
  ...numberTypes,
  ...algebraTypes,
  ...equationTypes,
  ...functionTypes,
  ...trigonometryTypes,
  ...geometryTypes,
];

const BY_ID = new Map(taskTypes.map((t) => [t.id, t]));

function makeTask(rng, typeId, difficulty, points, slotIdx) {
  const type = BY_ID.get(typeId);
  if (!type) throw new Error(`math.buildExam: unknown typeId "${typeId}"`);
  const slotRng = rng.fork(`slot:${slotIdx}:${typeId}`);
  const task = finalizeTask(type, slotRng, type.generate(slotRng, { difficulty }));
  task.points = points;
  return task;
}

/**
 * Assemble a full 25-task DİM Buraxılış Math exam mirroring real order, formats, and weights:
 * - Tasks 0..12  (№ 61–73): 13 closed 5-option tasks, 1 pt each
 * - Tasks 13..17 (№ 74–78): 5 coded short-answer tasks, 1 pt each
 * - Tasks 18..24 (№ 79–85): 7 extended-solution tasks, 2 pts each
 */
export function buildExam(rng) {
  const closedPicks = [
    rng.pick(['math.poly-factor', 'math.rational-simplify']),
    rng.pick(['math.diff-squares-eval', 'math.real-power']),
    rng.pick(['math.interval-count', 'math.gcd-lcm']),
    rng.pick(['math.fractions-percent', 'math.sets-ops']),
    rng.pick(['math.trig-sum-prod', 'math.trig-special-val']),
    rng.pick(['math.trig-quadrant-signs', 'math.trig-half-angle', 'math.trig-equation']),
    rng.pick(['math.func-eval', 'math.coords-quadrant']),
    rng.pick(['math.linear-ineq', 'math.arith-prog-diff']),
    rng.pick(['math.combinatorics', 'math.probability-subsets']),
    rng.pick(['math.tri-similarity', 'math.right-tri-trig']),
    rng.pick(['math.rect-perimeter', 'math.polygon-diagonals', 'math.trapezoid-area']),
    rng.pick(['math.circle-inscribed-angles', 'math.prism-base']),
  ];

  const used = new Set(closedPicks);
  const remainingSingle = taskTypes
    .filter((t) => t.format === 'single' && !used.has(t.id))
    .map((t) => t.id);
  closedPicks.push(rng.pick(remainingSingle));

  const closedOrder = rng.shuffle(closedPicks);
  const closedTasks = closedOrder.map((id, idx) =>
    makeTask(rng, id, idx < 6 ? 1 : 2, 1, idx)
  );

  const codedIds = [
    rng.pick(['math.log-eval', 'math.log-equation']),
    rng.pick(['math.exp-ineq', 'math.quad-ineq']),
    rng.pick(['math.cone-angle', 'math.prism-lateral', 'math.cylinder-sphere']),
    rng.pick(['math.probability-digits', 'math.vieta-quad', 'math.statistics']),
    rng.pick(['math.abs-eval', 'math.train-motion', 'math.geom-prog']),
  ];
  const codedTasks = codedIds.map((id, i) => makeTask(rng, id, 2, 1, 13 + i));

  const writtenSpec = [
    [rng.pick(['math.rational-motion-eq', 'math.linear-eq-table']), 3],
    [rng.pick(['math.linear-system-word', 'math.percent-word']), 2],
    [rng.pick(['math.parabola-right-tri', 'math.midpoint-param']), 3],
    [rng.pick(['math.parallel-angles', 'math.ships-similarity']), 3],
    [rng.pick(['math.bisector-area', 'math.circle-tangent-secant']), 3],
    ['math.cone-rotation', 2],
    [rng.pick(['math.venn-ineq', 'math.arith-prog-sum']), 3],
  ];
  const writtenTasks = writtenSpec.map(([id, diff], i) =>
    makeTask(rng, id, diff, 2, 18 + i)
  );

  return [...closedTasks, ...codedTasks, ...writtenTasks];
}

export default {
  id: 'math',
  title: 'Математика',
  taskTypes,
  buildExam,
  originals: () => loadOriginals('math'),
  exam: {
    durationMin: 60,
    maxPoints: 100,
    sections: [
      { title: 'Закрытые задания (№ 61–73)', from: 0, to: 12 },
      { title: 'Задания с кратким ответом (№ 74–78)', from: 13, to: 17 },
      { title: 'Задания с развёрнутым решением (№ 79–85)', from: 18, to: 24 },
    ],
    intro:
      'Экзаменационный блок по математике содержит 25 заданий (№ 61–85): ' +
      '13 закрытых заданий с выбором ответа (по 1 баллу), 5 заданий с кратким числовым ответом (по 1 баллу) ' +
      'и 7 заданий повышенного уровня (по 2 первичных балла). Ошибки баллы не вычитают. ' +
      'Итоговый балл переводится в 100-балльную шкалу по официальной формуле ДИМ: $\\frac{25}{8} \\times \\text{перв. балл}$.',
  },
  score(tasks, earned) {
    const raw = earned.reduce((s, v) => s + (Number(v) || 0), 0);
    const scaled = Math.min(100, Math.round(((25 / 8) * raw) * 10) / 10);
    return {
      score: scaled,
      max: 100,
      label: `${String(scaled).replace('.', ',')} / 100 (перв. ${raw}/32)`,
    };
  },
};
