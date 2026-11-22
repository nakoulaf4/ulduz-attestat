// 5 Unlockable Themes Registry, Unlock Conditions & Live Progress Calculators.
// Themes: Восход (default), i (Intel), n (NVIDIA), a (AMD), Мастер (Prestige B&W Neon).

export const DEFAULT_THEME_ID = 'voshod';
export const VALID_THEME_IDS = ['voshod', 'intel', 'nvidia', 'amd', 'master'];

/**
 * Determine whether a completed exam summary qualifies as a perfect full DİM exam
 * (100/100 on a full 25/30-task subject exam OR 300/300 on multi-subject exam).
 */
export function isPerfectFullExamSummary(exam) {
  if (!exam || typeof exam !== 'object') return false;
  const totalTasks = Number(exam.counts?.total ?? 0);
  const scaledMax = Number(exam.scaledMax ?? 0);
  const scaledScore = Number(exam.scaledScore ?? 0);
  return totalTasks >= 25 && scaledMax > 0 && scaledScore >= scaledMax;
}

function getBestFullExamProgress(state) {
  const exams = Array.isArray(state?.exams) ? state.exams : [];
  let bestPct = 0;
  let bestScore = 0;
  let bestMax = 100;
  let hasPerfect = Boolean(state?.achievements?.perfectFullExam);

  for (const ex of exams) {
    const total = Number(ex?.counts?.total ?? 0);
    if (total < 25) continue;
    const sMax = Number(ex?.scaledMax ?? 100);
    const sScore = Number(ex?.scaledScore ?? 0);
    if (sMax <= 0) continue;
    if (sScore >= sMax) hasPerfect = true;
    const pct = (sScore / sMax) * 100;
    if (pct >= bestPct) {
      bestPct = pct;
      bestScore = sScore;
      bestMax = sMax;
    }
  }
  return { hasPerfect, bestPct: Math.min(100, bestPct), bestScore, bestMax };
}

export const THEMES = [
  {
    id: 'voshod',
    shortLabel: 'Восход',
    name: 'Восход',
    subtitleKey: 'themeSub_voshod',
    descKey: 'themeDesc_voshod',
    ruleKey: 'themeRule_voshod',
    colorScheme: 'dark',
    themeColor: '#180C3A',
    appleBarStyle: 'black-translucent',
    displayFont: "'Ulduz GTA', 'Inter Variable', sans-serif",
    unlockedByDefault: true,
    quickHref: () => '#/',
    getProgress() {
      return {
        unlocked: true,
        pct: 100,
        items: [],
      };
    },
  },
  {
    id: 'intel',
    shortLabel: 'i',
    name: 'i',
    subtitleKey: 'themeSub_intel',
    descKey: 'themeDesc_intel',
    ruleKey: 'themeRule_intel',
    colorScheme: 'light',
    themeColor: '#F1F6FC',
    appleBarStyle: 'default',
    displayFont: "'Ulduz Intel', 'Inter Variable', sans-serif",
    unlockedByDefault: false,
    quickHref: () => '#/practice/math',
    getProgress(state) {
      const done = Number(state?.stats?.bySubject?.math?.correct ?? 0);
      const target = 10;
      const unlocked = Boolean(state?.unlockedThemes?.includes('intel')) || done >= target;
      const clamped = unlocked ? target : Math.min(done, target);
      return {
        unlocked,
        pct: Math.round((clamped / target) * 100),
        items: [{ labelKey: 'subjectMath', done: clamped, target }],
      };
    },
  },
  {
    id: 'nvidia',
    shortLabel: 'n',
    name: 'n',
    subtitleKey: 'themeSub_nvidia',
    descKey: 'themeDesc_nvidia',
    ruleKey: 'themeRule_nvidia',
    colorScheme: 'dark',
    themeColor: '#090C09',
    appleBarStyle: 'black-translucent',
    displayFont: "'Ulduz Nvidia', 'Inter Variable', sans-serif",
    unlockedByDefault: false,
    quickHref(state) {
      const ruDone = Number(state?.stats?.bySubject?.ru?.correct ?? 0);
      return ruDone < 5 ? '#/practice/ru' : '#/practice/en';
    },
    getProgress(state) {
      const ruDone = Number(state?.stats?.bySubject?.ru?.correct ?? 0);
      const enDone = Number(state?.stats?.bySubject?.en?.correct ?? 0);
      const unlocked = Boolean(state?.unlockedThemes?.includes('nvidia')) || (ruDone >= 5 && enDone >= 5);
      const ruClamped = unlocked ? 5 : Math.min(ruDone, 5);
      const enClamped = unlocked ? 5 : Math.min(enDone, 5);
      return {
        unlocked,
        pct: Math.round(((ruClamped + enClamped) / 10) * 100),
        items: [
          { labelKey: 'subjectShortRu', done: ruClamped, target: 5 },
          { labelKey: 'subjectShortEn', done: enClamped, target: 5 },
        ],
      };
    },
  },
  {
    id: 'amd',
    shortLabel: 'a',
    name: 'a',
    subtitleKey: 'themeSub_amd',
    descKey: 'themeDesc_amd',
    ruleKey: 'themeRule_amd',
    colorScheme: 'dark',
    themeColor: '#0E0E10',
    appleBarStyle: 'black-translucent',
    displayFont: "'Ulduz AMD', 'Inter Variable', sans-serif",
    unlockedByDefault: false,
    quickHref: () => '#/practice/az',
    getProgress(state) {
      const done = Number(state?.stats?.bySubject?.az?.correct ?? 0);
      const target = 10;
      const unlocked = Boolean(state?.unlockedThemes?.includes('amd')) || done >= target;
      const clamped = unlocked ? target : Math.min(done, target);
      return {
        unlocked,
        pct: Math.round((clamped / target) * 100),
        items: [{ labelKey: 'subjectAz', done: clamped, target }],
      };
    },
  },
  {
    id: 'master',
    shortLabel: 'Мастер',
    name: 'Мастер',
    subtitleKey: 'themeSub_master',
    descKey: 'themeDesc_master',
    ruleKey: 'themeRule_master',
    colorScheme: 'dark',
    themeColor: '#030303',
    appleBarStyle: 'black-translucent',
    displayFont: "'Ulduz Wide', 'Inter Variable', sans-serif",
    unlockedByDefault: false,
    quickHref: () => '#/exam/math',
    getProgress(state) {
      const { hasPerfect, bestPct, bestScore, bestMax } = getBestFullExamProgress(state);
      const unlocked = Boolean(state?.unlockedThemes?.includes('master')) || hasPerfect;
      return {
        unlocked,
        pct: unlocked ? 100 : Math.min(99, Math.round(bestPct)),
        items: [
          {
            labelKey: 'themeMasterProgressLabel',
            done: unlocked ? bestMax : Math.round(bestScore * 10) / 10,
            target: bestMax,
          },
        ],
      };
    },
  },
];

