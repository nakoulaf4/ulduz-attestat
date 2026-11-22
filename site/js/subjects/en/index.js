// English SubjectModule (id: 'en') for Ulduz — Azerbaijani DİM Attestat (11th-grade Buraxılış).

import { finalizeTask, loadOriginals } from '../../core/contract.js';
import { LISTENING_PASSAGES } from './banks/listening-passages.js';
import { READING_PASSAGES } from './banks/reading-passages.js';
import {
  makeListeningPassage,
  generateListeningTrue,
  generateListeningMain,
  generateListeningMulti,
  generateListeningQa,
  generateListeningAdj,
} from './generators/listening.js';
import {
  makeReadingPassage,
  generateReadingTrue,
  generateReadingComplete,
  generateReadingDetail,
  generateReadingMain,
  generateReadingDefinition,
  generateReadingSynonym,
  generateReadingParaphrase,
  generateReadingOpinion,
} from './generators/reading.js';
import {
  generateTenses,
  generatePassive,
  generateModals,
  generateNonfinite,
  generateConditionals,
  generateReported,
  generateNouns,
  generateArticles,
  generatePronouns,
  generateQuantifiers,
  generateAdjectivesAdverbs,
  generatePrepositions,
  generateQuestions,
  generateSubordinateClauses,
  generateWordOrder,
  generateSentenceOrder,
  generateConjunctions,
  generateAgreement,
} from './generators/grammar.js';
import {
  generateVocabDefinitions,
  generateVocabMatch,
  generateVocabAntonyms,
  generateVocabContext,
  generateWordFormation,
  generateDialogues,
} from './generators/vocab.js';

