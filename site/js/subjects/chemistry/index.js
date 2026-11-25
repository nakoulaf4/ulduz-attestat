// SubjectModule: Химия (id: 'chemistry', DİM Groups I & IV — 30 tasks, 90 min, 100-point scale).

import {
  buildShuffledSingle,
  buildNumericSingle,
  buildStandardBlockExam,
  scoreStandardBlockExam,
} from '../_shared/block-helpers.js';

const ELEMENTS = [
  { sym: 'C', name: 'Углерод', z: 6, a: 12, period: 2, group: 'IVA' },
  { sym: 'N', name: 'Азот', z: 7, a: 14, period: 2, group: 'VA' },
  { sym: 'O', name: 'Кислород', z: 8, a: 16, period: 2, group: 'VIA' },
  { sym: 'F', name: 'Фтор', z: 9, a: 19, period: 2, group: 'VIIA' },
  { sym: 'Na', name: 'Натрий', z: 11, a: 23, period: 3, group: 'IA' },
  { sym: 'Mg', name: 'Магний', z: 12, a: 24, period: 3, group: 'IIA' },
  { sym: 'Al', name: 'Алюминий', z: 13, a: 27, period: 3, group: 'IIIA' },
  { sym: 'Si', name: 'Кремний', z: 14, a: 28, period: 3, group: 'IVA' },
  { sym: 'P', name: 'Фосфор', z: 15, a: 31, period: 3, group: 'VA' },
  { sym: 'S', name: 'Сера', z: 16, a: 32, period: 3, group: 'VIA' },
  { sym: 'Cl', name: 'Хлор', z: 17, a: 35, period: 3, group: 'VIIA' },
  { sym: 'K', name: 'Калий', z: 19, a: 39, period: 4, group: 'IA' },
  { sym: 'Ca', name: 'Кальций', z: 20, a: 40, period: 4, group: 'IIA' },
  { sym: 'Fe', name: 'Железо', z: 26, a: 56, period: 4, group: 'VIIIB' },
];

const MOLAR_BANK = [
  { formula: 'H_2O', m: 18, calc: '2\\cdot 1 + 16 = 18' },
  { formula: 'CO_2', m: 44, calc: '12 + 2\\cdot 16 = 44' },
  { formula: 'NH_3', m: 17, calc: '14 + 3\\cdot 1 = 17' },
  { formula: 'CH_4', m: 16, calc: '12 + 4\\cdot 1 = 16' },
  { formula: 'NaOH', m: 40, calc: '23 + 16 + 1 = 40' },
  { formula: 'H_2SO_4', m: 98, calc: '2\\cdot 1 + 32 + 4\\cdot 16 = 98' },
  { formula: 'CaCO_3', m: 100, calc: '40 + 12 + 3\\cdot 16 = 100' },
  { formula: 'HNO_3', m: 63, calc: '1 + 14 + 3\\cdot 16 = 63' },
  { formula: 'Na_2CO_3', m: 106, calc: '2\\cdot 23 + 12 + 3\\cdot 16 = 106' },
  { formula: 'Al_2O_3', m: 102, calc: '2\\cdot 27 + 3\\cdot 16 = 102' },
  { formula: 'SO_3', m: 80, calc: '32 + 3\\cdot 16 = 80' },
  { formula: 'KOH', m: 56, calc: '39 + 16 + 1 = 56' },
];

