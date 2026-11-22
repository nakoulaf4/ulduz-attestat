// Generators for Reading & Open Written Tasks (Tasks 23–30).

import { READING_PASSAGES } from '../banks/reading-passages.js';
import { buildSingle, buildFourChooseTwo, formatPassageHtml } from '../helpers.js';

export function makeReadingPassage(item, instanceId = null) {
  return {
    id: instanceId || item.id,
    title: item.title,
    html: formatPassageHtml(item.paragraphs, true),
  };
}

export function generateReadingTrue(rng, difficulty, fixedItem = null, passageObj = null) {
  const item = fixedItem || rng.pick(READING_PASSAGES);
  const passage = passageObj || makeReadingPassage(item);
  const truth = rng.pick(item.trueFacts);
  const falseChosen = rng.sample(item.falseFacts, 4);
  const distractors = falseChosen.map((f) => f.text);

  const reasons = falseChosen
    .map((f) => `«${f.text}» — неверно (${f.ruReason})`)
    .join('; ');

  return buildSingle(rng, {
    stem: 'Which statement is true according to the passage?',
    correct: truth.text,
    distractors,
    difficulty,
    points: 1,
    passage,
    hint: 'Сопоставьте каждое утверждение с нужным абзацем и проверьте даты, числа и причинно-следственные связи.',
    explanation: `Правильный ответ: <b>«${truth.text}»</b>. ${truth.ru}<br><div class="note">Разбор неверных вариантов: ${reasons}.</div>`,
  });
}

export function generateReadingComplete(rng, difficulty, fixedItem = null, passageObj = null) {
  const item = fixedItem || rng.pick(READING_PASSAGES);
  const passage = passageObj || makeReadingPassage(item);
  const comp = rng.pick(item.completeItems);

  return buildSingle(rng, {
    stem: `Complete the sentence according to the passage.<br><i>${comp.prompt.replace('…', '<span class="gap"></span>')}</i>`,
    correct: comp.correct,
    distractors: comp.distractors,
    difficulty,
    points: 1,
    passage,
    hint: 'Найдите в тексте ключевые слова из начала предложения и выберите перефраз точного продолжения.',
    explanation: `Правильное завершение: <b>${comp.correct}</b>. ${comp.ruExplain}`,
  });
}

export function generateReadingDetail(rng, difficulty, fixedItem = null, passageObj = null) {
  const item = fixedItem || rng.pick(READING_PASSAGES);
  const passage = passageObj || makeReadingPassage(item);
  const detail = rng.pick(item.detailItems);

  const pickedTrue = rng.sample(detail.trueItems, 2);
  const pickedFalse = rng.sample(detail.falseItems, 2);
  const tagged = rng.shuffle([
    { ...pickedTrue[0], isTrue: true },
    { ...pickedTrue[1], isTrue: true },
    { ...pickedFalse[0], isTrue: false },
    { ...pickedFalse[1], isTrue: false },
  ]);

  const correctNums = [];
  const explainParts = [];
  const listHtml = tagged
    .map((entry, idx) => {
      const n = idx + 1;
      if (entry.isTrue) {
        correctNums.push(n);
        explainParts.push(`<b>${n}</b> — верно (${entry.ru})`);
      } else {
        explainParts.push(`${n} — неверно (${entry.ru})`);
      }
      return `<li>${entry.text}</li>`;
    })
    .join('');

  const { options, answer, correct } = buildFourChooseTwo(rng, correctNums);

  return {
    stem: `Choose the correct answer to the question according to the passage.<br><i>${detail.question}</i><ol>${listHtml}</ol>`,
    format: 'single',
    options,
    answer,
    points: 1,
    difficulty,
    passage,
    hint: 'Два пункта перефразируют факты текста, а два противоречат ему или не упомянуты.',
    explanation: `Правильный ответ — <b>${correct}</b>.<br>${explainParts.join('<br>')}.`,
  };
}

export function generateReadingMain(rng, difficulty, fixedItem = null, passageObj = null) {
  const item = fixedItem || rng.pick(READING_PASSAGES);
  const passage = passageObj || makeReadingPassage(item);
  const idea = rng.pick(item.mainIdeas);
  const distractors = rng.sample(item.mainDistractors, 4);

  return buildSingle(rng, {
    stem: 'The passage is mainly about <span class="gap"></span> .',
    correct: idea.text,
    distractors,
    difficulty,
    points: 1,
    passage,
    hint: 'Обобщите содержание всех трёх абзацев — верный вариант не должен сводиться к частной детали из одного предложения.',
    explanation: `Правильный ответ: <b>${idea.text}</b> — ${idea.ru}. Остальные варианты описывают лишь отдельные детали или не соответствуют содержанию текста.`,
  });
}

