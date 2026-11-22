import { fmtFracTex, buildMcqOptions } from './helpers.js';

const TOPIC_TRIG = 'Тригонометрия';

function trigSign(fn, deg) {
  let d = ((deg % 360) + 360) % 360;
  // d is strictly inside one of the 4 quadrants (never 0, 90, 180, 270)
  const q = d < 90 ? 1 : d < 180 ? 2 : d < 270 ? 3 : 4;
  if (fn === 'sin') return q === 1 || q === 2 ? 1 : -1;
  if (fn === 'cos') return q === 1 || q === 4 ? 1 : -1;
  return q === 1 || q === 3 ? 1 : -1; // tan, cot
}

function quadRu(deg) {
  const d = ((deg % 360) + 360) % 360;
  if (d < 90) return 'I';
  if (d < 180) return 'II';
  if (d < 270) return 'III';
  return 'IV';
}

const FN_TEX = { sin: '\\sin', cos: '\\cos', tan: '\\operatorname{tg}', cot: '\\operatorname{ctg}' };

export const trigonometryTypes = [
  // 33. math.trig-sum-prod (0903 #61)
  {
    id: 'math.trig-sum-prod',
    subject: 'math',
    title: 'Преобразование суммы тригонометрических функций в произведение',
    topic: TOPIC_TRIG,
    format: 'single',
    weight: 1,
    generate(rng, { difficulty }) {
      const parity = rng.int(0, 1);
      const b = rng.int(6, 28) * 2 + parity;
      const a = b + rng.int(4, 20) * 2;
      const halfSum = (a + b) / 2;
      const halfDiff = (a - b) / 2;

      const kind = difficulty === 1
        ? rng.pick(['cos+', 'sin+'])
        : rng.pick(['cos+', 'cos-', 'sin+', 'sin-']);

      let stemExpr, correct, expFormula;
      if (kind === 'cos+') {
        stemExpr = `\\cos ${a}^\\circ + \\cos ${b}^\\circ`;
        correct = `$2\\cos ${halfSum}^\\circ \\cos ${halfDiff}^\\circ$`;
        expFormula = `\\cos\\alpha + \\cos\\beta = 2\\cos\\frac{\\alpha+\\beta}{2}\\cos\\frac{\\alpha-\\beta}{2}`;
      } else if (kind === 'cos-') {
        stemExpr = `\\cos ${a}^\\circ - \\cos ${b}^\\circ`;
        correct = `$-2\\sin ${halfSum}^\\circ \\sin ${halfDiff}^\\circ$`;
        expFormula = `\\cos\\alpha - \\cos\\beta = -2\\sin\\frac{\\alpha+\\beta}{2}\\sin\\frac{\\alpha-\\beta}{2}`;
      } else if (kind === 'sin+') {
        stemExpr = `\\sin ${a}^\\circ + \\sin ${b}^\\circ`;
        correct = `$2\\sin ${halfSum}^\\circ \\cos ${halfDiff}^\\circ$`;
        expFormula = `\\sin\\alpha + \\sin\\beta = 2\\sin\\frac{\\alpha+\\beta}{2}\\cos\\frac{\\alpha-\\beta}{2}`;
      } else {
        stemExpr = `\\sin ${a}^\\circ - \\sin ${b}^\\circ`;
        correct = `$2\\sin ${halfDiff}^\\circ \\cos ${halfSum}^\\circ$`;
        expFormula = `\\sin\\alpha - \\sin\\beta = 2\\sin\\frac{\\alpha-\\beta}{2}\\cos\\frac{\\alpha+\\beta}{2}`;
      }

      const candidates = [
        `$2\\cos ${halfSum}^\\circ \\sin ${halfDiff}^\\circ$`,
        `$2\\sin ${halfSum}^\\circ \\cos ${halfDiff}^\\circ$`,
        `$2\\cos ${halfSum}^\\circ \\cos ${halfDiff}^\\circ$`,
        `$2\\sin ${halfSum}^\\circ \\sin ${halfDiff}^\\circ$`,
        `$-2\\sin ${halfSum}^\\circ \\sin ${halfDiff}^\\circ$`,
        `$2\\cos ${a + b}^\\circ \\cos ${a - b}^\\circ$`,
        `$2\\cos ${Math.floor(halfSum / 2)}^\\circ \\cos ${Math.floor(halfDiff / 2)}^\\circ$`,
      ];

      const { options, answer } = buildMcqOptions(
        rng,
        correct,
        candidates,
        (s) => `$2\\cos ${halfSum + s}^\\circ \\sin ${halfDiff}^\\circ$`
      );

      return {
        points: 1,
        difficulty,
        stem: `Представьте выражение $${stemExpr}$ в виде произведения.`,
        options,
        answer,
        hint: 'Примените формулу преобразования суммы или разности тригонометрических функций в произведение.',
        explanation:
          `Используя формулу $${expFormula}$, получаем: $${stemExpr} = ${correct.slice(1, -1)}$.`,
      };
    },
  },

  // 34. math.trig-special-val (0903 #73)
  {
    id: 'math.trig-special-val',
    subject: 'math',
    title: 'Табличные значения тригонометрических функций',
    topic: TOPIC_TRIG,
    format: 'single',
    weight: 1,
    generate(rng, { difficulty }) {
      const k = difficulty === 1 ? 1 : rng.pick([1, 2, 3, 4]);
      const kPre = k === 1 ? '' : `${k}(`;
      const kPost = k === 1 ? '' : ')';

      const templates = [
        {
          expr: '\\sin 60^\\circ - \\cos 30^\\circ',
          val: '0',
          steps: '\\frac{\\sqrt{3}}{2} - \\frac{\\sqrt{3}}{2} = 0',
          wrong: ['1', '\\sqrt{3}', '\\frac{1 - \\sqrt{3}}{2}', '\\frac{1}{2}', '-1'],
        },
        {
          expr: '\\sin 30^\\circ + \\cos 60^\\circ',
          val: '1',
          steps: '\\frac{1}{2} + \\frac{1}{2} = 1',
          wrong: ['0', '\\sqrt{3}', '\\frac{1}{2}', '2', '\\frac{\\sqrt{3}}{2}'],
        },
        {
          expr: '\\cos 60^\\circ - \\sin 30^\\circ',
          val: '0',
          steps: '\\frac{1}{2} - \\frac{1}{2} = 0',
          wrong: ['1', '\\frac{1}{2}', '\\frac{\\sqrt{3} - 1}{2}', '-1', '\\sqrt{2}'],
        },
        {
          expr: '2\\sin 45^\\circ \\cos 45^\\circ',
          val: '1',
          steps: '2 \\cdot \\frac{\\sqrt{2}}{2} \\cdot \\frac{\\sqrt{2}}{2} = 1',
          wrong: ['\\frac{1}{2}', '\\sqrt{2}', '2', '0', '\\frac{\\sqrt{3}}{2}'],
        },
        {
          expr: '\\sin^2 30^\\circ + \\cos^2 30^\\circ',
          val: '1',
          steps: '\\left(\\frac{1}{2}\\right)^2 + \\left(\\frac{\\sqrt{3}}{2}\\right)^2 = \\frac{1}{4} + \\frac{3}{4} = 1',
          wrong: ['\\frac{1}{2}', '\\frac{3}{4}', '2', '0', '\\frac{\\sqrt{3}+1}{2}'],
        },
        {
          expr: '\\operatorname{tg} 45^\\circ + \\sin 30^\\circ',
          val: '\\frac{3}{2}',
          steps: '1 + \\frac{1}{2} = \\frac{3}{2}',
          wrong: ['\\frac{1}{2}', '1', '2', '\\frac{\\sqrt{3}+2}{2}', '\\frac{\\sqrt{2}+1}{2}'],
        },
        {
          expr: '\\operatorname{tg} 60^\\circ \\cdot \\operatorname{ctg} 60^\\circ + \\cos 60^\\circ',
          val: '\\frac{3}{2}',
          steps: '1 + \\frac{1}{2} = \\frac{3}{2}',
          wrong: ['\\frac{1}{2}', '2', '\\frac{\\sqrt{3}}{2}', '1', '\\frac{5}{2}'],
        },
        {
          expr: '4\\sin 30^\\circ \\cos 60^\\circ',
          val: '1',
          steps: '4 \\cdot \\frac{1}{2} \\cdot \\frac{1}{2} = 1',
          wrong: ['2', '\\frac{1}{2}', '4', '3', '\\sqrt{3}'],
        },
        {
          expr: '\\operatorname{tg} 60^\\circ - 2\\sin 60^\\circ',
          val: '0',
          steps: '\\sqrt{3} - 2 \\cdot \\frac{\\sqrt{3}}{2} = 0',
          wrong: ['\\sqrt{3}', '1', '\\frac{\\sqrt{3}}{2}', '-1', '2'],
        },
        {
          expr: '\\cos^2 45^\\circ - \\sin^2 30^\\circ',
          val: '\\frac{1}{4}',
          steps: '\\frac{1}{2} - \\frac{1}{4} = \\frac{1}{4}',
          wrong: ['\\frac{1}{2}', '\\frac{3}{4}', '0', '1', '\\frac{\\sqrt{2}-1}{2}'],
        },
        {
          expr: '\\sin 60^\\circ \\cdot \\operatorname{tg} 30^\\circ',
          val: '\\frac{1}{2}',
          steps: '\\frac{\\sqrt{3}}{2} \\cdot \\frac{1}{\\sqrt{3}} = \\frac{1}{2}',
          wrong: ['\\frac{3}{2}', '\\frac{\\sqrt{3}}{2}', '1', '0', '\\frac{1}{4}'],
        },
        {
          expr: '\\cos 30^\\circ \\cdot \\operatorname{tg} 60^\\circ',
          val: '\\frac{3}{2}',
          steps: '\\frac{\\sqrt{3}}{2} \\cdot \\sqrt{3} = \\frac{3}{2}',
          wrong: ['\\frac{1}{2}', '3', '\\frac{\\sqrt{3}}{2}', '1', '2'],
        },
      ];

      const tpl = rng.pick(templates);
      // Apply scalar multiplier k only when val is a simple rational 0, 1, 1/2, 3/2, 1/4
      const valMap = { '0': 0, '1': 1, '\\frac{1}{2}': 0.5, '\\frac{3}{2}': 1.5, '\\frac{1}{4}': 0.25 };
      const numVal = valMap[tpl.val];
      let stemExpr = tpl.expr;
      let ansTex = tpl.val;
      let wrongList = tpl.wrong;
      let steps = tpl.steps;

      if (k > 1 && numVal !== 0) {
        stemExpr = `${kPre}${tpl.expr}${kPost}`;
        const scaledNum = Math.round(numVal * 4 * k);
        ansTex = fmtFracTex(scaledNum, 4);
        steps = `${k} \\cdot \\left(${tpl.steps.split('=')[0].trim()}\\right) = ${ansTex}`;
        wrongList = [
          tpl.val,
          fmtFracTex(scaledNum + 2, 4),
          fmtFracTex(Math.max(1, scaledNum - 2), 4),
          `$${k}$`.slice(1, -1),
          '\\sqrt{3}',
        ];
      }

      const { options, answer } = buildMcqOptions(
        rng,
        `$${ansTex}$`,
        wrongList.map((w) => `$${w}$`),
        (s) => `$${s + 5}$`
      );

      return {
        points: 1,
        difficulty,
        stem: `Найдите значение выражения $${stemExpr}$.`,
        options,
        answer,
        hint: 'Подставьте точные табличные значения для углов $30^\\circ, 45^\\circ, 60^\\circ$.',
        explanation: `Подставляя табличные значения: $${steps}$.`,
      };
    },
  },

  // 35. math.trig-quadrant-signs (1503 #67)
  {
    id: 'math.trig-quadrant-signs',
    subject: 'math',
    title: 'Знаки тригонометрических функций по четвертям',
    topic: TOPIC_TRIG,
    format: 'single',
    weight: 1,
    generate(rng, { difficulty }) {
      const f1 = rng.pick(['sin', 'cos', 'tan', 'cot']);
      const f2 = rng.pick(['sin', 'cos', 'tan', 'cot']);

      const pickAngle = (min, max) => {
        let d = rng.int(min, max);
        while (d % 90 === 0 || d % 90 <= 2 || d % 90 >= 88) {
          d = rng.int(min, max);
        }
        return d;
      };

      const aDeg = pickAngle(10, 350);
      const bDeg = difficulty === 1 ? pickAngle(10, 350) : -pickAngle(10, 350);

      const s1 = trigSign(f1, aDeg);
      const s2 = trigSign(f2, bDeg);
      const fmtPair = (x, y) => `$a ${x > 0 ? '>' : x < 0 ? '\\lt' : '='} 0,\\ b ${y > 0 ? '>' : y < 0 ? '\\lt' : '='} 0$`;
      const correct = fmtPair(s1, s2);

      const candidates = [
        fmtPair(1, -1),
        fmtPair(-1, 1),
        fmtPair(1, 1),
        fmtPair(-1, -1),
        fmtPair(-1, 0),
        fmtPair(0, 1),
      ];

      const { options, answer } = buildMcqOptions(rng, correct, candidates);

      const bDisp = bDeg < 0 ? `(${bDeg}^\\circ)` : `${bDeg}^\\circ`;
      return {
        points: 1,
        difficulty,
        stem: `Определите знаки чисел $a = ${FN_TEX[f1]} ${aDeg}^\\circ$ и $b = ${FN_TEX[f2]} ${bDisp}$.`,
        options,
        answer,
        hint: 'Определите координатную четверть каждого угла и вспомните знаки тригонометрических функций.',
        explanation:
          `Угол $${aDeg}^\\circ$ принадлежит ${quadRu(aDeg)} четверти, поэтому $a = ${FN_TEX[f1]} ${aDeg}^\\circ ${s1 > 0 ? '>' : '\\lt'} 0$. ` +
          `Угол $${bDeg}^\\circ$ принадлежит ${quadRu(bDeg)} четверти, поэтому $b = ${FN_TEX[f2]} ${bDisp} ${s2 > 0 ? '>' : '\\lt'} 0$.`,
      };
    },
  },

  // 36. math.trig-half-angle (1503 #73)
  {
    id: 'math.trig-half-angle',
    subject: 'math',
    title: 'Формулы двойного и половинного угла',
    topic: TOPIC_TRIG,
    format: 'single',
    weight: 1,
    generate(rng, { difficulty }) {
      const alpha = rng.pick([10, 12, 14, 15, 18, 20, 22, 25]);
      const twoAlpha = 2 * alpha;
      const askCos = rng.chance(0.5);
      const fnName = askCos ? '\\cos' : '\\sin';
      const opSign = askCos ? '+' : '-';
      const wrongOp = askCos ? '-' : '+';

      const correct = `$\\sqrt{\\frac{1 ${opSign} a}{2}}$`;
      const candidates = [
        `$\\sqrt{\\frac{1 ${wrongOp} a}{2}}$`,
        `$\\frac{1 ${opSign} a}{2}$`,
        `$\\frac{1 ${wrongOp} a}{2}$`,
        `$\\frac{a}{2}$`,
        `$\\sqrt{1 ${opSign} a^2}$`,
      ];

      const { options, answer } = buildMcqOptions(rng, correct, candidates);

      return {
        points: 1,
        difficulty,
        stem: `Если $\\cos ${twoAlpha}^\\circ = a$, выразите $${fnName} ${alpha}^\\circ$ через $a$.`,
        options,
        answer,
        hint: `Примените формулу понижения степени для $${fnName}^2 \\alpha = \\frac{1 ${opSign} \\cos 2\\alpha}{2}$.`,
        explanation:
          `Так как угол $${alpha}^\\circ$ острый ($${fnName} ${alpha}^\\circ > 0$), имеем ` +
          `$${fnName}^2 ${alpha}^\\circ = \\frac{1 ${opSign} \\cos ${twoAlpha}^\\circ}{2} = \\frac{1 ${opSign} a}{2}$, ` +
          `откуда $${fnName} ${alpha}^\\circ = \\sqrt{\\frac{1 ${opSign} a}{2}}$.`,
      };
    },
  },

  // 37. math.trig-equation (curriculum gap)
  {
    id: 'math.trig-equation',
    subject: 'math',
    title: 'Основное тригонометрическое тождество и уравнения',
    topic: TOPIC_TRIG,
    format: 'single',
    weight: 0.9,
    generate(rng, { difficulty }) {
      const triples = [[3, 4, 5], [5, 12, 13], [8, 15, 17]];
      const [leg1, leg2, hyp] = rng.pick(triples);
      const quad = rng.pick([
        { name: 'I', range: '0^\\circ \\lt \\alpha \\lt 90^\\circ', sSin: 1, sCos: 1 },
        { name: 'II', range: '90^\\circ \\lt \\alpha \\lt 180^\\circ', sSin: 1, sCos: -1 },
        { name: 'III', range: '180^\\circ \\lt \\alpha \\lt 270^\\circ', sSin: -1, sCos: -1 },
        { name: 'IV', range: '270^\\circ \\lt \\alpha \\lt 360^\\circ', sSin: -1, sCos: 1 },
      ]);

      const givenSin = rng.chance(0.5);
      const askTan = difficulty >= 2 && rng.chance(0.45);
      const sinNum = quad.sSin * leg1;
      const cosNum = quad.sCos * leg2;

      const givenStr = givenSin
        ? `\\sin\\alpha = ${fmtFracTex(sinNum, hyp)}`
        : `\\cos\\alpha = ${fmtFracTex(cosNum, hyp)}`;

      let targetName, ansNum, ansDen;
      if (askTan) {
        targetName = '\\operatorname{tg}\\alpha';
        ansNum = sinNum;
        ansDen = cosNum;
      } else if (givenSin) {
        targetName = '\\cos\\alpha';
        ansNum = cosNum;
        ansDen = hyp;
      } else {
        targetName = '\\sin\\alpha';
        ansNum = sinNum;
        ansDen = hyp;
      }

      const correct = `$${fmtFracTex(ansNum, ansDen)}$`;
      const candidates = [
        `$${fmtFracTex(-ansNum, ansDen)}$`,
        `$${fmtFracTex(ansDen, ansNum)}$`,
        `$${fmtFracTex(-ansDen, ansNum)}$`,
        `$${fmtFracTex(leg1, leg2)}$`,
        `$${fmtFracTex(-leg1, leg2)}$`,
        `$${fmtFracTex(leg2, hyp)}$`,
        `$${fmtFracTex(-leg2, hyp)}$`,
      ];

      const { options, answer } = buildMcqOptions(
        rng,
        correct,
        candidates,
        (s) => `$${fmtFracTex(ansNum + s, hyp)}$`
      );

      return {
        points: 1,
        difficulty,
        stem: `Дано $${givenStr}$ и $${quad.range}$. Найдите $${targetName}$.`,
        options,
        answer,
        hint: 'Используйте основное тригонометрическое тождество $\\sin^2\\alpha + \\cos^2\\alpha = 1$ и учтите знак функции в данной четверти.',
        explanation:
          `Из тождества $\\sin^2\\alpha + \\cos^2\\alpha = 1$ находим модуль ${givenSin ? '$\\cos\\alpha$' : '$\\sin\\alpha$'}: ` +
          `$\\frac{${givenSin ? leg2 : leg1}}{${hyp}}$. Учитывая, что угол $\\alpha$ в ${quad.name} четверти, ` +
          `$\\sin\\alpha = ${fmtFracTex(sinNum, hyp)}$ и $\\cos\\alpha = ${fmtFracTex(cosNum, hyp)}$. ` +
          (askTan ? `Тогда $\\operatorname{tg}\\alpha = \\frac{\\sin\\alpha}{\\cos\\alpha} = ${fmtFracTex(ansNum, ansDen)}$.` : `Ответ: ${correct}.`),
      };
    },
  },
];
