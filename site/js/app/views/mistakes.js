// Mistakes Review & Bookmarks View (#/mistakes?subject=...)
// Sequential Mistakes Drill mode, calm secondary card buttons, 5s Undo toast on deletion.

import { SUBJECTS_META } from '../../subjects/index.js';
import {
  loadState,
  saveState,
  recordTaskAttempt,
  removeMistake,
  restoreMistake,
  toggleBookmark,
  restoreBookmark,
} from '../../core/storage.js';
import { mountTaskView } from '../task-view.js';
import { t, subjectTitle } from '../i18n.js';
import { icon } from '../icons.js';
import { escapeHtml, safePreviewHtml, hydrateMath } from '../math.js';

export async function renderMistakesView(container, { query, setKeyHandler, showToast }) {
  let activeTab = query.get('tab') === 'bookmarks' ? 'bookmarks' : 'mistakes';
  let subjectFilter = query.get('subject') || 'all';
  let statusFilter = 'active'; // 'active' | 'resolved' | 'all'
  let activeTaskId = null;     // single task open or active drill task
  let drillQueue = null;       // string[] of task IDs during sequential drill
  let drillIndex = 0;

  function getMistakeList() {
    const state = loadState();
    return Object.values(state.mistakes || {})
      .filter((m) => subjectFilter === 'all' || m.task?.subject === subjectFilter)
      .filter((m) => {
        if (statusFilter === 'active') return !m.resolved;
        if (statusFilter === 'resolved') return m.resolved;
        return true;
      })
      .sort((a, b) => (b.lastWrongAt || 0) - (a.lastWrongAt || 0));
  }

  function getBookmarkList() {
    const state = loadState();
    return Object.values(state.bookmarks || {})
      .filter((b) => subjectFilter === 'all' || b.task?.subject === subjectFilter)
      .sort((a, b) => (b.addedAt || 0) - (a.addedAt || 0));
  }

  function render() {
    const state = loadState();
    const allMistakes = Object.values(state.mistakes || {});
    const activeCount = allMistakes.filter((m) => !m.resolved).length;
    const resolvedCount = allMistakes.filter((m) => m.resolved).length;
    const bookmarksCount = Object.values(state.bookmarks || {}).length;

    const list = activeTab === 'bookmarks' ? getBookmarkList() : getMistakeList();
    const activeFilteredMistakes = getMistakeList().filter((m) => !m.resolved);

    // Interactive Retry / Sequential Drill Mode
    if (activeTaskId) {
      const found = state.mistakes[activeTaskId] || state.bookmarks[activeTaskId]
        || list.find((item) => item.task.id === activeTaskId);

      if (found && found.task) {
        const isDrill = Array.isArray(drillQueue) && drillQueue.length > 0;
        const curIdx = isDrill ? drillIndex : list.findIndex((item) => item.task.id === activeTaskId);
        const totalInFlow = isDrill ? drillQueue.length : list.length;

        const nextId = isDrill
          ? (drillIndex + 1 < drillQueue.length ? drillQueue[drillIndex + 1] : null)
          : (curIdx >= 0 && curIdx + 1 < list.length ? list[curIdx + 1].task.id : null);

        const prevId = isDrill
          ? (drillIndex > 0 ? drillQueue[drillIndex - 1] : null)
          : (curIdx > 0 ? list[curIdx - 1].task.id : null);

        container.innerHTML = `
          <div class="page-container">
            <h1 class="sr-only">${escapeHtml(t('mistakesTitle'))}</h1>
            <div class="practice-topbar">
              <button type="button" class="btn btn--secondary btn--sm" data-action="back-to-list">
                ${icon('arrow-left', { size: 15 })}
                <span>${escapeHtml(t('mistakesBackToList', { n: list.length }))}</span>
              </button>

              <div class="practice-session-pills">
                ${isDrill ? `
                  <span class="session-pill tabular-nums">${escapeHtml(t('mistakesDrillProgress', { cur: drillIndex + 1, total: totalInFlow }))}</span>
                ` : ''}
                <span class="badge ${found.resolved ? 'badge--grade-correct' : activeTab === 'bookmarks' ? 'badge--gold' : 'badge--warn'}" id="mistake-live-status">
                  ${activeTab === 'bookmarks'
                    ? `${icon('bookmark-filled', { size: 13 })} ${escapeHtml(t('mistakesBadgeBookmark'))}`
                    : found.resolved
                    ? `${icon('check', { size: 13 })} ${escapeHtml(t('mistakesBadgeResolved'))}`
                    : escapeHtml(t('mistakesBadgeWrongCount', { n: found.wrongCount || 1 }))}
                </span>
              </div>
            </div>
            <div id="mistake-task-mount"></div>
          </div>
        `;

        container.querySelector('[data-action="back-to-list"]')?.addEventListener('click', () => {
          activeTaskId = null;
          drillQueue = null;
          drillIndex = 0;
          render();
        });

        const mountEl = container.querySelector('#mistake-task-mount');
        const ctrl = mountTaskView(mountEl, {
          task: found.task,
          response: null,
          checked: false,
          mode: 'practice',
          taskNumber: isDrill ? drillIndex + 1 : null,
          totalTasks: isDrill ? totalInFlow : null,
          onCheck(res, finalResp, meta) {
            recordTaskAttempt(found.task, finalResp, res, {
              durationSec: meta?.durationSec,
              source: 'mistakes',
            });
            const badge = container.querySelector('#mistake-live-status');
            if (badge && activeTab === 'mistakes') {
              if (res.correct) {
                badge.className = 'badge badge--grade-correct';
                badge.innerHTML = `${icon('check', { size: 13 })} ${escapeHtml(t('mistakesStatusFixedLive'))}`;
              } else {
                badge.className = 'badge badge--warn';
                badge.innerHTML = `${icon('x', { size: 13 })} ${escapeHtml(t('mistakesStatusTryLater'))}`;
              }
            }
          },
          onPrev: prevId ? () => {
            if (isDrill) drillIndex -= 1;
            activeTaskId = prevId;
            render();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } : null,
          onNext: nextId ? () => {
            if (isDrill) drillIndex += 1;
            activeTaskId = nextId;
            render();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } : () => {
            activeTaskId = null;
            drillQueue = null;
            drillIndex = 0;
            render();
          },
        });

        if (setKeyHandler) setKeyHandler((e) => ctrl.handleKeyDown(e));
        return;
      }
      activeTaskId = null;
      drillQueue = null;
    }

    if (setKeyHandler) setKeyHandler(null);

    container.innerHTML = `
      <div class="page-container">
        <nav class="breadcrumbs" aria-label="${escapeHtml(t('breadcrumbsAria'))}">
          <a href="#/">${escapeHtml(t('navHome'))}</a>
          <span aria-hidden="true">/</span>
          <span aria-current="page">${escapeHtml(t('mistakesBreadcrumb'))}</span>
        </nav>

        <div class="section-header section-header--split">
          <div>
            <h1 class="page-title">${escapeHtml(t('mistakesTitle'))}</h1>
            <p class="page-lead text-secondary">${escapeHtml(t('mistakesSubtitle'))}</p>
          </div>
          <div class="mistakes-header-actions">
            ${activeTab === 'mistakes' && activeFilteredMistakes.length > 0 ? `
              <button type="button" class="btn btn--primary" data-action="start-drill">
                ${icon('play', { size: 15 })}
                <span>${escapeHtml(t('mistakesStartDrill', { n: activeFilteredMistakes.length }))}</span>
              </button>
            ` : ''}
            ${activeTab === 'mistakes' && resolvedCount > 0 ? `
              <button type="button" class="btn btn--ghost btn--sm" data-action="clear-resolved">
                ${escapeHtml(t('mistakesClearResolved', { n: resolvedCount }))}
              </button>
            ` : ''}
          </div>
        </div>

        <!-- Tabs: Mistakes vs Bookmarks -->
        <div class="tabs-bar">
          <div class="setup-pills" role="tablist">
            <button type="button" role="tab" aria-selected="${activeTab === 'mistakes'}" class="seg-btn ${activeTab === 'mistakes' ? 'is-active' : ''}" data-tab="mistakes">
              ${escapeHtml(t('mistakesTabBank', { n: activeCount }))}
            </button>
            <button type="button" role="tab" aria-selected="${activeTab === 'bookmarks'}" class="seg-btn ${activeTab === 'bookmarks' ? 'is-active' : ''}" data-tab="bookmarks">
              ${icon('bookmark', { size: 14 })}
              <span>${escapeHtml(t('mistakesTabBookmarks', { n: bookmarksCount }))}</span>
            </button>
          </div>

          <div class="filters-inline">
            <select class="control-select" id="mistakes-subject-filter" aria-label="${escapeHtml(t('mistakesFilterSubjectAria'))}">
              <option value="all" ${subjectFilter === 'all' ? 'selected' : ''}>${escapeHtml(t('mistakesAllSubjects'))}</option>
              ${SUBJECTS_META.map((m) => `
                <option value="${m.id}" ${subjectFilter === m.id ? 'selected' : ''}>${escapeHtml(subjectTitle(m.id))}</option>
              `).join('')}
            </select>

            ${activeTab === 'mistakes' ? `
              <select class="control-select" id="mistakes-status-filter" aria-label="${escapeHtml(t('mistakesFilterStatusAria'))}">
                <option value="active" ${statusFilter === 'active' ? 'selected' : ''}>${escapeHtml(t('mistakesStatusActive', { n: activeCount }))}</option>
                <option value="resolved" ${statusFilter === 'resolved' ? 'selected' : ''}>${escapeHtml(t('mistakesStatusResolved', { n: resolvedCount }))}</option>
                <option value="all" ${statusFilter === 'all' ? 'selected' : ''}>${escapeHtml(t('mistakesStatusAll', { n: allMistakes.length }))}</option>
              </select>
            ` : ''}
          </div>
        </div>

        ${list.length === 0 ? `
          <div class="empty-card">
            <h2>${escapeHtml(activeTab === 'bookmarks' ? t('emptyBookmarks') : t('emptyMistakes'))}</h2>
            <p class="text-secondary">
              ${escapeHtml(activeTab === 'bookmarks' ? t('emptyBookmarksDesc') : t('emptyMistakesDesc'))}
            </p>
            <div class="empty-card__actions">
              <a href="#/" class="btn btn--primary">
                <span>${escapeHtml(t('mistakesChooseSubject'))}</span>
                ${icon('arrow-right', { size: 15 })}
              </a>
            </div>
          </div>
        ` : `
          <div class="mistakes-grid">
            ${list.map((entry) => {
              const tk = entry.task;
              return `
                <article class="mistake-card subject-card--${escapeHtml(tk.subject)}" data-specular>
                  <div class="mistake-card__head">
                    <span class="mistake-card__subj">
                      <span class="subject-dot subject-dot--${escapeHtml(tk.subject)}" aria-hidden="true"></span>
                      <span>${escapeHtml(subjectTitle(tk.subject))}</span>
                    </span>
                    ${activeTab === 'mistakes' ? `
                      <span class="badge ${entry.resolved ? 'badge--grade-correct' : 'badge--warn'}">
                        ${entry.resolved
                          ? `${icon('check', { size: 12 })} ${escapeHtml(t('mistakesBadgeResolved'))}`
                          : escapeHtml(t('mistakesBadgeWrongCount', { n: entry.wrongCount || 1 }))}
                      </span>
                    ` : `<span class="badge badge--gold">${icon('bookmark-filled', { size: 12 })} ${escapeHtml(t('mistakesBadgeBookmark'))}</span>`}
                  </div>
                  <div class="mistake-card__topic">${escapeHtml(tk.topic || '')}</div>
                  <p class="mistake-card__preview">${safePreviewHtml(tk.stem, 140)}</p>
                  <div class="mistake-card__foot">
                    <button type="button" class="btn btn--secondary btn--sm" data-action="retry-task" data-id="${escapeHtml(tk.id)}">
                      ${icon('refresh', { size: 14 })}
                      <span>${escapeHtml(activeTab === 'mistakes' ? t('btnRetry') : t('mistakesOpenTask'))}</span>
                    </button>
                    <button type="button" class="btn btn--ghost btn--sm" data-action="remove-entry" data-id="${escapeHtml(tk.id)}" title="${escapeHtml(t('mistakesDeleteTitle'))}">
                      ${icon('trash', { size: 14 })}
                      <span>${escapeHtml(t('mistakesDeleteBtn'))}</span>
                    </button>
                  </div>
                </article>
              `;
            }).join('')}
          </div>
        `}
      </div>
    `;

    hydrateMath(container);

    container.querySelector('[data-action="start-drill"]')?.addEventListener('click', () => {
      if (activeFilteredMistakes.length === 0) return;
      drillQueue = activeFilteredMistakes.map((m) => m.task.id);
      drillIndex = 0;
      activeTaskId = drillQueue[0];
      render();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    container.querySelectorAll('[data-tab]').forEach((btn) => {
      btn.addEventListener('click', () => {
        activeTab = btn.dataset.tab;
        render();
      });
    });

    container.querySelector('#mistakes-subject-filter')?.addEventListener('change', (e) => {
      subjectFilter = e.target.value;
      render();
    });

    container.querySelector('#mistakes-status-filter')?.addEventListener('change', (e) => {
      statusFilter = e.target.value;
      render();
    });

    container.querySelector('[data-action="clear-resolved"]')?.addEventListener('click', () => {
      const st = loadState();
      for (const [id, m] of Object.entries(st.mistakes)) {
        if (m.resolved) delete st.mistakes[id];
      }
      saveState();
      render();
    });

    container.querySelectorAll('[data-action="retry-task"]').forEach((btn) => {
      btn.addEventListener('click', () => {
        drillQueue = null;
        drillIndex = 0;
        activeTaskId = btn.dataset.id;
        render();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });

    container.querySelectorAll('[data-action="remove-entry"]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        if (activeTab === 'bookmarks') {
          const st = loadState();
          const savedEntry = st.bookmarks[id] ? { ...st.bookmarks[id] } : null;
          if (savedEntry) {
            toggleBookmark(savedEntry.task);
            render();
            if (showToast) {
              showToast({
                message: t('toastBookmarkRemoved'),
                actionLabel: t('btnUndo'),
                duration: 5000,
                onAction() {
                  restoreBookmark(id, savedEntry);
                  render();
                },
              });
            }
          }
        } else {
          const removed = removeMistake(id);
          render();
          if (removed && showToast) {
            showToast({
              message: t('toastMistakeRemoved'),
              actionLabel: t('btnUndo'),
              duration: 5000,
              onAction() {
                restoreMistake(id, removed);
                render();
              },
            });
          }
        }
      });
    });
  }

  render();
}
