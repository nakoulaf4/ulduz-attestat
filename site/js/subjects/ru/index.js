// Модуль предмета «Русский язык» (ru) для тренажёра Ulduz (экзамен DİM, 11 класс).

import { finalizeTask, loadOriginals } from '../../core/contract.js';
import {
  countSyllables,
  buildSingleOptions,
  buildIndexSetOptions,
  buildPairedSplitOptions,
  renderVennSvg,
  renderClusterSvg,
} from './ru-rules.js';
import {
  DEVOICING_WORDS,
  VOICING_WORDS,
  SYLLABLE_WORDS,
  LETTER_SOUND_WORDS,
  STRESS_WORDS,
  SHUSH_SOFT_SIGN,
  HARD_SOFT_SEP,
  NE_NI_SENTENCES,
  ROOT_VOWELS,
  PREFIX_WORDS,
  N_NN_WORDS,
  JOINT_HYPHEN_ITEMS,
} from './banks/phonetics-ortho.js';
import {
  MORPHEME_HOMOFORMS,
  MORPHEME_DEFINITIONS,
  MORPHEME_SCHEMES,
  WORD_FORMATION_ITEMS,
  PARONYMS,
  SPEECH_ERRORS,
  IDIOMS,
  LEXIS_LAYERS,
} from './banks/morphemics-lexics.js';
import {
  NOUN_NUMBER,
  NOUN_GENDER_ITEMS,
  ADJ_ITEMS,
  NUMERAL_NORMS,
  PRONOUN_PHRASES,
  ADVERB_TRIPLES,
  ADVERB_VENN_PAIRS,
  VERB_STATEMENTS,
  VERB_CONJUGATION,
  PARTICIPLE_DEEV_NORMS,
  SERVICE_DEFINITIONS,
  SERVICE_VENN_PAIRS,
  CONJUNCTION_SENTENCES,
} from './banks/morphology.js';
import {
  CIRCUMSTANCE_SENTENCES,
  INFINITIVE_ROLES,
  WORD_COMBINATIONS,
  ONE_PART_SENTENCES,
  PREDICATE_TYPES,
  DASH_SUBJ_PRED,
  SIMPLE_PUNCT,
  SSP_COMMON_MEMBER,
  SIMPLE_WITH_HOMOGENEOUS_VERBS,
  PLAIN_SSP_NO_COMMON,
  SSP_RELATIONS,
  SPP_CLAUSES,
  BSP_SENTENCES,
  DIRECT_SPEECH,
} from './banks/syntax.js';
import {
  LIT_PASSAGES,
  PUB_PASSAGES,
  generateReadingClosedTask,
  generateReadingOpenTask,
} from './banks/passages.js';

// ---------- 1. Фонетика и орфоэпия ----------

function genPhonetics(rng, { difficulty }) {
  const mode = difficulty === 1
    ? rng.pick(['syllables', 'stress'])
    : difficulty === 2
      ? rng.pick(['voicing', 'letterSound', 'syllables', 'stress'])
      : rng.pick(['voicing', 'letterSound', 'syllables']);

  if (mode === 'syllables') {
    const pool = SYLLABLE_WORDS.filter((w) =>
      difficulty === 1 ? w.diff <= 2 : difficulty === 3 ? w.diff >= 2 : true
    );
    const target = rng.pick(pool.length ? pool : SYLLABLE_WORDS);
    const cnt = countSyllables(target.word);
    const distractors = [];
    for (let d = -2; d <= 3; d++) {
      const val = cnt + d;
      if (val >= 1 && val !== cnt) distractors.push(String(val));
    }
    const { options, answer } = buildSingleOptions(rng, String(cnt), distractors);
    return {
      stem: `Сколько слогов в слове <span class="mark">${target.word}</span>?`,
      format: 'single',
      options,
      answer,
      explanation: `Количество слогов в русском слове определяется количеством гласных букв/звуков. В слове «${target.word}» ${cnt} гласных (${target.vowels}), следовательно, ${cnt} слогов.`,
      difficulty,
      hint: 'Посчитайте все гласные буквы (а, е, ё, и, о, у, ы, э, ю, я), не пропуская стечения гласных.',
    };
  }

  if (mode === 'stress') {
    const askWrong = rng.chance(0.5);
    const picks = rng.sample(STRESS_WORDS, 5);
    const target = picks[0];
    const correct = askWrong ? target.bad : target.ok;
    const dist = picks.slice(1).map((x) => (askWrong ? x.ok : x.bad));
    const { options, answer } = buildSingleOptions(rng, correct, dist);
    return {
      stem: askWrong
        ? 'Укажите слово, в котором <b>неверно</b> выделена буква, обозначающая ударный гласный звук.'
        : 'Укажите слово, в котором <b>верно</b> выделена буква, обозначающая ударный гласный звук.',
      format: 'single',
      options,
      answer,
      explanation: `Литературная орфоэпическая норма — <b>${target.ok}</b> (${target.rule}).`,
      difficulty,
      hint: 'Произнесите каждое слово вслух, сверяясь с нормами орфоэпии (глаголы на -ить, заимствования, формы существительных).',
    };
  }

  if (mode === 'voicing') {
    const devoiceFirst = rng.chance(0.5);
    const dv = rng.sample(DEVOICING_WORDS, 3).map((x) => ({ ...x, kind: 'dv' }));
    const v = rng.sample(VOICING_WORDS, 3).map((x) => ({ ...x, kind: 'v' }));
    const list = rng.shuffle([...dv, ...v]);

    const dvNums = [];
    const vNums = [];
    list.forEach((item, idx) => {
      if (item.kind === 'dv') dvNums.push(idx + 1);
      else vNums.push(idx + 1);
    });

    const stemList = list.map((item, idx) => `${idx + 1}. ${item.word}`).join('<br>');
    const stem = devoiceFirst
      ? `Укажите слова, в которых соответственно происходит <b>оглушение</b>, <b>озвончение</b>:<br>${stemList}`
      : `Укажите слова, в которых соответственно происходит <b>озвончение</b>, <b>оглушение</b>:<br>${stemList}`;

    const { options, answer } = devoiceFirst
      ? buildPairedSplitOptions(rng, dvNums, vNums)
      : buildPairedSplitOptions(rng, vNums, dvNums);

    return {
      stem,
      format: 'single',
      options,
      answer,
      explanation:
        `Оглушение (звонкий согласный перед глухим или на конце слова): № ${dvNums.join(', ')} (${list.filter((x) => x.kind === 'dv').map((x) => x.rule).join('; ')}). ` +
        `Озвончение (глухой согласный перед звонким шумным): № ${vNums.join(', ')} (${list.filter((x) => x.kind === 'v').map((x) => x.rule).join('; ')}).`,
      difficulty,
      hint: 'Определите реальное звучание согласных: звонкие оглушаются на конце слова и перед глухими, а глухие озвончаются перед звонкими шумными (б, д, г, з, ж).',
    };
  }

  // letterSound
  const cats = [
    { cat: 'more', prompt: 'Укажите слово, в котором <b>звуков больше, чем букв</b>.' },
    { cat: 'fewer', prompt: 'Укажите слово, в котором <b>звуков меньше, чем букв</b>.' },
    { cat: 'equal', prompt: 'Укажите слово, в котором <b>количество букв и звуков совпадает</b>.' },
  ];
  const chosenCat = rng.pick(cats);
  const target = rng.pick(LETTER_SOUND_WORDS.filter((w) => w.cat === chosenCat.cat));
  const distractors = rng.sample(LETTER_SOUND_WORDS.filter((w) => w.cat !== chosenCat.cat), 4);
  const { options, answer } = buildSingleOptions(
    rng,
    target.word,
    distractors.map((d) => d.word)
  );
  return {
    stem: chosenCat.prompt,
    format: 'single',
    options,
    answer,
    explanation:
      `В слове «${target.word}» ${target.letters} букв и ${target.sounds} звуков (${target.note}). ` +
      `Для сравнения: ${distractors.map((d) => `«${d.word}» — ${d.letters} б., ${d.sounds} зв.`).join('; ')}.`,
    difficulty,
    hint: 'Помните: ь и ъ звуков не дают, непроизносимые и удвоенные согласные сокращают число звуков, а е, ё, ю, я в начале слова, после гласной и после ь/ъ дают два звука.',
  };
}

// ---------- 2. Орфография: Ь, Ъ, НЕ/НИ ----------

