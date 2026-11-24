// Home Screen — Obsidian Atelier Asymmetric Workbench + Sculpted Ulduz 8-Ray Light Compass.
// Instant cold render from static SUBJECTS_META (zero eager subject bundle loading).

import { SUBJECTS_META } from '../../subjects/index.js';
import { loadState, clearActiveExam, getActiveMistakesCount, getFxMode } from '../../core/storage.js';
import { haptic } from '../../core/native.js';
import { hasResponse } from '../task-view.js';
import { t, subjectTitle } from '../i18n.js';
import { icon, ulduzStarSvg } from '../icons.js';
import { escapeHtml } from '../math.js';
import { oaAnimateCounter } from '../ui-kit.js';

const SUBJECT_DESC_KEYS = {
  math: 'subjectMathDesc',
  ru: 'subjectRuDesc',
  en: 'subjectEnDesc',
  az: 'subjectAzDesc',
};

const COMPASS_NODES = [
  { id: 'math', angleDeg: -90, labelPos: 'top' },
  { id: 'ru',   angleDeg: 0,   labelPos: 'right' },
  { id: 'en',   angleDeg: 90,  labelPos: 'bottom' },
  { id: 'az',   angleDeg: 180, labelPos: 'left' },
];

function buildVernierTicksSvg() {
  const ticks = [];
  for (let i = 0; i < 48; i++) {
    const major = i % 6 === 0;
    const r1 = major ? 112 : 117;
    const r2 = 123;
    const deg = i * (360 / 48);
    ticks.push(
      `<line x1="160" y1="${160 - r1}" x2="160" y2="${160 - r2}" class="${major ? 'compass-tick compass-tick--major' : 'compass-tick'}" transform="rotate(${deg} 160 160)" />`
    );
  }
  return ticks.join('');
}

function buildCompassStarRaysSvg(streakDays) {
  const rays = [];
  const lit = Math.min(8, Math.max(0, Math.floor(Number(streakDays) || 0)));
  for (let i = 0; i < 8; i++) {
    const angle = i * 45;
    // Symmetric 4 cardinal rays when fresh (streak=0); progressive 1..8 illumination with active streak
    const isLit = lit === 0 ? (i % 2 === 0) : (i < lit);
    rays.push(
      `<polygon class="compass-ray ${isLit ? 'is-lit' : ''}" data-compass-ray="${i}" points="160,82 168.5,142 160,152 151.5,142" transform="rotate(${angle} 160 160)" />`
    );
  }
  return rays.join('');
}

function buildWatermarkSvg(glyph) {
  return `<svg class="subject-card__watermark-svg" viewBox="0 0 120 120" width="120" height="120" aria-hidden="true" focusable="false">
    <text x="112" y="102" text-anchor="end" fill="#FFFFFF" fill-opacity="0.065" font-size="96" font-weight="800">${escapeHtml(glyph)}</text>
  </svg>`;
}

