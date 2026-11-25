// Statistics & Visual Telemetry View (#/stats)
// Factory Records / Peter Saville archival analytics:
// - Summary strip (solved, accuracy, exams, avg/total time, 8-ray streak star)
// - Per-subject mastery + solving pace rows (4 Saville color codes)
// - Time & Speed SVG visualizations (subject pace bars, correct vs. wrong pace, format breakdown)
// - Recent Solving Trajectory Oscillograph SVG (last 30 timed attempts)
// - Bottleneck 2-column ledger (Slowest Topics vs. Error Hotspots)
// - Completed Exams history, Per-Topic mastery, and Data Management strip.

import { SUBJECTS_META } from '../../subjects/index.js';
import {
  loadState,
  getLang,
  resetAllProgress,
  exportProgressJson,
  importProgressJson,
} from '../../core/storage.js';
import {
  buildStudentTelemetrySnapshot,
  formatDurationShort,
  formatStudyTime,
} from '../../core/telemetry.js';
import { isNativeApp, exportNativeProgress, haptic } from '../../core/native.js';
import { t, subjectTitle, subjectShort, formatDateTime, formatFormatBadge } from '../i18n.js';
import { icon, ulduzStarSvg } from '../icons.js';
import { escapeHtml } from '../math.js';
import { SUBJECT_CODES, buildSignalMeterHtml } from '../fx-engine.js';

/**
 * Render Factory Records Oscillograph SVG of the last up to 30 solving attempts.
 * Plots solving time (Y) across chronological sequence (X), with average pace hairline
 * and green (correct) / red (wrong) square verdict nodes.
 */
function buildOscillographSvg(trajectory, avgSec, lang) {
  const timed = trajectory.filter((item) => item.durationSec > 0);
  if (timed.length === 0) return '';

  const width = 620;
  const height = 196;
  const padL = 44;
  const padR = 16;
  const padT = 18;
  const padB = 30;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;

  const maxSecRaw = Math.max(...timed.map((d) => d.durationSec), avgSec || 0, 10);
  const maxSec = Math.ceil(maxSecRaw / 10) * 10;

  const xFor = (idx) => {
    if (timed.length === 1) return padL + plotW / 2;
    return padL + (idx / (timed.length - 1)) * plotW;
  };
  const yFor = (sec) => padT + plotH - Math.min(1, sec / maxSec) * plotH;

  // Horizontal grid hairlines (0%, 50%, 100%)
  const gridTicks = [0, Math.round(maxSec / 2), maxSec];
  const gridHtml = gridTicks.map((val) => {
    const y = yFor(val).toFixed(1);
    return `
      <line x1="${padL}" y1="${y}" x2="${width - padR}" y2="${y}" class="stats-svg__grid" />
      <text x="${padL - 8}" y="${(Number(y) + 3).toFixed(1)}" text-anchor="end" class="stats-svg__axis-label">${val}s</text>
    `;
  }).join('');

  // Average pace dashed rule (value displayed cleanly in header legend to avoid waveform overlap)
  const avgY = yFor(avgSec).toFixed(1);
  const avgRuleHtml = avgSec > 0 ? `
    <line x1="${padL}" y1="${avgY}" x2="${width - padR}" y2="${avgY}" class="stats-svg__avg-line" />
  ` : '';

  // Continuous oscillograph polyline + faint baseline drop stems
  const pts = timed.map((d, i) => `${xFor(i).toFixed(1)},${yFor(d.durationSec).toFixed(1)}`).join(' ');
  const stemsHtml = timed.map((d, i) => {
    const x = xFor(i).toFixed(1);
    const y = yFor(d.durationSec).toFixed(1);
    const base = (padT + plotH).toFixed(1);
    return `<line x1="${x}" y1="${y}" x2="${x}" y2="${base}" class="stats-svg__stem" />`;
  }).join('');

  // Square Saville verdict nodes
  const nodesHtml = timed.map((d, i) => {
    const x = xFor(i);
    const y = yFor(d.durationSec);
    const cls = d.correct ? 'stats-svg__node--correct' : 'stats-svg__node--wrong';
    const verdict = d.correct ? t('correctTitle') : t('wrongTitle');
    const tip = `#${i + 1} · ${subjectShort(d.subject)} · ${d.topic} · ${formatDurationShort(d.durationSec, lang)} · ${verdict}`;
    return `
      <rect x="${(x - 3.5).toFixed(1)}" y="${(y - 3.5).toFixed(1)}" width="7" height="7" class="stats-svg__node ${cls}">
        <title>${escapeHtml(tip)}</title>
      </rect>
    `;
  }).join('');

  // X-axis boundary labels
  const firstLabel = '#1';
  const lastLabel = `#${timed.length}`;

  return `
    <svg class="stats-oscillograph-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeHtml(t('statsTrajectoryAria'))}">
      ${gridHtml}
      ${stemsHtml}
      ${avgRuleHtml}
      ${timed.length > 1 ? `<polyline points="${pts}" fill="none" class="stats-svg__poly" />` : ''}
      ${nodesHtml}
      <text x="${padL}" y="${height - 8}" text-anchor="start" class="stats-svg__axis-label">${firstLabel}</text>
      <text x="${width - padR}" y="${height - 8}" text-anchor="end" class="stats-svg__axis-label">${lastLabel}</text>
    </svg>
  `;
}