function genOrthoSigns(rng, { difficulty }) {
  const mode = difficulty === 1
    ? 'shush'
    : difficulty === 2
      ? rng.pick(['hardSoft', 'shush'])
      : rng.pick(['neNiCluster', 'hardSoft']);

  if (mode === 'shush') {
    const askNoSoft = rng.chance(0.55);
    const pool = SHUSH_SOFT_SIGN.filter((w) => (difficulty === 1 ? w.diff === 1 : true));
    const rightList = pool.filter((w) => w.hasSoft === !askNoSoft);
    const wrongList = pool.filter((w) => w.hasSoft === askNoSoft);
    const target = rng.pick(rightList);
    const dists = rng.sample(wrongList, 4);
    const { options, answer } = buildSingleOptions(
      rng,
      target.stem,
      dists.map((d) => d.stem)
    );
    return {
      stem: askNoSoft ? '<b>Не</b> пишется <b>ь</b> на месте пропуска в слове (словосочетании)' : 'Буква <b>ь</b> пишется на месте пропуска в слове (словосочетании)',
      format: 'single',
      options,
      answer,
      explanation:
        `В слове «${target.full}» (${target.reason}) мягкий знак ${target.hasSoft ? 'пишется' : 'не пишется'}. ` +
        `Напомним: ь после шипящих на конце пишется у сущ. 3-го скл., инфинитива, повел. накл., 2-го лица ед. ч. глаголов и наречий (кроме исключений уж, замуж, невтерпёж).`,
      difficulty,
      hint: 'Определите часть речи, склонение существительного и проверьте список наречий-исключений (уж, замуж, невтерпёж).',
    };
  }

  if (mode === 'hardSoft') {
    const hards = rng.sample(HARD_SOFT_SEP.filter((w) => w.sign === 'ъ'), 2);
    const softs = rng.sample(HARD_SOFT_SEP.filter((w) => w.sign === 'ь'), 2);
    const trap = rng.pick(HARD_SOFT_SEP.filter((w) => w.sign === 'none'));
    const items = rng.shuffle([
      { ...hards[0], tag: 'ъ' },
      { ...hards[1], tag: 'ъ' },
      { ...softs[0], tag: 'ь' },
      { ...softs[1], tag: 'ь' },
      { ...trap, tag: 'none' },
    ]);
    const labels = ['a', 'b', 'c', 'd', 'e'];
    const hardIdx = [];
    const softIdx = [];
    const lines = items.map((item, i) => {
      const lb = labels[i];
      if (item.tag === 'ъ') hardIdx.push(lb);
      else if (item.tag === 'ь') softIdx.push(lb);
      return `${lb}. ${item.stem}`;
    });

    const correct = `I – ${hardIdx.join(', ')}; II – ${softIdx.join(', ')}`;
    const pool = new Set([`I – ${softIdx.join(', ')}; II – ${hardIdx.join(', ')}`]);
    for (let attempt = 0; attempt < 40 && pool.size < 12; attempt++) {
      const p1 = rng.sample(labels, 2).sort().join(', ');
      const rest = labels.filter((l) => !p1.includes(l));
      const p2 = rng.sample(rest, 2).sort().join(', ');
      const cand = `I – ${p1}; II – ${p2}`;
      if (cand !== correct) pool.add(cand);
    }
    const { options, answer } = buildSingleOptions(rng, correct, [...pool]);

    return {
      stem:
        `Укажите слова, в которых пишутся соответственно <b>ъ</b> и <b>ь</b>:<br>` +
        `<b>I. ъ &nbsp;&nbsp; II. ь</b><br>${lines.join('<br>')}`,
      format: 'single',
      options,
      answer,
      explanation:
        `Разделительный <b>ъ</b> пишется после приставок на согласную перед е, ё, ю, я: ${hards.map((x) => `${x.full} (${x.reason})`).join('; ')}. ` +
        `Разделительный <b>ь</b> пишется в корне перед е, ё, ю, я, и (и перед о в заимствованиях): ${softs.map((x) => `${x.full} (${x.reason})`).join('; ')}. ` +
        `В слове-ловушке «${trap.full}» разделительный знак не пишется (${trap.reason}).`,
      difficulty,
      hint: 'Разделительный ъ не ставится перед а, о, у, э, и, а также в сложносокращённых словах.',
    };
  }

  // neNiCluster
  const targetParticle = rng.chance(0.55) ? 'ни' : 'не';
  const otherParticle = targetParticle === 'ни' ? 'не' : 'ни';
  const wantCount = rng.pick([2, 3]);
  const goodSents = rng.sample(NE_NI_SENTENCES.filter((s) => s.particle === targetParticle), wantCount);
  const badSents = rng.sample(NE_NI_SENTENCES.filter((s) => s.particle === otherParticle), 5 - wantCount);
  const allFive = rng.shuffle([...goodSents, ...badSents]);
  const validNums = [];
  allFive.forEach((s, idx) => {
    if (s.particle === targetParticle) validNums.push(idx + 1);
  });

  const { options, answer } = buildIndexSetOptions(rng, validNums, 5);
  return {
    stem: `Определите номера предложений в кластере, в которых пишется частица <b>${targetParticle}</b>.`,
    image: {
      svg: renderClusterSvg({
        centerLabel: `частица ${targetParticle}`,
        items: allFive.map((s) => s.text),
      }),
      alt: `Кластер из 5 предложений для выбора частицы ${targetParticle}`,
      width: 520,
    },
    format: 'single',
    options,
    answer,
    explanation:
      `Частица <b>${targetParticle}</b> пишется в предложениях № ${validNums.join(', ')}: ` +
      allFive.map((s, idx) => `${idx + 1}) ${s.particle} — ${s.reason}`).join('; ') + '.',
    difficulty,
    hint: 'Частица ни усиливает уже имеющееся отрицание или выражает обобщение/уступку (кто ни, куда ни, как ни), а частица не передаёт отрицание или входит в двойное отрицание («не мог не»).',
  };
}

// ---------- 3. Орфография корней, приставок, Н/НН, слитно/раздельно ----------

