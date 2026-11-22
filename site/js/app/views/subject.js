// Subject Hub screen (#/subject/:id): topic & task-type picker, quick search, difficulty filter, exam & PDF launchers.

import { getSubject } from '../../subjects/index.js';
import { getExamConfig } from '../../core/scoring.js';
import { loadState, getActiveMistakesCount } from '../../core/storage.js';
import { t, subjectTitle, examDesc, formatFormatBadge } from '../i18n.js';
import { icon } from '../icons.js';
import { escapeHtml, prepareRichHtml, plainReadableText, hydrateMath } from '../math.js';

export async function renderSubjectView(container, { params, query, navigate }) {
  const subjectId = params.id;
  const subject = await getSubject(subjectId);
  if (!subject) {
    navigate('#/');
    return;
  }

  let selectedDiff = Number(query.get('diff')) || 0; // 0 = all, 1, 2, 3
  let searchQuery = '';
  const originals = subject.originals ? await subject.originals() : [];
  const orig0903 = originals.filter((o) => String(o.origin?.pdf ?? o.id).includes('09.03') || String(o.origin?.pdf ?? o.id).includes('0903'));
  const orig1503 = originals.filter((o) => String(o.origin?.pdf ?? o.id).includes('15.03') || String(o.origin?.pdf ?? o.id).includes('1503'));

  const examCfg = getExamConfig(subject);
  const state = loadState();
  const subjMistakes = getActiveMistakesCount(subjectId);
  const localizedSubjectTitle = subjectTitle(subjectId);
  const localizedDesc = examDesc(subjectId, examCfg.description || '');
  const showSearch = (subject.taskTypes?.length ?? 0) > 12;

  // Group taskTypes by topic
  const topicGroups = new Map();
  for (const tp of subject.taskTypes ?? []) {
    const key = tp.topic || 'Общие задания';
    if (!topicGroups.has(key)) topicGroups.set(key, []);
    topicGroups.get(key).push(tp);
  }

  function diffQuery(extra = {}) {
    const p = new URLSearchParams();
    if (selectedDiff) p.set('diff', String(selectedDiff));
    for (const [k, v] of Object.entries(extra)) {
      if (v !== undefined && v !== null && v !== '') p.set(k, String(v));
    }
    const qs = p.toString();
    return qs ? `?${qs}` : '';
  }

  function renderTopicsListHtml() {
    const q = searchQuery.trim().toLowerCase();
    const filteredEntries = [];
    for (const [topicName, types] of topicGroups.entries()) {
      if (!q) {
        filteredEntries.push([topicName, types]);
        continue;
      }
      const topicMatch = topicName.toLowerCase().includes(q);
      const matchedTypes = topicMatch
        ? types
        : types.filter((tp) => plainReadableText(tp.title).toLowerCase().includes(q));
      if (matchedTypes.length > 0) {
        filteredEntries.push([topicName, matchedTypes]);
      }
    }

    if (filteredEntries.length === 0) {
      return `<div class="empty-card"><p class="text-secondary">${escapeHtml(t('searchNoResults', { q: searchQuery.trim() }))}</p></div>`;
    }

    return filteredEntries.map(([topicName, types]) => {
      const tKey = `${subjectId}::${topicName}`;
      const tStat = state.stats.byTopic[tKey] ?? { attempted: 0, correct: 0 };
      const tAcc = tStat.attempted > 0 ? Math.round((tStat.correct / tStat.attempted) * 100) : 0;

      return `
        <div class="topic-group">
          <div class="topic-group__header">
            <div>
              <h3 class="topic-group__title">${escapeHtml(topicName)}</h3>
              <span class="topic-group__meta text-secondary tabular-nums">
                ${escapeHtml(t('topicMetaLine', { types: types.length, attempted: tStat.attempted, acc: tAcc }))}
              </span>
            </div>
            <a href="#/practice/${escapeHtml(subjectId)}${diffQuery({ topic: topicName })}" class="btn btn--secondary btn--sm">
              <span>${escapeHtml(t('topicTrainBtn'))}</span>
              ${icon('arrow-right', { size: 15 })}
            </a>
          </div>

          <div class="task-types-surface">
            ${types.map((tp) => {
              const tyStat = state.stats.byType[tp.id] ?? { attempted: 0, correct: 0 };
              const tyAcc = tyStat.attempted > 0 ? Math.round((tyStat.correct / tyStat.attempted) * 100) : null;
              return `
                <a href="#/practice/${escapeHtml(subjectId)}${diffQuery({ type: tp.id })}" class="task-type-row">
                  <div class="task-type-row__main">
                    <span class="task-type-row__title">${prepareRichHtml(tp.title)}</span>
                    <span class="task-type-row__meta text-muted">
                      <span>${escapeHtml(formatFormatBadge(tp.format))}</span>
                      <span class="meta-sep" aria-hidden="true">·</span>
                      ${tyAcc !== null
                        ? `<span class="tabular-nums">${tyAcc}% (${tyStat.attempted})</span>`
                        : `<span>${escapeHtml(t('typeNewLabel'))}</span>`}
                    </span>
                  </div>
                  <span class="task-type-row__arrow" aria-hidden="true">${icon('chevron-right', { size: 16 })}</span>
                </a>
              `;
            }).join('')}
          </div>
        </div>
      `;
    }).join('');
  }

  function render() {
    container.innerHTML = `
      <div class="page-container">
        <nav class="breadcrumbs" aria-label="${escapeHtml(t('breadcrumbsAria'))}">
          <a href="#/">${escapeHtml(t('navHome'))}</a>
          <span aria-hidden="true">/</span>
          <span aria-current="page">${escapeHtml(localizedSubjectTitle)}</span>
        </nav>

        <!-- Subject Hero (H1 first, metadata quietly below — zero eyebrows above H1) -->
        <section class="subject-hero subject-hero--${escapeHtml(subjectId)}">
          <div class="subject-hero__main">
            <div class="subject-hero__icon" aria-hidden="true">${escapeHtml(subject.meta?.icon ?? '')}</div>
            <div>
              <h1 class="subject-hero__title">${escapeHtml(localizedSubjectTitle)}</h1>
              <p class="subject-hero__meta text-muted tabular-nums">${escapeHtml(t('subjectMetaLine', { min: examCfg.durationMin, orig: originals.length }))}</p>
              <p class="subject-hero__desc">${escapeHtml(localizedDesc)}</p>
            </div>
          </div>

          <div class="subject-hero__actions">
            <a href="#/practice/${escapeHtml(subjectId)}${diffQuery()}" class="btn btn--primary">
              ${icon('sparkles', { size: 16 })}
              <span>${escapeHtml(t('subjectMixedPractice'))}</span>
            </a>
            <a href="#/exam/${escapeHtml(subjectId)}" class="btn btn--secondary">
              ${icon('clock', { size: 16 })}
              <span>${escapeHtml(t('subjectExamSim'))}</span>
            </a>
            <a href="#/originals/${escapeHtml(subjectId)}" class="btn btn--ghost">
              ${icon('file-text', { size: 16 })}
              <span>${escapeHtml(t('btnOriginalsFull'))} (${originals.length})</span>
            </a>
            ${subjMistakes > 0 ? `
              <a href="#/mistakes?subject=${escapeHtml(subjectId)}" class="btn btn--warn-soft">
                ${escapeHtml(t('subjectMistakesBtn', { n: subjMistakes }))}
              </a>
            ` : ''}
          </div>
        </section>

        <!-- Exam & Real PDF Variants Row (semantic H2 before H3 cards!) -->
        <section class="section-block" aria-labelledby="variants-heading">
          <div class="section-header">
            <h2 id="variants-heading" class="section-title">${escapeHtml(t('subjectVariantsHeading'))}</h2>
          </div>

          <div class="variant-cards-grid">
            <article class="variant-card">
              <h3>${escapeHtml(t('variantGenTitle'))}</h3>
              <div class="variant-card__meta text-muted tabular-nums">
                ${icon('sparkles', { size: 14 })}
                <span>${escapeHtml(t('variantGenMeta', { min: examCfg.durationMin }))}</span>
              </div>
              <p>${escapeHtml(t('variantGenDesc'))}</p>
              <div class="variant-card__foot">
                <a href="#/exam/${escapeHtml(subjectId)}?source=generated" class="btn btn--secondary btn--sm">
                  <span>${escapeHtml(t('variantStartExam'))}</span>
                  ${icon('arrow-right', { size: 15 })}
                </a>
              </div>
            </article>

            <article class="variant-card">
              <h3>${escapeHtml(t('variant0903Title'))}</h3>
              <div class="variant-card__meta text-muted tabular-nums">
                ${icon('file-text', { size: 14 })}
                <span>${escapeHtml(t('variantPdfMeta', { n: orig0903.length }))}</span>
              </div>
              <p>${escapeHtml(t('variant0903Desc'))}</p>
              <div class="variant-card__foot">
                <a href="#/originals/${escapeHtml(subjectId)}?pdf=0903" class="btn btn--secondary btn--sm">${escapeHtml(t('variantStepReview'))}</a>
                ${orig0903.length > 0 ? `<a href="#/exam/${escapeHtml(subjectId)}?source=0903" class="btn btn--ghost btn--sm">${escapeHtml(t('variantTimedExam'))}</a>` : ''}
              </div>
            </article>

            <article class="variant-card">
              <h3>${escapeHtml(t('variant1503Title'))}</h3>
              <div class="variant-card__meta text-muted tabular-nums">
                ${icon('file-text', { size: 14 })}
                <span>${escapeHtml(t('variantPdfMeta', { n: orig1503.length }))}</span>
              </div>
              <p>${escapeHtml(t('variant1503Desc'))}</p>
              <div class="variant-card__foot">
                <a href="#/originals/${escapeHtml(subjectId)}?pdf=1503" class="btn btn--secondary btn--sm">${escapeHtml(t('variantStepReview'))}</a>
                ${orig1503.length > 0 ? `<a href="#/exam/${escapeHtml(subjectId)}?source=1503" class="btn btn--ghost btn--sm">${escapeHtml(t('variantTimedExam'))}</a>` : ''}
              </div>
            </article>
          </div>
        </section>

        <!-- Topic & Generator Type Picker (flat hairline rows — zero nested cards) -->
        <section class="section-block" aria-labelledby="topics-heading">
          <div class="section-header section-header--split">
            <div>
              <h2 id="topics-heading" class="section-title">${escapeHtml(t('subjectTopicsHeading', { n: subject.taskTypes?.length ?? 0 }))}</h2>
              <p class="section-subtitle">${escapeHtml(t('subjectTopicsSub'))}</p>
            </div>

            <div class="subject-topics-tools">
              ${showSearch ? `
                <div class="search-field">
                  <span class="search-field__icon" aria-hidden="true">${icon('search', { size: 15 })}</span>
                  <input
                    type="search"
                    id="subject-topic-search"
                    class="search-input"
                    value="${escapeHtml(searchQuery)}"
                    placeholder="${escapeHtml(t('searchTopicsPlaceholder'))}"
                    aria-label="${escapeHtml(t('searchTopicsAria'))}"
                  />
                </div>
              ` : ''}

              <div class="difficulty-Segmented" role="group" aria-label="${escapeHtml(t('difficultyAria'))}">
                ${[
                  [0, t('difficultyAll')],
                  [1, t('difficulty1')],
                  [2, t('difficulty2')],
                  [3, t('difficulty3')],
                ].map(([val, label]) => `
                  <button
                    type="button"
                    class="seg-btn ${selectedDiff === val ? 'is-active' : ''}"
                    data-action="set-diff"
                    data-diff="${val}"
                    aria-pressed="${selectedDiff === val}"
                  >${escapeHtml(label)}</button>
                `).join('')}
              </div>
            </div>
          </div>

          <div class="topics-list" id="subject-topics-list">
            ${renderTopicsListHtml()}
          </div>
        </section>
      </div>
    `;

    hydrateMath(container);

    container.querySelectorAll('[data-action="set-diff"]').forEach((btn) => {
      btn.addEventListener('click', () => {
        selectedDiff = Number(btn.dataset.diff) || 0;
        render();
        container.querySelector(`[data-action="set-diff"][data-diff="${selectedDiff}"]`)?.focus();
      });
    });

    const searchInput = container.querySelector('#subject-topic-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        const listEl = container.querySelector('#subject-topics-list');
        if (listEl) {
          listEl.innerHTML = renderTopicsListHtml();
          hydrateMath(listEl);
        }
      });
    }
  }

  render();
}