export const taskTypes = [
  // 1. Listening / Text I (Positions 1–6)
  {
    id: 'en.listening-true',
    subject: 'en',
    title: 'Верное утверждение по тексту (Аудирование)',
    topic: 'Аудирование',
    format: 'single',
    weight: 1,
    generate: (rng, { difficulty = 2 } = {}) => generateListeningTrue(rng, difficulty),
  },
  {
    id: 'en.listening-main',
    subject: 'en',
    title: 'Основная идея текста (Аудирование)',
    topic: 'Аудирование',
    format: 'single',
    weight: 1,
    generate: (rng, { difficulty = 2 } = {}) => generateListeningMain(rng, difficulty),
  },
  {
    id: 'en.listening-multi',
    subject: 'en',
    title: 'Завершение фразы: 2 из 4 (Аудирование)',
    topic: 'Аудирование',
    format: 'single',
    weight: 1,
    generate: (rng, { difficulty = 2 } = {}) => generateListeningMulti(rng, difficulty),
  },
  {
    id: 'en.listening-qa',
    subject: 'en',
    title: 'Вопрос и дополнение по тексту (Аудирование)',
    topic: 'Аудирование',
    format: 'open',
    weight: 0.9,
    generate: (rng, { difficulty = 2 } = {}) => generateListeningQa(rng, difficulty),
  },
  {
    id: 'en.listening-adj',
    subject: 'en',
    title: 'Поиск прилагательного к слову (Аудирование)',
    topic: 'Аудирование',
    format: 'short',
    weight: 0.9,
    generate: (rng, { difficulty = 1 } = {}) => generateListeningAdj(rng, difficulty),
  },

  // 2. Verb & Clause Grammar
  {
    id: 'en.tenses',
    subject: 'en',
    title: 'Времена глагола и согласование',
    topic: 'Глагол и времена',
    format: 'single',
    weight: 1.3,
    generate: (rng, { difficulty = 2 } = {}) => generateTenses(rng, difficulty),
  },
  {
    id: 'en.passive',
    subject: 'en',
    title: 'Страдательный залог (Passive Voice)',
    topic: 'Глагол и времена',
    format: 'single',
    weight: 1.2,
    generate: (rng, { difficulty = 2 } = {}) => generatePassive(rng, difficulty),
  },
  {
    id: 'en.modals',
    subject: 'en',
    title: 'Модальные глаголы',
    topic: 'Глагол и времена',
    format: 'single',
    weight: 1.1,
    generate: (rng, { difficulty = 2 } = {}) => generateModals(rng, difficulty),
  },
  {
    id: 'en.nonfinite',
    subject: 'en',
    title: 'Инфинитив, герундий и причастия',
    topic: 'Глагол и времена',
    format: 'single',
    weight: 1.1,
    generate: (rng, { difficulty = 2 } = {}) => generateNonfinite(rng, difficulty),
  },
  {
    id: 'en.conditionals',
    subject: 'en',
    title: 'Условные предложения и wish',
    topic: 'Глагол и времена',
    format: 'single',
    weight: 1,
    generate: (rng, { difficulty = 2 } = {}) => generateConditionals(rng, difficulty),
  },

  // 3. Nouns, Articles, Pronouns & Quantifiers
  {
    id: 'en.nouns',
    subject: 'en',
    title: 'Существительные, нумеративы и притяжательный падеж',
    topic: 'Существительные, артикли и местоимения',
    format: 'single',
    weight: 1.2,
    generate: (rng, { difficulty = 2 } = {}) => generateNouns(rng, difficulty),
  },
  {
    id: 'en.articles',
    subject: 'en',
    title: 'Артикли (a / an / the / –)',
    topic: 'Существительные, артикли и местоимения',
    format: 'single',
    weight: 1.2,
    generate: (rng, { difficulty = 2 } = {}) => generateArticles(rng, difficulty),
  },
  {
    id: 'en.pronouns',
    subject: 'en',
    title: 'Местоимения и их согласование',
    topic: 'Существительные, артикли и местоимения',
    format: 'single',
    weight: 1.1,
    generate: (rng, { difficulty = 2 } = {}) => generatePronouns(rng, difficulty),
  },
  {
    id: 'en.quantifiers',
    subject: 'en',
    title: 'Слова количества (much / many / few / little)',
    topic: 'Существительные, артикли и местоимения',
    format: 'single',
    weight: 1,
    generate: (rng, { difficulty = 2 } = {}) => generateQuantifiers(rng, difficulty),
  },

  // 4. Adjectives, Adverbs & Prepositions
  {
    id: 'en.adjectives-adverbs',
    subject: 'en',
    title: 'Степени сравнения и прилагательное / наречие',
    topic: 'Прилагательные, наречия и предлоги',
    format: 'single',
    weight: 1.1,
    generate: (rng, { difficulty = 2 } = {}) => generateAdjectivesAdverbs(rng, difficulty),
  },
  {
    id: 'en.prepositions',
    subject: 'en',
    title: 'Предлоги времени, места и управления',
    topic: 'Прилагательные, наречия и предлоги',
    format: 'single',
    weight: 1.2,
    generate: (rng, { difficulty = 2 } = {}) => generatePrepositions(rng, difficulty),
  },

  // 5. Syntax & Sentence Structure
  {
    id: 'en.questions',
    subject: 'en',
    title: 'Вопросительные предложения и разделительные вопросы',
    topic: 'Синтаксис и структура',
    format: 'single',
    weight: 1.1,
    generate: (rng, { difficulty = 2 } = {}) => generateQuestions(rng, difficulty),
  },
  {
    id: 'en.subordinate-clauses',
    subject: 'en',
    title: 'Косвенные вопросы и придаточные дополнения',
    topic: 'Синтаксис и структура',
    format: 'single',
    weight: 1.1,
    generate: (rng, { difficulty = 2 } = {}) => generateSubordinateClauses(rng, difficulty),
  },
  {
    id: 'en.word-order',
    subject: 'en',
    title: 'Составление предложения (выбор варианта)',
    topic: 'Синтаксис и структура',
    format: 'single',
    weight: 1,
    generate: (rng, { difficulty = 2 } = {}) => generateWordOrder(rng, difficulty),
  },
  {
    id: 'en.sentence-order',
    subject: 'en',
    title: 'Сборка предложения (интерактивная перестановка)',
    topic: 'Синтаксис и структура',
    format: 'order',
    weight: 0.7,
    generate: (rng, { difficulty = 2 } = {}) => generateSentenceOrder(rng, difficulty),
  },
  {
    id: 'en.conjunctions',
    subject: 'en',
    title: 'Союзы и союзные слова',
    topic: 'Синтаксис и структура',
    format: 'single',
    weight: 1.1,
    generate: (rng, { difficulty = 2 } = {}) => generateConjunctions(rng, difficulty),
  },
  {
    id: 'en.agreement',
    subject: 'en',
    title: 'Краткие реплики (so/neither) и согласование подлежащего',
    topic: 'Синтаксис и структура',
    format: 'single',
    weight: 1,
    generate: (rng, { difficulty = 2 } = {}) => generateAgreement(rng, difficulty),
  },
  {
    id: 'en.reported-speech',
    subject: 'en',
    title: 'Косвенная речь (Reported Speech)',
    topic: 'Синтаксис и структура',
    format: 'single',
    weight: 1,
    generate: (rng, { difficulty = 2 } = {}) => generateReported(rng, difficulty),
  },

  // 6. Vocabulary, Word Formation & Functional Language
  {
    id: 'en.vocab-definitions',
    subject: 'en',
    title: 'Подбор слов к определениям (тест)',
    topic: 'Лексика и словообразование',
    format: 'single',
    weight: 1,
    generate: (rng, { difficulty = 2 } = {}) => generateVocabDefinitions(rng, difficulty),
  },
  {
    id: 'en.vocab-match',
    subject: 'en',
    title: 'Соотнесение слов и определений (интерактив)',
    topic: 'Лексика и словообразование',
    format: 'match',
    weight: 0.7,
    generate: (rng, { difficulty = 2 } = {}) => generateVocabMatch(rng, difficulty),
  },
  {
    id: 'en.vocab-antonyms',
    subject: 'en',
    title: 'Антонимы и синонимы',
    topic: 'Лексика и словообразование',
    format: 'single',
    weight: 1.1,
    generate: (rng, { difficulty = 2 } = {}) => generateVocabAntonyms(rng, difficulty),
  },
  {
    id: 'en.vocab-context',
    subject: 'en',
    title: 'Лексика и сочетаемость в контексте',
    topic: 'Лексика и словообразование',
    format: 'single',
    weight: 1,
    generate: (rng, { difficulty = 2 } = {}) => generateVocabContext(rng, difficulty),
  },
  {
    id: 'en.word-formation',
    subject: 'en',
    title: 'Словообразование (аффиксы)',
    topic: 'Лексика и словообразование',
    format: 'single',
    weight: 0.9,
    generate: (rng, { difficulty = 2 } = {}) => generateWordFormation(rng, difficulty),
  },
  {
    id: 'en.dialogues',
    subject: 'en',
    title: 'Диалоги и речевой этикет',
    topic: 'Функциональный язык',
    format: 'single',
    weight: 0.9,
    generate: (rng, { difficulty = 2 } = {}) => generateDialogues(rng, difficulty),
  },

  // 7. Reading Comprehension & Writing (Positions 23–30)
  {
    id: 'en.reading-true',
    subject: 'en',
    title: 'Верное утверждение по тексту (Чтение)',
    topic: 'Чтение',
    format: 'single',
    weight: 1,
    generate: (rng, { difficulty = 2 } = {}) => generateReadingTrue(rng, difficulty),
  },
  {
    id: 'en.reading-complete',
    subject: 'en',
    title: 'Завершение предложения по тексту (Чтение)',
    topic: 'Чтение',
    format: 'single',
    weight: 1,
    generate: (rng, { difficulty = 2 } = {}) => generateReadingComplete(rng, difficulty),
  },
  {
    id: 'en.reading-detail',
    subject: 'en',
    title: 'Детальный вопрос: 2 из 4 (Чтение)',
    topic: 'Чтение',
    format: 'single',
    weight: 1,
    generate: (rng, { difficulty = 2 } = {}) => generateReadingDetail(rng, difficulty),
  },
  {
    id: 'en.reading-main',
    subject: 'en',
    title: 'Основная тема текста (Чтение)',
    topic: 'Чтение',
    format: 'single',
    weight: 1,
    generate: (rng, { difficulty = 2 } = {}) => generateReadingMain(rng, difficulty),
  },
  {
    id: 'en.reading-definition',
    subject: 'en',
    title: 'Поиск слова по определению (Чтение)',
    topic: 'Чтение',
    format: 'short',
    weight: 0.9,
    generate: (rng, { difficulty = 2 } = {}) => generateReadingDefinition(rng, difficulty),
  },
  {
    id: 'en.reading-synonym',
    subject: 'en',
    title: 'Поиск синонима в абзаце (Чтение)',
    topic: 'Чтение',
    format: 'short',
    weight: 0.9,
    generate: (rng, { difficulty = 2 } = {}) => generateReadingSynonym(rng, difficulty),
  },
  {
    id: 'en.reading-paraphrase',
    subject: 'en',
    title: 'Перифраз концовки предложения (≥ 2 замен)',
    topic: 'Чтение',
    format: 'open',
    weight: 0.8,
    generate: (rng, { difficulty = 3 } = {}) => generateReadingParaphrase(rng, difficulty),
  },
  {
    id: 'en.reading-opinion',
    subject: 'en',
    title: 'Развёрнутое мнение (≥ 3 предложений)',
    topic: 'Чтение',
    format: 'open',
    weight: 0.8,
    generate: (rng, { difficulty = 3 } = {}) => generateReadingOpinion(rng, difficulty),
  },
];