function genOrthoRootsAffixes(rng, { difficulty }) {
  const mode = difficulty === 1
    ? 'roots'
    : difficulty === 2
      ? rng.pick(['prefixes', 'n_nn', 'roots'])
      : rng.pick(['jointHyphen', 'n_nn', 'prefixes']);

  if (mode === 'roots') {
    const pairs = [
      { pair: 'ao', letters: ['а', 'о'] },
      { pair: 'ei', letters: ['е', 'и'] },
      { pair: 'oe', letters: ['о', 'ё'] },
      { pair: 'yi', letters: ['ы', 'и'] },
    ];
    const chosenPair = rng.pick(pairs);
    const targetLetter = rng.pick(chosenPair.letters);
    const otherLetter = chosenPair.letters.find((l) => l !== targetLetter);

    const targetWords = ROOT_VOWELS.filter((w) => w.pair === chosenPair.pair && w.vowel === targetLetter);
    const otherWords = ROOT_VOWELS.filter((w) => w.pair === chosenPair.pair && w.vowel === otherLetter);

    const correctTriple = rng.sample(targetWords, 3);
    const correctStr = correctTriple.map((w) => w.stem).join(', ');
    const usedStems = new Set([correctStr]);
    const distractors = [];

    for (let attempt = 0; attempt < 30 && distractors.length < 4; attempt++) {
      const kOther = rng.pick([1, 2, 3]);
      const kTarget = 3 - kOther;
      const sampleList = rng.shuffle([
        ...rng.sample(otherWords, Math.min(kOther, otherWords.length)),
        ...rng.sample(targetWords, Math.min(kTarget, targetWords.length)),
      ]);
      if (sampleList.length < 3 || sampleList.every((w) => w.vowel === targetLetter)) continue;
      const cand = sampleList.map((w) => w.stem).join(', ');
      if (!usedStems.has(cand)) {
        usedStems.add(cand);
        distractors.push(cand);
      }
    }

    const { options, answer } = buildSingleOptions(rng, correctStr, distractors);
    return {
      stem: `Укажите ряд слов, в котором во всех словах на месте пропуска пишется буква <b>${targetLetter}</b>.`,
      format: 'single',
      options,
      answer,
      explanation: `Во всех словах верного ряда пишется буква <b>${targetLetter}</b>: ${correctTriple.map((w) => `${w.stem.replace('...', w.vowel)} (${w.rule})`).join('; ')}.`,
      difficulty,
      hint: 'Вспомните правила чередования гласных в корнях (ударение, суффикс -а-, конечный согласный корня) и слова-исключения.',
    };
  }

  if (mode === 'prefixes') {
    const grp = rng.chance(0.55)
      ? { group: 'pre_pri', letters: ['е', 'и'] }
      : { group: 'zs', letters: ['з', 'с'] };
    const targetLetter = rng.pick(grp.letters);
    const otherLetter = grp.letters.find((l) => l !== targetLetter);

    const tWords = PREFIX_WORDS.filter((w) => w.group === grp.group && w.letter === targetLetter);
    const oWords = PREFIX_WORDS.filter((w) => w.group === grp.group && w.letter === otherLetter);
    const correctTriple = rng.sample(tWords, 3);
    const correctStr = correctTriple.map((w) => w.stem).join(', ');
    const seen = new Set([correctStr]);
    const distractors = [];

    for (let attempt = 0; attempt < 30 && distractors.length < 4; attempt++) {
      const kOther = rng.pick([1, 2, 3]);
      const kTarget = 3 - kOther;
      const list = rng.shuffle([
        ...rng.sample(oWords, Math.min(kOther, oWords.length)),
        ...rng.sample(tWords, Math.min(kTarget, tWords.length)),
      ]);
      if (list.length < 3 || list.every((w) => w.letter === targetLetter)) continue;
      const cand = list.map((w) => w.stem).join(', ');
      if (!seen.has(cand)) {
        seen.add(cand);
        distractors.push(cand);
      }
    }

    const { options, answer } = buildSingleOptions(rng, correctStr, distractors);
    return {
      stem: `Укажите ряд, в котором во всех словах на месте пропуска пишется буква <b>${targetLetter}</b>.`,
      format: 'single',
      options,
      answer,
      explanation: `Буква <b>${targetLetter}</b> во всех словах ряда: ${correctTriple.map((w) => `${w.stem.replace('...', w.letter)} (${w.rule})`).join('; ')}.`,
      difficulty,
      hint: grp.group === 'pre_pri'
        ? 'При- означает приближение, присоединение, неполноту, близость; пре- означает «очень» или близка к пере-.'
        : 'Приставки на -з/-с зависят от звонкости/глухости следующего согласного, но приставка с- — неизменяемая.',
    };
  }

  if (mode === 'n_nn') {
    const wantNN = rng.chance(0.5);
    const targetMark = wantNN ? 'нн' : 'н';
    const otherMark = wantNN ? 'н' : 'нн';
    const target = rng.pick(N_NN_WORDS.filter((w) => w.n === targetMark));
    const dists = rng.sample(N_NN_WORDS.filter((w) => w.n === otherMark), 4);
    const { options, answer } = buildSingleOptions(
      rng,
      target.phrase,
      dists.map((d) => d.phrase)
    );
    return {
      stem: `Укажите словосочетание, в котором на месте пропуска пишется <b>${targetMark}</b>.`,
      format: 'single',
      options,
      answer,
      explanation: `Правильно: «${target.phrase.replace('...', target.n)}» — ${target.rule}. В остальных примерах пишется <b>${otherMark}</b>.`,
      difficulty,
      hint: 'Разграничивайте отымённые прилагательные (-ан-/-ян-/-ин- против -онн-/-енн-), краткие причастия (всегда н) и полные причастия (наличие приставки или зависимых слов).',
    };
  }

  // jointHyphen
  const targetWrite = rng.pick(['слитно', 'раздельно', 'через дефис']);
  const target = rng.pick(JOINT_HYPHEN_ITEMS.filter((x) => x.writing === targetWrite));
  const dists = rng.sample(JOINT_HYPHEN_ITEMS.filter((x) => x.writing !== targetWrite), 4);
  const { options, answer } = buildSingleOptions(
    rng,
    target.sent,
    dists.map((d) => d.sent)
  );
  return {
    stem: `Укажите предложение, в котором выделенное в скобках слово (сочетание) пишется <b>${targetWrite}</b>.`,
    format: 'single',
    options,
    answer,
    explanation: `В верном предложении слово «${target.word}» пишется <b>${targetWrite}</b> (${target.rule}). В остальных вариантах: ${dists.map((d) => `«${d.word}» — ${d.writing}`).join('; ')}.`,
    difficulty,
    hint: 'Отличайте производные предлоги и союзы (вследствие, зато, чтобы, также) от омонимичных сочетаний с предлогами и частицами (в течение, за то, что бы, так же).',
  };
}

// ---------- 4. Морфемика и словообразование ----------

function genMorphemicsWordform(rng, { difficulty }) {
  const mode = difficulty === 1
    ? rng.pick(['definition', 'wordFormation'])
    : difficulty === 2
      ? rng.pick(['homoform', 'scheme', 'wordFormation'])
      : rng.pick(['wordFormation', 'homoform', 'scheme']);

  if (mode === 'definition') {
    const target = rng.pick(MORPHEME_DEFINITIONS);
    const dists = MORPHEME_DEFINITIONS.filter((m) => m.name !== target.name).map((m) => m.name);
    const { options, answer } = buildSingleOptions(rng, target.name, dists);
    return {
      stem: target.prompt,
      format: 'single',
      options,
      answer,
      explanation: target.explain,
      difficulty,
      hint: 'Вспомните позицию каждой морфемы относительно корня и её функцию (словообразование vs формообразование).',
    };
  }

  if (mode === 'homoform') {
    const grp = rng.pick(MORPHEME_HOMOFORMS);
    const target = rng.pick(grp.valid);
    const dists = rng.sample(grp.distractors, 4);
    const { options, answer } = buildSingleOptions(
      rng,
      target.word,
      dists.map((d) => d.word)
    );
    return {
      stem: `В каком слове <b>${grp.ending}</b> может быть и окончанием, и суффиксом?`,
      format: 'single',
      options,
      answer,
      explanation: `${target.explain}. В остальных словах (${dists.map((d) => d.word).join(', ')}) ${grp.ending} всегда является только окончанием.`,
      difficulty,
      hint: 'Проверьте, может ли слово переходить из формы творительного падежа существительного в неизменяемое наречие.',
    };
  }

  if (mode === 'scheme') {
    const target = rng.pick(MORPHEME_SCHEMES);
    const dists = rng.sample(MORPHEME_SCHEMES.filter((w) => w.scheme !== target.scheme), 4);
    const { options, answer } = buildSingleOptions(
      rng,
      target.word,
      dists.map((d) => d.word)
    );
    return {
      stem: `Укажите слово, морфемный состав которого соответствует схеме: <b>${target.label}</b>.`,
      format: 'single',
      options,
      answer,
      explanation: `Слово «${target.word}» имеет состав: ${target.breakdown}. Остальные слова: ${dists.map((d) => `«${d.word}» (${d.breakdown})`).join('; ')}.`,
      difficulty,
      hint: 'Сначала выделите окончание (или проверьте его отсутствие у неизменяемых слов), затем корень, приставку и суффикс.',
    };
  }

  // wordFormation
  const allWays = [
    'приставочный',
    'суффиксальный',
    'приставочно-суффиксальный',
    'бессуффиксный',
    'сложение',
    'переход из одной части речи в другую',
  ];
  const pool = difficulty === 1
    ? WORD_FORMATION_ITEMS.filter((x) => ['приставочный', 'суффиксальный', 'сложение'].includes(x.way))
    : WORD_FORMATION_ITEMS;
  const target = rng.pick(pool);
  const askWord = rng.chance(0.5);

  if (askWord) {
    const distWords = rng.sample(WORD_FORMATION_ITEMS.filter((w) => w.way !== target.way), 4);
    const { options, answer } = buildSingleOptions(
      rng,
      target.word,
      distWords.map((d) => d.word)
    );
    return {
      stem: `Укажите слово, образованное способом «<b>${target.way}</b>».`,
      format: 'single',
      options,
      answer,
      explanation: `${target.explain}. Остальные слова образованы иначе: ${distWords.map((d) => `${d.word} — ${d.way}`).join('; ')}.`,
      difficulty,
      hint: 'Найдите ближайшее производящее слово и проследите, какие именно морфемы добавились на последнем шаге.',
    };
  }

  const { options, answer } = buildSingleOptions(
    rng,
    target.way,
    allWays.filter((w) => w !== target.way)
  );
  return {
    stem: `Каким способом образовано слово <span class="mark">${target.word}</span>?`,
    format: 'single',
    options,
    answer,
    explanation: `${target.explain} (способ словообразования — ${target.way}).`,
    difficulty,
    hint: 'Постройте словообразовательную цепочку от ближайшего однокоренного слова.',
  };
}

// ---------- 5. Лексика, паронимы и культура речи ----------

