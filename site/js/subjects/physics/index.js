// SubjectModule: Физика (id: 'physics', DİM Group I — 30 tasks, 90 min, 100-point scale).

import {
  buildShuffledSingle,
  buildNumericSingle,
  buildStandardBlockExam,
  scoreStandardBlockExam,
} from '../_shared/block-helpers.js';

function makeCircuitSvg(r1, r2, mode, u) {
  const isSeries = mode === 'series';
  const body = isSeries
    ? `<line x1="26" y1="68" x2="74" y2="68" stroke="currentColor" stroke-width="2"/>
       <rect x="74" y="54" width="66" height="28" fill="none" stroke="currentColor" stroke-width="2"/>
       <text x="107" y="73" text-anchor="middle" font-size="12" fill="currentColor">R₁=${r1} Ом</text>
       <line x1="140" y1="68" x2="184" y2="68" stroke="currentColor" stroke-width="2"/>
       <rect x="184" y="54" width="66" height="28" fill="none" stroke="currentColor" stroke-width="2"/>
       <text x="217" y="73" text-anchor="middle" font-size="12" fill="currentColor">R₂=${r2} Ом</text>
       <line x1="250" y1="68" x2="294" y2="68" stroke="currentColor" stroke-width="2"/>
       <line x1="26" y1="68" x2="26" y2="122" stroke="currentColor" stroke-width="2"/>
       <line x1="294" y1="68" x2="294" y2="122" stroke="currentColor" stroke-width="2"/>
       <line x1="26" y1="122" x2="138" y2="122" stroke="currentColor" stroke-width="2"/>
       <line x1="182" y1="122" x2="294" y2="122" stroke="currentColor" stroke-width="2"/>
       <circle cx="160" cy="122" r="18" fill="none" stroke="currentColor" stroke-width="2"/>
       <text x="160" y="126" text-anchor="middle" font-size="12" fill="currentColor">U=${u}В</text>`
    : `<line x1="26" y1="78" x2="72" y2="78" stroke="currentColor" stroke-width="2"/>
       <line x1="72" y1="44" x2="72" y2="112" stroke="currentColor" stroke-width="2"/>
       <line x1="72" y1="44" x2="116" y2="44" stroke="currentColor" stroke-width="2"/>
       <rect x="116" y="30" width="88" height="28" fill="none" stroke="currentColor" stroke-width="2"/>
       <text x="160" y="49" text-anchor="middle" font-size="12" fill="currentColor">R₁=${r1} Ом</text>
       <line x1="204" y1="44" x2="248" y2="44" stroke="currentColor" stroke-width="2"/>
       <line x1="72" y1="112" x2="116" y2="112" stroke="currentColor" stroke-width="2"/>
       <rect x="116" y="98" width="88" height="28" fill="none" stroke="currentColor" stroke-width="2"/>
       <text x="160" y="117" text-anchor="middle" font-size="12" fill="currentColor">R₂=${r2} Ом</text>
       <line x1="204" y1="112" x2="248" y2="112" stroke="currentColor" stroke-width="2"/>
       <line x1="248" y1="44" x2="248" y2="112" stroke="currentColor" stroke-width="2"/>
       <line x1="248" y1="78" x2="294" y2="78" stroke="currentColor" stroke-width="2"/>
       <text x="160" y="150" text-anchor="middle" font-size="12" fill="currentColor">U = ${u} В (параллельно)</text>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 162" width="320" height="162">${body}</svg>`;
}