/**
 * Render horizontal Saville SVG pace bars per subject (avg seconds per task).
 */
function buildSubjectPaceBarsHtml(subjects, lang) {
  const active = subjects.filter((s) => s.timedCount > 0);
  if (active.length === 0) return '';
  const maxAvg = Math.max(...active.map((s) => s.avgSec), 10);
  const coreIds = new Set(['math', 'ru', 'en', 'az']);
  const visible = subjects.filter((s) => coreIds.has(s.id) || s.timedCount > 0);

  return `
    <div class="pace-bars-list">
      ${visible.map((s) => {
        const code = SUBJECT_CODES[s.id] || SUBJECT_CODES.math;
        const pct = s.timedCount > 0 ? Math.max(6, Math.round((s.avgSec / maxAvg) * 100)) : 0;
        return `
          <div class="pace-bar-row">
            <div class="pace-bar-row__head">
              <span class="pace-bar-row__subj">
                <span class="pace-bar-row__pip" style="background:${code.color}" aria-hidden="true"></span>
                <span>${escapeHtml(subjectTitle(s.id))}</span>
              </span>
              <span class="pace-bar-row__vals mono-code tabular-nums">
                ${s.timedCount > 0
                  ? `<strong>${escapeHtml(formatDurationShort(s.avgSec, lang))}</strong> <span class="text-muted">· ${escapeHtml(formatStudyTime(s.totalSec, lang))}</span>`
                  : `<span class="text-muted">—</span>`}
              </span>
            </div>
            <div class="pace-bar-track" aria-hidden="true">
              <div class="pace-bar-fill" style="width:${pct}%;background:${code.color}"></div>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

export async function renderStatsView(container, { setKeyHandler }) {
  if (setKeyHandler) setKeyHandler(null);
  let confirmReset = false;
  let statusNotice = null;

  function render() {
    const state = loadState();
    const lang = getLang();
    const snap = buildStudentTelemetrySnapshot(state);
    const { overall, subjects, slowestTopics, weakestTopics, formats, recentTrajectory } = snap;
    const { totalAttempted, totalCorrect, bySubject, byTopic } = state.stats;
    const accuracy = overall.accuracy;
    const exams = state.exams || [];
    const streakDays = overall.streakDays;
    const starLit = Math.min(8, streakDays > 0 ? Math.max(1, streakDays) : 0);

    const topicRows = Object.values(byTopic || {}).sort((a, b) => {
      const accA = a.attempted > 0 ? a.correct / a.attempted : 0;
      const accB = b.attempted > 0 ? b.correct / b.attempted : 0;
      return accA - accB;
    });

    const hasTiming = overall.totalTimedAttempts > 0;
    const maxSlowSec = slowestTopics.length > 0 ? Math.max(...slowestTopics.map((x) => x.avgSec), 1) : 1;
    const maxFmtSec = formats.length > 0 ? Math.max(...formats.map((x) => x.avgSec), 1) : 1;
    const oscillographSvg = buildOscillographSvg(recentTrajectory, overall.avgSec, lang);

    container.innerHTML = `
      <div class="page-container">
        <nav class="breadcrumbs" aria-label="${escapeHtml(t('breadcrumbsAria'))}">
          <a href="#/">${escapeHtml(t('navHome'))}</a>
          <span aria-hidden="true">/</span>
          <span aria-current="page">${escapeHtml(t('navStats'))}</span>
        </nav>

        <div class="section-header section-header--split">
          <div>
            <h1 class="page-title">${escapeHtml(t('statsTitle'))}</h1>
            <p class="page-lead text-secondary">${escapeHtml(t('statsSubtitle'))}</p>
          </div>
          <div class="stats-head-actions">
            <a href="#/ai?prompt=analyze" class="btn btn--primary btn--sm" data-action="stats-ask-ai">
              ${icon('bot', { size: 15 })}
              <span>${escapeHtml(t('statsAnalyzeAiBtn'))}</span>
            </a>
            <a href="#/settings" class="btn btn--secondary btn--sm">
              ${icon('settings', { size: 15 })}
              <span>${escapeHtml(t('navSettings'))}</span>
            </a>
          </div>
        </div>

        ${statusNotice ? `<div class="notice-banner" role="status">${escapeHtml(statusNotice)}</div>` : ''}

        <!-- Hairline Summary Strip (5 telemetry metrics) -->
        <div class="stats-summary-strip stats-summary-strip--5">
          <div class="stats-summary-cell">
            <span class="stats-summary-cell__val tabular-nums" data-count-to="${totalAttempted}">${totalAttempted}</span>
            <span class="stats-summary-cell__lbl">${escapeHtml(t('statsKpiSolved'))}</span>
          </div>
          <div class="stats-summary-cell">
            <span class="stats-summary-cell__val tabular-nums" data-count-to="${accuracy}" data-count-suffix="%">${accuracy}%</span>
            <span class="stats-summary-cell__lbl">${escapeHtml(t('statsKpiAccuracy', { correct: totalCorrect }))}</span>
          </div>
          <div class="stats-summary-cell">
            <span class="stats-summary-cell__val tabular-nums">${escapeHtml(hasTiming ? formatDurationShort(overall.avgSec, lang) : '—')}</span>
            <span class="stats-summary-cell__lbl">${escapeHtml(t('statsKpiAvgTime', { total: formatStudyTime(overall.totalSec, lang) }))}</span>
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

        <!-- Time & Pace Visual Telemetry Studio (SVG Oscillograph + Pace Matrix) -->
        <section class="section-block" aria-labelledby="stats-telemetry-heading">
          <div class="section-header">
            <h2 id="stats-telemetry-heading" class="section-title">${escapeHtml(t('statsTelemetryHeading'))}</h2>
            <p class="section-subtitle">${escapeHtml(t('statsTelemetrySub'))}</p>
          </div>

          ${!hasTiming ? `
            <div class="empty-card stats-telemetry-empty">
              <p class="text-secondary">${escapeHtml(t('statsTelemetryEmpty'))}</p>
              <div class="empty-card__actions">
                <a href="#/practice/math" class="btn btn--primary btn--sm">
                  <span>${escapeHtml(t('statsStartTimedPracticeBtn'))}</span>
                  ${icon('arrow-right', { size: 15 })}
                </a>
              </div>
            </div>
          ` : `
            <div class="stats-visual-grid">
              <!-- Left Panel: Subject Pace Bars + Correct vs Wrong Comparison -->
              <div class="stats-visual-panel">
                <div class="stats-visual-panel__head">
                  <h3 class="stats-visual-panel__title">${escapeHtml(t('statsSubjectPaceTitle'))}</h3>
                  <span class="mono-code text-muted">${escapeHtml(t('statsTimedSamples', { n: overall.totalTimedAttempts }))}</span>
                </div>

                ${buildSubjectPaceBarsHtml(subjects, lang)}

                <div class="pace-compare-strip">
                  <div class="pace-compare-cell">
                    <span class="pace-compare-cell__lbl">${escapeHtml(t('statsPaceCorrectLabel'))}</span>
                    <strong class="pace-compare-cell__val pace-compare-cell__val--correct mono-code tabular-nums">
                      ${escapeHtml(overall.correctAvgSec > 0 ? formatDurationShort(overall.correctAvgSec, lang) : '—')}
                    </strong>
                  </div>
                  <div class="pace-compare-cell">
                    <span class="pace-compare-cell__lbl">${escapeHtml(t('statsPaceWrongLabel'))}</span>
                    <strong class="pace-compare-cell__val pace-compare-cell__val--wrong mono-code tabular-nums">
                      ${escapeHtml(overall.wrongAvgSec > 0 ? formatDurationShort(overall.wrongAvgSec, lang) : '—')}
                    </strong>
                  </div>
                  <div class="pace-compare-cell">
                    <span class="pace-compare-cell__lbl">${escapeHtml(t('statsPaceMedianLabel'))}</span>
                    <strong class="pace-compare-cell__val mono-code tabular-nums">
                      ${escapeHtml(overall.medianSec > 0 ? formatDurationShort(overall.medianSec, lang) : '—')}
                    </strong>
                  </div>
                </div>
              </div>

              <!-- Right Panel: Recent Solving Trajectory Oscillograph -->
              <div class="stats-visual-panel">
                <div class="stats-visual-panel__head">
                  <h3 class="stats-visual-panel__title">${escapeHtml(t('statsTrajectoryTitle'))}</h3>
                  <div class="stats-osc-legend mono-code">
                    ${overall.avgSec > 0 ? `<span><i class="stats-osc-dash"></i>${escapeHtml(t('statsAvgShort'))} ${escapeHtml(formatDurationShort(overall.avgSec, lang))}</span>` : ''}
                    <span><i class="stats-osc-dot stats-osc-dot--ok"></i>${escapeHtml(t('correctTitle'))}</span>
                    <span><i class="stats-osc-dot stats-osc-dot--err"></i>${escapeHtml(t('wrongTitle'))}</span>
                  </div>
                </div>
                <div class="stats-oscillograph-wrap">
                  ${oscillographSvg || `<p class="text-secondary">${escapeHtml(t('statsTelemetryEmpty'))}</p>`}
                </div>
                ${formats.length > 0 ? `
                  <div class="stats-format-strip">
                    ${formats.map((f) => {
                      const pct = Math.max(8, Math.round((f.avgSec / maxFmtSec) * 100));
                      return `
                        <div class="stats-format-cell">
                          <div class="stats-format-cell__top">
                            <span>${escapeHtml(formatFormatBadge(f.format))}</span>
                            <span class="mono-code tabular-nums">${escapeHtml(formatDurationShort(f.avgSec, lang))}</span>
                          </div>
                          <div class="stats-format-cell__bar"><span style="width:${pct}%"></span></div>
                          <div class="stats-format-cell__cnt mono-code text-muted">${f.count}</div>
                        </div>
                      `;
                    }).join('')}
                  </div>
                ` : ''}
              </div>
            </div>
          `}
        </section>

        <!-- Bottleneck Analysis: Slowest Topics vs Error Hotspots -->
        ${(slowestTopics.length > 0 || weakestTopics.length > 0) ? `
          <section class="section-block" aria-labelledby="stats-bottlenecks-heading">
            <div class="section-header">
              <h2 id="stats-bottlenecks-heading" class="section-title">${escapeHtml(t('statsBottlenecksHeading'))}</h2>
              <p class="section-subtitle">${escapeHtml(t('statsBottlenecksSub'))}</p>
            </div>
            <div class="stats-bottlenecks-grid">
              <div class="stats-ledger-box">
                <div class="stats-ledger-box__head">
                  <h3>${escapeHtml(t('statsSlowestTopicsTitle'))}</h3>
                  <span class="mono-code text-muted">${escapeHtml(t('statsAvgShort'))}</span>
                </div>
                ${slowestTopics.length === 0 ? `
                  <div class="stats-ledger-empty text-secondary">${escapeHtml(t('statsNoSlowTopics'))}</div>
                ` : `
                  <div class="stats-ledger-rows">
                    ${slowestTopics.map((row) => {
                      const pct = Math.max(8, Math.round((row.avgSec / maxSlowSec) * 100));
                      const code = SUBJECT_CODES[row.subject] || SUBJECT_CODES.math;
                      return `
                        <div class="stats-ledger-row">
                          <div class="stats-ledger-row__main">
                            <div class="stats-ledger-row__title">
                              <span class="badge badge--subject badge--subject-${escapeHtml(row.subject)}">${escapeHtml(subjectShort(row.subject))}</span>
                              <span>${escapeHtml(row.topic)}</span>
                            </div>
                            <div class="stats-ledger-bar"><span style="width:${pct}%;background:${code.color}"></span></div>
                            <div class="stats-ledger-row__meta mono-code tabular-nums">
                              ${escapeHtml(t('statsSlowTopicMeta', {
                                avg: formatDurationShort(row.avgSec, lang),
                                max: formatDurationShort(row.maxSec, lang),
                                n: row.count,
                              }))}
                            </div>
                          </div>
                          <a href="#/practice/${escapeHtml(row.subject)}?topic=${encodeURIComponent(row.topic)}" class="btn btn--ghost btn--xs" title="${escapeHtml(t('resultsTrainTopicBtn'))}">
                            ${icon('arrow-right', { size: 14 })}
                          </a>
                        </div>
                      `;
                    }).join('')}
                  </div>
                `}
              </div>

              <div class="stats-ledger-box">
                <div class="stats-ledger-box__head">
                  <h3>${escapeHtml(t('statsErrorHotspotsTitle'))}</h3>
                  <span class="mono-code text-muted">${escapeHtml(t('labelAccuracy'))}</span>
                </div>
                ${weakestTopics.length === 0 ? `
                  <div class="stats-ledger-empty text-secondary">${escapeHtml(t('statsNoErrorHotspots'))}</div>
                ` : `
                  <div class="stats-ledger-rows">
                    ${weakestTopics.map((row) => {
                      const tone = row.accuracy >= 80 ? 'correct' : row.accuracy >= 50 ? 'partial' : 'wrong';
                      return `
                        <div class="stats-ledger-row">
                          <div class="stats-ledger-row__main">
                            <div class="stats-ledger-row__title">
                              <span class="badge badge--subject badge--subject-${escapeHtml(row.subject)}">${escapeHtml(subjectShort(row.subject))}</span>
                              <span>${escapeHtml(row.topic)}</span>
                            </div>
                            <div class="progress-bar progress-bar--${tone}">
                              <div class="progress-bar__fill" style="width:${row.accuracy}%"></div>
                            </div>
                            <div class="stats-ledger-row__meta mono-code tabular-nums">
                              ${row.accuracy}% (${row.correct}/${row.attempted})${row.activeMistakes > 0 ? ` · ${escapeHtml(t('mistakeShortBadge', { n: row.activeMistakes }))}` : ''}${row.avgSec > 0 ? ` · ${escapeHtml(formatDurationShort(row.avgSec, lang))}` : ''}
                            </div>
                          </div>
                          <a href="#/practice/${escapeHtml(row.subject)}?topic=${encodeURIComponent(row.topic)}" class="btn btn--ghost btn--xs" title="${escapeHtml(t('resultsTrainTopicBtn'))}">
                            ${icon('arrow-right', { size: 14 })}
                          </a>
                        </div>
                      `;
                    }).join('')}
                  </div>
                `}
              </div>
            </div>
          </section>
        ` : ''}

        <!-- Per Subject Breakdown (with subject accent colors + live pace) -->
        <section class="section-block" aria-labelledby="stats-subjects-heading">
          <div class="section-header">
            <h2 id="stats-subjects-heading" class="section-title">${escapeHtml(t('statsSubjectsHeading'))}</h2>
            <p class="section-subtitle">${escapeHtml(t('statsSubjectsSub'))}</p>
          </div>
          <div class="stats-subjects-grid">
            ${SUBJECTS_META.map((m) => {
              const sb = bySubject[m.id] ?? { attempted: 0, correct: 0, earned: 0, max: 0 };
              const subjSnap = subjects.find((x) => x.id === m.id);
              const acc = sb.attempted > 0 ? Math.round((sb.correct / sb.attempted) * 100) : 0;
              const code = SUBJECT_CODES[m.id] || SUBJECT_CODES.math;
              const timeSuffix = subjSnap && subjSnap.timedCount > 0
                ? ` · ${formatDurationShort(subjSnap.avgSec, lang)}`
                : '';
              const errSuffix = subjSnap && subjSnap.activeMistakes > 0
                ? ` · ${t('mistakeShortBadge', { n: subjSnap.activeMistakes })}`
                : '';
              return `
                <article class="stat-subj-card subject-card--${m.id}">
                  <div class="stat-subj-card__head">
                    <span class="stat-subj-card__icon" aria-hidden="true">${escapeHtml(m.icon)}</span>
                    <div>
                      <h3>${escapeHtml(code.catNo)} · ${escapeHtml(subjectTitle(m.id))}</h3>
                      <span class="text-secondary tabular-nums mono-code">${escapeHtml(t('statsCorrectOf', { correct: sb.correct, attempted: sb.attempted, acc }))}${escapeHtml(timeSuffix)}${escapeHtml(errSuffix)}</span>
                    </div>
                  </div>
                  ${buildSignalMeterHtml(acc, code.color, { ariaLabel: subjectTitle(m.id) })}
                  <div class="stat-subj-card__foot">
                    <a href="#/lesson/${m.id}" class="btn btn--ghost btn--xs">
                      <span>${escapeHtml(t('btnLessons'))}</span>
                      ${icon('video', { size: 13 })}
                    </a>
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
                const tKey = `${tb.subject}::${tb.topic}`;
                const tData = state.timing?.byTopic?.[tKey];
                const tAvg = tData && tData.count > 0 ? Math.round(tData.totalSec / tData.count) : 0;
                return `
                  <div class="tb-row">
                    <div class="tb-row__info">
                      <div class="tb-row__title">
                        <span class="badge badge--subject badge--subject-${escapeHtml(tb.subject)}">${escapeHtml(subjectShort(tb.subject))}</span>
                        <span>${escapeHtml(tb.topic)}</span>
                      </div>
                      <div class="tb-row__meta tabular-nums">
                        ${escapeHtml(t('statsTopicMeta', { correct: tb.correct, attempted: tb.attempted }))}${tAvg > 0 ? ` · ${escapeHtml(t('statsAvgShort'))} ${escapeHtml(formatDurationShort(tAvg, lang))}` : ''}
                      </div>
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

        <!-- Quiet Bottom Data Management Footer Strip -->
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
