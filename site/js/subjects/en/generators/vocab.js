// Generators for Vocabulary, Word Formation & Dialogues:
// en.vocab-definitions, en.vocab-match, en.vocab-antonyms, en.vocab-context,
// en.word-formation, en.dialogues

import {
  VOCAB_DEFINITIONS,
  ANTONYM_PAIRS,
  SYNONYM_PAIRS,
  CONTEXT_PAIR_ITEMS,
  CONTEXT_SINGLE_ITEMS,
  WORD_FORMATION_ITEMS,
  DIALOGUE_ITEMS,
} from '../banks/vocab-functional.js';

import { buildSingle, buildFourChooseTwo, pickByDifficulty } from '../helpers.js';

const ALL_3_PERMS = [
  [0, 1, 2],
  [0, 2, 1],
  [1, 0, 2],
  [1, 2, 0],
  [2, 0, 1],
  [2, 1, 0],
];

export function generateVocabDefinitions(rng, difficulty) {
  const filtered = VOCAB_DEFINITIONS.filter((w) => w.diff <= difficulty || difficulty === 3);
  const pool = filtered.length >= 6 ? filtered : VOCAB_DEFINITIONS;
  const items = rng.sample(pool, 3);
  const defOrder = rng.shuffle([0, 1, 2]);
  const letters = ['a', 'b', 'c'];

  const correctIndices = [0, 1, 2].map((wIdx) => defOrder.indexOf(wIdx));
  const formatMatch = (perm) => perm.map((dIdx, wIdx) => `${wIdx + 1} – ${letters[dIdx]}`).join(', ');
  const correctStr = formatMatch(correctIndices);

  const distractors = ALL_3_PERMS
    .filter((p) => p.some((v, i) => v !== correctIndices[i]))
    .map(formatMatch);

  const wordsHtml = items.map((it) => `<li>${it.word}</li>`).join('');
  const defsHtml = defOrder.map((origIdx, pos) => `${letters[pos]}. ${items[origIdx].def}`).join('<br>');
  const explainList = items
    .map((it, i) => `<b>${i + 1}) ${it.word}</b> (${it.ru}) — ${letters[correctIndices[i]]} (${it.def})`)
    .join('<br>');

  return buildSingle(rng, {
    stem: `Match the words to their definitions.<ol>${wordsHtml}</ol><p>${defsHtml}</p>`,
    correct: correctStr,
    distractors,
    difficulty,
    hint: 'Найдите сначала самое знакомое слово и отсейте варианты с неверной парой для него.',
    explanation: `Правильное соответствие — <b>${correctStr}</b>:<br>${explainList}.`,
  });
}

export function generateVocabMatch(rng, difficulty) {
  const count = difficulty === 1 ? 3 : 4;
  const filtered = VOCAB_DEFINITIONS.filter((w) => w.diff <= difficulty || difficulty === 3);
  const pool = filtered.length >= count + 2 ? filtered : VOCAB_DEFINITIONS;

  const picked = rng.sample(pool, count + 1);
  const leftItems = picked.slice(0, count);
  const rightEntries = rng.shuffle(picked);

  const left = leftItems.map((it) => `<b>${it.word}</b>`);
  const right = rightEntries.map((it) => it.def);
  const answer = leftItems.map((it) => rightEntries.indexOf(it));

  const letters = ['A', 'B', 'C', 'D', 'E'];
  const explainList = leftItems
    .map((it, i) => `<b>${i + 1} → ${letters[answer[i]]}</b>: ${it.word} (${it.ru}) — ${it.def}`)
    .join('<br>');

  return {
    stem: `Match each word (1–${count}) with its definition (A–${letters[count]}). Note that one definition is extra.`,
    format: 'match',
    pairs: { left, right },
    answer,
    points: 1,
    difficulty,
    partial: true,
    hint: 'Обращайте внимание на часть речи (глагол с <i>to</i>, существительное, прилагательное) — лишнее определение не подходит ни к одному слову.',
    explanation: `Верные соответствия:<br>${explainList}.`,
  };
}

