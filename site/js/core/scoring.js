// Official DİM (ГЭЦ Азербайджана) Buraxılış / Attestat exam configuration & scoring.
// Aligns with 11th-grade (Tam orta təhsil səviyyəsi) Buraxılış exam rules.

import { checkAnswer } from './contract.js';

export const DEFAULT_EXAM_CONFIG = {
  math: {
    durationMin: 60,
    expectedTasks: 25,
    scaledMax: 100,
    passThreshold: 40,
    description: '25 заданий: 13 закрытых (1 балл), 5 открытых с кратким ответом (1 балл), 7 развёрнутых заданий (2 балла). Макс. первичный балл — 32, перевод в 100-балльную шкалу ДИМ (× 25/8).',
    sections: [
      { title: 'Закрытые тестовые задания (№61–73)', from: 0, to: 12 },
      { title: 'Краткий числовой ответ (№74–78)', from: 13, to: 17 },
      { title: 'Развёрнутые задания (№79–85)', from: 18, to: 24 },
    ],
  },
  ru: {
    durationMin: 60,
    expectedTasks: 30,
    scaledMax: 100,
    passThreshold: 40,
    description: '30 заданий (язык обучения): 10 по нормам языка (1 балл) + 2 текста по 10 заданий (5 закрытых × 1 б. + 5 развёрнутых × 2 б.). Макс. первичный балл — 40, шкала ДИМ × 2.5 = 100.',
    sections: [
      { title: 'Языковые нормы и грамматика (№31–40)', from: 0, to: 9 },
      { title: 'Текст I — чтение и анализ (№41–50)', from: 10, to: 19 },
      { title: 'Текст II — чтение и анализ (№51–60)', from: 20, to: 29 },
    ],
  },
  en: {
    durationMin: 60,
    expectedTasks: 30,
    scaledMax: 100,
    passThreshold: 40,
    description: '30 заданий: аудирование/текст I (№1–6: 3 закр. + 3 письм.), лексика и грамматика (№7–22: 16 закр.), чтение II (№23–30: 4 закр. + 4 письм.). Макс. первичный балл — 37, шкала ДИМ × 100/37 = 100.',
    sections: [
      { title: 'Текст I / Аудирование (№1–6)', from: 0, to: 5 },
      { title: 'Лексика и грамматика (№7–22)', from: 6, to: 21 },
      { title: 'Текст II — чтение (№23–30)', from: 22, to: 29 },
    ],
  },
  az: {
    durationMin: 60,
    expectedTasks: 30,
    scaledMax: 100,
    passThreshold: 40,
    description: '30 заданий (Azərbaycan dili — tədris dili): 10 по грамматике (1 балл) + 2 текста по 10 заданий (5 закрытых × 1 б. + 5 развёрнутых × 2 б.). Макс. первичный балл — 40, шкала ДИМ × 2.5 = 100. Примечание для русского сектора: отдельный экзамен по госязыку (dövlət dili kimi) длится 45 мин и требует зачёта ≥ 50 баллов.',
    sections: [
      { title: 'Лексика и грамматика (№31–40)', from: 0, to: 9 },
      { title: 'Текст I — чтение и анализ (№41–50)', from: 10, to: 19 },
      { title: 'Текст II — чтение и анализ (№51–60)', from: 20, to: 29 },
    ],
  },
  physics: {
    durationMin: 90,
    expectedTasks: 30,
    scaledMax: 100,
    passThreshold: 40,
    description: '30 заданий (Группа I ДИМ): 22 закрытых (1 балл), 5 кратких и на соответствие (1 балл), 3 развёрнутые расчётные задачи (2 балла). Макс. первичный балл — 33, шкала ДИМ 100 баллов.',
    sections: [
      { title: 'Закрытые задания (№1–22)', from: 0, to: 21 },
      { title: 'Краткий ответ и соответствие (№23–27)', from: 22, to: 26 },
      { title: 'Развёрнутые задачи (№28–30)', from: 27, to: 29 },
    ],
  },
  chemistry: {
    durationMin: 90,
    expectedTasks: 30,
    scaledMax: 100,
    passThreshold: 40,
    description: '30 заданий (Группы I и IV ДИМ): 22 закрытых (1 балл), 5 кратких и на соответствие (1 балл), 3 ситуационные/расчётные задачи (2 балла). Макс. первичный балл — 33, шкала ДИМ 100 баллов.',
    sections: [
      { title: 'Закрытые задания (№1–22)', from: 0, to: 21 },
      { title: 'Краткий ответ и соответствие (№23–27)', from: 22, to: 26 },
      { title: 'Развёрнутые задачи (№28–30)', from: 27, to: 29 },
    ],
  },
  biology: {
    durationMin: 90,
    expectedTasks: 30,
    scaledMax: 100,
    passThreshold: 40,
    description: '30 заданий (Группа IV ДИМ): 22 закрытых (1 балл), 5 задач по генетике, ДНК, соответствию и порядку (1 балл), 3 развёрнутые задачи (2 балла). Макс. первичный балл — 33, шкала ДИМ 100 баллов.',
    sections: [
      { title: 'Закрытые задания (№1–22)', from: 0, to: 21 },
      { title: 'Генетика, ДНК, порядок и соответствие (№23–27)', from: 22, to: 26 },
      { title: 'Развёрнутые ситуационные задачи (№28–30)', from: 27, to: 29 },
    ],
  },
  history: {
    durationMin: 90,
    expectedTasks: 30,
    scaledMax: 100,
    passThreshold: 40,
    description: '30 заданий (Группы II и III ДИМ): 22 закрытых по истории Азербайджана и мира (1 балл), 5 на хронологию, даты и соответствие (1 балл), 3 развёрнутых анализа источника (2 балла). Шкала ДИМ 100 баллов.',
    sections: [
      { title: 'История Азербайджана и мира (№1–22)', from: 0, to: 21 },
      { title: 'Хронология, даты и соответствие (№23–27)', from: 22, to: 26 },
      { title: 'Развёрнутый анализ источника (№28–30)', from: 27, to: 29 },
    ],
  },
  geography: {
    durationMin: 90,
    expectedTasks: 30,
    scaledMax: 100,
    passThreshold: 40,
    description: '30 заданий (Группа II ДИМ): 22 закрытых (1 балл), 5 расчётных задач на масштаб, давление, часовые пояса и соответствие (1 балл), 3 развёрнутые задачи по географии Азербайджана (2 балла). Шкала 100 баллов.',
    sections: [
      { title: 'Физическая и экономическая география (№1–22)', from: 0, to: 21 },
      { title: 'Масштаб, расчёты и соответствие (№23–27)', from: 22, to: 26 },
      { title: 'Развёрнутые задачи (№28–30)', from: 27, to: 29 },
    ],
  },
  informatics: {
    durationMin: 90,
    expectedTasks: 30,
    scaledMax: 100,
    passThreshold: 40,
    description: '30 заданий (Группа I RI ДИМ): 22 закрытых (1 балл), 5 на системы счисления, трассировку Python, логику и сети (1 балл), 3 развёрнутых алгоритмических задания (2 балла). Шкала 100 баллов.',
    sections: [
      { title: 'Теория, логика и сети (№1–22)', from: 0, to: 21 },
      { title: 'Системы счисления, Python и соответствие (№23–27)', from: 22, to: 26 },
      { title: 'Развёрнутые алгоритмические задачи (№28–30)', from: 27, to: 29 },
    ],
  },
};