const TYPE_MAP = Object.fromEntries(taskTypes.map((t) => [t.id, t]));

const MANDATORY_GRAMMAR_SLOTS = [
  'en.tenses',
  'en.passive',
  'en.modals',
  'en.nonfinite',
  'en.nouns',
  'en.articles',
  'en.pronouns',
  'en.adjectives-adverbs',
  'en.prepositions',
  'en.questions',
  'en.subordinate-clauses',
  'en.word-order',
  'en.conjunctions',
  'en.vocab-antonyms',
];

function stampExamTask(typeId, rng, task, examSeed, slotNumber) {
  const type = TYPE_MAP[typeId];
  task.id = `${typeId}#exam-${examSeed}-${slotNumber}`;
  return finalizeTask(type, rng, task);
}

export function buildExam(rng) {
  const examSeed = rng.seed;
  const tasks = [];
  const usedStems = new Set();

  // 1. Listening / Text I (Tasks 1–6)
  const listenRng = rng.fork('listening');
  const listenItem = listenRng.pick(LISTENING_PASSAGES);
  const listenPassage = makeListeningPassage(listenItem, `en-exam-listen-${examSeed}`);

  tasks.push(stampExamTask('en.listening-true', listenRng.fork('q1'), generateListeningTrue(listenRng.fork('q1'), 1, listenItem, listenPassage), examSeed, 1));
  const midOrder = listenRng.chance(0.5) ? ['en.listening-main', 'en.listening-multi'] : ['en.listening-multi', 'en.listening-main'];
  midOrder.forEach((tid, idx) => {
    const subRng = listenRng.fork(`q${idx + 2}`);
    const gen = tid === 'en.listening-main'
      ? generateListeningMain(subRng, 2, listenItem, listenPassage)
      : generateListeningMulti(subRng, 2, listenItem, listenPassage);
    tasks.push(stampExamTask(tid, subRng, gen, examSeed, idx + 2));
  });
  tasks.push(stampExamTask('en.listening-qa', listenRng.fork('q4'), generateListeningQa(listenRng.fork('q4'), 1, listenItem, listenPassage, 'question'), examSeed, 4));
  tasks.push(stampExamTask('en.listening-qa', listenRng.fork('q5'), generateListeningQa(listenRng.fork('q5'), 2, listenItem, listenPassage, 'complete'), examSeed, 5));
  tasks.push(stampExamTask('en.listening-adj', listenRng.fork('q6'), generateListeningAdj(listenRng.fork('q6'), 1, listenItem, listenPassage), examSeed, 6));

  tasks.forEach((t) => { if (t.stem) usedStems.add(t.stem); });

  // 2. Grammar & Vocabulary (Tasks 7–22 = 16 closed 1-pt tasks)
  const gramRng = rng.fork('grammar');
  const slot15 = gramRng.pick(['en.vocab-definitions', 'en.vocab-context']);
  const slot16 = gramRng.pick([
    'en.quantifiers',
    'en.agreement',
    'en.quantifiers',
    'en.agreement',
    'en.conditionals',
    'en.reported-speech',
    'en.word-formation',
    'en.dialogues',
  ]);
  const gramOrder = gramRng.shuffle([...MANDATORY_GRAMMAR_SLOTS, slot15, slot16]);

  gramOrder.forEach((typeId, idx) => {
    const type = TYPE_MAP[typeId];
    const diff = idx % 3 === 0 ? 1 : idx % 3 === 1 ? 2 : 3;
    let chosen = null;
    for (let attempt = 0; attempt < 8; attempt++) {
      const attemptRng = gramRng.fork(`g${idx}_${attempt}`);
      const candidate = type.generate(attemptRng, { difficulty: diff });
      if (!usedStems.has(candidate.stem)) {
        chosen = stampExamTask(typeId, attemptRng, candidate, examSeed, 7 + idx);
        break;
      }
    }
    if (!chosen) {
      const fallbackRng = gramRng.fork(`g${idx}_fb`);
      chosen = stampExamTask(typeId, fallbackRng, type.generate(fallbackRng, { difficulty: diff }), examSeed, 7 + idx);
    }
    usedStems.add(chosen.stem);
    tasks.push(chosen);
  });

  // 3. Reading / Text II (Tasks 23–30)
  const readRng = rng.fork('reading');
  const readItem = readRng.pick(READING_PASSAGES);
  const readPassage = makeReadingPassage(readItem, `en-exam-read-${examSeed}`);

  tasks.push(stampExamTask('en.reading-true', readRng.fork('r23'), generateReadingTrue(readRng.fork('r23'), 2, readItem, readPassage), examSeed, 23));
  tasks.push(stampExamTask('en.reading-complete', readRng.fork('r24'), generateReadingComplete(readRng.fork('r24'), 2, readItem, readPassage), examSeed, 24));
  tasks.push(stampExamTask('en.reading-detail', readRng.fork('r25'), generateReadingDetail(readRng.fork('r25'), 2, readItem, readPassage), examSeed, 25));
  tasks.push(stampExamTask('en.reading-main', readRng.fork('r26'), generateReadingMain(readRng.fork('r26'), 2, readItem, readPassage), examSeed, 26));
  tasks.push(stampExamTask('en.reading-definition', readRng.fork('r27'), generateReadingDefinition(readRng.fork('r27'), 2, readItem, readPassage), examSeed, 27));
  tasks.push(stampExamTask('en.reading-synonym', readRng.fork('r28'), generateReadingSynonym(readRng.fork('r28'), 2, readItem, readPassage), examSeed, 28));
  tasks.push(stampExamTask('en.reading-paraphrase', readRng.fork('r29'), generateReadingParaphrase(readRng.fork('r29'), 3, readItem, readPassage), examSeed, 29));
  tasks.push(stampExamTask('en.reading-opinion', readRng.fork('r30'), generateReadingOpinion(readRng.fork('r30'), 3, readItem, readPassage), examSeed, 30));

  return tasks;
}

