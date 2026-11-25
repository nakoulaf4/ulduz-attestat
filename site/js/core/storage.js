// Persistent user state in localStorage + crash-safe Tauri v2 Rust file sync.

import { isNativeApp, loadNativeProgress, saveNativeProgress } from './native.js';
import {
  DEFAULT_THEME_ID,
  normalizeThemeId,
  normalizeUnlockedList,
  isThemeUnlocked,
  evaluateThemeUnlocks,
  applyThemeToDocument,
  isPerfectFullExamSummary,
} from './themes.js';
import { DEFAULT_FX_MODE, normalizeFxMode } from '../app/fx-engine.js';

const STORAGE_KEY = 'ulduz_state_v1';
const NATIVE_SYNC_DEBOUNCE_MS = 400;
const MAX_RECENT_ATTEMPTS = 40;
const MAX_AI_CHAT_MESSAGES = 30;

export const DEFAULT_AI_SETTINGS = {
  provider: 'opencode', // 'opencode' | 'kilo' | 'custom'
  model: 'deepseek-v4.1-flash-free', // DeepSeek by default
  kiloModel: 'kilo-auto/free',
  opencodeApiKey: '',
  kiloApiKey: '',
  customBaseUrl: '',
  customApiKey: '',
  customModel: 'deepseek-chat',
  autoFallback: true,
  shareTelemetry: true,
  systemStyle: 'coach', // 'coach' | 'strict' | 'concise'
};

export const DEFAULT_SETTINGS = {
  autoUpdateCheck: true,
  haptics: true,
  showKeyHints: true,
  passageFontScale: 1,
  lastUpdateCheckAt: 0,
  dismissedUpdateVersion: '',
  ai: { ...DEFAULT_AI_SETTINGS },
};

function defaultTiming() {
  return {
    totalSec: 0,
    totalTimedAttempts: 0,
    bySubject: {}, // { math: { totalSec, count, correctSec, correctCount, wrongSec, wrongCount } }
    byTopic: {},   // { 'math::Алгебра': { subject, topic, totalSec, count, maxSec, minSec } }
    byFormat: {},  // { single: { format, totalSec, count } }
  };
}

function defaultSettings() {
  return {
    ...DEFAULT_SETTINGS,
    ai: { ...DEFAULT_AI_SETTINGS },
  };
}

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function defaultState() {
  return {
    version: 1,
    theme: DEFAULT_THEME_ID, // 'atelier' default; unlockables: 'prism' | 'pulse' | 'monolith' | 'eclipse'
    fxMode: DEFAULT_FX_MODE, // 'minimal' | 'tactile' | 'webgl'
    unlockedThemes: [DEFAULT_THEME_ID],
    unseenThemes: [],
    achievements: {
      perfectFullExam: false,
    },
    lang: 'ru',
    streak: {
      days: 0,
      lastDate: null,
      todayCount: 0,
      todayDate: todayKey(),
    },
    stats: {
      totalAttempted: 0,
      totalCorrect: 0,
      bySubject: {}, // { math: { attempted, correct, earned, max }, ... }
      byTopic: {},   // { 'math::Алгебра': { subject, topic, attempted, correct, earned, max } }
      byType: {},    // { 'math.linear-eq': { subject, typeId, attempted, correct, earned, max } }
    },
    timing: defaultTiming(),
    recentAttempts: [],  // last 40 checked task attempts with durationSec & correctness
    settings: defaultSettings(),
    aiChat: [],          // persisted AI Tutor conversation (max 30 messages)
    solvedOriginals: {}, // { [taskId]: { correct, earned, max, response, at } }
    mistakes: {},        // { [taskId]: { task, response, wrongCount, lastWrongAt, resolved, resolvedAt } }
    bookmarks: {},       // { [taskId]: { task, addedAt } }
    exams: [],           // completed exam summaries (newest first, max 50)
    activeExam: null,    // saved in-progress exam so F5 reload resumes cleanly
    activePractice: {},  // { [subjectId]: { task, response, checked, result, routeKey } }
    originalsSessions: {}, // { [subjectId]: { [taskId]: { response, checked } } }
  };
}