export function generateReadingDefinition(rng, difficulty, fixedItem = null, passageObj = null) {
  const item = fixedItem || rng.pick(READING_PASSAGES);
  const passage = passageObj || makeReadingPassage(item);
  const defItem = rng.pick(item.definitions);

  return {
    stem: `Which word from paragraph ${defItem.paragraph} best fits the following definition “${defItem.def}”?`,
    format: 'short',
    answer: defItem.answer,
    accept: defItem.accept,
    points: 2,
    difficulty,
    passage,
    hint: `Внимательно перечитайте абзац ${defItem.paragraph} и найдите слово, подходящее по части речи к данному определению.`,
    explanation: `${defItem.ruExplain} Правильный ответ: <b>${defItem.answer}</b>.`,
  };
}

export function generateReadingSynonym(rng, difficulty, fixedItem = null, passageObj = null) {
  const item = fixedItem || rng.pick(READING_PASSAGES);
  const passage = passageObj || makeReadingPassage(item);
  const syn = rng.pick(item.synonyms);

  return {
    stem: `Write the synonym of the word “${syn.promptWord}” from paragraph ${syn.paragraph}.`,
    format: 'short',
    answer: syn.answer,
    accept: syn.accept,
    points: 2,
    difficulty,
    passage,
    hint: `Найдите в абзаце ${syn.paragraph} слово, близкое по смыслу к «${syn.promptWord}» и относящееся к той же части речи.`,
    explanation: `${syn.ruExplain} Правильный ответ: <b>${syn.answer}</b>.`,
  };
}

export function generateReadingParaphrase(rng, difficulty, fixedItem = null, passageObj = null) {
  const item = fixedItem || rng.pick(READING_PASSAGES);
  const passage = passageObj || makeReadingPassage(item);
  const para = rng.pick(item.paraphrases);

  return {
    stem: `Complete the sentence by changing at least 2 words according to the passage.<br><i>${para.starter}</i>`,
    format: 'open',
    answer: para.models.join('<br><i>Вариант:</i> '),
    rubric: '<ul><li><b>2 балла:</b> смысл текста передан полностью точно, изменено/заменено синонимами <b>не менее 2 слов</b> из исходного окончания, грамматика и орфография соблюдены.</li><li><b>1 балл:</b> смысл сохранён, но изменено меньше 2 слов или есть отдельные грамматические/лексические ошибки.</li><li><b>0 баллов:</b> смысл искажён или приведено дословное списывание без замен.</li></ul>',
    points: 2,
    difficulty: Math.max(difficulty, 2),
    passage,
    hint: `Исходное окончание в тексте: «${para.originalTail}». Замените минимум два знаменательных слова синонимами или измените грамматическую структуру.`,
    explanation: `Исходная фраза в тексте: «<i>${para.originalTail}</i>». ${para.ruExplain}`,
  };
}

export function generateReadingOpinion(rng, difficulty, fixedItem = null, passageObj = null) {
  const item = fixedItem || rng.pick(READING_PASSAGES);
  const passage = passageObj || makeReadingPassage(item);
  const op = rng.pick(item.opinions);

  return {
    stem: `Answer the question by expressing your opinion. Write at least three sentences.<br><i>${op.question}</i>`,
    format: 'open',
    answer: op.modelAnswer,
    rubric: '<ul><li><b>2 балла:</b> написано не менее <b>3 связных предложений</b> по теме вопроса, ясно выражена и аргументирована позиция, использованы средства связи (<i>First, Moreover, In my opinion</i>), соблюдено согласование времён и лексическая точность.</li><li><b>1 балл:</b> менее 3 предложений, недостаточная аргументация, либо заметные грамматические ошибки, не мешающие общему пониманию.</li><li><b>0 баллов:</b> ответ не по теме, менее одного осмысленного предложения или текст не на английском языке.</li></ul>',
    points: 2,
    difficulty: Math.max(difficulty, 2),
    passage,
    hint: op.ruHint,
    explanation: `Пример развёрнутого ответа (критерии ГЭЦ — объём ≥ 3 предложений, логическая связность и грамотность):<br><i>${op.modelAnswer}</i>`,
  };
}
