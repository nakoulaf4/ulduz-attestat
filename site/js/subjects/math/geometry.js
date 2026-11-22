import {
  gcd, cleanNum, fmtRu, fmtTexNum, fmtShortAns, numAccept, buildMcqOptions,
} from './helpers.js';
import {
  svgTriSimilarity, svgInscribedAngles, svgConeAngle, svgConeRotation,
  svgBisectorArea, svgTrapezoid, svgRightTriTrig, svgTangentSecant, svgShipsSimilarity,
} from './svg.js';

const TOPIC_PLAN = 'Планиметрия';
const TOPIC_STEREO = 'Стереометрия';
const TOPIC_VEC = 'Векторы';

function simplifySqrt(n) {
  let out = 1, rem = n;
  for (let d = 2; d * d <= rem; d++) {
    while (rem % (d * d) === 0) {
      out *= d;
      rem /= d * d;
    }
  }
  if (rem === 1) return String(out);
  return out === 1 ? `\\sqrt{${rem}}` : `${out}\\sqrt{${rem}}`;
}

export const geometryTypes = [
  // 38. math.parallel-angles (0903 #82)
  {
    id: 'math.parallel-angles',
    subject: 'math',
    title: 'Углы с соответственно параллельными сторонами',
    topic: TOPIC_PLAN,
    format: 'short',
    weight: 1,
    generate(rng, { difficulty }) {
      const configs = [
        { p: 20, q: 20, alpha: 108, beta: 72 },
        { p: 10, q: 35, alpha: 108, beta: 72 },
        { p: 30, q: 5, alpha: 108, beta: 72 },
        { p: 25, q: 50, alpha: 120, beta: 60 },
        { p: 40, q: 20, alpha: 120, beta: 60 },
        { p: 30, q: 40, alpha: 120, beta: 60 },
        { p: 10, q: 10, alpha: 99, beta: 81 },
        { p: 12, q: 10, alpha: 100, beta: 80 },
        { p: 10, q: 26, alpha: 105, beta: 75 },
        { p: 40, q: 40, alpha: 126, beta: 54 },
        { p: 30, q: 10, alpha: 110, beta: 70 },
        { p: 50, q: 30, alpha: 130, beta: 50 },
        { p: 50, q: 50, alpha: 135, beta: 45 },
      ];
      const cfg = rng.pick(configs);
      const { p, q, alpha, beta } = cfg;
      const gVal = cleanNum((alpha * (100 - p)) / 100);

      return {
        points: 2,
        difficulty,
        stem:
          `$\\alpha$ и $\\beta$ — разноимённые углы с соответственно параллельными сторонами, а $\\gamma$ и $\\varphi$ — одноимённые углы с соответственно параллельными сторонами. ` +
          `Градусная мера $\\gamma$ на $${p}\\%$ меньше $\\alpha$, а градусная мера $\\varphi$ на $${q}\\%$ больше $\\beta$. ` +
          `Найдите градусные меры $\\alpha$ и $\\beta$ (введите через точку с запятой, например: 108; 72).`,
        answer: `${alpha}; ${beta}`,
        accept: [`${alpha}°; ${beta}°`, `${alpha}, ${beta}`],
        hint: 'Разноимённые углы с параллельными сторонами в сумме дают $180^\\circ$, а одноимённые равны.',
        explanation:
          `Так как $\\alpha$ и $\\beta$ разноимённые, $\\alpha + \\beta = 180^\\circ$. ` +
          `Так как $\\gamma$ и $\\varphi$ одноимённые, $\\gamma = \\varphi$. ` +
          `По условию $\\gamma = ${fmtTexNum((100 - p) / 100)}\\alpha$ и $\\varphi = ${fmtTexNum((100 + q) / 100)}\\beta$, откуда ` +
          `$${fmtTexNum((100 - p) / 100)}\\alpha = ${fmtTexNum((100 + q) / 100)}\\beta$ ` +
          `($\\gamma = \\varphi = ${fmtTexNum(gVal)}^\\circ$). ` +
          `Решая совместно с $\\alpha + \\beta = 180^\\circ$, находим $\\alpha = ${alpha}^\\circ$ и $\\beta = ${beta}^\\circ$.`,
      };
    },
  },

  // 39. math.right-tri-trig (1503 #72)
  {
    id: 'math.right-tri-trig',
    subject: 'math',
    title: 'Тригонометрические соотношения в прямоугольном треугольнике',
    topic: TOPIC_PLAN,
    format: 'single',
    weight: 1,
    generate(rng, { difficulty }) {
      // α at B (adj=a, opp=b, hyp=c), β at A (adj=b, opp=a, hyp=c)
      const defs = {
        '\\sin\\alpha': { num: 'b', den: 'c' },
        '\\cos\\alpha': { num: 'a', den: 'c' },
        '\\operatorname{tg}\\alpha': { num: 'b', den: 'a' },
        '\\operatorname{ctg}\\alpha': { num: 'a', den: 'b' },
        '\\sin\\beta': { num: 'a', den: 'c' },
        '\\cos\\beta': { num: 'b', den: 'c' },
        '\\operatorname{tg}\\beta': { num: 'a', den: 'b' },
        '\\operatorname{ctg}\\beta': { num: 'b', den: 'a' },
      };

      const combos = [
        ['\\cos\\alpha', '\\operatorname{tg}\\beta', '\\frac{a^2}{bc}', ['\\frac{bc}{a^2}', '\\frac{ac}{b^2}', '\\frac{ab}{c^2}', '\\frac{a}{bc}']],
        ['\\sin\\alpha', '\\operatorname{ctg}\\beta', '\\frac{b^2}{ac}', ['\\frac{ac}{b^2}', '\\frac{a^2}{bc}', '\\frac{ab}{c^2}', '\\frac{b}{ac}']],
        ['\\sin\\beta', '\\operatorname{ctg}\\alpha', '\\frac{a^2}{bc}', ['\\frac{bc}{a^2}', '\\frac{b^2}{ac}', '\\frac{ab}{c^2}', '\\frac{a}{bc}']],
        ['\\cos\\beta', '\\operatorname{tg}\\alpha', '\\frac{b^2}{ac}', ['\\frac{ac}{b^2}', '\\frac{a^2}{bc}', '\\frac{ab}{c^2}', '\\frac{b}{ac}']],
        ['\\sin\\alpha', '\\cos\\beta', '\\frac{b^2}{c^2}', ['\\frac{a^2}{c^2}', '\\frac{ab}{c^2}', '\\frac{c^2}{b^2}', '\\frac{b}{c}']],
        ['\\cos\\alpha', '\\sin\\beta', '\\frac{a^2}{c^2}', ['\\frac{b^2}{c^2}', '\\frac{ab}{c^2}', '\\frac{c^2}{a^2}', '\\frac{a}{c}']],
        ['\\sin\\alpha', '\\cos\\alpha', '\\frac{ab}{c^2}', ['\\frac{a^2}{c^2}', '\\frac{b^2}{c^2}', '\\frac{c^2}{ab}', '\\frac{a}{b}']],
        ['\\operatorname{tg}\\alpha', '\\sin\\beta', '\\frac{ab}{ac}', null], // cancels a -> b/c, handle cleanly below:
      ];

      const validCombos = combos.filter((x) => x[3] !== null);
      // Add more non-cancelling combos with division or product:
      validCombos.push(
        ['\\cos\\alpha', '\\cos\\beta', '\\frac{ab}{c^2}', ['\\frac{a^2}{c^2}', '\\frac{b^2}{c^2}', '\\frac{c^2}{ab}', '\\frac{a}{b}']],
        ['\\sin\\alpha', '\\sin\\beta', '\\frac{ab}{c^2}', ['\\frac{a^2}{bc}', '\\frac{b^2}{ac}', '\\frac{c^2}{ab}', '\\frac{a+b}{c}']],
        ['\\operatorname{tg}\\alpha', '\\operatorname{ctg}\\beta', '\\frac{b^2}{a^2}', ['\\frac{a^2}{b^2}', '\\frac{ab}{c^2}', '1', '\\frac{b}{a}']],
        ['\\operatorname{ctg}\\alpha', '\\operatorname{tg}\\beta', '\\frac{a^2}{b^2}', ['\\frac{b^2}{a^2}', '\\frac{ab}{c^2}', '1', '\\frac{a}{b}']]
      );

      const [f1, f2, ansTex, wrongs] = rng.pick(validCombos);
      const d1 = defs[f1], d2 = defs[f2];
      const { options, answer } = buildMcqOptions(
        rng,
        `$${ansTex}$`,
        wrongs.map((w) => `$${w}$`)
      );

      return {
        points: 1,
        difficulty,
        stem: `В прямоугольном треугольнике $ABC$ ($\\angle C = 90^\\circ$) выразите $${f1} \\cdot ${f2}$ через $a, b, c$ (см. рисунок).`,
        image: {
          svg: svgRightTriTrig(),
          alt: 'Прямоугольный треугольник ABC с прямым углом C, катетами a=BC, b=AC, гипотенузой c=AB и острыми углами α при B и β при A',
        },
        options,
        answer,
        hint: 'Выпишите определения $\\sin, \\cos, \\operatorname{tg}, \\operatorname{ctg}$ через противолежащий и прилежащий катеты и гипотенузу.',
        explanation:
          `По рисунку $${f1} = \\frac{${d1.num}}{${d1.den}}$ и $${f2} = \\frac{${d2.num}}{${d2.den}}$. ` +
          `Перемножая, получаем $${f1} \\cdot ${f2} = \\frac{${d1.num}}{${d1.den}} \\cdot \\frac{${d2.num}}{${d2.den}} = ${ansTex}$.`,
      };
    },
  },

  // 40. math.tri-similarity (0903 #62)
  {
    id: 'math.tri-similarity',
    subject: 'math',
    title: 'Подобие треугольников ($MN \\parallel AC$)',
    topic: TOPIC_PLAN,
    format: 'single',
    weight: 1,
    generate(rng, { difficulty }) {
      const bn = rng.int(4, 15);
      let nc = rng.int(5, 20);
      if (nc === bn) nc++;
      const bc = bn + nc;
      const stepAc = bc / gcd(bc, difficulty === 1 ? 1 : 10);
      let k = rng.int(1, 5);
      while (stepAc * k < 10) k++;
      const ac = stepAc * k;
      const mn = cleanNum((ac * bn) / bc);

      const wrong1 = cleanNum((ac * bn) / nc);
      const wrong2 = cleanNum((ac * nc) / bc);
      const candidates = [
        `$${fmtTexNum(wrong2)}\\text{ см}$`,
        `$${fmtTexNum(cleanNum(ac / 2))}\\text{ см}$`,
        `$${fmtTexNum(cleanNum(mn + 1.6))}\\text{ см}$`,
        `$${fmtTexNum(cleanNum(Math.max(1, mn - 1.2)))}\\text{ см}$`,
      ];
      if (Math.round(wrong1 * 10) === wrong1 * 10) {
        candidates.unshift(`$${fmtTexNum(wrong1)}\\text{ см}$`);
      }

      const { options, answer } = buildMcqOptions(
        rng,
        `$${fmtTexNum(mn)}\\text{ см}$`,
        candidates,
        (s) => `$${fmtTexNum(cleanNum(mn + s * 2))}\\text{ см}$`
      );

      return {
        points: 1,
        difficulty,
        stem: `В треугольнике $ABC$ отрезок $MN \\parallel AC$, $AC = ${ac}$ см, $BN = ${bn}$ см и $NC = ${nc}$ см. Найдите $MN$.`,
        image: {
          svg: svgTriSimilarity(),
          alt: 'Треугольник ABC с отрезком MN, параллельным основанию AC (M на AB, N на BC)',
        },
        options,
        answer,
        hint: 'Треугольники $MBN$ и $ABC$ подобны; не забудьте, что $BC = BN + NC$.',
        explanation:
          `Так как $MN \\parallel AC$, треугольники $MBN$ и $ABC$ подобны. ` +
          `Сторона $BC = BN + NC = ${bn} + ${nc} = ${bc}$ см. ` +
          `Из подобия $\\frac{MN}{AC} = \\frac{BN}{BC} \\Rightarrow \\frac{MN}{${ac}} = \\frac{${bn}}{${bc}}$, ` +
          `откуда $MN = ${fmtTexNum(mn)}$ см.`,
      };
    },
  },

  // 41. math.ships-similarity (1503 #83)
  {
    id: 'math.ships-similarity',
    subject: 'math',
    title: 'Подобие прямоугольных треугольников и теорема Пифагора',
    topic: TOPIC_PLAN,
    format: 'short',
    weight: 1,
    generate(rng, { difficulty }) {
      const base = rng.pick([[3, 4, 5], [5, 12, 13]]);
      const scale = rng.int(2, 4);
      const de = base[0] * scale;
      const be = base[1] * scale;
      const bd = base[2] * scale;

      const validAds = [];
      for (let ad = 3; ad <= 36; ad++) {
        if (ad === be) continue;
        if ((10 * ad * bd) % (ad + be) === 0) validAds.push(ad);
      }
      const ad = rng.pick(validAds);
      const cd = cleanNum((ad * bd) / (ad + be));

      return {
        points: 2,
        difficulty,
        stem:
          `Два катера в точках $A$ и $B$ движутся по прямым $AE$ и $BD$, пересекающимся в точке $C$ ` +
          `(прямая $DE$ перпендикулярна отрезкам $AD$ и $BE$). Известно, что $DE = ${de}$ км, $BD = ${bd}$ км и $AD = ${ad}$ км. ` +
          `Найдите расстояние от точки пересечения $C$ до точки $D$ (в км).`,
        image: {
          svg: svgShipsSimilarity(),
          alt: 'Прямоугольные треугольники ADC и EBC с прямыми углами при D и E и пересечением траекторий AE и BD в точке C',
        },
        answer: fmtShortAns(cd),
        accept: numAccept(cd, [`${fmtRu(cd)} км`]),
        hint: 'Найдите $BE$ по теореме Пифагора из $\\triangle BED$, затем используйте подобие $\\triangle ADC \\sim \\triangle EBC$.',
        explanation:
          `Из прямоугольного $\\triangle BED$: $BE = \\sqrt{BD^2 - DE^2} = \\sqrt{${bd}^2 - ${de}^2} = ${be}$ км. ` +
          `Треугольники $ADC$ и $EBC$ подобны по двум углам (прямые углы при $D, E$ и вертикальные при $C$). ` +
          `Пусть $CD = x$, тогда $BC = ${bd} - x$, и $\\frac{${ad}}{${be}} = \\frac{x}{${bd} - x} \\Rightarrow ` +
          `${be}x = ${ad * bd} - ${ad}x \\Rightarrow ${ad + be}x = ${ad * bd} \\Rightarrow x = ${fmtTexNum(cd)}$ км.`,
      };
    },
  },

  // 42. math.bisector-area (0903 #83)
  {
    id: 'math.bisector-area',
    subject: 'math',
    title: 'Свойство биссектрисы и площадь треугольника',
    topic: TOPIC_PLAN,
    format: 'short',
    weight: 1,
    generate(rng, { difficulty }) {
      const candidates = [];
      const cds = [1.5, 2, 2.4, 2.5, 3, 3.2, 3.6, 4];
      for (const cd of cds) {
        for (let ab = 6; ab <= 16; ab += 0.5) {
          if (ab <= 2.6 * cd) continue;
          const area = cleanNum(0.5 * cd * ab);
          // keep clean decimal with <= 2 decimal digits
          if (Math.round(area * 100) === cleanNum(area * 100)) {
            candidates.push({ cd, ab, area });
          }
        }
      }
      const { cd, ab, area } = rng.pick(candidates);

      return {
        points: 2,
        difficulty,
        stem:
          `В прямоугольном треугольнике $ABC$ ($\\angle C = 90^\\circ$) проведена биссектриса $AD$. ` +
          `Известно, что $CD = ${fmtTexNum(cd)}$ см и $AB = ${fmtTexNum(ab)}$ см. Найдите площадь треугольника $ABD$ (в см$^2$).`,
        image: {
          svg: svgBisectorArea({ cd: fmtRu(cd), ab: fmtRu(ab) }),
          alt: `Прямоугольный треугольник ABC с прямым углом C, биссектрисой AD, CD = ${fmtRu(cd)} и AB = ${fmtRu(ab)}`,
        },
        answer: fmtShortAns(area),
        accept: numAccept(area),
        hint: 'Не ищите катеты по отдельности: выразите произведение $AC \\cdot BD$ через свойство биссектрисы.',
        explanation:
          `Обозначим $AC = b$ и $BD = a$. По свойству биссектрисы треугольника $\\frac{AC}{CD} = \\frac{AB}{BD}$, то есть ` +
          `$\\frac{b}{${fmtTexNum(cd)}} = \\frac{${fmtTexNum(ab)}}{a} \\Rightarrow ab = ${fmtTexNum(cd)} \\cdot ${fmtTexNum(ab)}$. ` +
          `В треугольнике $ABD$ высота к стороне $BD$ совпадает с катетом $AC = b$, значит ` +
          `$S_{\\triangle ABD} = \\frac{1}{2} ab = \\frac{1}{2} \\cdot ${fmtTexNum(cd)} \\cdot ${fmtTexNum(ab)} = ${fmtTexNum(area)}$ см$^2$.`,
      };
    },
  },

  // 43. math.rect-perimeter (0903 #71)
  {
    id: 'math.rect-perimeter',
    subject: 'math',
    title: 'Периметр прямоугольника (буквенное выражение)',
    topic: TOPIC_PLAN,
    format: 'single',
    weight: 1,
    generate(rng, { difficulty }) {
      const a = rng.int(12, 60);
      const v = rng.pick(['k', 'x', 'm']);
      const extra = difficulty === 3 ? rng.int(2, 8) : 0;
      const sumConst = a + extra;
      const lenTex = extra === 0 ? v : `${v} + ${extra}`;
      const correct = `$P = 2(${sumConst} + ${v})$`;

      const { options, answer } = buildMcqOptions(
        rng,
        correct,
        [
          `$P = 2(${sumConst} + 2${v})$`,
          `$P = 2(${Math.floor(sumConst / 2)} + ${v})$`,
          `$P = 2(${sumConst * 2} + 2${v})$`,
          `$P = ${sumConst} + ${v}$`,
          `$P = 2(${sumConst + 4} + ${v})$`,
        ],
        (s) => `$P = 2(${sumConst + s * 3} + ${v})$`
      );

      return {
        points: 1,
        difficulty,
        stem: `Найдите периметр прямоугольника с шириной $${a}$ и длиной $${lenTex}$.`,
        options,
        answer,
        hint: 'Периметр прямоугольника со сторонами $a$ и $b$ равен $P = 2(a + b)$.',
        explanation:
          `По формуле периметра прямоугольника $P = 2(a + b)$ получаем ` +
          `$P = 2(${a} + ${lenTex}) = 2(${sumConst} + ${v})$.`,
      };
    },
  },

  // 44. math.polygon-diagonals (1503 #69)
  {
    id: 'math.polygon-diagonals',
    subject: 'math',
    title: 'Диагонали и углы многоугольников',
    topic: TOPIC_PLAN,
    format: 'single',
    weight: 1,
    generate(rng, { difficulty }) {
      const names = {
        4: 'четырёхугольника',
        5: 'пятиугольника',
        6: 'шестиугольника',
        7: 'семиугольника',
        8: 'восьмиугольника',
        9: 'девятиугольника',
        10: 'десятиугольника',
        12: 'двенадцатиугольника',
      };
      const ns = difficulty === 1 ? [4, 5, 6] : [4, 5, 6, 7, 8, 9, 10, 12];
      const n = rng.pick(ns);
      const diag = (n * (n - 3)) / 2;

      const askAngles = difficulty >= 2 && rng.chance(0.4);
      if (askAngles) {
        const angSum = 180 * (n - 2);
        const { options, answer } = buildMcqOptions(
          rng,
          `$${angSum}^\\circ$`,
          [
            `$${180 * n}^\\circ$`,
            `$${180 * (n - 1)}^\\circ$`,
            `$${180 * Math.max(1, n - 3)}^\\circ$`,
            `$${90 * (n - 2)}^\\circ$`,
          ],
          (s) => `$${angSum + s * 180}^\\circ$`
        );
        return {
          points: 1,
          difficulty,
          stem: `Найдите сумму внутренних углов выпуклого ${names[n]}.`,
          options,
          answer,
          hint: 'Сумма внутренних углов выпуклого $n$-угольника равна $180^\\circ(n - 2)$.',
          explanation: `Подставляя $n = ${n}$ в формулу $180^\\circ(n - 2)$, получаем $180^\\circ \\cdot ${n - 2} = ${angSum}^\\circ$.`,
        };
      }

      const { options, answer } = buildMcqOptions(
        rng,
        `$${diag}$`,
        [
          `$${n * (n - 3)}$`,
          `$${(n * (n - 1)) / 2}$`,
          `$${n - 3}$`,
          `$${n}$`,
          `$${diag + 2}$`,
          `$${diag + 3}$`,
        ],
        (s) => `$${diag + s + 3}$`
      );

      return {
        points: 1,
        difficulty,
        stem: `Найдите число диагоналей выпуклого ${names[n]}.`,
        options,
        answer,
        hint: 'Число диагоналей $n$-угольника вычисляется по формуле $\\frac{n(n - 3)}{2}$.',
        explanation:
          `Для $n = ${n}$ число диагоналей равно $\\frac{${n}(${n} - 3)}{2} = ${diag}$.`,
      };
    },
  },

  // 45. math.trapezoid-area (1503 #63)
  {
    id: 'math.trapezoid-area',
    subject: 'math',
    title: 'Площадь трапеции по рисунку',
    topic: TOPIC_PLAN,
    format: 'single',
    weight: 1,
    generate(rng, { difficulty }) {
      const a = rng.int(2, 10);
      const b = a + rng.int(2, 10);
      let h = rng.int(4, 15);
      if (((a + b) * h) % 2 !== 0) h++;
      const area = ((a + b) * h) / 2;

      const { options, answer } = buildMcqOptions(
        rng,
        `$${area}$`,
        [
          `$${(a + b) * h}$`,
          `$${cleanNum((a * b * h) / 2)}$`,
          `$${a + b + h}$`,
          `$${a * h}$`,
          `$${area + 4}$`,
        ],
        (s) => `$${area + s * 5}$`
      );

      return {
        points: 1,
        difficulty,
        stem: 'Найдите площадь прямоугольной трапеции по данным на рисунке.',
        image: {
          svg: svgTrapezoid({ top: String(a), bottom: String(b), height: String(h) }),
          alt: `Прямоугольная трапеция с верхним основанием ${a}, нижним основанием ${b} и высотой ${h}`,
        },
        options,
        answer,
        hint: 'Площадь трапеции равна произведению полусуммы оснований на высоту.',
        explanation:
          `По формуле площади трапеции $S = \\frac{a + b}{2} \\cdot h = \\frac{${a} + ${b}}{2} \\cdot ${h} = ${area}$.`,
      };
    },
  },

  // 46. math.circle-inscribed-angles (0903 #67)
  {
    id: 'math.circle-inscribed-angles',
    subject: 'math',
    title: 'Вписанные и центральные углы окружности',
    topic: TOPIC_PLAN,
    format: 'single',
    weight: 1,
    generate(rng, { difficulty }) {
      const beta = rng.int(4, 14) * 5; // 20..70
      const useCentral = difficulty >= 2 && rng.chance(0.45);

      if (useCentral) {
        const central = 2 * beta;
        const { options, answer } = buildMcqOptions(
          rng,
          `$${central}^\\circ$`,
          [
            `$${beta}^\\circ$`,
            `$${Math.round(beta / 2)}^\\circ$`,
            `$${180 - beta}^\\circ$`,
            `$${central + 10}^\\circ$`,
            `$${Math.max(10, central - 10)}^\\circ$`,
          ],
          (s) => `$${central + s * 15}^\\circ$`
        );
        return {
          points: 1,
          difficulty,
          stem: `Найдите центральный угол $\\alpha$ по данным на рисунке ($O$ — центр окружности).`,
          image: {
            svg: svgInscribedAngles({ givenAngle: `${beta}°`, targetLabel: 'α', mode: 'central' }),
            alt: `Окружность с центром O, вписанным углом ${beta}° и центральным углом α, опирающимися на одну дугу`,
          },
          options,
          answer,
          hint: 'Центральный угол вдвое больше вписанного угла, опирающегося на ту же дугу.',
          explanation:
            `Вписанный угол $${beta}^\\circ$ и центральный угол $\\alpha$ опираются на одну и ту же дугу, поэтому $\\alpha = 2 \\cdot ${beta}^\\circ = ${central}^\\circ$.`,
        };
      }

      const { options, answer } = buildMcqOptions(
        rng,
        `$${beta}^\\circ$`,
        [
          `$${Math.round(beta / 2)}^\\circ$`,
          `$${2 * beta}^\\circ$`,
          `$${90 - beta}^\\circ$`,
          `$${beta + 10}^\\circ$`,
          `$${beta - 10}^\\circ$`,
        ],
        (s) => `$${beta + s * 5}^\\circ$`
      );

      return {
        points: 1,
        difficulty,
        stem: 'Найдите угол $\\alpha$ по данным на рисунке ($O$ — центр окружности).',
        image: {
          svg: svgInscribedAngles({ givenAngle: `${beta}°`, targetLabel: 'α', mode: 'inscribed-pair' }),
          alt: `Окружность с центром O и двумя вписанными углами ${beta}° и α, опирающимися на одну дугу`,
        },
        options,
        answer,
        hint: 'Вписанные углы, опирающиеся на одну и ту же дугу, равны.',
        explanation:
          `Так как оба вписанных угла опираются на одну и ту же дугу, они равны: $\\alpha = ${beta}^\\circ$.`,
      };
    },
  },

  // 47. math.circle-tangent-secant (1503 #82)
  {
    id: 'math.circle-tangent-secant',
    subject: 'math',
    title: 'Касательная, секущая и радиус окружности',
    topic: TOPIC_PLAN,
    format: 'short',
    weight: 1,
    generate(rng, { difficulty }) {
      const ac = rng.int(1, 5);
      const m = rng.int(1, 5); // MD = m, so CD = 2*m
      const cd = 2 * m;
      const ab2 = ac * (ac + cd);
      const R = ac + m; // Exact identity when ∠BAD = 90°!
      const abTex = simplifySqrt(ab2);

      return {
        points: 2,
        difficulty,
        stem:
          `Из внешней точки $A$ к окружности проведены касательная $AB$ и секущая $AD$ (пересекает окружность в точках $C$ и $D$). ` +
          `Известно, что $\\angle BAD = 90^\\circ$, $AB = ${abTex}$ см и $AC = ${ac}$ см. Найдите радиус окружности (в см).`,
        image: {
          svg: svgTangentSecant(),
          alt: 'Окружность с центром O, касательной AB и секущей AD (C и D на окружности), угол BAD прямой',
        },
        answer: String(R),
        accept: [`${R} см`],
        hint: 'Примените теорему о квадрате касательной $AB^2 = AC \\cdot AD$, а затем опустите перпендикуляр $OM$ из центра на хорду $CD$.',
        explanation:
          `По теореме о касательной и секущей $AB^2 = AC \\cdot AD \\Rightarrow ${ab2} = ${ac} \\cdot (${ac} + CD) \\Rightarrow CD = ${cd}$ см. ` +
          `Опустим перпендикуляр $OM \\perp CD$: хорда делится пополам, $CM = MD = ${m}$ см. ` +
          `Так как $\\angle BAD = \\angle OBA = \\angle OMA = 90^\\circ$, четырёхугольник $OBAM$ — прямоугольник, значит $OM = AB = ${abTex}$ и $AM = OB = R$. ` +
          `Тогда $MC = R - ${ac}$, и из $\\triangle OMC$ по теореме Пифагора: $R^2 = ${ab2} + (R - ${ac})^2 \\Rightarrow ${2 * ac}R = ${ab2 + ac * ac} \\Rightarrow R = ${R}$ см.`,
      };
    },
  },

  // 48. math.prism-base (0903 #63)
  {
    id: 'math.prism-base',
    subject: 'math',
    title: 'Объём призмы и площадь основания',
    topic: TOPIC_STEREO,
    format: 'single',
    weight: 1,
    generate(rng, { difficulty }) {
      const sBase = rng.int(8, 32);
      const h = rng.int(4, 14);
      const V = sBase * h;
      const askVol = rng.chance(0.35);

      if (askVol) {
        const { options, answer } = buildMcqOptions(
          rng,
          `$${V}\\text{ см}^3$`,
          [
            `$${Math.round(V / 3)}\\text{ см}^3$`,
            `$${V * 2}\\text{ см}^3$`,
            `$${sBase * (h + 2)}\\text{ см}^3$`,
            `$${(sBase + 3) * h}\\text{ см}^3$`,
          ],
          (s) => `$${V + s * 10}\\text{ см}^3$`
        );
        return {
          points: 1,
          difficulty,
          stem: `Площадь основания призмы равна $${sBase}$ см$^2$, а её высота — $${h}$ см. Найдите объём призмы.`,
          options,
          answer,
          hint: 'Объём призмы равен $V = S_{\\text{осн}} \\cdot h$.',
          explanation: `$V = S_{\\text{осн}} \\cdot h = ${sBase} \\cdot ${h} = ${V}$ см$^3$.`,
        };
      }

      const { options, answer } = buildMcqOptions(
        rng,
        `$${sBase}\\text{ см}^2$`,
        [
          `$${sBase * 3}\\text{ см}^2$`,
          `$${sBase + 4}\\text{ см}^2$`,
          `$${Math.max(2, sBase - 3)}\\text{ см}^2$`,
          `$${sBase + 6}\\text{ см}^2$`,
        ],
        (s) => `$${sBase + s + 6}\\text{ см}^2$`
      );

      return {
        points: 1,
        difficulty,
        stem: `Объём призмы равен $${V}$ см$^3$, а её высота — $${h}$ см. Найдите площадь основания призмы.`,
        options,
        answer,
        hint: 'Используйте формулу объёма призмы $V = S_{\\text{осн}} \\cdot h$.',
        explanation: `Так как $V = S_{\\text{осн}} \\cdot h$, имеем $S_{\\text{осн}} = \\frac{${V}}{${h}} = ${sBase}$ см$^2$.`,
      };
    },
  },

  // 49. math.prism-lateral (1503 #74)
  {
    id: 'math.prism-lateral',
    subject: 'math',
    title: 'Боковая поверхность прямой призмы',
    topic: TOPIC_STEREO,
    format: 'short',
    weight: 1,
    generate(rng, { difficulty }) {
      const P = rng.int(10, 42);
      const H = rng.int(4, 18);
      const S = P * H;
      return {
        points: 1,
        difficulty,
        stem: `Периметр основания прямой призмы равен $${P}$, а боковое ребро — $${H}$. Найдите площадь боковой поверхности призмы.`,
        answer: String(S),
        hint: 'Площадь боковой поверхности прямой призмы равна $S_{\\text{бок}} = P_{\\text{осн}} \\cdot H$.',
        explanation: `По формуле $S_{\\text{бок}} = P_{\\text{осн}} \\cdot H = ${P} \\cdot ${H} = ${S}$.`,
      };
    },
  },

  // 50. math.cone-angle (0903 #76)
  {
    id: 'math.cone-angle',
    subject: 'math',
    title: 'Конус: образующая и угол с основанием',
    topic: TOPIC_STEREO,
    format: 'short',
    weight: 1,
    generate(rng, { difficulty }) {
      const mode = rng.pick(['30-R', '30-H', '60-H', '60-R', '45-R']);
      let lTex, ang, target, ans, exp;
      if (mode === '30-R') {
        const k = rng.int(2, 12) * 2; // even so k/2 is integer
        lTex = `${k}\\sqrt{3}`;
        ang = '30°';
        target = 'радиус основания';
        ans = (k / 2) * 3;
        exp = `R = l\\cos 30^\\circ = ${lTex} \\cdot \\frac{\\sqrt{3}}{2} = ${ans}`;
      } else if (mode === '30-H') {
        const k = rng.int(2, 14);
        lTex = String(2 * k);
        ang = '30°';
        target = 'высоту';
        ans = k;
        exp = `H = l\\sin 30^\\circ = ${2 * k} \\cdot \\frac{1}{2} = ${k}`;
      } else if (mode === '60-H') {
        const k = rng.int(2, 12) * 2;
        lTex = `${k}\\sqrt{3}`;
        ang = '60°';
        target = 'высоту';
        ans = (k / 2) * 3;
        exp = `H = l\\sin 60^\\circ = ${lTex} \\cdot \\frac{\\sqrt{3}}{2} = ${ans}`;
      } else if (mode === '60-R') {
        const k = rng.int(2, 14);
        lTex = String(2 * k);
        ang = '60°';
        target = 'радиус основания';
        ans = k;
        exp = `R = l\\cos 60^\\circ = ${2 * k} \\cdot \\frac{1}{2} = ${k}`;
      } else {
        const k = rng.int(3, 16);
        lTex = `${k}\\sqrt{2}`;
        ang = '45°';
        target = rng.chance(0.5) ? 'радиус основания' : 'высоту';
        ans = k;
        exp = `${target === 'высоту' ? 'H' : 'R'} = l\\sin 45^\\circ = ${lTex} \\cdot \\frac{\\sqrt{2}}{2} = ${k}`;
      }

      return {
        points: 1,
        difficulty,
        stem: `Образующая конуса равна $${lTex}$ и наклонена к плоскости основания под углом $${ang.replace('°', '^\\circ')}$. Найдите ${target} конуса.`,
        image: {
          svg: svgConeAngle({
            slant: lTex.replace('\\sqrt{', '√').replace('}', ''),
            angle: ang,
            radius: target === 'радиус основания' ? 'R' : '',
            height: target === 'высоту' ? 'H' : '',
          }),
          alt: `Осевое сечение конуса с образующей ${lTex} и углом ${ang} при основании`,
        },
        answer: String(ans),
        hint: 'Рассмотрите прямоугольный треугольник, образованный высотой, радиусом основания и образующей.',
        explanation: `В прямоугольном треугольнике осевого сечения $${exp}$.`,
      };
    },
  },

  // 51. math.cone-rotation (1503 #79)
  {
    id: 'math.cone-rotation',
    subject: 'math',
    title: 'Конус вращения: площадь боковой поверхности',
    topic: TOPIC_STEREO,
    format: 'short',
    weight: 1,
    generate(rng, { difficulty }) {
      const triples = [[3, 4, 5], [5, 12, 13], [8, 15, 17]];
      const [a0, b0, c0] = rng.pick(triples);
      const k = rng.int(1, 3);
      const a = a0 * k, b = b0 * k, c = c0 * k; // a < b < c

      const aroundLarger = rng.chance(0.6);
      const R = aroundLarger ? a : b;
      const H = aroundLarger ? b : a;
      const sOverPi = R * c;

      return {
        points: 2,
        difficulty,
        stem:
          `Прямоугольный треугольник с катетами $${a}$ см и $${b}$ см вращается вокруг ${aroundLarger ? 'большего' : 'меньшего'} катета. ` +
          `Найдите отношение $\\frac{S_{\\text{бок}}}{\\pi}$, где $S_{\\text{бок}}$ — площадь боковой поверхности полученного конуса (в см$^2$).`,
        image: {
          svg: svgConeRotation({ rLabel: `R = ${R}`, hLabel: `H = ${H}`, lLabel: 'l = ?' }),
          alt: `Конус вращения с радиусом ${R}, высотой ${H} и неизвестной образующей l`,
        },
        answer: String(sOverPi),
        hint: 'Образующая равна гипотенузе треугольника, а $S_{\\text{бок}} = \\pi R l$.',
        explanation:
          `При вращении вокруг ${aroundLarger ? 'большего' : 'меньшего'} катета получаем конус с высотой $H = ${H}$ см и радиусом основания $R = ${R}$ см. ` +
          `По теореме Пифагора образующая $l = \\sqrt{${R}^2 + ${H}^2} = ${c}$ см. ` +
          `Площадь боковой поверхности $S_{\\text{бок}} = \\pi R l = ${sOverPi}\\pi$ см$^2$, откуда $\\frac{S_{\\text{бок}}}{\\pi} = ${sOverPi}$.`,
      };
    },
  },

  // 52. math.vectors-2d (curriculum gap)
  {
    id: 'math.vectors-2d',
    subject: 'math',
    title: 'Векторы на плоскости: длина и скалярное произведение',
    topic: TOPIC_VEC,
    format: 'single',
    weight: 0.9,
    generate(rng, { difficulty }) {
      const mode = rng.chance(0.5) ? 'length' : 'dot';
      if (mode === 'length') {
        const triples = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17]];
        const [tx, ty, len] = rng.pick(triples);
        const sx = rng.sign(), sy = rng.sign();
        const swap = rng.chance(0.5);
        const x = sx * (swap ? ty : tx);
        const y = sy * (swap ? tx : ty);

        const { options, answer } = buildMcqOptions(
          rng,
          `$${len}$`,
          [
            `$${Math.abs(x) + Math.abs(y)}$`,
            `$${len * len}$`,
            `$${Math.abs(Math.abs(x) - Math.abs(y))}$`,
            `$${len + 2}$`,
          ],
          (s) => `$${len + s + 2}$`
        );

        return {
          points: 1,
          difficulty,
          stem: `Найдите длину (модуль) вектора $\\vec{a}(${x};\\ ${y})$.`,
          options,
          answer,
          hint: 'Длина вектора $\\vec{a}(x; y)$ равна $\\sqrt{x^2 + y^2}$.',
          explanation: `$|\\vec{a}| = \\sqrt{(${x})^2 + (${y})^2} = \\sqrt{${x * x} + ${y * y}} = \\sqrt{${len * len}} = ${len}$.`,
        };
      }

      const x1 = rng.intExcept(-6, 6, [0]);
      const y1 = rng.intExcept(-6, 6, [0]);
      const x2 = rng.intExcept(-6, 6, [0]);
      const y2 = rng.intExcept(-6, 6, [0]);
      const dot = x1 * x2 + y1 * y2;
      const crossWrong = x1 * y2 + x2 * y1;
      const subWrong = x1 * x2 - y1 * y2;

      const { options, answer } = buildMcqOptions(
        rng,
        `$${dot}$`,
        [
          `$${crossWrong}$`,
          `$${subWrong}$`,
          `$${-dot}$`,
          `$${dot + 4}$`,
          `$${dot - 3}$`,
        ],
        (s) => `$${dot + s * 5}$`
      );

      return {
        points: 1,
        difficulty,
        stem: `Найдите скалярное произведение векторов $\\vec{a}(${x1};\\ ${y1})$ и $\\vec{b}(${x2};\\ ${y2})$.`,
        options,
        answer,
        hint: 'Скалярное произведение в координатах: $\\vec{a}\\cdot\\vec{b} = x_1 x_2 + y_1 y_2$.',
        explanation:
          `$\\vec{a}\\cdot\\vec{b} = (${x1})\\cdot(${x2}) + (${y1})\\cdot(${y2}) = ${x1 * x2} + (${y1 * y2}) = ${dot}$.`,
      };
    },
  },

  // 53. math.cylinder-sphere (curriculum gap: cylinder, sphere, pyramid)
  {
    id: 'math.cylinder-sphere',
    subject: 'math',
    title: 'Цилиндр, шар и пирамида (площадь и объём)',
    topic: TOPIC_STEREO,
    format: 'short',
    weight: 0.9,
    generate(rng, { difficulty }) {
      const kind = rng.pick(['cylinder-vol', 'cylinder-lat', 'sphere-area', 'pyramid-vol']);
      if (kind === 'cylinder-vol') {
        const R = rng.int(2, 8);
        const H = rng.int(3, 14);
        const vOverPi = R * R * H;
        return {
          points: 1,
          difficulty,
          stem: `Радиус основания цилиндра равен $${R}$ см, а высота — $${H}$ см. Найдите $\\frac{V}{\\pi}$, где $V$ — объём цилиндра (в см$^3$).`,
          answer: String(vOverPi),
          hint: 'Объём цилиндра равен $V = \\pi R^2 H$.',
          explanation: `$V = \\pi R^2 H = \\pi \\cdot ${R}^2 \\cdot ${H} = ${vOverPi}\\pi$ см$^3$, значит $\\frac{V}{\\pi} = ${vOverPi}$.`,
        };
      }
      if (kind === 'cylinder-lat') {
        const R = rng.int(2, 9);
        const H = rng.int(3, 15);
        const sOverPi = 2 * R * H;
        return {
          points: 1,
          difficulty,
          stem: `Радиус основания цилиндра равен $${R}$ см, а высота — $${H}$ см. Найдите $\\frac{S_{\\text{бок}}}{\\pi}$, где $S_{\\text{бок}}$ — площадь боковой поверхности цилиндра (в см$^2$).`,
          answer: String(sOverPi),
          hint: 'Площадь боковой поверхности цилиндра равна $S_{\\text{бок}} = 2\\pi R H$.',
          explanation: `$S_{\\text{бок}} = 2\\pi R H = 2\\pi \\cdot ${R} \\cdot ${H} = ${sOverPi}\\pi$ см$^2$, откуда $\\frac{S_{\\text{бок}}}{\\pi} = ${sOverPi}$.`,
        };
      }
      if (kind === 'sphere-area') {
        const R = rng.int(2, 10);
        const sOverPi = 4 * R * R;
        return {
          points: 1,
          difficulty,
          stem: `Радиус сферы равен $${R}$ см. Найдите $\\frac{S}{\\pi}$, где $S$ — площадь поверхности сферы (в см$^2$).`,
          answer: String(sOverPi),
          hint: 'Площадь сферы вычисляется по формуле $S = 4\\pi R^2$.',
          explanation: `$S = 4\\pi R^2 = 4\\pi \\cdot ${R}^2 = ${sOverPi}\\pi$ см$^2$, следовательно $\\frac{S}{\\pi} = ${sOverPi}$.`,
        };
      }
      // pyramid-vol
      const a = rng.int(3, 10);
      const H = rng.int(1, 5) * 3;
      const V = (a * a * H) / 3;
      return {
        points: 1,
        difficulty,
        stem: `В основании правильной четырёхугольной пирамиды лежит квадрат со стороной $${a}$ см, а высота пирамиды равна $${H}$ см. Найдите объём пирамиды (в см$^3$).`,
        answer: String(V),
        hint: 'Объём пирамиды равен $V = \\frac{1}{3} S_{\\text{осн}} \\cdot H$.',
        explanation: `$S_{\\text{осн}} = ${a}^2 = ${a * a}$ см$^2$, тогда $V = \\frac{1}{3} \\cdot ${a * a} \\cdot ${H} = ${V}$ см$^3$.`,
      };
    },
  },
];