/** Get exam metadata for a subject module, falling back to DEFAULT_EXAM_CONFIG. */
export function getExamConfig(subject) {
  const base = DEFAULT_EXAM_CONFIG[subject?.id] ?? {
    durationMin: 60,
    expectedTasks: 25,
    scaledMax: 100,
    passThreshold: 40,
    description: 'Экзаменационный вариант ДИМ по 100-балльной шкале.',
    sections: [],
  };
  return {
    ...base,
    ...(subject?.exam ?? {}),
  };
}

/** Grade label on the 100-point DİM scale (aligned with docs/research.md thresholds). */
export function getScoreGrade(scaledScore, passThreshold = 40) {
  if (scaledScore >= 85) {
    return {
      code: 'excellent',
      label: 'Отлично («5»)',
      badge: 'Высокий уровень',
      labelKey: 'gradeExcellentLabel',
      badgeKey: 'gradeExcellentBadge',
      color: 'correct',
    };
  }
  if (scaledScore >= 65) {
    return {
      code: 'good',
      label: 'Хорошо («4»)',
      badge: 'Уверенный результат',
      labelKey: 'gradeGoodLabel',
      badgeKey: 'gradeGoodBadge',
      color: 'primary',
    };
  }
  if (scaledScore >= passThreshold) {
    return {
      code: 'satisfactory',
      label: 'Удовлетворительно («3»)',
      badge: 'Базовая подготовка',
      labelKey: 'gradeSatisfactoryLabel',
      badgeKey: 'gradeSatisfactoryBadge',
      color: 'partial',
    };
  }
  if (scaledScore >= 10) {
    return {
      code: 'college-min',
      label: 'Порог ссуза пройден (≥ 10 б.)',
      badge: 'Нужно усилить подготовку',
      labelKey: 'gradeCollegeLabel',
      badgeKey: 'gradeCollegeBadge',
      color: 'partial',
    };
  }
  return {
    code: 'below',
    label: 'Ниже порога колледжа (< 10 б.)',
    badge: 'Требуется подготовка',
    labelKey: 'gradeBelowLabel',
    badgeKey: 'gradeBelowBadge',
    color: 'wrong',
  };
}

