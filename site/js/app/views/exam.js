// Full Exam Simulation View (#/exam/:id?source=generated|0903|1503&resume=1)
// Focused Exam Mode, slide-over Grid Drawer (no 3-col reading crush), Untimed option,
// active-exam conflict warning, pending-self-grade Results banner & full stats/mistakes sync.

import { getSubject, loadSubjects } from '../../subjects/index.js';
import { createRng, randomSeed } from '../../core/rng.js';
import { checkAnswer } from '../../core/contract.js';
import { getExamConfig, evaluateExam, getScoreGrade } from '../../core/scoring.js';
import { haptic } from '../../core/native.js';
import {
  loadState,
  saveActiveExam,
  recordCompletedExam,
  recordExamOpenSelfGrade,
  syncExamScoreAndAchievements,
  addTasksToMistakes,
} from '../../core/storage.js';
import { mountTaskView, hasResponse } from '../task-view.js';
import { t, subjectTitle, subjectShort, examDesc } from '../i18n.js';
import { icon } from '../icons.js';
import { escapeHtml, prepareRichHtml, hydrateMath } from '../math.js';
import { oaAnimateCounter, oaFireFxPulse } from '../ui-kit.js';

function formatClock(totalSeconds) {
  const s = Math.max(0, Math.floor(totalSeconds));
  const hrs = Math.floor(s / 3600);
  const mins = Math.floor((s % 3600) / 60);
  const secs = s % 60;
  if (hrs > 0) {
    return `${hrs}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function safePreviewText(html, maxLen = 110) {
  const plain = String(html ?? '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  if (plain.length <= maxLen) return plain;
  let cut = plain.slice(0, maxLen);
  const dollarCount = (cut.replace(/\\\$/g, '').match(/\$/g) || []).length;
  if (dollarCount % 2 === 1) {
    const lastDollar = cut.lastIndexOf('$');
    if (lastDollar > 10) cut = cut.slice(0, lastDollar).trim();
  }
  return `${cut}…`;
}

function buildScoreInsight(evaluation) {
  const { scaledScore, scaledMax, rawMax, topicBreakdown } = evaluation;
  if (!scaledMax || scaledMax <= 0) return '';
  const pct100 = (scaledScore / scaledMax) * 100;
  const parts = [];

  if (pct100 >= 85) {
    parts.push(t('resultsInsightTopTier'));
  } else {
    let target = 40;
    let tierName = t('gradeSatisfactoryLabel');
    if (pct100 >= 65) {
      target = 85;
      tierName = t('gradeExcellentLabel');
    } else if (pct100 >= 40) {
      target = 65;
      tierName = t('gradeGoodLabel');
    }
    const targetScaled = (target / 100) * scaledMax;
    const missingScaled = Math.max(0.5, targetScaled - scaledScore);
    const ptsPerRaw = rawMax > 0 ? scaledMax / rawMax : 2.5;
    const neededRaw = Math.max(1, Math.ceil(missingScaled / ptsPerRaw));
    parts.push(t('resultsInsightNextTier', { tier: tierName, target: Math.round(targetScaled), pts: neededRaw }));
  }

  const weakest = topicBreakdown?.[0];
  if (weakest && weakest.pct < 80) {
    parts.push(t('resultsInsightWeakTopic', { topic: weakest.topic, pct: weakest.pct }));
  }

  return parts.join(' ');
}

export async function renderExamView(container, { params, query, navigate, setKeyHandler, setCleanup, setFocusedExamMode, showToast }) {
  const targetId = params.id || 'math';
  const sourceParam = query.get('source') || 'generated';
  const resumeRequested = query.get('resume') === '1';

  const isAllMode = targetId === 'all';
  const state = loadState();
  const needsAllSubjects = isAllMode || (resumeRequested && state.activeExam?.targetId === 'all');
  let allSubjects;
  let singleSubject = null;

  if (needsAllSubjects) {
    allSubjects = await loadSubjects();
    singleSubject = !isAllMode ? allSubjects[targetId] : null;
  } else {
    singleSubject = await getSubject(targetId);
    allSubjects = singleSubject ? { [targetId]: singleSubject } : {};
  }

  if (!isAllMode && !singleSubject) {
    navigate('#/');
    return;
  }

  // Preload originals once per subject so Exam Setup toggles stay 100% synchronous
  const singleOrigs = singleSubject?.originals ? await singleSubject.originals() : [];

  let timerHandle = null;
  let drawerOpen = false;
  let confirmSubmitOpen = false;
  let paused = false;
  let unansweredAddedToMistakes = false;

  const stopTimer = () => {
    if (timerHandle) {
      clearInterval(timerHandle);
      timerHandle = null;
    }
  };
  if (setCleanup) {
    setCleanup(() => {
      stopTimer();
      if (setFocusedExamMode) setFocusedExamMode(false);
    });
  }

  let session = null;

  const explicitSource = query.get('source');
  if (
    state.activeExam &&
    (resumeRequested ||
      (state.activeExam.targetId === targetId &&
        (!explicitSource || state.activeExam.source === explicitSource)))
  ) {
    session = state.activeExam;
  }

  let viewPhase = session ? 'running' : 'setup'; // 'setup' | 'running' | 'results'
  let examResults = null;
  let reviewFilter = 'all'; // 'all' | 'wrong' | 'flagged' | 'open'
  let expandedReviewIndex = null;

  // Setup state
  let selectedSector = 'ru-sector';
  let selectedSource = ['0903', '1503'].includes(sourceParam) ? sourceParam : 'generated';
  let untimedMode = false;

  async function buildSessionTasks(chosenTarget, chosenSource, sectorChoice, isUntimed) {
    const seed = randomSeed();
    const rng = createRng(seed);
    const tasks = [];
    const sections = [];
    let durationMin = 60;
    let title = '';

    if (chosenTarget === 'all') {
      const SECTOR_MAP = {
        'ru-sector': { ids: ['ru', 'math', 'en'], titleKey: 'examSectorRuTitle', mins: 180 },
        'az-sector': { ids: ['az', 'math', 'en'], titleKey: 'examSectorAzTitle', mins: 180 },
        'all-4':     { ids: ['ru', 'az', 'math', 'en'], titleKey: 'examSectorAllTitle', mins: 240 },
        'group-1':   { ids: ['math', 'physics', 'informatics'], titleKey: 'examSectorGroup1Title', mins: 180 },
        'group-2':   { ids: ['math', 'geography', 'history'], titleKey: 'examSectorGroup2Title', mins: 180 },
        'group-3':   { ids: ['ru', 'history', 'az'], titleKey: 'examSectorGroup3Title', mins: 180 },
        'group-4':   { ids: ['biology', 'chemistry', 'physics'], titleKey: 'examSectorGroup4Title', mins: 180 },
      };
      const spec = SECTOR_MAP[sectorChoice] || SECTOR_MAP['ru-sector'];
      const subjectIds = spec.ids;
      title = t(spec.titleKey);
      durationMin = spec.mins;

      for (const sid of subjectIds) {
        const mod = allSubjects[sid];
        if (!mod) continue;
        const startIdx = tasks.length;
        const subTasks = await loadSubjectTasksForExam(mod, chosenSource, rng.fork(sid));
        tasks.push(...subTasks);
        if (subTasks.length > 0) {
          sections.push({
            title: subjectTitle(sid),
            subjectId: sid,
            from: startIdx,
            to: tasks.length - 1,
          });
        }
      }
    } else {
      const mod = allSubjects[chosenTarget];
      const cfg = getExamConfig(mod);
      const locSubj = subjectTitle(chosenTarget);
      title = chosenSource !== 'generated'
        ? t('examTitleOrig', { subject: locSubj, date: chosenSource === '0903' ? '09.03.2026' : '15.03.2026' })
        : t('examTitleGen', { subject: locSubj });
      durationMin = cfg.durationMin || 60;
      const subTasks = await loadSubjectTasksForExam(mod, chosenSource, rng);
      tasks.push(...subTasks);

      if (Array.isArray(cfg.sections) && cfg.sections.length > 0 && tasks.length >= 20) {
        for (const sec of cfg.sections) {
          if (sec.from < tasks.length) {
            sections.push({
              title: sec.title,
              subjectId: chosenTarget,
              from: sec.from,
              to: Math.min(sec.to, tasks.length - 1),
            });
          }
        }
      } else {
        sections.push({
          title: locSubj,
          subjectId: chosenTarget,
          from: 0,
          to: Math.max(0, tasks.length - 1),
        });
      }
    }

    return {
      id: `exam-${Date.now()}`,
      targetId: chosenTarget,
      subjectId: chosenTarget,
      source: chosenSource,
      sector: sectorChoice,
      untimed: Boolean(isUntimed),
      title,
      seed,
      tasks,
      sections,
      responses: {},
      flags: {},
      taskDurations: {},
      currentIndex: 0,
      durationSec: durationMin * 60,
      remainingSec: durationMin * 60,
      elapsedSec: 0,
      startedAt: Date.now(),
    };
  }

  async function loadSubjectTasksForExam(mod, sourceMode, rng) {
    if (sourceMode === '0903' || sourceMode === '1503') {
      const origs = mod.originals ? await mod.originals() : [];
      const tag = sourceMode === '0903' ? '09.03' : '15.03';
      const filtered = origs.filter((o) => {
        const pdf = String(o.origin?.pdf ?? o.id ?? '');
        return pdf.includes(tag) || pdf.includes(sourceMode);
      });
      if (filtered.length > 0) {
        return filtered.map((tObj, i) => ({
          ...tObj,
          id: tObj.id || `${mod.id}-${sourceMode}-${i + 1}`,
        }));
      }
    }
    const rawList = mod.buildExam ? mod.buildExam(rng) : [];
    return rawList.map((tObj, i) => {
      const copy = { ...tObj };
      copy.subject ??= mod.id;
      copy.source ??= 'generated';
      copy.id ??= `${mod.id}.exam#${rng.seed}-${i + 1}`;
      return copy;
    });
  }

  function startCountdown() {
    stopTimer();
    timerHandle = setInterval(() => {
      if (!session || viewPhase !== 'running' || paused) return;
      session.elapsedSec = (session.elapsedSec ?? 0) + 1;

      if (typeof document === 'undefined' || !document.hidden) {
        const curTask = session.tasks?.[session.currentIndex || 0];
        if (curTask?.id) {
          session.taskDurations ??= {};
          session.taskDurations[curTask.id] = (session.taskDurations[curTask.id] || 0) + 1;
        }
      }

      if (!session.untimed) {
        session.remainingSec = Math.max(0, (session.remainingSec ?? 0) - 1);
      }

      if (session.elapsedSec % 5 === 0) {
        saveActiveExam(session);
      }

      const clockEl = container.querySelector('.exam-timer__clock');
      const timerWrap = container.querySelector('.exam-timer');
      if (clockEl) {
        clockEl.textContent = formatClock(session.untimed ? session.elapsedSec : session.remainingSec);
      }
      if (timerWrap && !session.untimed) {
        timerWrap.classList.toggle('is-warn', session.remainingSec <= 900 && session.remainingSec > 300);
        timerWrap.classList.toggle('is-crit', session.remainingSec <= 300);
      }
      if (!session.untimed && session.remainingSec <= 0) {
        submitExam();
      }
    }, 1000);
  }

  function computeEvaluation(chosenTarget, tasks, responses) {
    if (chosenTarget === 'all') {
      const bySubj = new Map();
      for (const tObj of tasks) {
        if (!bySubj.has(tObj.subject)) bySubj.set(tObj.subject, []);
        bySubj.get(tObj.subject).push(tObj);
      }
      const perSubject = [];
      let totalScaled = 0;
      let totalScaledMax = 0;
      let totalRawEarned = 0;
      let totalRawMax = 0;
      const allTopics = [];
      let cCorrect = 0, cPartial = 0, cWrong = 0, cUnans = 0, cPending = 0, cUngradedOpen = 0;

      for (const [sid, subTasks] of bySubj.entries()) {
        const subEv = evaluateExam(subTasks, responses, allSubjects[sid]);
        perSubject.push({
          subjectId: sid,
          title: subjectTitle(sid),
          ...subEv,
        });
        totalScaled += subEv.scaledScore;
        totalScaledMax += subEv.scaledMax;
        totalRawEarned += subEv.rawEarned;
        totalRawMax += subEv.rawMax;
        cCorrect += subEv.counts.correct;
        cPartial += subEv.counts.partial;
        cWrong += subEv.counts.wrong;
        cUnans += subEv.counts.unanswered;
        cPending += subEv.counts.pending || 0;
        cUngradedOpen += subEv.counts.ungradedOpen || 0;
        allTopics.push(...subEv.topicBreakdown);
      }

      const baseEv = evaluateExam(tasks, responses, null);
      return {
        rawEarned: Math.round(totalRawEarned * 100) / 100,
        rawMax: Math.round(totalRawMax * 100) / 100,
        scaledScore: Math.round(totalScaled * 10) / 10,
        scaledMax: totalScaledMax,
        pct: totalScaledMax > 0 ? Math.round((totalScaled / totalScaledMax) * 100) : 0,
        grade: getScoreGrade(totalScaledMax > 0 ? (totalScaled / totalScaledMax) * 100 : 0, 40),
        counts: {
          total: tasks.length,
          correct: cCorrect,
          partial: cPartial,
          wrong: cWrong,
          unanswered: cUnans,
          pending: cPending,
          ungradedOpen: cUngradedOpen,
        },
        topicBreakdown: allTopics.sort((a, b) => a.pct - b.pct),
        itemResults: baseEv.itemResults,
        perSubject,
      };
    }
    return evaluateExam(tasks, responses, allSubjects[chosenTarget]);
  }

  function submitExam() {
    if (!session) return;
    haptic('medium');
    stopTimer();
    confirmSubmitOpen = false;
    drawerOpen = false;
    if (setFocusedExamMode) setFocusedExamMode(false);

    const tasks = session.tasks;
    const responses = session.responses || {};
    const evaluation = computeEvaluation(session.targetId, tasks, responses);

    const elapsedSec = session.untimed
      ? Math.max(1, session.elapsedSec || 1)
      : Math.max(1, (session.durationSec || 3600) - (session.remainingSec || 0));

    const summary = {
      id: session.id,
      targetId: session.targetId,
      title: session.title,
      source: session.source,
      untimed: Boolean(session.untimed),
      completedAt: Date.now(),
      elapsedSec,
      scaledScore: evaluation.scaledScore,
      scaledMax: evaluation.scaledMax,
      rawEarned: evaluation.rawEarned,
      rawMax: evaluation.rawMax,
      pct: evaluation.pct,
      counts: evaluation.counts,
    };

    const taskDurations = session.taskDurations || {};
    const timedItemResults = evaluation.itemResults.map((item) => ({
      ...item,
      durationSec: Number(taskDurations[item.task?.id] || 0),
    }));

    recordCompletedExam(summary, timedItemResults);
    unansweredAddedToMistakes = false;
    examResults = {
      summary,
      evaluation,
      tasks,
      responses: { ...responses },
      flags: { ...(session.flags || {}) },
    };
    session = null;
    viewPhase = 'results';
    render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function renderActiveExamConflictBanner() {
    const active = loadState().activeExam;
    if (!active) return '';
    const done = (active.tasks || []).filter((tk) => hasResponse(tk, active.responses?.[tk.id])).length;
    const total = active.tasks?.length || 0;
    return `
      <div class="active-exam-banner active-exam-banner--compact" role="region" aria-label="${escapeHtml(t('examActiveBanner'))}">
        <div class="active-exam-banner__info">
          <span class="active-exam-banner__dot" aria-hidden="true"></span>
          <div>
            <strong>${escapeHtml(t('examConflictTitle', { title: active.title || subjectTitle(active.subjectId) }))}</strong>
            <span class="text-secondary"> · ${escapeHtml(t('examConflictDesc', { done, total }))}</span>
          </div>
        </div>
        <div class="active-exam-banner__actions">
          <a href="#/exam/${escapeHtml(active.subjectId)}?resume=1" class="btn btn--secondary btn--sm">
            <span>${escapeHtml(t('examConflictReturn'))}</span>
            ${icon('arrow-right', { size: 15 })}
          </a>
        </div>
      </div>
    `;
  }

  function renderSetup(focusSelector = null) {
    if (setFocusedExamMode) setFocusedExamMode(false);
    if (setKeyHandler) setKeyHandler(null);

    if (isAllMode) {
      const isBlockGroup = selectedSector.startsWith('group-');
      if (isBlockGroup) selectedSource = 'generated';
      const sectorDurationMin = selectedSector === 'all-4' ? 240 : 180;
      container.innerHTML = `
        <div class="page-container page-container--narrow">
          <nav class="breadcrumbs" aria-label="${escapeHtml(t('breadcrumbsAria'))}">
            <a href="#/">${escapeHtml(t('navHome'))}</a>
            <span aria-hidden="true">/</span>
            <span aria-current="page">${escapeHtml(t('examAllBreadcrumb'))}</span>
          </nav>

          ${renderActiveExamConflictBanner()}

          <section class="exam-setup-card" data-specular>
            <div class="exam-setup-card__head">
              <h1 class="exam-setup-title">${escapeHtml(t('examAllTitle'))}</h1>
              <p class="page-lead text-secondary">${escapeHtml(t('examAllSubtitle'))}</p>
            </div>

            <div class="setup-field">
              <span class="setup-label">${escapeHtml(t('examSetupSectorLabel'))}</span>
              <div class="setup-options-grid" role="radiogroup" aria-label="${escapeHtml(t('examSetupSectorLabel'))}">
                <button type="button" role="radio" aria-checked="${selectedSector === 'ru-sector'}" class="setup-option ${selectedSector === 'ru-sector' ? 'is-selected' : ''}" data-sector="ru-sector">
                  <strong>${escapeHtml(t('examSectorRuTitle'))}</strong>
                  <span>${escapeHtml(t('examSectorRuDesc'))}</span>
                </button>
                <button type="button" role="radio" aria-checked="${selectedSector === 'az-sector'}" class="setup-option ${selectedSector === 'az-sector' ? 'is-selected' : ''}" data-sector="az-sector">
                  <strong>${escapeHtml(t('examSectorAzTitle'))}</strong>
                  <span>${escapeHtml(t('examSectorAzDesc'))}</span>
                </button>
                <button type="button" role="radio" aria-checked="${selectedSector === 'all-4'}" class="setup-option ${selectedSector === 'all-4' ? 'is-selected' : ''}" data-sector="all-4">
                  <strong>${escapeHtml(t('examSectorAllTitle'))}</strong>
                  <span>${escapeHtml(t('examSectorAllDesc'))}</span>
                </button>
                <button type="button" role="radio" aria-checked="${selectedSector === 'group-1'}" class="setup-option ${selectedSector === 'group-1' ? 'is-selected' : ''}" data-sector="group-1">
                  <strong>${escapeHtml(t('examSectorGroup1Title'))}</strong>
                  <span>${escapeHtml(t('examSectorGroup1'))}</span>
                </button>
                <button type="button" role="radio" aria-checked="${selectedSector === 'group-2'}" class="setup-option ${selectedSector === 'group-2' ? 'is-selected' : ''}" data-sector="group-2">
                  <strong>${escapeHtml(t('examSectorGroup2Title'))}</strong>
                  <span>${escapeHtml(t('examSectorGroup2'))}</span>
                </button>
                <button type="button" role="radio" aria-checked="${selectedSector === 'group-3'}" class="setup-option ${selectedSector === 'group-3' ? 'is-selected' : ''}" data-sector="group-3">
                  <strong>${escapeHtml(t('examSectorGroup3Title'))}</strong>
                  <span>${escapeHtml(t('examSectorGroup3'))}</span>
                </button>
                <button type="button" role="radio" aria-checked="${selectedSector === 'group-4'}" class="setup-option ${selectedSector === 'group-4' ? 'is-selected' : ''}" data-sector="group-4">
                  <strong>${escapeHtml(t('examSectorGroup4Title'))}</strong>
                  <span>${escapeHtml(t('examSectorGroup4'))}</span>
                </button>
              </div>
            </div>

            ${!isBlockGroup ? `
              <div class="setup-field">
                <span class="setup-label">${escapeHtml(t('examSetupSourceLabel'))}</span>
                <div class="setup-pills" role="group" aria-label="${escapeHtml(t('examSetupSourceLabel'))}">
                  <button type="button" class="seg-btn ${selectedSource === 'generated' ? 'is-active' : ''}" data-source="generated" aria-pressed="${selectedSource === 'generated'}">
                    ${icon('sparkles', { size: 14 })} <span>${escapeHtml(t('examSourceGen'))}</span>
                  </button>
                  <button type="button" class="seg-btn ${selectedSource === '0903' ? 'is-active' : ''}" data-source="0903" aria-pressed="${selectedSource === '0903'}">
                    ${icon('file-text', { size: 14 })} <span>${escapeHtml(t('examSource0903'))}</span>
                  </button>
                  <button type="button" class="seg-btn ${selectedSource === '1503' ? 'is-active' : ''}" data-source="1503" aria-pressed="${selectedSource === '1503'}">
                    ${icon('file-text', { size: 14 })} <span>${escapeHtml(t('examSource1503'))}</span>
                  </button>
                </div>
              </div>
            ` : ''}

            <div class="setup-field">
              <span class="setup-label">${escapeHtml(t('examTimerModeLabel'))}</span>
              <div class="setup-pills" role="group" aria-label="${escapeHtml(t('examTimerModeLabel'))}">
                <button type="button" class="seg-btn ${!untimedMode ? 'is-active' : ''}" data-untimed="0" aria-pressed="${!untimedMode}">
                  ${icon('clock', { size: 14 })} <span>${escapeHtml(t('examTimedOpt', { min: sectorDurationMin }))}</span>
                </button>
                <button type="button" class="seg-btn ${untimedMode ? 'is-active' : ''}" data-untimed="1" aria-pressed="${untimedMode}">
                  <span>${escapeHtml(t('examUntimedOpt'))}</span>
                </button>
              </div>
            </div>

            <div class="exam-setup-card__foot">
              <a href="#/" class="btn btn--ghost">
                ${icon('arrow-left', { size: 15 })}
                <span>${escapeHtml(t('btnBack'))}</span>
              </a>
              <button type="button" class="btn btn--primary btn--lg" data-action="begin-exam">
                <span>${escapeHtml(t('examBeginAllBtn'))}</span>
                ${icon('arrow-right', { size: 16 })}
              </button>
            </div>
          </section>
        </div>
      `;

      container.querySelectorAll('[data-sector]').forEach((btn) => {
        btn.addEventListener('click', () => {
          selectedSector = btn.dataset.sector;
          renderSetup(`[data-sector="${selectedSector}"]`);
        });
      });
      container.querySelectorAll('[data-source]').forEach((btn) => {
        btn.addEventListener('click', () => {
          selectedSource = btn.dataset.source;
          renderSetup(`[data-source="${selectedSource}"]`);
        });
      });
      container.querySelectorAll('[data-untimed]').forEach((btn) => {
        btn.addEventListener('click', () => {
          untimedMode = btn.dataset.untimed === '1';
          renderSetup(`[data-untimed="${untimedMode ? '1' : '0'}"]`);
        });
      });
      container.querySelector('[data-action="begin-exam"]')?.addEventListener('click', async (e) => {
        haptic('light');
        e.currentTarget.disabled = true;
        e.currentTarget.textContent = t('examBuilding');
        session = await buildSessionTasks('all', selectedSource, selectedSector, untimedMode);
        saveActiveExam(session);
        viewPhase = 'running';
        startCountdown();
        render();
        window.scrollTo({ top: 0 });
      });
      if (focusSelector) container.querySelector(focusSelector)?.focus({ preventScroll: true });
      return;
    }

    // Single-subject exam setup (100% synchronous using cached singleOrigs)
    const mod = singleSubject;
    const cfg = getExamConfig(mod);
    const locSubject = subjectTitle(mod.id);
    const has0903 = singleOrigs.some((o) => String(o.origin?.pdf ?? o.id).includes('09.03') || String(o.origin?.pdf ?? o.id).includes('0903'));
    const has1503 = singleOrigs.some((o) => String(o.origin?.pdf ?? o.id).includes('15.03') || String(o.origin?.pdf ?? o.id).includes('1503'));
    const introText = examDesc(mod.id, cfg.description || '');

    container.innerHTML = `
      <div class="page-container page-container--narrow">
        <nav class="breadcrumbs" aria-label="${escapeHtml(t('breadcrumbsAria'))}">
          <a href="#/">${escapeHtml(t('navHome'))}</a>
          <span aria-hidden="true">/</span>
          <a href="#/subject/${escapeHtml(mod.id)}">${escapeHtml(locSubject)}</a>
          <span aria-hidden="true">/</span>
          <span aria-current="page">${escapeHtml(t('examBreadcrumb'))}</span>
        </nav>

        ${renderActiveExamConflictBanner()}

        <section class="exam-setup-card">
          <div class="exam-setup-card__head">
            <h1 class="exam-setup-title">${escapeHtml(t('examSetupTitle', { subject: locSubject }))}</h1>
            <p class="page-lead text-secondary">${escapeHtml(introText)}</p>
          </div>

          <!-- Hairline-divided rule strip (flat — zero nested rule-box cards!) -->
          <div class="exam-rules-strip">
            <div class="rule-cell">
              <span class="rule-cell__val tabular-nums">${cfg.expectedTasks}</span>
              <span class="rule-cell__lbl">${escapeHtml(t('examRuleTasks'))}</span>
            </div>
            <div class="rule-cell">
              <span class="rule-cell__val tabular-nums">${untimedMode ? escapeHtml(t('examRuleUntimedVal')) : escapeHtml(t('examRuleMinVal', { min: cfg.durationMin }))}</span>
              <span class="rule-cell__lbl">${escapeHtml(t('examRuleTimer'))}</span>
            </div>
            <div class="rule-cell">
              <span class="rule-cell__val tabular-nums">100</span>
              <span class="rule-cell__lbl">${escapeHtml(t('examRuleScale'))}</span>
            </div>
            <div class="rule-cell">
              <span class="rule-cell__val">${escapeHtml(t('examRuleNoPenaltyVal'))}</span>
              <span class="rule-cell__lbl">${escapeHtml(t('examRulePenalty'))}</span>
            </div>
          </div>

          ${(has0903 || has1503) ? `
            <div class="setup-field">
              <span class="setup-label">${escapeHtml(t('examSetupSourceLabel'))}</span>
              <div class="setup-pills" role="group" aria-label="${escapeHtml(t('examSetupSourceLabel'))}">
                <button type="button" class="seg-btn ${selectedSource === 'generated' ? 'is-active' : ''}" data-source="generated" aria-pressed="${selectedSource === 'generated'}">
                  ${icon('sparkles', { size: 14 })} <span>${escapeHtml(t('examSourceGen'))}</span>
                </button>
                <button type="button" class="seg-btn ${selectedSource === '0903' ? 'is-active' : ''}" data-source="0903" aria-pressed="${selectedSource === '0903'}" ${!has0903 ? `disabled title="${escapeHtml(t('examSourceUnavailable'))}"` : ''}>
                  ${icon('file-text', { size: 14 })} <span>${escapeHtml(t('examSource0903'))}</span>
                </button>
                <button type="button" class="seg-btn ${selectedSource === '1503' ? 'is-active' : ''}" data-source="1503" aria-pressed="${selectedSource === '1503'}" ${!has1503 ? `disabled title="${escapeHtml(t('examSourceUnavailable'))}"` : ''}>
                  ${icon('file-text', { size: 14 })} <span>${escapeHtml(t('examSource1503'))}</span>
                </button>
              </div>
            </div>
          ` : ''}

          <div class="setup-field">
            <span class="setup-label">${escapeHtml(t('examTimerModeLabel'))}</span>
            <div class="setup-pills" role="group" aria-label="${escapeHtml(t('examTimerModeLabel'))}">
              <button type="button" class="seg-btn ${!untimedMode ? 'is-active' : ''}" data-untimed="0" aria-pressed="${!untimedMode}">
                ${icon('clock', { size: 14 })} <span>${escapeHtml(t('examTimedOpt', { min: cfg.durationMin }))}</span>
              </button>
              <button type="button" class="seg-btn ${untimedMode ? 'is-active' : ''}" data-untimed="1" aria-pressed="${untimedMode}">
                <span>${escapeHtml(t('examUntimedOpt'))}</span>
              </button>
            </div>
          </div>

          ${Array.isArray(cfg.sections) && cfg.sections.length > 0 ? `
            <div class="setup-sections">
              <div class="setup-label">${escapeHtml(t('examSectionsLabel'))}</div>
              <ul class="setup-sections__list">
                ${cfg.sections.map((s) => `
                  <li>
                    <span>${escapeHtml(s.title)}</span>
                    <span class="text-muted tabular-nums">${escapeHtml(t('examSectionRange', { from: s.from + 1, to: s.to + 1 }))}</span>
                  </li>
                `).join('')}
              </ul>
            </div>
          ` : ''}

          <div class="exam-setup-card__foot">
            <a href="#/subject/${escapeHtml(mod.id)}" class="btn btn--ghost">
              ${icon('arrow-left', { size: 15 })}
              <span>${escapeHtml(t('examBackToTopics'))}</span>
            </a>
            <button type="button" class="btn btn--primary btn--lg" data-action="begin-exam">
              <span>${escapeHtml(t('examBeginBtn'))}</span>
              ${icon('arrow-right', { size: 16 })}
            </button>
          </div>
        </section>
      </div>
    `;

    hydrateMath(container);

    container.querySelectorAll('[data-source]').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (btn.disabled) return;
        selectedSource = btn.dataset.source;
        renderSetup(`[data-source="${selectedSource}"]`);
      });
    });
    container.querySelectorAll('[data-untimed]').forEach((btn) => {
      btn.addEventListener('click', () => {
        untimedMode = btn.dataset.untimed === '1';
        renderSetup(`[data-untimed="${untimedMode ? '1' : '0'}"]`);
      });
    });

    container.querySelector('[data-action="begin-exam"]')?.addEventListener('click', async (e) => {
      haptic('light');
      e.currentTarget.disabled = true;
      e.currentTarget.textContent = t('examBuilding');
      session = await buildSessionTasks(mod.id, selectedSource, selectedSector, untimedMode);
      if (session.tasks.length === 0) {
        container.innerHTML = `<div class="page-container"><div class="empty-card">${escapeHtml(t('examNoTasks'))} <a href="#/">${escapeHtml(t('backToHome'))}</a></div></div>`;
        return;
      }
      saveActiveExam(session);
      viewPhase = 'running';
      startCountdown();
      render();
      window.scrollTo({ top: 0 });
    });

    if (focusSelector) container.querySelector(focusSelector)?.focus({ preventScroll: true });
  }

  function renderGridSectionsHtml(tasks, idx) {
    return (session.sections || [{ title: t('examGridTitle'), from: 0, to: tasks.length - 1 }]).map((sec) => {
      const nums = [];
      for (let n = sec.from; n <= sec.to && n < tasks.length; n++) {
        const tk = tasks[n];
        const isCur = n === idx;
        const isAns = hasResponse(tk, session.responses[tk.id]);
        const isFlg = Boolean(session.flags?.[tk.id]);
        const ariaStr = `${t('examGridTaskAria', { n: n + 1 })}${isAns ? t('examGridAnsweredSuffix') : ''}${isFlg ? t('examGridFlaggedSuffix') : ''}`;
        nums.push(`
          <button
            type="button"
            class="grid-num-btn mono-code ${isCur ? 'is-current' : ''} ${isAns ? 'is-answered' : ''} ${isFlg ? 'is-flagged' : ''}"
            data-action="jump-task"
            data-index="${n}"
            aria-label="${escapeHtml(ariaStr)}"
            aria-current="${isCur ? 'step' : 'false'}"
          >
            ${n + 1}
            ${isFlg ? '<span class="grid-flag-dot" aria-hidden="true"></span>' : ''}
          </button>
        `);
      }
      return `
        <div class="exam-grid-section">
          <div class="exam-grid-section__title">${escapeHtml(sec.title)}</div>
          <div class="exam-grid-numbers">${nums.join('')}</div>
        </div>
      `;
    }).join('');
  }

  function renderRunning() {
    if (!session || !session.tasks?.length) {
      viewPhase = 'setup';
      render();
      return;
    }

    if (setFocusedExamMode) setFocusedExamMode(true);

    const tasks = session.tasks;
    const idx = Math.max(0, Math.min(tasks.length - 1, session.currentIndex || 0));
    session.currentIndex = idx;
    const currentTask = tasks[idx];
    const hasPassage = Boolean(currentTask?.passage?.html);
    const answeredCount = tasks.filter((tk) => hasResponse(tk, session.responses[tk.id])).length;
    const flaggedCount = Object.values(session.flags || {}).filter(Boolean).length;

    const timerWarn = !session.untimed && session.remainingSec <= 900 && session.remainingSec > 300;
    const timerCrit = !session.untimed && session.remainingSec <= 300;
    const clockText = formatClock(session.untimed ? (session.elapsedSec || 0) : session.remainingSec);
    const shortTopbarTitle = session.targetId === 'all' ? 'DİM' : subjectShort(session.subjectId);

    const gridInnerHtml = `
      <div class="exam-grid-sections">${renderGridSectionsHtml(tasks, idx)}</div>
      <div class="exam-grid-legend">
        <span><i class="legend-dot legend-dot--cur"></i> ${escapeHtml(t('examLegendCurrent'))}</span>
        <span><i class="legend-dot legend-dot--ans"></i> ${escapeHtml(t('examLegendAnswered'))}</span>
        <span><i class="legend-dot legend-dot--flg"></i> ${escapeHtml(t('examLegendFlagged'))}</span>
      </div>
    `;

    container.innerHTML = `
      <!-- Focused Exam Mode Unified 56px Sticky Top Bar (replaces distracting global nav) -->
      <header class="exam-topbar">
        <div class="exam-topbar__inner">
          <div class="exam-topbar__left">
            <a href="#/" class="btn btn--ghost btn--sm exam-topbar__exit" aria-label="${escapeHtml(t('examExitAria'))}" title="${escapeHtml(t('examExitAria'))}">
              ${icon('arrow-left', { size: 16 })}
              <span class="hide-sm">${escapeHtml(t('examExitLabel'))}</span>
            </a>
            <div class="exam-topbar__title-group">
              <h1 class="exam-topbar__title" title="${escapeHtml(session.title)}">
                <span class="exam-topbar__title-full">${escapeHtml(session.title)}</span>
                <span class="exam-topbar__title-short" aria-hidden="true">${escapeHtml(shortTopbarTitle)}</span>
              </h1>
              <span class="exam-topbar__progress tabular-nums hide-sm">
                ${escapeHtml(t('examAnsweredProgress', { done: answeredCount, total: tasks.length }))}${flaggedCount > 0 ? ` · ${flaggedCount}` : ''}
              </span>
            </div>
          </div>

          <div class="exam-topbar__right">
            <div class="exam-timer ${timerWarn ? 'is-warn' : ''} ${timerCrit ? 'is-crit' : ''}" aria-live="off">
              <span class="exam-timer__icon" aria-hidden="true">${icon('clock', { size: 15 })}</span>
              <span class="exam-timer__clock mono-code tabular-nums">${clockText}</span>
              ${session.untimed ? `<span class="exam-timer__untimed hide-sm">${escapeHtml(t('examUntimedBadge'))}</span>` : ''}
              <button
                type="button"
                class="btn-icon btn-icon--sm exam-timer__pause"
                data-action="toggle-pause"
                title="${escapeHtml(paused ? t('examResumeTimerTitle') : t('examPauseTitle'))}"
                aria-label="${escapeHtml(paused ? t('examResumeTimerTitle') : t('examPauseTitle'))}"
                aria-pressed="${paused}"
              >${paused ? icon('play', { size: 14 }) : icon('pause', { size: 14 })}</button>
            </div>

            <button
              type="button"
              class="btn btn--secondary btn--sm exam-grid-trigger ${hasPassage ? 'is-always-drawer' : ''}"
              data-action="toggle-drawer"
              aria-expanded="${drawerOpen}"
              aria-controls="exam-grid-drawer"
            >
              ${icon('grid', { size: 15 })}
              <span class="tabular-nums">${idx + 1}/${tasks.length}</span>
            </button>

            <button type="button" class="btn btn--accent btn--sm" data-action="ask-finish">
              <span class="hide-xs">${escapeHtml(t('btnFinishExam'))}</span>
              <span class="show-xs-only">${escapeHtml(t('btnFinishExamShort'))}</span>
            </button>
          </div>
        </div>
      </header>

      <div class="page-container exam-running-container">
        ${confirmSubmitOpen ? `
          <div class="confirm-banner" role="alertdialog" aria-labelledby="confirm-title">
            <div>
              <strong id="confirm-title">${escapeHtml(t('examConfirmTitle'))}</strong>
              <p class="text-secondary">
                ${escapeHtml(t('examConfirmBody', { done: answeredCount, total: tasks.length }))}
                ${tasks.length - answeredCount > 0 ? escapeHtml(t('examConfirmRemaining', { left: tasks.length - answeredCount })) : escapeHtml(t('examConfirmAllFilled'))}
                ${flaggedCount > 0 ? ` ${escapeHtml(t('examConfirmFlagged', { flagged: flaggedCount }))}` : ''}
              </p>
            </div>
            <div class="confirm-banner__actions">
              <button type="button" class="btn btn--ghost btn--sm" data-action="cancel-finish">${escapeHtml(t('examConfirmCancel'))}</button>
              <button type="button" class="btn btn--primary btn--sm" data-action="confirm-finish">${escapeHtml(t('examConfirmYes'))}</button>
            </div>
          </div>
        ` : ''}

        <!-- Layout: 2-col ONLY when no reading passage AND >=1360px; slide-over drawer otherwise (zero 3-col crush!) -->
        <div class="exam-layout ${hasPassage ? 'exam-layout--has-passage' : ''}">
          <div class="exam-main-col ${paused ? 'is-paused' : ''}">
            ${paused ? `
              <div class="pause-overlay">
                <div class="pause-card">
                  <h2>${escapeHtml(t('examPausedHeading'))}</h2>
                  <p class="text-secondary">${escapeHtml(t('examPausedDesc'))}</p>
                  <button type="button" class="btn btn--primary" data-action="toggle-pause">
                    ${icon('play', { size: 15 })}
                    <span>${escapeHtml(t('examPausedResumeBtn'))}</span>
                  </button>
                </div>
              </div>
            ` : '<div id="exam-task-mount"></div>'}
          </div>

          ${!hasPassage ? `
            <aside class="exam-sidebar" aria-label="${escapeHtml(t('examGridNavAria'))}">
              <div class="exam-grid-card">
                <div class="exam-grid-card__head">
                  <strong>${escapeHtml(t('examGridTitle'))}</strong>
                  <span class="text-muted tabular-nums">${answeredCount} / ${tasks.length}</span>
                </div>
                ${gridInnerHtml}
              </div>
            </aside>
          ` : ''}
        </div>
      </div>

      <!-- Slide-Over Grid Drawer (used for reading passages & viewports <1360px) -->
      <div class="exam-drawer-backdrop ${drawerOpen ? 'is-open' : ''}" data-action="close-drawer" ${drawerOpen ? '' : 'hidden'}></div>
      <aside id="exam-grid-drawer" class="exam-drawer ${drawerOpen ? 'is-open' : ''}" role="dialog" aria-label="${escapeHtml(t('examGridTitle'))}" ${drawerOpen ? '' : 'hidden'}>
        <div class="exam-drawer__head">
          <div>
            <strong>${escapeHtml(t('examGridTitle'))}</strong>
            <span class="text-muted tabular-nums"> · ${escapeHtml(t('examAnsweredProgress', { done: answeredCount, total: tasks.length }))}</span>
          </div>
          <button type="button" class="btn-icon btn-icon--sm" data-action="close-drawer" aria-label="${escapeHtml(t('examGridCloseAria'))}">
            ${icon('x', { size: 16 })}
          </button>
        </div>
        <div class="exam-drawer__body">
          ${gridInnerHtml}
        </div>
      </aside>
    `;

    // Bind Topbar, Drawer & Confirm actions
    container.querySelectorAll('[data-action="toggle-pause"]').forEach((b) => {
      b.addEventListener('click', () => {
        paused = !paused;
        renderRunning();
      });
    });

    container.querySelector('[data-action="toggle-drawer"]')?.addEventListener('click', () => {
      drawerOpen = !drawerOpen;
      renderRunning();
      if (drawerOpen) {
        container.querySelector('#exam-grid-drawer [data-action="close-drawer"]')?.focus();
      } else {
        container.querySelector('[data-action="toggle-drawer"]')?.focus();
      }
    });

    container.querySelectorAll('[data-action="close-drawer"]').forEach((el) => {
      el.addEventListener('click', () => {
        drawerOpen = false;
        renderRunning();
        container.querySelector('[data-action="toggle-drawer"]')?.focus();
      });
    });

    container.querySelector('[data-action="ask-finish"]')?.addEventListener('click', () => {
      confirmSubmitOpen = true;
      drawerOpen = false;
      renderRunning();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      container.querySelector('[data-action="cancel-finish"]')?.focus();
    });
    container.querySelector('[data-action="cancel-finish"]')?.addEventListener('click', () => {
      confirmSubmitOpen = false;
      renderRunning();
      container.querySelector('[data-action="ask-finish"]')?.focus();
    });
    container.querySelector('[data-action="confirm-finish"]')?.addEventListener('click', () => {
      submitExam();
    });

    container.querySelectorAll('[data-action="jump-task"]').forEach((btn) => {
      btn.addEventListener('click', () => {
        session.currentIndex = Number(btn.dataset.index);
        drawerOpen = false;
        saveActiveExam(session);
        renderRunning();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });

    let taskController = null;
    if (!paused) {
      const mountEl = container.querySelector('#exam-task-mount');
      taskController = mountTaskView(mountEl, {
        task: currentTask,
        response: session.responses[currentTask.id],
        checked: false,
        mode: 'exam',
        taskNumber: idx + 1,
        totalTasks: tasks.length,
        flagged: Boolean(session.flags?.[currentTask.id]),
        onChange(newResp) {
          session.responses[currentTask.id] = newResp;
          saveActiveExam(session);
          // Live-update grid buttons & topbar progress without full re-render
          const isAns = hasResponse(currentTask, newResp);
          container.querySelectorAll(`[data-action="jump-task"][data-index="${idx}"]`).forEach((gb) => {
            gb.classList.toggle('is-answered', isAns);
          });
          const ansNow = tasks.filter((tk) => hasResponse(tk, session.responses[tk.id])).length;
          const progEl = container.querySelector('.exam-topbar__progress');
          if (progEl) {
            const flgNow = Object.values(session.flags || {}).filter(Boolean).length;
            progEl.textContent = `${t('examAnsweredProgress', { done: ansNow, total: tasks.length })}${flgNow > 0 ? ` · ${flgNow}` : ''}`;
          }
        },
        onToggleFlag() {
          session.flags[currentTask.id] = !session.flags[currentTask.id];
          saveActiveExam(session);
          renderRunning();
          container.querySelector('[data-action="toggle-flag"]')?.focus();
        },
        onPrev: idx > 0 ? () => {
          session.currentIndex = idx - 1;
          saveActiveExam(session);
          renderRunning();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } : null,
        onNext: idx < tasks.length - 1 ? () => {
          session.currentIndex = idx + 1;
          saveActiveExam(session);
          renderRunning();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } : null,
        onFinishExam() {
          confirmSubmitOpen = true;
          renderRunning();
          window.scrollTo({ top: 0, behavior: 'smooth' });
          container.querySelector('[data-action="cancel-finish"]')?.focus();
        },
      });
    }

    if (setKeyHandler) {
      setKeyHandler((e) => {
        // P1 #9: Escape dismisses confirm-banner or exam-drawer and restores focus!
        if (e.key === 'Escape') {
          if (confirmSubmitOpen) {
            e.preventDefault();
            confirmSubmitOpen = false;
            renderRunning();
            container.querySelector('[data-action="ask-finish"]')?.focus();
            return;
          }
          if (drawerOpen) {
            e.preventDefault();
            drawerOpen = false;
            renderRunning();
            container.querySelector('[data-action="toggle-drawer"]')?.focus();
            return;
          }
        }
        if (taskController) taskController.handleKeyDown(e);
      });
    }
  }

  function renderResults() {
    if (setFocusedExamMode) setFocusedExamMode(false);
    if (setKeyHandler) setKeyHandler(null);

    const { summary, evaluation, flags } = examResults;
    const { counts, topicBreakdown, itemResults, scaledScore, scaledMax, rawEarned, rawMax, grade, perSubject } = evaluation;

    const scoreRatio = scaledMax > 0 ? Math.min(1, scaledScore / scaledMax) : 0;
    const ringCircumference = 2 * Math.PI * 54;
    const dashOffset = ringCircumference * (1 - scoreRatio);

    const pendingItems = itemResults.filter((it) => it.status === 'pending');
    const ungradedOpenItems = itemResults.filter((it) => it.task.format === 'open' && (it.response?.self === undefined || it.response?.self === null));
    const unansweredItems = itemResults.filter((it) => it.status === 'unanswered');
    const openOrPartialCount = itemResults.filter((it) => it.status === 'partial' || it.status === 'pending' || it.task.format === 'open').length;

    const filteredItems = itemResults.filter((item) => {
      if (reviewFilter === 'wrong') return item.status === 'wrong' || item.status === 'unanswered' || item.status === 'pending';
      if (reviewFilter === 'flagged') return Boolean(flags[item.task.id]);
      if (reviewFilter === 'open') return item.status === 'partial' || item.status === 'pending' || item.task.format === 'open';
      return true;
    });

    const elapsedMin = Math.floor(summary.elapsedSec / 60);
    const elapsedSecRem = summary.elapsedSec % 60;
    const gradeLabel = grade.labelKey ? t(grade.labelKey) : grade.label;
    const gradeBadge = grade.badgeKey ? t(grade.badgeKey) : grade.badge;
    const scoreInsight = buildScoreInsight(evaluation);

    container.innerHTML = `
      <div class="page-container">
        <nav class="breadcrumbs" aria-label="${escapeHtml(t('breadcrumbsAria'))}">
          <a href="#/">${escapeHtml(t('navHome'))}</a>
          <span aria-hidden="true">/</span>
          ${summary.targetId !== 'all' ? `<a href="#/subject/${escapeHtml(summary.targetId)}">${escapeHtml(subjectTitle(summary.targetId))}</a><span aria-hidden="true">/</span>` : ''}
          <span aria-current="page">${escapeHtml(t('resultsBreadcrumb'))}</span>
        </nav>

        <!-- P0 #5: Calm Pending Self-Grade Banner for Open Tasks -->
        ${ungradedOpenItems.length > 0 ? `
          <div class="pending-grade-banner" role="region" aria-label="${escapeHtml(t('resultsPendingBannerTitle', { n: ungradedOpenItems.length }))}">
            <div class="pending-grade-banner__body">
              <span class="pending-grade-banner__icon" aria-hidden="true">${icon('clipboard-list', { size: 18 })}</span>
              <div>
                <strong>${escapeHtml(t('resultsPendingBannerTitle', { n: ungradedOpenItems.length }))}</strong>
                <p class="text-secondary">
                  ${pendingItems.length > 0
                    ? escapeHtml(t('resultsPendingBannerDrafts', { drafts: pendingItems.length }))
                    : escapeHtml(t('resultsPendingBannerNoDrafts'))}
                </p>
              </div>
            </div>
            <button type="button" class="btn btn--primary btn--sm" data-action="jump-ungraded-open">
              <span>${escapeHtml(t('resultsPendingBannerBtn'))}</span>
              ${icon('arrow-right', { size: 15 })}
            </button>
          </div>
        ` : ''}

        <!-- Results Hero Card (H1 first, grade & time quietly below — zero eyebrows above H1, zero nested stat cards) -->
        <section class="results-hero" data-specular>
          <div class="results-gauge-wrap">
            <svg class="score-ring score-ring--${grade.color}" viewBox="0 0 128 128" width="144" height="144" aria-hidden="true">
              <circle class="score-ring__bg" cx="64" cy="64" r="54" stroke-width="10" fill="none" />
              <circle
                class="score-ring__fg"
                cx="64" cy="64" r="54"
                stroke-width="10"
                fill="none"
                stroke-dasharray="${ringCircumference}"
                stroke-dashoffset="${dashOffset}"
                stroke-linecap="round"
                transform="rotate(-90 64 64)"
              />
            </svg>
            <div class="results-gauge__text">
              <strong class="tabular-nums">${scaledScore}</strong>
              <span>${escapeHtml(t('resultsOutOf', { max: scaledMax }))}</span>
            </div>
          </div>

          <div class="results-hero__info">
            <h1 class="results-hero__title">${escapeHtml(summary.title)}</h1>
            <div class="results-hero__meta">
              <span class="badge badge--grade-${grade.color}">${escapeHtml(gradeLabel)} · ${escapeHtml(gradeBadge)}</span>
              <span class="results-time text-muted tabular-nums">
                ${icon('clock', { size: 14 })}
                <span>${escapeHtml(t('resultsTimeLabel', { min: elapsedMin, sec: elapsedSecRem }))}</span>
              </span>
            </div>

            <p class="text-secondary tabular-nums">
              ${escapeHtml(t('resultsPrimaryLine', { earned: rawEarned, max: rawMax, pct: evaluation.pct, scaled: scaledScore, scaledMax }))}
            </p>

            ${scoreInsight ? `<p class="results-insight">${escapeHtml(scoreInsight)}</p>` : ''}

            <div class="results-counts-strip">
              <div class="res-stat res-stat--correct"><b class="tabular-nums">${counts.correct}</b><span>${escapeHtml(t('resultsCountCorrect'))}</span></div>
              ${counts.partial > 0 ? `<div class="res-stat res-stat--partial"><b class="tabular-nums">${counts.partial}</b><span>${escapeHtml(t('resultsCountPartial'))}</span></div>` : ''}
              <div class="res-stat res-stat--wrong"><b class="tabular-nums">${counts.wrong}</b><span>${escapeHtml(t('resultsCountWrong'))}</span></div>
              ${(counts.pending || 0) > 0 ? `<div class="res-stat res-stat--pending"><b class="tabular-nums">${counts.pending}</b><span>${escapeHtml(t('resultsCountPending'))}</span></div>` : ''}
              <div class="res-stat res-stat--unans"><b class="tabular-nums">${counts.unanswered}</b><span>${escapeHtml(t('resultsCountUnanswered'))}</span></div>
            </div>

            <div class="results-hero__actions">
              <button type="button" class="btn btn--primary" data-action="retake-exam">
                ${icon('refresh', { size: 15 })}
                <span>${escapeHtml(t('resultsRetakeBtn'))}</span>
              </button>
              <a href="#/mistakes" class="btn btn--secondary">${escapeHtml(t('resultsMistakesBtn'))}</a>
              ${unansweredItems.length > 0 && !unansweredAddedToMistakes ? `
                <button type="button" class="btn btn--ghost btn--sm" data-action="add-unanswered-mistakes">
                  ${escapeHtml(t('resultsAddUnansweredBtn', { n: unansweredItems.length }))}
                </button>
              ` : ''}
              <a href="#/" class="btn btn--ghost">${escapeHtml(t('backToHome'))}</a>
            </div>
          </div>
        </section>

        ${Array.isArray(perSubject) && perSubject.length > 0 ? `
          <section class="section-block">
            <div class="section-header">
              <h2 class="section-title">${escapeHtml(t('resultsPerSubjectHeading'))}</h2>
            </div>
            <div class="per-subject-results">
              ${perSubject.map((ps) => `
                <div class="ps-res-card subject-card--${escapeHtml(ps.subjectId)}">
                  <div class="ps-res-card__head">
                    <strong>${escapeHtml(ps.title)}</strong>
                    <span class="tabular-nums"><b>${ps.scaledScore}</b> / ${ps.scaledMax}</span>
                  </div>
                  <div class="progress-bar"><div class="progress-bar__fill" style="width:${Math.min(100, ps.scaledScore)}%"></div></div>
                  <div class="text-muted tabular-nums">${escapeHtml(t('resultsPerSubjectMeta', { earned: ps.rawEarned, max: ps.rawMax, correct: ps.counts.correct, total: ps.counts.total }))}</div>
                </div>
              `).join('')}
            </div>
          </section>
        ` : ''}

        <!-- Per-Topic Breakdown -->
        <section class="section-block" aria-labelledby="breakdown-heading">
          <div class="section-header">
            <h2 id="breakdown-heading" class="section-title">${escapeHtml(t('resultsBreakdownHeading'))}</h2>
            <p class="section-subtitle">${escapeHtml(t('resultsBreakdownSub'))}</p>
          </div>

          <div class="topic-breakdown-list">
            ${topicBreakdown.map((tb) => {
              const tone = tb.pct >= 80 ? 'correct' : tb.pct >= 50 ? 'partial' : 'wrong';
              return `
                <div class="tb-row">
                  <div class="tb-row__info">
                    <div class="tb-row__title">${escapeHtml(tb.topic)}</div>
                    <div class="tb-row__meta tabular-nums">${escapeHtml(t('resultsBreakdownMeta', { earned: tb.earned, max: tb.max, correct: tb.correct, total: tb.total }))}</div>
                  </div>
                  <div class="tb-row__bar-wrap">
                    <div class="progress-bar progress-bar--${tone}">
                      <div class="progress-bar__fill" style="width:${tb.pct}%"></div>
                    </div>
                    <span class="tb-row__pct tabular-nums">${tb.pct}%</span>
                  </div>
                  <a href="#/practice/${escapeHtml(tb.subject)}?topic=${encodeURIComponent(tb.topic)}" class="btn btn--secondary btn--xs">
                    <span>${escapeHtml(t('resultsTrainTopicBtn'))}</span>
                    ${icon('arrow-right', { size: 13 })}
                  </a>
                </div>
              `;
            }).join('')}
          </div>
        </section>

        <!-- Detailed Item-by-Item Review -->
        <section class="section-block" id="exam-review-section" aria-labelledby="review-heading">
          <div class="section-header section-header--split">
            <div>
              <h2 id="review-heading" class="section-title">${escapeHtml(t('resultsReviewHeading'))}</h2>
              <p class="section-subtitle">${escapeHtml(t('resultsReviewSub'))}</p>
            </div>

            <div class="setup-pills" role="tablist" aria-label="${escapeHtml(t('resultsReviewHeading'))}">
              <button type="button" role="tab" aria-selected="${reviewFilter === 'all'}" class="seg-btn ${reviewFilter === 'all' ? 'is-active' : ''}" data-rfilter="all">${escapeHtml(t('resultsFilterAll', { n: itemResults.length }))}</button>
              <button type="button" role="tab" aria-selected="${reviewFilter === 'wrong'}" class="seg-btn ${reviewFilter === 'wrong' ? 'is-active' : ''}" data-rfilter="wrong">${escapeHtml(t('resultsFilterWrong', { n: counts.wrong + counts.unanswered + (counts.pending || 0) }))}</button>
              <button type="button" role="tab" aria-selected="${reviewFilter === 'flagged'}" class="seg-btn ${reviewFilter === 'flagged' ? 'is-active' : ''}" data-rfilter="flagged">${escapeHtml(t('resultsFilterFlagged', { n: Object.values(flags).filter(Boolean).length }))}</button>
              <button type="button" role="tab" aria-selected="${reviewFilter === 'open'}" class="seg-btn ${reviewFilter === 'open' ? 'is-active' : ''}" data-rfilter="open">${escapeHtml(t('resultsFilterOpen', { n: openOrPartialCount }))}</button>
            </div>
          </div>

          <div class="review-list">
            ${filteredItems.length === 0 ? `<div class="empty-card">${escapeHtml(t('resultsReviewEmpty'))}</div>` : filteredItems.map((item) => {
              const isOpen = expandedReviewIndex === item.index;
              const statusIconName = item.status === 'correct'
                ? 'check'
                : item.status === 'partial'
                ? 'partial'
                : item.status === 'pending'
                ? 'clipboard-list'
                : item.status === 'unanswered'
                ? 'minus'
                : 'x';
              const badgeLabel = item.status === 'pending'
                ? t('pendingTitle')
                : `${item.earned}/${item.max}`;
              const isFlg = Boolean(flags[item.task.id]);
              return `
                <article class="review-item review-item--${item.status} ${isOpen ? 'is-expanded' : ''}" id="review-item-${item.index}">
                  <button type="button" class="review-item__summary" data-action="toggle-review-item" data-index="${item.index}" aria-expanded="${isOpen}">
                    <span class="review-item__num mono-code">№${item.index + 1}</span>
                    <span class="review-item__badge review-badge--${item.status}">
                      ${icon(statusIconName, { size: 13 })}
                      <span class="tabular-nums">${escapeHtml(badgeLabel)}</span>
                    </span>
                    ${isFlg ? `<span class="badge badge--gold" aria-label="${escapeHtml(t('btnFlagged'))}">${icon('flag-filled', { size: 12 })}</span>` : ''}
                    <span class="review-item__topic">${escapeHtml(item.task.topic || '')}</span>
                    <span class="review-item__stem-preview">${escapeHtml(safePreviewText(item.task.stem, 110))}</span>
                    <span class="review-item__chevron" aria-hidden="true">${icon(isOpen ? 'chevron-up' : 'chevron-down', { size: 16 })}</span>
                  </button>
                  ${isOpen ? `<div class="review-item__body" id="review-mount-${item.index}"></div>` : ''}
                </article>
              `;
            }).join('')}
          </div>
        </section>
      </div>
    `;

    hydrateMath(container);

    // Kinetic odometer score count-up & mastery pulse on high score
    const scoreStrong = container.querySelector('.results-gauge__text strong');
    if (scoreStrong) {
      oaAnimateCounter(scoreStrong, scaledScore, { duration: 640, decimals: scaledScore % 1 !== 0 ? 1 : 0 });
    }
    if (scaledMax > 0 && (scaledScore / scaledMax) >= 0.85) {
      oaFireFxPulse('milestone', { intensity: 1.3 });
    }

    // Mount expanded task card if any
    if (expandedReviewIndex !== null) {
      const item = itemResults.find((it) => it.index === expandedReviewIndex);
      const mountTarget = container.querySelector(`#review-mount-${expandedReviewIndex}`);
      if (item && mountTarget) {
        mountTaskView(mountTarget, {
          task: item.task,
          response: item.response,
          checked: true,
          mode: 'review',
          taskNumber: item.index + 1,
          totalTasks: itemResults.length,
          onChange(newResp) {
            if (item.task.format !== 'open') return;
            const prevSelf = item.response?.self;
            examResults.responses[item.task.id] = newResp;
            item.response = newResp;
            if (newResp?.self === prevSelf) return;

            // P0 #5: Sync BOTH st.mistakes AND st.stats AND st.exams!
            const newRes = checkAnswer(item.task, newResp);
            recordExamOpenSelfGrade(item.task, prevSelf, newResp, newRes);

            const updatedEv = computeEvaluation(summary.targetId, examResults.tasks, examResults.responses);
            examResults.evaluation = updatedEv;
            examResults.summary.scaledScore = updatedEv.scaledScore;
            examResults.summary.rawEarned = updatedEv.rawEarned;
            examResults.summary.pct = updatedEv.pct;
            examResults.summary.counts = updatedEv.counts;
            syncExamScoreAndAchievements(summary.id, updatedEv);
            renderResults();
          },
        });
      }
    }

    container.querySelector('[data-action="jump-ungraded-open"]')?.addEventListener('click', () => {
      const firstTarget = pendingItems[0] || ungradedOpenItems[0];
      if (!firstTarget) return;
      reviewFilter = 'open';
      expandedReviewIndex = firstTarget.index;
      renderResults();
      const itemEl = container.querySelector(`#review-item-${firstTarget.index}`);
      itemEl?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    container.querySelector('[data-action="add-unanswered-mistakes"]')?.addEventListener('click', () => {
      const added = addTasksToMistakes(unansweredItems.map((it) => it.task));
      unansweredAddedToMistakes = true;
      renderResults();
      if (showToast) {
        showToast({ message: t('resultsUnansweredAdded', { n: added || unansweredItems.length }) });
      }
    });

    container.querySelector('[data-action="retake-exam"]')?.addEventListener('click', () => {
      examResults = null;
      viewPhase = 'setup';
      render();
    });

    container.querySelectorAll('[data-rfilter]').forEach((btn) => {
      btn.addEventListener('click', () => {
        reviewFilter = btn.dataset.rfilter;
        expandedReviewIndex = null;
        renderResults();
      });
    });

    container.querySelectorAll('[data-action="toggle-review-item"]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = Number(btn.dataset.index);
        expandedReviewIndex = expandedReviewIndex === idx ? null : idx;
        renderResults();
      });
    });
  }

  function render() {
    if (viewPhase === 'running') renderRunning();
    else if (viewPhase === 'results') renderResults();
    else renderSetup();
  }

  if (viewPhase === 'running') startCountdown();
  render();
}
