// SubjectModule for Azerbaijani Language ("Azərbaycan dili — tədris dili", id: 'az').
// Covers all 11-grade DİM Buraxılış İmtahanı task types + missing DİM 5–11 curriculum topics.

import { loadOriginals, finalizeTask } from '../../core/contract.js';
import {
  analyzePhonetics,
  inflectNoun,
  buildSingleOptions,
  buildComboOptions,
  buildPairComboOptions,
  fmtNums,
} from './az-rules.js';
import {
  CLEAN_PHONETIC_WORDS,
  PHONETIC_SENTENCES,
  ORTHO_ITEMS,
  COMPOUND_ORTHO,
  STRESS_WORDS,
  STRESS_HOMOGRAPHS,
} from './banks/phonetics-ortho.js';
import {
  SCHEMA_LABELS,
  MORPHEME_WORDS,
  SAME_ROOT_SETS,
  MUREKKEB_AD,
  COMPOUND_WORDS_DIST,
  FREE_PHRASES_DIST,
  IDIOM_ITEMS,
  NON_IDIOM_PHRASES,
  HOMONYMS_BANK,
  POLYSEMY_BANK,
  LEXICAL_MEANINGS,
} from './banks/lexics-morphemics.js';
import {
  VOWEL_DROP_NOUNS,
  CASE_VS_POSS_ITEMS,
  NUMERAL_AGREEMENT,
  NUMERAL_PAIR_TASKS,
  ADJ_DEGREES,
  OBU_COMMA_ITEMS,
  VERB_VOICE_ITEMS,
  VERB_MOODS,
  MOOD_LABELS_RU,
  ADVERB_NONFINITE_POOL,
  AUX_POS_ITEMS,
} from './banks/morphology.js';
import {
  PARTICIPLE_PHRASE_SETS,
  INFINITIVE_PRED_SETS,
  XITAB_AMBIGUOUS_SETS,
  SYNTACTIC_ANALYSIS_SETS,
  SCHEMA_LEGEND,
  renderSchema,
  SYNTAX_SCHEMA_ITEMS,
  COMPLEX_SENTENCE_BUILDERS,
  DIRECT_SPEECH_PAIRS,
  PUNCTUATION_SEQ_ITEMS,
  STYLE_PASSAGES,
  ALL_STYLES,
  WORD_FUNCTION_ITEMS,
  SPEECH_NORM_ITEMS,
  CORRECT_NORM_SENTENCES,
} from './banks/syntax-stylistics.js';
import {
  ALL_PASSAGES,
  LITERARY_PASSAGES,
  INFORMATIONAL_PASSAGES,
  buildReadingClosedTask,
  buildReadingOpenTask,
} from './banks/passages.js';