let memoryState = null;
let nativeSaveTimer = null;
let pendingNativeJson = null;

function scheduleNativeSave(serialized) {
  if (!isNativeApp()) return;
  pendingNativeJson = serialized;
  if (nativeSaveTimer) {
    clearTimeout(nativeSaveTimer);
  }
  nativeSaveTimer = setTimeout(() => {
    nativeSaveTimer = null;
    const payload = pendingNativeJson;
    pendingNativeJson = null;
    if (payload) {
      void saveNativeProgress(payload);
    }
  }, NATIVE_SYNC_DEBOUNCE_MS);
}

export function flushNativeSave() {
  if (!isNativeApp()) return;
  if (nativeSaveTimer) {
    clearTimeout(nativeSaveTimer);
    nativeSaveTimer = null;
  }
  const payload = pendingNativeJson;
  pendingNativeJson = null;
  if (payload) {
    void saveNativeProgress(payload);
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('pagehide', flushNativeSave);
  if (typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') flushNativeSave();
    });
  }
}

function hasMeaningfulProgress(obj) {
  if (!obj || typeof obj !== 'object') return false;
  return Boolean(
    (obj.stats?.totalAttempted ?? 0) > 0 ||
    (Array.isArray(obj.exams) && obj.exams.length > 0) ||
    obj.activeExam ||
    obj.achievements?.perfectFullExam ||
    (Array.isArray(obj.unlockedThemes) && obj.unlockedThemes.length > 1) ||
    Object.keys(obj.mistakes ?? {}).length > 0 ||
    Object.keys(obj.bookmarks ?? {}).length > 0 ||
    Object.keys(obj.solvedOriginals ?? {}).length > 0
  );
}

/**
 * On Tauri native app boot: hydrate localStorage from Rust app-data file if OS cleared WebView storage,
 * or seed Rust file from existing localStorage if native file does not exist yet.
 * @returns {Promise<boolean>} true if state was hydrated from native storage
 */
export async function hydrateFromNativeStorage() {
  if (!isNativeApp()) return false;
  try {
    const localRaw = localStorage.getItem(STORAGE_KEY);
    const localParsed = localRaw ? JSON.parse(localRaw) : null;
    const nativeRaw = await loadNativeProgress();

    if (nativeRaw) {
      const nativeParsed = JSON.parse(nativeRaw);
      if (nativeParsed && typeof nativeParsed === 'object') {
        const shouldHydrate = !localRaw || (!hasMeaningfulProgress(localParsed) && hasMeaningfulProgress(nativeParsed));
        if (shouldHydrate) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(nativeParsed));
          memoryState = null;
          loadState();
          notifyStateChange();
          return true;
        }
      }
    } else if (localRaw) {
      // First launch with existing WebView state -> seed crash-safe Rust file
      void saveNativeProgress(localRaw);
    }
  } catch (err) {
    console.warn('[ulduz] native storage hydrate skipped:', err);
  }
  return false;
}

function notifyStateChange() {
  if (typeof window !== 'undefined' && typeof CustomEvent === 'function') {
    window.dispatchEvent(new CustomEvent('ulduz:state-change'));
  }
}

function emitUnlockedThemes(themeIds) {
  if (!Array.isArray(themeIds) || themeIds.length === 0) return;
  if (typeof window !== 'undefined' && typeof CustomEvent === 'function') {
    window.dispatchEvent(new CustomEvent('ulduz:theme-unlocked', { detail: { themeIds } }));
  }
}