function genLexicsNorms(rng, { difficulty }) {
  const mode = difficulty === 1
    ? rng.pick(['idioms', 'lexisLayers'])
    : difficulty === 2
      ? rng.pick(['paronyms', 'lexisLayers', 'idioms'])
      : rng.pick(['speechErrors', 'paronyms']);

  if (mode === 'idioms') {
    const item = rng.pick(IDIOMS);
    const { options, answer } = buildSingleOptions(rng, item.meaning, item.wrong);
    return {
      stem: `Укажите верное значение (синоним) фразеологизма <span class="mark">${item.idiom}</span>.`,
      format: 'single',
      options,
      answer,
      explanation: `Фразеологизм «${item.idiom}» имеет устойчивое значение «${item.meaning}».`,
      difficulty,
      hint: 'Вспомните целостный переносимый смысл устойчивого оборота, не переводя его буквально.',
    };
  }

  if (mode === 'lexisLayers') {
    const target = rng.pick(LEXIS_LAYERS);
    const allLayers = [
      'устаревшее слово (архаизм)',
      'устаревшее слово (историзм)',
      'диалектизм',
      'профессиональное слово (термин)',
      'неологизм',
    ];
    const { options, answer } = buildSingleOptions(
      rng,
      target.layer,
      allLayers.filter((l) => l !== target.layer)
    );
    return {
      stem: `К какому пласту лексики относится выделенное слово в предложении: «${target.context.replace(target.word, `<span class="mark">${target.word}</span>`)}»?`,
      format: 'single',
      options,
      answer,
      explanation: target.explain,
      difficulty,
      hint: 'Разграничивайте архаизмы (есть современный синоним), историзмы (исчез сам предмет), диалектизмы, термины и новые слова (неологизмы).',
    };
  }

  if (mode === 'paronyms') {
    const picks = rng.sample(PARONYMS, 5);
    const target = picks[0];
    const { options, answer } = buildSingleOptions(
      rng,
      target.bad,
      picks.slice(1).map((p) => p.ok)
    );
    return {
      stem: 'Укажите предложение, в котором допущена <b>ошибка в употреблении паронима</b>.',
      format: 'single',
      options,
      answer,
      explanation: `Ошибка допущена в предложении «${target.bad}». Норма: ${target.rule}. Верный вариант: «${target.ok}».`,
      difficulty,
      hint: 'Проверьте сочетаемость каждого прилагательного или глагола с соседним существительным (надеть/одеть, невежа/невежда и др.).',
    };
  }

  // speechErrors
  const picks = rng.sample(SPEECH_ERRORS, 5);
  const target = picks[0];
  const { options, answer } = buildSingleOptions(
    rng,
    target.bad,
    picks.slice(1).map((p) => p.good)
  );
  return {
    stem: 'Укажите предложение, в котором допущена <b>речевая или грамматическая ошибка</b>.',
    format: 'single',
    options,
    answer,
    explanation: `В предложении допущена ошибка (${target.kind}): ${target.fix}. Правило: ${target.rule}.`,
    difficulty,
    hint: 'Проверьте наличие лишних по смыслу слов (плеоназмов), правильность падежного управления, употребления числительных и местоимений.',
  };
}

// ---------- 6. Морфология: существительное, прилагательное, числительное ----------

function genMorphNounAdjNum(rng, { difficulty }) {
  const mode = difficulty === 1
    ? rng.pick(['nounNumber', 'adjRank'])
    : difficulty === 2
      ? rng.pick(['nounNumber', 'nounGender', 'numeralNorms'])
      : rng.pick(['numeralNorms', 'nounGender', 'adjRank']);

  if (mode === 'nounNumber') {
    const askPluralOnly = rng.chance(0.4);
    if (askPluralOnly) {
      const target = rng.pick(NOUN_NUMBER.filter((w) => w.cat === 'pl_only'));
      const dists = rng.sample(NOUN_NUMBER.filter((w) => w.cat !== 'pl_only'), 4);
      const { options, answer } = buildSingleOptions(rng, target.word, dists.map((d) => d.word));
      return {
        stem: 'Какое существительное употребляется <b>только во множественном числе</b>?',
        format: 'single',
        options,
        answer,
        explanation: `Слово «${target.word}» — ${target.reason}. Остальные слова имеют форму единственного числа.`,
        difficulty,
        hint: 'Попробуйте подставить числительное «один / одна / одно» — к существительным pluralia tantum оно не подходит.',
      };
    }

    const target = rng.pick(NOUN_NUMBER.filter((w) => w.cat === 'both'));
    const dists = rng.sample(NOUN_NUMBER.filter((w) => w.cat === 'sg_only'), 4);
    const { options, answer } = buildSingleOptions(rng, target.word, dists.map((d) => d.word));
    return {
      stem: 'Какое существительное <b>имеет форму множественного числа</b>?',
      format: 'single',
      options,
      answer,
      explanation: `Слово «${target.word}» — ${target.reason}. Остальные слова (${dists.map((d) => d.word).join(', ')}) относятся к отвлечённым, собирательным или вещественным существительным и не имеют формы мн. числа.`,
      difficulty,
      hint: 'Отделите конкретные исчисляемые существительные от отвлечённых (счастье, ловкость), собирательных (зверьё) и вещественных.',
    };
  }

  if (mode === 'nounGender') {
    const targetGender = rng.pick(['мужской', 'средний', 'женский']);
    const target = rng.pick(NOUN_GENDER_ITEMS.filter((w) => w.gender === targetGender));
    const dists = rng.sample(NOUN_GENDER_ITEMS.filter((w) => w.gender !== targetGender), 4);
    const { options, answer } = buildSingleOptions(rng, target.word, dists.map((d) => d.word));
    return {
      stem: `Укажите существительное <b>${targetGender === 'мужской' ? 'мужского' : targetGender === 'средний' ? 'среднего' : 'женского'} рода</b>.`,
      format: 'single',
      options,
      answer,
      explanation: `«${target.word}» — существительное ${targetGender === 'мужской' ? 'мужского' : targetGender === 'средний' ? 'среднего' : 'женского'} рода (${target.rule}).`,
      difficulty,
      hint: 'Несклоняемые одушевлённые названия животных обычно относятся к мужскому роду, неодушевлённые — к среднему (кроме исключений авеню, салями, кольраби и др.).',
    };
  }

  if (mode === 'adjRank') {
    const targetRank = rng.pick(['качественное', 'относительное', 'притяжательное']);
    const target = rng.pick(ADJ_ITEMS.filter((a) => a.rank === targetRank));
    const dists = rng.sample(ADJ_ITEMS.filter((a) => a.rank !== targetRank), 4);
    const { options, answer } = buildSingleOptions(rng, target.phrase, dists.map((d) => d.phrase));
    return {
      stem: `Укажите словосочетание с <b>${targetRank === 'качественное' ? 'качественным' : targetRank === 'относительное' ? 'относительным' : 'притяжательным'}</b> прилагательным.`,
      format: 'single',
      options,
      answer,
      explanation: `В словосочетании «${target.phrase}» прилагательное ${targetRank}: ${target.explain}.`,
      difficulty,
      hint: 'Качественные имеют степени сравнения (более / самый), относительные называют материал/время/место, притяжательные отвечают на вопрос чей? чья? чьё?',
    };
  }

  // numeralNorms
  const picks = rng.sample(NUMERAL_NORMS, 5);
  const target = picks[0];
  const { options, answer } = buildSingleOptions(
    rng,
    target.bad,
    picks.slice(1).map((p) => p.ok)
  );
  return {
    stem: 'Укажите словосочетание с <b>ошибкой</b> в употреблении или склонении имени числительного.',
    format: 'single',
    options,
    answer,
    explanation: `Ошибка в сочетании «${target.bad}»: ${target.rule}. Правильно: <b>${target.ok}</b>.`,
    difficulty,
    hint: 'Проверьте сочетаемость собирательных числительных (двое, трое, четверо не употребляются с сущ. ж. р.), различие оба/обе и склонение сложных числительных.',
  };
}

// ---------- 7. Морфология: местоимение и наречие ----------

