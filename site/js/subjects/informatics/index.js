// SubjectModule: Информатика (id: 'informatics', DİM Group I RI — 30 tasks, 90 min, 100-point scale).

import {
  buildShuffledSingle,
  buildNumericSingle,
  buildStandardBlockExam,
  scoreStandardBlockExam,
} from '../_shared/block-helpers.js';

const taskTypes = [
  {
    id: 'informatics.radix-single',
    subject: 'informatics',
    topic: 'Системы счисления',
    title: 'Перевод чисел между двоичной, восьмеричной, десятеричной и шестнадцатеричной системами',
    format: 'single',
    difficulty: [1, 3],
    weight: 1.5,
    generate(rng, { difficulty }) {
      const mode = rng.pick(['bin2dec', 'dec2bin', 'hex2dec']);
      if (mode === 'bin2dec') {
        const val = rng.int(11, 125);
        const bin = val.toString(2);
        const { options, answer } = buildNumericSingle(rng, val, '', [val + 2, val - 2, val + 4, val ^ 1]);
        return {
          stem: `Переведите двоичное число $${bin}_2$ в десятичную систему счисления.`,
          options,
          answer,
          explanation: `Раскладываем по степеням двойки: $${bin}_2 = ${val}_{10}$.`,
          hint: 'Сложите степени двойки для тех разрядов, где стоит единица.',
          difficulty,
        };
      }
      if (mode === 'dec2bin') {
        const val = rng.int(10, 62);
        const bin = val.toString(2);
        const dists = [val + 1, val - 1, val + 2, val + 4].map((x) => `$${x.toString(2)}_2$`);
        const { options, answer } = buildShuffledSingle(rng, `$${bin}_2$`, dists);
        return {
          stem: `Как записывается десятичное число $${val}_{10}$ в двоичной системе счисления?`,
          options,
          answer,
          explanation: `Последовательным делением на 2 с записью остатков снизу вверх получаем $${val}_{10} = ${bin}_2$.`,
          hint: 'Делите число на 2 и выписывайте остатки от последнего к первому.',
          difficulty,
        };
      }
      const val = rng.int(26, 239);
      const hex = val.toString(16).toUpperCase();
      const { options, answer } = buildNumericSingle(rng, val, '', [val + 16, val - 16, val + 1, val + 8]);
      return {
        stem: `Переведите шестнадцатеричное число $${hex}_{16}$ в десятичную систему счисления.`,
        options,
        answer,
        explanation: `Учитывая $A=10, B=11, C=12, D=13, E=14, F=15$, получаем $${hex}_{16} = ${val}_{10}$.`,
        hint: 'Умножьте старшую цифру на 16 и прибавьте младшую цифру.',
        difficulty,
      };
    },
  },
  {
    id: 'informatics.radix-conv',
    subject: 'informatics',
    topic: 'Системы счисления',
    title: 'Число единиц в двоичной записи / перевод (краткий ответ)',
    format: 'short',
    difficulty: [1, 3],
    weight: 1.0,
    generate(rng, { difficulty }) {
      const val = rng.int(18, 250);
      const bin = val.toString(2);
      const ones = [...bin].filter((c) => c === '1').length;
      return {
        stem: `Сколько единиц содержится в двоичной записи десятичного числа $${val}$?`,
        answer: String(ones),
        explanation: `Двоичная запись числа $${val}$: $${bin}_2$. Подсчитав цифры «1», получаем $${ones}$.`,
        hint: 'Переведите число в двоичную систему (через степени двойки: 128, 64, 32, 16, 8, 4, 2, 1).',
        difficulty,
      };
    },
  },
  {
    id: 'informatics.info-volume',
    subject: 'informatics',
    topic: 'Кодирование и объём информации',
    title: 'Объём текстового сообщения и единицы измерения информации',
    format: 'single',
    difficulty: [1, 3],
    weight: 1.4,
    generate(rng, { difficulty }) {
      const mode = rng.pick(['text', 'units']);
      if (mode === 'text') {
        const bpc = rng.pick([1, 2]); // 8-bit ASCII / 16-bit UTF-16
        const bitsPerChar = bpc * 8;
        const chars = rng.pick([128, 256, 512, 1024, 2048]);
        const bytes = chars * bpc;
        const { options, answer } = buildNumericSingle(rng, bytes, 'байт', [bytes * 8, bytes / 2, bytes * 2, bytes + 64]);
        return {
          stem: `Сообщение длиной $${chars}$ символов закодировано в кодировке, где каждый символ занимает $${bitsPerChar}\\text{ бит}$. Найдите информационный объём сообщения в байтах.`,
          options,
          answer,
          explanation: `Один символ занимает $\\frac{${bitsPerChar}}{8} = ${bpc}\\text{ байт}$. Весь объём: $${chars} \\cdot ${bpc} = ${bytes}\\text{ байт}$.`,
          hint: 'Разделите биты на 8, чтобы получить байты на символ, затем умножьте на число символов.',
          difficulty,
        };
      }
      const kb = rng.pick([2, 4, 8, 16, 32]);
      const bytes = kb * 1024;
      const { options, answer } = buildNumericSingle(rng, bytes, 'байт', [kb * 1000, bytes * 2, bytes / 2, kb * 512]);
      return {
        stem: `Сколько байт содержится в $${kb}\\text{ Кбайт}$ (в двоичной системе $1\\text{ Кбайт} = 1024\\text{ байт}$)?`,
        options,
        answer,
        explanation: `$${kb} \\cdot 1024 = ${bytes}\\text{ байт}$.`,
        hint: '$1\\text{ Кбайт} = 2^{10} = 1024\\text{ байт}$.',
        difficulty,
      };
    },
  },
  {
    id: 'informatics.image-sound-short',
    subject: 'informatics',
    topic: 'Кодирование и объём информации',
    title: 'Объём растрового изображения (краткий ответ)',
    format: 'short',
    difficulty: [2, 3],
    weight: 1.0,
    generate(rng, { difficulty }) {
      const w = rng.pick([64, 128, 256]);
      const h = rng.pick([64, 128, 256]);
      const colors = rng.pick([16, 64, 256]);
      const depth = Math.round(Math.log2(colors));
      const kb = (w * h * depth) / (8 * 1024);
      return {
        stem: `Растровое изображение размером $${w} \\times ${h}$ пикселей использует палитру из $${colors}$ цветов. Вычислите объём памяти (в Кбайтах), необходимый для хранения этого изображения без сжатия.`,
        answer: String(kb),
        explanation: `Глубина цвета $i = \\log_2(${colors}) = ${depth}\\text{ бит}$. Объём: $\\frac{${w} \\cdot ${h} \\cdot ${depth}}{8 \\cdot 1024} = ${kb}\\text{ Кбайт}$.`,
        hint: 'Найдите глубину цвета $i$ из $2^i = N$, затем $I = \\frac{W \\cdot H \\cdot i}{8 \\cdot 1024}$.',
        difficulty,
      };
    },
  },
  {
    id: 'informatics.boolean-logic',
    subject: 'informatics',
    topic: 'Алгебра логики',
    title: 'Логические выражения (И, ИЛИ, НЕ) и таблицы истинности',
    format: 'single',
    difficulty: [1, 3],
    weight: 1.4,
    generate(rng, { difficulty }) {
      const a = rng.int(4, 14);
      const b = a + rng.int(4, 10);
      const askMax = rng.pick([true, false]);
      if (askMax) {
        // NOT (x >= b) AND (x > a) => a < x < b, max integer = b - 1
        const ans = b - 1;
        const { options, answer } = buildNumericSingle(rng, ans, '', [b, b + 1, a, a + 1]);
        return {
          stem: `Найдите наибольшее целое число $x$, для которого истинно высказывание: $\\text{НЕ }(x \\ge ${b}) \\text{ И } (x > ${a})$.`,
          options,
          answer,
          explanation: `Выражение $\\text{НЕ }(x \\ge ${b})$ равносильно $x < ${b}$. Вместе с $x > ${a}$ получаем $${a} < x < ${b}$. Наибольшее целое: $x = ${ans}$.`,
          hint: 'Сначала раскройте отрицание $\\text{НЕ }(x \\ge b) \\equiv (x < b)$.',
          difficulty,
        };
      }
      // NOT (x <= a) AND (x < b) => a < x < b, min integer = a + 1
      const ans = a + 1;
      const { options, answer } = buildNumericSingle(rng, ans, '', [a, a - 1, b, b - 1]);
      return {
        stem: `Найдите наименьшее целое число $x$, для которого истинно высказывание: $\\text{НЕ }(x \\le ${a}) \\text{ И } (x < ${b})$.`,
        options,
        answer,
        explanation: `Отрицание $\\text{НЕ }(x \\le ${a})$ даёт $x > ${a}$. Условие $${a} < x < ${b}$ выполняется при наименьшем целом $x = ${ans}$.`,
        hint: 'Замените $\\text{НЕ }(x \\le a)$ на строгое неравенство $x > a$.',
        difficulty,
      };
    },
  },
  {
    id: 'informatics.logic-match',
    subject: 'informatics',
    topic: 'Алгебра логики',
    title: 'Соответствие логических операций и их названий',
    format: 'match',
    difficulty: [1, 2],
    weight: 0.9,
    generate(rng, { difficulty }) {
      const bank = [
        ['$A \\land B$ (AND)', 'Конъюнкция (логическое умножение)'],
        ['$A \\lor B$ (OR)', 'Дизъюнкция (логическое сложение)'],
        ['$\\neg A$ (NOT)', 'Инверсия (отрицание)'],
        ['$A \\to B$', 'Импликация (следование)'],
        ['$A \\leftrightarrow B$', 'Эквивалентность (равносильность)'],
      ];
      const picked = rng.sample(bank, 4);
      const left = picked.slice(0, 3).map((x) => x[0]);
      const rightShuffled = rng.shuffle(picked.map((x) => x[1]));
      const answer = left.map((_, i) => rightShuffled.indexOf(picked[i][1]));
      return {
        stem: 'Установите соответствие между логической операцией и её названием:',
        pairs: { left, right: rightShuffled },
        answer,
        explanation: picked.slice(0, 3).map(([k, v], i) => `${i + 1}) ${k} — ${v}`).join('; ') + '.',
        difficulty,
      };
    },
  },
  {
    id: 'informatics.python-trace',
    subject: 'informatics',
    topic: 'Алгоритмы и программирование (Python)',
    title: 'Трассировка цикла на Python (краткий ответ)',
    format: 'short',
    difficulty: [1, 3],
    weight: 1.1,
    generate(rng, { difficulty }) {
      const s0 = rng.int(0, 6);
      const step = rng.int(2, 5);
      const n = rng.int(4, 8);
      let s = s0;
      for (let i = 1; i <= n; i++) s += i * step;
      return {
        stem: `Какое число выведет следующий фрагмент программы на языке Python?<br><code>s = ${s0}</code><br><code>for i in range(1, ${n + 1}):</code><br><code>&nbsp;&nbsp;&nbsp;&nbsp;s = s + i * ${step}</code><br><code>print(s)</code>`,
        answer: String(s),
        explanation: `Цикл перебирает $i = 1, 2, \\dots, ${n}$. Сумма $1 + 2 + \\dots + ${n} = ${(n * (n + 1)) / 2}$. Итог: $s = ${s0} + ${step} \\cdot ${(n * (n + 1)) / 2} = ${s}$.`,
        hint: 'Функция <code>range(1, N+1)</code> перебирает целые числа от 1 до N включительно.',
        difficulty,
      };
    },
  },
  {
    id: 'informatics.algo-complexity',
    subject: 'informatics',
    topic: 'Алгоритмы и программирование (Python)',
    title: 'Списки, условия и алгоритмы в Python',
    format: 'single',
    difficulty: [1, 3],
    weight: 1.4,
    generate(rng, { difficulty }) {
      const a = rng.int(10, 45);
      const b = rng.int(3, 9);
      const op = rng.pick(['//', '%']);
      const res = op === '//' ? Math.floor(a / b) : a % b;
      const { options, answer } = buildNumericSingle(rng, res, '', [op === '//' ? a % b : Math.floor(a / b), res + 1, res + 2, Math.max(0, res - 1)]);
      return {
        stem: `Чему равно значение выражения Python <code>${a} ${op} ${b}</code>?`,
        options,
        answer,
        explanation: op === '//'
          ? `Оператор <code>//</code> выполняет целочисленное деление: $\\lfloor ${a} / ${b} \\rfloor = ${res}$.`
          : `Оператор <code>%</code> возвращает остаток от деления $${a}$ на $${b}$: остаток равен $${res}$.`,
        hint: '<code>//</code> — целая часть от деления, <code>%</code> — остаток от деления.',
        difficulty,
      };
    },
  },
  {
    id: 'informatics.sql-excel',
    subject: 'informatics',
    topic: 'Базы данных и таблицы',
    title: 'Электронные таблицы (Excel) и реляционные базы данных',
    format: 'single',
    difficulty: [1, 3],
    weight: 1.3,
    generate(rng, { difficulty }) {
      const mode = rng.pick(['excel-sum', 'excel-avg', 'db-fact']);
      if (mode === 'excel-sum') {
        const vals = [rng.int(4, 18), rng.int(4, 18), rng.int(4, 18), rng.int(4, 18)];
        const sum = vals.reduce((a, b) => a + b, 0);
        const { options, answer } = buildNumericSingle(rng, sum, '', [sum - vals[3], sum + vals[0], Math.round(sum / 4), sum + 5]);
        return {
          stem: `В ячейках таблицы A1:A4 записаны числа: A1=${vals[0]}, A2=${vals[1]}, A3=${vals[2]}, A4=${vals[3]}. Какое значение вычислит формула <code>=СУММ(A1:A4)</code>?`,
          options,
          answer,
          explanation: `Функция <code>СУММ(A1:A4)</code> складывает все 4 ячейки диапазона: $${vals.join(' + ')} = ${sum}$.`,
          difficulty,
        };
      }
      if (mode === 'excel-avg') {
        const avg = rng.int(6, 22);
        const d = rng.int(2, 6);
        const vals = [avg - d, avg, avg + d];
        const { options, answer } = buildNumericSingle(rng, avg, '', [avg * 3, avg + d, avg - d, avg + 2]);
        return {
          stem: `В ячейках B1=${vals[0]}, B2=${vals[1]}, B3=${vals[2]}. Чему равно значение формулы <code>=СРЗНАЧ(B1:B3)</code>?`,
          options,
          answer,
          explanation: `Среднее арифметическое диапазона: $\\frac{${vals.join(' + ')}}{3} = ${avg}$.`,
          difficulty,
        };
      }
      const bank = [
        { q: 'Как называется строка таблицы в реляционной базе данных?', ok: 'Запись (кортеж)', bad: ['Поле (атрибут)', 'Запрос', 'Индекс', 'Схема'] },
        { q: 'Как называется столбец таблицы в реляционной базе данных?', ok: 'Поле (атрибут)', bad: ['Запись', 'Кортеж', 'Отчёт', 'Ключевое значение'] },
        { q: 'Какой символ фиксирует абсолютную ссылку на строку или столбец в формулах Excel (например, <code>&#36;A&#36;1</code>)?', ok: 'Знак доллара (USD)', bad: ['Решётка (#)', 'Процент (%)', 'Амперсанд (&)', 'Звёздочка (*)'] },
      ];
      const item = rng.pick(bank);
      const { options, answer } = buildShuffledSingle(rng, item.ok, item.bad);
      return { stem: item.q, options, answer, explanation: `Правильный ответ: <b>${item.ok}</b>.`, difficulty };
    },
  },
  {
    id: 'informatics.networks-ip',
    subject: 'informatics',
    topic: 'Компьютерные сети и Интернет',
    title: 'IPv4-адреса, протоколы и скорость передачи данных',
    format: 'single',
    difficulty: [1, 3],
    weight: 1.4,
    generate(rng, { difficulty }) {
      const mode = rng.pick(['transfer', 'proto']);
      if (mode === 'transfer') {
        const speedKbps = rng.pick([64, 128, 256, 512, 1024]);
        const t = rng.pick([4, 8, 16, 32]);
        const kbytes = (speedKbps * t) / 8;
        const { options, answer } = buildNumericSingle(rng, kbytes, 'Кбайт', [speedKbps * t, kbytes * 2, kbytes / 2, kbytes + 32]);
        return {
          stem: `Скорость передачи данных по каналу равна $${speedKbps}\\text{ Кбит/с}$. Сколько Кбайт информации будет передано за $${t}\\text{ с}$?`,
          options,
          answer,
          explanation: `Объём в Кбитах: $${speedKbps} \\cdot ${t} = ${speedKbps * t}\\text{ Кбит}$. Делим на 8 для перевода в Кбайты: $${kbytes}\\text{ Кбайт}$.`,
          hint: 'Не забудьте разделить биты на 8, чтобы получить байты.',
          difficulty,
        };
      }
      const bank = [
        { q: 'Какой протокол отвечает за защищённую передачу веб-страниц в Интернете?', ok: 'HTTPS', bad: ['FTP', 'SMTP', 'ICMP', 'TELNET'] },
        { q: 'Какая служба преобразует доменное имя сайта (например, ulduz.az) в его IP-адрес?', ok: 'DNS', bad: ['DHCP', 'SMTP', 'HTTP', 'SSH'] },
        { q: 'Из скольких байт (октетов) состоит стандартный IPv4-адрес?', ok: '4 байта (32 бита)', bad: ['2 байта (16 бит)', '6 байт (48 бит)', '8 байт (64 бита)', '16 байт (128 бит)'] },
      ];
      const item = rng.pick(bank);
      const { options, answer } = buildShuffledSingle(rng, item.ok, item.bad);
      return { stem: item.q, options, answer, explanation: `Правильный ответ: <b>${item.ok}</b>.`, difficulty };
    },
  },
  {
    id: 'informatics.url-order',
    subject: 'informatics',
    topic: 'Компьютерные сети и Интернет',
    title: 'Сборка корректного URL-адреса ресурса',
    format: 'order',
    difficulty: [1, 2],
    weight: 0.9,
    generate(rng, { difficulty }) {
      const host = rng.pick(['edu.az', 'dim.gov.az', 'ulduz.az', 'school.org']);
      const file = rng.pick(['exam.pdf', 'lesson.html', 'tests.json', 'guide.docx']);
      const parts = ['https://', host, '/docs/', file];
      const indexed = parts.map((text, pos) => ({ text, pos }));
      const shuffled = rng.shuffle(indexed);
      const answer = parts.map((_, targetPos) => shuffled.findIndex((x) => x.pos === targetPos));
      return {
        stem: `Расположите фрагменты адреса так, чтобы получился правильный URL файла <b>${file}</b> на сервере <b>${host}</b> по протоколу HTTPS:`,
        options: shuffled.map((x) => `<code>${x.text}</code>`),
        answer,
        explanation: `Структура URL: протокол + сервер + путь + файл → <code>https://${host}/docs/${file}</code>.`,
        difficulty,
      };
    },
  },
  {
    id: 'informatics.algo-open',
    subject: 'informatics',
    topic: 'Алгоритмы и программирование (Python)',
    title: 'Развёрнутая задача: алгоритм на Python',
    format: 'open',
    difficulty: [2, 3],
    weight: 0.9,
    generate(rng, { difficulty }) {
      const k = rng.pick([2, 3, 5]);
      const lim = rng.pick([20, 30, 50]);
      const sum = Array.from({ length: lim }, (_, i) => i + 1).filter((x) => x % k === 0).reduce((a, b) => a + b, 0);
      return {
        stem: `Напишите на языке Python программу (или пошаговый алгоритм), которая вычисляет сумму всех натуральных чисел от $1$ до $${lim}$, кратных $${k}$, и укажите итоговое число.`,
        points: 2,
        answer: `<p><code>total = 0</code><br><code>for x in range(1, ${lim + 1}):</code><br><code>&nbsp;&nbsp;&nbsp;&nbsp;if x % ${k} == 0:</code><br><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;total += x</code><br><code>print(total)</code></p><p>Итоговый результат: <b>${sum}</b>.</p>`,
        rubric: '<b>2 балла:</b> приведён рабочий цикл с проверкой кратности <code>%</code> и верный численный результат.<br><b>1 балл:</b> алгоритм верен, но допущена неточность в границе диапазона или сумме.<br><b>0 баллов:</b> неверный алгоритм.',
        explanation: `Сумма чисел от 1 до ${lim}, кратных ${k}, равна <b>${sum}</b>.`,
        difficulty,
      };
    },
  },
];

export default {
  id: 'informatics',
  title: 'Информатика',
  taskTypes,
  exam: {
    durationMin: 90,
    expectedTasks: 30,
    scaledMax: 100,
    sections: [
      { title: 'Теория, логика и сети (№1–22)', from: 0, to: 21 },
      { title: 'Системы счисления, Python и соответствие (№23–27)', from: 22, to: 26 },
      { title: 'Развёрнутые алгоритмические задачи (№28–30)', from: 27, to: 29 },
    ],
  },
  buildExam(rng) {
    return buildStandardBlockExam('informatics', taskTypes, rng);
  },
  score(tasks, earnedList) {
    return scoreStandardBlockExam(tasks, earnedList);
  },
  originals: async () => [],
};