// ---------- 1. az.phonetics ----------
function genPhonetics(rng, { difficulty }) {
  const mode = difficulty === 1 ? 'word' : difficulty === 2 ? rng.pick(['sentence', 'word']) : rng.pick(['cluster', 'sentence']);

  if (mode === 'cluster') {
    const analyzed = CLEAN_PHONETIC_WORDS.map((w) => ({
      ...w,
      info: analyzePhonetics(w.word, w.trans, w.diffs),
    }));
    const equalWords = analyzed.filter((x) => x.info.equalCount && x.info.diffsCount >= 1);
    const pair = rng.sample(equalWords, 2);
    const [a, b] = pair;

    const props = [
      {
        text: 'Оба слова содержат только звонкие согласные.',
        holds: a.info.voiceless === 0 && b.info.voiceless === 0,
        why: `в «${a.word}» ${a.info.trans} глухих: ${a.info.voiceless}, в «${b.word}» ${b.info.trans} глухих: ${b.info.voiceless}`,
      },
      {
        text: 'В обоих словах написание отличается от произношения ровно одним моментом.',
        holds: a.info.diffsCount === 1 && b.info.diffsCount === 1,
        why: `отличий в «${a.word}»: ${a.info.diffsCount}, в «${b.word}»: ${b.info.diffsCount}`,
      },
      {
        text: 'В обоих словах открытых гласных больше, чем закрытых.',
        holds: a.info.openVowels > a.info.closedVowels && b.info.openVowels > b.info.closedVowels,
        why: `«${a.word}»: откр. ${a.info.openVowels} / закр. ${a.info.closedVowels}; «${b.word}»: откр. ${b.info.openVowels} / закр. ${b.info.closedVowels}`,
      },
      {
        text: 'В обоих словах подчиняется закону сингармонизма (ahəng qanunu).',
        holds: a.info.harmonyOk && b.info.harmonyOk,
        why: `сингармонизм: «${a.word}» — ${a.info.harmonyOk ? 'соблюдён' : 'нарушен'}, «${b.word}» — ${b.info.harmonyOk ? 'соблюдён' : 'нарушен'}`,
      },
      {
        text: 'В обоих словах присутствует глухой согласный [x] или [x\'].',
        holds: a.info.consonants.some((c) => c === 'x' || c === 'x\'') && b.info.consonants.some((c) => c === 'x' || c === 'x\''),
        why: `«${a.word}» → ${a.trans}; «${b.word}» → ${b.trans}`,
      },
      {
        text: 'В обоих словах количество твёрдых (qalın) гласных не меньше двух.',
        holds: a.info.backVowels >= 2 && b.info.backVowels >= 2,
        why: `твёрдых гласных: «${a.word}» — ${a.info.backVowels}, «${b.word}» — ${b.info.backVowels}`,
      },
    ];

    const falseProps = props.map((p, i) => ({ ...p, num: i + 1 })).filter((p) => !p.holds);
    const trueProps = props.map((p, i) => ({ ...p, num: i + 1 })).filter((p) => p.holds);

    if (falseProps.length >= 2 && trueProps.length >= 2) {
      const askFalse = rng.chance(0.5);
      const target = askFalse ? falseProps : trueProps;
      const correctNums = target.map((p) => p.num);
      const { options, answer } = buildComboOptions(rng, correctNums, 6, 5);
      const listHtml = props.map((p, i) => `${i + 1}. ${p.text}`).join('<br>');
      return {
        stem: `<p>Дана пара слов: <b>${a.word}</b>, <b>${b.word}</b> (общее свойство кластера: «число букв и звуков равно»).</p><p>Какие утверждения <b>${askFalse ? 'НЕ могут' : 'могут'}</b> завершить кластер?</p><p>${listHtml}</p>`,
        format: 'single',
        options,
        answer,
        difficulty,
        explanation: `Транскрипции: <b>${a.word}</b> ${a.trans}, <b>${b.word}</b> ${b.trans}.<br>` +
          props.map((p, i) => `${i + 1}) ${p.holds ? 'Верно' : 'Неверно'} (${p.why}).`).join('<br>') +
          `<br>Ответ: <b>${fmtNums(correctNums)}</b>.`,
      };
    }
  }

  if (mode === 'sentence') {
    const item = rng.pick(PHONETIC_SENTENCES);
    const analyzedWords = item.words.map((w) => ({ ...w, info: analyzePhonetics(w.word, w.trans) }));
    const sameWriting = analyzedWords.filter((w) => w.info.sameWriting).map((w) => w.idx);
    const fewerSounds = analyzedWords.filter((w) => w.info.soundCount < w.info.letterCount).map((w) => w.idx);
    const allVoiced = analyzedWords.filter((w) => w.info.voiceless === 0).map((w) => w.idx);
    const correctStr = `I – ${fmtNums(sameWriting)}; II – ${fmtNums(fewerSounds)}; III – ${fmtNums(allVoiced)}`;
    const allIdx = [1, 2, 3, 4, 5];
    const wrongPool = [];
    for (let k = 0; k < 40 && wrongPool.length < 4; k++) {
      const w1 = rng.sample(allIdx, sameWriting.length);
      const w2 = rng.sample(allIdx, fewerSounds.length);
      const w3 = rng.sample(allIdx, allVoiced.length);
      const cand = `I – ${fmtNums(w1)}; II – ${fmtNums(w2)}; III – ${fmtNums(w3)}`;
      if (cand !== correctStr && !wrongPool.includes(cand)) wrongPool.push(cand);
    }
    const { options, answer } = buildSingleOptions(rng, correctStr, wrongPool, 5);
    return {
      stem: `<p>Установите соответствие по фонетическим признакам пронумерованных слов в предложении:</p><p><i>${item.sentence}</i></p><p>I. Написание и произношение совпадают.<br>II. Число звуков меньше числа букв.<br>III. В составе нет глухих согласных.</p>`,
      format: 'single',
      options,
      answer,
      difficulty,
      explanation: `Фонетический разбор слов:<br>` +
        item.words.map((w) => `${w.idx}. <b>${w.word}</b> → ${w.trans}`).join('<br>') +
        `<br>Верное соответствие: <b>${correctStr}</b>.`,
    };
  }

  // Word mode
  const variants = [
    {
      stem: 'В каком слове написание и произношение полностью совпадают (нет фонетических отличий)?',
      filter: (w) => w.diffs === 0,
      anti: (w) => w.diffs >= 1,
    },
    {
      stem: 'В каком слове количество звуков меньше количества букв?',
      filter: (w) => analyzePhonetics(w.word, w.trans, w.diffs).soundCount < analyzePhonetics(w.word, w.trans, w.diffs).letterCount,
      anti: (w) => analyzePhonetics(w.word, w.trans, w.diffs).soundCount >= analyzePhonetics(w.word, w.trans, w.diffs).letterCount,
    },
    {
      stem: 'В каком слове произносится долгий гласный звук?',
      filter: (w) => w.trans.includes(':'),
      anti: (w) => !w.trans.includes(':'),
    },
    {
      stem: 'В каком слове отсутствуют глухие согласные (все согласные звонкие)?',
      filter: (w) => analyzePhonetics(w.word, w.trans, w.diffs).voiceless === 0,
      anti: (w) => analyzePhonetics(w.word, w.trans, w.diffs).voiceless >= 2,
    },
  ];
  const v = rng.pick(variants);
  const okItem = rng.pick(CLEAN_PHONETIC_WORDS.filter(v.filter));
  const distItems = rng.sample(CLEAN_PHONETIC_WORDS.filter(v.anti), 4);
  const { options, answer } = buildSingleOptions(rng, okItem.word, distItems.map((x) => x.word), 5);
  return {
    stem: v.stem,
    format: 'single',
    options,
    answer,
    difficulty,
    explanation: `Правильный ответ: <b>${okItem.word}</b> ${okItem.trans} — ${okItem.note}.`,
  };
}

// ---------- 2. az.ortho-stress ----------
function genOrthoStress(rng, { difficulty }) {
  const mode = difficulty === 1
    ? rng.pick(['orthoRow', 'compound'])
    : difficulty === 2
      ? rng.pick(['orthoRow', 'stress'])
      : rng.pick(['homograph', 'stress', 'orthoRow']);

  if (mode === 'orthoRow') {
    const askCorrect = rng.chance(0.5);
    const chosen = rng.sample(ORTHO_ITEMS, 5);
    if (askCorrect) {
      const ok = chosen[0];
      const { options, answer } = buildSingleOptions(rng, ok.ok, chosen.slice(1).map((x) => x.bad), 5);
      return {
        stem: 'Какое слово написано орфографически <b>верно</b>?',
        format: 'single',
        options,
        answer,
        difficulty,
        explanation: `Верно пишется <b>${ok.ok}</b> (${ok.rule}). В остальных вариантах допущены орфографические ошибки: ${chosen.slice(1).map((x) => `<i>*${x.bad}</i> → <b>${x.ok}</b>`).join('; ')}.`,
      };
    } else {
      const bad = chosen[0];
      const { options, answer } = buildSingleOptions(rng, bad.bad, chosen.slice(1).map((x) => x.ok), 5);
      return {
        stem: 'Укажите слово, в написании которого допущена <b>орфографическая ошибка</b>:',
        format: 'single',
        options,
        answer,
        difficulty,
        explanation: `Ошибка в слове <i>*${bad.bad}</i>: правильно пишется <b>${bad.ok}</b> (${bad.rule}).`,
      };
    }
  }

  if (mode === 'compound') {
    const targetKind = rng.pick(['слитное', 'дефисное', 'раздельное']);
    const pool = COMPOUND_ORTHO.filter((x) => x.kind === targetKind);
    const ok = rng.pick(pool);
    const others = rng.sample(COMPOUND_ORTHO.filter((x) => x.kind !== targetKind), 4);
    const { options, answer } = buildSingleOptions(rng, ok.ok, others.map((x) => x.ok), 5);
    return {
      stem: `Какое сложное слово/сочетание имеет <b>${targetKind}</b> написание и написано верно?`,
      format: 'single',
      options,
      answer,
      difficulty,
      explanation: `Правильный вариант — <b>${ok.ok}</b>: ${ok.rule}.`,
    };
  }

  if (mode === 'homograph') {
    const targetIsFirst = rng.chance(0.5); // s1 = syl 2 (noun/adj), s2 = syl 1 (neg/imp verb)
    const h = rng.pick(STRESS_HOMOGRAPHS);
    const chosen = targetIsFirst ? h.s1 : h.s2;
    const other = targetIsFirst ? h.s2 : h.s1;
    const wrongSents = STRESS_HOMOGRAPHS.map((item) => (targetIsFirst ? item.s2.ex : item.s1.ex));
    const { options, answer } = buildSingleOptions(rng, chosen.ex, wrongSents, 5);
    return {
      stem: `В каком предложении подчёркнутое слово имеет ударение на <b>${chosen.syl}-м слоге</b>?`,
      format: 'single',
      options,
      answer,
      difficulty,
      explanation: `В предложении «${chosen.ex}» это ${chosen.pos}, тогда как в «${other.ex}» — ${other.pos} (и в остальных вариантах ударение падает на ${other.syl}-й слог).`,
    };
  }

  // stress mode
  const firstSyl = rng.chance(0.5);
  const okPool = STRESS_WORDS.filter((w) => (firstSyl ? w.syl === 1 : w.syl === w.total));
  const distPool = STRESS_WORDS.filter((w) => (firstSyl ? w.syl > 1 : w.syl < w.total));
  const ok = rng.pick(okPool);
  const dist = rng.sample(distPool, 4);
  const { options, answer } = buildSingleOptions(rng, ok.word, dist.map((x) => x.word), 5);
  return {
    stem: firstSyl
      ? 'В каком слове словесное ударение (vurğu) падает на <b>первый</b> слог?'
      : 'В каком слове словесное ударение (vurğu) падает на <b>последний</b> слог?',
    format: 'single',
    options,
    answer,
    difficulty,
    explanation: `Верный ответ: <b>${ok.marked}</b> (${ok.note}). В остальных вариантах: ${dist.map((d) => d.marked).join(', ')}.`,
  };
}