const OXIDATION_BANK = [
  { formula: 'H_2SO_4', el: 'серы (S)', val: 6, note: '$2(+1) + x + 4(-2) = 0 \\Rightarrow x = +6$' },
  { formula: 'HNO_3', el: 'азота (N)', val: 5, note: '$(+1) + x + 3(-2) = 0 \\Rightarrow x = +5$' },
  { formula: 'KMnO_4', el: 'марганца (Mn)', val: 7, note: '$(+1) + x + 4(-2) = 0 \\Rightarrow x = +7$' },
  { formula: 'H_3PO_4', el: 'фосфора (P)', val: 5, note: '$3(+1) + x + 4(-2) = 0 \\Rightarrow x = +5$' },
  { formula: 'K_2Cr_2O_7', el: 'хрома (Cr)', val: 6, note: '$2(+1) + 2x + 7(-2) = 0 \\Rightarrow x = +6$' },
  { formula: 'H_2SO_3', el: 'серы (S)', val: 4, note: '$2(+1) + x + 3(-2) = 0 \\Rightarrow x = +4$' },
  { formula: 'Na_2CO_3', el: 'углерода (C)', val: 4, note: '$2(+1) + x + 3(-2) = 0 \\Rightarrow x = +4$' },
  { formula: 'HClO_4', el: 'хлора (Cl)', val: 7, note: '$(+1) + x + 4(-2) = 0 \\Rightarrow x = +7$' },
  { formula: 'NH_3', el: 'азота (N)', val: -3, note: '$x + 3(+1) = 0 \\Rightarrow x = -3$' },
  { formula: 'H_2S', el: 'серы (S)', val: -2, note: '$2(+1) + x = 0 \\Rightarrow x = -2$' },
];