export async function renderHomeView(container, { setFxMode: applyFxMode, setCleanup } = {}) {
  let confirmDiscard = false;
  let compassRaf = 0;

  if (setCleanup) {
    setCleanup(() => {
      if (compassRaf) {
        cancelAnimationFrame(compassRaf);
        compassRaf = 0;
      }
    });
  }

  function render() {
    if (compassRaf) {
      cancelAnimationFrame(compassRaf);
      compassRaf = 0;
    }

    const state = loadState();
    const activeFx = getFxMode();
    const totalAttempted = state.stats.totalAttempted || 0;
    const totalCorrect = state.stats.totalCorrect || 0;
    const accuracy = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0;
    const activeMistakes = getActiveMistakesCount();
    const streakDays = state.streak?.days || 0;
    const activeExam = state.activeExam;

    const activeAnswered = activeExam
      ? (activeExam.tasks || []).filter((tk) => hasResponse(tk, activeExam.responses?.[tk.id])).length
      : 0;
    const activeTotal = activeExam?.tasks?.length || 0;

    const primaryCta = activeMistakes > 0
      ? { href: '#/mistakes', label: t('heroPrimaryMistakes', { n: activeMistakes }) }
      : totalAttempted > 0
      ? { href: '#/exam/all', label: t('heroPrimaryContinue') }
      : { href: '#/exam/all', label: t('heroPrimaryNew') };

    const metaById = Object.fromEntries(SUBJECTS_META.map((m) => [m.id, m]));

    container.innerHTML = `
      <div class="page-container">
        ${activeExam ? `
          <div class="active-exam-banner" data-specular role="region" aria-label="${escapeHtml(t('examActiveBanner'))}">
            <div class="active-exam-banner__info">
              <span class="active-exam-banner__dot" aria-hidden="true"></span>
              <div>
                <strong>${escapeHtml(t('examActiveBanner'))}: ${escapeHtml(activeExam.title || subjectTitle(activeExam.subjectId))}</strong>
                <span class="text-secondary tabular-nums"> · ${escapeHtml(t('examAnsweredProgress', { done: activeAnswered, total: activeTotal }))}</span>
              </div>
            </div>
            <div class="active-exam-banner__actions">
              ${!confirmDiscard ? `
                <a href="#/exam/${escapeHtml(activeExam.subjectId)}?resume=1" class="btn btn--primary btn--sm" data-ripple>
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

        <!-- Asymmetric Obsidian Atelier Showcase + Sculpted Ulduz 8-Ray Light Compass -->
        <section class="home-welcome atelier-stage">
          <div class="home-welcome__text">
            <h1 class="home-title">${escapeHtml(t('heroTitle'))}</h1>
            <p class="home-subtitle">${escapeHtml(t('heroSubtitle'))}</p>

            <div class="home-welcome__cta-row">
              <a href="${primaryCta.href}" class="btn btn--primary btn--lg" data-magnetic data-ripple>
                <span class="oa-mag-inner">
                  <span>${escapeHtml(primaryCta.label)}</span>
                  ${icon('arrow-right', { size: 16 })}
                </span>
              </a>
              ${totalAttempted === 0 ? `<span class="home-welcome__hint text-muted">${escapeHtml(t('heroSecondaryNew'))}</span>` : ''}
            </div>

            ${totalAttempted > 0 ? `
              <div class="home-stats-strip" aria-label="${escapeHtml(t('navStats'))}">
                <div class="home-stat">
                  <span class="home-stat__val tabular-nums" data-count-to="${totalAttempted}">${totalAttempted}</span>
                  <span class="home-stat__lbl">${escapeHtml(t('statSolved'))}</span>
                </div>
                <div class="home-stat">
                  <span class="home-stat__val tabular-nums" data-count-to="${accuracy}" data-count-suffix="%">${accuracy}%</span>
                  <span class="home-stat__lbl">${escapeHtml(t('statAccuracy'))}</span>
                </div>
                <a href="#/mistakes" class="home-stat home-stat--link ${activeMistakes > 0 ? 'is-alert' : ''}">
                  <span class="home-stat__val tabular-nums">${activeMistakes}</span>
                  <span class="home-stat__lbl">${escapeHtml(t('statMistakes'))}</span>
                </a>
                <div class="home-stat">
                  <span class="home-stat__val home-stat__val--star tabular-nums">
                    ${ulduzStarSvg(Math.min(8, streakDays > 0 ? Math.max(1, streakDays) : 0), { size: 18 })}
                    <span>${escapeHtml(t('daysShort', { n: streakDays }))}</span>
                  </span>
                  <span class="home-stat__lbl">${escapeHtml(t('statStreak'))}</span>
                </div>
              </div>
            ` : ''}
          </div>

          <!-- Right Optical Column: Sculpted Ulduz Compass + Live 3-Tier Light FX Strip -->
          <div class="atelier-compass-col">
            <div class="atelier-compass-wrap" id="ulduz-compass" data-specular aria-label="${escapeHtml(t('compassAria'))}">
              <svg class="atelier-compass__svg" viewBox="0 0 320 320" width="320" height="320" aria-hidden="true">
                <defs>
                  <linearGradient id="compassWedgeGrad" x1="0" y1="0.5" x2="1" y2="0.5">
                    <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.16" />
                    <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0" />
                  </linearGradient>
                </defs>
                <circle class="compass-orbit compass-orbit--outer" cx="160" cy="160" r="126" />
                <circle class="compass-orbit compass-orbit--inner" cx="160" cy="160" r="82" />
                <g class="compass-vernier">${buildVernierTicksSvg()}</g>
                <line class="compass-axis" x1="160" y1="36" x2="160" y2="284" />
                <line class="compass-axis" x1="36" y1="160" x2="284" y2="160" />
                <!-- Spring-steered interactive optical beam & radar cone -->
                <g class="compass-beam" id="compass-beam" transform="rotate(-45 160 160)">
                  <path class="compass-beam__cone" d="M160 160 L272 134 A118 118 0 0 1 272 186 Z" fill="url(#compassWedgeGrad)" />
                  <line class="compass-beam__line" x1="160" y1="160" x2="274" y2="160" />
                  <circle class="compass-beam__tip" cx="274" cy="160" r="3.4" />
                </g>
                <!-- 8-Ray Geometric Ulduz Star -->
                <g class="compass-star">${buildCompassStarRaysSvg(streakDays)}</g>
                <circle class="compass-aperture-bg" cx="160" cy="160" r="52" />
                <circle class="compass-aperture-ring" cx="160" cy="160" r="52" />
              </svg>

              <!-- Center Telemetry Readout (legible >=11.2px inside r=52 aperture) -->
              <div class="atelier-compass__core" aria-live="polite">
                <span class="atelier-compass__core-title mono-code" id="compass-core-title">${escapeHtml(t('compassCenterDefault'))}</span>
                <span class="atelier-compass__core-sub tabular-nums" id="compass-core-sub">230 PDF</span>
              </div>

              <!-- 4 Interactive Orbital Subject Portals -->
              ${COMPASS_NODES.map((node) => {
                const meta = metaById[node.id];
                const sb = state.stats.bySubject[node.id] ?? { attempted: 0, correct: 0 };
                const acc = sb.attempted > 0 ? Math.round((sb.correct / sb.attempted) * 100) : null;
                const subTitle = subjectTitle(node.id);
                const detailText = acc !== null
                  ? `${sb.attempted} · ${acc}%`
                  : `${meta?.originals ?? 0} PDF`;
                return `
                  <a
                    href="#/subject/${node.id}"
                    class="compass-beacon compass-beacon--${node.labelPos}"
                    data-compass-subject="${node.id}"
                    data-compass-angle="${node.angleDeg}"
                    data-compass-title="${escapeHtml(subTitle)}"
                    data-compass-detail="${escapeHtml(detailText)}"
                    aria-label="${escapeHtml(t('compassOpenSubject', { subject: subTitle }))}"
                    title="${escapeHtml(subTitle)}"
                    data-ripple
                  >
                    <span class="compass-beacon__glyph">${escapeHtml(meta?.icon ?? '')}</span>
                  </a>
                `;
              }).join('')}
            </div>

            <!-- Live 3-Tier Interactive FX Mode Switcher docked quietly under the Optical Compass -->
            <div class="home-fx-strip" role="group" aria-label="${escapeHtml(t('fxSectionTitle'))}">
              ${[
                ['minimal', 'circle-dot'],
                ['tactile', 'sparkles'],
                ['webgl', 'waves'],
              ].map(([fxId, ic]) => `
                <button
                  type="button"
                  class="home-fx-pill ${activeFx === fxId ? 'is-active' : ''}"
                  data-action="select-fx-inline"
                  data-fx-id="${fxId}"
                  aria-pressed="${activeFx === fxId}"
                  data-ripple
                >
                  ${icon(ic, { size: 13 })}
                  <span>${escapeHtml(t(`fxShort_${fxId}`))}</span>
                </button>
              `).join('')}
            </div>
          </div>
        </section>

        <!-- Staggered Asymmetric Subject Runway (7fr/5fr + 5fr/7fr) -->
        <section class="section-block" aria-labelledby="subjects-heading">
          <div class="section-header">
            <h2 id="subjects-heading" class="section-title">${escapeHtml(t('chooseSubject'))}</h2>
            <p class="section-subtitle">${escapeHtml(t('chooseSubjectSub'))}</p>
          </div>

          <div class="subjects-grid atelier-subjects">
            ${SUBJECTS_META.map((meta, idx) => {
              const typeCount = meta.types ?? 0;
              const topicsCount = meta.topics ?? 1;
              const origCount = meta.originals ?? 0;
              const sb = state.stats.bySubject[meta.id] ?? { attempted: 0, correct: 0 };
              const subjAcc = sb.attempted > 0 ? Math.round((sb.correct / sb.attempted) * 100) : 0;
              const subjMistakes = getActiveMistakesCount(meta.id);
              const title = subjectTitle(meta.id);
              const desc = t(SUBJECT_DESC_KEYS[meta.id]) || '';
              const spanCls = idx === 0 || idx === 3 ? 'subject-card--wide' : 'subject-card--compact';

              return `
                <article class="subject-card subject-card--${meta.id} ${spanCls} oa-stagger-item" style="--stagger-i:${idx}" data-specular>
                  ${buildWatermarkSvg(meta.icon)}

                  <div class="subject-card__top">
                    <a href="#/subject/${meta.id}" class="subject-card__icon-wrap" aria-hidden="true" tabindex="-1">
                      <span class="subject-card__icon">${escapeHtml(meta.icon)}</span>
                    </a>
                    <div class="subject-card__headings">
                      <div class="subject-card__title-row">
                        <h3 class="subject-card__title">
                          <a href="#/subject/${meta.id}" class="subject-card__title-link">${escapeHtml(title)}</a>
                        </h3>
                        ${subjMistakes > 0 ? `<a href="#/mistakes?subject=${meta.id}" class="badge badge--warn">${escapeHtml(t('mistakeShortBadge', { n: subjMistakes }))}</a>` : ''}
                      </div>
                      <p class="subject-card__desc">${escapeHtml(desc)}</p>
                    </div>
                  </div>

                  <div class="subject-card__meta-line mono-code">
                    <span>${escapeHtml(t('metaTopicsCount', { n: topicsCount || 1 }))}</span>
                    <span class="meta-sep" aria-hidden="true">·</span>
                    <span>${escapeHtml(t('metaTypesCount', { n: typeCount }))}</span>
                    <span class="meta-sep" aria-hidden="true">·</span>
                    <span>${escapeHtml(t('metaPdfCount', { n: origCount }))}</span>
                  </div>

                  ${sb.attempted > 0 ? `
                    <div class="subject-card__progress">
                      <div class="progress-row">
                        <span class="text-secondary">${escapeHtml(t('labelSolved'))}: <b class="tabular-nums">${sb.attempted}</b></span>
                        <span class="text-secondary">${escapeHtml(t('labelAccuracy'))}: <b class="tabular-nums">${subjAcc}%</b></span>
                      </div>
                      <div class="progress-bar" role="progressbar" aria-valuenow="${subjAcc}" aria-valuemin="0" aria-valuemax="100">
                        <div class="progress-bar__fill" style="width:${subjAcc}%"></div>
                      </div>
                    </div>
                  ` : `
                    <div class="subject-card__fresh text-muted">${escapeHtml(t('notStartedYet'))}</div>
                  `}

                  <div class="subject-card__actions">
                    <a href="#/subject/${meta.id}" class="btn btn--secondary btn--sm subject-card__primary-btn" data-ripple>${escapeHtml(t('btnPractice'))}</a>
                    <a href="#/exam/${meta.id}" class="btn btn--ghost btn--sm" data-ripple>
                      ${icon('clock', { size: 15 })}
                      <span>${escapeHtml(t('btnExam'))}</span>
                    </a>
                    <a href="#/originals/${meta.id}" class="btn btn--ghost btn--sm" data-ripple>
                      ${icon('file-text', { size: 15 })}
                      <span>${escapeHtml(t('btnOriginals'))}</span>
                    </a>
                  </div>
                </article>
              `;
            }).join('')}
          </div>
        </section>

        <!-- Bottom Architectural Command Split Rail -->
        <section class="quick-banners-grid" aria-label="${escapeHtml(t('bannerExamTitle'))}">
          <div class="feature-banner" data-specular>
            <div class="feature-banner__body">
              <h3>${escapeHtml(t('bannerExamTitle'))}</h3>
              <p>${escapeHtml(t('bannerExamDesc'))}</p>
            </div>
            <div class="feature-banner__cta">
              <a href="#/exam/all" class="btn btn--secondary btn--sm" data-ripple>
                <span>${escapeHtml(t('bannerExamBtn'))}</span>
                ${icon('arrow-right', { size: 15 })}
              </a>
            </div>
          </div>

          <div class="feature-banner" data-specular>
            <div class="feature-banner__body">
              <h3>${escapeHtml(t('bannerMistakesTitle'))}</h3>
              <p>${escapeHtml(t('bannerMistakesDesc'))}</p>
            </div>
            <div class="feature-banner__cta">
              <a href="#/mistakes" class="btn btn--secondary btn--sm" data-ripple>
                <span>${escapeHtml(t('bannerMistakesBtn', { n: activeMistakes }))}</span>
                ${icon('arrow-right', { size: 15 })}
              </a>
            </div>
          </div>
        </section>
      </div>
    `;

    // Animate telemetry counters softly
    container.querySelectorAll('[data-count-to]').forEach((el) => {
      const targetVal = Number(el.dataset.countTo || 0);
      const suffix = el.dataset.countSuffix || '';
      oaAnimateCounter(el, targetVal, { duration: 480, suffix });
    });

    // Wire inline live 3-tier FX switcher
    container.querySelectorAll('[data-action="select-fx-inline"]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const fxId = btn.dataset.fxId;
        if (!fxId) return;
        haptic('selection');
        if (applyFxMode) applyFxMode(fxId);
      });
    });

    // Wire Interactive Ulduz 8-Ray Light Compass
    const compassEl = container.querySelector('#ulduz-compass');
    const beamEl = container.querySelector('#compass-beam');
    const coreTitleEl = container.querySelector('#compass-core-title');
    const coreSubEl = container.querySelector('#compass-core-sub');
    const defaultTitle = t('compassCenterDefault');
    const defaultSub = '230 PDF';

    if (compassEl && beamEl) {
      let curAngle = -45;
      let targetAngle = -45;
      let isPointerInside = false;

      const shortestDelta = (from, to) => {
        let d = ((to - from + 540) % 360) - 180;
        if (d < -180) d += 360;
        return d;
      };

      const stepBeam = () => {
        const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
        const delta = shortestDelta(curAngle, targetAngle);
        if (reduced || Math.abs(delta) < 0.15) {
          curAngle = targetAngle;
          beamEl.setAttribute('transform', `rotate(${curAngle.toFixed(2)} 160 160)`);
          compassRaf = 0;
          return;
        }
        curAngle += delta * 0.16;
        beamEl.setAttribute('transform', `rotate(${curAngle.toFixed(2)} 160 160)`);
        compassRaf = requestAnimationFrame(stepBeam);
      };

      const aimTo = (deg) => {
        targetAngle = deg;
        if (!compassRaf) compassRaf = requestAnimationFrame(stepBeam);
      };

      const resetReadout = () => {
        if (coreTitleEl) coreTitleEl.textContent = defaultTitle;
        if (coreSubEl) coreSubEl.textContent = defaultSub;
        compassEl.querySelectorAll('.compass-beacon').forEach((b) => b.classList.remove('is-focused'));
      };

      compassEl.addEventListener('pointermove', (e) => {
        isPointerInside = true;
        const rect = compassEl.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const deg = (Math.atan2(e.clientY - cy, e.clientX - cx) * 180) / Math.PI;
        aimTo(deg);
      }, { passive: true });

      compassEl.addEventListener('pointerleave', () => {
        isPointerInside = false;
        resetReadout();
        aimTo(-45);
      }, { passive: true });

      compassEl.querySelectorAll('.compass-beacon').forEach((beacon) => {
        const focusBeacon = () => {
          const deg = Number(beacon.dataset.compassAngle || 0);
          aimTo(deg);
          compassEl.querySelectorAll('.compass-beacon').forEach((b) => b.classList.toggle('is-focused', b === beacon));
          if (coreTitleEl) coreTitleEl.textContent = beacon.dataset.compassTitle || defaultTitle;
          if (coreSubEl) coreSubEl.textContent = beacon.dataset.compassDetail || defaultSub;
        };
        beacon.addEventListener('pointerenter', focusBeacon);
        beacon.addEventListener('focus', focusBeacon);
        beacon.addEventListener('blur', () => {
          if (!isPointerInside) resetReadout();
        });
      });
    }

    container.querySelector('[data-action="ask-discard-exam"]')?.addEventListener('click', () => {
      confirmDiscard = true;
      render();
      container.querySelector('[data-action="cancel-discard-exam"]')?.focus();
    });
    container.querySelector('[data-action="cancel-discard-exam"]')?.addEventListener('click', () => {
      confirmDiscard = false;
      render();
      container.querySelector('[data-action="ask-discard-exam"]')?.focus();
    });
    container.querySelector('[data-action="confirm-discard-exam"]')?.addEventListener('click', () => {
      clearActiveExam();
      confirmDiscard = false;
      render();
    });
  }

  render();
}