export function loadState() {
  if (memoryState) return memoryState;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      const base = defaultState();
      memoryState = {
        ...base,
        ...parsed,
        theme: normalizeThemeId(parsed.theme),
        fxMode: normalizeFxMode(parsed.fxMode),
        unlockedThemes: normalizeUnlockedList(parsed.unlockedThemes),
        unseenThemes: Array.isArray(parsed.unseenThemes) ? [...new Set(parsed.unseenThemes.map((id) => normalizeThemeId(id)).filter((id) => id !== DEFAULT_THEME_ID))] : [],
        achievements: { ...base.achievements, ...(parsed.achievements ?? {}) },
        streak: { ...base.streak, ...(parsed.streak ?? {}) },
        stats: {
          ...base.stats,
          ...(parsed.stats ?? {}),
          bySubject: { ...(parsed.stats?.bySubject ?? {}) },
          byTopic: { ...(parsed.stats?.byTopic ?? {}) },
          byType: { ...(parsed.stats?.byType ?? {}) },
        },
        timing: {
          ...base.timing,
          ...(parsed.timing ?? {}),
          bySubject: { ...(parsed.timing?.bySubject ?? {}) },
          byTopic: { ...(parsed.timing?.byTopic ?? {}) },
          byFormat: { ...(parsed.timing?.byFormat ?? {}) },
        },
        recentAttempts: Array.isArray(parsed.recentAttempts)
          ? parsed.recentAttempts.slice(-MAX_RECENT_ATTEMPTS)
          : [],
        settings: {
          ...base.settings,
          ...(parsed.settings ?? {}),
          ai: {
            ...base.settings.ai,
            ...(parsed.settings?.ai ?? {}),
          },
        },
        aiChat: Array.isArray(parsed.aiChat)
          ? parsed.aiChat.slice(-MAX_AI_CHAT_MESSAGES)
          : [],
        solvedOriginals: { ...(parsed.solvedOriginals ?? {}) },
        mistakes: { ...(parsed.mistakes ?? {}) },
        bookmarks: { ...(parsed.bookmarks ?? {}) },
        exams: Array.isArray(parsed.exams) ? parsed.exams : [],
        activePractice: { ...(parsed.activePractice ?? {}) },
        originalsSessions: { ...(parsed.originalsSessions ?? {}) },
      };
      // Silently reconcile unlocked themes for existing progress on boot (no boot toast spam)
      evaluateThemeUnlocks(memoryState, { markUnseen: false });
      if (!isThemeUnlocked(memoryState.theme, memoryState)) {
        memoryState.theme = DEFAULT_THEME_ID;
      }
      return memoryState;
    }
  } catch (err) {
    console.warn('[ulduz] localStorage read error:', err);
  }
  memoryState = defaultState();
  return memoryState;
}