function genMorphPronounAdverb(rng, { difficulty }) {
  const mode = difficulty === 1
    ? rng.pick(['adverbTriples', 'pronounCluster'])
    : difficulty === 2
      ? rng.pick(['pronounCluster', 'adverbTriples', 'adverbVenn'])
      : rng.pick(['adverbVenn', 'pronounCluster', 'adverbTriples']);

  if (mode === 'pronounCluster') {
    const ranks = [
      { key: 'указательное', label: 'с указательным местоимением' },
      { key: 'определительное', label: 'с определительным местоимением' },
      { key: 'притяжательное', label: 'с притяжательным местоимением' },
      { key: 'отрицательное', label: 'с отрицательным местоимением' },
      { key: 'неопределённое', label: 'с неопределённым местоимением' },
    ];
    const targetRank = rng.pick(ranks);
    const matching = rng.sample(PRONOUN_PHRASES.filter((p) => p.rank === targetRank.key), 2);
    const nonMatching = rng.sample(PRONOUN_PHRASES.filter((p) => p.rank !== targetRank.key), 3);
    const items = rng.shuffle([
      ...matching.map((m) => ({ ...m, ok: true })),
      ...nonMatching.map((m) => ({ ...m, ok: false })),
    ]);

    const askExtra = difficulty >= 2 || rng.chance(0.7);
    const targetIndices = [];
    items.forEach((it, idx) => {
      if (askExtra ? !it.ok : it.ok) targetIndices.push(idx + 1);
    });

    const { options, answer } = buildIndexSetOptions(rng, targetIndices, 5);
    return {
      stem: askExtra
        ? 'Укажите <b>лишнее</b> в кластере (номера словосочетаний, не соответствующих заголовку).'
        : 'Укажите номера словосочетаний, которые <b>соответствуют</b> названию кластера.',
      image: {
        svg: renderClusterSvg({
          centerLabel: `Словосочетания ${targetRank.label}`,
          items: items.map((x) => x.phrase),
        }),
        alt: `Кластер местоимений: ${targetRank.label}`,
        width: 520,
      },
      format: 'single',
      options,
      answer,
      explanation:
        items.map((it, idx) => `${idx + 1}) «${it.phrase}» — ${it.rank} местоимение «${it.word}»`).join('; ') +
        `. Следовательно, ${askExtra ? 'лишние' : 'подходящие'} номера — ${targetIndices.join(', ')}.`,
      difficulty,
      hint: 'Различайте притяжательные местоимения (его, её, их, наш) и определительные (каждый, другой, всякий, любой) от указательных (этот, тот, такой).',
    };
  }

  if (mode === 'adverbTriples') {
    const item = rng.pick(ADVERB_TRIPLES);
    const correct = item.adverbs.map((a) => a.rank).join(', ');
    const allRanks = ['времени', 'места', 'образа действия', 'меры и степени', 'причины', 'цели'];
    const pool = new Set();
    // Перестановки тех же разрядов — самые правдоподобные дистракторы
    const perms = [
      [item.adverbs[1].rank, item.adverbs[0].rank, item.adverbs[2].rank],
      [item.adverbs[0].rank, item.adverbs[2].rank, item.adverbs[1].rank],
      [item.adverbs[2].rank, item.adverbs[1].rank, item.adverbs[0].rank],
    ];
    for (const p of perms) {
      const s = p.join(', ');
      if (s !== correct) pool.add(s);
    }
    for (let attempt = 0; attempt < 30 && pool.size < 10; attempt++) {
      const randTriple = rng.sample(allRanks, 3).join(', ');
      if (randTriple !== correct) pool.add(randTriple);
    }

    const { options, answer } = buildSingleOptions(rng, correct, [...pool]);
    return {
      stem: `Укажите разряды наречий соответственно в предложении:<br>«${item.sentence}»`,
      format: 'single',
      options,
      answer,
      explanation: `В предложении три наречия в следующем порядке: ${item.adverbs.map((a) => `<b>${a.word}</b> (${a.q} — ${a.rank})`).join('; ')}.`,
      difficulty,
      hint: 'Задайте смысловой вопрос к каждому наречию строго в порядке их следования в предложении.',
    };
  }

  // adverbVenn
  const pair = rng.pick(ADVERB_VENN_PAIRS);
  const { options, answer } = buildSingleOptions(rng, pair.correct, pair.distractors);
  return {
    stem: `Укажите верный вариант заполнения диаграммы Эйлера–Венна, сравнив наречия <i>${pair.left}</i> и <i>${pair.right}</i>.`,
    image: {
      svg: renderVennSvg({ leftTitle: pair.left, rightTitle: pair.right }),
      alt: `Диаграмма Эйлера-Венна для наречий ${pair.left} и ${pair.right}`,
      width: 460,
    },
    format: 'single',
    options,
    answer,
    explanation: pair.explain,
    difficulty,
    hint: 'Проверьте три признака каждого наречия: разряд по значению, способ словообразования и способность образовывать степени сравнения.',
  };
}

// ---------- 8. Морфология: глагол, причастие, деепричастие ----------

function genMorphVerb(rng, { difficulty }) {
  const mode = difficulty === 1
    ? rng.pick(['statements', 'conjugation'])
    : difficulty === 2
      ? rng.pick(['statements', 'conjugation', 'participleDeev'])
      : rng.pick(['participleDeev', 'statements', 'conjugation']);

  if (mode === 'statements') {
    const askFalse = rng.chance(0.65);
    const targetPool = VERB_STATEMENTS.filter((s) => s.isTrue === !askFalse);
    const otherPool = VERB_STATEMENTS.filter((s) => s.isTrue === askFalse);
    const target = rng.pick(targetPool);
    const dists = rng.sample(otherPool, 4);
    const { options, answer } = buildSingleOptions(
      rng,
      target.text,
      dists.map((d) => d.text)
    );
    return {
      stem: askFalse ? 'Укажите <b>неверное</b> утверждение о глаголе.' : 'Укажите <b>верное</b> утверждение о глаголе.',
      format: 'single',
      options,
      answer,
      explanation: `Утверждение «${target.text}» является ${askFalse ? 'неверным' : 'верным'}, так как ${target.note}.`,
      difficulty,
      hint: 'Различайте постоянные (вид, переходность, возвратность, спряжение) и непостоянные признаки (наклонение, время, лицо, число, род).',
    };
  }

  if (mode === 'conjugation') {
    const targetConj = rng.pick([1, 2]);
    const wantLetter = targetConj === 1 ? 'е' : 'и';
    const goodPool = VERB_CONJUGATION.filter((v) => v.conj === targetConj);
    const badPool = VERB_CONJUGATION.filter((v) => v.conj !== targetConj);
    const correctTriple = rng.sample(goodPool, 3);
    const correctStr = correctTriple.map((v) => v.stem).join(', ');
    const seen = new Set([correctStr]);
    const distractors = [];

    for (let attempt = 0; attempt < 30 && distractors.length < 4; attempt++) {
      const kBad = rng.pick([1, 2, 3]);
      const kGood = 3 - kBad;
      const list = rng.shuffle([
        ...rng.sample(badPool, Math.min(kBad, badPool.length)),
        ...rng.sample(goodPool, Math.min(kGood, goodPool.length)),
      ]);
      if (list.length < 3 || list.every((v) => v.conj === targetConj)) continue;
      const cand = list.map((v) => v.stem).join(', ');
      if (!seen.has(cand)) {
        seen.add(cand);
        distractors.push(cand);
      }
    }

    const { options, answer } = buildSingleOptions(rng, correctStr, distractors);
    return {
      stem: `Укажите ряд глаголов, в безударных личных окончаниях которых пишется буква <b>${wantLetter}</b>.`,
      format: 'single',
      options,
      answer,
      explanation: `Во всех глаголах верного ряда пишется буква <b>${wantLetter}</b> (${targetConj === 2 ? 'II' : 'I'} спряжение): ${correctTriple.map((v) => `${v.stem.replace('...', v.letter)} ← ${v.inf}`).join('; ')}.`,
      difficulty,
      hint: 'Поставьте глагол в неопределённую форму и проверьте, не входит ли он в 11 исключений II спряжения или в исключения I спряжения (брить, стелить).',
    };
  }

  // participleDeev
  const askError = rng.chance(0.5);
  const picks = rng.sample(PARTICIPLE_DEEV_NORMS, 5);
  const target = picks[0];
  const correct = askError ? target.bad : target.ok;
  const dists = picks.slice(1).map((p) => (askError ? p.ok : p.bad));
  const { options, answer } = buildSingleOptions(rng, correct, dists);
  return {
    stem: askError
      ? 'Укажите предложение с <b>ошибкой</b> в построении деепричастного оборота.'
      : 'Укажите предложение <b>без ошибки</b> в построении деепричастного оборота.',
    format: 'single',
    options,
    answer,
    explanation: `${askError ? `Ошибка в выбранном предложении: ${target.explain}` : `Норма соблюдена в верном варианте: ${target.okExplain}`}.`,
    difficulty,
    hint: 'Найдите подлежащее и сказуемое и проверьте, может ли подлежащее выполнять действие, выраженное деепричастием.',
  };
}

// ---------- 9. Морфология: служебные части речи и сравнение ----------

