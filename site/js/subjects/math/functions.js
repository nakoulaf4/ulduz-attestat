import {
  gcd, cleanNum, fmtTexNum, fmtShortAns, numAccept, fmtFracTex, fmtTerm, buildMcqOptions,
} from './helpers.js';
import { svgParabolaRightTri } from './svg.js';

const TOPIC_FUNC = 'Функции и графики';
const TOPIC_COORD = 'Метод координат';

export const functionTypes = [
  // 29. math.func-eval (1503 #62)
  {
    id: 'math.func-eval',
    subject: 'math',
    title: 'Значение функции в точке',
    topic: TOPIC_FUNC,
    format: 'single',
    weight: 1,
    generate(rng, { difficulty }) {
      const x0 = difficulty === 1 ? rng.pick([2, 3, 4]) : rng.pick([2, 3, 4, -2, -3]);
      const a = rng.int(1, 5);
      let b = rng.intExcept(-5, 7, [0]);
      const c = rng.int(1, 7);
      let num = a * x0 + b;
      if (num === 0) {
        b += 2;
        num = a * x0 + b;
      }
      const den = x0 * x0 + c;
      const g = gcd(num, den);
      // Avoid integer result on difficulty >= 2 if possible, or just format cleanly
      const correct = `$${fmtFracTex(num, den)}$`;

      const altWrongDen = Math.abs(x0) + c;
      const candidates = [
        `$${fmtFracTex(num + 1, den)}$`,
        `$${fmtFracTex(num - 1, den)}$`,
        `$${fmtFracTex(num + 2, den)}$`,
        `$${fmtFracTex(num, altWrongDen)}$`,
        `$${fmtFracTex(-num, den)}$`,
        `$${fmtFracTex(den, num)}$`,
      ];

      const { options, answer } = buildMcqOptions(
        rng,
        correct,
        candidates,
        (s) => `$${fmtFracTex(num + s + 2, den + 1)}$`
      );

      const numExpr = `${a === 1 ? '' : a}x ${b > 0 ? `+ ${b}` : `- ${Math.abs(b)}`}`;
      const denExpr = `x^2 + ${c}`;
      const x0Disp = x0 < 0 ? `(${x0})` : String(x0);

      return {
        points: 1,
        difficulty,
        stem: `Дана функция $f(x) = \\frac{${numExpr}}{${denExpr}}$. Вычислите $f(${x0})$.`,
        options,
        answer,
        hint: `Подставьте $x = ${x0}$ в формулу функции.`,
        explanation:
          `Подставим $x = ${x0}$: ` +
          `$f(${x0}) = \\frac{${a} \\cdot ${x0Disp} ${b > 0 ? `+ ${b}` : `- ${Math.abs(b)}`}}{${x0Disp}^2 + ${c}} = ` +
          `\\frac{${num}}{${den}}${g > 1 ? ` = ${fmtFracTex(num, den)}` : ''}$.`,
      };
    },
  },

  // 30. math.coords-quadrant (1503 #71)
  {
    id: 'math.coords-quadrant',
    subject: 'math',
    title: 'Координаты точки по расстояниям до осей',
    topic: TOPIC_COORD,
    format: 'single',
    weight: 1,
    generate(rng, { difficulty }) {
      const quads = [
        { name: 'I', sx: 1, sy: 1, desc: 'в I четверти оба знака положительны: $x > 0,\\ y > 0$' },
        { name: 'II', sx: -1, sy: 1, desc: 'во II четверти абсцисса отрицательна, а ордината положительна: $x \\lt 0,\\ y > 0$' },
        { name: 'III', sx: -1, sy: -1, desc: 'в III четверти обе координаты отрицательны: $x \\lt 0,\\ y \\lt 0$' },
        { name: 'IV', sx: 1, sy: -1, desc: 'в IV четверти абсцисса положительна, а ордината отрицательна: $x > 0,\\ y \\lt 0$' },
      ];
      const q = rng.pick(quads);
      const dOx = rng.int(2, difficulty === 1 ? 8 : 12); // |y|
      const dOy = rng.intExcept(2, difficulty === 1 ? 8 : 12, [dOx]); // |x|

      const x = q.sx * dOy;
      const y = q.sy * dOx;
      const fmtPt = (px, py) => `$(${px};\\ ${py})$`;
      const correct = fmtPt(x, y);

      const candidates = [
        fmtPt(q.sx * dOx, q.sy * dOy), // swapped x and y (primary trap!)
        fmtPt(-x, y),
        fmtPt(x, -y),
        fmtPt(-x, -y),
        fmtPt(-q.sx * dOx, q.sy * dOy),
      ];

      const { options, answer } = buildMcqOptions(
        rng,
        correct,
        candidates,
        (s) => fmtPt(x + s, y)
      );

      return {
        points: 1,
        difficulty,
        stem:
          `Точка $A$ расположена в ${q.name} координатной четверти. Расстояние от точки $A$ до оси абсцисс равно $${dOx}$, ` +
          `а до оси ординат — $${dOy}$. Найдите координаты точки $A$.`,
        options,
        answer,
        hint: 'Расстояние до оси абсцисс ($Ox$) равно $|y|$, а расстояние до оси ординат ($Oy$) равно $|x|$.',
        explanation:
          `Расстояние до оси абсцисс задаёт модуль ординаты $|y| = ${dOx}$, а до оси ординат — модуль абсциссы $|x| = ${dOy}$. ` +
          `Поскольку ${q.desc}, получаем $A(${x};\\ ${y})$.`,
      };
    },
  },

  // 31. math.midpoint-param (0903 #84)
  {
    id: 'math.midpoint-param',
    subject: 'math',
    title: 'Середина отрезка с параметром',
    topic: TOPIC_COORD,
    format: 'short',
    weight: 1,
    generate(rng, { difficulty }) {
      // Roots of y_M = 0 are k1 < k2 (gap >= 2)
      const k1 = rng.int(1, 6);
      const k2 = k1 + rng.int(3, 6);
      // Choose interval (u1, u2) for x_M < 0 containing ONLY one of k1, k2
      const pickFirst = rng.chance(0.5);
      let u1, u2, ans;
      if (pickFirst) {
        u1 = k1 - rng.int(1, 3);
        u2 = rng.int(k1 + 1, k2 - 1);
        ans = k1;
      } else {
        u1 = rng.int(k1 + 1, k2 - 1);
        u2 = k2 + rng.int(1, 3);
        ans = k2;
      }

      // 2*x_M = k^2 + P*k + Q, 2*y_M = k^2 + R*k + S
      const P = -(u1 + u2);
      const Q = u1 * u2;
      const R = -(k1 + k2);
      const S = k1 * k2;

      // Split between A and B:
      // A(k^2 + p1*k + q1; k^2 + r1*k) and B(p2*k + q2; r2*k + S)
      const p1 = rng.int(-5, -1);
      const p2 = P - p1;
      const q1 = 0;
      const q2 = Q;
      const r1 = rng.chance(0.5) ? 0 : rng.int(-3, -1);
      const r2 = R - r1;

      const ax = `k^2${fmtTerm(p1, 'k', false)}${q1 === 0 ? '' : fmtTerm(q1, '', false)}`;
      const ay = `k^2${r1 === 0 ? '' : fmtTerm(r1, 'k', false)}`;
      const bx = `${fmtTerm(p2, 'k', true)}${fmtTerm(q2, '', false)}`;
      const by = `${fmtTerm(r2, 'k', true)}${fmtTerm(S, '', false)}`;

      const xmPoly = `k^2${fmtTerm(P, 'k', false)}${fmtTerm(Q, '', false)}`;
      const ymPoly = `k^2${fmtTerm(R, 'k', false)}${fmtTerm(S, '', false)}`;

      return {
        points: 2,
        difficulty,
        stem:
          `Середина отрезка, соединяющего точки $A(${ax};\\ ${ay})$ и $B(${bx};\\ ${by})$, ` +
          `лежит на отрицательной полуоси абсцисс. Найдите значение $k$.`,
        answer: String(ans),
        hint: 'Точка на отрицательной полуоси $Ox$ имеет $y = 0$ и $x \\lt 0$.',
        explanation:
          `Координаты середины отрезка $AB$: $x_M = \\frac{${xmPoly}}{2}$ и $y_M = \\frac{${ymPoly}}{2}$. ` +
          `Так как $M$ лежит на отрицательной полуоси абсцисс, $y_M = 0$ и $x_M \\lt 0$. ` +
          `Из $${ymPoly} = 0$ находим $k_1 = ${k1}$ и $k_2 = ${k2}$. ` +
          `Условие $${xmPoly} \\lt 0$ выполняется на интервале $(${u1};\\ ${u2})$, куда попадает только $k = ${ans}$.`,
      };
    },
  },

  // 32. math.parabola-right-tri (0903 #81)
  {
    id: 'math.parabola-right-tri',
    subject: 'math',
    title: 'Парабола и прямоугольный треугольник',
    topic: TOPIC_FUNC,
    format: 'short',
    weight: 1,
    generate(rng, { difficulty }) {
      const k = difficulty === 1 ? rng.int(1, 2) : rng.int(1, 4);
      const m = rng.pick([2, 3, 4, 5]);
      const mult = m * m; // 4, 9, 16, 25
      const co = m * k;
      const ao = k;
      const bo = mult * k;
      const xv = cleanNum((-ao + bo) / 2);

      return {
        points: 2,
        difficulty,
        stem:
          `На рисунке изображён график квадратичной функции $f(x) = ax^2 + bx + c$. ` +
          `Известно, что $AC \\perp BC$, $CO = ${co}$ и $BO = ${mult} \\cdot AO$. Найдите абсциссу вершины параболы.`,
        image: {
          svg: svgParabolaRightTri(),
          alt: 'График параболы, пересекающей ось x в точках A (слева от O) и B (справа от O) и ось y в точке C, причём угол ACB прямой',
        },
        answer: fmtShortAns(xv),
        accept: numAccept(xv),
        hint: 'Используйте метрическое соотношение $CO^2 = AO \\cdot BO$ в прямоугольном треугольнике $ACB$ и симметрию параболы.',
        explanation:
          `В прямоугольном треугольнике $ACB$ высота $CO$ к гипотенузе удовлетворяет $CO^2 = AO \\cdot BO$. ` +
          `Пусть $AO = t$, тогда $BO = ${mult}t$ и $${co}^2 = t \\cdot ${mult}t \\Rightarrow t^2 = ${k * k} \\Rightarrow t = ${k}$. ` +
          `Значит, нули функции: $x_A = -${ao}$ и $x_B = ${bo}$. ` +
          `Абсцисса вершины параболы равна полусумме корней: $x_0 = \\frac{-${ao} + ${bo}}{2} = ${fmtTexNum(xv)}$.`,
      };
    },
  },
];