// ---------- 3. az.morphemics ----------
function genMorphemics(rng, { difficulty }) {
  const mode = difficulty === 1
    ? rng.pick(['murekkebAd', 'schema'])
    : difficulty === 2
      ? rng.pick(['schema', 'sameRoot'])
      : rng.pick(['schema', 'sameRoot']);

  if (mode === 'murekkebAd') {
    const ok = rng.pick(MUREKKEB_AD);
    const dist = [
      ...rng.sample(COMPOUND_WORDS_DIST, 2),
      ...rng.sample(FREE_PHRASES_DIST, 2),
    ];
    const { options, answer } = buildSingleOptions(rng, ok, dist, 5);
    return {
      stem: 'Какой из приведённых примеров является <b>сложным наименованием</b> (mürəkkəb ad)?',
      format: 'single',
      options,
      answer,
      difficulty,
      explanation: `<b>${ok}</b> — сложное собственное наименование в виде словосочетания (mürəkkəb ad). Слова вроде ${dist[0]} — сложные слова (mürəkkəb söz), а ${dist[2]} — свободные словосочетания.`,
    };
  }

  if (mode === 'sameRoot') {
    const grp = rng.pick(SAME_ROOT_SETS);
    const okRow = grp.same.join(', ');
    const wrongRows = [
      `${grp.same[0]}, ${grp.same[1]}, ${grp.impostors[0]}`,
      `${grp.same[0]}, ${grp.impostors[1]}, ${grp.same[2]}`,
      `${grp.impostors[0]}, ${grp.impostors[1]}, ${grp.same[1]}`,
      `${grp.impostors[0]}, ${grp.impostors[2]}, ${grp.same[2]}`,
    ];
    const { options, answer } = buildSingleOptions(rng, okRow, wrongRows, 5);
    return {
      stem: 'В каком ряду <b>все слова</b> являются однокоренными (eyniköklü sözlər)?',
      format: 'single',
      options,
      answer,
      difficulty,
      explanation: `Все слова ряда <b>${okRow}</b> образованы от корня ${grp.root}. В остальных рядах присутствуют омонимичные корни или грамматические формы того же слова: ${grp.note}.`,
    };
  }

  // Schema mode (0903#39)
  const schemas = ['RL', 'RLL', 'RLG', 'RLLG', 'RGG'];
  const targetSchema = rng.pick(schemas);
  const okPair = rng.sample(MORPHEME_WORDS.filter((w) => w.schema === targetSchema), 2);
  const otherWords = MORPHEME_WORDS.filter((w) => w.schema !== targetSchema);
  const distPairs = [];
  for (let i = 0; i < 12 && distPairs.length < 4; i++) {
    const w1 = rng.pick(MORPHEME_WORDS.filter((w) => w.schema === targetSchema));
    const w2 = rng.pick(otherWords);
    const pairStr = rng.chance(0.5) ? `${w1.word}, ${w2.word}` : `${w2.word}, ${rng.pick(otherWords).word}`;
    if (!distPairs.includes(pairStr) && pairStr !== `${okPair[0].word}, ${okPair[1].word}`) {
      distPairs.push(pairStr);
    }
  }
  const okStr = `${okPair[0].word}, ${okPair[1].word}`;
  const { options, answer } = buildSingleOptions(rng, okStr, distPairs, 5);
  return {
    stem: `Какая пара слов соответствует морфемной схеме <b>${SCHEMA_LABELS[targetSchema]}</b>?`,
    format: 'single',
    options,
    answer,
    difficulty,
    explanation: `Схеме ${SCHEMA_LABELS[targetSchema]} соответствуют оба слова в паре <b>${okStr}</b>:<br>• ${okPair[0].parts}<br>• ${okPair[1].parts}`,
  };
}

