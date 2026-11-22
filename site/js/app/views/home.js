// Home screen: Instant render from static SUBJECTS_META (zero eager subject bundle parsing on cold start).

import { SUBJECTS_META } from '../../subjects/index.js';
import { loadState, clearActiveExam, getActiveMistakesCount } from '../../core/storage.js';
import { hasResponse } from '../task-view.js';
import { t, subjectTitle } from '../i18n.js';
import { icon, ulduzStarSvg } from '../icons.js';
import { escapeHtml } from '../math.js';

const SUBJECT_DESC_KEYS = {
  math: 'subjectMathDesc',
  ru: 'subjectRuDesc',
  en: 'subjectEnDesc',
  az: 'subjectAzDesc',
};

export async function renderHomeView(container) {
  let confirmDiscard = false;

  function render() {
    const state = loadState();
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

    // One clear primary CTA based on student's current state
    const primaryCta = activeMistakes > 0
      ? { href: '#/mistakes', label: t('heroPrimaryMistakes', { n: activeMistakes }) }
      : totalAttempted > 0
      ? { href: '#/exam/all', label: t('heroPrimaryContinue') }
      : { href: '#/exam/all', label: t('heroPrimaryNew') };

    const starLit = Math.min(8, streakDays > 0 ? Math.max(1, streakDays) : 0);

    container.innerHTML = `
      <div class="page-container">
        ${activeExam ? `
          <div class="active-exam-banner" role="region" aria-label="${escapeHtml(t('examActiveBanner'))}">
            <div class="active-exam-banner__info">
              <span class="active-exam-banner__dot" aria-hidden="true"></span>
              <div>
                <strong>${escapeHtml(t('examActiveBanner'))}: ${escapeHtml(activeExam.title || subjectTitle(activeExam.subjectId))}</strong>
                <span class="text-secondary tabular-nums"> · ${escapeHtml(t('examAnsweredProgress', { done: activeAnswered, total: activeTotal }))}</span>
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

        <!-- Serene Flat Welcome Band (no nested cards, no banned eyebrow, no 0/0%/0 wall) -->
        <section class="home-welcome">
          <div class="home-welcome__text">
            <h1 class="home-title">${escapeHtml(t('heroTitle'))}</h1>
            <p class="home-subtitle">${escapeHtml(t('heroSubtitle'))}</p>

            <div class="home-welcome__cta-row">
              <a href="${primaryCta.href}" class="btn btn--primary">
                <span>${escapeHtml(primaryCta.label)}</span>
                ${icon('arrow-right', { size: 16 })}
              </a>
              ${totalAttempted === 0 ? `<span class="home-welcome__hint text-muted">${escapeHtml(t('heroSecondaryNew'))}</span>` : ''}
            </div>
          </div>

          ${totalAttempted > 0 ? `
            <div class="home-stats-strip" aria-label="${escapeHtml(t('navStats'))}">
              <div class="home-stat">
                <span class="home-stat__val tabular-nums">${totalAttempted}</span>
                <span class="home-stat__lbl">${escapeHtml(t('statSolved'))}</span>
              </div>
              <div class="home-stat">
                <span class="home-stat__val tabular-nums">${accuracy}%</span>
                <span class="home-stat__lbl">${escapeHtml(t('statAccuracy'))}</span>
              </div>
              <a href="#/mistakes" class="home-stat home-stat--link ${activeMistakes > 0 ? 'is-alert' : ''}">
                <span class="home-stat__val tabular-nums">${activeMistakes}</span>
                <span class="home-stat__lbl">${escapeHtml(t('statMistakes'))}</span>
              </a>
              <div class="home-stat">
                <span class="home-stat__val home-stat__val--star tabular-nums">
                  ${ulduzStarSvg(starLit, { size: 18 })}
                  <span>${escapeHtml(t('daysShort', { n: streakDays }))}</span>
                </span>
                <span class="home-stat__lbl">${escapeHtml(t('statStreak'))}</span>
              </div>
            </div>
          ` : ''}
        </section>

        <!-- 4 Calm Subject Cards -->
        <section class="section-block" aria-labelledby="subjects-heading">
          <div class="section-header">
            <h2 id="subjects-heading" class="section-title">${escapeHtml(t('chooseSubject'))}</h2>
            <p class="section-subtitle">${escapeHtml(t('chooseSubjectSub'))}</p>
          </div>

          <div class="subjects-grid">
            ${SUBJECTS_META.map((meta) => {
              const typeCount = meta.types ?? 0;
              const topicsCount = meta.topics ?? 1;
              const origCount = meta.originals ?? 0;
              const sb = state.stats.bySubject[meta.id] ?? { attempted: 0, correct: 0 };
              const subjAcc = sb.attempted > 0 ? Math.round((sb.correct / sb.attempted) * 100) : 0;
              const subjMistakes = getActiveMistakesCount(meta.id);
              const title = subjectTitle(meta.id);
              const desc = t(SUBJECT_DESC_KEYS[meta.id]) || '';

              return `
                <article class="subject-card subject-card--${meta.id}">
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

                  <div class="subject-card__meta-line tabular-nums">
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
                    <a href="#/subject/${meta.id}" class="btn btn--secondary btn--sm subject-card__primary-btn">${escapeHtml(t('btnPractice'))}</a>
                    <a href="#/exam/${meta.id}" class="btn btn--ghost btn--sm">
                      ${icon('clock', { size: 15 })}
                      <span>${escapeHtml(t('btnExam'))}</span>
                    </a>
                    <a href="#/originals/${meta.id}" class="btn btn--ghost btn--sm">
                      ${icon('file-text', { size: 15 })}
                      <span>${escapeHtml(t('btnOriginals'))}</span>
                    </a>
                  </div>
                </article>
              `;
            }).join('')}
          </div>
        </section>

        <!-- Bottom Quick Modules (flat, zero eyebrows above headings) -->
        <section class="quick-banners-grid" aria-label="${escapeHtml(t('bannerExamTitle'))}">
          <div class="feature-banner">
            <div class="feature-banner__body">
              <h3>${escapeHtml(t('bannerExamTitle'))}</h3>
              <p>${escapeHtml(t('bannerExamDesc'))}</p>
            </div>
            <div class="feature-banner__cta">
              <a href="#/exam/all" class="btn btn--secondary btn--sm">
                <span>${escapeHtml(t('bannerExamBtn'))}</span>
                ${icon('arrow-right', { size: 15 })}
              </a>
            </div>
          </div>

          <div class="feature-banner">
            <div class="feature-banner__body">
              <h3>${escapeHtml(t('bannerMistakesTitle'))}</h3>
              <p>${escapeHtml(t('bannerMistakesDesc'))}</p>
            </div>
            <div class="feature-banner__cta">
              <a href="#/mistakes" class="btn btn--secondary btn--sm">
                <span>${escapeHtml(t('bannerMistakesBtn', { n: activeMistakes }))}</span>
                ${icon('arrow-right', { size: 15 })}
              </a>
            </div>
          </div>
        </section>
      </div>
    `;

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
