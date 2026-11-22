// Сборка заданий по чтению и анализу текста (ru.reading-closed и ru.reading-open)
// на базе 12 оригинальных текстов (6 художественно-повествовательных + 6 публицистических).

import {
  buildSingleOptions,
  buildPairedSplitOptions,
  renderVennSvg,
  renderClusterSvg,
  renderTableHtml,
} from '../ru-rules.js';
import { LIT_PASSAGES } from './passages-lit.js';
import { PUB_PASSAGES } from './passages-pub.js';

export { LIT_PASSAGES, PUB_PASSAGES };
export const ALL_PASSAGES = [...LIT_PASSAGES, ...PUB_PASSAGES];

const ALL_LEXIS_WAYS = [
  'описание предмета, его признаков',
  'подбор синонима',
  'подбор антонима',
  'раскрытие значения частей слова',
];

function buildLexisWaysTask(rng, passageObj, items) {
  const pair = rng.sample(items, 2);
  const stem =
    `Какие способы использованы для разъяснения лексического значения слов из текста «${passageObj.title}» соответственно?<br>` +
    `1. <b>${pair[0].word}</b> — <i>${pair[0].def}</i><br>` +
    `2. <b>${pair[1].word}</b> — <i>${pair[1].def}</i>`;

  const correct = `1 – ${pair[0].way}; 2 – ${pair[1].way}`;
  const pool = [];
  for (const w1 of ALL_LEXIS_WAYS) {
    for (const w2 of ALL_LEXIS_WAYS) {
      const cand = `1 – ${w1}; 2 – ${w2}`;
      if (cand !== correct) pool.push(cand);
    }
  }

  const { options, answer } = buildSingleOptions(rng, correct, pool);
  return {
    stem,
    options,
    answer,
    explanation: `Для первого слова («${pair[0].word}») использован способ «${pair[0].way}», а для второго («${pair[1].word}») — «${pair[1].way}».`,
    hint: 'Обратите внимание, раскрывается ли значение через признаки предмета, синоним, антоним или морфемы.',
  };
}

function buildDirectFigurativeTask(rng, passageObj, df) {
  const dirPick = rng.sample(df.direct, 3);
  const figPick = rng.sample(df.figurative, 3);
  const directFirst = rng.chance(0.5);

  const combined = rng.shuffle([
    ...dirPick.map((expr) => ({ expr, kind: 'direct' })),
    ...figPick.map((expr) => ({ expr, kind: 'fig' })),
  ]);

  const listHtml = combined.map((item, idx) => `${idx + 1}. ${item.expr}`).join('<br>');
  const dirNums = [];
  const figNums = [];
  combined.forEach((item, idx) => {
    if (item.kind === 'direct') dirNums.push(idx + 1);
    else figNums.push(idx + 1);
  });

  const stem = directFirst
    ? `В прямом и переносном значении соответственно употреблены в тексте «${passageObj.title}» выражения:<br>${listHtml}`
    : `В переносном и прямом значении соответственно употреблены в тексте «${passageObj.title}» выражения:<br>${listHtml}`;

  const { options, answer } = directFirst
    ? buildPairedSplitOptions(rng, dirNums, figNums)
    : buildPairedSplitOptions(rng, figNums, dirNums);

  return {
    stem,
    options,
    answer,
    explanation:
      `В прямом значении употреблены сочетания № ${dirNums.join(', ')} (${dirPick.join('; ')}). ` +
      `В переносном (образном) значении — № ${figNums.join(', ')} (${figPick.join('; ')}).`,
    hint: 'Проверьте, называют ли слова реальный физический признак/предмет или создают метафорический образ.',
  };
}

/**
 * Сгенерировать одно закрытое задание по чтению (`ru.reading-closed`).
 */