// ---------- 4. az.lexics-idioms ----------
function genLexicsIdioms(rng, { difficulty }) {
  const mode = difficulty === 1
    ? rng.pick(['idiomPick', 'lexDef'])
    : difficulty === 2
      ? rng.pick(['idiomSynAnt', 'idiomPick'])
      : rng.pick(['homonymVsPoly', 'idiomSynAnt']);

  if (mode === 'idiomPick') {
    const ok = rng.pick(IDIOM_ITEMS);
    const dist = rng.sample(NON_IDIOM_PHRASES, 4);
    const { options, answer } = buildSingleOptions(rng, ok.idiom, dist, 5);
    return {
      stem: 'Укажите устойчивое фразеологическое сочетание (frazeoloji birləşmə):',
      format: 'single',
      options,
      answer,
      difficulty,
      explanation: `<b>${ok.idiom}</b> — фразеологизм со значением «${ok.meaning}». Остальные выражения — свободные словосочетания или составные глаголы с <i>etmək</i>.`,
    };
  }

  if (mode === 'idiomSynAnt') {
    const askSyn = rng.chance(0.5);
    const item = rng.pick(IDIOM_ITEMS);
    const target = askSyn ? item.syn : item.ant;
    const pool = IDIOM_ITEMS.filter((x) => x.idiom !== item.idiom)
      .map((x) => (askSyn ? x.syn : x.ant))
      .filter((s) => s !== target);
    const { options, answer } = buildSingleOptions(rng, target, pool, 5);
    return {
      stem: `Подберите <b>${askSyn ? 'синонимичное' : 'антонимичное'}</b> выражение к фразеологизму «<b>${item.idiom}</b>»:`,
      format: 'single',
      options,
      answer,
      difficulty,
      explanation: `Фразеологизм «${item.idiom}» означает «${item.meaning}». Его ${askSyn ? 'синоним' : 'антоним'} — <b>${target}</b>.`,
    };
  }

  if (mode === 'homonymVsPoly') {
    const askHom = rng.chance(0.5);
    if (askHom) {
      const ok = rng.pick(HOMONYMS_BANK);
      const dist = rng.sample(POLYSEMY_BANK, 4);
      const { options, answer } = buildSingleOptions(rng, ok.word, dist.map((x) => x.word), 5);
      return {
        stem: 'Какое слово является <b>омонимом</b> (omonim), а не многозначным словом (çoxmənalı söz)?',
        format: 'single',
        options,
        answer,
        difficulty,
        explanation: `<b>${ok.word}</b> — ${ok.desc} («${ok.c1}» / «${ok.c2}»). Остальные слова (${dist.map((d) => d.word).join(', ')}) — многозначные.`,
      };
    } else {
      const ok = rng.pick(POLYSEMY_BANK);
      const dist = rng.sample(HOMONYMS_BANK.filter((h) => h.word !== ok.word), 4);
      const { options, answer } = buildSingleOptions(rng, ok.word, dist.map((x) => x.word), 5);
      return {
        stem: 'Какое слово является <b>многозначным</b> (çoxmənalı söz), а не омонимом?',
        format: 'single',
        options,
        answer,
        difficulty,
        explanation: `<b>${ok.word}</b> — ${ok.desc} («${ok.c1}» / «${ok.c2}»). Остальные слова являются омонимами.`,
      };
    }
  }

  // lexDef
  const item = rng.pick(LEXICAL_MEANINGS);
  const others = rng.sample(LEXICAL_MEANINGS.filter((x) => x.word !== item.word), 4);
  const okPair = `${item.word} — ${item.wrongDef}`;
  const validPairs = others.map((x) => `${x.word} — ${x.def}`);
  const { options, answer } = buildSingleOptions(rng, okPair, validPairs, 5);
  return {
    stem: 'Укажите пару, в которой лексическое значение слова объяснено <b>неверно</b>:',
    format: 'single',
    options,
    answer,
    difficulty,
    explanation: `Неверно истолковано слово <b>${item.word}</b>: на самом деле оно означает «${item.def}», а не «${item.wrongDef}».`,
  };
}

// ---------- 5. az.morphology-noun-adj-num ----------
function genMorphNounAdjNum(rng, { difficulty }) {
  const mode = difficulty === 1
    ? rng.pick(['adjDeg', 'obuComma', 'numAgree'])
    : difficulty === 2
      ? rng.pick(['vowelDrop', 'caseVsPoss', 'obuComma'])
      : rng.pick(['numPair', 'vowelDrop', 'caseVsPoss']);

  if (mode === 'numPair') {
    const task = rng.pick(NUMERAL_PAIR_TASKS);
    const correctNums = task.statements.filter((s) => s.ok).map((s) => s.id);
    const { options, answer } = buildComboOptions(rng, correctNums, 6, 5);
    const tableHtml =
      `<table><thead><tr><th>Относится только к одному из предложений</th><th>Относится к обоим предложениям</th></tr></thead><tbody>` +
      `<tr><td>1. ${task.statements[0].text}<br>2. ${task.statements[1].text}<br>3. ${task.statements[2].text}</td>` +
      `<td>4. ${task.statements[3].text}<br>5. ${task.statements[4].text}<br>6. ${task.statements[5].text}</td></tr>` +
      `</tbody></table>`;
    return {
      stem: `<p>На основе данных предложений выберите <b>верные</b> утверждения из таблицы:</p><p>${task.s1}<br>${task.s2}</p>${tableHtml}`,
      format: 'single',
      options,
      answer,
      difficulty,
      explanation: `${task.note} Верные номера: <b>${fmtNums(correctNums)}</b>.`,
    };
  }

  if (mode === 'vowelDrop') {
    const askPossOnly = rng.chance(0.5);
    const targetPool = VOWEL_DROP_NOUNS.filter((n) => (askPossOnly ? n.dropType === 'possOnly' : n.dropType === 'both'));
    const distPool = VOWEL_DROP_NOUNS.filter((n) => (askPossOnly ? n.dropType !== 'possOnly' : n.dropType !== 'both'));
    const ok = rng.pick(targetPool);
    const dist = rng.sample(distPool, 4);
    const { options, answer } = buildSingleOptions(rng, ok.word, dist.map((x) => x.word), 5);
    const possForm = inflectNoun(ok, { poss3: true, caseName: 'adlıq' });
    const dirForm = inflectNoun(ok, { poss3: false, caseName: 'yönlük' });
    return {
      stem: askPossOnly
        ? 'В каком существительном гласный в корне выпадает <b>только</b> при присоединении притяжательного аффикса (mənsubiyyət), но сохраняется при падежном склонении?'
        : 'В каком существительном гласный в корне выпадает <b>как</b> при притяжательном аффиксе, <b>так и</b> при падежном склонении (yiyəlik/yönlük/təsirlik)?',
      format: 'single',
      options,
      answer,
      difficulty,
      explanation: `В слове <b>${ok.word}</b> («${ok.ru}»): притяжательная форма 3 л. — <b>${possForm}</b>, а дательный падеж без притяжательности — <b>${dirForm}</b> (${askPossOnly ? 'исконно азербайджанское слово, гласный падает только при mənsubiyyət' : 'заимствование, гласный падает и в падежах, и при mənsubiyyət'}).`,
    };
  }

  if (mode === 'caseVsPoss') {
    const item = rng.pick(CASE_VS_POSS_ITEMS);
    const askAcc = rng.chance(0.5);
    const targetSentence = askAcc ? item.acc : item.poss;
    const otherSentence = askAcc ? item.poss : item.acc;
    const extra = rng.sample(CASE_VS_POSS_ITEMS.filter((x) => x.word !== item.word), 3)
      .map((x) => (askAcc ? x.poss : x.acc));
    const { options, answer } = buildSingleOptions(rng, targetSentence, [otherSentence, ...extra], 5);
    return {
      stem: askAcc
        ? 'В каком предложении выделенное слово стоит в <b>винительном падеже</b> (təsirlik hal)?'
        : 'В каком предложении выделенное слово имеет <b>притяжательный аффикс 3-го лица</b> (mənsubiyyət) в именительном падеже?',
      format: 'single',
      options,
      answer,
      difficulty,
      explanation: `Верный вариант: «${targetSentence}» — ${askAcc ? item.accNote : item.possNote}.`,
    };
  }

  if (mode === 'numAgree') {
    const ok = rng.pick(NUMERAL_AGREEMENT);
    const others = rng.sample(NUMERAL_AGREEMENT.filter((x) => x.ok !== ok.ok), 4);
    const { options, answer } = buildSingleOptions(rng, ok.ok, others.map((x) => x.bad), 5);
    return {
      stem: 'Какое сочетание числительного с существительным образовано <b>грамматически верно</b>?',
      format: 'single',
      options,
      answer,
      difficulty,
      explanation: `Верно: <b>${ok.ok}</b> (${ok.rule}).`,
    };
  }

  if (mode === 'adjDeg') {
    const deg = rng.pick(['çoxaltma', 'azaltma', 'adi']);
    const degRu = { çoxaltma: 'превосходной (çoxaltma)', azaltma: 'уменьшительной (azaltma)', adi: 'положительной (adi)' }[deg];
    const ok = rng.pick(ADJ_DEGREES.filter((x) => x.deg === deg));
    const dist = rng.sample(ADJ_DEGREES.filter((x) => x.deg !== deg), 4);
    const { options, answer } = buildSingleOptions(rng, ok.word, dist.map((x) => x.word), 5);
    return {
      stem: `Какое прилагательное стоит в <b>${degRu}</b> степени?`,
      format: 'single',
      options,
      answer,
      difficulty,
      explanation: `<b>${ok.word}</b> — ${ok.rule}.`,
    };
  }

  // obuComma
  const wantComma = rng.chance(0.5);
  const ok = rng.pick(OBU_COMMA_ITEMS.filter((x) => x.comma === wantComma));
  const dist = rng.sample(OBU_COMMA_ITEMS.filter((x) => x.comma !== wantComma), 4);
  const stripComma = (s) => s.replace(/^(<u>(?:O|Bu)<\/u>),/, '$1');
  const { options, answer } = buildSingleOptions(
    rng,
    stripComma(ok.s),
    dist.map((x) => stripComma(x.s)),
    5
  );
  return {
    stem: wantComma
      ? 'В каком предложении после выделенного местоимения <b>o / bu</b> <b>должна</b> ставиться запятая?'
      : 'В каком предложении после выделенного местоимения <b>o / bu</b> запятая <b>НЕ</b> ставится?',
    format: 'single',
    options,
    answer,
    difficulty,
    explanation: `В предложении «${ok.s}»: ${ok.reason}.`,
  };
}