function genMorphService(rng, { difficulty }) {
  const mode = difficulty === 1
    ? rng.pick(['definition', 'conjunctions'])
    : difficulty === 2
      ? rng.pick(['conjunctions', 'venn'])
      : rng.pick(['venn', 'conjunctions']);

  if (mode === 'definition') {
    const target = rng.pick(SERVICE_DEFINITIONS);
    const pool = ['частицы', 'предлоги', 'союзы', 'междометия', 'наречия', 'местоимения'].filter((x) => x !== target.answer);
    const { options, answer } = buildSingleOptions(rng, target.answer, pool);
    return {
      stem: target.stem,
      format: 'single',
      options,
      answer,
      explanation: target.explain,
      difficulty,
      hint: 'Различайте связывающую роль предлогов/союзов, смысловые оттенки частиц и эмоциональную роль междометий.',
    };
  }

  if (mode === 'conjunctions') {
    const targetCat = rng.pick(['разделительный', 'противительный', 'соединительный', 'подчинительный']);
    const wantCount = 2;
    const goodSents = rng.sample(CONJUNCTION_SENTENCES.filter((s) => s.cat === targetCat), wantCount);
    const badSents = rng.sample(CONJUNCTION_SENTENCES.filter((s) => s.cat !== targetCat), 2);
    const allFour = rng.shuffle([...goodSents, ...badSents]);
    const validNums = [];
    allFour.forEach((s, idx) => {
      if (s.cat === targetCat) validNums.push(idx + 1);
    });
    const { options, answer } = buildIndexSetOptions(rng, validNums, 4);

    const adjPlural = targetCat === 'разделительный'
      ? 'разделительными'
      : targetCat === 'противительный'
        ? 'противительными'
        : targetCat === 'соединительный'
          ? 'соединительными'
          : 'подчинительными';

    return {
      stem: `Укажите номера предложений с <b>${adjPlural}</b> союзами:<br>${allFour.map((s, i) => `${i + 1}. ${s.text}`).join('<br>')}`,
      format: 'single',
      options,
      answer,
      explanation:
        `Предложения № ${validNums.join(', ')} содержат ${adjPlural} союзы: ` +
        allFour.map((s, idx) => `${idx + 1}) союз «${s.conj}» (${s.cat})`).join('; ') + '.',
      difficulty,
      hint: 'Сочинительные союзы делятся на соединительные (и, да=и, тоже, также), противительные (а, но, однако, зато) и разделительные (или, либо, то…то).',
    };
  }

  // venn
  const pair = rng.pick(SERVICE_VENN_PAIRS);
  const { options, answer } = buildSingleOptions(rng, pair.correct, pair.distractors);
  return {
    stem: `Укажите верный вариант заполнения диаграммы Эйлера–Венна, сравнив слова <i>${pair.left}</i> и <i>${pair.right}</i>.`,
    image: {
      svg: renderVennSvg({ leftTitle: pair.left, rightTitle: pair.right }),
      alt: `Диаграмма Эйлера-Венна для слов ${pair.left} и ${pair.right}`,
      width: 460,
    },
    format: 'single',
    options,
    answer,
    explanation: pair.explain,
    difficulty,
    hint: 'Определите принадлежность каждого слова к предлогам, союзам или частицам, их разряд и общие свойства служебных слов.',
  };
}

// ---------- 10. Синтаксис: словосочетание, члены предложения, роль инфинитива ----------

function genSyntaxWordPhrase(rng, { difficulty }) {
  const mode = difficulty === 1
    ? rng.pick(['circumstance', 'wordComb'])
    : difficulty === 2
      ? rng.pick(['infinitive', 'wordComb', 'circumstance'])
      : rng.pick(['infinitive', 'wordComb']);

  if (mode === 'circumstance') {
    const target = rng.pick(CIRCUMSTANCE_SENTENCES);
    const allKinds = ['места', 'времени', 'причины', 'цели', 'образа действия', 'меры и степени', 'уступки', 'условия'];
    const { options, answer } = buildSingleOptions(
      rng,
      target.kind,
      allKinds.filter((k) => k !== target.kind)
    );
    return {
      stem: `Выделенное слово (сочетание) в предложении «${target.text}» является обстоятельством`,
      format: 'single',
      options,
      answer,
      explanation: `В предложении «${target.text.replace(/<[^>]*>/g, '')}» выделенный фрагмент отвечает на вопрос <i>${target.q}</i> и является обстоятельством <b>${target.kind}</b>.`,
      difficulty,
      hint: 'Задайте смысловой вопрос к выделенному слову от сказуемого.',
    };
  }

  if (mode === 'wordComb') {
    const links = ['согласование', 'управление', 'примыкание', 'не_словосочетание'];
    const chosenLink = rng.pick(links);
    const target = rng.pick(WORD_COMBINATIONS.filter((w) => w.link === chosenLink));
    const dists = rng.sample(WORD_COMBINATIONS.filter((w) => w.link !== chosenLink), 4);
    const { options, answer } = buildSingleOptions(
      rng,
      target.phrase,
      dists.map((d) => d.phrase)
    );

    const promptMap = {
      согласование: 'Укажите словосочетание со способом подчинительной связи <b>согласование</b>.',
      управление: 'Укажите словосочетание со способом подчинительной связи <b>управление</b>.',
      примыкание: 'Укажите словосочетание со способом подчинительной связи <b>примыкание</b>.',
      не_словосочетание: 'Укажите сочетание слов, которое <b>не является словосочетанием</b>.',
    };

    return {
      stem: promptMap[chosenLink],
      format: 'single',
      options,
      answer,
      explanation: `Верный выбор — «${target.phrase}»: ${target.explain}.`,
      difficulty,
      hint: 'При согласовании зависимое слово уподобляется главному в роде/числе/падеже; при управлении стоит в нужном падеже; при примыкании оно неизменяемо. Грамматическая основа, однородные члены и фразеологизмы словосочетаниями не являются.',
    };
  }

  // infinitive — строго 1 предложение на каждую из 5 ролей!
  const roles = [
    'подлежащим',
    'сказуемым (частью составного глагольного сказуемого)',
    'определением',
    'дополнением',
    'обстоятельством',
  ];
  const chosenRole = rng.pick(roles);
  const onePerRole = roles.map((r) => rng.pick(INFINITIVE_ROLES.filter((x) => x.role === r)));
  const target = onePerRole.find((x) => x.role === chosenRole);
  const dists = onePerRole.filter((x) => x.role !== chosenRole);
  const { options, answer } = buildSingleOptions(
    rng,
    target.text,
    dists.map((d) => d.text)
  );
  return {
    stem: `Укажите предложение, в котором неопределённая форма глагола (инфинитив) является <b>${chosenRole}</b>.`,
    format: 'single',
    options,
    answer,
    explanation: `В предложении «${target.text}» инфинитив выступает в роли ${chosenRole}: ${target.explain}.`,
    difficulty,
    hint: 'Проверьте, к какому слову относится инфинитив (к существительному «какой?» — определение; к глаголу движения «зачем?» — обстоятельство цели; другой субъект действия — дополнение; один субъект с фазовым/модальным глаголом — сказуемое).',
  };
}

// ---------- 11. Синтаксис: односоставное и осложнённое простое предложение ----------

function genSyntaxSimple(rng, { difficulty }) {
  const mode = difficulty === 1
    ? rng.pick(['onePart', 'dash'])
    : difficulty === 2
      ? rng.pick(['onePart', 'predicate', 'simplePunct'])
      : rng.pick(['simplePunct', 'dash', 'onePart']);

  if (mode === 'onePart') {
    const types = ['определённо-личное', 'неопределённо-личное', 'обобщённо-личное', 'безличное', 'назывное', 'двусоставное'];
    const targetType = rng.pick(['определённо-личное', 'неопределённо-личное', 'обобщённо-личное', 'безличное', 'назывное']);
    const otherTypes = rng.sample(types.filter((t) => t !== targetType), 4);
    const target = rng.pick(ONE_PART_SENTENCES.filter((s) => s.kind === targetType));
    const dists = otherTypes.map((t) => rng.pick(ONE_PART_SENTENCES.filter((s) => s.kind === t)));
    const { options, answer } = buildSingleOptions(
      rng,
      target.text,
      dists.map((d) => d.text)
    );
    return {
      stem: `Укажите <b>${targetType}</b> односоставное предложение.`,
      format: 'single',
      options,
      answer,
      explanation: `«${target.text}» — ${targetType} предложение: ${target.explain}.`,
      difficulty,
      hint: 'Найдите грамматическую основу и определите форму главного члена (1–2 л. ед./мн. ч., 3 л. мн. ч., безличный глагол или только подлежащее).',
    };
  }

  if (mode === 'predicate') {
    const target = rng.pick(PREDICATE_TYPES);
    const allTypes = ['простое глагольное (ПГС)', 'составное глагольное (СГС)', 'составное именное (СИС)', 'односоставное назывное', 'неполное сказуемое'];
    const { options, answer } = buildSingleOptions(
      rng,
      target.type,
      allTypes.filter((t) => t !== target.type)
    );
    return {
      stem: `Определите вид сказуемого в предложении:<br>«${target.text}»`,
      format: 'single',
      options,
      answer,
      explanation: `Это ${target.type}: ${target.explain}.`,
      difficulty,
      hint: 'Сложное будущее время («будет утихать») и устойчивые сочетания («приняли участие») являются ПГС; связка + инфинитив — СГС; связка + именная часть — СИС.',
    };
  }

  if (mode === 'dash') {
    const wantDash = rng.chance(0.5);
    const target = rng.pick(DASH_SUBJ_PRED.filter((s) => s.dash === wantDash));
    const dists = rng.sample(DASH_SUBJ_PRED.filter((s) => s.dash !== wantDash), 4);
    const { options, answer } = buildSingleOptions(
      rng,
      target.text.replace(' — ', ' '),
      dists.map((d) => d.text.replace(' — ', ' '))
    );
    return {
      stem: wantDash
        ? 'Укажите предложение, в котором между подлежащим и сказуемым <b>ставится тире</b> (знаки препинания не расставлены).'
        : 'Укажите предложение, в котором между подлежащим и сказуемым <b>тире не ставится</b> (знаки препинания не расставлены).',
      format: 'single',
      options,
      answer,
      explanation: `В предложении «${target.text}» тире ${wantDash ? 'ставится' : 'не ставится'}: ${target.rule}.`,
      difficulty,
      hint: 'Тире ставится между подлежащим и сказуемым — сущ.+сущ., инф.+инф., числ.+сущ., но обычно не ставится при личном местоимении, частице «не», связках «быть/являться» или сравнительном союзе.',
    };
  }

  // simplePunct
  const askError = rng.chance(0.5);
  const picks = rng.sample(SIMPLE_PUNCT, 5);
  const target = picks[0];
  const { options, answer } = buildSingleOptions(
    rng,
    askError ? target.bad : target.ok,
    picks.slice(1).map((p) => (askError ? p.ok : p.bad))
  );
  return {
    stem: askError
      ? 'Укажите предложение, в котором допущена <b>пунктуационная ошибка</b>.'
      : 'Укажите предложение, в котором знаки препинания расставлены <b>верно</b>.',
    format: 'single',
    options,
    answer,
    explanation: `${askError ? 'Ошибка допущена в выбранном варианте' : 'Знаки препинания расставлены верно'}: ${target.rule}.`,
    difficulty,
    hint: 'Проверьте положение определяемого слова перед/после причастного оборота, обобщающие слова, вводные слова и обращения.',
  };
}