export const THEME_MAP = Object.fromEntries(THEMES.map((th) => [th.id, th]));

/**
 * Normalize legacy ('light'/'dark'/null/unknown) theme values to valid 5-theme IDs (default: 'voshod').
 */
export function normalizeThemeId(raw) {
  if (typeof raw === 'string' && THEME_MAP[raw]) return raw;
  return DEFAULT_THEME_ID;
}

export function getThemeDef(themeId) {
  return THEME_MAP[normalizeThemeId(themeId)];
}

export function isThemeUnlocked(themeId, state) {
  const def = THEME_MAP[themeId];
  if (!def) return false;
  if (def.unlockedByDefault) return true;
  return Boolean(def.getProgress(state).unlocked);
}

/**
 * Synchronize state.unlockedThemes & state.achievements against current stats/exams.
 * Returns array of newly unlocked theme IDs (excluding default 'voshod').
 * @param {object} state
 * @param {{ markUnseen?: boolean }} [opts]
 */
export function evaluateThemeUnlocks(state, { markUnseen = true } = {}) {
  if (!state || typeof state !== 'object') return [];
  state.achievements ??= { perfectFullExam: false };
  if (!Array.isArray(state.unlockedThemes)) state.unlockedThemes = [DEFAULT_THEME_ID];
  if (!state.unlockedThemes.includes(DEFAULT_THEME_ID)) {
    state.unlockedThemes.unshift(DEFAULT_THEME_ID);
  }
  if (!Array.isArray(state.unseenThemes)) state.unseenThemes = [];

  // Re-verify perfect full exam achievement from exam history
  if (!state.achievements.perfectFullExam && Array.isArray(state.exams)) {
    if (state.exams.some((ex) => isPerfectFullExamSummary(ex))) {
      state.achievements.perfectFullExam = true;
    }
  }

  const newlyUnlocked = [];
  for (const theme of THEMES) {
    if (state.unlockedThemes.includes(theme.id)) continue;
    if (theme.getProgress(state).unlocked) {
      state.unlockedThemes.push(theme.id);
      if (markUnseen && !theme.unlockedByDefault && !state.unseenThemes.includes(theme.id)) {
        state.unseenThemes.push(theme.id);
      }
      if (!theme.unlockedByDefault) {
        newlyUnlocked.push(theme.id);
      }
    }
  }
  return newlyUnlocked;
}

let switchAnimTimer = null;

/**
 * Apply theme attributes & mobile status-bar meta tags directly to the DOM.
 */
export function applyThemeToDocument(themeId, { animate = false } = {}) {
  if (typeof document === 'undefined') return;
  const def = getThemeDef(themeId);
  const root = document.documentElement;
  root.setAttribute('data-theme', def.id);
  root.setAttribute('data-color-scheme', def.colorScheme);

  const metaTc = document.getElementById('theme-color-meta');
  if (metaTc) metaTc.setAttribute('content', def.themeColor);

  const appleBar = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
  if (appleBar) appleBar.setAttribute('content', def.appleBarStyle);

  if (animate) {
    root.classList.remove('is-theme-switching');
    void root.offsetWidth;
    root.classList.add('is-theme-switching');
    if (switchAnimTimer) clearTimeout(switchAnimTimer);
    switchAnimTimer = setTimeout(() => {
      root.classList.remove('is-theme-switching');
      switchAnimTimer = null;
    }, 520);
  }
}