const taskTypes = [
  {
    id: 'physics.kinematics-motion',
    subject: 'physics',
    topic: 'Кинематика',
    title: 'Равноускоренное движение и путь',
    format: 'single',
    difficulty: [1, 3],
    weight: 1.4,
    generate(rng, { difficulty }) {
      const mode = difficulty === 1 ? 'velocity' : rng.pick(['velocity', 'distance', 'freefall']);
      if (mode === 'velocity') {
        const v0 = rng.int(2, 18);
        const a = rng.int(1, 6);
        const t = rng.int(2, 10);
        const v = v0 + a * t;
        const { options, answer } = buildNumericSingle(rng, v, 'м/с', [v0 + a + t, v0 * t, v + a, Math.max(1, v - a * 2)]);
        return {
          stem: `Автомобиль движется прямолинейно с начальной скоростью $v_0 = ${v0}\\text{ м/с}$ и постоянным ускорением $a = ${a}\\text{ м/с}^2$. Какой станет его скорость через $t = ${t}\\text{ с}$?`,
          options,
          answer,
          explanation: `По формуле скорости при равноускоренном движении: $v = v_0 + at = ${v0} + ${a} \\cdot ${t} = ${v}\\text{ м/с}$.`,
          hint: 'Используйте формулу $v = v_0 + at$.',
          difficulty,
        };
      }
      if (mode === 'distance') {
        const v0 = rng.int(0, 12);
        const a = rng.pick([2, 4, 6, 8]);
        const t = rng.int(2, 8);
        const s = v0 * t + (a * t * t) / 2;
        const { options, answer } = buildNumericSingle(rng, s, 'м', [v0 * t + a * t * t, v0 * t + a * t, s + a * 2, Math.max(2, s - a * 2)]);
        return {
          stem: `Тело начинает движение с начальной скоростью $v_0 = ${v0}\\text{ м/с}$ и ускорением $a = ${a}\\text{ м/с}^2$. Какой путь оно пройдёт за $t = ${t}\\text{ с}$?`,
          options,
          answer,
          explanation: `Путь при равноускоренном движении: $S = v_0 t + \\frac{at^2}{2} = ${v0}\\cdot ${t} + \\frac{${a}\\cdot ${t}^2}{2} = ${s}\\text{ м}$.`,
          hint: 'Примените формулу $S = v_0 t + \\frac{at^2}{2}$.',
          difficulty,
        };
      }
      const t = rng.int(2, 9);
      const h = 5 * t * t;
      const { options, answer } = buildNumericSingle(rng, h, 'м', [10 * t, 10 * t * t, h + 15, Math.max(5, h - 10)]);
      return {
        stem: `Камень свободно падает без начальной скорости с крыши башни и достигает земли за $t = ${t}\\text{ с}$. Определите высоту башни ($g = 10\\text{ м/с}^2$).`,
        options,
        answer,
        explanation: `При свободном падении без начальной скорости $h = \\frac{gt^2}{2} = \\frac{10 \\cdot ${t}^2}{2} = ${h}\\text{ м}$.`,
        hint: 'Для свободного падения $h = \\frac{gt^2}{2}$.',
        difficulty,
      };
    },
  },
  {
    id: 'physics.kinematics-short',
    subject: 'physics',
    topic: 'Кинематика',
    title: 'Средняя скорость и ускорение (краткий ответ)',
    format: 'short',
    difficulty: [1, 3],
    weight: 1.0,
    generate(rng, { difficulty }) {
      const mode = rng.pick(['avg', 'accel']);
      if (mode === 'avg') {
        const t1 = rng.int(2, 6);
        const t2 = rng.int(2, 6);
        const vAvg = rng.int(8, 26);
        const totalT = t1 + t2;
        const s1 = rng.int(2, vAvg - 2) * t1;
        const s2 = vAvg * totalT - s1;
        return {
          stem: `Турист прошёл первый участок пути длиной $S_1 = ${s1}\\text{ м}$ за $t_1 = ${t1}\\text{ с}$, а второй участок длиной $S_2 = ${s2}\\text{ м}$ за $t_2 = ${t2}\\text{ с}$. Найдите среднюю скорость на всём пути (в м/с).`,
          answer: String(vAvg),
          explanation: `Средняя скорость равна отношению всего пути ко всему времени: $v_{\\text{ср}} = \\frac{S_1 + S_2}{t_1 + t_2} = \\frac{${s1} + ${s2}}{${t1} + ${t2}} = ${vAvg}\\text{ м/с}$.`,
          hint: 'Сложите оба пути и разделите на суммарное время.',
          difficulty,
        };
      }
      const a = rng.int(2, 9);
      const t = rng.int(2, 8);
      const v0 = rng.int(2, 15);
      const v = v0 + a * t;
      return {
        stem: `Скорость поезда за $t = ${t}\\text{ с}$ равномерно увеличилась с $v_0 = ${v0}\\text{ м/с}$ до $v = ${v}\\text{ м/с}$. Определите модуль ускорения поезда (в $\\text{м/с}^2$).`,
        answer: String(a),
        explanation: `Ускорение $a = \\frac{v - v_0}{t} = \\frac{${v} - ${v0}}{${t}} = ${a}\\text{ м/с}^2$.`,
        hint: 'Используйте определение ускорения $a = \\frac{v - v_0}{t}$.',
        difficulty,
      };
    },
  },
  {
    id: 'physics.newton-forces',
    subject: 'physics',
    topic: 'Динамика и законы Ньютона',
    title: 'Второй закон Ньютона, сила трения и закон Гука',
    format: 'single',
    difficulty: [1, 3],
    weight: 1.4,
    generate(rng, { difficulty }) {
      const mode = rng.pick(['newton2', 'hooke', 'friction', 'gravity']);
      if (mode === 'newton2') {
        const m = rng.int(2, 15);
        const a = rng.int(2, 8);
        const f = m * a;
        const { options, answer } = buildNumericSingle(rng, f, 'Н', [m + a, f * 2, Math.max(1, f - m), Math.round(f / 2) || 1]);
        return {
          stem: `Какая равнодействующая сила сообщает телу массой $m = ${m}\\text{ кг}$ ускорение $a = ${a}\\text{ м/с}^2$?`,
          options,
          answer,
          explanation: `По второму закону Ньютона $F = ma = ${m} \\cdot ${a} = ${f}\\text{ Н}$.`,
          hint: 'Примените второй закон Ньютона $F = ma$.',
          difficulty,
        };
      }
      if (mode === 'hooke') {
        const k = rng.pick([100, 150, 200, 250, 300, 400, 500]);
        const xCm = rng.int(2, 12);
        const f = (k * xCm) / 100;
        const { options, answer } = buildNumericSingle(rng, f, 'Н', [k * xCm, f * 2, f + 5, Math.max(1, f / 2)]);
        return {
          stem: `Пружину жёсткостью $k = ${k}\\text{ Н/м}$ растянули на $\\Delta x = ${xCm}\\text{ см}$. Определите возникшую силу упругости.`,
          options,
          answer,
          explanation: `Переведём удлинение в метры: $\\Delta x = ${xCm / 100}\\text{ м}$. По закону Гука $F_{\\text{упр}} = k\\Delta x = ${k} \\cdot ${xCm / 100} = ${f}\\text{ Н}$.`,
          hint: 'Не забудьте перевести сантиметры в метры перед умножением на $k$.',
          difficulty,
        };
      }
      if (mode === 'friction') {
        const m = rng.int(2, 14);
        const mu10 = rng.int(1, 5);
        const mu = mu10 / 10;
        const f = m * mu10;
        const { options, answer } = buildNumericSingle(rng, f, 'Н', [m * 10, f * 2, f + m, Math.max(1, f - 2)]);
        return {
          stem: `Брусок массой $m = ${m}\\text{ кг}$ скользит по горизонтальной поверхности с коэффициентом трения $\\mu = ${String(mu).replace('.', ',')}$. Чему равна сила трения скольжения ($g = 10\\text{ м/с}^2$)?`,
          options,
          answer,
          explanation: `На горизонтальной плоскости $N = mg$, поэтому $F_{\\text{тр}} = \\mu mg = ${String(mu).replace('.', ',')} \\cdot ${m} \\cdot 10 = ${f}\\text{ Н}$.`,
          hint: 'Формула силы трения скольжения: $F_{\\text{тр}} = \\mu mg$.',
          difficulty,
        };
      }
      const n = rng.pick([2, 3, 4, 5]);
      const f1 = rng.pick([18, 24, 36, 48, 72, 100]);
      const ans = Math.round((f1 / (n * n)) * 100) / 100;
      const { options, answer } = buildNumericSingle(rng, ans, 'Н', [f1 / n, f1 * n, f1 * n * n, ans + 2]);
      return {
        stem: `Сила гравитационного притяжения между двумя телами равна $F_1 = ${f1}\\text{ Н}$. Чему станет равна эта сила, если расстояние между телами увеличить в $${n}$ раза?`,
        options,
        answer,
        explanation: `По закону всемирного тяготения $F \\sim \\frac{1}{r^2}$. При увеличении расстояния в $${n}$ раза сила уменьшится в $${n}^2 = ${n * n}$ раз: $F_2 = \\frac{${f1}}{${n * n}} = ${String(ans).replace('.', ',')}\\text{ Н}$.`,
        hint: 'Сила притяжения обратно пропорциональна квадрату расстояния.',
        difficulty,
      };
    },
  },
  {
    id: 'physics.work-energy',
    subject: 'physics',
    topic: 'Работа, энергия и импульс',
    title: 'Кинетическая, потенциальная энергия и мощность',
    format: 'single',
    difficulty: [1, 3],
    weight: 1.4,
    generate(rng, { difficulty }) {
      const mode = rng.pick(['ek', 'ep', 'power']);
      if (mode === 'ek') {
        const m = rng.pick([2, 4, 6, 8, 10, 12]);
        const v = rng.int(2, 12);
        const ek = (m * v * v) / 2;
        const { options, answer } = buildNumericSingle(rng, ek, 'Дж', [m * v * v, m * v, ek + m * 2, Math.max(2, ek / 2)]);
        return {
          stem: `Найдите кинетическую энергию тела массой $m = ${m}\\text{ кг}$, движущегося со скоростью $v = ${v}\\text{ м/с}$.`,
          options,
          answer,
          explanation: `Кинетическая энергия $E_k = \\frac{mv^2}{2} = \\frac{${m} \\cdot ${v}^2}{2} = ${ek}\\text{ Дж}$.`,
          hint: 'Вспомните формулу $E_k = \\frac{mv^2}{2}$.',
          difficulty,
        };
      }
      if (mode === 'ep') {
        const m = rng.int(2, 12);
        const h = rng.int(3, 18);
        const ep = m * 10 * h;
        const { options, answer } = buildNumericSingle(rng, ep, 'Дж', [m * h, ep / 2, ep + 50, ep * 2]);
        return {
          stem: `Груз массой $m = ${m}\\text{ кг}$ подняли на высоту $h = ${h}\\text{ м}$ над землёй. Определите его потенциальную энергию ($g = 10\\text{ м/с}^2$).`,
          options,
          answer,
          explanation: `Потенциальная энергия $E_p = mgh = ${m} \\cdot 10 \\cdot ${h} = ${ep}\\text{ Дж}$.`,
          hint: 'Используйте $E_p = mgh$.',
          difficulty,
        };
      }
      const p = rng.pick([50, 100, 120, 150, 200, 250, 300]);
      const t = rng.int(4, 15);
      const a = p * t;
      const { options, answer } = buildNumericSingle(rng, a, 'Дж', [Math.round(p / t) || 10, a * 2, a + p, Math.max(10, a - p)]);
      return {
        stem: `Двигатель мощностью $N = ${p}\\text{ Вт}$ работает равномерно в течение $t = ${t}\\text{ с}$. Какую механическую работу он совершает?`,
        options,
        answer,
        explanation: `Механическая работа $A = N \\cdot t = ${p} \\cdot ${t} = ${a}\\text{ Дж}$.`,
        hint: 'Мощность связана с работой формулой $N = \\frac{A}{t}$.',
        difficulty,
      };
    },
  },
  {
    id: 'physics.momentum-short',
    subject: 'physics',
    topic: 'Работа, энергия и импульс',
    title: 'Импульс тела и неупругий удар (краткий ответ)',
    format: 'short',
    difficulty: [1, 3],
    weight: 1.0,
    generate(rng, { difficulty }) {
      const m1 = rng.int(2, 8);
      const m2 = rng.int(2, 8);
      const vAfter = rng.int(2, 9);
      const v1 = vAfter * (m1 + m2);
      // Use clean divisible case where m1 divides vAfter*(m1+m2): pick m2 = k*m1
      const mult = rng.int(1, 4);
      const mass1 = rng.int(2, 7);
      const mass2 = mass1 * mult;
      const u = rng.int(2, 8);
      const speed1 = u * (1 + mult);
      return {
        stem: `Тележка массой $m_1 = ${mass1}\\text{ кг}$, движущаяся со скоростью $v_1 = ${speed1}\\text{ м/с}$, сталкивается с покоящейся тележкой массой $m_2 = ${mass2}\\text{ кг}$ и сцепляется с ней. Найдите скорость тележек после сцепки (в м/с).`,
        answer: String(u),
        explanation: `По закону сохранения импульса $m_1 v_1 = (m_1 + m_2) u$, откуда $u = \\frac{${mass1} \\cdot ${speed1}}{${mass1} + ${mass2}} = ${u}\\text{ м/с}$.`,
        hint: 'Примените закон сохранения импульса $m_1 v_1 = (m_1 + m_2) u$.',
        difficulty,
      };
    },
  },
  {
    id: 'physics.thermodynamics',
    subject: 'physics',
    topic: 'Термодинамика и МКТ',
    title: 'Количество теплоты, первый закон термодинамики и КПД',
    format: 'single',
    difficulty: [1, 3],
    weight: 1.3,
    generate(rng, { difficulty }) {
      const mode = rng.pick(['firstlaw', 'efficiency', 'isobaric']);
      if (mode === 'firstlaw') {
        const q = rng.int(40, 220) * 10;
        const a = rng.int(10, Math.floor(q / 10) - 10) * 10;
        const du = q - a;
        const { options, answer } = buildNumericSingle(rng, du, 'Дж', [q + a, du + 100, Math.max(10, du - 100), a]);
        return {
          stem: `Идеальному газу передали количество теплоты $Q = ${q}\\text{ Дж}$, при этом газ совершил работу $A = ${a}\\text{ Дж}$. На сколько изменилась внутренняя энергия газа?`,
          options,
          answer,
          explanation: `По первому закону термодинамики $Q = \\Delta U + A$, следовательно $\\Delta U = Q - A = ${q} - ${a} = ${du}\\text{ Дж}$.`,
          hint: 'Используйте первый закон термодинамики: $\\Delta U = Q - A$.',
          difficulty,
        };
      }
      if (mode === 'efficiency') {
        const t1 = rng.pick([400, 500, 600, 800, 1000]);
        const pct = rng.pick([20, 25, 40, 50, 60]);
        const t2 = Math.round(t1 * (1 - pct / 100));
        const { options, answer } = buildNumericSingle(rng, pct, '\\%', [100 - pct, pct + 10, Math.max(5, pct - 10), Math.min(95, pct + 15)]);
        return {
          stem: `Температура нагревателя идеальной тепловой машины Карно равна $T_1 = ${t1}\\text{ К}$, а температура холодильника — $T_2 = ${t2}\\text{ К}$. Найдите максимальный КПД машины.`,
          options,
          answer,
          explanation: `КПД цикла Карно $\\eta = \\frac{T_1 - T_2}{T_1} \\cdot 100\\% = \\frac{${t1} - ${t2}}{${t1}} \\cdot 100\\% = ${pct}\\%$.`,
          hint: 'Примените формулу цикла Карно $\\eta = \\left(1 - \\frac{T_2}{T_1}\\right)\\cdot 100\\%$.',
          difficulty,
        };
      }
      const p = rng.pick([100, 150, 200, 250, 300]);
      const dv = rng.int(2, 9);
      const a = p * dv;
      const { options, answer } = buildNumericSingle(rng, a, 'кДж', [a * 2, Math.round(a / 2), a + p, Math.max(50, a - p)]);
      return {
        stem: `При постоянном давлении $p = ${p}\\text{ кПа}$ объём газа увеличился на $\\Delta V = ${dv}\\text{ м}^3$. Определите работу, совершённую газом.`,
        options,
        answer,
        explanation: `В изобарном процессе работа газа $A = p\\Delta V = ${p}\\text{ кПа} \\cdot ${dv}\\text{ м}^3 = ${a}\\text{ кДж}$.`,
        hint: 'Для изобарного процесса $A = p\\Delta V$.',
        difficulty,
      };
    },
  },
  {
    id: 'physics.ohm-circuits',
    subject: 'physics',
    topic: 'Электричество и закон Ома',
    title: 'Закон Ома и соединение резисторов (со схемой)',
    format: 'single',
    difficulty: [1, 3],
    weight: 1.4,
    generate(rng, { difficulty }) {
      const isSeries = rng.pick([true, false]);
      if (isSeries) {
        const r1 = rng.int(2, 10);
        const r2 = rng.int(2, 10);
        const rTot = r1 + r2;
        const i = rng.int(1, 6);
        const u = i * rTot;
        const { options, answer } = buildNumericSingle(rng, i, 'А', [i + 1, i + 2, rTot, Math.max(0.5, Math.round((u / r1) * 10) / 10)]);
        return {
          stem: `Два резистора сопротивлением $R_1 = ${r1}\\text{ Ом}$ и $R_2 = ${r2}\\text{ Ом}$ соединены последовательно и подключены к источнику напряжением $U = ${u}\\text{ В}$. Определите силу тока в цепи.`,
          image: { svg: makeCircuitSvg(r1, r2, 'series', u), alt: `Последовательная цепь R1=${r1} Ом, R2=${r2} Ом, U=${u} В` },
          options,
          answer,
          explanation: `При последовательном соединении $R = R_1 + R_2 = ${r1} + ${r2} = ${rTot}\\text{ Ом}$. По закону Ома $I = \\frac{U}{R} = \\frac{${u}}{${rTot}} = ${i}\\text{ А}$.`,
          hint: 'Сначала сложите сопротивления $R = R_1 + R_2$, затем примените $I = \\frac{U}{R}$.',
          difficulty,
        };
      }
      const pairs = [
        [6, 3, 2],
        [12, 4, 3],
        [12, 6, 4],
        [20, 5, 4],
        [15, 10, 6],
        [24, 8, 6],
        [10, 10, 5],
        [16, 16, 8],
      ];
      const [r1, r2, rEq] = rng.pick(pairs);
      const i = rng.int(2, 8);
      const u = i * rEq;
      const { options, answer } = buildNumericSingle(rng, i, 'А', [Math.round((u / (r1 + r2)) * 10) / 10 || 1, i + 2, rEq, Math.max(1, i - 1)]);
      return {
        stem: `Два резистора сопротивлением $R_1 = ${r1}\\text{ Ом}$ и $R_2 = ${r2}\\text{ Ом}$ соединены параллельно при напряжении $U = ${u}\\text{ В}$. Найдите общую силу тока в неразветвлённой части цепи.`,
        image: { svg: makeCircuitSvg(r1, r2, 'parallel', u), alt: `Параллельная цепь R1=${r1} Ом, R2=${r2} Ом, U=${u} В` },
        options,
        answer,
        explanation: `Общее сопротивление при параллельном соединении $R = \\frac{R_1 R_2}{R_1 + R_2} = \\frac{${r1}\\cdot ${r2}}{${r1 + r2}} = ${rEq}\\text{ Ом}$. Сила тока $I = \\frac{U}{R} = \\frac{${u}}{${rEq}} = ${i}\\text{ А}$.`,
        hint: 'Для параллельных резисторов $R = \\frac{R_1 R_2}{R_1 + R_2}$.',
        difficulty,
      };
    },
  },
  {
    id: 'physics.electric-power-short',
    subject: 'physics',
    topic: 'Электричество и закон Ома',
    title: 'Мощность тока и закон Джоуля — Ленца (краткий ответ)',
    format: 'short',
    difficulty: [1, 3],
    weight: 1.0,
    generate(rng, { difficulty }) {
      const i = rng.int(2, 7);
      const r = rng.int(2, 12);
      const t = rng.int(2, 10);
      const q = i * i * r * t;
      return {
        stem: `По проводнику сопротивлением $R = ${r}\\text{ Ом}$ в течение $t = ${t}\\text{ с}$ течёт постоянный ток силой $I = ${i}\\text{ А}$. Какое количество теплоты выделится в проводнике (в Дж)?`,
        answer: String(q),
        explanation: `По закону Джоуля — Ленца $Q = I^2 R t = ${i}^2 \\cdot ${r} \\cdot ${t} = ${q}\\text{ Дж}$.`,
        hint: 'Примените закон Джоуля — Ленца $Q = I^2 R t$.',
        difficulty,
      };
    },
  },
  {
    id: 'physics.optics-waves',
    subject: 'physics',
    topic: 'Оптика, волны и атом',
    title: 'Волны, линзы и квантовая физика',
    format: 'single',
    difficulty: [1, 3],
    weight: 1.3,
    generate(rng, { difficulty }) {
      const mode = rng.pick(['wave', 'lens', 'decay']);
      if (mode === 'wave') {
        const lam = rng.int(2, 14);
        const nu = rng.int(3, 18);
        const v = lam * nu;
        const { options, answer } = buildNumericSingle(rng, v, 'м/с', [lam + nu, v * 2, Math.max(1, v - lam), Math.round(v / 2) || 1]);
        return {
          stem: `Длина волны равна $\\lambda = ${lam}\\text{ м}$, а частота колебаний — $\\nu = ${nu}\\text{ Гц}$. Найдите скорость распространения волны.`,
          options,
          answer,
          explanation: `Скорость волны связана с длиной и частотой формулой $v = \\lambda \\nu = ${lam} \\cdot ${nu} = ${v}\\text{ м/с}$.`,
          hint: 'Используйте формулу $v = \\lambda \\nu$.',
          difficulty,
        };
      }
      if (mode === 'lens') {
        const fCm = rng.pick([10, 20, 25, 50]);
        const d = 100 / fCm;
        const { options, answer } = buildNumericSingle(rng, d, 'дптр', [fCm, d * 2, d + 1, Math.max(0.5, d / 2)]);
        return {
          stem: `Фокусное расстояние собирающей линзы равно $F = ${fCm}\\text{ см}$. Определите её оптическую силу.`,
          options,
          answer,
          explanation: `Переведём фокусное расстояние в метры: $F = ${fCm / 100}\\text{ м}$. Оптическая сила $D = \\frac{1}{F} = \\frac{1}{${fCm / 100}} = ${d}\\text{ дптр}$.`,
          hint: 'Оптическая сила $D = \\frac{1}{F}$, где $F$ в метрах.',
          difficulty,
        };
      }
      const n0 = rng.pick([160, 240, 320, 400, 480, 640]);
      const k = rng.int(2, 4);
      const tHalf = rng.int(2, 12);
      const rem = n0 / Math.pow(2, k);
      const { options, answer } = buildNumericSingle(rng, rem, '', [n0 / k, rem * 2, Math.max(5, rem / 2), n0 - rem]);
      return {
        stem: `Изначально имеется $N_0 = ${n0}$ радиоактивных ядер с периодом полураспада $T = ${tHalf}\\text{ сут}$. Сколько нераспавшихся ядер останется через $t = ${tHalf * k}\\text{ сут}$?`,
        options,
        answer,
        explanation: `Прошло $n = \\frac{t}{T} = ${k}$ периодов полураспада. По закону радиоактивного распада $N = \\frac{N_0}{2^n} = \\frac{${n0}}{2^{${k}}} = ${rem}$.`,
        hint: 'Примените закон радиоактивного распада $N = N_0 \\cdot 2^{-t/T}$.',
        difficulty,
      };
    },
  },
  {
    id: 'physics.formulas-match',
    subject: 'physics',
    topic: 'Оптика, волны и атом',
    title: 'Соответствие физических величин и единиц СИ',
    format: 'match',
    difficulty: [1, 2],
    weight: 0.9,
    generate(rng, { difficulty }) {
      const bank = [
        ['Мощность', 'Ватт (Вт)'],
        ['Электрическое сопротивление', 'Ом (Ом)'],
        ['Оптическая сила линзы', 'Диоптрия (дптр)'],
        ['Импульс тела', '$\\text{кг}\\cdot\\text{м/с}$'],
        ['Давление газа', 'Паскаль (Па)'],
        ['Магнитный поток', 'Вебер (Вб)'],
        ['Электрический заряд', 'Кулон (Кл)'],
        ['Частота колебаний', 'Герц (Гц)'],
      ];
      const picked = rng.sample(bank, 4);
      const left = picked.slice(0, 3).map((x) => x[0]);
      const rightShuffled = rng.shuffle(picked.map((x) => x[1]));
      const answer = left.map((_, i) => rightShuffled.indexOf(picked[i][1]));
      return {
        stem: 'Установите соответствие между физическими величинами и их единицами измерения в системе СИ:',
        pairs: { left, right: rightShuffled },
        answer,
        explanation: picked.slice(0, 3).map(([k, v], i) => `${i + 1}) ${k} — ${v}`).join('; ') + '.',
        difficulty,
      };
    },
  },
  {
    id: 'physics.friction-inclined',
    subject: 'physics',
    topic: 'Динамика и законы Ньютона',
    title: 'Развёрнутая задача: движение тела под действием силы и трения',
    format: 'open',
    difficulty: [2, 3],
    weight: 0.8,
    generate(rng, { difficulty }) {
      const m = rng.int(2, 8);
      const mu10 = rng.int(2, 4);
      const a = rng.int(2, 6);
      const fTr = m * mu10;
      const fPull = m * a + fTr;
      return {
        stem: `К бруску массой $m = ${m}\\text{ кг}$, лежащему на горизонтальной поверхности с коэффициентом трения $\\mu = 0,${mu10}$, приложили горизонтальную силу тяги $F = ${fPull}\\text{ Н}$. Запишите формулы и найдите ускорение бруска ($g = 10\\text{ м/с}^2$).`,
        points: 2,
        answer: `<p>1. Сила трения: $F_{\\text{тр}} = \\mu m g = 0,${mu10} \\cdot ${m} \\cdot 10 = ${fTr}\\text{ Н}$.</p><p>2. Второй закон Ньютона: $ma = F - F_{\\text{тр}} \\Rightarrow a = \\frac{${fPull} - ${fTr}}{${m}} = ${a}\\text{ м/с}^2$.</p>`,
        rubric: '<b>2 балла:</b> верно записаны обе формулы ($F_{\\text{тр}} = \\mu mg$ и $ma = F - F_{\\text{тр}}$) и получен ответ.<br><b>1 балл:</b> верна методика решения, но допущена вычислительная ошибка.<br><b>0 баллов:</b> неверный метод.',
        explanation: `Находим силу трения $F_{\\text{тр}} = ${fTr}\\text{ Н}$, затем из второго закона Ньютона $a = \\frac{F - F_{\\text{тр}}}{m} = ${a}\\text{ м/с}^2$.`,
        difficulty,
      };
    },
  },
  {
    id: 'physics.situation-open',
    subject: 'physics',
    topic: 'Оптика, волны и атом',
    title: 'Развёрнутая задача: закон сохранения энергии / электроцепь',
    format: 'open',
    difficulty: [2, 3],
    weight: 0.8,
    generate(rng, { difficulty }) {
      const h = rng.pick([5, 20, 45, 80]);
      const v = Math.round(Math.sqrt(20 * h));
      const m = rng.int(2, 6);
      const eTot = m * 10 * h;
      return {
        stem: `Тело массой $m = ${m}\\text{ кг}$ свободно падает без начальной скорости с высоты $h = ${h}\\text{ м}$ ($g = 10\\text{ м/с}^2$, сопротивлением воздуха пренебречь). Используя закон сохранения механической энергии, найдите полную энергию тела и его скорость в момент удара о землю.`,
        points: 2,
        answer: `<p>1. Полная механическая энергия: $E = E_p = mgh = ${m}\\cdot 10\\cdot ${h} = ${eTot}\\text{ Дж}$.</p><p>2. У земли $E_k = E_p \\Rightarrow \\frac{mv^2}{2} = mgh \\Rightarrow v = \\sqrt{2gh} = \\sqrt{2\\cdot 10\\cdot ${h}} = ${v}\\text{ м/с}$.</p>`,
        rubric: '<b>2 балла:</b> найдены полная энергия $E$ и скорость $v$ с записью закона сохранения энергии.<br><b>1 балл:</b> найдена только одна из двух величин.<br><b>0 баллов:</b> отсутствуют верные уравнения.',
        explanation: `Полная энергия $E = ${eTot}\\text{ Дж}$, скорость у земли $v = \\sqrt{2gh} = ${v}\\text{ м/с}$.`,
        difficulty,
      };
    },
  },
];

export default {
  id: 'physics',
  title: 'Физика',
  taskTypes,
  exam: {
    durationMin: 90,
    expectedTasks: 30,
    scaledMax: 100,
    sections: [
      { title: 'Закрытые задания (№1–22)', from: 0, to: 21 },
      { title: 'Краткий ответ и соответствие (№23–27)', from: 22, to: 26 },
      { title: 'Развёрнутые задачи (№28–30)', from: 27, to: 29 },
    ],
  },
  buildExam(rng) {
    return buildStandardBlockExam('physics', taskTypes, rng);
  },
  score(tasks, earnedList) {
    return scoreStandardBlockExam(tasks, earnedList);
  },
  originals: async () => [],
};