// ---------- 12. Синтаксис: сложные предложения и чужая речь ----------

function genSyntaxComplex(rng, { difficulty }) {
  const mode = difficulty === 1
    ? rng.pick(['sspRelations', 'directSpeech'])
    : difficulty === 2
      ? rng.pick(['sppClauses', 'bspSign', 'sspRelations'])
      : rng.pick(['sspCommonMember', 'directSpeech', 'bspSign', 'sppClauses']);

  if (mode === 'sspCommonMember') {
    const target = rng.pick(SSP_COMMON_MEMBER);
    const homTrap = rng.pick(SIMPLE_WITH_HOMOGENEOUS_VERBS);
    const plainSsps = rng.sample(PLAIN_SSP_NO_COMMON, 3);
    const { options, answer } = buildSingleOptions(
      rng,
      target.text,
      [homTrap.text, ...plainSsps.map((p) => p.text)]
    );
    return {
      stem: 'Укажите <b>сложносочинённое предложение с общим второстепенным членом</b> (знаки препинания не расставлены).',
      format: 'single',
      options,
      answer,
      explanation:
        `В предложении «${target.text}» две грамматические основы (${target.base1}; ${target.base2}), и к обеим относится общий второстепенный член «${target.common}». ` +
        `Предложение «${homTrap.text}» — ${homTrap.explain}, а остальные ССП не имеют общего второстепенного члена.`,
      difficulty,
      hint: 'Проверьте, что в предложении действительно две разные грамматические основы (а не однородные сказуемые при одном подлежащем) и начальное обстоятельство/дополнение относится к обеим частям.',
    };
  }

  if (mode === 'sspRelations') {
    const rels = [
      'одновременность явлений',
      'последовательность явлений',
      'противопоставление явлений',
      'чередование явлений',
      'исключение одного явления другим',
    ];
    const target = rng.pick(SSP_RELATIONS);
    const { options, answer } = buildSingleOptions(
      rng,
      target.rel,
      rels.filter((r) => r !== target.rel)
    );
    return {
      stem: `В предложении «${target.text}» указывается на`,
      format: 'single',
      options,
      answer,
      explanation: `${target.explain} — следовательно, выражается ${target.rel}.`,
      difficulty,
      hint: 'Определите группу союза (соединительный, противительный, разделительный) и вид глаголов-сказуемых.',
    };
  }

  if (mode === 'sppClauses') {
    const target = rng.pick(SPP_CLAUSES);
    const kinds = ['определительное', 'изъяснительное', 'причины', 'цели', 'уступки', 'условия', 'времени', 'следствия'];
    const { options, answer } = buildSingleOptions(
      rng,
      target.kind,
      kinds.filter((k) => k !== target.kind)
    );
    return {
      stem: `Определите вид придаточного предложения в сложноподчинённом предложении:<br>«${target.text}»`,
      format: 'single',
      options,
      answer,
      explanation: `Придаточное отвечает на вопрос <i>${target.q}</i> и является придаточным <b>${target.kind}</b> (${target.explain}).`,
      difficulty,
      hint: 'Задайте вопрос от главной части (или от существительного/указательного слова) к придаточной.',
    };
  }

  if (mode === 'bspSign') {
    const targetSign = rng.pick(['двоеточие', 'тире', 'запятая']);
    const target = rng.pick(BSP_SENTENCES.filter((s) => s.sign === targetSign));
    const dists = rng.sample(BSP_SENTENCES.filter((s) => s.sign !== targetSign), 4);
    const stripPunct = (s) => s.replace(/:\s/g, ' … ').replace(/\s—\s/g, ' … ').replace(/,\s/g, ' … ');
    const { options, answer } = buildSingleOptions(
      rng,
      stripPunct(target.text),
      dists.map((d) => stripPunct(d.text))
    );
    return {
      stem: `Укажите бессоюзное сложное предложение (БСП), в котором на месте пропуска ставится <b>${targetSign}</b>.`,
      format: 'single',
      options,
      answer,
      explanation: `В предложении «${target.text}» ставится ${targetSign}: ${target.explain}.`,
      difficulty,
      hint: 'Подставьте мысленно союз между частями: «потому что / а именно» (двоеточие), «когда / если / но / поэтому» (тире) или перечисление «и» (запятая).',
    };
  }

  // directSpeech
  const askError = rng.chance(0.45);
  const picks = rng.sample(DIRECT_SPEECH, 5);
  const target = picks[0];
  const { options, answer } = buildSingleOptions(
    rng,
    askError ? target.bad : target.ok,
    picks.slice(1).map((p) => (askError ? p.ok : p.bad))
  );
  return {
    stem: askError
      ? 'Укажите предложение с <b>пунктуационной ошибкой при прямой речи</b>.'
      : 'Укажите предложение с <b>правильно расставленными знаками препинания при прямой речи</b>.',
    format: 'single',
    options,
    answer,
    explanation: `${askError ? 'Ошибка допущена в выбранном варианте' : 'Знаки препинания расставлены верно'}: ${target.rule}.`,
    difficulty,
    hint: 'Проверьте расположение точки, вопросительного/восклицательного знака, запятой, двоеточия и тире относительно кавычек.',
  };
}

// ---------- Экспорт TaskTypes и SubjectModule ----------

export const taskTypes = [
  {
    id: 'ru.phonetics',
    subject: 'ru',
    title: 'Фонетика, слог и орфоэпия',
    topic: 'Фонетика и орфоэпия',
    format: 'single',
    weight: 1.2,
    generate: genPhonetics,
  },
  {
    id: 'ru.ortho-signs',
    subject: 'ru',
    title: 'Правописание Ъ, Ь и частиц НЕ/НИ',
    topic: 'Орфография',
    format: 'single',
    weight: 1.1,
    generate: genOrthoSigns,
  },
  {
    id: 'ru.ortho-roots-affixes',
    subject: 'ru',
    title: 'Орфография корней, приставок и Н/НН',
    topic: 'Орфография',
    format: 'single',
    weight: 1.1,
    generate: genOrthoRootsAffixes,
  },
  {
    id: 'ru.morphemics-wordform',
    subject: 'ru',
    title: 'Состав слова и словообразование',
    topic: 'Морфемика и словообразование',
    format: 'single',
    weight: 1.0,
    generate: genMorphemicsWordform,
  },
  {
    id: 'ru.lexics-norms',
    subject: 'ru',
    title: 'Лексика, паронимы и нормы речи',
    topic: 'Лексика и культура речи',
    format: 'single',
    weight: 1.0,
    generate: genLexicsNorms,
  },
  {
    id: 'ru.morph-noun-adj-num',
    subject: 'ru',
    title: 'Существительное, прилагательное, числительное',
    topic: 'Морфология',
    format: 'single',
    weight: 1.1,
    generate: genMorphNounAdjNum,
  },
  {
    id: 'ru.morph-pronoun-adverb',
    subject: 'ru',
    title: 'Местоимение и наречие',
    topic: 'Морфология',
    format: 'single',
    weight: 1.1,
    generate: genMorphPronounAdverb,
  },
  {
    id: 'ru.morph-verb',
    subject: 'ru',
    title: 'Глагол, причастие и деепричастие',
    topic: 'Морфология',
    format: 'single',
    weight: 1.2,
    generate: genMorphVerb,
  },
  {
    id: 'ru.morph-service',
    subject: 'ru',
    title: 'Служебные части речи и сравнение',
    topic: 'Морфология',
    format: 'single',
    weight: 1.2,
    generate: genMorphService,
  },
  {
    id: 'ru.syntax-word-phrase',
    subject: 'ru',
    title: 'Словосочетание, члены и роль инфинитива',
    topic: 'Синтаксис и пунктуация',
    format: 'single',
    weight: 1.2,
    generate: genSyntaxWordPhrase,
  },
  {
    id: 'ru.syntax-simple',
    subject: 'ru',
    title: 'Односоставные и осложнённые предложения',
    topic: 'Синтаксис и пунктуация',
    format: 'single',
    weight: 1.1,
    generate: genSyntaxSimple,
  },
  {
    id: 'ru.syntax-complex',
    subject: 'ru',
    title: 'Сложные предложения и чужая речь',
    topic: 'Синтаксис и пунктуация',
    format: 'single',
    weight: 1.2,
    generate: genSyntaxComplex,
  },
  {
    id: 'ru.reading-closed',
    subject: 'ru',
    title: 'Чтение текста (закрытые задания)',
    topic: 'Работа с текстом',
    format: 'single',
    weight: 1.0,
    generate: (rng, { difficulty }) => generateReadingClosedTask(rng, difficulty),
  },
  {
    id: 'ru.reading-open',
    subject: 'ru',
    title: 'Чтение текста (развёрнутые ответы)',
    topic: 'Работа с текстом',
    format: 'open',
    weight: 1.0,
    generate: (rng, { difficulty }) => generateReadingOpenTask(rng, difficulty),
  },
];