/**
 * Evaluate a full exam attempt.
 * Distinguishes open tasks with a written draft awaiting self-grading ('pending')
 * from truly untouched tasks ('unanswered').
 * @param {import('./contract.js').Task[]} tasks
 * @param {Record<string, any>} responses   map of task.id -> user response
 * @param {import('./contract.js').SubjectModule} [subject]
 */
export function evaluateExam(tasks, responses, subject) {
  const itemResults = [];
  const earnedList = [];
  let rawEarned = 0;
  let rawMax = 0;
  let correctCount = 0;
  let partialCount = 0;
  let wrongCount = 0;
  let unansweredCount = 0;
  let pendingCount = 0;
  let ungradedOpenCount = 0;

  const byTopic = new Map();

  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    const resp = responses[task.id];
    const isOpen = task.format === 'open';
    const hasOpenSelf = isOpen && typeof resp?.self === 'number' && !Number.isNaN(resp.self);
    const hasOpenDraft = isOpen && typeof resp?.text === 'string' && resp.text.trim().length > 0;
    const isPendingSelfGrade = isOpen && hasOpenDraft && !hasOpenSelf;

    if (isOpen && !hasOpenSelf) ungradedOpenCount++;

    const isMatchEmpty = task.format === 'match' && Array.isArray(resp) && resp.every((v) => !Number.isInteger(v) || v < 0);
    const isUnanswered = !isPendingSelfGrade && (
      resp === undefined ||
      resp === null ||
      resp === '' ||
      (Array.isArray(resp) && resp.length === 0) ||
      isMatchEmpty ||
      (isOpen && !hasOpenSelf)
    );

    const res = isPendingSelfGrade
      ? { correct: false, earned: 0, max: task.points ?? 1 }
      : checkAnswer(task, resp);

    rawEarned += res.earned;
    rawMax += res.max;
    earnedList.push(res.earned);

    let status = 'wrong';
    if (isPendingSelfGrade) {
      status = 'pending';
      pendingCount++;
    } else if (isUnanswered) {
      status = 'unanswered';
      unansweredCount++;
    } else if (res.correct) {
      status = 'correct';
      correctCount++;
    } else if (res.earned > 0) {
      status = 'partial';
      partialCount++;
    } else {
      status = 'wrong';
      wrongCount++;
    }

    itemResults.push({
      index: i,
      task,
      response: resp,
      status,
      correct: res.correct,
      earned: res.earned,
      max: res.max,
    });

    const topicKey = task.topic || 'Общий раздел';
    if (!byTopic.has(topicKey)) {
      byTopic.set(topicKey, {
        topic: topicKey,
        subject: task.subject,
        typeId: task.typeId,
        total: 0,
        correct: 0,
        earned: 0,
        max: 0,
      });
    }
    const tStat = byTopic.get(topicKey);
    tStat.total += 1;
    if (res.correct) tStat.correct += 1;
    tStat.earned = Math.round((tStat.earned + res.earned) * 100) / 100;
    tStat.max = Math.round((tStat.max + res.max) * 100) / 100;
  }

  rawEarned = Math.round(rawEarned * 100) / 100;
  rawMax = Math.round(rawMax * 100) / 100;

  let scaledScore = 0;
  let scaledMax = 100;
  let customLabel = null;
  let hasCustomScore = false;

  if (subject && typeof subject.score === 'function' && tasks.length > 0) {
    try {
      const custom = subject.score(tasks, earnedList);
      if (custom && typeof custom.score === 'number' && !Number.isNaN(custom.score)) {
        scaledScore = Math.round(custom.score * 10) / 10;
        scaledMax = custom.max ?? 100;
        customLabel = custom.label ?? null;
        hasCustomScore = true;
      }
    } catch (err) {
      console.warn('[ulduz] custom subject.score failed, using standard DİM formula:', err);
    }
  }

  if (!hasCustomScore && rawMax > 0) {
    // Official DİM scaling: raw points proportionally scaled to 100 (no penalty for wrong answers)
    scaledScore = Math.round((rawEarned / rawMax) * scaledMax * 10) / 10;
  }

  const pct = rawMax > 0 ? Math.round((rawEarned / rawMax) * 100) : 0;
  const cfg = getExamConfig(subject);
  const grade = getScoreGrade(scaledScore, cfg.passThreshold);

  const topicBreakdown = [...byTopic.values()].map((tb) => ({
    ...tb,
    pct: tb.max > 0 ? Math.round((tb.earned / tb.max) * 100) : 0,
  })).sort((a, b) => a.pct - b.pct);

  return {
    rawEarned,
    rawMax,
    scaledScore,
    scaledMax,
    pct,
    grade,
    customLabel,
    counts: {
      total: tasks.length,
      correct: correctCount,
      partial: partialCount,
      wrong: wrongCount,
      unanswered: unansweredCount,
      pending: pendingCount,
      ungradedOpen: ungradedOpenCount,
    },
    topicBreakdown,
    itemResults,
  };
}
