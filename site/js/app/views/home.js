// Home Screen — Factory Records / Peter Saville Archival Exam Catalog
// 1. Hairline-split archival sleeve (Catalog Index DİM 01–04 with 40px Square Color Plates | Live Angled 3D Pulsar)
// 2. Saville Technical Colophon (real solved/accuracy/streak + 10-block signal meter; zero eyebrows, zero fake telemetry)
// 3. Full-width bottom 5-block interactive Color Decoder Bar + Primary Square-Keycap CTA
// 4. Below-the-fold 3-column Archival Releases Grid (FAC 09.03, FAC 15.03, FAC ERR) with 196px Jagged Polar Spectra

import { SUBJECTS_META } from '../../subjects/index.js';
import { loadState, clearActiveExam, getActiveMistakesCount } from '../../core/storage.js';
import { haptic } from '../../core/native.js';
import { hasResponse } from '../task-view.js';
import { t, subjectTitle, subjectShort } from '../i18n.js';
import { icon } from '../icons.js';
import { escapeHtml } from '../math.js';
import {
  SUBJECT_CODES,
  mountHomePulsar,
  buildRadialSpectrumSvg,
  buildSignalMeterHtml,
} from '../fx-engine.js';

export async function renderHomeView(container, { setCleanup } = {}) {
  let confirmDiscard = false;
  let pulsarCtrl = null;
  let activeSubject = 'math';

  if (setCleanup) {
    setCleanup(() => {
      if (pulsarCtrl) {
        pulsarCtrl.destroy();
        pulsarCtrl = null;
      }
    });
  }

  function render() {
    if (pulsarCtrl) {
      pulsarCtrl.destroy();
      pulsarCtrl = null;
    }

    const state = loadState();
    const totalAttempted = state.stats.totalAttempted || 0;
    const totalCorrect = state.stats.totalCorrect || 0;
    const accuracy = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0;
    const activeMistakes = getActiveMistakesCount();
    const streakDays = state.streak?.days || 0;
    const activeExam = state.activeExam;

    // Real March 2026 booklet progress computed truthfully from state.solvedOriginals
    const solvedMap = state.solvedOriginals || {};
    const solvedKeys = Object.keys(solvedMap);
    const done0903 = solvedKeys.filter((k) => k.includes('09.03') || k.includes('0903')).length;
    const done1503 = solvedKeys.filter((k) => k.includes('15.03') || k.includes('1503')).length;
    const pct0903 = Math.min(100, Math.round((done0903 / 115) * 100));
    const pct1503 = Math.min(100, Math.round((done1503 / 115) * 100));
    const totalMistakesRecorded = Object.keys(state.mistakes || {}).length;
    const resolvedMistakes = Object.values(state.mistakes || {}).filter((m) => m.resolved).length;
    const pctErr = totalMistakesRecorded > 0 ? Math.round((resolvedMistakes / totalMistakesRecorded) * 100) : 0;

    const activeAnswered = activeExam
      ? (activeExam.tasks || []).filter((tk) => hasResponse(tk, activeExam.responses?.[tk.id])).length
      : 0;
    const activeTotal = activeExam?.tasks?.length || 0;

    const primaryCta = activeMistakes > 0
      ? { href: '#/mistakes', label: t('heroPrimaryMistakes', { n: activeMistakes }) }
      : { href: '#/exam/all', label: `${t('heroPrimaryContinue')} · 300` };

    const metaById = Object.fromEntries(SUBJECTS_META.map((m) => [m.id, m]));
    const activeMeta = metaById[activeSubject] || SUBJECTS_META[0];
    const activeCode = SUBJECT_CODES[activeSubject] || SUBJECT_CODES.math;
    const activeSb = state.stats.bySubject[activeSubject] ?? { attempted: 0, correct: 0 };
    const activeAcc = activeSb.attempted > 0 ? Math.round((activeSb.correct / activeSb.attempted) * 100) : null;

    container.innerHTML = `
      <div class="fac-home-root">
        ${activeExam ? `
          <div class="active-exam-banner" role="region" aria-label="${escapeHtml(t('examActiveBanner'))}">
            <div class="active-exam-banner__info">
              <span class="fac-alert-blk" aria-hidden="true"></span>
              <div>
                <strong>${escapeHtml(t('examActiveBanner'))}: ${escapeHtml(activeExam.title || subjectTitle(activeExam.subjectId))}</strong>
                <span class="text-secondary tabular-nums mono-code"> · ${escapeHtml(t('examAnsweredProgress', { done: activeAnswered, total: activeTotal }))}</span>
              </div>
            </div>
            <div class="active-exam-banner__actions">
              ${!confirmDiscard ? `
                <a href="#/exam/${escapeHtml(activeExam.subjectId)}?resume=1" class="btn btn--primary btn--sm">
                  <span>${escapeHtml(t('examResumeBtn'))}</span>
                  ${icon('arrow-right', { size: 15 })}
                </a>
                <button type="button" class="btn btn--ghost btn--sm" data-action="ask-discard-exam">${escapeHtml(t('examDiscardBtn'))}</button>
              ` : `
                <span class="discard-confirm-text">${escapeHtml(t('examDiscardConfirm'))}</span>
                <button type="button" class="btn btn--danger btn--sm" data-action="confirm-discard-exam">${escapeHtml(t('examDiscardYes'))}</button>
                <button type="button" class="btn btn--ghost btn--sm" data-action="cancel-discard-exam">${escapeHtml(t('btnCancel'))}</button>
              `}
            </div>
          </div>
        ` : ''}

        <!-- First Viewport: Factory Records 2-Column Archival Sleeve (Catalog Index | Live 3D Angled Pulsar) -->
        <section class="fac-sleeve home-welcome" aria-labelledby="home-h1">
          <!-- Left Column: Monumental Catalog Index (DİM 300 + DİM 01–04 with Bold Square Color Plates) -->
          <div class="fac-sleeve__index">
            <div class="fac-sleeve__head">
              <h1 id="home-h1" class="home-title">DİM 300</h1>
              <p class="home-subtitle">${escapeHtml(t('heroTitle'))}</p>
            </div>

            <!-- 4 Hairline-Divided Subject Catalog Entries (DİM 01 – DİM 04) -->
            <div class="fac-catalog-list" role="list">
              ${SUBJECTS_META.map((meta, idx) => {
                const code = SUBJECT_CODES[meta.id] || SUBJECT_CODES.math;
                const sb = state.stats.bySubject[meta.id] ?? { attempted: 0, correct: 0 };
                const acc = sb.attempted > 0 ? Math.round((sb.correct / sb.attempted) * 100) : null;
                const subjMistakes = getActiveMistakesCount(meta.id);
                const title = subjectTitle(meta.id);
                const isAct = activeSubject === meta.id;
                return `
                  <article
                    class="fac-catalog-row subject-card subject-card--${meta.id} oa-stagger-item ${isAct ? 'is-active' : ''}"
                    style="--stagger-i:${idx}; --row-c:${code.color}"
                    data-fac-subject="${meta.id}"
                    role="listitem"
                  >
                    <span class="fac-catalog-row__plate mono-code" style="background:${code.color};color:${code.onColor}" aria-hidden="true">${code.num}</span>
                    <div class="fac-catalog-row__main">
                      <div class="fac-catalog-row__top">
                        <span class="fac-catalog-row__no mono-code">${code.catNo}</span>
                        <h2 class="fac-catalog-row__title">
                          <a href="#/subject/${meta.id}" class="fac-catalog-row__link">${escapeHtml(title)}</a>
                        </h2>
                        ${subjMistakes > 0 ? `<a href="#/mistakes?subject=${meta.id}" class="badge badge--warn">${escapeHtml(t('mistakeShortBadge', { n: subjMistakes }))}</a>` : ''}
                      </div>
                      <div class="fac-catalog-row__sub mono-code">
                        <span class="fac-inline-grp">${escapeHtml(t('metaTypesCount', { n: meta.types ?? 0 }))} · ${escapeHtml(t('metaPdfCount', { n: meta.originals ?? 0 }))}</span>
                        <span class="hide-xs" aria-hidden="true">·</span>
                        <span class="fac-inline-grp"><a href="#/practice/${meta.id}" class="fac-inline-act">${escapeHtml(t('btnPractice'))}</a> / <a href="#/originals/${meta.id}" class="fac-inline-act">${escapeHtml(t('btnOriginals'))}</a></span>
                      </div>
                    </div>
                    <div class="fac-catalog-row__pct mono-code tabular-nums">
                      ${acc !== null ? `${acc}%` : `${meta.originals ?? 0}`}
                    </div>
                  </article>
                `;
              }).join('')}
            </div>

            <div class="fac-sleeve__foot-note mono-code text-muted">
              <span>${escapeHtml(t('facSessionStamp'))}</span>
            </div>
          </div>

          <!-- Right Column: Live Interactive Angled 3D Floating Pulsar Stage + Saville Technical Colophon -->
          <div class="fac-sleeve__pulsar">
            <div class="fac-pulsar-hud">
              <div class="fac-pulsar-hud__val" id="fac-active-readout">
                <span class="fac-dot-sq" style="background:${activeCode.color}"></span>
                <span class="mono-code">${activeCode.catNo}</span>
                <strong>${escapeHtml(subjectTitle(activeSubject))}</strong>
                <span class="mono-code text-secondary tabular-nums">${activeAcc !== null ? `${activeAcc}%` : `${activeMeta.originals ?? 0} PDF`}</span>
              </div>

              ${totalAttempted > 0 ? `
                <div class="fac-colophon fac-pulsar-hud__stats mono-code tabular-nums">
                  <div class="fac-colophon__row">
                    <span>${escapeHtml(t('statSolved'))}</span>
                    <b>${totalAttempted}</b>
                  </div>
                  <div class="fac-colophon__row">
                    <span>${escapeHtml(t('statAccuracy'))}</span>
                    <b>${accuracy}%</b>
                  </div>
                  <div class="fac-colophon__row">
                    <span>${escapeHtml(t('statStreak'))}</span>
                    <b>${escapeHtml(t('daysShort', { n: streakDays }))}</b>
                  </div>
                  <div class="fac-colophon__meter" id="fac-colophon-meter">
                    ${buildSignalMeterHtml(activeAcc ?? accuracy, activeCode.color, { ariaLabel: t('statAccuracy') })}
                  </div>
                </div>
              ` : `
                <div class="fac-colophon mono-code tabular-nums">
                  <div class="fac-colophon__row">
                    <span>${escapeHtml(t('facColophonStatus'))}</span>
                    <b>${escapeHtml(t('facStatusReady'))}</b>
                  </div>
                  <div class="fac-colophon__row">
                    <span>${escapeHtml(t('facColophonItems'))}</span>
                    <b>230 PDF</b>
                  </div>
                  <div class="fac-colophon__meter" id="fac-colophon-meter">
                    ${buildSignalMeterHtml(0, activeCode.color, { ariaLabel: t('statAccuracy') })}
                  </div>
                </div>
              `}
            </div>

            <div class="fac-pulsar-canvas-wrap">
              <canvas
                id="fac-pulsar-canvas"
                class="fac-pulsar-canvas"
                role="img"
                aria-label="${escapeHtml(t('facPulsarAria'))}"
              ></canvas>
            </div>
          </div>
        </section>

        <!-- Full-Width Bottom Industrial Color Decoder & Primary Exam Launch Bar -->
        <section class="fac-decoder-bar home-welcome__cta-row" aria-label="${escapeHtml(t('chooseSubject'))}">
          <div class="fac-decoder-bar__left">
            <div class="fac-decoder-swatches" role="group" aria-label="${escapeHtml(t('chooseSubject'))}">
              ${SUBJECTS_META.map((meta) => {
                const code = SUBJECT_CODES[meta.id] || SUBJECT_CODES.math;
                return `
                  <a
                    href="#/subject/${meta.id}"
                    class="fac-swatch-btn ${activeSubject === meta.id ? 'is-active' : ''}"
                    style="background:${code.color}"
                    data-decoder-subject="${meta.id}"
                    aria-label="${escapeHtml(`${code.catNo} ${subjectTitle(meta.id)}`)}"
                    title="${escapeHtml(`${code.catNo} — ${subjectTitle(meta.id)}`)}"
                  >
                    <span class="sr-only">${escapeHtml(subjectShort(meta.id))}</span>
                  </a>
                `;
              }).join('')}
              <a
                href="#/originals/math"
                class="fac-swatch-btn fac-swatch-btn--paper"
                data-decoder-paper="1"
                aria-label="${escapeHtml(t('facRel0903Title'))}"
                title="${escapeHtml(t('facSessionStamp'))}"
              >
                <span class="sr-only">PDF</span>
              </a>
            </div>
            <span class="fac-decoder-label mono-code text-secondary" id="fac-decoder-label">
              ${escapeHtml(t('facDecoderHint'))}
            </span>
          </div>

          <a href="${primaryCta.href}" class="btn btn--primary btn--lg fac-launch-cta">
            <span>${escapeHtml(primaryCta.label)}</span>
            ${icon('arrow-right', { size: 17 })}
          </a>
        </section>

        <!-- Below the Fold: Factory Archival Releases Strip (FAC 09.03 | FAC 15.03 | FAC ERR) -->
        <section class="fac-releases-section" aria-labelledby="archive-releases-heading">
          <div class="fac-releases-grid">
            <div class="fac-releases-intro">
              <h2 id="archive-releases-heading" class="section-title">${escapeHtml(t('facArchiveHeading'))}</h2>
              <p class="text-secondary">${escapeHtml(t('facArchiveSub'))}</p>
              <a href="#/exam/all" class="btn btn--secondary btn--sm">
                <span>${escapeHtml(t('bannerExamBtn'))}</span>
                ${icon('arrow-right', { size: 15 })}
              </a>
            </div>

            <article class="fac-release-tile">
              <div class="fac-release-tile__top">
                <span class="mono-code fac-release-tile__no">FAC 09.03</span>
                <span class="mono-code text-muted tabular-nums">${done0903} / 115</span>
              </div>
              <div class="fac-release-tile__dial">
                ${buildRadialSpectrumSvg(pct0903, '#D63031', { size: 196, seed: 9 })}
              </div>
              <h3 class="fac-release-tile__title">${escapeHtml(t('facRel0903Title'))}</h3>
              <dl class="fac-spec-kv mono-code tabular-nums">
                <div><dt>${escapeHtml(t('facColophonFormat'))}</dt><dd>4 PDF · 115</dd></div>
                <div><dt>${escapeHtml(t('facColophonProgress'))}</dt><dd>${pct0903}%</dd></div>
              </dl>
              <div class="fac-release-tile__links mono-code">
                <a href="#/originals/math?pdf=0903">${escapeHtml(subjectShort('math'))}</a>
                <a href="#/originals/ru?pdf=0903">${escapeHtml(subjectShort('ru'))}</a>
                <a href="#/originals/en?pdf=0903">${escapeHtml(subjectShort('en'))}</a>
                <a href="#/originals/az?pdf=0903">${escapeHtml(subjectShort('az'))}</a>
              </div>
            </article>

            <article class="fac-release-tile">
              <div class="fac-release-tile__top">
                <span class="mono-code fac-release-tile__no">FAC 15.03</span>
                <span class="mono-code text-muted tabular-nums">${done1503} / 115</span>
              </div>
              <div class="fac-release-tile__dial">
                ${buildRadialSpectrumSvg(pct1503, '#2663C9', { size: 196, seed: 15 })}
              </div>
              <h3 class="fac-release-tile__title">${escapeHtml(t('facRel1503Title'))}</h3>
              <dl class="fac-spec-kv mono-code tabular-nums">
                <div><dt>${escapeHtml(t('facColophonFormat'))}</dt><dd>4 PDF · 115</dd></div>
                <div><dt>${escapeHtml(t('facColophonProgress'))}</dt><dd>${pct1503}%</dd></div>
              </dl>
              <div class="fac-release-tile__links mono-code">
                <a href="#/originals/math?pdf=1503">${escapeHtml(subjectShort('math'))}</a>
                <a href="#/originals/ru?pdf=1503">${escapeHtml(subjectShort('ru'))}</a>
                <a href="#/originals/en?pdf=1503">${escapeHtml(subjectShort('en'))}</a>
                <a href="#/originals/az?pdf=1503">${escapeHtml(subjectShort('az'))}</a>
              </div>
            </article>

            <article class="fac-release-tile">
              <div class="fac-release-tile__top">
                <span class="mono-code fac-release-tile__no">FAC ERR</span>
                <span class="badge ${activeMistakes > 0 ? 'badge--warn' : 'badge--subtle'} tabular-nums">${activeMistakes}</span>
              </div>
              <div class="fac-release-tile__dial">
                ${buildRadialSpectrumSvg(pctErr, activeMistakes > 0 ? '#D63031' : '#2E9E5B', { size: 196, seed: 27 })}
              </div>
              <h3 class="fac-release-tile__title">${escapeHtml(t('facRelErrTitle'))}</h3>
              <dl class="fac-spec-kv mono-code tabular-nums">
                <div><dt>${escapeHtml(t('facColophonStatus'))}</dt><dd>${activeMistakes > 0 ? escapeHtml(t('facStatusActive')) : escapeHtml(t('facStatusReady'))}</dd></div>
                <div><dt>${escapeHtml(t('facColophonProgress'))}</dt><dd>${resolvedMistakes}/${totalMistakesRecorded}</dd></div>
              </dl>
              <div class="fac-release-tile__cta">
                <a href="#/mistakes" class="btn btn--secondary btn--sm">
                  <span>${escapeHtml(t('bannerMistakesBtn', { n: activeMistakes }))}</span>
                  ${icon('arrow-right', { size: 14 })}
                </a>
              </div>
            </article>
          </div>
        </section>
      </div>
    `;

    // Wire Active Exam Discard 2-step controls
    container.querySelector('[data-action="ask-discard-exam"]')?.addEventListener('click', () => {
      confirmDiscard = true;
      render();
    });
    container.querySelector('[data-action="cancel-discard-exam"]')?.addEventListener('click', () => {
      confirmDiscard = false;
      render();
    });
    container.querySelector('[data-action="confirm-discard-exam"]')?.addEventListener('click', () => {
      haptic('warning');
      clearActiveExam();
      confirmDiscard = false;
      render();
    });

    const readoutEl = container.querySelector('#fac-active-readout');
    const decoderLbl = container.querySelector('#fac-decoder-label');
    const meterHost = container.querySelector('#fac-colophon-meter');

    function setHighlightedSubject(sid) {
      if (!sid || !SUBJECT_CODES[sid]) return;
      activeSubject = sid;
      const code = SUBJECT_CODES[sid];
      const meta = metaById[sid] || SUBJECTS_META[0];
      const sb = state.stats.bySubject[sid] ?? { attempted: 0, correct: 0 };
      const acc = sb.attempted > 0 ? Math.round((sb.correct / sb.attempted) * 100) : null;

      container.querySelectorAll('.fac-catalog-row').forEach((row) => {
        row.classList.toggle('is-active', row.dataset.facSubject === sid);
      });
      container.querySelectorAll('[data-decoder-subject]').forEach((sw) => {
        sw.classList.toggle('is-active', sw.dataset.decoderSubject === sid);
      });
      if (readoutEl) {
        readoutEl.innerHTML = `
          <span class="fac-dot-sq" style="background:${code.color}"></span>
          <span class="mono-code">${code.catNo}</span>
          <strong>${escapeHtml(subjectTitle(sid))}</strong>
          <span class="mono-code text-secondary tabular-nums">${acc !== null ? `${acc}%` : `${meta.originals ?? 0} PDF`}</span>
        `;
      }
      if (meterHost) {
        meterHost.innerHTML = buildSignalMeterHtml(acc ?? (totalAttempted > 0 ? accuracy : 0), code.color, { ariaLabel: subjectTitle(sid) });
      }
      if (decoderLbl) {
        decoderLbl.textContent = t('facDecoderActive', {
          code: code.catNo,
          subject: subjectTitle(sid),
          types: meta.types ?? 0,
          pdfs: meta.originals ?? 0,
        });
      }
      pulsarCtrl?.setActive(sid);
    }

    // Mount live interactive angled 3D Pulsar Canvas
    const canvasEl = container.querySelector('#fac-pulsar-canvas');
    pulsarCtrl = mountHomePulsar(canvasEl, {
      statsBySubject: state.stats.bySubject,
      activeSubject,
      onSelectSubject: (sid) => {
        haptic('selection');
        setHighlightedSubject(sid);
      },
    });

    // Hover/focus synchronization across catalog rows & bottom color decoder blocks
    container.querySelectorAll('.fac-catalog-row').forEach((row) => {
      const sid = row.dataset.facSubject;
      row.addEventListener('pointerenter', () => setHighlightedSubject(sid));
      row.addEventListener('focusin', () => setHighlightedSubject(sid));
    });
    container.querySelectorAll('[data-decoder-subject]').forEach((sw) => {
      const sid = sw.dataset.decoderSubject;
      sw.addEventListener('pointerenter', () => setHighlightedSubject(sid));
      sw.addEventListener('focus', () => setHighlightedSubject(sid));
    });
    container.querySelector('[data-decoder-paper]')?.addEventListener('pointerenter', () => {
      if (decoderLbl) decoderLbl.textContent = t('facSessionStamp');
    });
  }

  render();
}