export function generateVocabAntonyms(rng, difficulty) {
  const antPool = ANTONYM_PAIRS.filter((p) => p.diff <= difficulty || difficulty === 3);
  const synPool = SYNONYM_PAIRS.filter((p) => p.diff <= difficulty || difficulty === 3);
  const aPool = antPool.length >= 5 ? antPool : ANTONYM_PAIRS;
  const sPool = synPool.length >= 5 ? synPool : SYNONYM_PAIRS;

  const roll = rng.float();

  // Mode 1: 5 numbered pairs, pick 3 antonym pairs (1503 #19 style)
  if (difficulty >= 2 && roll < 0.45) {
    const pickedAnt = rng.sample(aPool, 3);
    const pickedSyn = rng.sample(sPool, 2);
    const tagged = rng.shuffle([
      { ...pickedAnt[0], isAnt: true },
      { ...pickedAnt[1], isAnt: true },
      { ...pickedAnt[2], isAnt: true },
      { ...pickedSyn[0], isAnt: false },
      { ...pickedSyn[1], isAnt: false },
    ]);

    const correctNums = [];
    const explainParts = [];
    const listHtml = tagged
      .map((entry, idx) => {
        const n = idx + 1;
        if (entry.isAnt) {
          correctNums.push(n);
          explainParts.push(`<b>${n}. ${entry.pair}</b> — антонимы (${entry.ru})`);
        } else {
          explainParts.push(`${n}. <i>${entry.pair}</i> — синонимы (${entry.ru})`);
        }
        return `<li>${entry.pair}</li>`;
      })
      .join('');

    const correctStr = correctNums.join(', ');
    // Generate 4 distinct wrong combinations of 2 or 3 numbers from 1..5
    const wrongTriples = [
      '1, 2, 3', '1, 2, 4', '1, 2, 5', '1, 3, 4', '1, 3, 5',
      '1, 4, 5', '2, 3, 4', '2, 3, 5', '2, 4, 5', '3, 4, 5',
      '1, 4', '2, 4', '3, 5', '1, 5',
    ].filter((s) => s !== correctStr);

    return buildSingle(rng, {
      stem: `Choose the pairs of words with opposite meanings.<ol>${listHtml}</ol>`,
      correct: correctStr,
      distractors: wrongTriples,
      difficulty,
      hint: 'Две из пяти пар являются синонимами, а три — антонимами (противоположными по значению).',
      explanation: `Правильный ответ — <b>${correctStr}</b>:<br>${explainParts.join('<br>')}.`,
    });
  }

  // Mode 2: Choose 1 antonym pair among 4 synonym pairs (0903 #17 style) OR 1 synonym pair among 4 antonyms
  const askSynonym = roll >= 0.78;
  if (askSynonym) {
    const target = rng.pick(sPool);
    const distractors = rng.sample(aPool, 4);
    const distNotes = distractors.map((d) => `<i>${d.pair}</i> (${d.ru})`).join(', ');
    return buildSingle(rng, {
      stem: 'Choose the pair of synonyms (words with similar meanings).',
      correct: target.pair,
      distractors: distractors.map((d) => d.pair),
      difficulty,
      hint: 'Четыре пары состоят из антонимов (слов с противоположным значением), и только одна пара — синонимы.',
      explanation: `Правильный ответ — <b>${target.pair}</b> (синонимы: ${target.ru}). Остальные пары — антонимы: ${distNotes}.`,
    });
  }

  const target = rng.pick(aPool);
  const distractors = rng.sample(sPool, 4);
  const distNotes = distractors.map((d) => `<i>${d.pair}</i> (${d.ru})`).join(', ');
  return buildSingle(rng, {
    stem: 'Choose the pair of words with opposite meanings.',
    correct: target.pair,
    distractors: distractors.map((d) => d.pair),
    difficulty,
    hint: 'Четыре пары являются синонимами (близкими по значению), и только одна пара — антонимы.',
    explanation: `Правильный ответ — <b>${target.pair}</b> (антонимы: ${target.ru}). Остальные пары — синонимы: ${distNotes}.`,
  });
}

export function generateVocabContext(rng, difficulty) {
  if (difficulty <= 2 && rng.chance(0.45)) {
    const item = rng.pick(CONTEXT_PAIR_ITEMS);
    const goods = rng.sample(item.cleanGood, 2);
    const bads = rng.sample(item.bad, 2);
    const tagged = rng.shuffle([
      { word: goods[0], ok: true },
      { word: goods[1], ok: true },
      { word: bads[0], ok: false },
      { word: bads[1], ok: false },
    ]);

    const correctNums = [];
    const listHtml = tagged
      .map((entry, idx) => {
        if (entry.ok) correctNums.push(idx + 1);
        return `<li>${entry.word}</li>`;
      })
      .join('');

    const { options, answer, correct } = buildFourChooseTwo(rng, correctNums);
    return {
      stem: `Choose the correct option.<br><i>${item.stem}</i><ol>${listHtml}</ol>`,
      format: 'single',
      options,
      answer,
      points: 1,
      difficulty,
      hint: 'Определите эмоциональную/смысловую окраску предложения и выберите два подходящих прилагательных.',
      explanation: `Правильный ответ — <b>${correct}</b> (<i>${goods.join(', ')}</i>). ${item.rule}`,
    };
  }

  const item = pickByDifficulty(rng, CONTEXT_SINGLE_ITEMS, difficulty);
  return buildSingle(rng, {
    stem: `Choose the correct word or phrase.<br><i>${item.stem}</i>`,
    correct: item.correct,
    distractors: item.distractors,
    difficulty,
    hint: 'Обратите внимание на устойчивую лексическую сочетаемость (коллокацию) и управление слова в контексте.',
    explanation: `Правильный ответ — <b>${item.correct}</b>. ${item.rule}`,
  });
}

export function generateWordFormation(rng, difficulty) {
  const item = pickByDifficulty(rng, WORD_FORMATION_ITEMS, difficulty);
  return buildSingle(rng, {
    stem: `Choose the correct derived word.<br><i>${item.stem}</i>`,
    correct: item.correct,
    distractors: item.distractors,
    difficulty,
    hint: 'Определите, какая часть речи требуется по позиции в предложении (существительное, прилагательное или наречие), и проверьте правильный отрицательный префикс.',
    explanation: `Правильный ответ — <b>${item.correct}</b>. ${item.rule}`,
  });
}

export function generateDialogues(rng, difficulty) {
  const item = pickByDifficulty(rng, DIALOGUE_ITEMS, difficulty);
  return buildSingle(rng, {
    stem: `${item.speakerBPrompt}<br><blockquote><b>A:</b> ${item.speakerA}<br><b>B:</b> <span class="gap"></span></blockquote>`,
    correct: item.correct,
    distractors: item.distractors,
    difficulty,
    hint: 'Учитывайте речевое намерение собеседника (просьба, извинение, приглашение, вопрос о маршруте) и правила английского речевого этикета.',
    explanation: `Правильная реплика: «<b>${item.correct}</b>». ${item.rule}`,
  });
}
