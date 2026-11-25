// SubjectModule: Биология (id: 'biology', DİM Group IV — 30 tasks, 90 min, 100-point scale).

import {
  buildShuffledSingle,
  buildNumericSingle,
  buildStandardBlockExam,
  scoreStandardBlockExam,
} from '../_shared/block-helpers.js';

const taskTypes = [
  {
    id: 'biology.cell-organelles',
    subject: 'biology',
    topic: 'Цитология и строение клетки',
    title: 'Органоиды клетки и деление (митоз / мейоз)',
    format: 'single',
    difficulty: [1, 3],
    weight: 1.4,
    generate(rng, { difficulty }) {
      const mode = rng.pick(['fact', 'division']);
      if (mode === 'division') {
        const n2 = rng.pick([16, 20, 24, 32, 38, 40, 46, 48, 54, 60]);
        const isMeiosis = rng.pick([true, false]);
        const res = isMeiosis ? n2 / 2 : n2;
        const { options, answer } = buildNumericSingle(rng, res, '', [isMeiosis ? n2 : n2 / 2, n2 * 2, res + 4, Math.max(2, res - 4)]);
        return {
          stem: `В соматической клетке организма диплоидный набор хромосом равен $2n = ${n2}$. Сколько хромосом будет в каждой дочерней клетке после ${isMeiosis ? 'мейоза (образования гамет)' : 'митоза'}?`,
          options,
          answer,
          explanation: isMeiosis
            ? `При мейозе число хромосом уменьшается вдвое (редукционное деление): $n = \\frac{${n2}}{2} = ${res}$.`
            : `При митозе набор хромосом сохраняется неизменным: $2n = ${res}$.`,
          hint: 'Митоз сохраняет $2n$, мейоз уменьшает набор вдвое до $n$.',
          difficulty,
        };
      }
      const bank = [
        { q: 'Какой органоид является «энергетической станцией» клетки и синтезирует АТФ?', ok: 'Митохондрия', bad: ['Рибосома', 'Лизосома', 'Аппарат Гольджи', 'Клеточный центр'] },
        { q: 'Какой немембранный органоид отвечает за биосинтез белка?', ok: 'Рибосома', bad: ['Митохондрия', 'Хлоропласт', 'Лизосома', 'Вакуоль'] },
        { q: 'Какой органоид растительной клетки осуществляет фотосинтез?', ok: 'Хлоропласт', bad: ['Лейкопласт', 'Лизосома', 'Рибосома', 'Центриоль'] },
        { q: 'В каком органоиде содержатся гидролитические ферменты для внутриклеточного переваривания?', ok: 'Лизосома', bad: ['Рибосома', 'Хлоропласт', 'Ядрышко', 'Микротрубочка'] },
        { q: 'Из какого полисахарида в основном состоит клеточная стенка растений?', ok: 'Целлюлоза', bad: ['Хитин', 'Муреин', 'Гликоген', 'Крахмал'] },
        { q: 'Из какого вещества состоит клеточная стенка грибов?', ok: 'Хитин', bad: ['Целлюлоза', 'Муреин', 'Глюкоза', 'Коллаген'] },
        { q: 'Какие организмы НЕ имеют оформленного мембранного ядра (прокариоты)?', ok: 'Бактерии', bad: ['Грибы', 'Мхи', 'Простейшие', 'Папоротники'] },
      ];
      const item = rng.pick(bank);
      const { options, answer } = buildShuffledSingle(rng, item.ok, item.bad);
      return {
        stem: item.q,
        options,
        answer,
        explanation: `Верный ответ: <b>${item.ok}</b>.`,
        difficulty,
      };
    },
  },
  {
    id: 'biology.organelles-match',
    subject: 'biology',
    topic: 'Цитология и строение клетки',
    title: 'Соответствие органоида и его функции',
    format: 'match',
    difficulty: [1, 2],
    weight: 0.9,
    generate(rng, { difficulty }) {
      const bank = [
        ['Митохондрия', 'Синтез АТФ при клеточном дыхании'],
        ['Рибосома', 'Сборка полипептидной цепи (синтез белка)'],
        ['Аппарат Гольджи', 'Сортировка, упаковка и транспорт веществ'],
        ['Хлоропласт', 'Фотосинтез и образование глюкозы'],
        ['Лизосома', 'Расщепление макромолекул ферментами'],
        ['Ядро', 'Хранение и передача наследственной информации'],
      ];
      const picked = rng.sample(bank, 4);
      const left = picked.slice(0, 3).map((x) => x[0]);
      const rightShuffled = rng.shuffle(picked.map((x) => x[1]));
      const answer = left.map((_, i) => rightShuffled.indexOf(picked[i][1]));
      return {
        stem: 'Установите соответствие между органоидом клетки и его основной функцией:',
        pairs: { left, right: rightShuffled },
        answer,
        explanation: picked.slice(0, 3).map(([k, v], i) => `${i + 1}) ${k} — ${v}`).join('; ') + '.',
        difficulty,
      };
    },
  },
  {
    id: 'biology.genetics-cross',
    subject: 'biology',
    topic: 'Генетика и законы Менделя',
    title: 'Моногибридное и анализирующее скрещивание',
    format: 'single',
    difficulty: [1, 3],
    weight: 1.4,
    generate(rng, { difficulty }) {
      const scenarios = [
        { cross: '$Aa \\times Aa$', trait: 'рецессивный признак ($aa$) при полном доминировании', pct: 25, exp: 'По второму закону Менделя ($Aa \\times Aa$) расщепление $1AA : 2Aa : 1aa$, доля $aa$ равна $25\\%$.' },
        { cross: '$Aa \\times Aa$', trait: 'доминантный фенотип ($AA$ или $Aa$) при полном доминировании', pct: 75, exp: 'Доминантный фенотип дают генотипы $AA$ и $Aa$ ($3/4 = 75\\%$).' },
        { cross: '$Aa \\times Aa$', trait: 'гетерозиготный генотип ($Aa$)', pct: 50, exp: 'Из $1AA : 2Aa : 1aa$ гетерозиготы составляют $2/4 = 50\\%$.' },
        { cross: '$Aa \\times aa$', trait: 'рецессивный признак ($aa$) при анализирующем скрещивании', pct: 50, exp: 'При скрещивании $Aa \\times aa$ потомство $1Aa : 1aa$, доля $aa$ равна $50\\%$.' },
        { cross: '$AA \\times aa$', trait: 'доминантный фенотип в первом поколении $F_1$', pct: 100, exp: 'По первому закону Менделя (единообразия) все потомки $Aa$ ($100\\%$).' },
        { cross: '$Aa \\times AA$', trait: 'гетерозиготный генотип ($Aa$)', pct: 50, exp: 'При $Aa \\times AA$ получается $1AA : 1Aa$, значит доля $Aa$ равна $50\\%$.' },
      ];
      const sc = rng.pick(scenarios);
      const { options, answer } = buildNumericSingle(rng, sc.pct, '\\%', [0, 25, 50, 75, 100].filter((v) => v !== sc.pct));
      return {
        stem: `При скрещивании организмов с генотипами ${sc.cross} какова вероятность (%) появления потомства, имеющего ${sc.trait}?`,
        options,
        answer,
        explanation: sc.exp,
        hint: 'Постройте решётку Пеннета для заданных родительских гамет.',
        difficulty,
      };
    },
  },
  {
    id: 'biology.genetics-short',
    subject: 'biology',
    topic: 'Генетика и законы Менделя',
    title: 'Число типов гамет и фенотипов (краткий ответ)',
    format: 'short',
    difficulty: [1, 3],
    weight: 1.0,
    generate(rng, { difficulty }) {
      const bank = [
        { g: 'AaBb', het: 2, ans: 4 },
        { g: 'AaBbCc', het: 3, ans: 8 },
        { g: 'AABb', het: 1, ans: 2 },
        { g: 'AaBBcc', het: 1, ans: 2 },
        { g: 'AAbbCC', het: 0, ans: 1 },
        { g: 'AaBbCCDd', het: 3, ans: 8 },
        { g: 'aaBbCc', het: 2, ans: 4 },
      ];
      const item = rng.pick(bank);
      return {
        stem: `Сколько типов гамет образует организм с генотипом $${item.g}$ при независимом наследовании признаков?`,
        answer: String(item.ans),
        explanation: `Число типов гамет равно $2^k$, где $k$ — число гетерозиготных пар. Здесь $k = ${item.het}$, поэтому $2^{${item.het}} = ${item.ans}$.`,
        hint: 'Используйте формулу $2^k$, где $k$ — количество гетерозиготных пар аллелей.',
        difficulty,
      };
    },
  },
  {
    id: 'biology.dna-chargaff',
    subject: 'biology',
    topic: 'ДНК, РНК и биосинтез белка',
    title: 'Правило Чаргаффа и расчёт нуклеотидов ДНК (краткий ответ)',
    format: 'short',
    difficulty: [1, 3],
    weight: 1.1,
    generate(rng, { difficulty }) {
      const mode = rng.pick(['percent', 'amino']);
      if (mode === 'percent') {
        const aPct = rng.int(12, 38);
        const gPct = 50 - aPct;
        const ask = rng.pick(['гуаниловых (Г)', 'цитидиловых (Ц)']);
        return {
          stem: `В двухцепочечной молекуле ДНК доля адениловых нуклеотидов (А) составляет $${aPct}\\%$. Определите процентное содержание ${ask} нуклеотидов (введите только число).`,
          answer: String(gPct),
          explanation: `По правилу Чаргаффа $А = Т = ${aPct}\\%$ и $А + Г = 50\\%$, откуда $Г = Ц = 50\\% - ${aPct}\\% = ${gPct}\\%$.`,
          hint: 'В двухцепочечной ДНК $А = Т$, $Г = Ц$ и $А + Г = 50\\%$.',
          difficulty,
        };
      }
      const aaCount = rng.int(15, 95);
      const nucs = aaCount * 3;
      return {
        stem: `Полипептидная цепь белка состоит из $${aaCount}$ аминокислот. Сколько нуклеотидов содержит кодирующий участок иРНК (без учёта стоп-кодона)?`,
        answer: String(nucs),
        explanation: `Каждая аминокислота кодируется триплетом (3 нуклеотидами) иРНК: $${aaCount} \\cdot 3 = ${nucs}$ нуклеотидов.`,
        hint: '1 аминокислота = 1 кодон = 3 нуклеотида иРНК.',
        difficulty,
      };
    },
  },
  {
    id: 'biology.human-anatomy',
    subject: 'biology',
    topic: 'Анатомия и физиология человека',
    title: 'Системы органов человека и регуляция',
    format: 'single',
    difficulty: [1, 3],
    weight: 1.4,
    generate(rng, { difficulty }) {
      const bank = [
        { q: 'Какой гормон поджелудочной железы снижает уровень глюкозы в крови?', ok: 'Инсулин', bad: ['Адреналин', 'Глюкагон', 'Тироксин', 'Соматотропин'] },
        { q: 'Какие форменные элементы крови переносят кислород благодаря гемоглобину?', ok: 'Эритроциты', bad: ['Лейкоциты', 'Тромбоциты', 'Лимфоциты', 'Фагоциты'] },
        { q: 'Какой отдел головного мозга отвечает за координацию движений и равновесие?', ok: 'Мозжечок', bad: ['Продолговатый мозг', 'Гипоталамус', 'Мост', 'Средний мозг'] },
        { q: 'В какой камере сердца человека начинается большой круг кровообращения?', ok: 'В левом желудочке', bad: ['В правом желудочке', 'В левом предсердии', 'В правом предсердии', 'В аортальном клапане'] },
        { q: 'Какой витамин необходим для усвоения кальция и профилактики рахита?', ok: 'Витамин D', bad: ['Витамин C', 'Витамин B₁', 'Витамин A', 'Витамин K'] },
        { q: 'Где в норме происходит окончательное расщепление и всасывание питательных веществ?', ok: 'В тонком кишечнике', bad: ['В пищеводе', 'В ротовой полости', 'В толстом кишечнике', 'В глотке'] },
        { q: 'Какие клетки крови отвечают за её свёртывание?', ok: 'Тромбоциты', bad: ['Эритроциты', 'Нейроны', 'Макрофаги', 'Миоциты'] },
      ];
      const item = rng.pick(bank);
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
    id: 'biology.blood-circulation',
    subject: 'biology',
    topic: 'Анатомия и физиология человека',
    title: 'Последовательность этапов кровообращения / рефлекса',
    format: 'order',
    difficulty: [1, 3],
    weight: 0.9,
    generate(rng, { difficulty }) {
      const seqs = [
        {
          stem: 'Расположите звенья рефлекторной дуги в правильной последовательности прохождения нервного импульса:',
          items: ['Рецептор', 'Чувствительный нейрон', 'Вставочный нейрон (ЦНС)', 'Двигательный нейрон', 'Рабочий орган (эффектор)'],
        },
        {
          stem: 'Расположите отделы большого круга кровообращения по ходу движения крови:',
          items: ['Левый желудочек', 'Аорта и артерии', 'Капилляры органов (газообмен)', 'Верхняя и нижняя полые вены', 'Правое предсердие'],
        },
        {
          stem: 'Расположите отделы пищеварительного тракта человека в порядке прохождения пищи:',
          items: ['Ротовая полость', 'Глотка и пищевод', 'Желудок', 'Тонкий кишечник', 'Толстый кишечник'],
        },
      ];
      const chosen = rng.pick(seqs);
      const indexed = chosen.items.map((text, pos) => ({ text, pos }));
      const shuffled = rng.shuffle(indexed);
      const answer = chosen.items.map((_, targetPos) => shuffled.findIndex((x) => x.pos === targetPos));
      return {
        stem: chosen.stem,
        options: shuffled.map((x) => x.text),
        answer,
        explanation: `Верный порядок: ${chosen.items.join(' → ')}.`,
        difficulty,
      };
    },
  },
  {
    id: 'biology.botany-zoology',
    subject: 'biology',
    topic: 'Ботаника и зоология',
    title: 'Систематика растений и животных',
    format: 'single',
    difficulty: [1, 2],
    weight: 1.3,
    generate(rng, { difficulty }) {
      const bank = [
        { q: 'Какая ткань растений проводит воду и минеральные соли от корней к листьям?', ok: 'Ксилема (сосуды древесины)', bad: ['Флоэма (ситовидные трубки)', 'Эпидермис', 'Пробка', 'Механическая ткань'] },
        { q: 'Какое животное относится к классу Земноводные (Амфибии)?', ok: 'Тритон', bad: ['Ящерица', 'Черепаха', 'Крокодил', 'Уж'] },
        { q: 'Сколько камер имеет сердце у птиц и млекопитающих?', ok: '4 камеры (полная перегородка)', bad: ['2 камеры', '3 камеры без перегородки', '3 камеры с неполной перегородкой', '5 камер'] },
        { q: 'Двойное оплодотворение характерно исключительно для:', ok: 'Покрытосеменных (цветковых) растений', bad: ['Голосеменных', 'Папоротников', 'Мхов', 'Водорослей'] },
        { q: 'К какой группе относятся пауки и скорпионы?', ok: 'Паукообразные (8 ног)', bad: ['Насекомые (6 ног)', 'Ракообразные', 'Кольчатые черви', 'Моллюски'] },
      ];
      const item = rng.pick(bank);
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
    id: 'biology.ecology-chains',
    subject: 'biology',
    topic: 'Эволюция и экология',
    title: 'Пищевые цепи, правило 10% Линдемана и эволюция',
    format: 'single',
    difficulty: [1, 3],
    weight: 1.4,
    generate(rng, { difficulty }) {
      const mode = rng.pick(['rule10', 'evo']);
      if (mode === 'rule10') {
        const prod = rng.pick([1000, 2000, 5000, 8000, 10000, 25000]);
        const steps = rng.pick([1, 2, 3]);
        const res = prod / Math.pow(10, steps);
        const levelNames = { 1: 'консументам I порядка', 2: 'консументам II порядка', 3: 'консументам III порядка' };
        const { options, answer } = buildNumericSingle(rng, res, 'кДж', [prod / 2, res * 10, res / 10, prod / (steps * 10)]);
        return {
          stem: `Продуценты экосистемы накопили $${prod}\\text{ кДж}$ энергии. По правилу экологической пирамиды ($10\\%$), сколько энергии перейдёт к ${levelNames[steps]}?`,
          options,
          answer,
          explanation: `На каждый следующий трофический уровень переходит $10\\%$ энергии: $\\frac{${prod}}{10^{${steps}}} = ${res}\\text{ кДж}$.`,
          hint: 'На каждом шаге пищевой цепи делите энергию на 10.',
          difficulty,
        };
      }
      const bank = [
        { q: 'Какой фактор эволюции по Ч. Дарвину имеет направленный характер?', ok: 'Естественный отбор', bad: ['Мутационная изменчивость', 'Дрейф генов', 'Изоляция', 'Популяционные волны'] },
        { q: 'К какой экологической группе относятся грибы и бактерии гниения, разлагающие органику до минеральных веществ?', ok: 'Редуценты', bad: ['Продуценты', 'Консументы I порядка', 'Консументы II порядка', 'Автотрофы'] },
        { q: 'Взаимовыгодное сожительство организмов разных видов (например, лишайник) называется:', ok: 'Симбиоз (мутуализм)', bad: ['Паразитизм', 'Хищничество', 'Конкуренция', 'Аменсализм'] },
      ];
      const item = rng.pick(bank);
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
    id: 'biology.dna-rna-open',
    subject: 'biology',
    topic: 'ДНК, РНК и биосинтез белка',
    title: 'Развёрнутая задача: транскрипция и расчёт нуклеотидов ДНК',
    format: 'open',
    difficulty: [2, 3],
    weight: 0.8,
    generate(rng, { difficulty }) {
      const total = rng.pick([400, 600, 800, 1000]);
      const aPct = rng.pick([20, 22, 24, 28, 30]);
      const gPct = 50 - aPct;
      const aCount = (total * aPct) / 100;
      const gCount = (total * gPct) / 100;
      return {
        stem: `Фрагмент двухцепочечной молекулы ДНК содержит всего $${total}$ нуклеотидов, из которых $${aPct}\\%$ составляют адениловые (А). Определите количество каждого вида нуклеотидов (А, Т, Г, Ц) в этом фрагменте.`,
        points: 2,
        answer: `<p>1. $А = Т = ${aPct}\\%$ от $${total} = ${aCount}$ нуклеотидов каждого вида.</p><p>2. $Г = Ц = 50\\% - ${aPct}\\% = ${gPct}\\%$ от $${total} = ${gCount}$ нуклеотидов каждого вида.</p>`,
        rubric: '<b>2 балла:</b> верно применено правило Чаргаффа и найдены числа А, Т, Г, Ц.<br><b>1 балл:</b> найдены только проценты без перевода в количество.<br><b>0 баллов:</b> неверный принцип расчёта.',
        explanation: `$А = Т = ${aCount}$, $Г = Ц = ${gCount}$ (в сумме $${total}$).`,
        difficulty,
      };
    },
  },
  {
    id: 'biology.ecology-open',
    subject: 'biology',
    topic: 'Эволюция и экология',
    title: 'Развёрнутая задача: расчёт биомассы по правилу 10%',
    format: 'open',
    difficulty: [2, 3],
    weight: 0.8,
    generate(rng, { difficulty }) {
      const mPred = rng.int(2, 9);
      const mHerb = mPred * 10;
      const mPlant = mPred * 100;
      return {
        stem: `В пищевой цепи «трава → заяц → лисица» масса хищника (лисицы) увеличилась на $${mPred}\\text{ кг}$. Используя правило 10% Линдемана, рассчитайте массу зайцев и массу травы, необходимую для такого прироста.`,
        points: 2,
        answer: `<p>1. Масса консументов I порядка (зайцев): $${mPred} \\cdot 10 = ${mHerb}\\text{ кг}$.</p><p>2. Масса продуцентов (травы): $${mHerb} \\cdot 10 = ${mPlant}\\text{ кг}$.</p>`,
        rubric: `<b>2 балла:</b> верно рассчитаны оба звена ($${mHerb}$ кг и $${mPlant}$ кг).<br><b>1 балл:</b> верно найдено одно звено.<br><b>0 баллов:</b> правило 10% применено неверно.`,
        explanation: `При движении вниз по пищевой пирамиде массу на каждом уровне умножаем на 10: $${mHerb}\\text{ кг}$ и $${mPlant}\\text{ кг}$.`,
        difficulty,
      };
    },
  },
];

export default {
  id: 'biology',
  title: 'Биология',
  taskTypes,
  exam: {
    durationMin: 90,
    expectedTasks: 30,
    scaledMax: 100,
    sections: [
      { title: 'Закрытые задания (№1–22)', from: 0, to: 21 },
      { title: 'Генетика, ДНК, порядок и соответствие (№23–27)', from: 22, to: 26 },
      { title: 'Развёрнутые ситуационные задачи (№28–30)', from: 27, to: 29 },
    ],
  },
  buildExam(rng) {
    return buildStandardBlockExam('biology', taskTypes, rng);
  },
  score(tasks, earnedList) {
    return scoreStandardBlockExam(tasks, earnedList);
  },
  originals: async () => [],
};