// ---------- 6. az.morphology-verb ----------
function genMorphVerb(rng, { difficulty }) {
  const mode = difficulty === 1
    ? rng.pick(['mood', 'auxPos'])
    : difficulty === 2
      ? rng.pick(['voice', 'mood', 'auxPos'])
      : rng.pick(['adverbNonfinite', 'icbarNoSubjObj', 'voice']);

  if (mode === 'icbarNoSubjObj') {
    const okItems = VERB_VOICE_ITEMS.filter((v) => v.voice === 'icbar' && !v.hasSubjObj);
    const badItems = VERB_VOICE_ITEMS.filter((v) => !(v.voice === 'icbar' && !v.hasSubjObj));
    const chosenOk = rng.sample(okItems, 2);
    const chosenBad = rng.sample(badItems, 3);
    const combined = rng.shuffle([...chosenOk, ...chosenBad]).map((x, i) => ({ ...x, num: i + 1 }));
    const correctNums = combined.filter((x) => x.voice === 'icbar' && !x.hasSubjObj).map((x) => x.num);
    const { options, answer } = buildComboOptions(rng, correctNums, 5, 5);
    return {
      stem: `<p>В каких предложениях сказуемое выражено глаголом <b>понудительного залога</b> (icbar növ), причём в предложении отсутствуют и субъект, и объект действия?</p><p>${combined.map((x) => `${x.num}. ${x.s}`).join('<br>')}</p>`,
      format: 'single',
      options,
      answer,
      difficulty,
      explanation: combined.map((x) => `${x.num}) ${x.note}.`).join('<br>') + `<br>Ответ: <b>${fmtNums(correctNums)}</b>.`,
    };
  }

  if (mode === 'adverbNonfinite') {
    const okPool = rng.sample(ADVERB_NONFINITE_POOL.filter((x) => x.ok), 3);
    const badPool = rng.sample(ADVERB_NONFINITE_POOL.filter((x) => !x.ok), 3);
    const combined = rng.shuffle([...okPool, ...badPool]).map((x, i) => ({ ...x, num: i + 1 }));
    const correctNums = combined.filter((x) => x.ok).map((x) => x.num);
    const { options, answer } = buildComboOptions(rng, correctNums, 6, 5);
    return {
      stem: `<p>Выберите предложения, в которых выделенное <b>наречие образа действия</b> (tərzi-hərəkət zərfi) относится к <b>неспрягаемой форме глагола</b> (feili sifət / feili bağlama / məsdər):</p><p>${combined.map((x) => `${x.num}. ${x.s}`).join('<br>')}</p>`,
      format: 'single',
      options,
      answer,
      difficulty,
      explanation: combined.map((x) => `${x.num}) ${x.note}.`).join('<br>') + `<br>Верный выбор: <b>${fmtNums(correctNums)}</b>.`,
    };
  }

  if (mode === 'voice') {
    const targetVoice = rng.pick(['məchul', 'qayıdış', 'şəxssiz', 'qarşılıq', 'icbar']);
    const labels = {
      məchul: 'страдательного залога (məchul növ)',
      qayıdış: 'возвратного залога (qayıdış növ)',
      şəxssiz: 'безличного залога (şəxssiz növ)',
      qarşılıq: 'взаимно-совместного залога (qarşılıq-birgəlik növ)',
      icbar: 'понудительного залога (icbar növ)',
    };
    const ok = rng.pick(VERB_VOICE_ITEMS.filter((v) => v.voice === targetVoice));
    const dist = rng.sample(VERB_VOICE_ITEMS.filter((v) => v.voice !== targetVoice), 4);
    const { options, answer } = buildSingleOptions(rng, ok.s, dist.map((x) => x.s), 5);
    return {
      stem: `В каком предложении употреблён глагол <b>${labels[targetVoice]}</b>?`,
      format: 'single',
      options,
      answer,
      difficulty,
      explanation: `Верное предложение: «${ok.s}» — ${ok.note}.`,
    };
  }

  if (mode === 'mood') {
    const ok = rng.pick(VERB_MOODS);
    const dist = rng.sample(VERB_MOODS.filter((m) => m.mood !== ok.mood), 4);
    const { options, answer } = buildSingleOptions(rng, ok.form, dist.map((x) => x.form), 5);
    return {
      stem: `Какой глагол употреблён в наклонении: <b>${MOOD_LABELS_RU[ok.mood]}</b>?`,
      format: 'single',
      options,
      answer,
      difficulty,
      explanation: `Глагол <b>${ok.form}</b> имеет форму наклонения «${MOOD_LABELS_RU[ok.mood]}»: ${ok.note}.`,
    };
  }

  // auxPos
  const ok = rng.pick(AUX_POS_ITEMS);
  const dist = rng.sample(AUX_POS_ITEMS.filter((x) => x.pos !== ok.pos), 4);
  const { options, answer } = buildSingleOptions(rng, ok.s, dist.map((x) => x.s), 5);
  return {
    stem: `В каком предложении подчёркнутое слово выступает в роли части речи: <b>${ok.pos}</b>?`,
    format: 'single',
    options,
    answer,
    difficulty,
    explanation: `В предложении «${ok.s}» слово функционирует как <b>${ok.pos}</b>: ${ok.note}.`,
  };
}