export const exam = {
  durationMin: 60,
  maxPoints: 100,
  sections: [
    { title: 'Текст I / Аудирование (№1–6)', from: 0, to: 5 },
    { title: 'Лексика и грамматика (№7–22)', from: 6, to: 21 },
    { title: 'Текст II — чтение и письмо (№23–30)', from: 22, to: 29 },
  ],
  intro: '<p>Экзаменационный вариант по английскому языку (11-й класс, <b>DİM Buraxılış</b>): <b>30 заданий</b> на <b>60 минут</b>.</p><ul><li><b>№ 1–3, 7–26:</b> 23 закрытых тестовых задания с 5 вариантами ответа (по <b>1</b> баллу).</li><li><b>№ 4–6, 27–30:</b> 7 открытых/письменных заданий (вес <b>×2</b> = по <b>2</b> балла).</li><li><b>Официальная шкала ДИМ:</b> максимум <b>37</b> взвешенных баллов переводятся по формуле <code>round((raw / 37) × 100, 1)</code>; штрафов за ошибки нет.</li></ul>',
};

export function originals() {
  return loadOriginals('en');
}

export function score(tasks, earned) {
  const raw = earned.reduce((acc, v) => acc + (Number(v) || 0), 0);
  const rawMax = tasks.reduce((acc, t) => acc + (Number(t?.points) || 1), 0) || 37;
  const scaled = rawMax > 0 ? Math.round((raw / rawMax) * 100 * 10) / 10 : 0;
  const rawDisplay = Math.round(raw * 100) / 100;
  return {
    score: scaled,
    max: 100,
    label: `${rawDisplay}/${rawMax} взвеш. (${scaled}/100 ДИМ)`,
  };
}

export default {
  id: 'en',
  title: 'Английский язык',
  taskTypes,
  buildExam,
  exam,
  originals,
  score,
};
