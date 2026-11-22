import {
  gcd, cleanNum, fmtTexNum, fmtShortAns, numAccept, fmtTerm, pluralRu, buildMcqOptions,
} from './helpers.js';

const TOPIC_INEQ = 'Неравенства';
const TOPIC_EQ = 'Уравнения и системы уравнений';
const TOPIC_PROG = 'Прогрессии';

export const equationTypes = [
  // 19. math.linear-ineq (0903 #72)
  {
    id: 'math.linear-ineq',
    subject: 'math',
    title: 'Линейные неравенства',
    topic: TOPIC_INEQ,
    format: 'single',
    weight: 1,
    generate(rng, { difficulty }) {
      const a = rng.int(2, difficulty === 1 ? 6 : 9);
      const x0 = rng.intExcept(-12, 12, [0]);
      const b = -a * x0;
      const flipDir = rng.chance(0.5); // false: -ax <= b (x >= x0, min), true: -ax >= b (x <= x0, max)
      const strict = difficulty === 3 && rng.chance(0.5);

      const signOp = flipDir ? (strict ? '>' : '\\ge') : (strict ? '\\lt' : '\\le');
      const resOp = flipDir ? (strict ? '\\lt' : '\\le') : (strict ? '>' : '\\ge');
      const ans = strict ? (flipDir ? x0 - 1 : x0 + 1) : x0;
      const targetWord = flipDir
        ? (strict ? 'наибольшее целое решение' : 'наибольшее решение')
        : (strict ? 'наименьшее целое решение' : 'наименьшее решение');

      const { options, answer } = buildMcqOptions(
        rng,
        `$${ans}$`,
        [
          `$${-ans}$`,
          `$${ans - 1}$`,
          `$${ans + 1}$`,
          `$${-b}$`,
          `$${ans + 2}$`,
        ],
        (s) => `$${ans + s + 2}$`
      );

      return {
        points: 1,
        difficulty,
        stem: `Найдите ${targetWord} неравенства $-${a}x ${signOp} ${b}$.`,
        options,
        answer,
        hint: 'При делении обеих частей неравенства на отрицательное число знак неравенства меняется на противоположный.',
        explanation:
          `Разделим обе части на $-${a} \\lt 0$ и поменяем знак неравенства: ` +
          `$x ${resOp} ${x0}$. Поэтому ${targetWord} равно $${ans}$.`,
      };
    },
  },

  // 20. math.exp-ineq (0903 #75)
  {
    id: 'math.exp-ineq',
    subject: 'math',
    title: 'Показательные неравенства',
    topic: TOPIC_INEQ,
    format: 'short',
    weight: 1,
    generate(rng, { difficulty }) {
      const basePairs = [[2, 3], [2, 5], [3, 5], [3, 4]];
      const [a, b] = rng.pick(basePairs);
      const r = difficulty === 1 ? 0 : rng.pick([0, 1]);
      const M = rng.int(2, 4);

      const lhsCoeff = M * (b ** r);
      const rhsCoeff = M * (a ** r);

      let k = r + 2;
      while (a ** k <= lhsCoeff) k++;
      const c1 = a ** k - lhsCoeff;

      let m = r + 1;
      while (b ** m <= rhsCoeff) m++;
      const c2 = b ** m - rhsCoeff;

      const askMax = rng.chance(0.35);
      // If askMax, flip inequality direction: (a/b)^x > (a/b)^r => x < r => max int = r - 1
      const ineq = askMax ? '>' : '\\lt';
      const ans = askMax ? r - 1 : r + 1;
      const word = askMax ? 'наибольшее' : 'наименьшее';

      const lhsStr = `${a}^{x+${k}} - ${c1 === 1 ? '' : `${c1} \\cdot `}${a}^x`;
      const rhsStr = `${b}^{x+${m}} - ${c2 === 1 ? '' : `${c2} \\cdot `}${b}^x`;

      return {
        points: 1,
        difficulty,
        stem: `Найдите ${word} целое решение неравенства $${lhsStr} ${ineq} ${rhsStr}$.`,
        answer: String(ans),
        hint: `Вынесите $a^x$ и $b^x$ за скобки и разделите обе части на $${b}^x > 0$.`,
        explanation:
          `Вынесем степени с $x$ за скобки: ` +
          `$(${a}^{${k}} - ${c1})\\cdot ${a}^x ${ineq} (${b}^{${m}} - ${c2})\\cdot ${b}^x \\Rightarrow ` +
          `${lhsCoeff}\\cdot ${a}^x ${ineq} ${rhsCoeff}\\cdot ${b}^x$. ` +
          `Разделив на $${M} \\cdot ${b}^{${r}} \\cdot ${b}^x > 0$, получим ` +
          `$\\left(\\frac{${a}}{${b}}\\right)^x ${ineq} \\left(\\frac{${a}}{${b}}\\right)^{${r}}$. ` +
          `Так как $0 \\lt \\frac{${a}}{${b}} \\lt 1$, знак меняется: $x ${askMax ? '\\lt' : '>'} ${r}$. ` +
          `${askMax ? 'Наибольшее' : 'Наименьшее'} целое решение равно $${ans}$.`,
      };
    },
  },

  // 21. math.quad-ineq (1503 #77)
  {
    id: 'math.quad-ineq',
    subject: 'math',
    title: 'Квадратные неравенства',
    topic: TOPIC_INEQ,
    format: 'short',
    weight: 1,
    generate(rng, { difficulty }) {
      const x1 = rng.int(-5, 3);
      const x2 = rng.int(x1 + 3, x1 + (difficulty === 3 ? 10 : 7));
      const p = -(x1 + x2);
      const q = x1 * x2;
      const nonStrict = difficulty >= 2 && rng.chance(0.4);
      const op = nonStrict ? '\\le' : '\\lt';
      const lo = nonStrict ? x1 : x1 + 1;
      const hi = nonStrict ? x2 : x2 - 1;

      let sum = 0;
      const ints = [];
      for (let v = lo; v <= hi; v++) {
        sum += v;
        ints.push(v);
      }
      const askCount = rng.chance(0.35);
      const ans = askCount ? ints.length : sum;

      const poly = `x^2${fmtTerm(p, 'x', false)}${fmtTerm(q, '', false)}`;
      return {
        points: 1,
        difficulty,
        stem: `Найдите ${askCount ? 'количество' : 'сумму'} целых решений неравенства $${poly} ${op} 0$.`,
        answer: String(ans),
        hint: 'Найдите корни квадратного трёхчлена и примените метод интервалов.',
        explanation:
          `Корни уравнения $${poly} = 0$: $x_1 = ${x1}$, $x_2 = ${x2}$. ` +
          `Методом интервалов получаем $x \\in ${nonStrict ? `[${x1};\\ ${x2}]` : `(${x1};\\ ${x2})`}$. ` +
          `Целые решения: $${ints.join(', ')}$. ` +
          (askCount
            ? `Их количество равно $${ints.length}$.`
            : `Их сумма равна $${sum}$.`),
      };
    },
  },

  // 22. math.rational-motion-eq (0903 #79)
  {
    id: 'math.rational-motion-eq',
    subject: 'math',
    title: 'Встречное движение и дробно-рациональные уравнения',
    topic: TOPIC_EQ,
    format: 'short',
    weight: 1,
    generate(rng, { difficulty }) {
      // Constructive: slow speed v, fast speed v + dv
      const v = rng.int(3, 8);
      const dv = rng.int(4, 14);
      const vFast = v + dv;

      // Pick times t1 (fast to C), t2 = t1 + dt (slow to C) so distances S1, S2 are integers
      const dt = rng.pick([0.5, 1, 1.5, 2]);
      let t1 = rng.pick([1, 1.5, 2, 2.5, 3]);
      let S1 = vFast * t1;
      let S2 = v * (t1 + dt);
      let tries = 0;
      while ((!Number.isInteger(S1) || !Number.isInteger(S2) || S1 <= S2) && tries < 40) {
        t1 += 0.5;
        S1 = vFast * t1;
        S2 = v * (t1 + dt);
        tries++;
      }
      if (!Number.isInteger(S1) || !Number.isInteger(S2)) {
        // Fallback exact integers
        t1 = 2;
        S1 = vFast * 2;
        S2 = v * (2 + 1);
      }
      const actualDt = cleanNum(S2 / v - S1 / vFast);
      const totalS = S1 + S2;

      return {
        points: 2,
        difficulty,
        stem:
          `Из пунктов $A$ и $B$, расстояние между которыми равно $${totalS}$ км, одновременно навстречу друг другу выехали велосипедист из $A$ и вышел пешеход из $B$. ` +
          `Скорость велосипедиста на $${dv}$ км/ч больше скорости пешехода. Велосипедист прибыл в пункт $C$, расположенный на прямой $AB$ на расстоянии $${S1}$ км от $A$, ` +
          `на $${fmtTexNum(actualDt)}$ ч раньше пешехода. Найдите скорость пешехода (в км/ч).`,
        answer: String(v),
        accept: [`${v} км/ч`],
        hint: 'Обозначьте скорость пешехода за $x$ км/ч и выразите расстояние $BC = AB - AC$.',
        explanation:
          `Пусть скорость пешехода равна $x$ км/ч ($x > 0$), тогда скорость велосипедиста $(x + ${dv})$ км/ч. ` +
          `Расстояние $BC = ${totalS} - ${S1} = ${S2}$ км. По условию время пешехода на $BC$ на $${fmtTexNum(actualDt)}$ ч больше времени велосипедиста на $AC$: ` +
          `$\\frac{${S2}}{x} - \\frac{${S1}}{x + ${dv}} = ${fmtTexNum(actualDt)}$. ` +
          `Решая уравнение, получаем единственный положительный корень $x = ${v}$ км/ч.`,
      };
    },
  },

  // 23. math.linear-eq-table (1503 #84)
  {
    id: 'math.linear-eq-table',
    subject: 'math',
    title: 'Линейные уравнения по таблице',
    topic: TOPIC_EQ,
    format: 'short',
    weight: 1,
    generate(rng, { difficulty }) {
      const p1 = rng.int(8, 16) * 10; // e.g. 80..160
      const p2 = p1 + rng.int(2, 8) * 10; // strictly greater than p1
      const x = rng.int(5, 13);

      // Table entries: Person 1: (A - x, x), Person 2: (x + B, C - x)
      // Total1 = (A - x)p1 + x*p2 = A*p1 + x*(p2 - p1)
      // Total2 = (x + B)p1 + (C - x)p2 = B*p1 + C*p2 - x*(p2 - p1)
      // Set Total1 = Total2 => 2x(p2 - p1) = B*p1 + C*p2 - A*p1 => A = B + C*(p2/p1)? No:
      // Pick B in [2, 6], choose C >= x + 2 and compute A so (A - B)*p1 = C*p2 - 2x*(p2 - p1)
      // Simpler: guarantee divisibility by making C = k * p1 / gcd(p1, p2) + ... or set A - B = D:
      // Wait: (p2 - p1)*(C - 2x) + (B + C - A)*p1 = 0!
      // Look how easy that is: pick C = 2*x + t*p1/gcd(p1, p2)? Even simpler: pick m in [-2..2], set C = 2*x + m*...
      // Actually if we pick C such that (C - 2*x) is divisible by p1 / gcd(p1, p2):
      const g = gcd(p1, p2);
      const stepC = p1 / g;
      // Find C in [x + 2, x + 15] such that (C - 2*x) % stepC === 0
      const validCs = [];
      for (let candC = x + 2; candC <= x + 16; candC++) {
        if ((candC - 2 * x) % stepC === 0) validCs.push(candC);
      }
      const C = validCs.length > 0 ? rng.pick(validCs) : 2 * x;
      const B = rng.int(2, 6);
      const A = B + C + ((p2 - p1) * (C - 2 * x)) / p1;
      if (A - x < 2 || C - x < 2) {
        // Safe fallback guaranteed >= 2
        const xF = 10, p1F = 150, p2F = 180, BF = 4, CF = 15, AF = 18;
        return buildTableTask(rng, difficulty, xF, p1F, p2F, AF, BF, CF);
      }
      return buildTableTask(rng, difficulty, x, p1, p2, A, B, C);
    },
  },

  // 24. math.linear-system-word (0903 #80, 1503 #81)
  {
    id: 'math.linear-system-word',
    subject: 'math',
    title: 'Системы линейных уравнений (текстовые задачи)',
    topic: TOPIC_EQ,
    format: 'short',
    weight: 1,
    generate(rng, { difficulty }) {
      const useAvg = rng.chance(0.5);
      if (useAvg) {
        const x = rng.int(6, 18);
        let y = rng.int(6, 18);
        if (y === x) y++;
        const N = x + y;
        const g = gcd(x, y);
        const xr = x / g, yr = y / g;
        const step = rng.int(1, 3);
        const M = rng.int(22, 34);
        const m1 = M - step * yr;
        const m2 = M + step * xr;
        if (m1 <= 15) {
          // Shift M up so ages are realistic
          const shift = 18 - m1;
          return buildAvgTask(difficulty, x, y, N, m1 + shift, m2 + shift, M + shift, rng.chance(0.5));
        }
        return buildAvgTask(difficulty, x, y, N, m1, m2, M, rng.chance(0.5));
      }

      // Printer / production task (1503 #81)
      const x = rng.int(12, 38);
      const y = rng.int(10, 35);
      const N = x + y;
      const t1 = rng.pick([40, 45, 50, 60]);
      let t2 = rng.pick([20, 25, 30]);
      if (t2 === t1) t2 = 25;
      const totalSec = t1 * x + t2 * y;
      const useMin = totalSec % 60 === 0;
      const mins = totalSec / 60;
      const timeDesc = useMin
        ? `${mins} ${pluralRu(mins, 'минута', 'минуты', 'минут')}`
        : `${totalSec} ${pluralRu(totalSec, 'секунда', 'секунды', 'секунд')}`;
      const timeInStem = useMin
        ? `$${mins}$ ${pluralRu(mins, 'минуту', 'минуты', 'минут')}`
        : `$${totalSec}$ ${pluralRu(totalSec, 'секунду', 'секунды', 'секунд')}`;

      return {
        points: 2,
        difficulty,
        stem:
          `Принтер печатает одну цветную страницу за $${t1}$ секунд, а одну чёрно-белую — за $${t2}$ секунд. ` +
          `За ${timeInStem} непрерывной работы было напечатано $${N}$ ${pluralRu(N, 'страница', 'страницы', 'страниц')}. ` +
          `Сколько среди них цветных страниц?`,
        answer: String(x),
        hint: 'Составьте систему двух линейных уравнений для числа цветных ($x$) и чёрно-белых ($y$) страниц.',
        explanation:
          `Пусть напечатано $x$ цветных и $y$ чёрно-белых страниц. ` +
          `Тогда $x + y = ${N}$ и $${t1}x + ${t2}y = ${totalSec}$ (так как ${timeDesc} $= ${totalSec}$ с). ` +
          `Подставив $y = ${N} - x$, получаем $(${t1} - ${t2})x = ${totalSec} - ${t2 * N} = ${(t1 - t2) * x}$, откуда $x = ${x}$.`,
      };
    },
  },

  // 25. math.arith-prog-diff (0903 #69)
  {
    id: 'math.arith-prog-diff',
    subject: 'math',
    title: 'Арифметическая прогрессия: разность и член',
    topic: TOPIC_PROG,
    format: 'single',
    weight: 1,
    generate(rng, { difficulty }) {
      const d = rng.intExcept(-7, 7, [0]);
      const a1 = rng.int(-15, 55);
      const k = rng.int(4, 15);
      const gap = rng.int(5, 16);
      const m = k + gap;
      const ak = a1 + (k - 1) * d;
      const am = a1 + (m - 1) * d;

      const { options, answer } = buildMcqOptions(
        rng,
        `$${d}$`,
        [
          `$${-d}$`,
          `$${d + 1}$`,
          `$${d - 1}$`,
          `$${d * 2}$`,
          `$${d + 3}$`,
        ],
        (s) => `$${d + s + 3}$`
      );

      return {
        points: 1,
        difficulty,
        stem: `В арифметической прогрессии $(a_n)$ известно, что $a_{${k}} = ${ak}$ и $a_{${m}} = ${am}$. Найдите разность прогрессии $d$.`,
        options,
        answer,
        hint: 'Используйте формулу $a_m - a_k = (m - k)d$.',
        explanation:
          `Разность прогрессии равна ` +
          `$d = \\frac{a_{${m}} - a_{${k}}}{${m} - ${k}} = \\frac{${am} - (${ak})}{${gap}} = ${d}$.`,
      };
    },
  },

  // 26. math.arith-prog-sum (1503 #85)
  {
    id: 'math.arith-prog-sum',
    subject: 'math',
    title: 'Сумма арифметической прогрессии (текстовая задача)',
    topic: TOPIC_PROG,
    format: 'short',
    weight: 1,
    generate(rng, { difficulty }) {
      // Coin bank: c1*50 + c2*20 + c3*10 qepik on day 1; +1 of each coin per day => d = 80 qepik
      const c1 = rng.int(1, 3);
      const c2 = rng.int(1, 4);
      const c3 = rng.int(1, 4);
      const a1 = c1 * 50 + c2 * 20 + c3 * 10; // in qepik
      const d = 80;
      // Need S_n = (2*a1 + 80*(n-1))/2 * n = n * (a1 + 40*(n-1)) divisible by 100
      const validNs = [];
      for (let cand = 5; cand <= 20; cand++) {
        const sQep = cand * (a1 + 40 * (cand - 1));
        if (sQep % 100 === 0) validNs.push(cand);
      }
      const n = rng.pick(validNs);
      const totalQep = n * (a1 + 40 * (n - 1));
      const totalManat = totalQep / 100;

      return {
        points: 2,
        difficulty,
        stem:
          `В первый день Агиль положил в пустую копилку $${c1}$ ${pluralRu(c1, 'монету', 'монеты', 'монет')} номиналом $50$ гяпиков, ` +
          `$${c2}$ ${pluralRu(c2, 'монету', 'монеты', 'монет')} по $20$ гяпиков и $${c3}$ ${pluralRu(c3, 'монету', 'монеты', 'монет')} по $10$ гяпиков. ` +
          `Каждый следующий день он клал в копилку на одну монету каждого вида больше, чем в предыдущий день. ` +
          `Через сколько дней в копилке накопится ровно $${totalManat}$ ${pluralRu(totalManat, 'манат', 'маната', 'манат')}?`,
        answer: String(n),
        accept: [`${n} ${pluralRu(n, 'день', 'дня', 'дней')}`],
        hint: 'Переведите всю сумму в гяпики ($1$ манат $= 100$ гяпиков) и примените формулу суммы $S_n$.',
        explanation:
          `В первый день положено $a_1 = ${c1}\\cdot 50 + ${c2}\\cdot 20 + ${c3}\\cdot 10 = ${a1}$ гяпиков. ` +
          `Ежедневная прибавка составляет $d = 50 + 20 + 10 = 80$ гяпиков. ` +
          `По формуле суммы $S_n = \\frac{2\\cdot ${a1} + 80(n - 1)}{2}\\cdot n = ${totalQep}$ (так как $${totalManat}$ манат $= ${totalQep}$ гяпиков). ` +
          `Получаем квадратное уравнение $40n^2 + ${a1 - 40}n - ${totalQep} = 0$, откуда единственный положительный корень $n = ${n}$.`,
      };
    },
  },

  // 27. math.vieta-quad (curriculum gap)
  {
    id: 'math.vieta-quad',
    subject: 'math',
    title: 'Теорема Виета и квадратные уравнения',
    topic: TOPIC_EQ,
    format: 'short',
    weight: 0.9,
    generate(rng, { difficulty }) {
      const x1 = rng.intExcept(-8, 8, [0]);
      let x2 = rng.intExcept(-8, 8, [0, x1]);
      const p = -(x1 + x2);
      const q = x1 * x2;
      const poly = `x^2${fmtTerm(p, 'x', false)}${fmtTerm(q, '', false)} = 0`;

      const useRecip = difficulty >= 2 && (x1 + x2) % (x1 * x2) === 0;
      if (useRecip) {
        const ans = (x1 + x2) / (x1 * x2);
        return {
          points: 1,
          difficulty,
          stem: `Пусть $x_1$ и $x_2$ — корни уравнения $${poly}$. Найдите $\\frac{1}{x_1} + \\frac{1}{x_2}$.`,
          answer: String(ans),
          hint: 'Приведите дроби к общему знаменателю и примените теорему Виета.',
          explanation:
            `По теореме Виета $x_1 + x_2 = ${-p}$, $x_1 x_2 = ${q}$. ` +
            `Тогда $\\frac{1}{x_1} + \\frac{1}{x_2} = \\frac{x_1 + x_2}{x_1 x_2} = \\frac{${-p}}{${q}} = ${ans}$.`,
        };
      }

      const sumSq = x1 * x1 + x2 * x2;
      return {
        points: 1,
        difficulty,
        stem: `Пусть $x_1$ и $x_2$ — корни уравнения $${poly}$. Найдите $x_1^2 + x_2^2$.`,
        answer: String(sumSq),
        hint: 'Выразите $x_1^2 + x_2^2 = (x_1 + x_2)^2 - 2x_1 x_2$.',
        explanation:
          `По теореме Виета $x_1 + x_2 = ${-p}$ и $x_1 x_2 = ${q}$. ` +
          `Тогда $x_1^2 + x_2^2 = (x_1 + x_2)^2 - 2x_1 x_2 = (${-p})^2 - 2 \\cdot (${q}) = ${sumSq}$.`,
      };
    },
  },

  // 28. math.geom-prog (curriculum gap)
  {
    id: 'math.geom-prog',
    subject: 'math',
    title: 'Геометрическая прогрессия',
    topic: TOPIC_PROG,
    format: 'short',
    weight: 0.9,
    generate(rng, { difficulty }) {
      const useInfinite = difficulty >= 2 && rng.chance(0.5);
      if (useInfinite) {
        const qPairs = [
          { num: 1, den: 2, tex: '\\frac{1}{2}' },
          { num: 1, den: 3, tex: '\\frac{1}{3}' },
          { num: 1, den: 4, tex: '\\frac{1}{4}' },
          { num: 1, den: 5, tex: '\\frac{1}{5}' },
          { num: 2, den: 3, tex: '\\frac{2}{3}' },
        ];
        const qp = rng.pick(qPairs);
        const k = rng.int(2, 9);
        const b1 = k * (qp.den - qp.num);
        const sum = k * qp.den;
        return {
          points: 1,
          difficulty,
          stem: `Найдите сумму бесконечно убывающей геометрической прогрессии, если $b_1 = ${b1}$ и $q = ${qp.tex}$.`,
          answer: String(sum),
          hint: 'Используйте формулу $S = \\frac{b_1}{1 - q}$.',
          explanation:
            `По формуле суммы бесконечно убывающей геометрической прогрессии: ` +
            `$S = \\frac{${b1}}{1 - ${qp.tex}} = \\frac{${b1}}{\\frac{${qp.den - qp.num}}{${qp.den}}} = ${sum}$.`,
        };
      }

      const b1 = rng.int(2, 7);
      const q = rng.pick([2, 3]);
      const k1 = rng.int(1, 2);
      const k2 = k1 + rng.int(2, 3);
      const bk1 = b1 * (q ** (k1 - 1));
      const bk2 = b1 * (q ** (k2 - 1));
      const target = k2 + 1;
      const ans = b1 * (q ** (target - 1));

      return {
        points: 1,
        difficulty,
        stem: `В геометрической прогрессии $(b_n)$ с положительными членами $b_{${k1}} = ${bk1}$ и $b_{${k2}} = ${bk2}$. Найдите $b_{${target}}$.`,
        answer: String(ans),
        hint: 'Найдите знаменатель прогрессии $q$ из отношения $\\frac{b_m}{b_k} = q^{m-k}$.',
        explanation:
          `Так как $b_{${k2}} = b_{${k1}} \\cdot q^{${k2 - k1}}$, имеем $q^{${k2 - k1}} = \\frac{${bk2}}{${bk1}} = ${q ** (k2 - k1)}$, откуда $q = ${q}$ ($q > 0$). ` +
          `Тогда $b_{${target}} = b_{${k2}} \\cdot q = ${bk2} \\cdot ${q} = ${ans}$.`,
      };
    },
  },
];