// ---------- 7. az.syntax-phrases ----------
function genSyntaxPhrases(rng, { difficulty }) {
  const mode = difficulty === 1
    ? rng.pick(['participle', 'infPred'])
    : difficulty === 2
      ? rng.pick(['participle', 'infPred', 'xitab'])
      : rng.pick(['relations', 'xitab', 'infPred']);

  if (mode === 'participle') {
    const set = rng.pick(PARTICIPLE_PHRASE_SETS);
    const { options, answer } = buildSingleOptions(rng, set.correct, set.distractors, 5);
    return {
      stem: 'В каком предложении употреблён <b>причастный оборот</b> (feili sifət tərkibi)?',
      format: 'single',
      options,
      answer,
      difficulty,
      explanation: set.note,
    };
  }

  if (mode === 'infPred') {
    const set = rng.pick(INFINITIVE_PRED_SETS);
    const { options, answer } = buildSingleOptions(rng, set.correct, set.distractors, 5);
    return {
      stem: 'В каком предложении сказуемое (xəbər) выражено <b>инфинитивным оборотом</b> (məsdər tərkibi)?',
      format: 'single',
      options,
      answer,
      difficulty,
      explanation: set.note,
    };
  }

  if (mode === 'xitab') {
    const set = rng.pick(XITAB_AMBIGUOUS_SETS);
    const { options, answer } = buildSingleOptions(rng, set.correct, set.distractors, 5);
    return {
      stem: 'В каком предложении подчёркнутое слово можно трактовать двояко — и как <b>обращение</b> (xitab), и как <b>подлежащее</b> (mübtəda)?',
      format: 'single',
      options,
      answer,
      difficulty,
      explanation: set.note,
    };
  }

  // relations (1503#38 style)
  const set = rng.pick(SYNTACTIC_ANALYSIS_SETS);
  const numbered = rng.shuffle(set.statements).map((s, i) => ({ ...s, num: i + 1 }));
  const correctNums = numbered.filter((s) => s.ok).map((s) => s.num);
  const { options, answer } = buildComboOptions(rng, correctNums, 5, 5);
  return {
    stem: `<p>Укажите <b>верные</b> утверждения о синтаксических связях и членах предложения:</p><p><i>«${set.sentence}»</i></p><p>${numbered.map((s) => `${s.num}. ${s.text}`).join('<br>')}</p>`,
    format: 'single',
    options,
    answer,
    difficulty,
    explanation: `${set.note} Верные номера: <b>${fmtNums(correctNums)}</b>.`,
  };
}

// ---------- 8. az.syntax-sentence ----------
function genSyntaxSentence(rng, { difficulty }) {
  const mode = difficulty === 1
    ? rng.pick(['punctSeq', 'directSpeech'])
    : difficulty === 2
      ? rng.pick(['schema', 'complexBuilder', 'directSpeech'])
      : rng.pick(['schema', 'complexBuilder', 'punctSeq']);

  if (mode === 'schema') {
    const item = rng.pick(SYNTAX_SCHEMA_ITEMS);
    const okOpt = renderSchema(item.schema);
    const wrongOpts = item.wrongSchemas.map(renderSchema);
    const { options, answer } = buildSingleOptions(rng, okOpt, wrongOpts, 5);
    return {
      stem: `<p>Определите схему синтаксического разбора предложения:</p><p><i>«${item.sentence}»</i></p><p><small>${SCHEMA_LEGEND}</small></p>`,
      format: 'single',
      options,
      answer,
      difficulty,
      explanation: `${item.note}<br>Правильная схема: ${okOpt}.`,
    };
  }

  if (mode === 'complexBuilder') {
    const item = rng.pick(COMPLEX_SENTENCE_BUILDERS);
    const okTwo = rng.sample(item.complexOpts, 2);
    const badThree = rng.sample(item.simpleOpts, 3);
    const all = rng.shuffle([
      ...okTwo.map((text) => ({ text, ok: true })),
      ...badThree.map((text) => ({ text, ok: false })),
    ]).map((x, i) => ({ ...x, num: i + 1 }));
    const correctNums = all.filter((x) => x.ok).map((x) => x.num);
    const { options, answer } = buildPairComboOptions(rng, correctNums, 5, 5);
    return {
      stem: `<p>Какие продолжения на месте многоточия превратят конструкцию <i>«${item.prefix}»</i> в <b>сложное предложение</b> (mürəkkəb cümlə)?</p><p>${all.map((x) => `${x.num}. ${x.text}`).join('<br>')}</p>`,
      format: 'single',
      options,
      answer,
      difficulty,
      explanation: `Сложное предложение (mürəkkəb cümlə) образуют продолжения с новой грамматической основой (собственным подлежащим): <b>«${okTwo[0]}»</b> и <b>«${okTwo[1]}»</b>. Остальные варианты описывают действия того же субъекта (однородные сказуемые → простое предложение). Подходящие номера: <b>${fmtNums(correctNums)}</b>.`,
    };
  }

  if (mode === 'directSpeech') {
    const trues = rng.sample(DIRECT_SPEECH_PAIRS.filter((x) => x.ok), 4);
    const falses = rng.pick(DIRECT_SPEECH_PAIRS.filter((x) => !x.ok));
    const fmt = (x) => `I. ${x.raw}<br>II. <code>${x.schema}</code>`;
    const { options, answer } = buildSingleOptions(rng, fmt(falses), trues.map(fmt), 5);
    return {
      stem: 'Укажите <b>несоответствие</b> между предложением с прямой речью (знаки препинания опущены) и его схемой:',
      format: 'single',
      options,
      answer,
      difficulty,
      explanation: `Неверная схема дана для «${falses.raw}»: при расстановке знаков получается «${falses.fixed}», что соответствует схеме <b>${falses.rightSchema}</b>, а не ${falses.schema}.`,
    };
  }

  // punctSeq
  const item = rng.pick(PUNCTUATION_SEQ_ITEMS);
  const { options, answer } = buildSingleOptions(rng, item.seq, item.distractors, 5);
  return {
    stem: `<p>Определите правильную последовательность пропущенных знаков препинания в предложении:</p><p><i>${item.raw}</i></p>`,
    format: 'single',
    options,
    answer,
    difficulty,
    explanation: `Правильно расставленные знаки: «<b>${item.fixed}</b>». Последовательность: <b>${item.seq}</b>. ${item.note}`,
  };
}

