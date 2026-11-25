// Real-time Student Solving Telemetry & AI Tutor Context Builder.
// Aggregates per-task duration, speed vs. accuracy, slowest topics, error hotspots,
// per-format pace, and recent solving trajectory for BOTH Stats visualizations and AI chat.

import { SUBJECTS_META } from '../subjects/index.js';

const SUBJECT_NAMES = {
  ru: {
    math: 'Математика',
    ru: 'Русский язык',
    en: 'Английский язык',
    az: 'Азербайджанский язык',
    physics: 'Физика',
    chemistry: 'Химия',
    biology: 'Биология',
    history: 'История',
    geography: 'География',
    informatics: 'Информатика',
  },
  az: {
    math: 'Riyaziyyat',
    ru: 'Rus dili',
    en: 'İngilis dili',
    az: 'Azərbaycan dili',
    physics: 'Fizika',
    chemistry: 'Kimya',
    biology: 'Biologiya',
    history: 'Tarix',
    geography: 'Coğrafiya',
    informatics: 'İnformatika',
  },
};

const FORMAT_ORDER = ['single', 'multi', 'short', 'match', 'order', 'open'];

function stripHtmlPlain(html, maxLen = 140) {
  const plain = String(html ?? '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (plain.length <= maxLen) return plain;
  return `${plain.slice(0, maxLen).trim()}…`;
}

/**
 * Format a single-task or average duration in seconds compactly (`42 с` / `1 м 24 с`).
 * @param {number} seconds
 * @param {'ru'|'az'} [lang='ru']
 */
export function formatDurationShort(seconds, lang = 'ru') {
  const s = Math.round(Number(seconds) || 0);
  if (s <= 0) return '—';
  const unitS = lang === 'az' ? 'san' : 'с';
  const unitM = lang === 'az' ? 'dəq' : 'м';
  if (s < 60) return `${s}\u00A0${unitS}`;
  const m = Math.floor(s / 60);
  const rem = s % 60;
  return rem > 0 ? `${m}\u00A0${unitM} ${rem}\u00A0${unitS}` : `${m}\u00A0${unitM}`;
}

/**
 * Format total accumulated study time (`0 с` / `48 с` / `12 мин` / `1 ч 25 мин`).
 * @param {number} totalSeconds
 * @param {'ru'|'az'} [lang='ru']
 */
export function formatStudyTime(totalSeconds, lang = 'ru') {
  const s = Math.round(Number(totalSeconds) || 0);
  const unitS = lang === 'az' ? 'san' : 'с';
  const unitM = lang === 'az' ? 'dəq' : 'мин';
  const unitH = lang === 'az' ? 'saat' : 'ч';
  if (s <= 0) return `0 ${unitS}`;
  if (s < 60) return `${s} ${unitS}`;
  const totalMin = Math.floor(s / 60);
  const remSec = s % 60;
  if (totalMin < 60) {
    return remSec > 0 && totalMin < 10
      ? `${totalMin} ${unitM} ${remSec} ${unitS}`
      : `${totalMin} ${unitM}`;
  }
  const hrs = Math.floor(totalMin / 60);
  const remMin = totalMin % 60;
  return remMin > 0 ? `${hrs} ${unitH} ${remMin} ${unitM}` : `${hrs} ${unitH}`;
}

/**
 * Compute comprehensive live solving, error & timing analytics from persisted state.
 * Shared single source of truth between `#/stats` visualizations and `#/ai` live context.
 */
export function buildStudentTelemetrySnapshot(state) {
  const stats = state?.stats || {};
  const timing = state?.timing || {};
  const bySubjectStats = stats.bySubject || {};
  const byTopicStats = stats.byTopic || {};
  const bySubjectTiming = timing.bySubject || {};
  const byTopicTiming = timing.byTopic || {};
  const byFormatTiming = timing.byFormat || {};
  const mistakesObj = state?.mistakes || {};
  const allMistakes = Object.values(mistakesObj);
  const activeMistakes = allMistakes.filter((m) => !m.resolved);
  const resolvedMistakes = allMistakes.filter((m) => m.resolved);
  const recentAttempts = Array.isArray(state?.recentAttempts) ? state.recentAttempts : [];
  const exams = Array.isArray(state?.exams) ? state.exams : [];

  const attempted = Number(stats.totalAttempted || 0);
  const correct = Number(stats.totalCorrect || 0);
  const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;

  // Overall timing aggregates
  const totalSec = Number(timing.totalSec || 0);
  const totalTimedAttempts = Number(timing.totalTimedAttempts || 0);
  const avgSec = totalTimedAttempts > 0 ? Math.round(totalSec / totalTimedAttempts) : 0;

  let correctSecSum = 0;
  let correctCountSum = 0;
  let wrongSecSum = 0;
  let wrongCountSum = 0;
  for (const tSubj of Object.values(bySubjectTiming)) {
    correctSecSum += Number(tSubj?.correctSec || 0);
    correctCountSum += Number(tSubj?.correctCount || 0);
    wrongSecSum += Number(tSubj?.wrongSec || 0);
    wrongCountSum += Number(tSubj?.wrongCount || 0);
  }
  const correctAvgSec = correctCountSum > 0 ? Math.round(correctSecSum / correctCountSum) : 0;
  const wrongAvgSec = wrongCountSum > 0 ? Math.round(wrongSecSum / wrongCountSum) : 0;

  // Median duration from recent timed attempts
  const timedDurations = recentAttempts
    .map((a) => Number(a?.durationSec || 0))
    .filter((d) => d > 0)
    .sort((a, b) => a - b);
  let medianSec = avgSec;
  if (timedDurations.length > 0) {
    const mid = Math.floor(timedDurations.length / 2);
    medianSec = timedDurations.length % 2 === 1
      ? timedDurations[mid]
      : Math.round((timedDurations[mid - 1] + timedDurations[mid]) / 2);
  }

  // Active mistakes map per subject & per topic
  const activeMistakesBySubj = {};
  const activeMistakesByTopic = {};
  for (const m of activeMistakes) {
    const sid = m?.task?.subject || 'math';
    const topKey = `${sid}::${m?.task?.topic || 'Общее'}`;
    activeMistakesBySubj[sid] = (activeMistakesBySubj[sid] || 0) + 1;
    activeMistakesByTopic[topKey] = (activeMistakesByTopic[topKey] || 0) + 1;
  }

  // Per-subject unified rows (all 4 DİM subjects)
  const subjects = SUBJECTS_META.map((meta) => {
    const sb = bySubjectStats[meta.id] || { attempted: 0, correct: 0, earned: 0, max: 0 };
    const tb = bySubjectTiming[meta.id] || {
      totalSec: 0,
      count: 0,
      correctSec: 0,
      correctCount: 0,
      wrongSec: 0,
      wrongCount: 0,
    };
    const subAcc = sb.attempted > 0 ? Math.round((sb.correct / sb.attempted) * 100) : 0;
    const subAvgSec = tb.count > 0 ? Math.round(tb.totalSec / tb.count) : 0;
    const subCorrectAvg = tb.correctCount > 0 ? Math.round(tb.correctSec / tb.correctCount) : 0;
    const subWrongAvg = tb.wrongCount > 0 ? Math.round(tb.wrongSec / tb.wrongCount) : 0;
    return {
      id: meta.id,
      icon: meta.icon,
      attempted: Number(sb.attempted || 0),
      correct: Number(sb.correct || 0),
      accuracy: subAcc,
      activeMistakes: activeMistakesBySubj[meta.id] || 0,
      totalSec: Number(tb.totalSec || 0),
      timedCount: Number(tb.count || 0),
      avgSec: subAvgSec,
      correctAvgSec: subCorrectAvg,
      wrongAvgSec: subWrongAvg,
    };
  });

  // Slowest topics (sorted by avgSec descending)
  const slowestTopics = Object.entries(byTopicTiming)
    .map(([key, tb]) => {
      const count = Number(tb?.count || 0);
      const tSec = Number(tb?.totalSec || 0);
      const avg = count > 0 ? Math.round(tSec / count) : 0;
      const stTopic = byTopicStats[key];
      const acc = stTopic && stTopic.attempted > 0
        ? Math.round((stTopic.correct / stTopic.attempted) * 100)
        : null;
      return {
        key,
        subject: tb.subject || key.split('::')[0] || 'math',
        topic: tb.topic || key.split('::')[1] || 'Общее',
        totalSec: tSec,
        count,
        avgSec: avg,
        maxSec: Number(tb?.maxSec || avg),
        accuracy: acc,
        activeMistakes: activeMistakesByTopic[key] || 0,
      };
    })
    .filter((row) => row.count > 0 && row.avgSec > 0)
    .sort((a, b) => b.avgSec - a.avgSec || b.totalSec - a.totalSec)
    .slice(0, 6);

  // Weakest / error-prone topics (sorted by lowest accuracy, then most active mistakes)
  const weakestTopics = Object.entries(byTopicStats)
    .map(([key, tb]) => {
      const att = Number(tb?.attempted || 0);
      const cor = Number(tb?.correct || 0);
      const acc = att > 0 ? Math.round((cor / att) * 100) : 0;
      const tm = byTopicTiming[key];
      const avg = tm && tm.count > 0 ? Math.round(tm.totalSec / tm.count) : 0;
      return {
        key,
        subject: tb.subject || key.split('::')[0] || 'math',
        topic: tb.topic || key.split('::')[1] || 'Общее',
        attempted: att,
        correct: cor,
        wrong: Math.max(0, att - cor),
        accuracy: acc,
        avgSec: avg,
        activeMistakes: activeMistakesByTopic[key] || 0,
      };
    })
    .filter((row) => row.attempted > 0)
    .sort((a, b) => a.accuracy - b.accuracy || b.activeMistakes - a.activeMistakes || b.wrong - a.wrong)
    .slice(0, 6);

  // Per-format timing breakdown
  const formats = FORMAT_ORDER
    .map((fmt) => {
      const f = byFormatTiming[fmt];
      const count = Number(f?.count || 0);
      const tSec = Number(f?.totalSec || 0);
      return {
        format: fmt,
        count,
        totalSec: tSec,
        avgSec: count > 0 ? Math.round(tSec / count) : 0,
      };
    })
    .filter((row) => row.count > 0);

  // Recent attempts trajectory (last 30, newest last)
  const recentTrajectory = recentAttempts.slice(-30).map((a) => ({
    at: Number(a?.at || 0),
    subject: a?.subject || 'math',
    topic: a?.topic || '',
    format: a?.format || 'single',
    correct: Boolean(a?.correct),
    durationSec: Number(a?.durationSec || 0),
    source: a?.source || 'generated',
  }));

  // Active mistakes sample (for AI tutor specificity)
  const activeMistakesList = [...activeMistakes]
    .sort((a, b) => (b.wrongCount || 1) - (a.wrongCount || 1) || (b.lastWrongAt || 0) - (a.lastWrongAt || 0))
    .slice(0, 8)
    .map((m) => ({
      subject: m.task?.subject || 'math',
      topic: m.task?.topic || '',
      format: m.task?.format || 'single',
      wrongCount: Number(m.wrongCount || 1),
      stemPreview: stripHtmlPlain(m.task?.stem, 120),
    }));

  const recentExams = exams.slice(0, 5).map((ex) => ({
    title: ex.title || ex.targetId || 'Exam',
    scaledScore: ex.scaledScore,
    scaledMax: ex.scaledMax,
    pct: ex.pct,
    elapsedSec: Number(ex.elapsedSec || 0),
    correct: ex.counts?.correct ?? 0,
    total: ex.counts?.total ?? 0,
  }));

  return {
    overall: {
      attempted,
      correct,
      wrong: Math.max(0, attempted - correct),
      accuracy,
      activeMistakes: activeMistakes.length,
      resolvedMistakes: resolvedMistakes.length,
      examsCount: exams.length,
      streakDays: Number(state?.streak?.days || 0),
      todayCount: Number(state?.streak?.todayCount || 0),
      totalSec,
      totalTimedAttempts,
      avgSec,
      medianSec,
      correctAvgSec,
      wrongAvgSec,
    },
    subjects,
    slowestTopics,
    weakestTopics,
    formats,
    recentTrajectory,
    activeMistakesList,
    recentExams,
  };
}

/**
 * Build the AI Tutor system prompt with official DİM 11th-grade rules, coaching style,
 * live student telemetry (solving accuracy, mistakes, per-topic/subject/format time),
 * and optional active task context when invoked from a checked question.
 */
export function buildAiSystemPrompt(state, lang = 'ru', opts = {}) {
  const {
    style = 'coach',
    shareTelemetry = true,
    taskContext = null,
  } = opts;
  const isAz = lang === 'az';
  const subjMap = isAz ? SUBJECT_NAMES.az : SUBJECT_NAMES.ru;

  const styleDirective = isAz
    ? (style === 'strict'
      ? 'Üslub: tələbkar DİM eksperti. Zəif nöqtələri, vaxt itkilərini və meyar üzrə bal kəsilmə səbəblərini birbaşa göstər.'
      : style === 'concise'
      ? 'Üslub: qısa və konkret. Bəndlərlə, düsturlarla və artıq giriş olmadan cavab ver.'
      : 'Üslub: dəstəkləyici şəxsi repetitor. Addım-addım izah et, konkret məşq planı təklif et.')
    : (style === 'strict'
      ? 'Стиль: строгий эксперт ДИМ. Прямо указывай пробелы, потери времени и за что снимут баллы по критериям.'
      : style === 'concise'
      ? 'Стиль: предельно кратко и по делу. Тезисы, формулы и конкретные шаги без воды.'
      : 'Стиль: внимательный персональный репетитор. Объясняй шаг за шагом, хвали прогресс и давай чёткий план.');

  const lines = [];
  if (isAz) {
    lines.push(
      'Sən Ulduz tətbiqinin daxili süni intellekt repetitorusan — Azərbaycan DİM 11-ci sinif Buraxılış (Attestat) imtahanına hazırlıq üzrə mütəxəssissən.',
      'Rəsmi DİM qaydaları: Riyaziyyat (25 tapşırıq, maks 32 ilkin / 100 bal), Azərbaycan və Rus dili (30 tapşırıq, maks 40 ilkin / 100 bal), İngilis dili (30 tapşırıq, maks 37 ilkin / 100 bal), səhv cavaba cərimə yoxdur.',
      styleDirective,
      'Cavabları Azərbaycan dilində ver. Riyazi düsturları KaTeX formatında $...$ və $$...$$ ilə yaz. Statistikada olmayan rəqəmləri uydurma.'
    );
  } else {
    lines.push(
      'Ты — встроенный ИИ-наставник приложения Ulduz по подготовке к выпускному экзамену ГЭЦ Азербайджана (DİM Buraxılış / Аттестат, 11 класс).',
      'Официальные правила DİM: Математика (25 заданий, макс 32 первичных / 100 баллов), Русский и Азербайджанский языки (30 заданий, макс 40 первичных / 100 баллов), Английский язык (30 заданий, макс 37 первичных / 100 баллов), штрафов за ошибки нет.',
      styleDirective,
      'Отвечай на русском языке. Математические формулы пиши в LaTeX ($...$ и $$...$$). Опирайся только на реальные данные ученика ниже и не выдумывай статистику.'
    );
  }

  if (shareTelemetry && state) {
    const snap = buildStudentTelemetrySnapshot(state);
    const o = snap.overall;
    lines.push('');
    lines.push(isAz ? '[ŞAGİRDİN CANLI TELEMETRİYASI]' : '[АКТУАЛЬНАЯ СТАТИСТИКА И ТАЙМИНГ УЧЕНИКА]');

    if (o.attempted === 0 && o.examsCount === 0) {
      lines.push(
        isAz
          ? 'Şagird hələ tapşırıq həll etməyib (0 cəhd). Diaqnostik məşq və ya sınaq imtahanından başlamağı təklif et.'
          : 'Ученик ещё не решил ни одного задания (0 попыток). Предложи начать с короткой диагностики или пробного варианта.'
      );
    } else {
      lines.push(
        isAz
          ? `Ümumi: ${o.attempted} tapşırıq (${o.correct} doğru, dəqiqlik ${o.accuracy}%), aktiv səhvlər: ${o.activeMistakes} (düzəldilib: ${o.resolvedMistakes}), imtahanlar: ${o.examsCount}, ardıcıl gün: ${o.streakDays} (bu gün: ${o.todayCount}).`
          : `Всего решено: ${o.attempted} (верно: ${o.correct}, точность: ${o.accuracy}%), активных ошибок: ${o.activeMistakes} (исправлено: ${o.resolvedMistakes}), экзаменов: ${o.examsCount}, серия дней: ${o.streakDays} (сегодня: ${o.todayCount}).`
      );
      if (o.totalTimedAttempts > 0) {
        lines.push(
          isAz
            ? `Vaxt: cəmi ${formatStudyTime(o.totalSec, 'az')} (${o.totalTimedAttempts} ölçülən tapşırıq), orta sürət ${formatDurationShort(o.avgSec, 'az')}, median ${formatDurationShort(o.medianSec, 'az')}, doğru cavab orta ${formatDurationShort(o.correctAvgSec, 'az')}, səhv cavab orta ${formatDurationShort(o.wrongAvgSec, 'az')}.`
            : `Время решения: всего ${formatStudyTime(o.totalSec, 'ru')} (${o.totalTimedAttempts} замеров), среднее на задачу ${formatDurationShort(o.avgSec, 'ru')}, медиана ${formatDurationShort(o.medianSec, 'ru')}, на верный ответ ${formatDurationShort(o.correctAvgSec, 'ru')}, на ошибочный ${formatDurationShort(o.wrongAvgSec, 'ru')}.`
        );
      }

      const activeSubjects = snap.subjects.filter((s) => s.attempted > 0 || s.timedCount > 0);
      if (activeSubjects.length > 0) {
        lines.push(isAz ? 'Fənlər üzrə:' : 'По предметам:');
        for (const s of activeSubjects) {
          const timePart = s.timedCount > 0
            ? (isAz ? `, orta ${formatDurationShort(s.avgSec, 'az')}, cəmi ${formatStudyTime(s.totalSec, 'az')}` : `, ср. ${formatDurationShort(s.avgSec, 'ru')}, всего ${formatStudyTime(s.totalSec, 'ru')}`)
            : '';
          lines.push(`- ${subjMap[s.id] || s.id}: ${s.correct}/${s.attempted} (${s.accuracy}%), ${isAz ? 'səhv' : 'ошибок'}: ${s.activeMistakes}${timePart}`);
        }
      }

      if (snap.weakestTopics.length > 0) {
        lines.push(isAz ? 'Ən zəif mövzular (səhv zonaları):' : 'Слабые темы (зоны ошибок):');
        for (const tp of snap.weakestTopics.slice(0, 5)) {
          const tStr = tp.avgSec > 0 ? `, ${isAz ? 'orta' : 'ср.'} ${formatDurationShort(tp.avgSec, lang)}` : '';
          lines.push(`- ${subjMap[tp.subject] || tp.subject} / ${tp.topic}: ${tp.accuracy}% (${tp.correct}/${tp.attempted}, ${isAz ? 'aktiv səhv' : 'акт. ошибок'}: ${tp.activeMistakes}${tStr})`);
        }
      }

      if (snap.slowestTopics.length > 0) {
        lines.push(isAz ? 'Ən çox vaxt aparan mövzular:' : 'Самые медленные темы (по среднему времени):');
        for (const tp of snap.slowestTopics.slice(0, 5)) {
          const accStr = tp.accuracy !== null ? `, ${isAz ? 'dəqiqlik' : 'точность'} ${tp.accuracy}%` : '';
          lines.push(`- ${subjMap[tp.subject] || tp.subject} / ${tp.topic}: ${formatDurationShort(tp.avgSec, lang)} (${tp.count} ${isAz ? 'cəhd' : 'реш.'}, ${isAz ? 'maks' : 'макс'} ${formatDurationShort(tp.maxSec, lang)}${accStr})`);
        }
      }

      if (snap.formats.length > 0) {
        const fmtSummary = snap.formats
          .map((f) => `${f.format}: ${formatDurationShort(f.avgSec, lang)} (${f.count})`)
          .join('; ');
        lines.push(`${isAz ? 'Formatlar üzrə sürət' : 'Скорость по форматам'}: ${fmtSummary}`);
      }

      if (snap.activeMistakesList.length > 0) {
        lines.push(isAz ? 'Son aktiv səhvlər:' : 'Последние активные ошибки:');
        for (const m of snap.activeMistakesList.slice(0, 5)) {
          lines.push(`- [${subjMap[m.subject] || m.subject} · ${m.topic}] (×${m.wrongCount}): ${m.stemPreview}`);
        }
      }

      if (snap.recentExams.length > 0) {
        lines.push(isAz ? 'Son imtahanlar:' : 'Последние экзамены:');
        for (const ex of snap.recentExams.slice(0, 3)) {
          lines.push(`- ${ex.title}: ${ex.scaledScore}/${ex.scaledMax} (${ex.pct}%), ${formatStudyTime(ex.elapsedSec, lang)}`);
        }
      }
    }
  }

  if (taskContext && taskContext.stem) {
    lines.push('');
    lines.push(isAz ? '[HAZIRKI TAPŞIRIQ KONTEKSTİ]' : '[КОНТЕКСТ ТЕКУЩЕЙ ЗАДАЧИ]');
    lines.push(`${isAz ? 'Fənn' : 'Предмет'}: ${subjMap[taskContext.subject] || taskContext.subject || ''} · ${taskContext.topic || ''}`);
    lines.push(`${isAz ? 'Şərt' : 'Условие'}: ${stripHtmlPlain(taskContext.stem, 420)}`);
    if (taskContext.userAnswer) {
      lines.push(`${isAz ? 'Şagirdin cavabı' : 'Ответ ученика'}: ${stripHtmlPlain(taskContext.userAnswer, 180)}`);
    }
    if (taskContext.canonicalAnswer) {
      lines.push(`${isAz ? 'Doğru cavab' : 'Правильный ответ'}: ${stripHtmlPlain(taskContext.canonicalAnswer, 220)}`);
    }
    if (taskContext.durationSec > 0) {
      lines.push(`${isAz ? 'Sərf olunan vaxt' : 'Затраченное время'}: ${formatDurationShort(taskContext.durationSec, lang)}`);
    }
    if (taskContext.explanation) {
      lines.push(`${isAz ? 'Tətbiqdəki izah' : 'Разбор в тренажёре'}: ${stripHtmlPlain(taskContext.explanation, 360)}`);
    }
  }

  return lines.join('\n');
}
