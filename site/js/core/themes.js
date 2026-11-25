// 5 Unlockable Archival Pressing Editions (Factory Records / Peter Saville Catalog Architecture).
// Preserves internal IDs ('atelier'|'prism'|'pulse'|'monolith'|'eclipse') and legacy migration
// ('voshod'|'intel'|'nvidia'|'amd'|'master'|'light'|'dark') so existing student saves remain 100% intact.

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
    catNo: 'FAC 01',
    shortLabel: 'FAC 01',
    name: 'FAC 01 · Archive',
    subtitleKey: 'themeSub_atelier',
    descKey: 'themeDesc_atelier',
    ruleKey: 'themeRule_atelier',
    colorScheme: 'dark',
    themeColor: '#0C0C0E',
    appleBarStyle: 'black-translucent',
    displayFont: "'Ulduz Nvidia', 'Inter Variable', sans-serif",
    swatches: ['#0C0C0E', '#EAEAE6', '#D63031', '#2663C9', '#DFB41D', '#2E9E5B'],
    unlockedByDefault: true,
    quickHref: () => '#/',
    getProgress() {
      return { unlocked: true, pct: 100, items: [] };
    },
  },
  {
    id: 'prism',
    catNo: 'FAC 02',
    shortLabel: 'FAC 02',
    name: 'FAC 02 · Blueprint [i]',
    subtitleKey: 'themeSub_prism',
    descKey: 'themeDesc_prism',
    ruleKey: 'themeRule_prism',
    colorScheme: 'dark',
    themeColor: '#080D18',
    appleBarStyle: 'black-translucent',
    displayFont: "'Ulduz Intel', 'Inter Variable', sans-serif",
    swatches: ['#080D18', '#EDF3FF', '#3B82F6', '#60A5FA', '#DFB41D'],
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
    catNo: 'FAC 03',
    shortLabel: 'FAC 03',
    name: 'FAC 03 · Haçienda [n]',
    subtitleKey: 'themeSub_pulse',
    descKey: 'themeDesc_pulse',
    ruleKey: 'themeRule_pulse',
    colorScheme: 'dark',
    themeColor: '#0C0C0D',
    appleBarStyle: 'black-translucent',
    displayFont: "'Ulduz Nvidia', 'Inter Variable', sans-serif",
    swatches: ['#0C0C0D', '#F2F2EE', '#F0C419', '#D63031', '#2E9E5B'],
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
    catNo: 'FAC 04',
    shortLabel: 'FAC 04',
    name: 'FAC 04 · Crimson [a]',
    subtitleKey: 'themeSub_monolith',
    descKey: 'themeDesc_monolith',
    ruleKey: 'themeRule_monolith',
    colorScheme: 'dark',
    themeColor: '#0F0D0E',
    appleBarStyle: 'black-translucent',
    displayFont: "'Ulduz AMD', 'Inter Variable', sans-serif",
    swatches: ['#0F0D0E', '#F0ECEB', '#E63946', '#DFB41D', '#2663C9'],
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
    catNo: 'FAC 05',
    shortLabel: 'FAC 05',
    name: 'FAC 05 · Master Press',
    subtitleKey: 'themeSub_eclipse',
    descKey: 'themeDesc_eclipse',
    ruleKey: 'themeRule_eclipse',
    colorScheme: 'light',
    themeColor: '#ECECEB',
    appleBarStyle: 'default',
    displayFont: "'Ulduz Wide', 'Inter Variable', sans-serif",
    swatches: ['#ECECEB', '#0C0C0E', '#D63031', '#2663C9', '#DFB41D', '#2E9E5B'],
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

export function applyThemeToDocument(themeId, { animate = false } = {}) {
  const def = getThemeDef(themeId);
  const html = document.documentElement;
  html.setAttribute('data-theme', def.id);
  html.setAttribute('data-color-scheme', def.colorScheme);

  const metaTc = document.getElementById('theme-color-meta');
  if (metaTc) metaTc.setAttribute('content', def.themeColor);

  const appleBar = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
  if (appleBar) appleBar.setAttribute('content', def.appleBarStyle);

  if (animate) {
    html.classList.remove('is-theme-switching');
    void html.offsetWidth;
    html.classList.add('is-theme-switching');
    window.setTimeout(() => html.classList.remove('is-theme-switching'), 480);
  }
  return def;
}