// ---------- 9. az.stylistics ----------
function genStylistics(rng, { difficulty }) {
  const mode = difficulty === 1
    ? 'stylePick'
    : difficulty === 2
      ? rng.pick(['stylePick', 'wordFn'])
      : rng.pick(['speechNorm', 'wordFn']);

  if (mode === 'stylePick') {
    const item = rng.pick(STYLE_PASSAGES);
    const dist = ALL_STYLES.filter((s) => s !== item.style);
    const { options, answer } = buildSingleOptions(rng, item.style, dist, 5);
    return {
      stem: `<p>К какому функциональному стилю речи относится приведённый отрывок?</p><blockquote>${item.text}</blockquote>`,
      format: 'single',
      options,
      answer,
      difficulty,
      explanation: `Это <b>${item.style}</b>: ${item.note}.`,
    };
  }

  if (mode === 'wordFn') {
    const askDiff = rng.chance(0.5);
    if (askDiff) {
      const targetFn = rng.pick(['poetik (поэтическая)', 'informativ (информативная)', 'terminoloji (терминологическая)']);
      const ok = rng.pick(WORD_FUNCTION_ITEMS.filter((x) => x.fn === targetFn));
      const dist = rng.sample(WORD_FUNCTION_ITEMS.filter((x) => x.fn !== targetFn), 4);
      const { options, answer } = buildSingleOptions(rng, ok.s, dist.map((x) => x.s), 5);
      return {
        stem: `В каком предложении подчёркнутое слово выполняет <b>${targetFn}</b> функцию?`,
        format: 'single',
        options,
        answer,
        difficulty,
        explanation: `В предложении «${ok.s}» функция — <b>${ok.fn}</b>: ${ok.note}.`,
      };
    } else {
      const item = rng.pick(WORD_FUNCTION_ITEMS);
      const fns = ['poetik (поэтическая)', 'informativ (информативная)', 'terminoloji (терминологическая)', 'rəsmi-dəftərxana (канцелярская)', 'məişət-danışıq (разговорно-бытовая)'];
      const { options, answer } = buildSingleOptions(rng, item.fn, fns.filter((f) => f !== item.fn), 5);
      return {
        stem: `<p>Определите стилистическую функцию подчёркнутого слова в предложении:</p><p><i>${item.s}</i></p>`,
        format: 'single',
        options,
        answer,
        difficulty,
        explanation: `Подчёркнутое слово выполняет функцию <b>${item.fn}</b>: ${item.note}.`,
      };
    }
  }

  // speechNorm
  const errItem = rng.pick(SPEECH_NORM_ITEMS);
  const cleanSet = rng.sample(CORRECT_NORM_SENTENCES, 4);
  const { options, answer } = buildSingleOptions(rng, errItem.bad, cleanSet, 5);
  return {
    stem: 'В каком предложении допущено <b>нарушение лексической/речевой нормы</b>?',
    format: 'single',
    options,
    answer,
    difficulty,
    explanation: `Нарушение в «${errItem.bad}»: ${errItem.rule}. Исправленный вариант: «<b>${errItem.fix}</b>».`,
  };
}

// ---------- 10 & 11. Reading Tasks ----------
function genReadingClosed(rng, { difficulty }) {
  const passage = rng.pick(ALL_PASSAGES);
  const slot = rng.int(0, 4);
  return buildReadingClosedTask(rng, passage, slot, difficulty);
}

function genReadingOpen(rng, { difficulty }) {
  const passage = rng.pick(ALL_PASSAGES);
  const slot = rng.int(0, 4);
  return buildReadingOpenTask(passage, slot, difficulty);
}

// ---------- SubjectModule Export ----------
export const taskTypes = [
  {
    id: 'az.phonetics',
    subject: 'az',
    title: 'Фонетический анализ и орфоэпия',
    topic: 'Фонетика',
    format: 'single',
    weight: 1.2,
    generate: genPhonetics,
  },
  {
    id: 'az.ortho-stress',
    subject: 'az',
    title: 'Орфография и словесное ударение',
    topic: 'Орфография и ударение',
    format: 'single',
    weight: 1.0,
    generate: genOrthoStress,
  },
  {
    id: 'az.morphemics',
    subject: 'az',
    title: 'Состав слова и словообразование',
    topic: 'Словообразование',
    format: 'single',
    weight: 1.0,
    generate: genMorphemics,
  },
  {
    id: 'az.lexics-idioms',
    subject: 'az',
    title: 'Лексика и фразеологизмы',
    topic: 'Лексика и фразеология',
    format: 'single',
    weight: 1.0,
    generate: genLexicsIdioms,
  },
  {
    id: 'az.morphology-noun-adj-num',
    subject: 'az',
    title: 'Имя, числительное и местоимение',
    topic: 'Морфология',
    format: 'single',
    weight: 1.1,
    generate: genMorphNounAdjNum,
  },
  {
    id: 'az.morphology-verb',
    subject: 'az',
    title: 'Глагол и служебные части речи',
    topic: 'Морфология',
    format: 'single',
    weight: 1.2,
    generate: genMorphVerb,
  },
  {
    id: 'az.syntax-phrases',
    subject: 'az',
    title: 'Словосочетания, связи и обращение',
    topic: 'Синтаксис',
    format: 'single',
    weight: 1.1,
    generate: genSyntaxPhrases,
  },
  {
    id: 'az.syntax-sentence',
    subject: 'az',
    title: 'Разбор предложения и прямая речь',
    topic: 'Синтаксис',
    format: 'single',
    weight: 1.2,
    generate: genSyntaxSentence,
  },
  {
    id: 'az.stylistics',
    subject: 'az',
    title: 'Стилистика и культура речи',
    topic: 'Стилистика',
    format: 'single',
    weight: 0.8,
    generate: genStylistics,
  },
  {
    id: 'az.reading-closed',
    subject: 'az',
    title: 'Чтение текста (закрытые задания)',
    topic: 'Работа с текстом',
    format: 'single',
    weight: 1.0,
    generate: genReadingClosed,
  },
  {
    id: 'az.reading-open',
    subject: 'az',
    title: 'Чтение текста (письменные задания)',
    topic: 'Работа с текстом',
    format: 'open',
    weight: 1.0,
    generate: genReadingOpen,
  },
];

