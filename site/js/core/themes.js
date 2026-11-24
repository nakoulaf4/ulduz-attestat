// 5 Unlockable Pure Monochrome Black-and-White Neon Modes (Obsidian Atelier Architecture).
// Every mode stays 100% pure B&W dark neon while transforming layout geometry, button placement,
// display font voice, architectural framing, and signature motion choreography.
// Legacy theme IDs ('voshod'|'intel'|'nvidia'|'amd'|'master'|'light'|'dark') migrate cleanly.

export const DEFAULT_THEME_ID = 'atelier';
export const VALID_THEME_IDS = ['atelier', 'prism', 'pulse', 'monolith', 'eclipse'];

const LEGACY_THEME_MAP = {
  voshod: 'atelier',
  intel: 'prism',
  nvidia: 'pulse',
  amd: 'monolith',
  master: 'eclipse',
  light: 'atelier',
  dark: 'atelier',
};

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
    id: 'atelier',
    shortLabel: 'Obsidian',
    name: 'Obsidian',
    subtitleKey: 'themeSub_atelier',
    descKey: 'themeDesc_atelier',
    ruleKey: 'themeRule_atelier',
    colorScheme: 'dark',
    themeColor: '#030304',
    appleBarStyle: 'black-translucent',
    displayFont: "'Ulduz Wide', 'Inter Variable', sans-serif",
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
    id: 'prism',
    shortLabel: 'Prism [i]',
    name: 'Prism [i]',
    subtitleKey: 'themeSub_prism',
    descKey: 'themeDesc_prism',
    ruleKey: 'themeRule_prism',
    colorScheme: 'dark',
    themeColor: '#040406',
    appleBarStyle: 'black-translucent',
    displayFont: "'Ulduz Intel', 'Inter Variable', sans-serif",
    unlockedByDefault: false,
    quickHref: () => '#/practice/math',
    getProgress(state) {
      const done = Number(state?.stats?.bySubject?.math?.correct ?? 0);
      const target = 10;
      const unlocked = Boolean(state?.unlockedThemes?.includes('prism')) || done >= target;
      const clamped = unlocked ? target : Math.min(done, target);
      return {
        unlocked,
        pct: Math.round((clamped / target) * 100),
        items: [{ labelKey: 'subjectMath', done: clamped, target }],
      };
    },
  },
  {
    id: 'pulse',
    shortLabel: 'Pulse [n]',
    name: 'Pulse [n]',
    subtitleKey: 'themeSub_pulse',
    descKey: 'themeDesc_pulse',
    ruleKey: 'themeRule_pulse',
    colorScheme: 'dark',
    themeColor: '#020203',
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
      const unlocked = Boolean(state?.unlockedThemes?.includes('pulse')) || (ruDone >= 5 && enDone >= 5);
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
    id: 'monolith',
    shortLabel: 'Monolith [a]',
    name: 'Monolith [a]',
    subtitleKey: 'themeSub_monolith',
    descKey: 'themeDesc_monolith',
    ruleKey: 'themeRule_monolith',
    colorScheme: 'dark',
    themeColor: '#050506',
    appleBarStyle: 'black-translucent',
    displayFont: "'Ulduz AMD', 'Inter Variable', sans-serif",
    unlockedByDefault: false,
    quickHref: () => '#/practice/az',
    getProgress(state) {
      const done = Number(state?.stats?.bySubject?.az?.correct ?? 0);
      const target = 10;
      const unlocked = Boolean(state?.unlockedThemes?.includes('monolith')) || done >= target;
      const clamped = unlocked ? target : Math.min(done, target);
      return {
        unlocked,
        pct: Math.round((clamped / target) * 100),
        items: [{ labelKey: 'subjectAz', done: clamped, target }],
      };
    },
  },
  {
    id: 'eclipse',
    shortLabel: 'Eclipse',
    name: 'Eclipse · Мастер',
    subtitleKey: 'themeSub_eclipse',
    descKey: 'themeDesc_eclipse',
    ruleKey: 'themeRule_eclipse',
    colorScheme: 'dark',
    themeColor: '#000000',
    appleBarStyle: 'black-translucent',
    displayFont: "'Ulduz Wide', 'Inter Variable', sans-serif",
    unlockedByDefault: false,
    quickHref: () => '#/exam/math',
    getProgress(state) {
      const { hasPerfect, bestPct, bestScore, bestMax } = getBestFullExamProgress(state);
      const unlocked = Boolean(state?.unlockedThemes?.includes('eclipse')) || hasPerfect;
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
 * Normalize legacy ('voshod'|'intel'|'nvidia'|'amd'|'master'|'light'|'dark') & unknown values
 * into valid Obsidian Atelier monochrome mode IDs (default: 'atelier').
 */
export function normalizeThemeId(raw) {
  if (typeof raw !== 'string') return DEFAULT_THEME_ID;
  if (THEME_MAP[raw]) return raw;
  if (LEGACY_THEME_MAP[raw]) return LEGACY_THEME_MAP[raw];
  return DEFAULT_THEME_ID;
}

export function normalizeUnlockedList(list) {
  if (!Array.isArray(list)) return [DEFAULT_THEME_ID];
  const out = new Set([DEFAULT_THEME_ID]);
  for (const item of list) {
    out.add(normalizeThemeId(item));
  }
  return [...out];
}

export function getThemeDef(themeId) {
  return THEME_MAP[normalizeThemeId(themeId)];
}

export function isThemeUnlocked(themeId, state) {
  const norm = normalizeThemeId(themeId);
  const def = THEME_MAP[norm];
  if (!def) return false;
  if (def.unlockedByDefault) return true;
  return Boolean(def.getProgress(state).unlocked);
}

/**
 * Synchronize state.unlockedThemes & state.achievements against current stats/exams.
 * Returns array of newly unlocked mode IDs (excluding default 'atelier').
 */
export function evaluateThemeUnlocks(state, { markUnseen = true } = {}) {
  if (!state || typeof state !== 'object') return [];
  state.achievements ??= { perfectFullExam: false };
  state.unlockedThemes = normalizeUnlockedList(state.unlockedThemes);
  if (!Array.isArray(state.unseenThemes)) state.unseenThemes = [];
  else state.unseenThemes = [...new Set(state.unseenThemes.map((id) => normalizeThemeId(id)).filter((id) => id !== DEFAULT_THEME_ID))];

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
 * Apply monochrome mode attributes & mobile status-bar meta tags directly to the DOM.
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