function buildTableTask(rng, difficulty, x, p1, p2, A, B, C) {
  const nurayOneWay = x + B;
  const tableHtml =
    `<table><thead><tr><th>Тип билета</th><th>Асиф</th><th>Нурай</th></tr></thead>` +
    `<tbody><tr><td>В одну сторону ($${p1}$ манат)</td><td>$${A} - x$</td><td>$x + ${B}$</td></tr>` +
    `<tr><td>Туда и обратно ($${p2}$ манат)</td><td>$x$</td><td>$${C} - x$</td></tr></tbody></table>`;

  return {
    points: 2,
    difficulty,
    stem:
      `Авиакомпания продаёт билеты в одну сторону за $${p1}$ манат, а туда и обратно — за $${p2}$ манат. ` +
      `В таблице указано количество билетов, купленных Асифом и Нурай (каждый купил хотя бы по одному билету обоих видов). ` +
      `${tableHtml}Если оба заплатили одинаковую сумму, сколько билетов в одну сторону купила Нурай?`,
    answer: String(nurayOneWay),
    hint: 'Приравняйте общую стоимость покупок Асифа и Нурай и найдите $x$.',
    explanation:
      `Сумма Асифа: $(${A} - x)\\cdot ${p1} + ${p2}x$. Сумма Нурай: $(x + ${B})\\cdot ${p1} + (${C} - x)\\cdot ${p2}$. ` +
      `Приравнивая суммы: $${A * p1} + (${p2 - p1})x = ${B * p1 + C * p2} - (${p2 - p1})x \\Rightarrow ` +
      `${2 * (p2 - p1)}x = ${2 * (p2 - p1) * x} \\Rightarrow x = ${x}$. ` +
      `Количество билетов в одну сторону у Нурай: $x + ${B} = ${x} + ${B} = ${nurayOneWay}$.`,
  };
}

function buildAvgTask(difficulty, x, y, N, m1, m2, M, askWomen) {
  const ans = askWomen ? x : y;
  const targetWord = askWomen ? 'женщин' : 'мужчин';
  return {
    points: 2,
    difficulty,
    stem:
      `В коллективе из $${N}$ сотрудников средний возраст женщин равен $${m1}$ годам, а средний возраст мужчин — $${m2}$ годам. ` +
      `Если средний возраст всех сотрудников равен $${M}$ годам, сколько ${targetWord} в этом коллективе?`,
    answer: String(ans),
    hint: 'Сумма возрастов всей группы равна сумме возрастов женщин и мужчин.',
    explanation:
      `Обозначим число женщин за $x$, а мужчин за $y$. Имеем систему: $x + y = ${N}$ и $${m1}x + ${m2}y = ${M}\\cdot ${N}$. ` +
      `Подставив $x = ${N} - y$, получаем $(${m2} - ${m1})y = (${M} - ${m1})\\cdot ${N}$, откуда $y = ${y}$ и $x = ${x}$. ` +
      `Искомое количество ${targetWord}: $${ans}$.`,
  };
}