export function generateReadingClosedTask(rng, difficulty, forcedPassage = null, forcedSlot = null) {
  const pObj = forcedPassage || rng.pick(ALL_PASSAGES);
  const c = pObj.closed;

  const availableSlots = ['linkGap', 'insertGap', 'mainIdea', 'contradiction', 'composition', 'lexisWays', 'directFigurative'];
  if (c.idiomSynonym) availableSlots.push('idiomSynonym');
  if (c.wordMatch) availableSlots.push('wordMatch');

  let slot = forcedSlot;
  if (!slot || !availableSlots.includes(slot)) {
    const easySlots = availableSlots.filter((s) => ['linkGap', 'mainIdea', 'composition', 'idiomSynonym'].includes(s));
    const hardSlots = availableSlots.filter((s) => ['insertGap', 'contradiction', 'lexisWays', 'directFigurative', 'wordMatch'].includes(s));
    if (difficulty === 1 && easySlots.length) slot = rng.pick(easySlots);
    else if (difficulty === 3 && hardSlots.length) slot = rng.pick(hardSlots);
    else slot = rng.pick(availableSlots);
  }

  const passage = { id: pObj.id, title: pObj.title, html: pObj.html };
  let built;

  switch (slot) {
    case 'linkGap': {
      const lg = c.linkGap;
      const { options, answer } = buildSingleOptions(rng, lg.correct, lg.distractors);
      built = {
        stem: `Какое слово связывает предложение № ${lg.sentNum} текста «${pObj.title}» с предыдущим?`,
        options,
        answer,
        explanation: lg.explain,
        hint: `Перечитайте предложения № ${lg.sentNum - 1} и № ${lg.sentNum} и определите смысловую связь между ними.`,
      };
      break;
    }
    case 'insertGap': {
      const ig = c.insertGap;
      const isClosing = ig.sentNum >= 17 && pObj.genre === 'pub';
      const stem = isClosing
        ? `Каким предложением логичнее завершить текст «${pObj.title}» (под номером ${ig.sentNum})?`
        : `Какое предложение должно стоять в тексте «${pObj.title}» под номером ${ig.sentNum}?`;
      const { options, answer } = buildSingleOptions(rng, ig.correct, ig.distractors);
      built = {
        stem,
        options,
        answer,
        explanation: ig.explain,
        hint: 'Обратите внимание на логический переход от предыдущего предложения к последующему.',
      };
      break;
    }
    case 'mainIdea': {
      const mi = c.mainIdea;
      const { options, answer } = buildSingleOptions(rng, mi.correct, mi.distractors);
      built = {
        stem: `${mi.stem} (по тексту «${pObj.title}»)`,
        options,
        answer,
        explanation: mi.explain,
        hint: 'Главная мысль объединяет весь сюжет или ключевые аргументы текста, а не частную деталь.',
      };
      break;
    }
    case 'contradiction': {
      const trues = rng.sample(c.contradictions.truePool, 4);
      const falseStmt = rng.pick(c.contradictions.falsePool);
      const { options, answer } = buildSingleOptions(rng, falseStmt, trues);
      built = {
        stem: `Какое утверждение <b>противоречит</b> содержанию текста «${pObj.title}»?`,
        options,
        answer,
        explanation: `Утверждение «${falseStmt}» противоречит фактам текста; остальные четыре утверждения соответствуют содержанию.`,
        hint: 'Сопоставьте каждое из пяти утверждений с точными фактами в пронумерованных предложениях.',
      };
      break;
    }
    case 'composition': {
      const comp = c.composition;
      const { options, answer } = buildSingleOptions(rng, comp.correct, comp.distractors);
      built = {
        stem: `С какого предложения начинается ${comp.part} часть текста «${pObj.title}»?`,
        options,
        answer,
        explanation: comp.explain,
        hint: 'Найдите предложение, в котором события завершаются и автор подводит итог или переходит к выводу.',
      };
      break;
    }
    case 'idiomSynonym': {
      const idm = c.idiomSynonym;
      const { options, answer } = buildSingleOptions(rng, idm.correct, idm.distractors);
      built = {
        stem: `Синонимом фразеологизма <i>«${idm.idiom}»</i> из текста «${pObj.title}» является слово`,
        options,
        answer,
        explanation: idm.explain,
        hint: 'Замените фразеологизм в соответствующем предложении текста на близкое по смыслу наречие.',
      };
      break;
    }
    case 'wordMatch': {
      const wm = c.wordMatch;
      const correct = `${wm.words[0]}, ${wm.words[1]}`;
      const { options, answer } = buildSingleOptions(rng, correct, wm.distractors);
      built = {
        stem: `Характеристики <i>«${wm.defs[0]}»</i> и <i>«${wm.defs[1]}»</i> соответственно относятся в тексте «${pObj.title}» к словам`,
        options,
        answer,
        explanation: `Первому толкованию соответствует слово «${wm.words[0]}», а второму — «${wm.words[1]}».`,
        hint: 'Найдите термины и ключевые слова в тексте и сверьте их лексическое значение с определениями.',
      };
      break;
    }
    case 'lexisWays':
      built = buildLexisWaysTask(rng, pObj, c.lexisWays.items);
      break;
    case 'directFigurative':
      built = buildDirectFigurativeTask(rng, pObj, c.directFigurative);
      break;
  }

  return {
    passage,
    stem: built.stem,
    format: 'single',
    options: built.options,
    answer: built.answer,
    points: 1,
    explanation: built.explanation,
    difficulty,
    hint: built.hint,
  };
}

