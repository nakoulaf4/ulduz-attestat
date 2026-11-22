// Original PDF Variants View (#/originals/:id?pdf=0903|1503&n=1)
// Live solved counter, hash sync, localStorage session persistence, single-row mobile strip.

import { getSubject } from '../../subjects/index.js';
import {
  loadState,
  recordTaskAttempt,
  saveOriginalsEntry,
  getOriginalsSession,
} from '../../core/storage.js';
import { mountTaskView } from '../task-view.js';
import { t, subjectTitle } from '../i18n.js';
import { icon } from '../icons.js';
import { escapeHtml } from '../math.js';

export async function renderOriginalsView(container, { params, query, navigate, setKeyHandler }) {
  const subjectId = params.id;
  const subject = await getSubject(subjectId);
  if (!subject) {
    navigate('#/');
    return;
  }

  const allOriginals = subject.originals ? await subject.originals() : [];
  let pdfFilter = query.get('pdf') || 'all'; // 'all' | '0903' | '1503'
  let currentIdx = Math.max(0, (Number(query.get('n')) || 1) - 1);

  // Hydrate persisted per-subject originals answers from localStorage
  const persisted = getOriginalsSession(subjectId);
  const sessionAnswers = new Map(Object.entries(persisted));

  function getFilteredList() {
    if (pdfFilter === 'all') return allOriginals;
    const tag = pdfFilter === '0903' ? '09.03' : '15.03';
    return allOriginals.filter((tk) => {
      const pdf = String(tk.origin?.pdf ?? tk.id ?? '');
      return pdf.includes(tag) || pdf.includes(pdfFilter);
    });
  }

  function countFor(tag) {
    const dotted = tag === '0903' ? '09.03' : '15.03';
    return allOriginals.filter((tk) => {
      const pdf = String(tk.origin?.pdf ?? tk.id ?? '');
      return pdf.includes(dotted) || pdf.includes(tag);
    }).length;
  }

  function syncUrlHash() {
    const p = new URLSearchParams();
    if (pdfFilter !== 'all') p.set('pdf', pdfFilter);
    if (currentIdx > 0) p.set('n', String(currentIdx + 1));
    const qs = p.toString();
    const targetHash = `#/originals/${encodeURIComponent(subjectId)}${qs ? `?${qs}` : ''}`;
    if (window.location.hash !== targetHash && window.history?.replaceState) {
      window.history.replaceState(null, '', targetHash);
    }
  }

  function render() {
    const list = getFilteredList();
    if (currentIdx >= list.length) currentIdx = Math.max(0, list.length - 1);
    syncUrlHash();

    const state = loadState();
    const solvedMap = state.solvedOriginals || {};
    const localizedSubject = subjectTitle(subjectId);

    const count0903 = countFor('0903');
    const count1503 = countFor('1503');
    const solvedInList = list.filter((tk) => solvedMap[tk.id]).length;

    container.innerHTML = `
      <div class="page-container">
        <h1 class="sr-only">${escapeHtml(t('originalsHeading', { subject: localizedSubject }))}</h1>

        <div class="practice-topbar">
          <nav class="breadcrumbs" aria-label="${escapeHtml(t('breadcrumbsAria'))}">
            <a href="#/">${escapeHtml(t('navHome'))}</a>
            <span aria-hidden="true">/</span>
            <a href="#/subject/${escapeHtml(subjectId)}">${escapeHtml(localizedSubject)}</a>
            <span aria-hidden="true">/</span>
            <span aria-current="page">${escapeHtml(t('originalsBreadcrumb'))}</span>
          </nav>

          ${pdfFilter !== 'all' && list.length > 0 ? `
            <a href="#/exam/${escapeHtml(subjectId)}?source=${escapeHtml(pdfFilter)}" class="btn btn--secondary btn--sm">
              ${icon('clock', { size: 15 })}
              <span>${escapeHtml(t('originalsTimedBtn', { date: pdfFilter === '0903' ? '09.03' : '15.03' }))}</span>
            </a>
          ` : ''}
        </div>

        <div class="originals-filter-bar">
          <div class="setup-pills" role="tablist" aria-label="${escapeHtml(t('originalsFilterAria'))}">
            <button type="button" role="tab" aria-selected="${pdfFilter === 'all'}" class="seg-btn ${pdfFilter === 'all' ? 'is-active' : ''}" data-pdf="all">${escapeHtml(t('originalsAllPdf', { n: allOriginals.length }))}</button>
            <button type="button" role="tab" aria-selected="${pdfFilter === '0903'}" class="seg-btn ${pdfFilter === '0903' ? 'is-active' : ''}" data-pdf="0903">09.03.2026 (${count0903})</button>
            <button type="button" role="tab" aria-selected="${pdfFilter === '1503'}" class="seg-btn ${pdfFilter === '1503' ? 'is-active' : ''}" data-pdf="1503">15.03.2026 (${count1503})</button>
          </div>
          <span class="text-secondary tabular-nums" id="originals-solved-counter">
            ${escapeHtml(t('originalsSolvedCounter', { done: solvedInList, total: list.length }))}
          </span>
        </div>

        ${list.length === 0 ? `
          <div class="empty-card">
            <h2>${escapeHtml(t('originalsEmptyTitle'))}</h2>
            <p class="text-secondary">${escapeHtml(t('originalsEmptyDesc'))}</p>
            <div class="empty-card__actions">
              <a href="#/practice/${escapeHtml(subjectId)}" class="btn btn--primary">${escapeHtml(t('originalsOpenPractice'))}</a>
              <a href="#/subject/${escapeHtml(subjectId)}" class="btn btn--secondary">${escapeHtml(t('originalsBackSubject'))}</a>
            </div>
          </div>
        ` : `
          <!-- Task Number Strip (single horizontal scrollable row on mobile) -->
          <div class="originals-strip" role="navigation" aria-label="${escapeHtml(t('originalsStripAria'))}">
            ${list.map((tk, i) => {
              const prevSolved = solvedMap[tk.id];
              const sess = sessionAnswers.get(tk.id);
              let statusCls = '';
              if (prevSolved?.correct) statusCls = 'is-correct';
              else if (prevSolved && !prevSolved.correct) statusCls = 'is-wrong';
              else if (sess?.checked) statusCls = 'is-answered';

              const labelNum = tk.origin?.number ?? (i + 1);
              return `
                <button
                  type="button"
                  class="strip-num-btn mono-code ${i === currentIdx ? 'is-current' : ''} ${statusCls}"
                  data-action="pick-orig-idx"
                  data-index="${i}"
                  aria-current="${i === currentIdx ? 'step' : 'false'}"
                  aria-label="${escapeHtml(t('originalsTaskLabel', { num: labelNum }))}"
                  title="${escapeHtml(t('originalsTaskLabel', { num: labelNum }))}"
                >${escapeHtml(labelNum)}</button>
              `;
            }).join('')}
          </div>

          <div id="originals-task-mount"></div>
        `}
      </div>
    `;

    // Scroll active strip button smoothly into view on horizontal mobile strip
    const activeStripBtn = container.querySelector('.originals-strip .strip-num-btn.is-current');
    activeStripBtn?.scrollIntoView({ behavior: 'auto', inline: 'center', block: 'nearest' });

    container.querySelectorAll('[data-pdf]').forEach((btn) => {
      btn.addEventListener('click', () => {
        pdfFilter = btn.dataset.pdf;
        currentIdx = 0;
        render();
      });
    });

    container.querySelectorAll('[data-action="pick-orig-idx"]').forEach((btn) => {
      btn.addEventListener('click', () => {
        currentIdx = Number(btn.dataset.index);
        render();
      });
    });

    if (list.length > 0) {
      const task = list[currentIdx];
      const existing = sessionAnswers.get(task.id) || {};
      const bookletNum = task.origin?.number ?? (currentIdx + 1);
      const mountEl = container.querySelector('#originals-task-mount');

      const taskController = mountTaskView(mountEl, {
        task,
        response: existing.response ?? null,
        checked: Boolean(existing.checked),
        mode: 'originals',
        taskNumber: bookletNum,
        totalTasks: null,
        onChange(newResp) {
          const prev = sessionAnswers.get(task.id) || {};
          const updated = { ...prev, response: newResp };
          sessionAnswers.set(task.id, updated);
          saveOriginalsEntry(subjectId, task.id, updated);
        },
        onCheck(res, finalResp) {
          const updated = { response: finalResp, checked: true };
          sessionAnswers.set(task.id, updated);
          saveOriginalsEntry(subjectId, task.id, updated);
          recordTaskAttempt(task, finalResp, res);

          // Live-update strip button AND solved counter (#10)
          const pill = container.querySelector(`[data-action="pick-orig-idx"][data-index="${currentIdx}"]`);
          if (pill) {
            pill.classList.remove('is-correct', 'is-wrong');
            pill.classList.add(res.correct ? 'is-correct' : 'is-wrong');
          }
          const counterEl = container.querySelector('#originals-solved-counter');
          if (counterEl) {
            const freshSolved = loadState().solvedOriginals || {};
            const nowDone = list.filter((tk) => freshSolved[tk.id]).length;
            counterEl.textContent = t('originalsSolvedCounter', { done: nowDone, total: list.length });
          }
        },
        onPrev: currentIdx > 0 ? () => {
          currentIdx -= 1;
          render();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } : null,
        onNext: currentIdx < list.length - 1 ? () => {
          currentIdx += 1;
          render();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } : null,
      });

      if (setKeyHandler) {
        setKeyHandler((e) => taskController.handleKeyDown(e));
      }
    } else if (setKeyHandler) {
      setKeyHandler(null);
    }
  }

  render();
}
