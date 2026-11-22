// Generators for all Grammar & Syntax TaskTypes (19 types).

import {
  TENSE_FRAMES,
  PASSIVE_CONVERSIONS,
  PASSIVE_TRANSITIVE,
  PASSIVE_INTRANSITIVE,
  MODAL_FRAMES,
  NONFINITE_COMPLEX_PAIR,
  NONFINITE_SINGLE,
  CONDITIONAL_FRAMES,
  REPORTED_FRAMES,
} from '../banks/grammar-verbs.js';

import {
  COMPOUND_NOUNS,
  DERIVATIVE_NOUNS,
  PARTITIVE_PHRASES,
  POSSESSIVE_NUMERAL_FRAMES,
  ARTICLE_FRAMES,
  PRONOUN_FRAMES,
  QUANTIFIER_FRAMES,
  ADJECTIVE_ADVERB_FRAMES,
  PREPOSITION_FRAMES,
} from '../banks/grammar-nominal.js';

import {
  QUESTION_ORDER_ITEMS,
  QUESTION_WORD_ITEMS,
  TAG_QUESTION_ITEMS,
  SUBORDINATE_CLAUSE_ITEMS,
  WORD_ORDER_SENTENCES,
  CONJUNCTION_FRAMES,
  AGREEMENT_FRAMES,
} from '../banks/grammar-syntax.js';

import { buildSingle, buildFourChooseTwo, pickByDifficulty } from '../helpers.js';

function lowercaseLead(chunk) {
  // Keep proper nouns or acronyms capitalized; lowercase common determiner/noun starters.
  const keepCap = /^(Baku|Gobustan|Ganja|Sheki|Lankaran|Azerbaijan|English|French|Caspian|I\b)/;
  if (keepCap.test(chunk)) return chunk;
  return chunk.charAt(0).toLowerCase() + chunk.slice(1);
}

export function generateTenses(rng, difficulty) {
  const item = pickByDifficulty(rng, TENSE_FRAMES, difficulty);
  return buildSingle(rng, {
    stem: `Choose the correct tense form.<br><i>${item.stem}</i>`,
    correct: item.correct,
    distractors: item.distractors,
    difficulty,
    hint: 'Обратите внимание на маркер времени, тип придаточного предложения (<i>when / until / as soon as</i>) и согласование времён.',
    explanation: `Правильный ответ — <b>${item.correct}</b>. ${item.rule}`,
  });
}

export function generatePassive(rng, difficulty) {
  const usePassivizable = difficulty === 3 ? rng.chance(0.65) : difficulty === 2 ? rng.chance(0.4) : false;

  if (usePassivizable) {
    const askCant = rng.chance(0.5);
    const trans = rng.sample(PASSIVE_TRANSITIVE, 2);
    const intrans = rng.sample(PASSIVE_INTRANSITIVE, 2);
    const tagged = rng.shuffle([
      { text: trans[0], canPassive: true },
      { text: trans[1], canPassive: true },
      { text: intrans[0], canPassive: false },
      { text: intrans[1], canPassive: false },
    ]);

    const correctNums = [];
    const explainParts = [];
    const listHtml = tagged
      .map((entry, idx) => {
        const n = idx + 1;
        const matches = askCant ? !entry.canPassive : entry.canPassive;
        if (matches) correctNums.push(n);
        explainParts.push(
          entry.canPassive
            ? `${n} — переводится в Passive (есть прямое дополнение после переходного глагола)`
            : `${n} — <b>не</b> переводится в Passive (непереходный глагол / глагол-связка без прямого дополнения)`
        );
        return `<li>${entry.text}</li>`;
      })
      .join('');

    const { options, answer, correct } = buildFourChooseTwo(rng, correctNums);
    const stemAsk = askCant
      ? 'Which sentences <b>can’t</b> be changed into the Passive Voice?'
      : 'Which sentences <b>can</b> be changed into the Passive Voice?';

    return {
      stem: `${stemAsk}<ol>${listHtml}</ol>`,
      format: 'single',
      options,
      answer,
      points: 1,
      difficulty,
      hint: 'В страдательный залог можно преобразовать только предложения с <b>переходным</b> глаголом и прямым дополнением.',
      explanation: `Правильный ответ — <b>${correct}</b>.<br>${explainParts.join('<br>')}.`,
    };
  }

  const item = pickByDifficulty(rng, PASSIVE_CONVERSIONS, difficulty);
  return buildSingle(rng, {
    stem: `Change the sentence into the Passive Voice.<br><i>${item.active}</i>`,
    correct: item.correct,
    distractors: item.distractors,
    difficulty,
    hint: 'Сохраните время исходного глагола и согласуйте вспомогательный глагол <i>be/have</i> с новым подлежащим по числу.',
    explanation: `Правильный вариант: <b>${item.correct}</b>. ${item.rule}`,
  });
}

