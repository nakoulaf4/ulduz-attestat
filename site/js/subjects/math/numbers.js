import {
  gcd, lcm, fact, comb, cleanNum, fmtRu, fmtTexNum, fmtShortAns, numAccept,
  fmtFracTex, fmtTerm, pluralRu, buildMcqOptions,
} from './helpers.js';
import { svgVennTwo, svgVennSubset, svgTrainTunnels } from './svg.js';

const TOPIC_NUM = 'Числа, дроби и проценты';
const TOPIC_SETS = 'Множества';
const TOPIC_COMB = 'Комбинаторика, вероятность и статистика';

export const numberTypes = [
  // 1. math.interval-count (0903 #65)
  {
    id: 'math.interval-count',
    subject: 'math',
    title: 'Натуральные числа в промежутке',
    topic: TOPIC_NUM,
    format: 'single',
    weight: 1,
    generate(rng, { difficulty }) {
      const len = difficulty === 1 ? rng.int(4, 9) : rng.int(5, 16);
      const a = difficulty === 3 ? rng.int(-5, 30) : rng.int(6, 45);
      const b = a + len;
      const leftStrict = rng.chance(0.5);
      const rightStrict = rng.chance(0.5);
      const opL = leftStrict ? '\\lt' : '\\le';
      const opR = rightStrict ? '\\lt' : '\\le';

      const minInt = Math.max(1, leftStrict ? a + 1 : a);
      const maxInt = rightStrict ? b - 1 : b;
      const ans = Math.max(0, maxInt - minInt + 1);

      const candidates = [
        `$${Math.max(0, ans - 1)}$`,
        `$${ans + 1}$`,
        `$${ans + 2}$`,
        `$${Math.max(0, ans - 2)}$`,
        `$${len + 2}$`,
      ];
      if (a <= 0) {
        const allInts = (rightStrict ? b - 1 : b) - (leftStrict ? a + 1 : a) + 1;
        candidates.unshift(`$${allInts}$`);
      }

      const { options, answer } = buildMcqOptions(
        rng,
        `$${ans}$`,
        candidates,
        (s) => `$${ans + s + 2}$`
      );

      return {
        points: 1,
        difficulty,
        stem: `Найдите количество натуральных чисел $n$, удовлетворяющих условию $${a} ${opL} n ${opR} ${b}$.`,
        options,
        answer,
        hint: 'Определите наименьшее и наибольшее натуральные числа в указанном промежутке.',
        explanation:
          `Наименьшее натуральное решение: $${minInt}$, наибольшее: $${maxInt}$. ` +
          `Количество натуральных чисел в промежутке равно $${maxInt} - ${minInt} + 1 = ${ans}$.`,
      };
    },
  },

  // 2. math.fractions-percent (0903 #66)
  {
    id: 'math.fractions-percent',
    subject: 'math',
    title: 'Дроби и нахождение числа по проценту',
    topic: TOPIC_NUM,
    format: 'single',
    weight: 1,
    generate(rng, { difficulty }) {
      const pctPool = difficulty === 1 ? [10, 20, 25, 50] : [15, 20, 25, 40, 60, 75, 80];
      const p = rng.pick(pctPool);
      const stepX = 100 / gcd(p, 100);
      const mult = rng.int(2, difficulty === 3 ? 12 : 8);
      const targetX = stepX * mult;
      const E = (p * targetX) / 100; // exact integer >= 2

      // Build A + c = E where A = d * (m + u/v) is integer or half-integer
      const den = rng.pick([3, 4, 5]);
      const u = rng.int(1, den - 1);
      const g = gcd(u, den);
      const uRed = u / g, denRed = den / g;
      const m = rng.int(1, 2);
      const numFrac = m * denRed + uRed; // improper numerator

      // Pick decimal multiplier d = k * denRed / 2 so d * (numFrac/denRed) = k * numFrac / 2
      const k = rng.int(1, 3);
      const d = (k * denRed) / 2; // e.g. 1.5, 2.5, 3.0, 4.5
      const A = (k * numFrac) / 2;
      const c = cleanNum(E - A);
      const cAbs = Math.abs(c);
      const cSign = c >= 0 ? '+' : '-';

      const wrongVal = cleanNum((p * E) / 100);
      const wrongOrder = cleanNum(((d * m + uRed / denRed + c) * 100) / p);

      const { options, answer } = buildMcqOptions(
        rng,
        `$${fmtTexNum(targetX)}$`,
        [
          `$${fmtTexNum(targetX * 10)}$`,
          `$${fmtTexNum(wrongVal)}$`,
          `$${fmtTexNum(targetX + 10)}$`,
          `$${fmtTexNum(Math.max(5, targetX - 5))}$`,
          `$${fmtTexNum(wrongOrder)}$`,
        ],
        (s) => `$${fmtTexNum(targetX + s * 15)}$`
      );

      const expr = c === 0
        ? `${fmtTexNum(d)} \\cdot ${m}\\frac{${uRed}}{${denRed}}`
        : `${fmtTexNum(d)} \\cdot ${m}\\frac{${uRed}}{${denRed}} ${cSign} ${fmtTexNum(cAbs)}`;

      return {
        points: 1,
        difficulty,
        stem: `Найдите число, $${p}\\%$ которого равны значению выражения $${expr}$.`,
        options,
        answer,
        hint: 'Сначала вычислите значение выражения, а затем разделите его на процент в виде десятичной дроби.',
        explanation:
          `Вычислим значение выражения: $${expr} = ${fmtTexNum(A)}${c === 0 ? '' : ` ${cSign} ${fmtTexNum(cAbs)}`} = ${fmtTexNum(E)}$. ` +
          `Число, $${p}\\%$ которого равны $${fmtTexNum(E)}$, равно $\\frac{${fmtTexNum(E)} \\cdot 100}{${p}} = ${fmtTexNum(targetX)}$.`,
      };
    },
  },

  // 3. math.percent-word (1503 #80)
  {
    id: 'math.percent-word',
    subject: 'math',
    title: 'Текстовые задачи на проценты и оплату',
    topic: TOPIC_NUM,
    format: 'short',
    weight: 1,
    generate(rng, { difficulty }) {
      const price = rng.pick([150, 200, 250, 300, 400, 500]);
      const pct = rng.pick(price === 150 ? [4, 6, 8, 10] : [4, 5, 6, 8, 10]);
      const bonus = (price * pct) / 100; // integer >= 6
      const baseSalary = rng.pick([600, 800, 900, 1000, 1200]);
      const n1 = rng.int(18, 45);
      const diff = rng.int(difficulty === 1 ? 5 : 8, difficulty === 3 ? 32 : 22);
      const n2 = n1 + diff;
      const sal1 = baseSalary + n1 * bonus;
      const sal2 = baseSalary + n2 * bonus;

      const askSum = difficulty === 3 && rng.chance(0.4);
      const ans = askSum ? n1 + n2 : diff;
      const stem = askSum
        ? `Продавец в магазине техники с фиксированным окладом $${baseSalary}$ манат получает дополнительно $${pct}\\%$ от стоимости каждого проданного товара ценой $${price}$ манат. В январе его общий доход составил $${sal1}$ манат, а в феврале — $${sal2}$ манат. Сколько всего единиц товара он продал за два месяца?`
        : `Продавец в магазине техники с фиксированным окладом $${baseSalary}$ манат получает дополнительно $${pct}\\%$ от стоимости каждого проданного товара ценой $${price}$ манат. В январе его доход составил $${sal1}$ манат, а в феврале — $${sal2}$ манат. На сколько больше товаров он продал в феврале, чем в январе?`;

      const explanation = askSum
        ? `Бонус за одну продажу: $${price} \\cdot \\frac{${pct}}{100} = ${bonus}$ манат. ` +
          `В январе продано $\\frac{${sal1} - ${baseSalary}}{${bonus}} = ${n1}$, в феврале $\\frac{${sal2} - ${baseSalary}}{${bonus}} = ${n2}$. ` +
          `Всего за два месяца продано $${n1} + ${n2} = ${ans}$ единиц.`
        : `Бонус за одну продажу: $${price} \\cdot \\frac{${pct}}{100} = ${bonus}$ манат. ` +
          `Разница в доходе равна $${sal2} - ${sal1} = ${sal2 - sal1}$ манат. ` +
          `Так как оклад фиксированный, разница обеспечена дополнительными продажами: $\\frac{${sal2 - sal1}}{${bonus}} = ${diff}$.`;

      return {
        points: 2,
        difficulty,
        stem,
        answer: String(ans),
        hint: 'Найдите бонус с одной продажи в манатах и используйте разницу (или остаток сверх оклада).',
        explanation,
      };
    },
  },

  // 4. math.train-motion (1503 #75)
  {
    id: 'math.train-motion',
    subject: 'math',
    title: 'Движение поезда через туннели',
    topic: TOPIC_NUM,
    format: 'short',
    weight: 1,
    generate(rng, { difficulty }) {
      const pairs = [
        [12, 60], [15, 64], [15, 72], [15, 80], [18, 60], [18, 70],
        [20, 54], [20, 63], [20, 72], [24, 60], [24, 75], [30, 56],
      ];
      const [tMin, speed] = rng.pick(pairs);
      const totalKm = cleanNum((speed * tMin) / 60); // exact integer or .5 km
      const totalM = Math.round(totalKm * 1000);

      const trainM = rng.pick([150, 200, 250, 300, 350]);
      const tun1 = rng.pick([300, 400, 450, 500, 600]);
      const tun2 = rng.pick([250, 300, 350, 400, 500]);
      const gapM = totalM - trainM - tun1 - tun2;
      const gapKm = cleanNum(gapM / 1000);

      return {
        points: 1,
        difficulty,
        stem:
          `Расстояние от конца первого туннеля длиной $${tun1}$ м до начала второго туннеля длиной $${tun2}$ м равно $${fmtTexNum(gapKm)}$ км. ` +
          `Через сколько минут поезд длиной $${trainM}$ м, движущийся со скоростью $${speed}$ км/ч, полностью выйдет из второго туннеля, считая с момента входа в первый туннель?`,
        image: {
          svg: svgTrainTunnels({
            trainLen: `${trainM} м`,
            tun1: `${tun1} м`,
            gap: `${fmtRu(gapKm)} км`,
            tun2: `${tun2} м`,
          }),
          alt: `Схема движения поезда длиной ${trainM} м через два туннеля длиной ${tun1} м и ${tun2} м с расстоянием ${fmtRu(gapKm)} км между ними`,
        },
        answer: String(tMin),
        accept: [`${tMin} мин`],
        hint: 'Не забудьте прибавить длину самого поезда к сумме длин туннелей и расстояния между ними.',
        explanation:
          `Чтобы поезд полностью вышел из второго туннеля, его последний вагон должен пройти путь: ` +
          `$${trainM} + ${tun1} + ${gapM} + ${tun2} = ${totalM}\\text{ м} = ${fmtTexNum(totalKm)}\\text{ км}$. ` +
          `Время движения: $t = \\frac{${fmtTexNum(totalKm)}}{${speed}} \\text{ ч} = \\frac{${fmtTexNum(totalKm)} \\cdot 60}{${speed}} = ${tMin}\\text{ мин}$.`,
      };
    },
  },

  // 5. math.sets-ops (1503 #64)
  {
    id: 'math.sets-ops',
    subject: 'math',
    title: 'Операции над множествами',
    topic: TOPIC_SETS,
    format: 'single',
    weight: 1,
    generate(rng, { difficulty }) {
      const pool = rng.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
      const nOnlyA = difficulty === 1 ? 2 : rng.int(2, 3);
      const nInter = difficulty === 1 ? 2 : rng.int(2, 3);
      const nOnlyB = difficulty === 1 ? 2 : rng.int(2, 3);

      const onlyA = pool.slice(0, nOnlyA).sort((x, y) => x - y);
      const inter = pool.slice(nOnlyA, nOnlyA + nInter).sort((x, y) => x - y);
      const onlyB = pool.slice(nOnlyA + nInter, nOnlyA + nInter + nOnlyB).sort((x, y) => x - y);

      const A = [...onlyA, ...inter].sort((x, y) => x - y);
      const B = [...inter, ...onlyB].sort((x, y) => x - y);
      const union = [...onlyA, ...inter, ...onlyB].sort((x, y) => x - y);

      const fmtSet = (arr) => `$\\{${arr.join(';\\ ')}\\}$`;
      const ops = [
        { expr: 'A \\setminus B', res: onlyA, desc: 'элементы, принадлежащие $A$, но не принадлежащие $B$' },
        { expr: 'B \\setminus A', res: onlyB, desc: 'элементы, принадлежащие $B$, но не принадлежащие $A$' },
        { expr: 'A \\cap B', res: inter, desc: 'общие элементы множеств $A$ и $B$' },
        { expr: 'A \\cup B', res: union, desc: 'все элементы, входящие хотя бы в одно из множеств $A$ или $B$' },
      ];
      const chosen = rng.pick(ops);
      const correct = fmtSet(chosen.res);
      const candidates = [
        fmtSet(onlyA),
        fmtSet(onlyB),
        fmtSet(inter),
        fmtSet(union),
        '$\\varnothing$',
      ].filter((s) => s !== correct);

      const { options, answer } = buildMcqOptions(rng, correct, candidates);

      return {
        points: 1,
        difficulty,
        stem: `Даны множества $A = \\{${A.join(';\\ ')}\\}$ и $B = \\{${B.join(';\\ ')}\\}$. Найдите $${chosen.expr}$.`,
        options,
        answer,
        hint: `Вспомните определение операции $${chosen.expr}$.`,
        explanation: `Множество $${chosen.expr}$ содержит ${chosen.desc}: ${correct}.`,
      };
    },
  },

  // 6. math.venn-ineq (0903 #85)
  {
    id: 'math.venn-ineq',
    subject: 'math',
    title: 'Диаграмма Эйлера–Венна и неравенства',
    topic: TOPIC_SETS,
    format: 'short',
    weight: 1,
    generate(rng, { difficulty }) {
      const xMin = rng.int(2, 6);
      const span = rng.int(3, difficulty === 3 ? 7 : 5);
      const xMax = xMin + span;

      const a = rng.int(2, 4);
      const d = rng.int(2, 4);
      const remMax = rng.int(1, d); // so x <= xMax iff c - d*x > 0
      const c = d * xMax + remMax;
      const u = rng.int(0, a + d - 1);
      const b = c - (a + d) * (xMin - 1) - u;

      const p = rng.int(2, 5);
      const q = rng.int(1, 12);

      const minVal = p * xMin + q;
      const maxVal = p * xMax + q;
      const ans = minVal + maxVal;

      const bSign = b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`;
      const midStr = `${a}x ${bSign}`;
      const leftStr = `${p}x + ${q}`;
      const rightStr = `${c} - ${d}x`;

      const bValMin = a * xMin + b;
      const rValMin = c - d * xMin;
      if (bValMin <= rValMin || rValMin <= 0) {
        throw new Error('venn-ineq invariant violated');
      }

      return {
        points: 2,
        difficulty,
        stem:
          `На диаграмме Эйлера–Венна указано количество элементов множеств $A$ и $B$: ` +
          `$n(A \\setminus B) = ${leftStr}$, $n(A \\cap B) = ${midStr}$, $n(B \\setminus A) = ${rightStr}$. ` +
          `Известно, что $n(A \\cap B) > n(B \\setminus A)$. Найдите сумму наименьшего и наибольшего возможных значений ` +
          `$n(A \\setminus B)$ при натуральных значениях $x$.`,
        image: {
          svg: svgVennTwo({ left: leftStr, mid: midStr, right: rightStr }),
          alt: `Диаграмма Эйлера–Венна: в левой части ${leftStr}, в пересечении ${midStr}, в правой части ${rightStr}`,
        },
        answer: String(ans),
        hint: 'Учтите также, что число элементов в любой части множества должно быть натуральным (положительным).',
        explanation:
          `Из условия $n(A \\cap B) > n(B \\setminus A)$ получаем $${midStr} > ${rightStr} \\Rightarrow ${a + d}x > ${c - b}$, откуда наименьшее натуральное $x = ${xMin}$. ` +
          `Поскольку число элементов $n(B \\setminus A)$ положительно, $${rightStr} > 0 \\Rightarrow x \\lt \\frac{${c}}{${d}}$, значит наибольшее натуральное $x = ${xMax}$. ` +
          `При $x \\in [${xMin};\\ ${xMax}]$ выражение $n(A \\setminus B) = ${leftStr}$ принимает наименьшее значение $${p}\\cdot${xMin}+${q}=${minVal}$ и наибольшее $${p}\\cdot${xMax}+${q}=${maxVal}$. ` +
          `Их сумма: $${minVal} + ${maxVal} = ${ans}$.`,
      };
    },
  },

  // 7. math.combinatorics (0903 #70, 1503 #66)
  {
    id: 'math.combinatorics',
    subject: 'math',
    title: 'Комбинаторика: сочетания и перестановки',
    topic: TOPIC_COMB,
    format: 'single',
    weight: 1,
    generate(rng, { difficulty }) {
      const mode = rng.chance(0.55) ? 'choose' : 'perm';
      if (mode === 'choose') {
        const k = difficulty === 3 ? rng.pick([2, 3]) : 2;
        const n = k === 2 ? rng.int(10, 28) : rng.int(6, 12);
        const ans = comb(n, k);
        const permVal = k === 2 ? n * (n - 1) : n * (n - 1) * (n - 2);
        const noun = k === 2 ? 'двух дежурных' : 'трёх представителей';
        const { options, answer } = buildMcqOptions(
          rng,
          `$${ans}$`,
          [
            `$${permVal}$`,
            `$${n * n}$`,
            `$${comb(n - 1, k)}$`,
            `$${n * k * 5}$`,
            `$${ans + n}$`,
          ],
          (s) => `$${ans + s * 7}$`
        );
        return {
          points: 1,
          difficulty,
          stem: `В классе $${n}$ ${pluralRu(n, 'ученик', 'ученика', 'учеников')}. Сколькими различными способами из них можно выбрать ${noun}?`,
          options,
          answer,
          hint: 'Порядок выбора не важен, поэтому используйте число сочетаний.',
          explanation:
            `Так как порядок выбора не имеет значения, число способов равно $C_{${n}}^{${k}} = ` +
            `\\frac{${n}!}{${k}!\\cdot ${n - k}!} = ${ans}$.`,
        };
      }

      const m = rng.int(4, difficulty === 3 ? 6 : 5);
      const r = rng.int(2, m - 1);
      const isSub = difficulty >= 2 && rng.chance(0.4);
      const op = isSub ? '-' : '+';
      const pm = fact(m), pr = fact(r);
      const ans = isSub ? pm - pr : pm + pr;

      const { options, answer } = buildMcqOptions(
        rng,
        `$${ans}$`,
        [
          `$${isSub ? pm + pr : Math.max(2, pm - pr)}$`,
          `$${isSub ? m - r : m + r}$`,
          `$${fact(m - 1) + pr}$`,
          `$${ans + 10}$`,
          `$${ans + 4}$`,
        ],
        (s) => `$${ans + s * 6}$`
      );

      return {
        points: 1,
        difficulty,
        stem: `Вычислите значение выражения $${m}! ${op} ${r}!$ (то есть $P_{${m}} ${op} P_{${r}}$).`,
        options,
        answer,
        hint: 'Напомним, что $P_n = n! = 1 \\cdot 2 \\cdot \\dots \\cdot n$.',
        explanation:
          `$P_{${m}} = ${m}! = ${pm}$, $P_{${r}} = ${r}! = ${pr}$. ` +
          `Тогда $${pm} ${op} ${pr} = ${ans}$.`,
      };
    },
  },

  // 8. math.probability-subsets (1503 #70)
  {
    id: 'math.probability-subsets',
    subject: 'math',
    title: 'Вероятность выбора из подмножества',
    topic: TOPIC_COMB,
    format: 'single',
    weight: 1,
    generate(rng, { difficulty }) {
      const N = rng.int(7, difficulty === 3 ? 13 : 11);
      let M = rng.int(2, N - 3);
      if (2 * M === N) M = M > 2 ? M - 1 : M + 1; // avoid M === K so distractors stay distinct
      const K = N - M;

      const askInB = difficulty >= 2 && M >= 3 && rng.chance(0.35);
      const favCount = askInB ? M : K;
      const favSetLabel = askInB ? 'B' : 'A \\setminus B';

      const num = comb(favCount, 2);
      const den = comb(N, 2);
      const g = gcd(num, den);
      const p = num / g, q = den / g;
      const correct = `$${fmtFracTex(p, q)}$`;

      const otherCount = askInB ? K : M;
      const alt1 = comb(otherCount, 2);
      const candidates = [
        `$${fmtFracTex(alt1, den)}$`,
        `$${fmtFracTex(favCount, N)}$`,
        `$${fmtFracTex(p + 1, q)}$`,
        `$${fmtFracTex(Math.max(1, p - 1), q)}$`,
        `$${fmtFracTex(p, q + 2)}$`,
      ];

      const { options, answer } = buildMcqOptions(
        rng,
        correct,
        candidates,
        (s) => `$${fmtFracTex(p + s, q + s + 1)}$`
      );

      return {
        points: 1,
        difficulty,
        stem:
          `Для множеств $A$ и $B$ известно, что $B \\subset A$, $n(A) = ${N}$ и $n(B) = ${M}$. ` +
          `Найдите вероятность того, что два случайно выбранных элемента из $A$ принадлежат множеству $${favSetLabel}$.`,
        image: {
          svg: svgVennSubset({ outerCount: String(K), innerCount: String(M) }),
          alt: `Диаграмма Эйлера–Венна: множество B (${M} эл.) внутри множества A (${K} эл. вне B)`,
        },
        options,
        answer,
        hint: 'Найдите число элементов в нужном множестве и используйте отношение числа сочетаний.',
        explanation:
          `Число элементов в $A \\setminus B$ равно $${N} - ${M} = ${K}$. ` +
          `Всего способов выбрать $2$ элемента из $A$: $C_{${N}}^2 = ${den}$. ` +
          `Благоприятных исходов: $C_{${favCount}}^2 = ${num}$. ` +
          `Искомая вероятность: $P = \\frac{${num}}{${den}} = ${fmtFracTex(p, q)}$.`,
      };
    },
  },

  // 9. math.probability-digits (0903 #77)
  {
    id: 'math.probability-digits',
    subject: 'math',
    title: 'Классическая вероятность (свойства чисел)',
    topic: TOPIC_COMB,
    format: 'short',
    weight: 1,
    generate(rng, { difficulty }) {
      const variants = [
        {
          stem: 'Среди двузначных чисел $\\overline{ab}$, для которых $\\sqrt{\\overline{ab}}$ — натуральное число, наугад выбирается одно. Найдите вероятность того, что оно нечётное.',
          pool: [16, 25, 36, 49, 64, 81],
          pred: (x) => x % 2 === 1,
          desc: 'Двузначные полные квадраты: $16, 25, 36, 49, 64, 81$ (всего $6$), из них нечётные — $25, 49, 81$ ($3$ числа)',
        },
        {
          stem: 'Из двузначных чисел, кратных $15$, наугад выбирается одно. Найдите вероятность того, что выбранное число чётное.',
          pool: [15, 30, 45, 60, 75, 90],
          pred: (x) => x % 2 === 0,
          desc: 'Двузначные числа, кратные $15$: $15, 30, 45, 60, 75, 90$ (всего $6$), из них чётные — $30, 60, 90$ ($3$ числа)',
        },
        {
          stem: 'Из двузначных чисел, кратных $12$, наугад выбирается одно. Найдите вероятность того, что сумма его цифр больше $7$.',
          pool: [12, 24, 36, 48, 60, 72, 84, 96],
          pred: (x) => (Math.floor(x / 10) + (x % 10)) > 7,
          desc: 'Двузначные числа, кратные $12$: $12, 24, 36, 48, 60, 72, 84, 96$ (всего $8$), сумма цифр больше $7$ у $5$ чисел ($36, 48, 72, 84, 96$)',
        },
        {
          stem: 'Из натуральных чисел от $1$ до $20$ включительно наугад выбирается одно. Найдите вероятность того, что оно кратно $4$.',
          pool: Array.from({ length: 20 }, (_, i) => i + 1),
          pred: (x) => x % 4 === 0,
          desc: 'Всего в наборе $20$ чисел, из них кратны $4$ числа $4, 8, 12, 16, 20$ ($5$ чисел)',
        },
        {
          stem: 'Из натуральных чисел от $1$ до $25$ включительно наугад выбирается одно. Найдите вероятность того, что оно оканчивается цифрой $5$.',
          pool: Array.from({ length: 25 }, (_, i) => i + 1),
          pred: (x) => x % 10 === 5,
          desc: 'Всего в наборе $25$ чисел, оканчиваются на $5$ числа $5, 15, 25$ ($3$ числа)',
        },
        {
          stem: 'На карточках записаны все целые числа от $10$ до $29$ включительно. Найдите вероятность того, что на наугад вытянутой карточке окажется число, кратное $5$.',
          pool: Array.from({ length: 20 }, (_, i) => i + 10),
          pred: (x) => x % 5 === 0,
          desc: 'Всего $20$ карточек, кратны $5$ числа $10, 15, 20, 25$ ($4$ числа)',
        },
        {
          stem: 'Из двузначных чисел, кратных $18$, наугад выбирается одно. Найдите вероятность того, что оно делится на $4$.',
          pool: [18, 36, 54, 72, 90],
          pred: (x) => x % 4 === 0,
          desc: 'Двузначные числа, кратные $18$: $18, 36, 54, 72, 90$ (всего $5$), на $4$ делятся $36$ и $72$ ($2$ числа)',
        },
        {
          stem: 'Бросают игральный кубик и монету. Какова вероятность того, что на кубике выпадет чётное число, а на монете — орёл?',
          pool: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
          pred: (x) => x <= 3,
          desc: 'Всего равновозможных исходов $6 \\cdot 2 = 12$, благоприятных — $3 \\cdot 1 = 3$',
        },
        {
          stem: 'В коробке $7$ красных, $5$ синих и $8$ зелёных шаров. Наугад достают один шар. Найдите вероятность того, что он синий.',
          pool: Array.from({ length: 20 }, (_, i) => i + 1),
          pred: (x) => x <= 5,
          desc: 'Всего в коробке $7 + 5 + 8 = 20$ шаров, из них синих — $5$',
        },
        {
          stem: 'Из всех двузначных чисел, делящихся на $10$, наугад выбирается одно. Найдите вероятность того, что оно делится на $3$.',
          pool: [10, 20, 30, 40, 50, 60, 70, 80, 90],
          pred: (x) => x % 3 === 0,
          desc: 'Всего $9$ чисел ($10, 20, \\dots, 90$), на $3$ делятся $30, 60, 90$ ($3$ числа)',
        },
      ];

      // Add dynamic subset of parametrized range problems for even greater uniqueness across seeds
      const dynamicUse = difficulty >= 2 && rng.chance(0.5);
      if (dynamicUse) {
        const div = rng.pick([3, 4, 5, 6]);
        const nTotal = rng.pick([10, 20, 25, 40, 50]);
        const start = rng.int(1, 15);
        const pool = Array.from({ length: nTotal }, (_, i) => start + i);
        const fav = pool.filter((x) => x % div === 0);
        const prob = cleanNum(fav.length / nTotal);
        return {
          points: 1,
          difficulty,
          stem: `Из натуральных чисел от $${start}$ до $${start + nTotal - 1}$ включительно наугад выбирается одно. Найдите вероятность того, что оно делится на $${div}$.`,
          answer: fmtShortAns(prob),
          accept: numAccept(prob, [ `${fav.length}/${nTotal}` ]),
          hint: 'Подсчитайте общее количество чисел в отрезке и число кратных среди них.',
          explanation:
            `Всего чисел в отрезке: $${start + nTotal - 1} - ${start} + 1 = ${nTotal}$. ` +
            `На $${div}$ делятся $${fav.length}$ из них (${fav.slice(0, 4).join(', ')}${fav.length > 4 ? ', \\dots' : ''}). ` +
            `Вероятность: $P = \\frac{${fav.length}}{${nTotal}} = ${fmtTexNum(prob)}$.`,
        };
      }

      const v = rng.pick(variants);
      const favCount = v.pool.filter(v.pred).length;
      const totCount = v.pool.length;
      // Only return exact decimal if finite; for 1/3 use fraction or accept both
      const g = gcd(favCount, totCount);
      const p = favCount / g, q = totCount / g;
      const isFiniteDec = (2 ** 6 * 5 ** 6) % q === 0;
      const ansStr = isFiniteDec ? fmtShortAns(cleanNum(p / q)) : `${p}/${q}`;
      const acc = isFiniteDec ? numAccept(cleanNum(p / q), [`${p}/${q}`]) : [`${favCount}/${totCount}`];

      return {
        points: 1,
        difficulty,
        stem: v.stem,
        answer: ansStr,
        accept: acc,
        hint: 'Выпишите все возможные исходы и найдите долю благоприятных.',
        explanation:
          `${v.desc}. ` +
          `Вероятность: $P = \\frac{${favCount}}{${totCount}} = ${isFiniteDec ? fmtTexNum(cleanNum(p / q)) : `\\frac{${p}}{${q}}`}$.`,
      };
    },
  },

  // 10. math.gcd-lcm (curriculum gap)
  {
    id: 'math.gcd-lcm',
    subject: 'math',
    title: 'НОД и НОК натуральных чисел',
    topic: TOPIC_NUM,
    format: 'single',
    weight: 0.9,
    generate(rng, { difficulty }) {
      const g = rng.int(3, difficulty === 3 ? 18 : 12);
      const coprimePairs = [[2, 3], [2, 5], [3, 4], [3, 5], [3, 7], [4, 5], [5, 6], [5, 7], [4, 7]];
      const [u, v] = rng.pick(coprimePairs);
      const a = g * u, b = g * v;
      const l = g * u * v;
      const askLcm = rng.chance(0.5);
      const ans = askLcm ? l : g;

      const candidates = [
        `$${askLcm ? g : l}$`,
        `$${a * b}$`,
        `$${g * (u + v)}$`,
        `$${u * v}$`,
        `$${ans + g}$`,
      ];

      const { options, answer } = buildMcqOptions(
        rng,
        `$${ans}$`,
        candidates,
        (s) => `$${ans + s * 3}$`
      );

      return {
        points: 1,
        difficulty,
        stem: askLcm
          ? `Найдите $\\text{НОК}(${a};\\ ${b})$.`
          : `Найдите $\\text{НОД}(${a};\\ ${b})$.`,
        options,
        answer,
        hint: 'Выделите наибольший общий делитель обоих чисел.',
        explanation:
          `$${a} = ${g} \\cdot ${u}$ и $${b} = ${g} \\cdot ${v}$, где $${u}$ и $${v}$ взаимно просты. ` +
          (askLcm
            ? `Поэтому $\\text{НОК}(${a};\\ ${b}) = ${g} \\cdot ${u} \\cdot ${v} = ${l}$.`
            : `Поэтому $\\text{НОД}(${a};\\ ${b}) = ${g}$.`),
      };
    },
  },

  // 11. math.statistics (curriculum gap)
  {
    id: 'math.statistics',
    subject: 'math',
    title: 'Статистика: среднее, медиана, мода, размах',
    topic: TOPIC_COMB,
    format: 'short',
    weight: 0.9,
    generate(rng, { difficulty }) {
      const n = difficulty === 1 ? 5 : 7;
      const modeVal = rng.int(6, 18);
      const uniqueOthers = [];
      while (uniqueOthers.length < n - 3) {
        const cand = rng.intExcept(2, 28, [modeVal, ...uniqueOthers]);
        uniqueOthers.push(cand);
      }
      const partialSum = uniqueOthers.reduce((s, x) => s + x, 0) + 2 * modeVal;
      const neededMod = (n - (partialSum % n)) % n;
      let lastVal = neededMod === 0 ? n : neededMod;
      if (lastVal < 3) lastVal += n;
      while (lastVal === modeVal || uniqueOthers.includes(lastVal)) {
        lastVal += n;
      }
      const arr = [...uniqueOthers, lastVal, modeVal, modeVal].sort((x, y) => x - y);

      const finalSum = arr.reduce((s, x) => s + x, 0);
      const mean = finalSum / n;
      const median = arr[(n - 1) / 2];
      const range = arr[n - 1] - arr[0];
      const shuffled = rng.shuffle(arr);

      const qType = rng.pick(['mean', 'median', 'mode', 'range']);
      const qMap = {
        mean: { label: 'среднее арифметическое', ans: mean, exp: `Сумма элементов равна $${finalSum}$, среднее арифметическое: $\\frac{${finalSum}}{${n}} = ${mean}$.` },
        median: { label: 'медиану', ans: median, exp: `Упорядочим ряд по возрастанию: $${arr.join(';\\ ')}$. Центральный элемент (медиана) равен $${median}$.` },
        mode: { label: 'моду', ans: modeVal, exp: `Чаще всего в ряду встречается число $${modeVal}$ (два раза), значит мода равна $${modeVal}$.` },
        range: { label: 'размах', ans: range, exp: `Наибольший элемент $${arr[n - 1]}$, наименьший $${arr[0]}$, размах равен $${arr[n - 1]} - ${arr[0]} = ${range}$.` },
      };
      const q = qMap[qType];

      return {
        points: 1,
        difficulty,
        stem: `Дан числовой ряд: $${shuffled.join(';\\ ')}$. Найдите ${q.label} этого ряда.`,
        answer: String(q.ans),
        hint: 'Для медианы и размаха удобно сначала упорядочить числа по возрастанию.',
        explanation: q.exp,
      };
    },
  },
];