/**
 * Сгенерировать одно развёрнутое письменное задание по чтению (`ru.reading-open`).
 */
export function generateReadingOpenTask(rng, difficulty, forcedPassage = null, forcedSlot = null) {
  const pObj = forcedPassage || rng.pick(ALL_PASSAGES);
  const o = pObj.open;
  const slots = pObj.genre === 'lit'
    ? ['t46', 't47', 't48', 't49', 't50']
    : ['t56', 't57', 't58', 't59', 't60'];

  let slot = forcedSlot;
  if (!slot || !slots.includes(slot)) {
    if (difficulty === 1) {
      slot = rng.pick(pObj.genre === 'lit' ? ['t49', 't50'] : ['t57', 't58']);
    } else if (difficulty === 3) {
      slot = rng.pick(pObj.genre === 'lit' ? ['t46', 't47', 't48'] : ['t56', 't59', 't60']);
    } else {
      slot = rng.pick(slots);
    }
  }

  const passage = { id: pObj.id, title: pObj.title, html: pObj.html };

  if (pObj.genre === 'lit') {
    const item = o[slot];
    switch (slot) {
      case 't46': {
        const table = renderTableHtml(
          ['Фразеологизмы', 'Предложения'],
          [
            [`1. ${item.rows[0].idiom}`, '1.'],
            [`2. ${item.rows[1].idiom}`, '2.'],
          ]
        );
        return {
          passage,
          stem: `${item.stem}${table}`,
          format: 'open',
          answer: `<p>${item.rows[0].rewritten}</p><p>${item.rows[1].rewritten}</p>`,
          rubric:
            '<b>2 балла:</b> оба предложения из 3-го и 4-го абзацев найдены верно и грамматически правильно перестроены с использованием фразеологизмов.<br>' +
            '<b>1 балл:</b> верно выполнено одно из двух преобразований либо допущена незначительная речевая неточность при вставке.<br>' +
            '<b>0 баллов:</b> предложения выбраны неверно или фразеологизмы не использованы.',
          points: 2,
          explanation: item.explain,
          difficulty,
          hint: 'Найдите в указанных абзацах фрагменты, близкие по смыслу к каждому фразеологизму, и замените их без нарушения грамматики.',
        };
      }
      case 't47': {
        return {
          passage,
          stem: item.stem,
          image: {
            svg: renderClusterSvg({ centerLabel: item.center, isOpen: true }),
            alt: `Кластер для характеристики: ${item.center}`,
            width: 460,
          },
          format: 'open',
          answer: `<p><b>Предполагаемый ответ:</b> ${item.answer}.</p>`,
          rubric: item.rubric,
          points: 2,
          explanation: `По поступкам и поведению героя в тексте формируются точные характеристики без повтора слов из отрывка: ${item.answer}.`,
          difficulty,
          hint: 'Подбирайте прилагательные и причастия-синонимы, избегая однокоренных слов из самого текста.',
        };
      }
      case 't48': {
        const table = renderTableHtml(
          ['Слова', 'Значения'],
          [
            ['1.', '1.'],
            ['2.', '2.'],
          ]
        );
        return {
          passage,
          stem: `${item.stem}${table}`,
          format: 'open',
          answer: item.rows.map((r) => `<p><b>${r.word}</b> — ${r.meaning}</p>`).join(''),
          rubric:
            '<b>2 балла:</b> оба слова ограниченной/стилистически окрашенной лексики выписаны верно и точно объяснены согласно контексту.<br>' +
            '<b>1 балл:</b> верно найдено и объяснено одно слово или дано неполное толкование.<br>' +
            '<b>0 баллов:</b> выписаны общеупотребительные слова или значения объяснены неверно.',
          points: 2,
          explanation: item.explain,
          difficulty,
          hint: 'Ищите слова разговорного, просторечного, устаревшего, диалектного или профессионального пласта в указанных абзацах.',
        };
      }
      case 't49': {
        return {
          passage,
          stem: item.stem,
          format: 'open',
          answer: `<p>${item.answer}</p>`,
          rubric: item.rubric,
          points: 2,
          explanation: `В развёрнутом ответе необходимо своими словами сформулировать обе причины опорой на события текста: ${item.answer}`,
          difficulty,
          hint: 'Перечитайте первую половину текста и выделите два самостоятельных обстоятельства, приведших к описываемой ситуации.',
        };
      }
      case 't50': {
        return {
          passage,
          stem: item.stem,
          format: 'open',
          answer: `<p><b>Верный ответ:</b> ${item.answer}</p>`,
          rubric:
            '<b>2 балла:</b> речевая или грамматическая ошибка в указанном интервале предложений точно найдена и записана в исправленном виде.<br>' +
            '<b>1 балл:</b> ошибка указана, но исправление сформулировано неточно.<br>' +
            '<b>0 баллов:</b> ошибка не найдена или исправлена неверно.',
          points: 2,
          explanation: item.explain,
          difficulty,
          hint: `Внимательно проверьте грамматическую сочетаемость слов, управление предлогов, числительные и местоимения в предложениях ${item.range}.`,
        };
      }
    }
  } else {
    const item = o[slot];
    switch (slot) {
      case 't56': {
        const filledTable = renderTableHtml(
          ['Признаки', 'Примеры'],
          [
            ['1.', `1. ${item.missingExample}`],
            [`2. ${item.givenFeature}`, '2.'],
          ],
          'Стиль:'
        );
        return {
          passage,
          stem: `Заполните таблицу по тексту «${pObj.title}».${filledTable}`,
          format: 'open',
          answer:
            `<p><b>1. Признак:</b> ${item.missingFeature}.</p>` +
            `<p><b>2. Пример:</b> ${item.givenExample}</p>` +
            `<p><b>Стиль:</b> ${item.style}.</p>`,
          rubric:
            '<b>2 балла:</b> верно назван недостающий признак, выписан точный пример для второго признака и правильно определён стиль текста.<br>' +
            '<b>1 балл:</b> верно заполнены 2 из 3 требуемых полей (либо стиль определён с неточностью в примере).<br>' +
            '<b>0 баллов:</b> стиль и признаки определены неверно.',
          points: 2,
          explanation: item.explain,
          difficulty,
          hint: 'Оцените цель текста (воздействие на читателя и освещение общественно-культурной темы), найдите восклицания или риторические вопросы.',
        };
      }
      case 't57': {
        return {
          passage,
          stem: `Раскройте значение выделенного в тексте «${pObj.title}» слова <span class="mark">${item.word}</span> (предложение № ${item.sentNum}). Составьте предложение с этим словом, употребив его в другом значении.`,
          format: 'open',
          answer: `<p><b>Значение по тексту:</b> ${item.word} — ${item.contextMeaning}.</p><p><b>Пример с другим значением:</b> ${item.otherSentence}</p>`,
          rubric:
            '<b>2 балла:</b> точно раскрыто контекстное значение слова и составлено грамматически правильное предложение с другим его значением.<br>' +
            '<b>1 балл:</b> верно выполнено одно из двух требований (только толкование или только предложение).<br>' +
            '<b>0 баллов:</b> толкование неверно и другое значение не показано.',
          points: 2,
          explanation: item.explain,
          difficulty,
          hint: 'Разграничьте прямое и переносное или смежное значение многозначного слова.',
        };
      }
      case 't58': {
        return {
          passage,
          stem: `Ознакомьтесь с выражением ${item.proverb}. Объясните его смысл своими словами и приведите соответствующий пример из текста «${pObj.title}».`,
          format: 'open',
          answer: `<p><b>Мысль:</b> ${item.thought}</p><p><b>Пример из текста:</b> ${item.example}</p>`,
          rubric:
            '<b>2 балла:</b> мысль пословицы/афоризма раскрыта своими словами и подтверждена точным фактом или примером из текста.<br>' +
            '<b>1 балл:</b> дано только объяснение смысла без опоры на текст либо только цитата из текста без пояснения.<br>' +
            '<b>0 баллов:</b> смысл искажён или ответ отсутствует.',
          points: 2,
          explanation: item.explain,
          difficulty,
          hint: 'Сначала обобщите житейскую идею высказывания, затем укажите конкретный эпизод из текста, доказывающий её.',
        };
      }
      case 't59': {
        const table = renderTableHtml(
          ['Проблема', 'Решение проблемы'],
          [[item.problem, '']]
        );
        return {
          passage,
          stem: `Используя информацию из текста «${pObj.title}», заполните таблицу своими словами.${table}`,
          format: 'open',
          answer: `<p><b>Решение проблемы:</b> ${item.solution}</p>`,
          rubric:
            '<b>2 балла:</b> решение проблемы сформулировано точно, полно и своими словами на основе текста.<br>' +
            '<b>1 балл:</b> решение указано неполно либо передано буквальной необработанной цитатой.<br>' +
            '<b>0 баллов:</b> ответ не соответствует фактам текста.',
          points: 2,
          explanation: item.explain,
          difficulty,
          hint: 'Найдите в тексте абзац, где описывается упомянутое затруднение, и проследите, какие меры были предприняты.',
        };
      }
      case 't60': {
        return {
          passage,
          stem: `Используя информацию из текста «${pObj.title}», заполните диаграмму Эйлера–Венна, сравнив: <i>${item.leftTitle}</i> и <i>${item.rightTitle}</i>. Ответы формулируйте кратко (тезисами).`,
          image: {
            svg: renderVennSvg({
              leftTitle: item.leftTitle,
              rightTitle: item.rightTitle,
              openNumbers: true,
            }),
            alt: `Диаграмма Эйлера-Венна: ${item.leftTitle} и ${item.rightTitle}`,
            width: 460,
          },
          format: 'open',
          answer:
            `<p><b>${item.leftTitle}:</b> 1) ${item.leftPts[0]}; 2) ${item.leftPts[1]}.</p>` +
            `<p><b>${item.rightTitle}:</b> 1) ${item.rightPts[0]}; 2) ${item.rightPts[1]}.</p>` +
            `<p><b>Общее:</b> ${item.commonPts[0]}.</p>`,
          rubric:
            '<b>2 балла:</b> верно указаны по 2 отличия для каждой стороны и 1 общий признак в пересечении диаграммы.<br>' +
            '<b>1 балл:</b> верно заполнены не менее половины пунктов (например, по 1–2 отличия без общего или с одной неточностью).<br>' +
            '<b>0 баллов:</b> факты текста перепутаны или диаграмма не заполнена.',
          points: 2,
          explanation: 'Сравнительная диаграмма систематизирует отличительные факты обоих периодов/объектов (в боковых секторах) и объединяющую идею (в центре).',
          difficulty,
          hint: 'Выпишите по два характерных факта из соответствующих абзацев для левой и правой частей, а затем сформулируйте общую суть.',
        };
      }
    }
  }
}