export function generateModals(rng, difficulty) {
  const item = pickByDifficulty(rng, MODAL_FRAMES, difficulty);
  return buildSingle(rng, {
    stem: `Choose the correct option.<br><i>${item.stem}</i>`,
    correct: item.correct,
    distractors: item.distractors,
    difficulty,
    hint: 'Проверьте наличие/отсутствие частицы <i>to</i> после пропуска, время действия и логическую связь между частями предложения.',
    explanation: `Правильный ответ — <b>${item.correct}</b>. ${item.rule}`,
  });
}

export function generateNonfinite(rng, difficulty) {
  const usePair = difficulty >= 2 && rng.chance(0.35);
  if (usePair) {
    const item = pickByDifficulty(rng, NONFINITE_COMPLEX_PAIR, difficulty, 2);
    const expectBare = item.stem.includes('never') || item.stem.includes('thunder');
    const goodPool = expectBare ? item.bareVerbs : item.toVerbs;
    const badPool = expectBare ? item.toVerbs : item.bareVerbs;

    const chosenGood = rng.sample(goodPool, 2);
    const chosenBad = rng.sample(badPool, 2);
    const tagged = rng.shuffle([
      { v: chosenGood[0], ok: true },
      { v: chosenGood[1], ok: true },
      { v: chosenBad[0], ok: false },
      { v: chosenBad[1], ok: false },
    ]);

    const correctNums = [];
    const listHtml = tagged
      .map((entry, idx) => {
        if (entry.ok) correctNums.push(idx + 1);
        return `<li>${entry.v}</li>`;
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
      hint: 'Проверьте, употребляется ли второй глагол в Complex Object с частицей <i>to</i> или без неё (после <i>let / make</i> — без <i>to</i>).',
      explanation: `Правильный ответ — <b>${correct}</b>. ${item.rule}`,
    };
  }

  const item = pickByDifficulty(rng, NONFINITE_SINGLE, difficulty);
  return buildSingle(rng, {
    stem: `Choose the correct option.<br><i>${item.stem}</i>`,
    correct: item.correct,
    distractors: item.distractors,
    difficulty,
    hint: 'Обратите внимание на управляющий глагол (Complex Object, герундий <i>-ing</i> или инфинитив) и различие причастий <i>-ing / -ed</i>.',
    explanation: `Правильный ответ — <b>${item.correct}</b>. ${item.rule}`,
  });
}

export function generateConditionals(rng, difficulty) {
  const item = pickByDifficulty(rng, CONDITIONAL_FRAMES, difficulty);
  return buildSingle(rng, {
    stem: `Choose the correct option.<br><i>${item.stem}</i>`,
    correct: item.correct,
    distractors: item.distractors,
    difficulty,
    hint: 'Определите тип условного предложения (I, II, III или <i>I wish</i>) по глаголу в известной части.',
    explanation: `Правильный ответ — <b>${item.correct}</b>. ${item.rule}`,
  });
}

export function generateReported(rng, difficulty) {
  const item = pickByDifficulty(rng, REPORTED_FRAMES, difficulty);
  return buildSingle(rng, {
    stem: `Choose the correct reported sentence.<br><i>${item.direct}</i>`,
    correct: item.correct,
    distractors: item.distractors,
    difficulty,
    hint: 'Проверьте сдвиг времён назад (Sequence of Tenses), замену местоимений/наречий времени и прямой порядок слов в косвенных вопросах.',
    explanation: `Правильный вариант: <b>${item.correct}</b>. ${item.rule}`,
  });
}

export function generateNouns(rng, difficulty) {
  const modeRoll = rng.float();

  // Mode 1: Compound nouns line (0903 #11 style)
  if (modeRoll < 0.42) {
    const correctWords = rng.sample(COMPOUND_NOUNS, 3);
    const correctLine = correctWords.join(', ');
    const remainingCompounds = COMPOUND_NOUNS.filter((w) => !correctWords.includes(w));
    const pickedDerivs = rng.sample(DERIVATIVE_NOUNS, 4);
    const compForDistractors = rng.sample(remainingCompounds, 8);

    const distractors = [];
    const derivNotes = [];
    for (let i = 0; i < 4; i++) {
      const triple = rng.shuffle([
        compForDistractors[i * 2],
        compForDistractors[i * 2 + 1],
        pickedDerivs[i].word,
      ]);
      distractors.push(triple.join(', '));
      derivNotes.push(`<i>${pickedDerivs[i].word}</i> (суффикс <b>${pickedDerivs[i].suffix}</b>)`);
    }

    return buildSingle(rng, {
      stem: 'Choose the line of compound nouns.',
      correct: correctLine,
      distractors,
      difficulty,
      hint: 'Сложное существительное (compound noun) состоит из двух полноценных корней; отсейте производные слова с суффиксами <i>-tion, -ment, -ness, -hood, -ship, -dom</i>.',
      explanation: `Правильный ответ — <b>${correctLine}</b>: все три слова образованы сложением двух основ. В остальных строках присутствуют производные существительные: ${derivNotes.join(', ')}.`,
    });
  }

  // Mode 2: Partitives & uncountables (1503 #12 style)
  if (modeRoll < 0.72) {
    const picked = rng.sample(PARTITIVE_PHRASES, 4);
    const tagged = rng.shuffle([
      { text: picked[0].good, ok: true },
      { text: picked[1].good, ok: true },
      { text: picked[2].bad, ok: false, reason: picked[2].reason },
      { text: picked[3].bad, ok: false, reason: picked[3].reason },
    ]);

    const correctNums = [];
    const explainParts = [];
    const listHtml = tagged
      .map((entry, idx) => {
        const n = idx + 1;
        if (entry.ok) {
          correctNums.push(n);
          explainParts.push(`<b>${n}. ${entry.text}</b> — верно`);
        } else {
          explainParts.push(`${n}. <i>${entry.text}</i> — неверно (${entry.reason})`);
        }
        return `<li>${entry.text}</li>`;
      })
      .join('');

    const { options, answer, correct } = buildFourChooseTwo(rng, correctNums);
    return {
      stem: `Choose the correct option.<ol>${listHtml}</ol>`,
      format: 'single',
      options,
      answer,
      points: 1,
      difficulty,
      hint: 'Проверьте согласование артикля <i>a/an</i> (только с единственным числом исчисляемых слов) и числительных больше 1 (только с множественным числом).',
      explanation: `Правильный ответ — <b>${correct}</b>.<br>${explainParts.join('<br>')}.`,
    };
  }

  // Mode 3: Possessive case, irregular plurals, numerals (missing DİM curriculum topics)
  const item = pickByDifficulty(rng, POSSESSIVE_NUMERAL_FRAMES, difficulty, 2);
  return buildSingle(rng, {
    stem: item.stem,
    correct: item.correct,
    distractors: item.distractors,
    difficulty,
    hint: 'Отличайте притяжательный падеж <i>’s / s’</i> от сокращений <i>is / has</i> и помните правила согласования неисчисляемых/разрядных числительных.',
    explanation: `Правильный ответ: <b>${item.correct}</b>. ${item.rule}`,
  });
}

export function generateArticles(rng, difficulty) {
  const item = pickByDifficulty(rng, ARTICLE_FRAMES, difficulty);
  return buildSingle(rng, {
    stem: `Choose the correct option.<br><i>${item.stem}</i>`,
    correct: item.correct,
    distractors: item.distractors,
    difficulty,
    hint: 'Обратите внимание на конкретизацию (определительное придаточное), превосходную степень, географические правила и произношение начального звука для <i>a / an</i>.',
    explanation: `Правильный ответ — <b>${item.correct}</b>. ${item.rule}`,
  });
}

export function generatePronouns(rng, difficulty) {
  const item = pickByDifficulty(rng, PRONOUN_FRAMES, difficulty);
  return buildSingle(rng, {
    stem: `Choose the correct option.<br><i>${item.stem}</i>`,
    correct: item.correct,
    distractors: item.distractors,
    difficulty,
    hint: 'Проверьте лицо, число и род подлежащего/заменяемого существительного, а также тип предложения (утверждение/отрицание) для <i>some / any / no</i>.',
    explanation: `Правильный ответ — <b>${item.correct}</b>. ${item.rule}`,
  });
}

export function generateQuantifiers(rng, difficulty) {
  const item = pickByDifficulty(rng, QUANTIFIER_FRAMES, difficulty);
  return buildSingle(rng, {
    stem: `Choose the correct option.<br><i>${item.stem}</i>`,
    correct: item.correct,
    distractors: item.distractors,
    difficulty,
    hint: 'Определите, исчисляемое существительное (во мн. ч.) или неисчисляемое, а также разницу между «почти нет» (<i>few / little</i>) и «немного» (<i>a few / a little</i>).',
    explanation: `Правильный ответ — <b>${item.correct}</b>. ${item.rule}`,
  });
}

export function generateAdjectivesAdverbs(rng, difficulty) {
  const item = pickByDifficulty(rng, ADJECTIVE_ADVERB_FRAMES, difficulty);
  return buildSingle(rng, {
    stem: `Choose the correct option.<br><i>${item.stem}</i>`,
    correct: item.correct,
    distractors: item.distractors,
    difficulty,
    hint: 'Проверьте маркер степени сравнения (<i>very, than, the, as...as</i>) и тип глагола перед пропуском (связка <i>smell/look/taste</i> требует прилагательного).',
    explanation: `Правильный ответ — <b>${item.correct}</b>. ${item.rule}`,
  });
}

export function generatePrepositions(rng, difficulty) {
  const item = pickByDifficulty(rng, PREPOSITION_FRAMES, difficulty);
  return buildSingle(rng, {
    stem: `Choose the correct option.<br><i>${item.stem}</i>`,
    correct: item.correct,
    distractors: item.distractors,
    difficulty,
    hint: 'Вспомните предложное управление глаголов/прилагательных и глаголы, которые употребляются без предлога (<i>enter, answer, discuss, reach</i>).',
    explanation: `Правильный ответ — <b>${item.correct}</b>. ${item.rule}`,
  });
}

export function generateQuestions(rng, difficulty) {
  const roll = rng.float();
  if (difficulty === 1 || (difficulty === 2 && roll < 0.35)) {
    const item = pickByDifficulty(rng, QUESTION_WORD_ITEMS, difficulty, 2);
    return buildSingle(rng, {
      stem: `Choose the correct option.<br><i>${item.stem}</i>`,
      correct: item.correct,
      distractors: item.distractors,
      difficulty,
      hint: 'Определите, к какому члену предложения задаётся вопрос (причина, принадлежность, длительность, выбор или лицо).',
      explanation: `Правильный ответ — <b>${item.correct}</b>. ${item.rule}`,
    });
  }
  if (difficulty === 3 && roll < 0.48) {
    const item = pickByDifficulty(rng, TAG_QUESTION_ITEMS, difficulty, 2);
    return buildSingle(rng, {
      stem: `Choose the correct question tag.<br><i>${item.stem}</i>`,
      correct: item.correct,
      distractors: item.distractors,
      difficulty,
      hint: 'Учитывайте полярность главной части (утверждение → отрицательный хвостик; отрицание/<i>never/hardly</i> → утвердительный) и особые формы <i>aren’t I / shall we</i>.',
      explanation: `Правильный ответ — <b>${item.correct}</b>. ${item.rule}`,
    });
  }
  const item = pickByDifficulty(rng, QUESTION_ORDER_ITEMS, difficulty, 2);
  return buildSingle(rng, {
    stem: 'Choose the correct interrogative sentence.',
    correct: item.correct,
    distractors: item.distractors,
    difficulty,
    hint: 'Проверьте положение вспомогательного глагола перед подлежащим и форму смыслового глагола (после <i>did/does</i> всегда V1).',
    explanation: `Правильный вопрос: <b>${item.correct}</b>. ${item.rule}`,
  });
}

export function generateSubordinateClauses(rng, difficulty) {
  const item = pickByDifficulty(rng, SUBORDINATE_CLAUSE_ITEMS, difficulty);
  return buildSingle(rng, {
    stem: `Complete the sentence.<br><i>${item.stem}</i>`,
    correct: item.correct,
    distractors: item.distractors,
    difficulty,
    hint: 'В косвенном вопросе (придаточном предложении) после союзного слова требуется <b>прямой порядок слов</b>: подлежащее + сказуемое.',
    explanation: `Правильный ответ — <b>${item.correct}</b>. ${item.rule}`,
  });
}

export function generateWordOrder(rng, difficulty) {
  const item = pickByDifficulty(rng, WORD_ORDER_SENTENCES, difficulty, 3);
  const rawChunks = item.chunks.map(lowercaseLead);
  const n = rawChunks.length;

  // Permute chunks for display numbers 1..n (ensure non-identity display permutation)
  let displayOrder = rng.shuffle(rawChunks.map((_, idx) => idx));
  if (displayOrder.every((v, i) => v === i)) {
    [displayOrder[0], displayOrder[n - 1]] = [displayOrder[n - 1], displayOrder[0]];
  }

  // `displayOrder[displayIdx]` is the original chunk index shown as number (displayIdx + 1).
  // Thus original chunk `origIdx` has 1-based number `displayOrder.indexOf(origIdx) + 1`.
  const correctArr = rawChunks.map((_, origIdx) => displayOrder.indexOf(origIdx) + 1);
  const correctStr = correctArr.join(', ');

  // Generate 4 invalid permutations deterministically
  const wrongSet = new Set();
  const makeSwap = (arr, a, b) => {
    const copy = arr.slice();
    [copy[a], copy[b]] = [copy[b], copy[a]];
    return copy;
  };
  const candidates = [
    makeSwap(correctArr, 0, 1),
    makeSwap(correctArr, 1, 2),
    makeSwap(correctArr, n - 2, n - 1),
    makeSwap(correctArr, 0, n - 1),
    [correctArr[1], correctArr[2], correctArr[0], ...correctArr.slice(3)],
    [...correctArr.slice(0, -3), correctArr[n - 1], correctArr[n - 2], correctArr[n - 3]],
    correctArr.slice().reverse(),
  ];
  for (const cand of candidates) {
    const s = cand.join(', ');
    if (s !== correctStr) wrongSet.add(s);
    if (wrongSet.size >= 6) break;
  }
  while (wrongSet.size < 4) {
    const s = rng.shuffle(correctArr).join(', ');
    if (s !== correctStr) wrongSet.add(s);
  }

  const listHtml = displayOrder
    .map((origIdx) => `<li>${rawChunks[origIdx]}</li>`)
    .join('');

  return buildSingle(rng, {
    stem: `Make up a sentence.<ol>${listHtml}</ol>`,
    correct: correctStr,
    distractors: [...wrongSet],
    difficulty,
    hint: 'Определите подлежащее (кто/что?), сказуемое, затем прямое дополнение, место и время.',
    explanation: `Правильная последовательность — <b>${correctStr}</b>: «<i>${item.sentence}</i>». ${item.rule}`,
  });
}

export function generateSentenceOrder(rng, difficulty) {
  const item = pickByDifficulty(rng, WORD_ORDER_SENTENCES, difficulty, 3);
  const rawChunks = item.chunks.map(lowercaseLead);
  const n = rawChunks.length;

  let perm = rng.shuffle(rawChunks.map((_, idx) => idx));
  if (perm.every((v, i) => v === i)) {
    [perm[0], perm[n - 1]] = [perm[n - 1], perm[0]];
  }
  const options = perm.map((origIdx) => rawChunks[origIdx]);
  const answer = rawChunks.map((_, origIdx) => perm.indexOf(origIdx));

  return {
    stem: 'Put the words and phrases in the correct order to make up a sentence.',
    format: 'order',
    options,
    answer,
    points: 1,
    difficulty,
    hint: 'Соберите сначала основу предложения (подлежащее + сказуемое), затем добавьте дополнение, место и время.',
    explanation: `Правильное предложение: «<b>${item.sentence}</b>». ${item.rule}`,
  };
}

export function generateConjunctions(rng, difficulty) {
  const item = pickByDifficulty(rng, CONJUNCTION_FRAMES, difficulty);
  return buildSingle(rng, {
    stem: `Choose the correct option.<br><i>${item.stem}</i>`,
    correct: item.correct,
    distractors: item.distractors,
    difficulty,
    hint: 'Определите смысловую связь (противопоставление, причина, следствие, условие, определение) и форму следующей за пропуском группы (придаточное или существительное).',
    explanation: `Правильный ответ — <b>${item.correct}</b>. ${item.rule}`,
  });
}

export function generateAgreement(rng, difficulty) {
  const item = pickByDifficulty(rng, AGREEMENT_FRAMES, difficulty);
  return buildSingle(rng, {
    stem: `Choose the correct option.<br><i>${item.stem}</i>`,
    correct: item.correct,
    distractors: item.distractors,
    difficulty,
    hint: 'Для реплик с <i>so / neither / too / either</i> проверьте полярность и время; для подлежащего со сказуемым проверьте число (<i>news, physics, police, the/a number of</i>).',
    explanation: `Правильный ответ — <b>${item.correct}</b>. ${item.rule}`,
  });
}
