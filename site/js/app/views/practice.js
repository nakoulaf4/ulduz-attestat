// Infinite Practice View (#/practice/:id?topic=...&type=...&diff=...&seed=...)
// Collapsible filter bar, topic auto-sync on ?type=, Ulduz 8-Ray Mastery Star sprint indicator, reload persistence.

import { getSubject } from '../../subjects/index.js';
import { createRng, randomSeed } from '../../core/rng.js';
import { finalizeTask } from '../../core/contract.js';
import {
  recordTaskAttempt,
  saveActivePractice,
  getActivePractice,
} from '../../core/storage.js';
import { mountTaskView } from '../task-view.js';
import { t, subjectTitle } from '../i18n.js';
import { icon, ulduzStarSvg } from '../icons.js';
import { escapeHtml, plainReadableText } from '../math.js';
import { oaFireFxPulse } from '../ui-kit.js';

function pickWeightedType(types, rng) {
  if (!types || types.length === 0) return null;
  const totalWeight = types.reduce((s, tp) => s + Math.max(0.1, Number(tp.weight ?? 1)), 0);
  let r = rng.float() * totalWeight;
  for (const tp of types) {
    r -= Math.max(0.1, Number(tp.weight ?? 1));
    if (r <= 0) return tp;
  }
  return types[types.length - 1];
}