const TYPE_MAP = Object.fromEntries(taskTypes.map((tp) => [tp.id, tp]));

/**
 * Построить полный экзаменационный вариант из 30 заданий (40 первичных баллов)
 * в точном порядке и структуре выпускного экзамена DİM (№ 31–60).
 */
export function buildExam(rng) {
  const tasks = [];
  const usedStems = new Set();

  // 10 грамматических слотов (№ 31–40): сбалансированное покрытие всех тем программы
  const grammarSlotIds = [
    'ru.phonetics',
    rng.chance(0.55) ? 'ru.ortho-signs' : 'ru.ortho-roots-affixes',
    'ru.morphemics-wordform',
    'ru.lexics-norms',
    'ru.morph-noun-adj-num',
    'ru.morph-pronoun-adverb',
    'ru.morph-verb',
    rng.chance(0.55) ? 'ru.morph-service' : 'ru.ortho-roots-affixes',
    'ru.syntax-word-phrase',
    rng.chance(0.6) ? 'ru.syntax-complex' : 'ru.syntax-simple',
  ];
  // Если в слотах 1 и 7 оба раза выбрались бы разные — гарантируем отсутствие дубля типа:
  if (grammarSlotIds[1] === grammarSlotIds[7]) {
    grammarSlotIds[7] = 'ru.ortho-signs';
  }

  grammarSlotIds.forEach((typeId, slotIdx) => {
    const tp = TYPE_MAP[typeId];
    const diff = slotIdx === 0 || slotIdx === 3 ? rng.pick([1, 2]) : slotIdx >= 8 ? rng.pick([2, 3]) : rng.pick([1, 2, 3]);
    let task;
    for (let attempt = 0; attempt < 15; attempt++) {
      const childRng = rng.fork(`ru-exam-g-${slotIdx}-${attempt}`);
      const raw = tp.generate(childRng, { difficulty: diff });
      if (!usedStems.has(raw.stem)) {
        usedStems.add(raw.stem);
        task = finalizeTask(tp, childRng, raw);
        task.id = `${tp.id}#exam-${rng.seed}-${slotIdx}`;
        break;
      }
    }
    if (!task) {
      const fallbackRng = rng.fork(`ru-exam-g-fb-${slotIdx}`);
      task = finalizeTask(tp, fallbackRng, tp.generate(fallbackRng, { difficulty: 2 }));
      task.id = `${tp.id}#exam-${rng.seed}-${slotIdx}`;
    }
    tasks.push(task);
  });

  // Текст I (художественно-повествовательный, слоты 10–19 ↔ № 41–50)
  const litPassage = rng.pick(LIT_PASSAGES);
  const litClosedPool = rng.shuffle(['linkGap', 'insertGap', 'mainIdea', 'contradiction', 'composition', 'idiomSynonym', 'lexisWays', 'directFigurative']);
  const litClosedSlots = litClosedPool.slice(0, 5);
  const litOpenSlots = ['t46', 't47', 't48', 't49', 't50'];

  litClosedSlots.forEach((slotName, i) => {
    const tp = TYPE_MAP['ru.reading-closed'];
    const childRng = rng.fork(`ru-exam-lit-c-${i}`);
    const raw = generateReadingClosedTask(childRng, i < 2 ? 1 : i < 4 ? 2 : 3, litPassage, slotName);
    const task = finalizeTask(tp, childRng, raw);
    task.id = `${tp.id}#exam-${rng.seed}-lit-c-${i}`;
    usedStems.add(task.stem);
    tasks.push(task);
  });

  litOpenSlots.forEach((slotName, i) => {
    const tp = TYPE_MAP['ru.reading-open'];
    const childRng = rng.fork(`ru-exam-lit-o-${i}`);
    const raw = generateReadingOpenTask(childRng, i === 4 ? 2 : 3, litPassage, slotName);
    const task = finalizeTask(tp, childRng, raw);
    task.id = `${tp.id}#exam-${rng.seed}-lit-o-${i}`;
    usedStems.add(task.stem);
    tasks.push(task);
  });

  // Текст II (публицистический / культурно-исторический, слоты 20–29 ↔ № 51–60)
  const pubPassage = rng.pick(PUB_PASSAGES);
  const pubClosedPool = rng.shuffle(['linkGap', 'insertGap', 'mainIdea', 'contradiction', 'composition', 'wordMatch', 'lexisWays', 'directFigurative']);
  const pubClosedSlots = pubClosedPool.slice(0, 5);
  const pubOpenSlots = ['t56', 't57', 't58', 't59', 't60'];

  pubClosedSlots.forEach((slotName, i) => {
    const tp = TYPE_MAP['ru.reading-closed'];
    const childRng = rng.fork(`ru-exam-pub-c-${i}`);
    const raw = generateReadingClosedTask(childRng, i < 2 ? 1 : i < 4 ? 2 : 3, pubPassage, slotName);
    const task = finalizeTask(tp, childRng, raw);
    task.id = `${tp.id}#exam-${rng.seed}-pub-c-${i}`;
    usedStems.add(task.stem);
    tasks.push(task);
  });

  pubOpenSlots.forEach((slotName, i) => {
    const tp = TYPE_MAP['ru.reading-open'];
    const childRng = rng.fork(`ru-exam-pub-o-${i}`);
    const raw = generateReadingOpenTask(childRng, i === 1 ? 2 : 3, pubPassage, slotName);
    const task = finalizeTask(tp, childRng, raw);
    task.id = `${tp.id}#exam-${rng.seed}-pub-o-${i}`;
    usedStems.add(task.stem);
    tasks.push(task);
  });

  return tasks;
}

export default {
  id: 'ru',
  title: 'Русский язык',
  taskTypes,
  buildExam,
  exam: {
    durationMin: 60,
    maxPoints: 100,
    sections: [
      { title: 'Языковые нормы и грамматика (№ 31–40)', from: 0, to: 9 },
      { title: 'Текст I — чтение и анализ (№ 41–50)', from: 10, to: 19 },
      { title: 'Текст II — чтение и анализ (№ 51–60)', from: 20, to: 29 },
    ],
    intro:
      '<p>Экзаменационный вариант по предмету <b>«Русский язык»</b> (язык обучения, 11 класс, DİM / ГЭЦ): <b>30 заданий</b> на <b>60 минут</b>. ' +
      'Задания № 1–10 (в буклете № 31–40) проверяют языковые нормы (1 балл); далее следуют два текста по 10 заданий каждый: 5 закрытых (по 1 баллу) и 5 открытых письменных (по 2 балла). ' +
      'Максимум — <b>40</b> первичных баллов, перевод в 100-балльную шкалу: <b>× 2,5</b>. Штрафа за ошибки нет.</p>',
  },
  originals: () => loadOriginals('ru'),
  score(_tasks, earned) {
    const raw = earned.reduce((sum, v) => sum + (Number(v) || 0), 0);
    const scaled = Math.round(raw * 2.5 * 10) / 10;
    return {
      score: Math.min(100, Math.max(0, scaled)),
      max: 100,
      label: `100-балльная шкала DİM (сырой балл ${Math.round(raw * 100) / 100} × 2,5)`,
    };
  },
};