const taskTypes = [
  {
    id: 'chemistry.atom-structure',
    subject: 'chemistry',
    topic: 'Строение атома и Периодический закон',
    title: 'Протоны, нейтроны, электроны и энергетические уровни',
    format: 'single',
    difficulty: [1, 3],
    weight: 1.4,
    generate(rng, { difficulty }) {
      const el = rng.pick(ELEMENTS);
      const mode = rng.pick(['neutrons', 'protons', 'period']);
      if (mode === 'neutrons') {
        const n = el.a - el.z;
        const { options, answer } = buildNumericSingle(rng, n, '', [el.z, el.a, n + 2, Math.max(1, n - 2)]);
        return {
          stem: `Сколько нейтронов содержится в ядре изотопа $^{${el.a}}_{${el.z}}\\text{${el.sym}}$ (${el.name})?`,
          options,
          answer,
          explanation: `Число нейтронов $N = A - Z = ${el.a} - ${el.z} = ${n}$.`,
          hint: 'Вычтите порядковый номер $Z$ из массового числа $A$.',
          difficulty,
        };
      }
      if (mode === 'protons') {
        const charge = rng.pick([1, 2]);
        const isCation = el.z >= 11 && el.z <= 20 && el.z !== 16 && el.z !== 17;
        const eCount = isCation ? el.z - charge : el.z + charge;
        const sign = isCation ? `${charge}+` : `${charge}-`;
        const { options, answer } = buildNumericSingle(rng, eCount, '', [el.z, isCation ? el.z + charge : el.z - charge, el.a, eCount + 2]);
        return {
          stem: `Сколько электронов содержит ион $\\text{${el.sym}}^{${sign}}$, если порядковый номер элемента $Z = ${el.z}$?`,
          options,
          answer,
          explanation: `У нейтрального атома $${el.z}$ электронов. Заряд $${sign}$ означает ${isCation ? `отдачу ${charge} электрон(ов)` : `присоединение ${charge} электрон(ов)`}, значит электронов $${eCount}$.`,
          hint: 'Катион ($+$) отдаёт электроны, анион ($-$) присоединяет.',
          difficulty,
        };
      }
      const { options, answer } = buildNumericSingle(rng, el.period, '', [el.period + 1, el.period + 2, Math.max(1, el.period - 1), el.period + 3]);
      return {
        stem: `Сколько электронных слоёв (энергетических уровней) имеет атом элемента $\\text{${el.sym}}$ (${el.name}, $Z = ${el.z}$)?`,
        options,
        answer,
        explanation: `Число электронных уровней равно номеру периода. Элемент $\\text{${el.sym}}$ находится в ${el.period}-м периоде, значит у него ${el.period} уровня(ей).`,
        hint: 'Количество энергетических уровней совпадает с номером периода.',
        difficulty,
      };
    },
  },
  {
    id: 'chemistry.bond-types',
    subject: 'chemistry',
    topic: 'Химическая связь и степени окисления',
    title: 'Типы химической связи',
    format: 'single',
    difficulty: [1, 2],
    weight: 1.3,
    generate(rng, { difficulty }) {
      const bank = [
        { formula: 'NaCl', type: 'Ионная', why: 'металл (Na) и неметалл (Cl)' },
        { formula: 'KBr', type: 'Ионная', why: 'металл (K) и неметалл (Br)' },
        { formula: 'CaO', type: 'Ионная', why: 'активный металл (Ca) и неметалл (O)' },
        { formula: 'HCl', type: 'Ковалентная полярная', why: 'два разных неметалла (H и Cl)' },
        { formula: 'H_2O', type: 'Ковалентная полярная', why: 'два разных неметалла (H и O)' },
        { formula: 'NH_3', type: 'Ковалентная полярная', why: 'разные неметаллы (N и H)' },
        { formula: 'O_2', type: 'Ковалентная неполярная', why: 'атомы одного неметалла (O–O)' },
        { formula: 'N_2', type: 'Ковалентная неполярная', why: 'атомы одного неметалла (N≡N)' },
        { formula: 'Cl_2', type: 'Ковалентная неполярная', why: 'атомы одного неметалла (Cl–Cl)' },
        { formula: 'Fe', type: 'Металлическая', why: 'простое вещество — металл' },
        { formula: 'Cu', type: 'Металлическая', why: 'простое вещество — металл' },
      ];
      const item = rng.pick(bank);
      const allTypes = ['Ионная', 'Ковалентная полярная', 'Ковалентная неполярная', 'Металлическая', 'Водородная'];
      const { options, answer } = buildShuffledSingle(rng, item.type, allTypes.filter((x) => x !== item.type));
      return {
        stem: `Какой основной тип химической связи реализуется в веществе $${item.formula}$?`,
        options,
        answer,
        explanation: `В веществе $${item.formula}$ связь — <b>${item.type.toLowerCase()}</b> (${item.why}).`,
        hint: 'Сравните природу элементов: металл+неметалл, разные неметаллы, одинаковые неметаллы или металл.',
        difficulty,
      };
    },
  },
  {
    id: 'chemistry.oxidation-state',
    subject: 'chemistry',
    topic: 'Химическая связь и степени окисления',
    title: 'Определение степени окисления (краткий ответ)',
    format: 'short',
    difficulty: [1, 3],
    weight: 1.0,
    generate(rng, { difficulty }) {
      const item = rng.pick(OXIDATION_BANK);
      return {
        stem: `Определите степень окисления ${item.el} в соединении $${item.formula}$. Введите целое число (со знаком «-», если отрицательная).`,
        answer: String(item.val),
        accept: item.val > 0 ? [`+${item.val}`] : [],
        explanation: `Сумма степеней окисления в нейтральной молекуле равна 0: ${item.note}.`,
        hint: 'Обычно $O$ имеет степень $-2$, $H$ — $+1$, щелочные металлы — $+1$.',
        difficulty,
      };
    },
  },
  {
    id: 'chemistry.molar-mass',
    subject: 'chemistry',
    topic: 'Молярная масса и расчёты по формулам',
    title: 'Молярная масса и количество вещества (краткий ответ)',
    format: 'short',
    difficulty: [1, 3],
    weight: 1.0,
    generate(rng, { difficulty }) {
      const item = rng.pick(MOLAR_BANK);
      const n = rng.int(1, 5);
      const mass = item.m * n;
      if (n === 1) {
        return {
          stem: `Вычислите молярную массу вещества $${item.formula}$ (в г/моль).`,
          answer: String(item.m),
          explanation: `Суммируем атомные массы элементов: $M(${item.formula}) = ${item.calc}\\text{ г/моль}$.`,
          hint: 'Сложите относительные атомные массы всех атомов в формуле.',
          difficulty,
        };
      }
      return {
        stem: `Найдите массу $${n}\\text{ моль}$ вещества $${item.formula}$ (в граммах).`,
        answer: String(mass),
        explanation: `Сначала $M(${item.formula}) = ${item.calc}\\text{ г/моль}$, затем $m = n \\cdot M = ${n} \\cdot ${item.m} = ${mass}\\text{ г}$.`,
        hint: 'Используйте формулу $m = n \\cdot M$.',
        difficulty,
      };
    },
  },
  {
    id: 'chemistry.mass-fraction',
    subject: 'chemistry',
    topic: 'Молярная масса и расчёты по формулам',
    title: 'Количество вещества, объём газа при н.у. и закон Авогадро',
    format: 'single',
    difficulty: [1, 3],
    weight: 1.4,
    generate(rng, { difficulty }) {
      const mode = rng.pick(['volume', 'moles']);
      if (mode === 'volume') {
        const n = rng.pick([0.5, 1, 1.5, 2, 2.5, 3, 4, 5]);
        const v = Math.round(n * 22.4 * 10) / 10;
        const gas = rng.pick(['CO_2', 'O_2', 'N_2', 'CH_4', 'H_2', 'SO_2']);
        const { options, answer } = buildNumericSingle(rng, v, 'л', [v * 2, Math.round((v / 2) * 10) / 10, v + 11.2, Math.max(2.2, v - 11.2)]);
        return {
          stem: `Какой объём (при н.у.) занимает $${String(n).replace('.', ',')}\\text{ моль}$ газа $${gas}$?`,
          options,
          answer,
          explanation: `Молярный объём любого газа при н.у. $V_m = 22,4\\text{ л/моль}$. Поэтому $V = n \\cdot V_m = ${String(n).replace('.', ',')} \\cdot 22,4 = ${String(v).replace('.', ',')}\\text{ л}$.`,
          hint: 'Примените $V = n \\cdot 22,4\\text{ л/моль}$.',
          difficulty,
        };
      }
      const item = rng.pick(MOLAR_BANK);
      const n = rng.pick([0.5, 1, 2, 3, 4, 5]);
      const m = item.m * n;
      const { options, answer } = buildNumericSingle(rng, n, 'моль', [n * 2, n + 1, n + 2, Math.max(0.25, n / 2)]);
      return {
        stem: `Определите количество вещества (в моль) в порции $${item.formula}$ массой $${m}\\text{ г}$.`,
        options,
        answer,
        explanation: `Молярная масса $M(${item.formula}) = ${item.m}\\text{ г/моль}$, тогда $n = \\frac{m}{M} = \\frac{${m}}{${item.m}} = ${String(n).replace('.', ',')}\\text{ моль}$.`,
        hint: 'Разделите массу вещества на его молярную массу: $n = \\frac{m}{M}$.',
        difficulty,
      };
    },
  },
  {
    id: 'chemistry.solutions-percent',
    subject: 'chemistry',
    topic: 'Растворы и концентрация',
    title: 'Массовая доля растворённого вещества',
    format: 'single',
    difficulty: [1, 3],
    weight: 1.4,
    generate(rng, { difficulty }) {
      const mSolute = rng.pick([10, 15, 20, 25, 30, 40, 50]);
      const w = rng.pick([10, 20, 25]);
      const mSol = Math.round((mSolute * 100) / w);
      const mWater = mSol - mSolute;
      const salt = rng.pick(['NaCl', 'KCl', 'NaNO_3', 'CuSO_4', 'сахара']);
      const { options, answer } = buildNumericSingle(rng, w, '\\%', [w + 5, w + 10, Math.max(5, w - 5), Math.round((mSolute / mWater) * 100)]);
      return {
        stem: `В $${mWater}\\text{ г}$ воды растворили $${mSolute}\\text{ г}$ ${salt}. Найдите массовую долю растворённого вещества в полученном растворе.`,
        options,
        answer,
        explanation: `Масса раствора $m_{\\text{р-ра}} = ${mWater} + ${mSolute} = ${mSol}\\text{ г}$. Массовая доля $\\omega = \\frac{${mSolute}}{${mSol}} \\cdot 100\\% = ${w}\\%$.`,
        hint: 'Не забудьте прибавить массу соли к массе воды, чтобы получить массу раствора.',
        difficulty,
      };
    },
  },
  {
    id: 'chemistry.reactions-single',
    subject: 'chemistry',
    topic: 'Классы неорганических соединений и реакции',
    title: 'Типы реакций, оксиды, кислоты и соли',
    format: 'single',
    difficulty: [1, 3],
    weight: 1.3,
    generate(rng, { difficulty }) {
      const bank = [
        { q: 'Какое из веществ относится к амфотерным оксидам?', ok: '$Al_2O_3$', bad: ['$Na_2O$', '$CO_2$', '$CaO$', '$SO_3$'], exp: '$Al_2O_3$ (как и $ZnO$) проявляет и основные, и кислотные свойства.' },
        { q: 'Какое вещество относится к основным оксидам?', ok: '$CaO$', bad: ['$SO_2$', '$P_2O_5$', '$CO_2$', '$SiO_2$'], exp: '$CaO$ — оксид металла со степенью окисления $+2$, типичный основный оксид.' },
        { q: 'Какое вещество относится к кислотным оксидам?', ok: '$SO_3$', bad: ['$K_2O$', '$MgO$', '$BaO$', '$Na_2O$'], exp: '$SO_3$ — оксид неметалла, соответствует серной кислоте $H_2SO_4$.' },
        { q: 'Какая реакция является реакцией нейтрализации?', ok: '$NaOH + HCl \\to NaCl + H_2O$', bad: ['$Zn + 2HCl \\to ZnCl_2 + H_2$', '$2H_2O \\to 2H_2 + O_2$', '$CaO + CO_2 \\to CaCO_3$', '$Fe + CuSO_4 \\to FeSO_4 + Cu$'], exp: 'Нейтрализация — взаимодействие основания и кислоты с образованием соли и воды.' },
        { q: 'Какой индикатор окрашивается в малиновый цвет в щелочной среде?', ok: 'Фенолфталеин', bad: ['Метилоранж', 'Лакмус (синий)', 'Йодная вода', 'Хлорид бария'], exp: 'Фенолфталеин бесцветен в нейтральной/кислой среде и малиновый в щелочной.' },
        { q: 'Реакция $CaCO_3 \\xrightarrow{t} CaO + CO_2$ относится к типу:', ok: 'Разложения', bad: ['Соединения', 'Замещения', 'Обмена', 'Нейтрализации'], exp: 'Из одного сложного вещества образуются два более простых — это разложение.' },
        { q: 'Реакция $Zn + 2HCl \\to ZnCl_2 + H_2\\uparrow$ относится к типу:', ok: 'Замещения', bad: ['Соединения', 'Разложения', 'Обмена', 'Полимеризации'], exp: 'Атомы простого вещества ($Zn$) замещают атомы водорода в кислоте.' },
        { q: 'Какой металл НЕ вытесняет водород из разбавленной соляной кислоты $HCl$?', ok: '$Cu$', bad: ['$Zn$', '$Mg$', '$Fe$', '$Al$'], exp: 'Медь ($Cu$) стоит в ряду активности металлов правее водорода.' },
      ];
      const item = rng.pick(bank);
      const { options, answer } = buildShuffledSingle(rng, item.ok, item.bad);
      return {
        stem: item.q,
        options,
        answer,
        explanation: item.exp,
        difficulty,
      };
    },
  },
  {
    id: 'chemistry.inorganic-classes',
    subject: 'chemistry',
    topic: 'Классы неорганических соединений и реакции',
    title: 'Соответствие формулы и класса вещества',
    format: 'match',
    difficulty: [1, 2],
    weight: 0.9,
    generate(rng, { difficulty }) {
      const bank = [
        ['$H_2SO_4$', 'Кислота'],
        ['$NaOH$', 'Основание (щёлочь)'],
        ['$CaCO_3$', 'Средняя соль'],
        ['$SO_3$', 'Кислотный оксид'],
        ['$MgO$', 'Основный оксид'],
        ['$NaHCO_3$', 'Кислая соль'],
      ];
      const picked = rng.sample(bank, 4);
      const left = picked.slice(0, 3).map((x) => x[0]);
      const rightShuffled = rng.shuffle(picked.map((x) => x[1]));
      const answer = left.map((_, i) => rightShuffled.indexOf(picked[i][1]));
      return {
        stem: 'Установите соответствие между химической формулой и классом неорганического соединения:',
        pairs: { left, right: rightShuffled },
        answer,
        explanation: picked.slice(0, 3).map(([k, v], i) => `${i + 1}) ${k} — ${v}`).join('; ') + '.',
        difficulty,
      };
    },
  },
  {
    id: 'chemistry.hydrocarbons',
    subject: 'chemistry',
    topic: 'Органическая химия',
    title: 'Алканы, алкены, алкины и спирты',
    format: 'single',
    difficulty: [1, 3],
    weight: 1.4,
    generate(rng, { difficulty }) {
      const mode = rng.pick(['alkane-m', 'alkene-m', 'alkyne-m', 'class']);
      if (mode === 'alkane-m') {
        const n = rng.int(1, 8);
        const h = 2 * n + 2;
        const m = 14 * n + 2;
        const { options, answer } = buildNumericSingle(rng, m, 'г/моль', [14 * n, 14 * n - 2, m + 14, Math.max(12, m - 14)]);
        return {
          stem: `Определите молярную массу алкана с числом атомов углерода $n = ${n}$ ($C_{${n}}H_{${h}}$).`,
          options,
          answer,
          explanation: `Общая формула алканов $C_n H_{2n+2}$, молярная масса $M = 14n + 2 = 14 \\cdot ${n} + 2 = ${m}\\text{ г/моль}$.`,
          hint: 'Для алканов $M(C_n H_{2n+2}) = 14n + 2$.',
          difficulty,
        };
      }
      if (mode === 'alkene-m') {
        const n = rng.int(2, 8);
        const m = 14 * n;
        const { options, answer } = buildNumericSingle(rng, m, 'г/моль', [14 * n + 2, 14 * n - 2, m + 14, Math.max(14, m - 14)]);
        return {
          stem: `Найдите молярную массу алкена $C_{${n}}H_{${2 * n}}$.`,
          options,
          answer,
          explanation: `Общая формула алкенов $C_n H_{2n}$, следовательно $M = 14n = 14 \\cdot ${n} = ${m}\\text{ г/моль}$.`,
          hint: 'Для алкенов $M(C_n H_{2n}) = 14n$.',
          difficulty,
        };
      }
      if (mode === 'alkyne-m') {
        const n = rng.int(2, 7);
        const m = 14 * n - 2;
        const { options, answer } = buildNumericSingle(rng, m, 'г/моль', [14 * n, 14 * n + 2, m + 14, Math.max(12, m - 14)]);
        return {
          stem: `Найдите молярную массу алкина $C_{${n}}H_{${2 * n - 2}}$.`,
          options,
          answer,
          explanation: `Для алкинов $C_n H_{2n-2}$: $M = 14n - 2 = 14 \\cdot ${n} - 2 = ${m}\\text{ г/моль}$.`,
          hint: 'Для алкинов $M = 14n - 2$.',
          difficulty,
        };
      }
      const cls = [
        { q: 'Общей формуле $C_n H_{2n+2}$ соответствуют:', ok: 'Алканы', bad: ['Алкены', 'Алкины', 'Арены', 'Одноатомные спирты'] },
        { q: 'Какая функциональная группа характерна для карбоновых кислот?', ok: '$-COOH$', bad: ['$-OH$', '$-CHO$', '$-NH_2$', '$-NO_2$'] },
        { q: 'Какая функциональная группа определяет класс спиртов?', ok: '$-OH$', bad: ['$-COOH$', '$-CHO$', '$-NH_2$', '$-CO-$'] },
        { q: 'Какое вещество обесцвечивает бромную воду при комнатной температуре?', ok: 'Этен ($C_2H_4$)', bad: ['Метан ($CH_4$)', 'Этан ($C_2H_6$)', 'Пропан ($C_3H_8$)', 'Бутан ($C_4H_{10}$)'] },
      ];
      const item = rng.pick(cls);
      const { options, answer } = buildShuffledSingle(rng, item.ok, item.bad);
      return {
        stem: item.q,
        options,
        answer,
        explanation: `Правильный ответ: <b>${item.ok}</b>.`,
        difficulty,
      };
    },
  },
  {
    id: 'chemistry.dilution-open',
    subject: 'chemistry',
    topic: 'Растворы и концентрация',
    title: 'Развёрнутая задача: разбавление раствора водой',
    format: 'open',
    difficulty: [2, 3],
    weight: 0.8,
    generate(rng, { difficulty }) {
      const m1 = rng.pick([100, 150, 200, 250]);
      const w1 = rng.pick([20, 30, 40]);
      const mSalt = (m1 * w1) / 100;
      const w2 = w1 / 2;
      const mWaterAdd = m1;
      return {
        stem: `К $${m1}\\text{ г}$ раствора поваренной соли с массовой долей $${w1}\\%$ добавили $${mWaterAdd}\\text{ г}$ чистой воды. Запишите расчёт и определите новую массовую долю соли в растворе.`,
        points: 2,
        answer: `<p>1. Масса соли: $m(\\text{NaCl}) = ${m1} \\cdot 0,${w1} = ${mSalt}\\text{ г}$.</p><p>2. Новая масса раствора: $m_2 = ${m1} + ${mWaterAdd} = ${m1 + mWaterAdd}\\text{ г}$.</p><p>3. Новая массовая доля: $\\omega_2 = \\frac{${mSalt}}{${m1 + mWaterAdd}} \\cdot 100\\% = ${w2}\\%$.</p>`,
        rubric: '<b>2 балла:</b> верно вычислены масса соли, новая масса раствора и итоговая $\\omega_2$.<br><b>1 балл:</b> верная схема расчёта с арифметической неточностью.<br><b>0 баллов:</b> неверный метод.',
        explanation: `При увеличении массы раствора вдвое массовая доля уменьшается вдвое: $\\omega_2 = ${w2}\\%$.`,
        difficulty,
      };
    },
  },
  {
    id: 'chemistry.organic-open',
    subject: 'chemistry',
    topic: 'Органическая химия',
    title: 'Развёрнутая задача: горение углеводорода и объём $CO_2$',
    format: 'open',
    difficulty: [2, 3],
    weight: 0.8,
    generate(rng, { difficulty }) {
      const n = rng.pick([1, 2, 3, 4]);
      const names = { 1: 'метана ($CH_4$)', 2: 'этана ($C_2H_6$)', 3: 'пропана ($C_3H_8$)', 4: 'бутана ($C_4H_{10}$)' };
      const moles = rng.int(1, 3);
      const co2Moles = moles * n;
      const vCo2 = Math.round(co2Moles * 22.4 * 10) / 10;
      return {
        stem: `При полном сгорании $${moles}\\text{ моль}$ ${names[n]} образуются углекислый газ и вода. Запишите уравнение реакции и найдите объём выделившегося $CO_2$ (при н.у.).`,
        points: 2,
        answer: `<p>1. Из $1\\text{ моль}$ $C_${n}H_{${2 * n + 2}}$ образуется $${n}\\text{ моль}$ $CO_2$, значит из $${moles}\\text{ моль}$ получится $n(CO_2) = ${moles}\\cdot ${n} = ${co2Moles}\\text{ моль}$.</p><p>2. Объём $V(CO_2) = ${co2Moles} \\cdot 22,4 = ${String(vCo2).replace('.', ',')}\\text{ л}$.</p>`,
        rubric: '<b>2 балла:</b> верно определено число моль $CO_2$ по уравнению горения и найден объём.<br><b>1 балл:</b> верно найдено $n(CO_2)$, но не переведено в литры.<br><b>0 баллов:</b> неверное решение.',
        explanation: `Каждый атом углерода переходит в молекулу $CO_2$: $V(CO_2) = ${String(vCo2).replace('.', ',')}\\text{ л}$.`,
        difficulty,
      };
    },
  },
];

export default {
  id: 'chemistry',
  title: 'Химия',
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
    return buildStandardBlockExam('chemistry', taskTypes, rng);
  },
  score(tasks, earnedList) {
    return scoreStandardBlockExam(tasks, earnedList);
  },
  originals: async () => [],
};