export async function renderPracticeView(container, { params, query, navigate, setKeyHandler }) {
  const subjectId = params.id;
  const subject = await getSubject(subjectId);
  if (!subject || !subject.taskTypes?.length) {
    navigate('#/');
    return;
  }

  const allTypes = subject.taskTypes;
  const allTopics = [...new Set(allTypes.map((tp) => tp.topic).filter(Boolean))];

  let filterTopic = query.get('topic') || '';
  let filterTypeId = query.get('type') || '';
  let filterDiff = Number(query.get('diff')) || 0; // 0 = all (1..3), or 1, 2, 3
  const initialSeedParam = query.get('seed');

  // Auto-sync filterTopic when entering via ?type=... (#10)
  if (filterTypeId && !filterTopic) {
    const matched = allTypes.find((tp) => tp.id === filterTypeId);
    if (matched?.topic) filterTopic = matched.topic;
  }

  let filtersExpanded = false;

  // Session state
  const history = [];
  let historyIdx = -1;
  let sessionAttempted = 0;
  let sessionCorrect = 0;
  let sessionStreak = 0;

  function getFilteredTypes() {
    let list = allTypes;
    if (filterTypeId) {
      const exact = list.filter((tp) => tp.id === filterTypeId);
      if (exact.length > 0) return exact;
    }
    if (filterTopic) {
      const byTop = list.filter((tp) => tp.topic === filterTopic);
      if (byTop.length > 0) return byTop;
    }
    return list;
  }

  function routeKey() {
    return `${subjectId}|${filterTopic}|${filterTypeId}|${filterDiff}`;
  }

  function buildNewItem(forcedType = null, forcedSeed = null) {
    const seed = forcedSeed !== null && forcedSeed !== undefined ? forcedSeed : randomSeed();
    const rng = createRng(seed);
    const pool = getFilteredTypes();
    const chosenType = forcedType || pickWeightedType(pool, rng) || allTypes[0];
    const diff = filterDiff >= 1 && filterDiff <= 3 ? filterDiff : rng.int(1, 3);
    const taskRng = createRng(`${chosenType.id}:${seed}:${diff}`);
    const rawTask = chosenType.generate(taskRng, { difficulty: diff });
    const task = finalizeTask(chosenType, taskRng, rawTask);
    return {
      task,
      response: null,
      checked: false,
      typeId: chosenType.id,
      seed: taskRng.seed,
      diff,
    };
  }

  // Restore saved session on reload if routeKey matches
  const saved = getActivePractice(subjectId);
  if (saved && saved.routeKey === routeKey() && saved.item?.task) {
    history.push(saved.item);
    historyIdx = 0;
    sessionAttempted = saved.sessionAttempted ?? 0;
    sessionCorrect = saved.sessionCorrect ?? 0;
    sessionStreak = saved.sessionStreak ?? 0;
  } else {
    const forcedTp = filterTypeId ? allTypes.find((tp) => tp.id === filterTypeId) : null;
    history.push(buildNewItem(forcedTp, initialSeedParam || null));
    historyIdx = 0;
  }

  function syncUrlHash() {
    const p = new URLSearchParams();
    if (filterTopic) p.set('topic', filterTopic);
    if (filterTypeId) p.set('type', filterTypeId);
    if (filterDiff) p.set('diff', String(filterDiff));
    const qs = p.toString();
    const targetHash = `#/practice/${encodeURIComponent(subjectId)}${qs ? `?${qs}` : ''}`;
    if (window.location.hash !== targetHash && window.history?.replaceState) {
      window.history.replaceState(null, '', targetHash);
    }
  }

  function persistCurrent() {
    const cur = history[historyIdx];
    if (!cur) return;
    saveActivePractice(subjectId, {
      routeKey: routeKey(),
      item: cur,
      sessionAttempted,
      sessionCorrect,
      sessionStreak,
    });
  }

  function renderSessionPillsHtml() {
    const acc = sessionAttempted > 0 ? Math.round((sessionCorrect / sessionAttempted) * 100) : 0;
    const sprintRays = sessionStreak === 0 ? 0 : ((sessionStreak - 1) % 8) + 1;
    const completedSprints = Math.floor(sessionStreak / 8);

    return `
      <span class="session-pill">${escapeHtml(t('labelSolved'))}: <b class="tabular-nums">${sessionAttempted}</b></span>
      ${sessionAttempted > 0 ? `<span class="session-pill">${escapeHtml(t('labelAccuracy'))}: <b class="tabular-nums">${acc}%</b></span>` : ''}
      <span class="session-pill session-pill--star" title="${escapeHtml(t('practiceSprintAria', { rays: sprintRays }))}">
        ${ulduzStarSvg(sprintRays, { size: 18, label: t('practiceSprintAria', { rays: sprintRays }) })}
        <b class="tabular-nums">${sprintRays}/8${completedSprints > 0 ? ` ×${completedSprints + 1}` : ''}</b>
      </span>
    `;
  }

  function render() {
    const cur = history[historyIdx];
    persistCurrent();
    const localizedSubject = subjectTitle(subjectId);
    const activeTypeObj = filterTypeId ? allTypes.find((tp) => tp.id === filterTypeId) : null;
    const diffLabel = filterDiff === 1 ? t('difficulty1') : filterDiff === 2 ? t('difficulty2') : filterDiff === 3 ? t('difficulty3') : t('difficultyAll');

    const summaryParts = [
      filterTopic || t('practiceAllTopicsShort'),
      activeTypeObj ? plainReadableText(activeTypeObj.title) : null,
      diffLabel,
    ].filter(Boolean);

    const hasPassage = Boolean(cur?.task?.passage?.html);
    container.innerHTML = `
      <div class="page-container ${hasPassage ? '' : 'page-container--narrow'}">
        <h1 class="sr-only">${escapeHtml(t('practiceHeadingSr', { subject: localizedSubject }))}</h1>

        <!-- Top Navigation & Ulduz Sprint Stats -->
        <div class="practice-topbar">
          <nav class="breadcrumbs" aria-label="${escapeHtml(t('breadcrumbsAria'))}">
            <a href="#/">${escapeHtml(t('navHome'))}</a>
            <span aria-hidden="true">/</span>
            <a href="#/subject/${escapeHtml(subjectId)}">${escapeHtml(localizedSubject)}</a>
            <span aria-hidden="true">/</span>
            <span aria-current="page">${escapeHtml(t('btnPractice'))}</span>
          </nav>

          <div class="practice-session-pills" aria-label="${escapeHtml(t('practiceStatsAria'))}">
            ${renderSessionPillsHtml()}
          </div>
        </div>

        <!-- Collapsible Compact Filter Bar (#10) -->
        <div class="practice-filter-shell ${filtersExpanded ? 'is-expanded' : ''}">
          <div class="practice-filter-summary">
            <div class="practice-filter-summary__text">
              ${summaryParts.map((part, i) => `${i > 0 ? '<span class="meta-sep" aria-hidden="true">·</span>' : ''}<span>${escapeHtml(part)}</span>`).join('')}
            </div>
            <button
              type="button"
              class="btn btn--ghost btn--xs"
              data-action="toggle-filters"
              aria-expanded="${filtersExpanded}"
              aria-controls="practice-filters-drawer"
            >
              ${icon('sliders', { size: 15 })}
              <span>${escapeHtml(filtersExpanded ? t('practiceHideFiltersBtn') : t('practiceConfigureBtn'))}</span>
            </button>
          </div>

          <div id="practice-filters-drawer" class="practice-controls-bar" ${filtersExpanded ? '' : 'hidden'}>
            <div class="practice-control-group">
              <label for="practice-topic-select" class="control-label">${escapeHtml(t('practiceFilterTopic'))}</label>
              <select id="practice-topic-select" class="control-select">
                <option value="">${escapeHtml(t('practiceAllTopics', { n: allTypes.length }))}</option>
                ${allTopics.map((top) => `
                  <option value="${escapeHtml(top)}" ${filterTopic === top ? 'selected' : ''}>${escapeHtml(top)}</option>
                `).join('')}
              </select>
            </div>

            <div class="practice-control-group">
              <label for="practice-type-select" class="control-label">${escapeHtml(t('practiceFilterType'))}</label>
              <select id="practice-type-select" class="control-select">
                <option value="">${escapeHtml(filterTopic ? t('practiceMixedTopic') : t('practiceMixedTypes'))}</option>
                ${filterTopic
                  ? allTypes.filter((tp) => tp.topic === filterTopic).map((tp) => `
                      <option value="${escapeHtml(tp.id)}" ${filterTypeId === tp.id ? 'selected' : ''}>${escapeHtml(plainReadableText(tp.title))}</option>
                    `).join('')
                  : allTopics.map((top) => `
                      <optgroup label="${escapeHtml(top)}">
                        ${allTypes.filter((tp) => tp.topic === top).map((tp) => `
                          <option value="${escapeHtml(tp.id)}" ${filterTypeId === tp.id ? 'selected' : ''}>${escapeHtml(plainReadableText(tp.title))}</option>
                        `).join('')}
                      </optgroup>
                    `).join('')
                }
              </select>
            </div>

            <div class="practice-control-group">
              <label for="practice-diff-select" class="control-label">${escapeHtml(t('practiceFilterDiff'))}</label>
              <select id="practice-diff-select" class="control-select">
                <option value="0" ${filterDiff === 0 ? 'selected' : ''}>${escapeHtml(t('difficultyAll'))}</option>
                <option value="1" ${filterDiff === 1 ? 'selected' : ''}>${escapeHtml(t('difficulty1'))}</option>
                <option value="2" ${filterDiff === 2 ? 'selected' : ''}>${escapeHtml(t('difficulty2'))}</option>
                <option value="3" ${filterDiff === 3 ? 'selected' : ''}>${escapeHtml(t('difficulty3'))}</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Task Host -->
        <div id="practice-task-mount"></div>
      </div>
    `;

    container.querySelector('[data-action="toggle-filters"]')?.addEventListener('click', () => {
      filtersExpanded = !filtersExpanded;
      const shell = container.querySelector('.practice-filter-shell');
      const drawer = container.querySelector('#practice-filters-drawer');
      const btn = container.querySelector('[data-action="toggle-filters"]');
      if (shell) shell.classList.toggle('is-expanded', filtersExpanded);
      if (drawer) drawer.hidden = !filtersExpanded;
      if (btn) {
        btn.setAttribute('aria-expanded', String(filtersExpanded));
        const span = btn.querySelector('span');
        if (span) span.textContent = filtersExpanded ? t('practiceHideFiltersBtn') : t('practiceConfigureBtn');
      }
    });

    // Bind filter controls
    container.querySelector('#practice-topic-select')?.addEventListener('change', (e) => {
      filterTopic = e.target.value;
      filterTypeId = '';
      syncUrlHash();
      const next = buildNewItem();
      history.push(next);
      historyIdx = history.length - 1;
      render();
    });

    container.querySelector('#practice-type-select')?.addEventListener('change', (e) => {
      filterTypeId = e.target.value;
      const forcedTp = filterTypeId ? allTypes.find((tp) => tp.id === filterTypeId) : null;
      if (forcedTp?.topic) filterTopic = forcedTp.topic;
      syncUrlHash();
      const next = buildNewItem(forcedTp);
      history.push(next);
      historyIdx = history.length - 1;
      render();
    });

    container.querySelector('#practice-diff-select')?.addEventListener('change', (e) => {
      filterDiff = Number(e.target.value) || 0;
      syncUrlHash();
      const next = buildNewItem();
      history.push(next);
      historyIdx = history.length - 1;
      render();
    });

    const mountEl = container.querySelector('#practice-task-mount');
    const taskController = mountTaskView(mountEl, {
      task: cur.task,
      response: cur.response,
      checked: cur.checked,
      mode: 'practice',
      taskNumber: historyIdx + 1,
      onChange(newResp) {
        cur.response = newResp;
        persistCurrent();
      },
      onCheck(res, finalResp) {
        cur.response = finalResp;
        cur.checked = true;
        sessionAttempted += 1;
        if (res.correct) {
          sessionCorrect += 1;
          sessionStreak += 1;
          if (sessionStreak > 0 && sessionStreak % 8 === 0) {
            oaFireFxPulse('milestone', { intensity: 1.35 });
          }
        } else {
          sessionStreak = 0;
        }
        recordTaskAttempt(cur.task, finalResp, res);
        persistCurrent();
        // Live-update Ulduz Star & sprint pills without losing scroll position
        const pills = container.querySelector('.practice-session-pills');
        if (pills) {
          pills.innerHTML = renderSessionPillsHtml();
        }
      },
      onPrev: historyIdx > 0 ? () => {
        historyIdx -= 1;
        render();
      } : null,
      onNext() {
        if (historyIdx < history.length - 1) {
          historyIdx += 1;
        } else {
          history.push(buildNewItem());
          historyIdx = history.length - 1;
        }
        render();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      onSimilar() {
        const sameType = allTypes.find((tp) => tp.id === cur.typeId) || null;
        history.push(buildNewItem(sameType));
        historyIdx = history.length - 1;
        render();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
    });

    if (setKeyHandler) {
      setKeyHandler((e) => taskController.handleKeyDown(e));
    }
  }

  render();
}
