// Statistics & Progress View (#/stats)
// Subject/topic mastery with restored subject colors, responsive mobile stacked exam history cards,
// localized date formatting, Ulduz 8-Ray streak star, and quiet bottom Data Management footer strip.

import { SUBJECTS_META } from '../../subjects/index.js';
import {
  loadState,
  resetAllProgress,
  exportProgressJson,
  importProgressJson,
} from '../../core/storage.js';
import { isNativeApp, exportNativeProgress, haptic } from '../../core/native.js';
import { t, subjectTitle, subjectShort, formatDateTime } from '../i18n.js';
import { icon, ulduzStarSvg } from '../icons.js';
import { escapeHtml } from '../math.js';
import { SUBJECT_CODES, buildSignalMeterHtml } from '../fx-engine.js';

export async function renderStatsView(container, { setKeyHandler }) {
  if (setKeyHandler) setKeyHandler(null);
  let confirmReset = false;
  let statusNotice = null;

  function render() {
    const state = loadState();
    const { totalAttempted, totalCorrect, bySubject, byTopic } = state.stats;
    const accuracy = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0;
    const exams = state.exams || [];
    const streakDays = state.streak?.days || 0;
    const starLit = Math.min(8, streakDays > 0 ? Math.max(1, streakDays) : 0);

    const topicRows = Object.values(byTopic || {}).sort((a, b) => {
      const accA = a.attempted > 0 ? a.correct / a.attempted : 0;
      const accB = b.attempted > 0 ? b.correct / b.attempted : 0;
      return accA - accB;
    });

    container.innerHTML = `
      <div class="page-container">
        <nav class="breadcrumbs" aria-label="${escapeHtml(t('breadcrumbsAria'))}">
          <a href="#/">${escapeHtml(t('navHome'))}</a>
          <span aria-hidden="true">/</span>
          <span aria-current="page">${escapeHtml(t('navStats'))}</span>
        </nav>

        <div class="section-header">
          <h1 class="page-title">${escapeHtml(t('statsTitle'))}</h1>
          <p class="page-lead text-secondary">${escapeHtml(t('statsSubtitle'))}</p>
        </div>

        ${statusNotice ? `<div class="notice-banner" role="status">${escapeHtml(statusNotice)}</div>` : ''}

        <!-- Hairline Summary Strip (calm, zero boxed KPI boilerplate) -->
        <div class="stats-summary-strip">
          <div class="stats-summary-cell">
            <span class="stats-summary-cell__val tabular-nums" data-count-to="${totalAttempted}">${totalAttempted}</span>
            <span class="stats-summary-cell__lbl">${escapeHtml(t('statsKpiSolved'))}</span>
          </div>
          <div class="stats-summary-cell">
            <span class="stats-summary-cell__val tabular-nums" data-count-to="${accuracy}" data-count-suffix="%">${accuracy}%</span>
            <span class="stats-summary-cell__lbl">${escapeHtml(t('statsKpiAccuracy', { correct: totalCorrect }))}</span>
          </div>
          <div class="stats-summary-cell">
            <span class="stats-summary-cell__val tabular-nums" data-count-to="${exams.length}">${exams.length}</span>
            <span class="stats-summary-cell__lbl">${escapeHtml(t('statsKpiExams'))}</span>
          </div>
          <div class="stats-summary-cell">
            <span class="stats-summary-cell__val stats-summary-cell__val--star tabular-nums">
              ${ulduzStarSvg(starLit, { size: 20 })}
              <span>${streakDays}</span>
            </span>
            <span class="stats-summary-cell__lbl">${escapeHtml(t('statsKpiStreak', { today: state.streak?.todayCount || 0 }))}</span>
          </div>
        </div>

        <!-- Per Subject Breakdown (with proper section-header spacing & subject accent colors) -->
        <section class="section-block" aria-labelledby="stats-subjects-heading">
          <div class="section-header">
            <h2 id="stats-subjects-heading" class="section-title">${escapeHtml(t('statsSubjectsHeading'))}</h2>
            <p class="section-subtitle">${escapeHtml(t('statsSubjectsSub'))}</p>
          </div>
          <div class="stats-subjects-grid">
            ${SUBJECTS_META.map((m) => {
              const sb = bySubject[m.id] ?? { attempted: 0, correct: 0, earned: 0, max: 0 };
              const acc = sb.attempted > 0 ? Math.round((sb.correct / sb.attempted) * 100) : 0;
              const code = SUBJECT_CODES[m.id] || SUBJECT_CODES.math;
              return `
                <article class="stat-subj-card subject-card--${m.id}">
                  <div class="stat-subj-card__head">
                    <span class="stat-subj-card__icon" aria-hidden="true">${escapeHtml(m.icon)}</span>
                    <div>
                      <h3>${escapeHtml(code.catNo)} · ${escapeHtml(subjectTitle(m.id))}</h3>
                      <span class="text-secondary tabular-nums mono-code">${escapeHtml(t('statsCorrectOf', { correct: sb.correct, attempted: sb.attempted, acc }))}</span>
                    </div>
                  </div>
                  ${buildSignalMeterHtml(acc, code.color, { ariaLabel: subjectTitle(m.id) })}
                  <div class="stat-subj-card__foot">
                    <a href="#/practice/${m.id}" class="btn btn--ghost btn--xs">
                      <span>${escapeHtml(t('statsTrainLink'))}</span>
                      ${icon('arrow-right', { size: 13 })}
                    </a>
                    <a href="#/exam/${m.id}" class="btn btn--ghost btn--xs">
                      <span>${escapeHtml(t('statsExamLink'))}</span>
                      ${icon('arrow-right', { size: 13 })}
                    </a>
                  </div>
                </article>
              `;
            }).join('')}
          </div>
        </section>

        <!-- Completed Exams History (stacked cards on <640px) -->
        <section class="section-block" aria-labelledby="stats-history-heading">
          <div class="section-header">
            <h2 id="stats-history-heading" class="section-title">${escapeHtml(t('statsHistoryHeading'))}</h2>
            <p class="section-subtitle">${escapeHtml(t('statsHistorySub'))}</p>
          </div>
          ${exams.length === 0 ? `
            <div class="empty-card">
              <p class="text-secondary">${escapeHtml(t('statsHistoryEmpty'))}</p>
              <div class="empty-card__actions">
                <a href="#/exam/math" class="btn btn--primary btn--sm">
                  <span>${escapeHtml(t('statsFirstExamBtn'))}</span>
                  ${icon('arrow-right', { size: 15 })}
                </a>
              </div>
            </div>
          ` : `
            <div class="table-wrap">
              <table class="stats-table">
                <thead>
                  <tr>
                    <th>${escapeHtml(t('statsColDate'))}</th>
                    <th>${escapeHtml(t('statsColExam'))}</th>
                    <th>${escapeHtml(t('statsColDim'))}</th>
                    <th>${escapeHtml(t('statsColRaw'))}</th>
                    <th>${escapeHtml(t('statsColCorrect'))}</th>
                    <th>${escapeHtml(t('statsColTime'))}</th>
                  </tr>
                </thead>
                <tbody>
                  ${exams.map((ex) => {
                    const mins = Math.floor((ex.elapsedSec || 0) / 60);
                    const secs = (ex.elapsedSec || 0) % 60;
                    return `
                      <tr>
                        <td class="tabular-nums text-secondary" data-label="${escapeHtml(t('statsColDate'))}">${escapeHtml(formatDateTime(ex.completedAt))}</td>
                        <td class="stats-table__exam-cell" data-label="${escapeHtml(t('statsColExam'))}"><b>${escapeHtml(ex.title)}</b></td>
                        <td class="tabular-nums" data-label="${escapeHtml(t('statsColDim'))}"><span><strong>${ex.scaledScore}</strong> / ${ex.scaledMax}</span></td>
                        <td class="tabular-nums" data-label="${escapeHtml(t('statsColRaw'))}">${ex.rawEarned} / ${ex.rawMax}</td>
                        <td class="tabular-nums" data-label="${escapeHtml(t('statsColCorrect'))}">${escapeHtml(t('statsOfTotal', { correct: ex.counts?.correct ?? 0, total: ex.counts?.total ?? 0 }))}</td>
                        <td class="tabular-nums text-secondary" data-label="${escapeHtml(t('statsColTime'))}">${escapeHtml(t('statsTimeShort', { min: mins, sec: secs }))}</td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </div>
          `}
        </section>

        <!-- Per Topic Mastery -->
        ${topicRows.length > 0 ? `
          <section class="section-block" aria-labelledby="stats-topics-heading">
            <div class="section-header">
              <h2 id="stats-topics-heading" class="section-title">${escapeHtml(t('statsTopicsHeading'))}</h2>
              <p class="section-subtitle">${escapeHtml(t('statsTopicsSub'))}</p>
            </div>
            <div class="topic-breakdown-list">
              ${topicRows.map((tb) => {
                const pct = tb.attempted > 0 ? Math.round((tb.correct / tb.attempted) * 100) : 0;
                const tone = pct >= 80 ? 'correct' : pct >= 50 ? 'partial' : 'wrong';
                return `
                  <div class="tb-row">
                    <div class="tb-row__info">
                      <div class="tb-row__title">
                        <span class="badge badge--subject badge--subject-${escapeHtml(tb.subject)}">${escapeHtml(subjectShort(tb.subject))}</span>
                        <span>${escapeHtml(tb.topic)}</span>
                      </div>
                      <div class="tb-row__meta tabular-nums">${escapeHtml(t('statsTopicMeta', { correct: tb.correct, attempted: tb.attempted }))}</div>
                    </div>
                    <div class="tb-row__bar-wrap">
                      <div class="progress-bar progress-bar--${tone}">
                        <div class="progress-bar__fill" style="width:${pct}%"></div>
                      </div>
                      <span class="tb-row__pct tabular-nums">${pct}%</span>
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
        ` : ''}

        <!-- Quiet Bottom Data Management Footer Strip (#13) -->
        <section class="section-block data-manage-strip" aria-labelledby="stats-data-heading">
          <div class="data-manage-strip__text">
            <h2 id="stats-data-heading" class="data-manage-strip__title">${escapeHtml(t('statsDataHeading'))}</h2>
            <p class="text-secondary">${escapeHtml(t('statsDataDesc'))}</p>
          </div>
          <div class="stats-tools">
            <button type="button" class="btn btn--secondary btn--sm" data-action="export-json">
              ${icon('download', { size: 15 })}
              <span>${escapeHtml(t('statsExportBtn'))}</span>
            </button>
            <label class="btn btn--secondary btn--sm stats-import-label">
              ${icon('upload', { size: 15 })}
              <span>${escapeHtml(t('statsImportBtn'))}</span>
              <input type="file" accept="application/json" class="sr-only" id="import-json-file" />
            </label>
            ${!confirmReset ? `
              <button type="button" class="btn btn--ghost btn--sm" data-action="ask-reset">
                ${icon('trash', { size: 15 })}
                <span>${escapeHtml(t('statsResetBtn'))}</span>
              </button>
            ` : `
              <button type="button" class="btn btn--danger btn--sm" data-action="confirm-reset">${escapeHtml(t('statsResetConfirm'))}</button>
              <button type="button" class="btn btn--ghost btn--sm" data-action="cancel-reset">${escapeHtml(t('btnCancel'))}</button>
            `}
          </div>
        </section>
      </div>
    `;

    container.querySelector('[data-action="export-json"]')?.addEventListener('click', async () => {
      const json = exportProgressJson();
      const filename = `ulduz-progress-${new Date().toISOString().slice(0, 10)}.json`;
      if (isNativeApp()) {
        const savedPath = await exportNativeProgress(filename, json);
        if (savedPath) {
          haptic('success');
          statusNotice = t('statsNoticeExportedNative', { path: savedPath });
          render();
          return;
        }
      }
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
      statusNotice = t('statsNoticeExported');
      render();
    });

    container.querySelector('#import-json-file')?.addEventListener('change', async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      try {
        const text = await file.text();
        importProgressJson(text);
        statusNotice = t('statsNoticeImported');
      } catch (err) {
        statusNotice = t('statsNoticeImportErr', { err: err?.message ?? err });
      }
      render();
    });

    container.querySelector('[data-action="ask-reset"]')?.addEventListener('click', () => {
      confirmReset = true;
      render();
      container.querySelector('[data-action="cancel-reset"]')?.focus();
    });
    container.querySelector('[data-action="cancel-reset"]')?.addEventListener('click', () => {
      confirmReset = false;
      render();
      container.querySelector('[data-action="ask-reset"]')?.focus();
    });
    container.querySelector('[data-action="confirm-reset"]')?.addEventListener('click', () => {
      resetAllProgress();
      confirmReset = false;
      statusNotice = t('statsNoticeReset');
      render();
    });
  }

  render();
}
