// Generators for Listening / Text I tasks (Tasks 1–6).

import { LISTENING_PASSAGES } from '../banks/listening-passages.js';
import { buildSingle, buildFourChooseTwo, formatPassageHtml } from '../helpers.js';

export function makeListeningPassage(item, instanceId = null) {
  return {
    id: instanceId || item.id,
    title: item.title,
    html: formatPassageHtml(item.paragraphs, false),
  };
}

export function generateListeningTrue(rng, difficulty, fixedItem = null, passageObj = null) {
  const item = fixedItem || rng.pick(LISTENING_PASSAGES);
  const passage = passageObj || makeListeningPassage(item);
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
    hint: 'Проверьте факты каждого утверждения по абзацам текста (обращайте внимание на числа, отрицания и подмену действующих лиц).',
    explanation: `Правильный ответ: <b>«${truth.text}»</b>. ${truth.ru}<br><div class="note">Разбор неверных вариантов: ${reasons}.</div>`,
  });
}

export function generateListeningMain(rng, difficulty, fixedItem = null, passageObj = null) {
  const item = fixedItem || rng.pick(LISTENING_PASSAGES);
  const passage = passageObj || makeListeningPassage(item);
  const idea = rng.pick(item.mainIdeas);
  const distractors = rng.sample(item.mainDistractors, 4);

  return buildSingle(rng, {
    stem: 'The passage is mainly about <span class="gap"></span> .',
    correct: idea.text,
    distractors,
    difficulty,
    points: 1,
    passage,
    hint: 'Отличайте главную тему всего текста от частных деталей, упомянутых только в одном предложении.',
    explanation: `Правильный ответ: <b>${idea.text}</b> — ${idea.ru}. Остальные варианты отражают лишь второстепенные детали или искажают содержание.`,
  });
}

export function generateListeningMulti(rng, difficulty, fixedItem = null, passageObj = null) {
  const item = fixedItem || rng.pick(LISTENING_PASSAGES);
  const passage = passageObj || makeListeningPassage(item);
  const set = rng.pick(item.multiSets);

  const pickedTrue = rng.sample(set.trueItems, 2);
  const pickedFalse = rng.sample(set.falseItems, 2);

  // Mix 2 true + 2 false in randomized numbered positions 1..4
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
    stem: `Complete the sentence according to the passage.<br><i>${set.prompt}</i><ol>${listHtml}</ol>`,
    format: 'single',
    options,
    answer,
    points: 1,
    difficulty,
    passage,
    hint: 'Проверьте каждый из четырёх пунктов отдельно: два из них соответствуют тексту, два содержат фактическую ошибку.',
    explanation: `Правильная пара — <b>${correct}</b>.<br>${explainParts.join('<br>')}.`,
  };
}

export function generateListeningQa(rng, difficulty, fixedItem = null, passageObj = null, forceKind = null) {
  const item = fixedItem || rng.pick(LISTENING_PASSAGES);
  const passage = passageObj || makeListeningPassage(item);
  const candidates = forceKind
    ? item.qaItems.filter((q) => q.kind === forceKind)
    : item.qaItems;
  const qa = rng.pick(candidates.length > 0 ? candidates : item.qaItems);

  return {
    stem: qa.stem,
    format: 'open',
    answer: qa.answer,
    rubric: qa.rubric,
    points: 2,
    difficulty,
    passage,
    hint: qa.hint,
    explanation: `${qa.ruExplain} Эталонный ответ: <i>${qa.answer}</i>.`,
  };
}

export function generateListeningAdj(rng, difficulty, fixedItem = null, passageObj = null) {
  const item = fixedItem || rng.pick(LISTENING_PASSAGES);
  const passage = passageObj || makeListeningPassage(item);
  const target = rng.pick(item.adjItems);

  return {
    stem: `Write one adjective from the passage that describes the word “${target.noun}”.`,
    format: 'short',
    answer: target.adj,
    accept: target.accept || [target.adj],
    points: 2,
    difficulty,
    passage,
    hint: `Найдите в тексте существительное <i>${target.noun}</i> и выпишите стоящее перед ним определение-прилагательное.`,
    explanation: `${target.ruExplain}<br>Контекст: «${target.sentence}»`,
  };
}