const TYPE_MAP = Object.fromEntries(taskTypes.map((t) => [t.id, t]));

/**
 * Assemble a full 30-task DİM Buraxılış exam variant in real exam order:
 * - Tasks 1–10 (PDF #31–40): 10 closed language-rule tasks (1 pt each)
 * - Tasks 11–20 (PDF #41–50): Literary passage (5 closed 1 pt + 5 open 2 pts)
 * - Tasks 21–30 (PDF #51–60): Informational passage (5 closed 1 pt + 5 open 2 pts)
 * Total raw = 40; scaled score = round(raw * 2.5, 1) -> 100.0
 */
export function buildExam(rng) {
  const grammarIds = [
    'az.phonetics',
    'az.ortho-stress',
    'az.morphemics',
    'az.lexics-idioms',
    'az.morphology-noun-adj-num',
    'az.morphology-verb',
    'az.syntax-phrases',
    'az.syntax-sentence',
    'az.stylistics',
  ];
  const extraId = rng.pick(['az.phonetics', 'az.morphology-verb', 'az.syntax-sentence', 'az.morphology-noun-adj-num']);
  const examGrammarOrder = rng.shuffle([...grammarIds, extraId]);

  const tasks = [];
  const usedStems = new Set();

  // 1–10: Language rules
  examGrammarOrder.forEach((typeId, idx) => {
    const type = TYPE_MAP[typeId];
    const diff = idx < 3 ? 1 : idx < 7 ? 2 : 3;
    let task;
    for (let attempt = 0; attempt < 25; attempt++) {
      const childRng = rng.fork(`g-${idx}-${attempt}`);
      const candidate = finalizeTask(type, childRng, type.generate(childRng, { difficulty: diff }));
      if (!usedStems.has(candidate.stem)) {
        task = candidate;
        break;
      }
    }
    if (!task) {
      const childRng = rng.fork(`g-${idx}-fallback`);
      task = finalizeTask(type, childRng, type.generate(childRng, { difficulty: diff }));
    }
    usedStems.add(task.stem);
    task.id = `az-exam-${rng.seed}-${idx + 1}`;
    tasks.push(task);
  });

  // 11–20: Literary passage (5 closed + 5 open)
  const litPassage = rng.pick(LITERARY_PASSAGES);
  for (let slot = 0; slot < 5; slot++) {
    const childRng = rng.fork(`lit-c-${slot}`);
    const t = finalizeTask(
      TYPE_MAP['az.reading-closed'],
      childRng,
      buildReadingClosedTask(childRng, litPassage, slot, slot < 2 ? 2 : 3)
    );
    t.id = `az-exam-${rng.seed}-${11 + slot}`;
    tasks.push(t);
  }
  for (let slot = 0; slot < 5; slot++) {
    const childRng = rng.fork(`lit-o-${slot}`);
    const t = finalizeTask(
      TYPE_MAP['az.reading-open'],
      childRng,
      buildReadingOpenTask(litPassage, slot, 2)
    );
    t.id = `az-exam-${rng.seed}-${16 + slot}`;
    tasks.push(t);
  }

  // 21–30: Informational passage (5 closed + 5 open)
  const infPassage = rng.pick(INFORMATIONAL_PASSAGES);
  for (let slot = 0; slot < 5; slot++) {
    const childRng = rng.fork(`inf-c-${slot}`);
    const t = finalizeTask(
      TYPE_MAP['az.reading-closed'],
      childRng,
      buildReadingClosedTask(childRng, infPassage, slot, slot < 2 ? 2 : 3)
    );
    t.id = `az-exam-${rng.seed}-${21 + slot}`;
    tasks.push(t);
  }
  for (let slot = 0; slot < 5; slot++) {
    const childRng = rng.fork(`inf-o-${slot}`);
    const t = finalizeTask(
      TYPE_MAP['az.reading-open'],
      childRng,
      buildReadingOpenTask(infPassage, slot, 2)
    );
    t.id = `az-exam-${rng.seed}-${26 + slot}`;
    tasks.push(t);
  }

  return tasks;
}

export const exam = {
  durationMin: 60,
  maxPoints: 100,
  sections: [
    { title: 'Языковые правила (1–10)', from: 0, to: 9 },
    { title: 'Текст 1: художественный (11–20)', from: 10, to: 19 },
    { title: 'Текст 2: публицистический (21–30)', from: 20, to: 29 },
  ],
  intro:
    '<p>Экзаменационный блок «Азербайджанский язык» (<b>Azərbaycan dili — tədris dili</b>, 11-й класс ГЭЦ / DİM):</p>' +
    '<ul>' +
    '<li><b>30 заданий</b>: 10 закрытых по языковым правилам (1 балл) и 2 текста по 10 заданий (5 закрытых по 1 баллу + 5 письменных открытых по 2 балла).</li>' +
    '<li>Максимум <b>40 первичных баллов</b> пересчитываются в <b>100-балльную шкалу</b> по официальной формуле DİM: <code>NB = 2.5 × сырой балл</code>.</li>' +
    '<li>Ошибки не вычитают баллы. Рекомендуемое время — <b>60 минут</b>.</li>' +
    '</ul>',
};

export function score(tasks, earned) {
  const raw = earned.reduce((acc, v) => acc + (Number(v) || 0), 0);
  const rawMax = tasks.reduce((acc, t) => acc + (Number(t?.points) || 1), 0) || 40;
  const scaled = Math.round(raw * (100 / rawMax) * 10) / 10;
  return {
    score: scaled,
    max: 100,
    label: `${scaled} / 100 (сырой балл: ${Math.round(raw * 10) / 10} / ${rawMax})`,
  };
}

export default {
  id: 'az',
  title: 'Азербайджанский язык',
  taskTypes,
  buildExam,
  exam,
  originals: () => loadOriginals('az'),
  score,
};
