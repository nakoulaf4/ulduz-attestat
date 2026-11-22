import {
  gcd, cleanNum, fmtTexNum, fmtShortAns, numAccept, fmtTerm, buildMcqOptions,
} from './helpers.js';

const TOPIC_ALG = 'Алгебраические выражения';
const TOPIC_POW = 'Степени и логарифмы';

export const algebraTypes = [
  // 12. math.diff-squares-eval (0903 #68)
  {
    id: 'math.diff-squares-eval',
    subject: 'math',
    title: 'Вычисления по формуле разности квадратов',
    topic: TOPIC_ALG,
    format: 'single',
    weight: 1,
    generate(rng, { difficulty }) {
      const k = difficulty === 1 ? 2 : rng.int(2, 5);
      const S = rng.int(2, 10) * 100;
      let B = rng.int(12, Math.min(98, Math.floor(S / 3)));
      // Adjust B so (S - 2*B) is divisible by k
      while ((S - 2 * B) % k !== 0 || S - 2 * B <= 0) {
        B++;
      }
      const A = S - B;
      const D = A - B;
      const C = D / k;
      const ans = S * k;

      const { options, answer } = buildMcqOptions(
        rng,
        `$${ans}$`,
        [
          `$${cleanNum(ans / 10)}$`,
          `$${ans * 10}$`,
          `$${S * (k + 1)}$`,
          `$${D * k}$`,
          `$${ans + 100}$`,
        ],
        (s) => `$${ans + s * 200}$`
      );

      return {
        points: 1,
        difficulty,
        stem: `Вычислите значение выражения $\\frac{${A}^2 - ${B}^2}{${C}}$.`,
        options,
        answer,
        hint: 'Разложите числитель по формуле $a^2 - b^2 = (a - b)(a + b)$.',
        explanation:
          `Применим формулу разности квадратов: ` +
          `$\\frac{(${A} + ${B})(${A} - ${B})}{${C}} = \\frac{${S} \\cdot ${D}}{${C}} = ${S} \\cdot ${k} = ${ans}$.`,
      };
    },
  },

  // 13. math.poly-factor (1503 #65)
  {
    id: 'math.poly-factor',
    subject: 'math',
    title: 'Разложение многочлена на множители',
    topic: TOPIC_ALG,
    format: 'single',
    weight: 1,
    generate(rng, { difficulty }) {
      const k = difficulty === 1 ? 1 : rng.int(1, 5);
      let m = rng.int(2, 8);
      while (gcd(k, m) !== 1) m++;
      const c = rng.int(3, 14);
      const sign = rng.sign(); // +1 or -1
      const v = rng.pick(['a', 'x', 'b']);
      const powHigh = difficulty === 3 ? 3 : 2;
      const powLow = powHigh - 1;
      const vHigh = powHigh === 3 ? `${v}^3` : `${v}^2`;
      const vLow = powLow === 2 ? `${v}^2` : v;

      const c1 = c * k;
      const c2 = sign * c * m;
      const polyStr = `${fmtTerm(c1, vHigh, true)}${fmtTerm(c2, vLow, false)}`;

      const inner = `${fmtTerm(k, v, true)}${fmtTerm(sign * m, '', false)}`;
      const outer = `${c}${vLow}`;
      const correct = `$${outer}(${inner})$`;

      const oppInner = `${fmtTerm(k, v, true)}${fmtTerm(-sign * m, '', false)}`;
      const vSub = powLow === 2 ? `${v}^2` : v;
      const d1 = `$${c}${powLow === 2 ? v : ''}(${fmtTerm(k, v, true)}${fmtTerm(sign * c * m, '', false)})$`;
      const d2 = `$${outer}(${oppInner})$`;
      const d3 = `$${vLow}(${fmtTerm(k + 1, v, true)}${fmtTerm(sign * c * m, '', false)})$`;
      const d4 = `$${outer}(${fmtTerm(k + 1, v, true)}${fmtTerm(sign * m, '', false)})$`;
      const d5 = `$${c * m}${vSub}(${fmtTerm(k, v, true)}${fmtTerm(-sign, '', false)})$`;

      const { options, answer } = buildMcqOptions(
        rng,
        correct,
        [d1, d2, d3, d4, d5],
        (s) => `$${c + s}${vLow}(${inner})$`
      );

      return {
        points: 1,
        difficulty,
        stem: `Разложите многочлен $${polyStr}$ на множители.`,
        options,
        answer,
        hint: 'Вынесите за скобки наибольший общий делитель коэффициентов и наименьшую степень переменной.',
        explanation:
          `Общим множителем обоих слагаемых является $${outer}$. Выносим его за скобки: ` +
          `$${polyStr} = ${outer}(${inner})$.`,
      };
    },
  },

  // 14. math.rational-simplify (1503 #61)
  {
    id: 'math.rational-simplify',
    subject: 'math',
    title: 'Сокращение рациональных дробей',
    topic: TOPIC_ALG,
    format: 'single',
    weight: 1,
    generate(rng, { difficulty }) {
      const k = rng.int(2, difficulty === 1 ? 5 : 9);
      let m = rng.int(2, 9);
      while (gcd(k, m) !== 1) m++;
      const s = rng.sign();
      const v = rng.pick(['a', 'x', 'y']);

      const numStr = `${k * k}${v}^2 - ${m * m}`;
      const denStr = `${k}${v} ${s > 0 ? '+' : '-'} ${m}`;
      const ansSign = s > 0 ? '-' : '+';
      const correct = `$${k}${v} ${ansSign} ${m}$`;

      const candidates = [
        `$${k}${v} ${s > 0 ? '+' : '-'} ${m}$`,
        `$${k + 1}${v} ${ansSign} ${m - 1}$`,
        `$${Math.max(1, k - 1)}${v} ${ansSign} ${m + 1}$`,
        `$${k}${v} ${ansSign} ${m * m}$`,
        `$${k * k}${v} ${ansSign} ${m}$`,
      ];

      const { options, answer } = buildMcqOptions(
        rng,
        correct,
        candidates,
        (step) => `$${k}${v} ${ansSign} ${m + step + 1}$`
      );

      return {
        points: 1,
        difficulty,
        stem: `Сократите дробь $\\frac{${numStr}}{${denStr}}$.`,
        options,
        answer,
        hint: 'Разложите числитель на множители как разность квадратов.',
        explanation:
          `В числителе применим формулу разности квадратов: ` +
          `$\\frac{(${k}${v} - ${m})(${k}${v} + ${m})}{${denStr}} = ${k}${v} ${ansSign} ${m}$.`,
      };
    },
  },

  // 15. math.real-power (0903 #64, 1503 #68)
  {
    id: 'math.real-power',
    subject: 'math',
    title: 'Степень с действительным и дробным показателем',
    topic: TOPIC_POW,
    format: 'single',
    weight: 1,
    generate(rng, { difficulty }) {
      const useIrrational = rng.chance(0.5);
      if (useIrrational) {
        const b = rng.pick([2, 3, 4, 5]);
        const k = b <= 3 ? rng.pick([2, 3, 5]) : rng.pick([2, 3]);
        const ans = b ** k;
        const { options, answer } = buildMcqOptions(
          rng,
          `$${ans}$`,
          [
            `$${b}$`,
            `$${b ** (k + 1)}$`,
            `$${b * k}$`,
            `$${ans * ans}$`,
            `$${b ** Math.max(1, k - 1)}$`,
          ],
          (s) => `$${ans + s * 4}$`
        );
        return {
          points: 1,
          difficulty,
          stem: `Найдите значение выражения $\\left(${b}^{\\sqrt{${k}}}\\right)^{\\sqrt{${k}}}$.`,
          options,
          answer,
          hint: 'При возведении степени в степень показатели перемножаются: $(a^m)^n = a^{mn}$.',
          explanation:
            `$\\left(${b}^{\\sqrt{${k}}}\\right)^{\\sqrt{${k}}} = ${b}^{\\sqrt{${k}} \\cdot \\sqrt{${k}}} = ${b}^{${k}} = ${ans}$.`,
        };
      }

      // Subform B: B^p * B^q = B^{p+q} = r^t
      const configs = [
        { B: 16, r: 2, d: 4, sum: 0.5, ans: 4, p: 0.36, q: 0.14 },
        { B: 16, r: 2, d: 4, sum: 0.25, ans: 2, p: 0.17, q: 0.08 },
        { B: 16, r: 2, d: 4, sum: 0.75, ans: 8, p: 0.42, q: 0.33 },
        { B: 25, r: 5, d: 2, sum: 0.5, ans: 5, p: 0.28, q: 0.22 },
        { B: 25, r: 5, d: 2, sum: 1.5, ans: 125, p: 0.85, q: 0.65 },
        { B: 81, r: 3, d: 4, sum: 0.5, ans: 9, p: 0.31, q: 0.19 },
        { B: 81, r: 3, d: 4, sum: 0.25, ans: 3, p: 0.13, q: 0.12 },
        { B: 81, r: 3, d: 4, sum: 0.75, ans: 27, p: 0.47, q: 0.28 },
        { B: 9, r: 3, d: 2, sum: 1.5, ans: 27, p: 0.78, q: 0.72 },
        { B: 4, r: 2, d: 2, sum: 2.5, ans: 32, p: 1.35, q: 1.15 },
        { B: 36, r: 6, d: 2, sum: 0.5, ans: 6, p: 0.29, q: 0.21 },
        { B: 64, r: 2, d: 6, sum: 0.5, ans: 8, p: 0.34, q: 0.16 },
      ];
      const cfg = rng.pick(configs);
      // Perturb p, q slightly while preserving p + q = cfg.sum
      const shift = rng.int(-3, 3) * 0.02;
      const p = cleanNum(cfg.p + shift);
      const q = cleanNum(cfg.sum - p);

      const { options, answer } = buildMcqOptions(
        rng,
        `$${cfg.ans}$`,
        [
          `$${cfg.ans * 2}$`,
          `$${cleanNum(cfg.ans / 2)}$`,
          `$${cfg.B}$`,
          `$${cleanNum(cfg.ans / 4)}$`,
          `$${cfg.r}$`,
        ],
        (s) => `$${cfg.ans + s * 3}$`
      );

      return {
        points: 1,
        difficulty,
        stem: `Найдите значение выражения $${cfg.B}^{${fmtTexNum(p)}} \\cdot ${cfg.B}^{${fmtTexNum(q)}}$.`,
        options,
        answer,
        hint: 'При умножении степеней с одинаковым основанием показатели складываются.',
        explanation:
          `$${cfg.B}^{${fmtTexNum(p)}} \\cdot ${cfg.B}^{${fmtTexNum(q)}} = ` +
          `${cfg.B}^{${fmtTexNum(p)} + ${fmtTexNum(q)}} = ${cfg.B}^{${fmtTexNum(cfg.sum)}} = ${cfg.ans}$.`,
      };
    },
  },

  // 16. math.abs-eval (0903 #78)
  {
    id: 'math.abs-eval',
    subject: 'math',
    title: 'Вычисление выражений с модулем',
    topic: TOPIC_ALG,
    format: 'short',
    weight: 1,
    generate(rng, { difficulty }) {
      const xPool = difficulty === 1 ? [-0.5, -0.4, -0.2] : [-0.4, -0.5, -0.6, -0.8, -1.2, -1.5, -2.5];
      const x0 = rng.pick(xPool);
      const absX = Math.abs(x0);
      const x2 = cleanNum(x0 * x0);
      const A = rng.pick([5, 10, 20, 25]);
      const B = rng.intExcept(-8, 8, [0]);
      const C = rng.int(-6, 12);

      const term1 = cleanNum(A * x2);
      const term2 = cleanNum(B * absX);
      const ans = cleanNum(term1 + term2 + C);

      const expr = `${A}x^2 ${fmtTerm(B, '|x|', false)}${C === 0 ? '' : fmtTerm(C, '', false)}`;
      const expTerm2 = B < 0 ? `- ${Math.abs(B)} \\cdot ${fmtTexNum(absX)}` : `+ ${B} \\cdot ${fmtTexNum(absX)}`;
      const expC = C === 0 ? '' : (C > 0 ? ` + ${C}` : ` - ${Math.abs(C)}`);

      return {
        points: 1,
        difficulty,
        stem: `Найдите значение выражения $${expr}$ при $x = ${fmtTexNum(x0)}$.`,
        answer: fmtShortAns(ans),
        accept: numAccept(ans),
        hint: 'Помните, что $|x| \\ge 0$ и $(-a)^2 = a^2$.',
        explanation:
          `Подставим $x = ${fmtTexNum(x0)}$, учитывая $|${fmtTexNum(x0)}| = ${fmtTexNum(absX)}$ и $(${fmtTexNum(x0)})^2 = ${fmtTexNum(x2)}$: ` +
          `$${A} \\cdot ${fmtTexNum(x2)} ${expTerm2}${expC} = ${fmtTexNum(term1)} ${B < 0 ? '-' : '+'} ${fmtTexNum(Math.abs(term2))}${expC} = ${fmtTexNum(ans)}$.`,
      };
    },
  },

  // 17. math.log-eval (0903 #74, 1503 #78)
  {
    id: 'math.log-eval',
    subject: 'math',
    title: 'Вычисление логарифмических выражений',
    topic: TOPIC_POW,
    format: 'short',
    weight: 1,
    generate(rng, { difficulty }) {
      const sub = rng.chance(0.55) ? 'ratio' : 'nested';
      if (sub === 'ratio') {
        const bases = rng.shuffle([2, 3, 5]);
        const a = bases[0], b = bases[1];
        // Pick m, n, p, q in [1..5] such that (n*p)/(m*q) has finite decimal (den in {1,2,4,5,8,10,20})
        const validDens = new Set([1, 2, 4, 5, 8, 10, 20]);
        let m = 4, n = 3, p = 2, q = 5;
        for (let tries = 0; tries < 60; tries++) {
          const cm = rng.int(1, 4), cn = rng.int(1, 5), cp = rng.int(1, 4), cq = rng.int(2, 5);
          if (cm === cp && cn === cq) continue;
          const num = cn * cp, den = cm * cq;
          const g = gcd(num, den);
          if (validDens.has(den / g)) {
            m = cm; n = cn; p = cp; q = cq;
            break;
          }
        }
        const base1 = a ** m, arg1 = b ** n;
        const base2 = a ** p, arg2 = b ** q;
        const val = cleanNum((n * p) / (m * q));

        return {
          points: 1,
          difficulty,
          stem: `Вычислите значение выражения $\\log_{${base1}} ${arg1} : \\log_{${base2}} ${arg2}$.`,
          answer: fmtShortAns(val),
          accept: numAccept(val, [`${(n * p) / gcd(n * p, m * q)}/${(m * q) / gcd(n * p, m * q)}`]),
          hint: 'Используйте формулу $\\log_{a^m} b^n = \\frac{n}{m}\\log_a b$.',
          explanation:
            `Запишем основания и аргументы как степени $${a}$ и $${b}$: ` +
            `$\\log_{${a}^{${m}}} ${b}^{${n}} : \\log_{${a}^{${p}}} ${b}^{${q}} = ` +
            `\\frac{\\frac{${n}}{${m}}\\log_{${a}}${b}}{\\frac{${q}}{${p}}\\log_{${a}}${b}} = ` +
            `\\frac{${n}}{${m}} \\cdot \\frac{${p}}{${q}} = ${fmtTexNum(val)}$.`,
        };
      }

      // Nested: log_b sqrt(A + k * log_c sqrt(D + lg(10^r)))
      const r = rng.pick([1, 2, 3]);
      const c = rng.pick([2, 3, 5]);
      const u = rng.pick([1, 2]);
      const s = c ** u; // sqrt(D + r) = s
      const D = s * s - r;
      const b = rng.pick([2, 3]);
      const w = rng.pick([2, 3]);
      const t = b ** w; // sqrt(A + k*u) = t
      const k = rng.int(1, 4);
      const A = t * t - k * u;
      if (D <= 0 || A <= 0) throw new Error('log-eval positive radicand error');

      const lgExpr = r === 1 ? '\\lg 10' : `\\lg ${10 ** r}`;
      const kPart = k === 1 ? '' : `${k}`;

      return {
        points: 1,
        difficulty,
        stem: `Найдите значение выражения $\\log_{${b}} \\sqrt{${A} + ${kPart}\\log_{${c}} \\sqrt{${D} + ${lgExpr}}}$.`,
        answer: String(w),
        hint: 'Вычисляйте выражение последовательно изнутри наружу, начиная с десятичного логарифма.',
        explanation:
          `Вычисляем по шагам изнутри: $${lgExpr} = ${r}$; $\\sqrt{${D} + ${r}} = ${s}$; ` +
          `$\\log_{${c}} ${s} = ${u}$; $\\sqrt{${A} + ${k} \\cdot ${u}} = \\sqrt{${t * t}} = ${t}$; ` +
          `наконец, $\\log_{${b}} ${t} = ${w}$.`,
      };
    },
  },

  // 18. math.log-equation (1503 #76)
  {
    id: 'math.log-equation',
    subject: 'math',
    title: 'Логарифмические уравнения (замена переменной)',
    topic: TOPIC_POW,
    format: 'short',
    weight: 1,
    generate(rng, { difficulty }) {
      const a = rng.pick([2, 3]);
      const r = rng.pick([2, 3]);
      const rhs = a ** r;
      const t1 = rng.int(-2, 1);
      const t2 = rng.int(Math.max(t1 + 1, -t1), difficulty === 3 ? 4 : 3);
      if (t1 === t2) throw new Error('log-equation equal roots');

      const p = -(t1 + t2);
      const q = t1 * t2 + rhs;
      // Since t^2 + p*t + q = rhs > 0 at the roots, both roots are strictly in the domain!
      const sumT = t1 + t2; // >= 0
      const prod = a ** sumT;

      const innerPoly = `\\log_{${a}}^2 x ${fmtTerm(p, `\\log_{${a}} x`, false)}${fmtTerm(q, '', false)}`;
      return {
        points: 1,
        difficulty,
        stem: `Найдите произведение корней уравнения $\\log_{${a}}\\left(${innerPoly}\\right) = ${r}$.`,
        answer: String(prod),
        hint: 'Избавьтесь от внешнего логарифма и сделайте замену $t = \\log_a x$.',
        explanation:
          `По определению логарифма $${innerPoly} = ${a}^{${r}} = ${rhs}$. ` +
          `Положим $t = \\log_{${a}} x$: получаем $t^2 ${fmtTerm(p, 't', false)}${fmtTerm(t1 * t2, '', false)} = 0$, ` +
          `откуда $t_1 = ${t1}$, $t_2 = ${t2}$. ` +
          `Тогда $x_1 = ${a}^{${t1}}$, $x_2 = ${a}^{${t2}}$, и их произведение $x_1 x_2 = ${a}^{${t1} + (${t2})} = ${a}^{${sumT}} = ${prod}$.`,
      };
    },
  },
];
