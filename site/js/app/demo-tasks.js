// Fallback demo generators used ONLY while a subject module (site/js/subjects/<id>/index.js)
// is not yet implemented by its author. Once the real module exists, this file is bypassed.

import { finalizeTask } from '../core/contract.js';

export function buildFallbackSubject(meta) {
  const id = meta.id;
  const types = getFallbackTypes(id);
  return {
    id,
    title: meta.title,
    stub: true,
    taskTypes: types,
    buildExam(rng) {
      const out = [];
      for (let i = 0; i < Math.min(10, types.length * 2); i++) {
        const tp = types[i % types.length];
        const subRng = rng.fork(`exam-${i}`);
        const diff = (i % 3) + 1;
        out.push(finalizeTask(tp, subRng, tp.generate(subRng, { difficulty: diff })));
      }
      return out;
    },
    originals: async () => [],
    meta,
  };
}

function getFallbackTypes(subjectId) {
  if (subjectId === 'math') {
    return [
      {
        id: 'math.quad-eq',
        subject: 'math',
        title: 'Квадратные уравнения и теорема Виета',
        topic: 'Алгебра · Уравнения',
        format: 'single',
        weight: 2,
        generate(rng, { difficulty = 2 }) {
          const r1 = rng.int(-6, 7);
          const r2 = rng.intExcept(-5, 8, [r1]);
          const b = -(r1 + r2);
          const c = r1 * r2;
          const sum = r1 + r2;
          const prod = r1 * r2;
          const askSum = rng.chance(0.5);
          const correctVal = askSum ? sum : prod;
          const distractors = new Set([
            -correctVal,
            correctVal + 2,
            correctVal - 2,
            askSum ? prod : sum,
            correctVal + 4,
            correctVal - 3,
          ]);
          distractors.delete(correctVal);
          const optsNum = rng.shuffle([correctVal, ...[...distractors].slice(0, 4)]);
          const ansIdx = optsNum.indexOf(correctVal);
          const bStr = b === 0 ? '' : b > 0 ? `+ ${b === 1 ? '' : b}x` : `- ${Math.abs(b) === 1 ? '' : Math.abs(b)}x`;
          const cStr = c === 0 ? '' : c > 0 ? `+ ${c}` : `- ${Math.abs(c)}`;
          return {
            stem: `<p>Найдите ${askSum ? 'сумму' : 'произведение'} корней квадратного уравнения $$x^2 ${bStr} ${cStr} = 0.$$</p>`,
            format: 'single',
            options: optsNum.map((v) => `$${v}$`),
            answer: ansIdx,
            points: 1,
            difficulty,
            hint: 'По теореме Виета для приведённого уравнения $x^2 + px + q = 0$: $x_1 + x_2 = -p$, $x_1 \\cdot x_2 = q$.',
            explanation: `<p>По теореме Виета для приведённого квадратного уравнения $x^2 + px + q = 0$ имеем:</p>
              <p>$$x_1 + x_2 = -p = ${sum}, \\quad x_1 \\cdot x_2 = q = ${prod}.$$</p>
              <p>Корни уравнения: $x_1 = ${r1}$, $x_2 = ${r2}$. Искомое значение равно <b>$${correctVal}$</b>.</p>`,
          };
        },
      },
      {
        id: 'math.right-triangle',
        subject: 'math',
        title: 'Прямоугольный треугольник и теорема Пифагора',
        topic: 'Геометрия · Планиметрия',
        format: 'short',
        weight: 1.5,
        generate(rng, { difficulty = 2 }) {
          const triples = [[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17], [9, 12, 15]];
          const [a, b, c] = rng.pick(triples);
          return {
            stem: `<p>В прямоугольном треугольнике $ABC$ ($\\angle C = 90^\\circ$) катеты равны $AC = ${a}$ см и $BC = ${b}$ см. Найдите длину гипотенузы $AB$ (в см).</p>`,
            image: {
              alt: `Прямоугольный треугольник ABC с катетами ${a} и ${b}`,
              caption: `Рис. 1. $\\triangle ABC$, $\\angle C = 90^\\circ$`,
              width: 280,
              svg: `<svg viewBox="0 0 240 160" xmlns="http://www.w3.org/2000/svg">
                <polygon points="36,130 200,130 36,28" fill="rgba(37,99,235,0.08)" stroke="currentColor" stroke-width="2.2"/>
                <polyline points="36,114 52,114 52,130" fill="none" stroke="currentColor" stroke-width="1.6"/>
                <text x="20" y="140" fill="currentColor" font-size="14" font-weight="600">C</text>
                <text x="206" y="140" fill="currentColor" font-size="14" font-weight="600">B</text>
                <text x="24" y="24" fill="currentColor" font-size="14" font-weight="600">A</text>
                <text x="14" y="84" fill="currentColor" font-size="13">${a}</text>
                <text x="112" y="148" fill="currentColor" font-size="13">${b}</text>
                <text x="122" y="72" fill="currentColor" font-size="13" font-style="italic">?</text>
              </svg>`,
            },
            format: 'short',
            answer: String(c),
            points: 1,
            difficulty,
            hint: 'Используйте теорему Пифагора: $AB = \\sqrt{AC^2 + BC^2}$.',
            explanation: `<p>По теореме Пифагора квадрат гипотенузы равен сумме квадратов катетов:</p>
              <p>$$AB = \\sqrt{AC^2 + BC^2} = \\sqrt{${a}^2 + ${b}^2} = \\sqrt{${a * a} + ${b * b}} = \\sqrt{${c * c}} = ${c}.$$</p>`,
          };
        },
      },
      {
        id: 'math.functions-match',
        subject: 'math',
        title: 'Свойства функций (соответствие)',
        topic: 'Алгебра · Функции',
        format: 'match',
        weight: 1,
        generate(rng, { difficulty = 2 }) {
          const k = rng.int(2, 5);
          return {
            stem: `<p>Установите соответствие между функциями (1–3) и координатами точки пересечения их графиков с осью $Oy$ (A–E):</p>`,
            format: 'match',
            pairs: {
              left: [
                `$y = 2x + ${k}$`,
                `$y = x^2 - ${k}$`,
                `$y = (x - ${k})^2$`,
              ],
              right: [
                `$(0;\\; ${k})$`,
                `$(0;\\; -${k})$`,
                `$(0;\\; ${k * k})$`,
                `$(${k};\\; 0)$`,
                `$(0;\\; 0)$`,
              ],
            },
            answer: [0, 1, 2],
            points: 2,
            partial: true,
            difficulty,
            explanation: `<p>Точка пересечения графика функции с осью $Oy$ находится при $x = 0$:</p>
              <ol>
                <li>Для $y = 2x + ${k}$ при $x=0$: $y = ${k} \\Rightarrow (0;\\; ${k})$ — <b>A</b>.</li>
                <li>Для $y = x^2 - ${k}$ при $x=0$: $y = -${k} \\Rightarrow (0;\\; -${k})$ — <b>B</b>.</li>
                <li>Для $y = (x - ${k})^2$ при $x=0$: $y = (-${k})^2 = ${k * k} \\Rightarrow (0;\\; ${k * k})$ — <b>C</b>.</li>
              </ol>`,
          };
        },
      },
      {
        id: 'math.open-problem',
        subject: 'math',
        title: 'Текстовая задача с развёрнутым решением',
        topic: 'Алгебра · Текстовые задачи',
        format: 'open',
        weight: 1,
        generate(rng, { difficulty = 3 }) {
          const v = rng.int(12, 18);
          const vc = rng.int(2, 4);
          const dist = (v + vc) * (v - vc);
          const tTotal = 2 * v;
          return {
            stem: `<p>Катер прошёл $${dist}$ км по течению реки и вернулся обратно, затратив на весь путь $${tTotal}$ ч. Скорость течения реки равна $${vc}$ км/ч. Найдите собственную скорость катера, записав полное обоснованное решение.</p>`,
            format: 'open',
            answer: `<p>Собственная скорость катера равна $${v}$ км/ч.</p>`,
            rubric: `<ul>
              <li><b>2 балла</b>: верно составлено дробно-рациональное уравнение $\\frac{${dist}}{x+${vc}} + \\frac{${dist}}{x-${vc}} = ${tTotal}$, найдены корни и отобран положительный корень $x = ${v}$ км/ч.</li>
              <li><b>1 балл</b>: уравнение составлено верно, но допущена вычислительная описка при решении уравнения.</li>
              <li><b>0 баллов</b>: решение не соответствует условию.</li>
            </ul>`,
            points: 2,
            difficulty,
            explanation: `<p>Пусть $x$ км/ч ($x > ${vc}$) — собственная скорость катера. Тогда скорость по течению равна $(x + ${vc})$ км/ч, а против течения — $(x - ${vc})$ км/ч.</p>
              <p>Составим уравнение времени движения: $$\\frac{${dist}}{x + ${vc}} + \\frac{${dist}}{x - ${vc}} = ${tTotal}.$$</p>
              <p>Преобразуем уравнение и получим $x = ${v}$ км/ч.</p>`,
          };
        },
      },
    ];
  }

  if (subjectId === 'ru') {
    return [
      {
        id: 'ru.ortho-roots',
        subject: 'ru',
        title: 'Правописание корней с чередованием',
        topic: 'Орфография',
        format: 'single',
        weight: 2,
        generate(rng, { difficulty = 2 }) {
          const items = [
            {
              correct: 'прик..снуться, заг..релый, возл..жить',
              explain: 'Во всех словах ряда пишется буква <b>О</b>: <i>прикоснуться</i> (нет суффикса -а-), <i>загорелый</i> (без ударения -гор-), <i>возложить</i> (перед -ж- пишется -лож-).',
              wrong: [
                'к..сательная, оз..рение, изл..гать',
                'соб..рать, выт..реть, заст..лить',
                'р..сток, отр..сль, выр..щенный',
                'бл..стеть, заж..гать, расст..лать',
              ],
            },
            {
              correct: 'соб..рать, расст..лать, заж..гать',
              explain: 'Во всех словах ряда пишется буква <b>И</b>, так как за корнем следует суффикс <b>-А-</b> (<i>-бир-/-бер-, -стил-/-стел-, -жиг-/-жег-</i>).',
              wrong: [
                'зам..реть, выт..реть, соб..ру',
                'прик..сновение, пол..жить, р..внина',
                'оз..рять, пл..вчиха, тв..рение',
                'выг..рки, накл..ниться, ск..чок',
              ],
            },
          ];
          const item = rng.pick(items);
          const opts = rng.shuffle([item.correct, ...item.wrong]);
          return {
            stem: `<p>Укажите ряд, во всех словах которого пропущена <b>одна и та же</b> безударная чередующаяся гласная в корне:</p>`,
            format: 'single',
            options: opts,
            answer: opts.indexOf(item.correct),
            points: 1,
            difficulty,
            explanation: `<p>${item.explain}</p>`,
          };
        },
      },
      {
        id: 'ru.reading-text',
        subject: 'ru',
        title: 'Смысловой и языковой анализ текста',
        topic: 'Чтение и анализ текста',
        format: 'multi',
        weight: 1.5,
        generate(rng, { difficulty = 2 }) {
          return {
            passage: {
              id: 'ru-demo-passage-1',
              title: 'Огни ночного Баку',
              html: `<p><span class="num">(1)</span>Вечером с нагорного парка открывается удивительный вид на Бакинскую бухту. <span class="num">(2)</span>Огни приморского бульвара отражаются в тёмной глади Каспия, словно россыпь золотых звёзд. <span class="num">(3)</span>В старом городе Ичери-шехер узкие каменные улочки хранят тишину веков и память о древних мастерах. <span class="num">(4)</span>Здесь особенно остро чувствуешь неразрывную связь прошлого и настоящего.</p>`,
            },
            stem: `<p>Какие из перечисленных утверждений соответствуют содержанию и языковым особенностям текста? <i>(Выберите все верные ответы)</i></p>`,
            format: 'multi',
            options: [
              'В предложении (2) использовано образное сравнение («словно россыпь золотых звёзд»).',
              'В предложении (3) словосочетание «каменные улочки» построено на основе управления.',
              'Предложение (4) является односоставным определённо-личным.',
              'В предложении (1) говорится о том, что бухта не видна с нагорного парка.',
            ],
            answer: [0, 2],
            points: 2,
            partial: true,
            difficulty,
            explanation: `<p>Верными являются утверждения <b>1</b> и <b>3</b>:</p>
              <ul>
                <li>В предложении (2) действительно есть сравнительный оборот с союзом <i>словно</i>.</li>
                <li>В предложении (4) главный член выражен глаголом 2-го лица ед. числа (<i>чувствуешь</i>) в обобщённом значении — это односоставное определённо-личное предложение.</li>
                <li>«Каменные улочки» — согласование, а не управление.</li>
              </ul>`,
          };
        },
      },
    ];
  }

  if (subjectId === 'en') {
    return [
      {
        id: 'en.reading-mostar',
        subject: 'en',
        title: 'Reading Comprehension (Main Idea & Details)',
        topic: 'Reading & Passage Analysis',
        format: 'single',
        weight: 2,
        generate(rng, { difficulty = 2 }) {
          const opts = rng.shuffle([
            'Observing stars starts with learning the bright patterns visible to the naked eye.',
            'Ancient sailors never used constellations for navigation at sea.',
            'Modern telescopes cannot observe galaxies outside the Solar System.',
            'The North Star changes its position rapidly every hour.',
            'Astronomy was invented only in the late twentieth century.',
          ]);
          const correct = 'Observing stars starts with learning the bright patterns visible to the naked eye.';
          return {
            passage: {
              id: 'en-demo-passage-1',
              title: 'Navigating by the Stars',
              html: `<p>For thousands of years, travellers and sailors have looked up at the night sky to find their way across deserts and oceans. Long before satellite navigation existed, people grouped bright stars into recognizable patterns called constellations.</p>
              <p>Even today, learning the night sky begins not with expensive equipment, but with observing the brightest stars visible to the naked eye on a clear evening. Once you can locate Polaris, the North Star, you can reliably determine direction anywhere in the Northern Hemisphere.</p>`,
            },
            stem: `<p>Choose the correct statement according to the passage.</p>`,
            format: 'single',
            options: opts,
            answer: opts.indexOf(correct),
            points: 1,
            difficulty,
            explanation: `<p>Согласно второму абзацу текста: <i>«learning the night sky begins not with expensive equipment, but with observing the brightest stars visible to the naked eye»</i>.</p>`,
          };
        },
      },
      {
        id: 'en.sentence-order',
        subject: 'en',
        title: 'Word Order in Complex Sentences',
        topic: 'Grammar & Syntax',
        format: 'order',
        weight: 1,
        generate(rng, { difficulty = 2 }) {
          const chunks = [
            'The students who prepared',
            'regularly for the exam',
            'achieved the highest scores',
            'in all four subjects.',
          ];
          const indices = [0, 1, 2, 3];
          const shuffledIdx = rng.shuffle(indices);
          if (shuffledIdx.every((v, i) => v === i)) {
            [shuffledIdx[0], shuffledIdx[1]] = [shuffledIdx[1], shuffledIdx[0]];
          }
          const options = shuffledIdx.map((i) => chunks[i]);
          const answer = indices.map((origIdx) => shuffledIdx.indexOf(origIdx));
          return {
            stem: `<p>Составьте грамматически правильное английское предложение, расположив фрагменты в верном порядке:</p>`,
            format: 'order',
            options,
            answer,
            points: 1,
            difficulty,
            explanation: `<p>Правильный порядок слов в английском утвердительном предложении (Подлежащее + определительное придаточное + сказуемое + дополнение + обстоятельство): <b>«The students who prepared regularly for the exam achieved the highest scores in all four subjects.»</b></p>`,
          };
        },
      },
    ];
  }

  // Azerbaijani ('az')
  return [
    {
      id: 'az.vowel-harmony',
      subject: 'az',
      title: 'Ahəng qanunu (Закон гармонии гласных)',
      topic: 'Fonetika · Фонетика',
      format: 'single',
      weight: 2,
      generate(rng, { difficulty = 2 }) {
        const frontWords = ['məktəb', 'çiçəklər', 'gözəllik', 'şəhərimiz', 'ümidlər', 'dənizçi'];
        const correct = rng.pick(frontWords);
        const distractors = ['kitablar', 'qələm', 'bağça', 'oğlanlar', 'doğruluq', 'yoldaşlıq'];
        const wrongPool = distractors.filter((w) => w !== correct && w !== 'qələm');
        const opts = rng.shuffle([correct, ...rng.sample(wrongPool, 4)]);
        return {
          stem: `<p>Hansı sözdə <b>incə saitlərin</b> ahəngi gözlənilmişdir? <span class="text-muted">(В каком слове соблюдается гармония гласных переднего ряда: <i>e, ə, i, ö, ü</i>?)</span></p>`,
          format: 'single',
          options: opts,
          answer: opts.indexOf(correct),
          points: 1,
          difficulty,
          hint: 'İncə saitlər (гласные переднего ряда): e, ə, i, ö, ü. Qalın saitlər (заднего ряда): a, ı, o, u.',
          explanation: `<p>В азербайджанском языке гласные делятся на <b>qalın</b> (<i>a, ı, o, u</i>) и <b>incə</b> (<i>e, ə, i, ö, ü</i>). В слове <b>«${correct}»</b> все гласные относятся к переднему ряду (<i>incə saitlər</i>), поэтому закон сингармонизма (<i>ahəng qanunu</i>) полностью соблюдён.</p>`,
        };
      },
    },
    {
      id: 'az.plural-suffix',
      subject: 'az',
      title: 'Cəm şəkilçisi (-lar² / Множественное число)',
      topic: 'Morfologiya · Морфология',
      format: 'short',
      weight: 1.5,
      generate(rng, { difficulty = 1 }) {
        const pairs = [
          ['məktəb', 'məktəblər'],
          ['kitab', 'kitablar'],
          ['şəhər', 'şəhərlər'],
          ['ulduz', 'ulduzlar'],
          ['şagird', 'şagirdlər'],
          ['çiçək', 'çiçəklər'],
        ];
        const [sg, pl] = rng.pick(pairs);
        return {
          stem: `<p>Добавьте к существительному <b>«${sg}»</b> аффикс множественного числа (<i>-lar / -lər</i>) и запишите полученное слово на азербайджанском языке:</p>`,
          format: 'short',
          answer: pl,
          points: 1,
          difficulty,
          hint: 'После гласных переднего ряда (e, ə, i, ö, ü) добавляется -lər, после заднего (a, ı, o, u) — -lar.',
          explanation: `<p>По закону гармонии гласных (<i>ahəng qanunu</i>) смотрим на последний гласный корня <b>«${sg}»</b>. Правильная форма множественного числа: <b>${pl}</b>.</p>`,
        };
      },
    },
  ];
}