export function saveState() {
  if (!memoryState) return;
  let serialized = null;
  try {
    serialized = JSON.stringify(memoryState);
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch (err) {
    console.warn('[ulduz] localStorage write error:', err);
  }
  if (serialized) {
    scheduleNativeSave(serialized);
  }
  notifyStateChange();
}

function bumpStreak(st) {
  const today = todayKey();
  if (st.streak.todayDate !== today) {
    st.streak.todayDate = today;
    st.streak.todayCount = 0;
  }
  st.streak.todayCount += 1;

  if (st.streak.lastDate === today) return;
  if (st.streak.lastDate) {
    const prev = new Date(st.streak.lastDate + 'T00:00:00');
    const cur = new Date(today + 'T00:00:00');
    const diffDays = Math.round((cur - prev) / 86400000);
    if (diffDays === 1) {
      st.streak.days += 1;
    } else if (diffDays > 1) {
      st.streak.days = 1;
    }
  } else {
    st.streak.days = 1;
  }
  st.streak.lastDate = today;
}

/**
 * Record a checked task attempt (from Practice, Originals, Mistakes retry, or Exam),
 * including optional per-task active solving duration (`opts.durationSec`).
 * @param {import('./contract.js').Task} task
 * @param {any} response
 * @param {{correct:boolean, earned:number, max:number}} result
 * @param {{ durationSec?: number, source?: string }} [opts]
 */
export function recordTaskAttempt(task, response, result, opts = {}) {
  const st = loadState();
  bumpStreak(st);

  st.stats.totalAttempted += 1;
  if (result.correct) st.stats.totalCorrect += 1;

  // Subject bucket
  const subj = task.subject || 'math';
  const sb = (st.stats.bySubject[subj] ??= { attempted: 0, correct: 0, earned: 0, max: 0 });
  sb.attempted += 1;
  if (result.correct) sb.correct += 1;
  sb.earned = Math.round((sb.earned + result.earned) * 100) / 100;
  sb.max = Math.round((sb.max + result.max) * 100) / 100;

  // Topic bucket
  const topicName = task.topic || 'Общее';
  const topicKey = `${subj}::${topicName}`;
  const tb = (st.stats.byTopic[topicKey] ??= {
    subject: subj,
    topic: topicName,
    attempted: 0,
    correct: 0,
    earned: 0,
    max: 0,
  });
  tb.attempted += 1;
  if (result.correct) tb.correct += 1;
  tb.earned = Math.round((tb.earned + result.earned) * 100) / 100;
  tb.max = Math.round((tb.max + result.max) * 100) / 100;

  // Type bucket
  if (task.typeId) {
    const tyb = (st.stats.byType[task.typeId] ??= {
      subject: subj,
      typeId: task.typeId,
      attempted: 0,
      correct: 0,
      earned: 0,
      max: 0,
    });
    tyb.attempted += 1;
    if (result.correct) tyb.correct += 1;
    tyb.earned = Math.round((tyb.earned + result.earned) * 100) / 100;
    tyb.max = Math.round((tyb.max + result.max) * 100) / 100;
  }

  // Timing telemetry (clamped 1..1800s when provided)
  const rawDur = Number(opts?.durationSec);
  const durationSec = Number.isFinite(rawDur) && rawDur > 0
    ? Math.max(1, Math.min(1800, Math.round(rawDur)))
    : 0;
  const fmt = task.format || 'single';

  st.timing ??= defaultTiming();
  if (durationSec > 0) {
    st.timing.totalSec = (st.timing.totalSec || 0) + durationSec;
    st.timing.totalTimedAttempts = (st.timing.totalTimedAttempts || 0) + 1;

    const tSubj = (st.timing.bySubject[subj] ??= {
      totalSec: 0,
      count: 0,
      correctSec: 0,
      correctCount: 0,
      wrongSec: 0,
      wrongCount: 0,
    });
    tSubj.totalSec += durationSec;
    tSubj.count += 1;
    if (result.correct) {
      tSubj.correctSec += durationSec;
      tSubj.correctCount += 1;
    } else {
      tSubj.wrongSec += durationSec;
      tSubj.wrongCount += 1;
    }

    const tTopic = (st.timing.byTopic[topicKey] ??= {
      subject: subj,
      topic: topicName,
      totalSec: 0,
      count: 0,
      maxSec: 0,
      minSec: durationSec,
    });
    tTopic.totalSec += durationSec;
    tTopic.count += 1;
    tTopic.maxSec = Math.max(tTopic.maxSec || 0, durationSec);
    tTopic.minSec = Math.min(tTopic.minSec || durationSec, durationSec);

    const tFmt = (st.timing.byFormat[fmt] ??= {
      format: fmt,
      totalSec: 0,
      count: 0,
    });
    tFmt.totalSec += durationSec;
    tFmt.count += 1;
  }

  // Recent attempts trajectory log (used by Stats oscillograph & AI tutor)
  st.recentAttempts ??= [];
  st.recentAttempts.push({
    at: Date.now(),
    subject: subj,
    topic: topicName,
    format: fmt,
    correct: Boolean(result.correct),
    earned: Number(result.earned || 0),
    max: Number(result.max || 1),
    durationSec,
    source: opts?.source || task.source || 'generated',
    taskId: task.id || '',
  });
  if (st.recentAttempts.length > MAX_RECENT_ATTEMPTS) {
    st.recentAttempts = st.recentAttempts.slice(-MAX_RECENT_ATTEMPTS);
  }

  // Originals tracking
  if (task.source === 'original') {
    st.solvedOriginals[task.id] = {
      correct: result.correct,
      earned: result.earned,
      max: result.max,
      response,
      at: Date.now(),
    };
  }

  // Mistakes bank
  if (!result.correct) {
    const existing = st.mistakes[task.id];
    st.mistakes[task.id] = {
      task,
      response,
      wrongCount: (existing?.wrongCount ?? 0) + 1,
      lastWrongAt: Date.now(),
      resolved: false,
      resolvedAt: null,
    };
  } else if (st.mistakes[task.id]) {
    st.mistakes[task.id].resolved = true;
    st.mistakes[task.id].resolvedAt = Date.now();
    st.mistakes[task.id].response = response;
  }

  const newlyUnlocked = evaluateThemeUnlocks(st, { markUnseen: true });
  saveState();
  emitUnlockedThemes(newlyUnlocked);
}

export function isBookmarked(taskId) {
  return Boolean(loadState().bookmarks[taskId]);
}

export function toggleBookmark(task) {
  const st = loadState();
  if (st.bookmarks[task.id]) {
    delete st.bookmarks[task.id];
    saveState();
    return false;
  }
  st.bookmarks[task.id] = { task, addedAt: Date.now() };
  saveState();
  return true;
}

export function removeMistake(taskId) {
  const st = loadState();
  const prev = st.mistakes[taskId] ?? null;
  delete st.mistakes[taskId];
  saveState();
  return prev;
}

export function restoreMistake(taskId, entry) {
  if (!taskId || !entry) return;
  const st = loadState();
  st.mistakes[taskId] = entry;
  saveState();
}

export function restoreBookmark(taskId, entry) {
  if (!taskId || !entry) return;
  const st = loadState();
  st.bookmarks[taskId] = entry;
  saveState();
}

export function addTasksToMistakes(tasks) {
  const st = loadState();
  let added = 0;
  for (const task of tasks) {
    if (!task?.id) continue;
    const existing = st.mistakes[task.id];
    if (!existing || existing.resolved) added++;
    st.mistakes[task.id] = {
      task,
      response: null,
      wrongCount: (existing?.wrongCount ?? 0) + 1,
      lastWrongAt: Date.now(),
      resolved: false,
      resolvedAt: null,
    };
  }
  saveState();
  return added;
}

export function getActiveMistakesCount(subjectId = null) {
  const st = loadState();
  return Object.values(st.mistakes).filter(
    (m) => !m.resolved && (!subjectId || m.task.subject === subjectId)
  ).length;
}

export function saveActiveExam(examSession) {
  const st = loadState();
  st.activeExam = examSession;
  saveState();
}

export function clearActiveExam() {
  const st = loadState();
  st.activeExam = null;
  saveState();
}

export function recordCompletedExam(examSummary, itemResults) {
  const st = loadState();
  // Record ONLY answered/graded tasks into stats & mistakes (never flood mistakes with untouched skipped items)
  for (const item of itemResults) {
    if (item.status !== 'unanswered' && item.status !== 'pending') {
      recordTaskAttempt(
        item.task,
        item.response,
        {
          correct: item.correct,
          earned: item.earned,
          max: item.max,
        },
        {
          durationSec: item.durationSec,
          source: 'exam',
        }
      );
    }
  }
  st.exams.unshift(examSummary);
  if (st.exams.length > 50) st.exams.length = 50;
  st.activeExam = null;

  if (isPerfectFullExamSummary(examSummary)) {
    st.achievements ??= { perfectFullExam: false };
    st.achievements.perfectFullExam = true;
  }

  const newlyUnlocked = evaluateThemeUnlocks(st, { markUnseen: true });
  saveState();
  emitUnlockedThemes(newlyUnlocked);
}

/**
 * Sync updated exam summary score after open-task self-grading and grant Мастер if 100% achieved.
 */
export function syncExamScoreAndAchievements(examId, evaluation) {
  const st = loadState();
  const stored = st.exams?.find((ex) => ex.id === examId);
  if (stored) {
    Object.assign(stored, {
      scaledScore: evaluation.scaledScore,
      rawEarned: evaluation.rawEarned,
      pct: evaluation.pct,
      counts: evaluation.counts,
    });
    if (isPerfectFullExamSummary(stored)) {
      st.achievements ??= { perfectFullExam: false };
      st.achievements.perfectFullExam = true;
    }
  }
  const newlyUnlocked = evaluateThemeUnlocks(st, { markUnseen: true });
  saveState();
  emitUnlockedThemes(newlyUnlocked);
}

/**
 * Sync stats and mistakes when a user self-grades (or adjusts self-grade of) an open task on Exam Results.
 */
export function recordExamOpenSelfGrade(task, prevSelf, newResponse, newResult) {
  const st = loadState();
  const max = newResult.max ?? task.points ?? 2;
  const wasGraded = typeof prevSelf === 'number' && !Number.isNaN(prevSelf);

  if (!wasGraded) {
    recordTaskAttempt(task, newResponse, newResult);
    return;
  }

  const prevCorrect = prevSelf === max;
  const deltaCorrect = (newResult.correct ? 1 : 0) - (prevCorrect ? 1 : 0);
  const deltaEarned = Math.round((newResult.earned - prevSelf) * 100) / 100;

  st.stats.totalCorrect = Math.max(0, (st.stats.totalCorrect || 0) + deltaCorrect);

  const subj = task.subject || 'math';
  const sb = st.stats.bySubject[subj];
  if (sb) {
    sb.correct = Math.max(0, (sb.correct || 0) + deltaCorrect);
    sb.earned = Math.max(0, Math.round(((sb.earned || 0) + deltaEarned) * 100) / 100);
  }

  const topicKey = `${subj}::${task.topic || 'Общее'}`;
  const tb = st.stats.byTopic[topicKey];
  if (tb) {
    tb.correct = Math.max(0, (tb.correct || 0) + deltaCorrect);
    tb.earned = Math.max(0, Math.round(((tb.earned || 0) + deltaEarned) * 100) / 100);
  }

  if (task.typeId && st.stats.byType[task.typeId]) {
    const tyb = st.stats.byType[task.typeId];
    tyb.correct = Math.max(0, (tyb.correct || 0) + deltaCorrect);
    tyb.earned = Math.max(0, Math.round(((tyb.earned || 0) + deltaEarned) * 100) / 100);
  }

  if (task.source === 'original') {
    st.solvedOriginals[task.id] = {
      correct: newResult.correct,
      earned: newResult.earned,
      max,
      response: newResponse,
      at: Date.now(),
    };
  }

  if (newResult.correct) {
    if (st.mistakes[task.id]) {
      st.mistakes[task.id].resolved = true;
      st.mistakes[task.id].resolvedAt = Date.now();
      st.mistakes[task.id].response = newResponse;
    }
  } else {
    const existing = st.mistakes[task.id];
    st.mistakes[task.id] = {
      task,
      response: newResponse,
      wrongCount: existing ? Math.max(1, existing.wrongCount || 1) : 1,
      lastWrongAt: Date.now(),
      resolved: false,
      resolvedAt: null,
    };
  }

  const newlyUnlocked = evaluateThemeUnlocks(st, { markUnseen: true });
  saveState();
  emitUnlockedThemes(newlyUnlocked);
}

export function saveOriginalsEntry(subjectId, taskId, entry) {
  const st = loadState();
  st.originalsSessions ??= {};
  st.originalsSessions[subjectId] ??= {};
  st.originalsSessions[subjectId][taskId] = entry;
  saveState();
}

export function getOriginalsSession(subjectId) {
  return loadState().originalsSessions?.[subjectId] ?? {};
}

export function saveActivePractice(subjectId, session) {
  const st = loadState();
  st.activePractice[subjectId] = session;
  saveState();
}

export function getActivePractice(subjectId) {
  return loadState().activePractice[subjectId] ?? null;
}

export function getTheme() {
  const st = loadState();
  const norm = normalizeThemeId(st.theme);
  return isThemeUnlocked(norm, st) ? norm : DEFAULT_THEME_ID;
}

export function setTheme(theme, { animate = true } = {}) {
  const st = loadState();
  const norm = normalizeThemeId(theme);
  const chosen = isThemeUnlocked(norm, st) ? norm : DEFAULT_THEME_ID;
  st.theme = chosen;
  if (Array.isArray(st.unseenThemes)) {
    st.unseenThemes = st.unseenThemes.filter((id) => id !== chosen);
  }
  saveState();
  applyThemeToDocument(chosen, { animate });
  return chosen;
}

export function getUnseenThemesCount() {
  const st = loadState();
  return Array.isArray(st.unseenThemes) ? st.unseenThemes.length : 0;
}

export function markUnseenThemesSeen() {
  const st = loadState();
  if (Array.isArray(st.unseenThemes) && st.unseenThemes.length > 0) {
    st.unseenThemes = [];
    saveState();
  }
}

export function getFxMode() {
  return normalizeFxMode(loadState().fxMode);
}

export function setFxMode(mode) {
  const st = loadState();
  const norm = normalizeFxMode(mode);
  st.fxMode = norm;
  saveState();
  return norm;
}

export function getLang() {
  return loadState().lang || 'ru';
}

export function setLang(lang) {
  const st = loadState();
  st.lang = lang;
  saveState();
}

export function getSettings() {
  const st = loadState();
  st.settings ??= defaultSettings();
  st.settings.ai ??= { ...DEFAULT_AI_SETTINGS };
  return st.settings;
}

export function updateSettings(patch = {}) {
  const st = loadState();
  st.settings ??= defaultSettings();
  const nextAi = patch.ai ? { ...st.settings.ai, ...patch.ai } : st.settings.ai;
  st.settings = {
    ...st.settings,
    ...patch,
    ai: nextAi,
  };
  saveState();
  return st.settings;
}

export function updateAiSettings(aiPatch = {}) {
  return updateSettings({ ai: aiPatch });
}

export function getAiChatHistory() {
  const st = loadState();
  return Array.isArray(st.aiChat) ? st.aiChat : [];
}

export function saveAiChatHistory(messages) {
  const st = loadState();
  st.aiChat = Array.isArray(messages) ? messages.slice(-MAX_AI_CHAT_MESSAGES) : [];
  saveState();
  return st.aiChat;
}

export function clearAiChatHistory() {
  const st = loadState();
  st.aiChat = [];
  saveState();
}

export function resetTimingStats() {
  const st = loadState();
  st.timing = defaultTiming();
  st.recentAttempts = [];
  saveState();
}

export function resetAllProgress() {
  const lang = getLang();
  const fxMode = getFxMode();
  const prevSettings = getSettings();
  const preservedSettings = {
    ...defaultSettings(),
    ...prevSettings,
    ai: { ...DEFAULT_AI_SETTINGS, ...(prevSettings?.ai ?? {}) },
  };
  memoryState = defaultState();
  memoryState.theme = DEFAULT_THEME_ID;
  memoryState.lang = lang;
  memoryState.fxMode = fxMode;
  memoryState.settings = preservedSettings;
  saveState();
  applyThemeToDocument(DEFAULT_THEME_ID, { animate: false });
}

export function exportProgressJson() {
  return JSON.stringify(loadState(), null, 2);
}

export function importProgressJson(jsonStr) {
  const parsed = JSON.parse(jsonStr);
  if (!parsed || typeof parsed !== 'object') throw new Error('Некорректный формат файла');
  const serialized = JSON.stringify(parsed);
  localStorage.setItem(STORAGE_KEY, serialized);
  memoryState = null;
  const loaded = loadState();
  scheduleNativeSave(serialized);
  applyThemeToDocument(loaded.theme, { animate: false });
  notifyStateChange();
  return loaded;
}
