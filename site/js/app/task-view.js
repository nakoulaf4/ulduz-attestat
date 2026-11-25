// Universal interactive Task Card & Reading Passage component.
// Supports all 6 contract formats: 'single' | 'multi' | 'short' | 'match' | 'order' | 'open'.

import { checkAnswer } from '../core/contract.js';
import { isBookmarked, toggleBookmark, getSettings } from '../core/storage.js';
import { haptic } from '../core/native.js';
import { formatDurationShort } from '../core/telemetry.js';
import { t, formatPoints, formatFormatBadge } from './i18n.js';
import { icon } from './icons.js';
import { escapeHtml, prepareRichHtml, hydrateMath, renderTaskImageHtml } from './math.js';
import { oaFireFxPulse } from './ui-kit.js';

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const AZ_CHARS = ['ə', 'ğ', 'ı', 'İ', 'ö', 'ş', 'ü', 'ç'];
const MATH_CHARS = ['−', ',', '/', ';'];

/**
 * Format a canonical answer into human-readable HTML for display in the explanation banner.
 */
export function formatCanonicalAnswer(task) {
  switch (task.format) {
    case 'single': {
      const idx = Number(task.answer);
      const letter = LETTERS[idx] ?? String(idx + 1);
      const optHtml = task.options?.[idx] ? prepareRichHtml(task.options[idx]) : '';
      return `<span class="ans-badge">${letter}</span> ${optHtml}`;
    }
    case 'multi': {
      const arr = Array.isArray(task.answer) ? task.answer : [];
      return `<div class="ans-multi-list">${arr
        .map((i) => `<span class="ans-multi-item"><span class="ans-badge">${LETTERS[i] ?? i + 1}</span> <span>${prepareRichHtml(task.options?.[i] ?? '')}</span></span>`)
        .join('')}</div>`;
    }
    case 'short': {
      const main = `<code class="ans-code">${escapeHtml(String(task.answer ?? ''))}</code>`;
      const alt = Array.isArray(task.accept) && task.accept.length > 0
        ? ` <span class="text-muted">(${escapeHtml(t('alsoAccepted'))} ${task.accept.map((a) => `<code>${escapeHtml(a)}</code>`).join(', ')})</span>`
        : '';
      return main + alt;
    }
    case 'match': {
      const ans = Array.isArray(task.answer) ? task.answer : [];
      return ans
        .map((rIdx, lIdx) => `<span class="ans-badge">${lIdx + 1} → ${LETTERS[rIdx] ?? rIdx + 1}</span>`)
        .join(' ');
    }
    case 'order': {
      const ans = Array.isArray(task.answer) ? task.answer : [];
      return ans
        .map((optIdx, pos) => `<span class="ans-badge">${pos + 1}: ${LETTERS[optIdx] ?? optIdx + 1}</span>`)
        .join(' → ');
    }
    case 'open':
      return prepareRichHtml(task.answer || '');
    default:
      return escapeHtml(String(task.answer ?? ''));
  }
}

/**
 * Check if a user response is non-empty (ready to be checked or counted as answered in an exam).
 */
export function hasResponse(task, response) {
  if (response === undefined || response === null || response === '') return false;
  switch (task.format) {
    case 'single':
      return typeof response !== 'boolean' && Number.isInteger(Number(response)) && Number(response) >= 0;
    case 'multi':
      return Array.isArray(response) && response.length > 0;
    case 'short':
      return String(response).trim().length > 0;
    case 'match':
      return Array.isArray(response) &&
        response.length === (task.pairs?.left?.length ?? 0) &&
        response.every((v) => Number.isInteger(v) && v >= 0);
    case 'order':
      return Array.isArray(response) && response.length === (task.options?.length ?? 0);
    case 'open':
      return Boolean(
        (typeof response?.text === 'string' && response.text.trim().length > 0) ||
        (typeof response?.self === 'number' && !Number.isNaN(response.self))
      );
    default:
      return false;
  }
}

/**
 * Enhance passage `<span class="num">` markers with `data-sentence-num="N"` and return set of available numbers.
 */
function tagPassageSentences(rootEl) {
  const nums = new Set();
  if (!rootEl) return nums;
  rootEl.querySelectorAll('.num').forEach((el) => {
    const m = el.textContent?.match(/(\d+)/);
    if (m) {
      el.dataset.sentenceNum = m[1];
      nums.add(m[1]);
    }
  });
  return nums;
}

/**
 * Auto-link sentence references in a question stem (e.g. "предложение № 5", "под номером 15", "№ 5", "5-ci cümlə")
 * ONLY when that sentence number exists inside the passage panel.
 */
function linkStemSentenceRefs(stemEl, availableNums) {
  if (!stemEl || availableNums.size === 0) return;
  const walker = document.createTreeWalker(stemEl, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!node.nodeValue || !/\d/.test(node.nodeValue)) return NodeFilter.FILTER_REJECT;
      const parent = node.parentElement;
      if (!parent || parent.closest('.katex, button, a, code')) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });

  const textNodes = [];
  let n;
  while ((n = walker.nextNode())) textNodes.push(n);

  const refRe = /(предложени[еяюий]+\s*(?:№\s*)?|под\s+номером\s+|№\s*)(\d+)|(\d+)(?:-[cç][iıuü])?\s+(cümlə\w*)/gi;

  for (const textNode of textNodes) {
    const raw = textNode.nodeValue;
    refRe.lastIndex = 0;
    let match;
    let lastIdx = 0;
    let changed = false;
    const frag = document.createDocumentFragment();

    while ((match = refRe.exec(raw)) !== null) {
      const numStr = match[2] || match[3];
      if (!availableNums.has(numStr)) continue;
      changed = true;
      if (match.index > lastIdx) {
        frag.appendChild(document.createTextNode(raw.slice(lastIdx, match.index)));
      }
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'sentence-ref';
      btn.dataset.jumpSentence = numStr;
      btn.title = t('jumpSentenceTitle', { n: numStr });
      btn.textContent = match[0];
      frag.appendChild(btn);
      lastIdx = refRe.lastIndex;
    }

    if (changed) {
      if (lastIdx < raw.length) {
        frag.appendChild(document.createTextNode(raw.slice(lastIdx)));
      }
      textNode.parentNode?.replaceChild(frag, textNode);
    }
  }
}

/**
 * Determine whether an open task uses DİM Math fractional rubric steps (⅓ / ½ / ⅔) vs integer steps (0 / 1 / 2).
 */
function getOpenScoreSteps(task) {
  const maxPts = Number(task.points ?? 2);
  const rubricText = String(task.rubric ?? '');
  const usesFractions = maxPts === 2 && (task.subject === 'math' || /⅓|⅔|1\/3|2\/3|0[.,]67|1[.,]33/.test(rubricText));
  if (usesFractions) {
    return [
      { pts: 0, label: formatPoints(0) },
      { pts: 0.67, label: '0.67 (⅓)' },
      { pts: 1, label: '1 (½)' },
      { pts: 1.33, label: '1.33 (⅔)' },
      { pts: 2, label: formatPoints(2) },
    ];
  }
  return Array.from({ length: maxPts + 1 }, (_, p) => ({ pts: p, label: formatPoints(p) }));
}

/**
 * Render a complete interactive Task view into `container`.
 */
export function mountTaskView(container, opts) {
  const {
    task,
    mode = 'practice',
    taskNumber = null,
    totalTasks = null,
    flagged = false,
    onChange,
    onCheck,
    onNext,
    onSimilar,
    onPrev,
    onToggleFlag,
  } = opts;

  let currentResponse = cloneResponse(task, opts.response);
  let isChecked = Boolean(opts.checked);
  let hintOpen = false;
  let rubricRevealed = isChecked || (currentResponse?.self !== undefined && currentResponse?.self !== null);
  let mobilePassageTab = 'task'; // 'text' | 'task' (mobile 2-tab switcher; desktop always shows both)
  let savedPassageScrollTop = 0;
  let savedTaskWindowScroll = 0;
  const savedFontScale = Number(getSettings()?.passageFontScale);
  let passageFontScale = Number.isFinite(savedFontScale) && savedFontScale >= 0.85 && savedFontScale <= 1.35
    ? savedFontScale
    : 1;
  let isSpeaking = false;
  const eliminated = new Set(); // Paper-booklet MCQ distractor strike-through
  let activeMatchLeft = 0;      // Click-left-then-right pairing helper
  let orderSelectedPos = null;  // Click-to-swap order helper

  // Per-task active solving stopwatch (pauses automatically when tab is hidden)
  let activeElapsedMs = 0;
  let segmentStartMs = Date.now();
  let lastCheckedDurationSec = 0;

  function sampleActiveDurationSec() {
    if (typeof document === 'undefined' || !document.hidden) {
      activeElapsedMs += Math.max(0, Date.now() - segmentStartMs);
    }
    segmentStartMs = Date.now();
    return Math.max(1, Math.min(1800, Math.round(activeElapsedMs / 1000)));
  }

  const onVisibilityChange = () => {
    if (typeof document === 'undefined') return;
    if (!container.isConnected) {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      return;
    }
    if (document.hidden) {
      activeElapsedMs += Math.max(0, Date.now() - segmentStartMs);
    } else {
      segmentStartMs = Date.now();
    }
  };
  if (typeof document !== 'undefined' && !isChecked) {
    document.addEventListener('visibilitychange', onVisibilityChange);
  }

  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }

  function cloneResponse(tObj, r) {
    if (r !== undefined && r !== null) {
      if (Array.isArray(r)) return [...r];
      if (typeof r === 'object') return { ...r };
      return r;
    }
    if (tObj.format === 'multi') return [];
    if (tObj.format === 'match') return new Array(tObj.pairs?.left?.length ?? 0).fill(-1);
    if (tObj.format === 'order') return (tObj.options ?? []).map((_, idx) => idx);
    if (tObj.format === 'open') return { text: '', self: null };
    return null;
  }

  function emitChange() {
    if (onChange) onChange(currentResponse);
  }

  function triggerCheck() {
    if (isChecked) return;
    if (task.format === 'open' && (currentResponse?.self === null || currentResponse?.self === undefined)) {
      rubricRevealed = true;
      render('[data-action="pick-self-score"]');
      const rubEl = container.querySelector('.open-rubric-box');
      rubEl?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      return;
    }
    if (!hasResponse(task, currentResponse)) return;
    const anchorBtn = container.querySelector('[data-action="check-answer"], [data-action="pick-self-score"].is-selected');
    const anchorRect = anchorBtn?.getBoundingClientRect();
    isChecked = true;
    const durationSec = sampleActiveDurationSec();
    lastCheckedDurationSec = durationSec;
    if (typeof document !== 'undefined') {
      document.removeEventListener('visibilitychange', onVisibilityChange);
    }
    const res = checkAnswer(task, currentResponse);
    haptic(res.correct ? 'success' : res.earned > 0 ? 'warning' : 'error');
    oaFireFxPulse(res.correct ? 'correct' : 'wrong', {
      x: anchorRect ? anchorRect.left + anchorRect.width / 2 : null,
      y: anchorRect ? anchorRect.top + anchorRect.height / 2 : null,
      intensity: res.correct ? 1.15 : 0.75,
    });
    if (onCheck) onCheck(res, currentResponse, { durationSec });
    render();
    if (!res.correct) {
      const card = container.querySelector('.task-card');
      if (card) {
        card.classList.remove('is-recoil');
        void card.offsetWidth;
        card.classList.add('is-recoil');
        setTimeout(() => card.classList.remove('is-recoil'), 320);
      }
    }
    const expEl = container.querySelector('.explanation-card');
    expEl?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function jumpToSentence(numStr) {
    const isMobileSplit = window.matchMedia?.('(max-width: 1039px)').matches;
    if (isMobileSplit && mobilePassageTab !== 'text') {
      savedTaskWindowScroll = window.scrollY;
      mobilePassageTab = 'text';
      render();
    }
    const target = container.querySelector(`.passage-panel [data-sentence-num="${CSS.escape(String(numStr))}"]`);
    if (!target) return;
    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    target.classList.remove('is-pulsing');
    // Force reflow to restart pulse cleanly
    void target.offsetWidth;
    target.classList.add('is-pulsing');
    setTimeout(() => target.classList.remove('is-pulsing'), 1900);
  }

  function render(restoreFocusSelector = null) {
    // Preserve reading scroll position before replacing DOM
    const existingPassage = container.querySelector('.passage-panel');
    if (existingPassage) savedPassageScrollTop = existingPassage.scrollTop;

    const hasPassage = Boolean(task.passage && task.passage.html);
    const bookmarked = isBookmarked(task.id);
    const checkResult = isChecked ? checkAnswer(task, currentResponse) : null;

    // Subtle origin tag ONLY when source === 'original' (zero generator/difficulty pill soup)
    const origPdfShort = task.origin?.pdf
      ? String(task.origin.pdf).replace(/^Attestat_all_|_\d+\.pdf$/g, '').replace(/\.2026$/, '')
      : '';
    const sameNum = taskNumber !== null && String(taskNumber) === String(task.origin?.number ?? '');
    const originalTag = task.source === 'original'
      ? `<span class="meta-sep" aria-hidden="true">·</span><span class="task-meta-origin">${escapeHtml(t('sourceOriginal'))}${origPdfShort ? ` ${escapeHtml(origPdfShort)}` : ''}${!sameNum && task.origin?.number ? ` №${escapeHtml(task.origin.number)}` : ''}</span>`
      : '';

    const passageTitleText = task.passage?.title ? prepareRichHtml(task.passage.title) : escapeHtml(t('passageHeading'));

    const passagePanelHtml = hasPassage
      ? `<aside class="passage-panel ${mobilePassageTab === 'task' ? 'is-hidden-mobile' : ''}" aria-label="${escapeHtml(t('passageHeading'))}">
          <div class="passage-panel__header">
            <h2 class="passage-panel__title">${passageTitleText}</h2>
            <div class="passage-panel__tools" role="group" aria-label="${escapeHtml(t('passageToolsAria'))}">
              ${typeof window !== 'undefined' && 'speechSynthesis' in window ? `
                <button
                  type="button"
                  class="btn-icon btn-icon--sm"
                  data-action="toggle-speak"
                  title="${escapeHtml(isSpeaking ? t('passageSpeakStop') : t('passageSpeakStart'))}"
                  aria-label="${escapeHtml(isSpeaking ? t('passageSpeakStop') : t('passageSpeakStart'))}"
                  aria-pressed="${isSpeaking}"
                >${isSpeaking ? icon('stop-square', { size: 15 }) : icon('volume', { size: 15 })}</button>
              ` : ''}
              <button type="button" class="btn-icon btn-icon--sm" data-action="font-dec" title="${escapeHtml(t('passageFontDec'))}" aria-label="${escapeHtml(t('passageFontDec'))}">A−</button>
              <button type="button" class="btn-icon btn-icon--sm" data-action="font-inc" title="${escapeHtml(t('passageFontInc'))}" aria-label="${escapeHtml(t('passageFontInc'))}">A+</button>
            </div>
          </div>
          <div class="passage-panel__body serif-prose" style="font-size:${Math.round(passageFontScale * 100)}%">
            ${prepareRichHtml(task.passage.html)}
          </div>
        </aside>`
      : '';

    const mobileTabsHtml = hasPassage
      ? `<div class="passage-mobile-tabs" role="tablist" aria-label="${escapeHtml(t('passageTabsAria'))}">
          <button type="button" role="tab" aria-selected="${mobilePassageTab === 'text'}" class="passage-mobile-tab ${mobilePassageTab === 'text' ? 'is-active' : ''}" data-tab="text">
            ${icon('book-open', { size: 15 })}
            <span>${escapeHtml(t('passageTabText'))}</span>
          </button>
          <button type="button" role="tab" aria-selected="${mobilePassageTab === 'task'}" class="passage-mobile-tab ${mobilePassageTab === 'task' ? 'is-active' : ''}" data-tab="task">
            ${icon('help-circle', { size: 15 })}
            <span>${escapeHtml(t('passageTabTask'))}</span>
          </button>
        </div>`
      : '';

    container.innerHTML = `
      ${mobileTabsHtml}
      <div class="task-workspace ${hasPassage ? 'task-workspace--split' : ''}">
        ${passagePanelHtml}
        <section class="task-card subject-accent--${escapeHtml(task.subject)} ${hasPassage && mobilePassageTab === 'text' ? 'is-hidden-mobile' : ''}" data-specular aria-label="${escapeHtml(t('taskCardAria'))}">
          <!-- Calm 2-part Meta Header -->
          <header class="task-card__header">
            <div class="task-card__meta-left">
              ${taskNumber !== null ? `<span class="task-num-label mono-code">№${escapeHtml(taskNumber)}${totalTasks ? `<span class="text-muted"> / ${totalTasks}</span>` : ''}</span>` : ''}
              <span class="task-meta-topic">
                <span class="subject-dot subject-dot--${escapeHtml(task.subject)}" aria-hidden="true"></span>
                <span>${escapeHtml(task.topic || task.subject.toUpperCase())}</span>
              </span>
              <span class="meta-sep" aria-hidden="true">·</span>
              <span class="task-meta-points tabular-nums">${escapeHtml(formatPoints(task.points))}</span>
              ${originalTag}
            </div>
            <div class="task-card__meta-right">
              ${mode === 'exam' && onToggleFlag ? `
                <button
                  type="button"
                  class="btn-chip ${flagged ? 'is-flagged' : ''}"
                  data-action="toggle-flag"
                  aria-pressed="${flagged}"
                  aria-label="${escapeHtml(flagged ? t('btnFlagged') : t('btnFlag'))}"
                  title="${escapeHtml(t('btnFlagTitle'))}"
                >
                  ${icon(flagged ? 'flag-filled' : 'flag', { size: 15 })}
                  <span class="hide-xs">${escapeHtml(flagged ? t('btnFlagged') : t('btnFlag'))}</span>
                </button>
              ` : ''}
              <button
                type="button"
                class="btn-chip ${bookmarked ? 'is-bookmarked' : ''}"
                data-action="toggle-bookmark"
                aria-pressed="${bookmarked}"
                aria-label="${escapeHtml(bookmarked ? t('btnBookmarked') : t('btnBookmark'))}"
                title="${escapeHtml(t('btnBookmarkTitle'))}"
              >
                ${icon(bookmarked ? 'bookmark-filled' : 'bookmark', { size: 15 })}
                <span class="hide-xs">${escapeHtml(bookmarked ? t('btnBookmarked') : t('btnBookmark'))}</span>
              </button>
            </div>
          </header>

          <!-- Question Stem -->
          <div class="task-card__stem">
            ${prepareRichHtml(task.stem)}
          </div>

          <!-- Optional Figure / SVG / Image -->
          ${task.image ? renderTaskImageHtml(task.image) : ''}

          <!-- Interactive Answer Area -->
          <div class="task-card__interaction">
            ${renderInteractionHtml(task, currentResponse, isChecked, rubricRevealed, mode)}
          </div>

          <!-- Optional Hint Box -->
          ${task.hint && mode !== 'exam' ? `
            <div class="task-hint-wrap">
              ${hintOpen ? `
                <div class="task-hint-box">
                  <div class="task-hint-box__title">${icon('lightbulb', { size: 15 })} <span>${escapeHtml(t('btnHint'))}</span></div>
                  <div class="task-hint-box__body">${prepareRichHtml(task.hint)}</div>
                </div>
              ` : ''}
            </div>
          ` : ''}

          <!-- Action Bar -->
          ${renderActionFooterHtml(task, currentResponse, isChecked, rubricRevealed, mode, hintOpen, Boolean(onPrev), Boolean(onNext), Boolean(onSimilar))}

          <!-- Step-by-Step Explanation (when checked) -->
          ${isChecked && checkResult ? renderExplanationHtml(task, checkResult) : ''}
        </section>
      </div>
    `;

    hydrateMath(container);

    // Wire Reading sentence anchors if passage has numbered markers
    if (hasPassage) {
      const passageEl = container.querySelector('.passage-panel');
      if (passageEl) {
        passageEl.scrollTop = savedPassageScrollTop;
        const availableNums = tagPassageSentences(passageEl);
        linkStemSentenceRefs(container.querySelector('.task-card__stem'), availableNums);
      }
    }

    bindEvents();

    // Preserve keyboard focus cleanly across re-renders
    if (restoreFocusSelector) {
      const targetEl = container.querySelector(restoreFocusSelector);
      if (targetEl && !targetEl.disabled) {
        targetEl.focus({ preventScroll: true });
      }
    }
  }

  function renderInteractionHtml(tObj, resp, checked, showRubric, viewMode) {
    switch (tObj.format) {
      case 'single': {
        const opts = tObj.options ?? [];
        return `
          <div class="options-list" role="radiogroup" aria-label="${escapeHtml(t('optionsAria'))}">
            ${opts.map((optHtml, idx) => {
              const selected = resp !== null && resp !== undefined && resp !== '' && Number(resp) === idx;
              const isRight = checked && tObj.answer === idx;
              const isWrong = checked && selected && tObj.answer !== idx;
              const isElim = !checked && eliminated.has(idx);
              const stateCls = isRight ? 'is-correct' : isWrong ? 'is-wrong' : selected ? 'is-selected' : isElim ? 'is-eliminated' : '';
              const letter = LETTERS[idx] ?? String(idx + 1);
              const statusHtml = isRight
                ? icon('check', { size: 17 })
                : isWrong
                ? icon('x', { size: 17 })
                : !checked
                ? `<kbd class="option-kbd">${idx + 1}</kbd>`
                : '';

              return `
                <div class="option-row ${isElim ? 'is-eliminated' : ''}">
                  <button
                    type="button"
                    role="radio"
                    aria-checked="${selected ? 'true' : 'false'}"
                    class="option-btn ${stateCls}"
                    data-action="pick-single"
                    data-index="${idx}"
                    ${checked ? 'disabled' : ''}
                  >
                    <span class="option-btn__key mono-code" aria-hidden="true">${letter}</span>
                    <span class="option-btn__text">${prepareRichHtml(optHtml)}</span>
                    <span class="option-btn__status" aria-hidden="true">${statusHtml}</span>
                  </button>
                  ${!checked ? `
                    <button
                      type="button"
                      class="option-elim-btn ${isElim ? 'is-active' : ''}"
                      data-action="toggle-eliminate"
                      data-index="${idx}"
                      aria-pressed="${isElim}"
                      aria-label="${escapeHtml(isElim ? t('restoreOption', { letter }) : t('eliminateOption', { letter }))}"
                      title="${escapeHtml(isElim ? t('restoreOption', { letter }) : t('eliminateOption', { letter }))}"
                    >${icon(isElim ? 'undo' : 'strikethrough', { size: 14 })}</button>
                  ` : ''}
                </div>
              `;
            }).join('')}
          </div>
        `;
      }

      case 'multi': {
        const opts = tObj.options ?? [];
        const selSet = new Set(Array.isArray(resp) ? resp : []);
        const wantSet = new Set(Array.isArray(tObj.answer) ? tObj.answer : []);
        return `
          <div class="interaction-helper">${escapeHtml(t('multiHelper'))}</div>
          <div class="options-list" role="group" aria-label="${escapeHtml(t('optionsMultiAria'))}">
            ${opts.map((optHtml, idx) => {
              const selected = selSet.has(idx);
              const inAnswer = wantSet.has(idx);
              const isElim = !checked && eliminated.has(idx);
              let stateCls = selected ? 'is-selected' : isElim ? 'is-eliminated' : '';
              let statusHtml = !checked ? `<kbd class="option-kbd">${idx + 1}</kbd>` : '';
              if (checked) {
                if (selected && inAnswer) { stateCls = 'is-correct'; statusHtml = icon('check', { size: 17 }); }
                else if (selected && !inAnswer) { stateCls = 'is-wrong'; statusHtml = icon('x', { size: 17 }); }
                else if (!selected && inAnswer) { stateCls = 'is-missed'; statusHtml = icon('check', { size: 17 }); }
              }
              const letter = LETTERS[idx] ?? String(idx + 1);
              return `
                <div class="option-row ${isElim ? 'is-eliminated' : ''}">
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked="${selected ? 'true' : 'false'}"
                    class="option-btn option-btn--multi ${stateCls}"
                    data-action="toggle-multi"
                    data-index="${idx}"
                    ${checked ? 'disabled' : ''}
                  >
                    <span class="option-btn__check" aria-hidden="true">${icon(selected ? 'checkbox-on' : 'checkbox-off', { size: 18 })}</span>
                    <span class="option-btn__key mono-code" aria-hidden="true">${letter}</span>
                    <span class="option-btn__text">${prepareRichHtml(optHtml)}</span>
                    <span class="option-btn__status" aria-hidden="true">${statusHtml}</span>
                  </button>
                  ${!checked ? `
                    <button
                      type="button"
                      class="option-elim-btn ${isElim ? 'is-active' : ''}"
                      data-action="toggle-eliminate"
                      data-index="${idx}"
                      aria-pressed="${isElim}"
                      aria-label="${escapeHtml(isElim ? t('restoreOption', { letter }) : t('eliminateOption', { letter }))}"
                      title="${escapeHtml(isElim ? t('restoreOption', { letter }) : t('eliminateOption', { letter }))}"
                    >${icon(isElim ? 'undo' : 'strikethrough', { size: 14 })}</button>
                  ` : ''}
                </div>
              `;
            }).join('')}
          </div>
        `;
      }

      case 'short': {
        const val = String(resp ?? '');
        const res = checked ? checkAnswer(tObj, val) : null;
        const stateCls = checked ? (res.correct ? 'is-correct' : 'is-wrong') : '';
        // Context-smart char bar: AZ diacritics ONLY for az (or AZ text), math helpers ONLY for math, none on plain ru/en
        const needsAzChars = tObj.subject === 'az' || /[əğıöşüçƏĞİÖŞÜÇ]/.test(String(tObj.answer ?? ''));
        const charList = needsAzChars ? AZ_CHARS : tObj.subject === 'math' ? MATH_CHARS : [];
        const placeholder = tObj.subject === 'math' ? t('shortPlaceholderMath') : t('shortPlaceholder');

        return `
          <div class="short-answer-box">
            <label class="sr-only" for="short-input-${escapeHtml(tObj.id)}">${escapeHtml(t('shortAnswerAria'))}</label>
            <div class="short-input-row ${stateCls}">
              <input
                id="short-input-${escapeHtml(tObj.id)}"
                type="text"
                class="short-input"
                value="${escapeHtml(val)}"
                placeholder="${escapeHtml(placeholder)}"
                ${tObj.subject === 'math' ? 'inputmode="decimal"' : ''}
                enterkeyhint="done"
                autocomplete="off"
                autocapitalize="off"
                spellcheck="false"
                ${checked ? 'readonly' : ''}
              />
              ${!checked ? `<button type="button" class="btn-icon btn-icon--sm" data-action="clear-short" title="${escapeHtml(t('shortClearAria'))}" aria-label="${escapeHtml(t('shortClearAria'))}" ${val ? '' : 'hidden'}>${icon('x', { size: 15 })}</button>` : ''}
              ${checked ? `<span class="short-status-pill ${res.correct ? 'is-correct' : 'is-wrong'}">${icon(res.correct ? 'check' : 'x', { size: 14 })} <span>${escapeHtml(res.correct ? t('shortCorrectPill') : t('shortWrongPill'))}</span></span>` : ''}
            </div>
            ${!checked && charList.length > 0 ? `
              <div class="char-bar" aria-label="${escapeHtml(t('charBarAria'))}">
                <span class="char-bar__label">${escapeHtml(t('charBarLabel'))}</span>
                ${charList.map((ch) => `
                  <button type="button" class="char-btn" data-action="insert-char" data-char="${escapeHtml(ch === '−' ? '-' : ch)}">${escapeHtml(ch)}</button>
                `).join('')}
              </div>
            ` : ''}
          </div>
        `;
      }

      case 'match': {
        const left = tObj.pairs?.left ?? [];
        const right = tObj.pairs?.right ?? [];
        const cur = Array.isArray(resp) ? resp : new Array(left.length).fill(-1);
        const ans = Array.isArray(tObj.answer) ? tObj.answer : [];
        if (activeMatchLeft >= left.length) activeMatchLeft = 0;

        // Map right index -> assigned left numbers [1, 2, ...]
        const rightAssigned = right.map(() => []);
        cur.forEach((rIdx, lIdx) => {
          if (rIdx >= 0 && rIdx < right.length) rightAssigned[rIdx].push(lIdx + 1);
        });

        return `
          <div class="match-widget">
            ${!checked ? `<div class="interaction-helper">${escapeHtml(t('matchHelper'))}</div>` : ''}
            <div class="match-columns">
              <div class="match-col match-col--left">
                <div class="match-col__title">${escapeHtml(t('matchLeftTitle', { n: left.length }))}</div>
                ${left.map((lHtml, lIdx) => {
                  const picked = cur[lIdx];
                  const expected = ans[lIdx];
                  const isRight = checked && picked === expected;
                  const isWrong = checked && picked !== expected;
                  const isActiveTarget = !checked && activeMatchLeft === lIdx;
                  return `
                    <div class="match-left-card ${isRight ? 'is-correct' : isWrong ? 'is-wrong' : ''} ${isActiveTarget ? 'is-active-target' : ''}" data-match-left-card="${lIdx}">
                      <div class="match-left-card__top">
                        <span class="match-num mono-code">${lIdx + 1}.</span>
                        <div class="match-text">${prepareRichHtml(lHtml)}</div>
                      </div>
                      <div class="match-picker" role="group" aria-label="${escapeHtml(t('matchPickerAria', { n: lIdx + 1 }))}">
                        ${right.map((_, rIdx) => {
                          const letter = LETTERS[rIdx] ?? String(rIdx + 1);
                          const active = picked === rIdx;
                          const correctBtn = checked && expected === rIdx;
                          const wrongBtn = checked && active && expected !== rIdx;
                          return `
                            <button
                              type="button"
                              class="match-pill mono-code ${active ? 'is-selected' : ''} ${correctBtn ? 'is-correct' : ''} ${wrongBtn ? 'is-wrong' : ''}"
                              data-action="pick-match"
                              data-left="${lIdx}"
                              data-right="${rIdx}"
                              aria-pressed="${active}"
                              aria-label="${escapeHtml(t('matchAssignAria', { n: lIdx + 1, letter }))}"
                              ${checked ? 'disabled' : ''}
                            >${letter}</button>
                          `;
                        }).join('')}
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>

              <div class="match-col match-col--right">
                <div class="match-col__title">${escapeHtml(t('matchRightTitle', { last: LETTERS[right.length - 1] ?? right.length }))}</div>
                <div class="match-right-list">
                  ${right.map((rHtml, rIdx) => {
                    const assignedNums = rightAssigned[rIdx];
                    const letter = LETTERS[rIdx] ?? String(rIdx + 1);
                    return `
                      <button
                        type="button"
                        class="match-right-item ${assignedNums.length > 0 ? 'is-matched' : ''}"
                        data-action="pick-match-right"
                        data-right="${rIdx}"
                        ${checked ? 'disabled' : ''}
                        aria-label="${escapeHtml(t('matchAssignAria', { n: activeMatchLeft + 1, letter }))}"
                      >
                        <span class="match-letter mono-code">${letter})</span>
                        <span class="match-text">${prepareRichHtml(rHtml)}</span>
                        ${assignedNums.length > 0 ? `
                          <span class="match-assigned-badges">
                            ${assignedNums.map((num) => `<span class="match-assigned-badge mono-code">${num}</span>`).join('')}
                          </span>
                        ` : ''}
                      </button>
                    `;
                  }).join('')}
                </div>
              </div>
            </div>
          </div>
        `;
      }

      case 'order': {
        const opts = tObj.options ?? [];
        const orderArr = Array.isArray(resp) && resp.length === opts.length
          ? resp
          : opts.map((_, idx) => idx);
        const ans = Array.isArray(tObj.answer) ? tObj.answer : [];

        return `
          <div class="order-widget">
            ${!checked ? `<div class="interaction-helper">${escapeHtml(t('orderHelper'))}</div>` : ''}
            <div class="order-list">
              ${orderArr.map((optIdx, pos) => {
                const isRight = checked && ans[pos] === optIdx;
                const isWrong = checked && ans[pos] !== optIdx;
                const origLetter = LETTERS[optIdx] ?? String(optIdx + 1);
                const isSelectedSwap = !checked && orderSelectedPos === pos;
                return `
                  <div class="order-item ${isRight ? 'is-correct' : isWrong ? 'is-wrong' : ''} ${isSelectedSwap ? 'is-swap-selected' : ''}">
                    ${!checked ? `
                      <button type="button" class="order-swap-trigger" data-action="order-swap" data-pos="${pos}" aria-pressed="${isSelectedSwap}">
                        <span class="order-pos mono-code">${pos + 1}</span>
                        <span class="order-orig-badge mono-code" title="${escapeHtml(t('orderOrigTitle', { letter: origLetter }))}">${origLetter}</span>
                        <span class="order-text">${prepareRichHtml(opts[optIdx] ?? '')}</span>
                      </button>
                      <div class="order-controls">
                        <button type="button" class="btn-icon btn-icon--sm" data-action="order-up" data-pos="${pos}" ${pos === 0 ? 'disabled' : ''} title="${escapeHtml(t('orderUpAria', { n: pos + 1 }))}" aria-label="${escapeHtml(t('orderUpAria', { n: pos + 1 }))}">${icon('arrow-up', { size: 15 })}</button>
                        <button type="button" class="btn-icon btn-icon--sm" data-action="order-down" data-pos="${pos}" ${pos === orderArr.length - 1 ? 'disabled' : ''} title="${escapeHtml(t('orderDownAria', { n: pos + 1 }))}" aria-label="${escapeHtml(t('orderDownAria', { n: pos + 1 }))}">${icon('arrow-down', { size: 15 })}</button>
                      </div>
                    ` : `
                      <span class="order-pos mono-code">${pos + 1}</span>
                      <span class="order-orig-badge mono-code" title="${escapeHtml(t('orderOrigTitle', { letter: origLetter }))}">${origLetter}</span>
                      <div class="order-text">${prepareRichHtml(opts[optIdx] ?? '')}</div>
                      <span class="option-btn__status" aria-hidden="true">${icon(isRight ? 'check' : 'x', { size: 17 })}</span>
                    `}
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        `;
      }

      case 'open': {
        const textVal = resp?.text ?? '';
        const selfPts = resp?.self;
        const scoreSteps = getOpenScoreSteps(tObj);

        return `
          <div class="open-widget">
            <label class="interaction-helper" for="open-textarea-${escapeHtml(tObj.id)}">
              ${escapeHtml(t('openHelper'))}
            </label>
            <textarea
              id="open-textarea-${escapeHtml(tObj.id)}"
              class="open-textarea"
              rows="4"
              placeholder="${escapeHtml(t('openPlaceholder'))}"
              ${checked && viewMode !== 'exam' ? 'readonly' : ''}
            >${escapeHtml(textVal)}</textarea>

            ${(showRubric || viewMode === 'review') ? `
              <div class="open-rubric-box">
                <div class="open-rubric-grid">
                  <div class="open-rubric-col">
                    <h4 class="open-rubric-title">${icon('check-circle', { size: 15 })} <span>${escapeHtml(t('modelAnswerHeading'))}</span></h4>
                    <div class="open-rubric-body">${prepareRichHtml(tObj.answer)}</div>
                  </div>
                  ${tObj.rubric ? `
                    <div class="open-rubric-col">
                      <h4 class="open-rubric-title">${icon('clipboard-list', { size: 15 })} <span>${escapeHtml(t('rubricHeading'))}</span></h4>
                      <div class="open-rubric-body">${prepareRichHtml(tObj.rubric)}</div>
                    </div>
                  ` : ''}
                </div>
                <div class="open-self-grade">
                  <span class="open-self-grade__label">${escapeHtml(t('openSelfPrompt'))}</span>
                  <div class="open-self-grade__btns" role="group" aria-label="${escapeHtml(t('openSelfGroupAria'))}">
                    ${scoreSteps.map(({ pts, label }) => `
                      <button
                        type="button"
                        class="btn-score ${selfPts === pts ? 'is-selected' : ''}"
                        data-action="pick-self-score"
                        data-points="${pts}"
                        aria-pressed="${selfPts === pts}"
                      >${escapeHtml(label)}</button>
                    `).join('')}
                  </div>
                </div>
              </div>
            ` : ''}
          </div>
        `;
      }

      default:
        return '';
    }
  }

  function renderActionFooterHtml(tObj, resp, checked, showRubric, viewMode, isHintOpen, hasPrev, hasNext, hasSimilar) {
    if (viewMode === 'review') {
      return '';
    }
    if (viewMode === 'exam') {
      return `
        <footer class="task-card__footer task-card__footer--exam">
          <div class="task-footer-left">
            <button type="button" class="btn btn--secondary" data-action="prev-task" ${!hasPrev ? 'disabled' : ''}>
              ${icon('arrow-left', { size: 16 })}
              <span>${escapeHtml(t('btnBack'))}</span>
            </button>
            ${tObj.format === 'open' && !showRubric ? `
              <button type="button" class="btn btn--ghost" data-action="reveal-rubric">
                ${icon('clipboard-list', { size: 16 })}
                <span class="hide-xs">${escapeHtml(t('openRubricBtnExam'))}</span>
              </button>
            ` : ''}
          </div>
          <div class="task-footer-right">
            ${hasNext ? `
              <button type="button" class="btn btn--primary" data-action="next-task">
                <span>${escapeHtml(t('btnNext'))}</span>
                ${icon('arrow-right', { size: 16 })}
              </button>
            ` : `
              <button type="button" class="btn btn--accent" data-action="finish-exam-inline">
                <span>${escapeHtml(t('btnFinishInline'))}</span>
                ${icon('arrow-right', { size: 16 })}
              </button>
            `}
          </div>
        </footer>
      `;
    }

    // Practice / Originals / Mistakes mode
    const readyToCheck = hasResponse(tObj, resp);
    const hideCheckForOpenRubric = !checked && tObj.format === 'open' && showRubric;

    return `
      <footer class="task-card__footer">
        <div class="task-footer-left">
          ${hasPrev ? `
            <button type="button" class="btn btn--secondary" data-action="prev-task" aria-label="${escapeHtml(t('btnPrev'))}">
              ${icon('arrow-left', { size: 16 })}
              <span class="hide-xs">${escapeHtml(t('btnPrev'))}</span>
            </button>
          ` : ''}
          ${tObj.hint && !checked ? `
            <button type="button" class="btn btn--ghost" data-action="toggle-hint" aria-pressed="${isHintOpen}">
              ${icon('lightbulb', { size: 16 })}
              <span>${escapeHtml(isHintOpen ? t('btnHideHint') : t('btnHint'))}</span>
            </button>
          ` : ''}
          ${hasSimilar ? `
            <button type="button" class="btn btn--ghost" data-action="similar-task" title="${escapeHtml(t('btnSimilarTitle'))}">
              ${icon('refresh', { size: 15 })}
              <span class="hide-xs">${escapeHtml(t('btnSimilar'))}</span>
            </button>
          ` : ''}
        </div>
        <div class="task-footer-right">
          ${!checked ? (
            tObj.format === 'open' && !showRubric ? `
              <button type="button" class="btn btn--primary" data-action="reveal-rubric">
                ${escapeHtml(t('openRevealBtn'))}
              </button>
            ` : hideCheckForOpenRubric ? `
              <span class="open-pick-hint text-muted">${escapeHtml(t('openPickPrompt'))}</span>
            ` : `
              <button type="button" class="btn btn--primary" data-action="check-answer" ${!readyToCheck ? 'disabled' : ''}>
                ${icon('check', { size: 16 })}
                <span>${escapeHtml(t('btnCheck'))}</span>
              </button>
            `
          ) : (
            hasNext ? `
              <button type="button" class="btn btn--primary" data-action="next-task">
                <span>${escapeHtml(t('btnNext'))}</span>
                ${icon('arrow-right', { size: 16 })}
              </button>
            ` : ''
          )}
        </div>
      </footer>
    `;
  }

  function renderExplanationHtml(tObj, res) {
    const stateClass = res.correct
      ? 'explanation-card--correct'
      : res.earned > 0
      ? 'explanation-card--partial'
      : 'explanation-card--wrong';

    const verdictLabel = res.correct
      ? t('correctTitle')
      : res.earned > 0
      ? t('partialTitle')
      : t('wrongTitle');

    const statusIconName = res.correct ? 'check-circle' : res.earned > 0 ? 'partial' : 'x';
    const summaryPts = t('pointsEarnedSummary', { earned: res.earned, max: res.max });

    return `
      <aside class="explanation-card ${stateClass}" aria-live="polite">
        <div class="explanation-card__banner">
          <div class="explanation-card__status">
            <span class="explanation-card__icon" aria-hidden="true">${icon(statusIconName, { size: 18 })}</span>
            <strong>${escapeHtml(verdictLabel)}</strong>
            <span class="explanation-card__pts tabular-nums">(${escapeHtml(summaryPts)})</span>
          </div>
          ${tObj.format !== 'open' ? `
            <div class="explanation-card__canonical">
              <span class="text-secondary">${escapeHtml(t('correctAnswerLabel'))}</span>
              <span class="explanation-card__ans">${formatCanonicalAnswer(tObj)}</span>
            </div>
          ` : ''}
        </div>
        <div class="explanation-card__body">
          <div class="explanation-card__body-head">
            <h4 class="explanation-card__heading">${escapeHtml(t('explanationHeading'))}</h4>
            <div class="explanation-card__meta-actions">
              ${lastCheckedDurationSec > 0 ? `<span class="explanation-card__time mono-code tabular-nums">${icon('clock', { size: 13 })} ${escapeHtml(formatDurationShort(lastCheckedDurationSec, document.documentElement.lang === 'az' ? 'az' : 'ru'))}</span>` : ''}
              ${tObj.subject && tObj.topic ? `
                <a href="#/lesson/${escapeHtml(tObj.subject)}?topic=${encodeURIComponent(tObj.topic)}" class="btn btn--ghost btn--xs">
                  ${icon('video', { size: 14 })}
                  <span>${escapeHtml(t('taskLessonLinkBtn'))}</span>
                </a>
              ` : ''}
              <button type="button" class="btn btn--secondary btn--xs" data-action="ask-ai-task">
                ${icon('bot', { size: 14 })}
                <span>${escapeHtml(t('askAiAboutTaskBtn'))}</span>
              </button>
            </div>
          </div>
          <div class="explanation-card__prose">
            ${prepareRichHtml(tObj.explanation)}
          </div>
        </div>
      </aside>
    `;
  }

  function bindEvents() {
    // Reading sentence anchor jump links
    container.querySelectorAll('[data-jump-sentence]').forEach((btn) => {
      btn.addEventListener('click', () => {
        jumpToSentence(btn.dataset.jumpSentence);
      });
    });

    // Mobile 2-tab passage switcher (preserves scroll per tab)
    container.querySelectorAll('.passage-mobile-tab').forEach((btn) => {
      btn.addEventListener('click', () => {
        const nextTab = btn.dataset.tab;
        if (nextTab === mobilePassageTab) return;
        if (mobilePassageTab === 'task') savedTaskWindowScroll = window.scrollY;
        const pEl = container.querySelector('.passage-panel');
        if (pEl) savedPassageScrollTop = pEl.scrollTop;
        mobilePassageTab = nextTab;
        render(`.passage-mobile-tab[data-tab="${nextTab}"]`);
        if (nextTab === 'task') {
          window.scrollTo({ top: savedTaskWindowScroll });
        }
      });
    });

    // Passage font scale & optional SpeechSynthesis read-aloud
    container.querySelector('[data-action="toggle-speak"]')?.addEventListener('click', () => {
      if (typeof window === 'undefined' || !window.speechSynthesis || !task.passage?.html) return;
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        isSpeaking = false;
        render('[data-action="toggle-speak"]');
        return;
      }
      window.speechSynthesis.cancel();
      const plain = String(task.passage.html).replace(/<[^>]*>/g, ' ').replace(/\(\d+\)/g, ' ').replace(/\s+/g, ' ').trim();
      const utt = new SpeechSynthesisUtterance(plain);
      utt.lang = task.subject === 'en' ? 'en-US' : task.subject === 'az' ? 'az-AZ' : 'ru-RU';
      utt.rate = 0.95;
      utt.onend = () => {
        isSpeaking = false;
        const b = container.querySelector('[data-action="toggle-speak"]');
        if (b) {
          b.innerHTML = icon('volume', { size: 15 });
          b.setAttribute('aria-pressed', 'false');
        }
      };
      utt.onerror = () => { isSpeaking = false; };
      isSpeaking = true;
      window.speechSynthesis.speak(utt);
      render('[data-action="toggle-speak"]');
    });
    container.querySelector('[data-action="font-dec"]')?.addEventListener('click', () => {
      passageFontScale = Math.max(0.85, Math.round((passageFontScale - 0.1) * 10) / 10);
      render('[data-action="font-dec"]');
    });
    container.querySelector('[data-action="font-inc"]')?.addEventListener('click', () => {
      passageFontScale = Math.min(1.35, Math.round((passageFontScale + 0.1) * 10) / 10);
      render('[data-action="font-inc"]');
    });

    // Bookmark & Flag
    container.querySelector('[data-action="toggle-bookmark"]')?.addEventListener('click', () => {
      haptic('light');
      toggleBookmark(task);
      render('[data-action="toggle-bookmark"]');
    });
    container.querySelector('[data-action="toggle-flag"]')?.addEventListener('click', () => {
      haptic('light');
      if (onToggleFlag) onToggleFlag();
    });

    // Paper-booklet MCQ distractor strike-through (button + right-click)
    const toggleEliminate = (idx, focusSel = null) => {
      if (isChecked) return;
      haptic('light');
      if (eliminated.has(idx)) eliminated.delete(idx);
      else eliminated.add(idx);
      render(focusSel);
    };

    container.querySelectorAll('[data-action="toggle-eliminate"]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = Number(btn.dataset.index);
        toggleEliminate(idx, `[data-action="toggle-eliminate"][data-index="${idx}"]`);
      });
    });

    // Single choice
    container.querySelectorAll('[data-action="pick-single"]').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (isChecked) return;
        const idx = Number(btn.dataset.index);
        haptic('selection');
        eliminated.delete(idx);
        currentResponse = idx;
        emitChange();
        render(`[data-action="pick-single"][data-index="${idx}"]`);
      });
      btn.addEventListener('contextmenu', (e) => {
        if (isChecked) return;
        e.preventDefault();
        const idx = Number(btn.dataset.index);
        toggleEliminate(idx, `[data-action="pick-single"][data-index="${idx}"]`);
      });
    });

    // Multi choice
    container.querySelectorAll('[data-action="toggle-multi"]').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (isChecked) return;
        const idx = Number(btn.dataset.index);
        haptic('selection');
        eliminated.delete(idx);
        const set = new Set(Array.isArray(currentResponse) ? currentResponse : []);
        if (set.has(idx)) set.delete(idx);
        else set.add(idx);
        currentResponse = [...set].sort((a, b) => a - b);
        emitChange();
        render(`[data-action="toggle-multi"][data-index="${idx}"]`);
      });
      btn.addEventListener('contextmenu', (e) => {
        if (isChecked) return;
        e.preventDefault();
        const idx = Number(btn.dataset.index);
        toggleEliminate(idx, `[data-action="toggle-multi"][data-index="${idx}"]`);
      });
    });

    // Short answer input
    const shortInput = container.querySelector('.short-input');
    const clearShortBtn = container.querySelector('[data-action="clear-short"]');
    const syncShortUi = (valStr) => {
      if (clearShortBtn) clearShortBtn.hidden = valStr.length === 0;
      const checkBtn = container.querySelector('[data-action="check-answer"]');
      if (checkBtn) checkBtn.disabled = !hasResponse(task, currentResponse);
    };

    if (shortInput) {
      shortInput.addEventListener('focus', () => {
        if (window.matchMedia?.('(max-width: 767px)').matches) {
          setTimeout(() => {
            shortInput.scrollIntoView({ block: 'center', behavior: 'smooth' });
          }, 260);
        }
      });
      shortInput.addEventListener('input', (e) => {
        currentResponse = e.target.value;
        emitChange();
        syncShortUi(currentResponse);
      });
      shortInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          e.stopPropagation(); // P0 #2: never bubble to document keydown after DOM swap!
          if (!isChecked && mode !== 'exam' && hasResponse(task, currentResponse)) {
            triggerCheck();
          } else if (isChecked && onNext) {
            onNext();
          }
        }
      });
    }

    clearShortBtn?.addEventListener('click', () => {
      haptic('light');
      currentResponse = '';
      emitChange();
      render('.short-input');
    });

    container.querySelectorAll('[data-action="insert-char"]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const ch = btn.dataset.char || '';
        const input = container.querySelector('.short-input');
        if (!input || isChecked) return;
        haptic('selection');
        const start = input.selectionStart ?? input.value.length;
        const end = input.selectionEnd ?? input.value.length;
        const nextVal = input.value.slice(0, start) + ch + input.value.slice(end);
        currentResponse = nextVal;
        input.value = nextVal;
        emitChange();
        input.focus();
        input.setSelectionRange(start + ch.length, start + ch.length);
        syncShortUi(nextVal);
      });
    });

    // Match: select active left card on click
    container.querySelectorAll('[data-match-left-card]').forEach((card) => {
      card.addEventListener('click', (e) => {
        if (isChecked || e.target.closest('button')) return;
        const lIdx = Number(card.dataset.matchLeftCard);
        if (activeMatchLeft !== lIdx) {
          haptic('selection');
          activeMatchLeft = lIdx;
          render();
        }
      });
    });

    // Match: letter pills
    container.querySelectorAll('[data-action="pick-match"]').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (isChecked) return;
        haptic('selection');
        const lIdx = Number(btn.dataset.left);
        const rIdx = Number(btn.dataset.right);
        const arr = Array.isArray(currentResponse)
          ? [...currentResponse]
          : new Array(task.pairs?.left?.length ?? 0).fill(-1);
        arr[lIdx] = arr[lIdx] === rIdx ? -1 : rIdx;
        currentResponse = arr;
        activeMatchLeft = lIdx;
        emitChange();
        render(`[data-action="pick-match"][data-left="${lIdx}"][data-right="${rIdx}"]`);
      });
    });

    // Match: direct click on right-hand option assigns to active left item & advances
    container.querySelectorAll('[data-action="pick-match-right"]').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (isChecked) return;
        haptic('selection');
        const rIdx = Number(btn.dataset.right);
        const leftLen = task.pairs?.left?.length ?? 0;
        if (leftLen === 0) return;
        const arr = Array.isArray(currentResponse)
          ? [...currentResponse]
          : new Array(leftLen).fill(-1);
        const lIdx = Math.max(0, Math.min(leftLen - 1, activeMatchLeft));
        arr[lIdx] = arr[lIdx] === rIdx ? -1 : rIdx;
        currentResponse = arr;
        // Advance active left target to next unassigned left item
        const nextUnassigned = arr.findIndex((v, i) => i > lIdx && v < 0);
        const anyUnassigned = arr.findIndex((v) => v < 0);
        if (nextUnassigned >= 0) activeMatchLeft = nextUnassigned;
        else if (anyUnassigned >= 0) activeMatchLeft = anyUnassigned;
        else activeMatchLeft = (lIdx + 1) % leftLen;
        emitChange();
        render(`[data-action="pick-match-right"][data-right="${rIdx}"]`);
      });
    });

    // Order: click-to-swap + up/down arrows with preserved focus
    container.querySelectorAll('[data-action="order-swap"]').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (isChecked) return;
        haptic('selection');
        const pos = Number(btn.dataset.pos);
        if (orderSelectedPos === null) {
          orderSelectedPos = pos;
          render(`[data-action="order-swap"][data-pos="${pos}"]`);
        } else if (orderSelectedPos === pos) {
          orderSelectedPos = null;
          render(`[data-action="order-swap"][data-pos="${pos}"]`);
        } else {
          const arr = [...currentResponse];
          [arr[orderSelectedPos], arr[pos]] = [arr[pos], arr[orderSelectedPos]];
          currentResponse = arr;
          orderSelectedPos = null;
          emitChange();
          render(`[data-action="order-swap"][data-pos="${pos}"]`);
        }
      });
    });

    container.querySelectorAll('[data-action="order-up"]').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (isChecked) return;
        const pos = Number(btn.dataset.pos);
        if (pos <= 0) return;
        haptic('selection');
        const arr = [...currentResponse];
        [arr[pos - 1], arr[pos]] = [arr[pos], arr[pos - 1]];
        currentResponse = arr;
        orderSelectedPos = null;
        emitChange();
        const nextPos = pos - 1;
        const sel = nextPos > 0
          ? `[data-action="order-up"][data-pos="${nextPos}"]`
          : `[data-action="order-down"][data-pos="${nextPos}"]`;
        render(sel);
      });
    });

    container.querySelectorAll('[data-action="order-down"]').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (isChecked) return;
        const pos = Number(btn.dataset.pos);
        const arr = [...currentResponse];
        if (pos >= arr.length - 1) return;
        haptic('selection');
        [arr[pos + 1], arr[pos]] = [arr[pos], arr[pos + 1]];
        currentResponse = arr;
        orderSelectedPos = null;
        emitChange();
        const nextPos = pos + 1;
        const sel = nextPos < arr.length - 1
          ? `[data-action="order-down"][data-pos="${nextPos}"]`
          : `[data-action="order-up"][data-pos="${nextPos}"]`;
        render(sel);
      });
    });

    // Open answer
    const openTextarea = container.querySelector('.open-textarea');
    if (openTextarea) {
      openTextarea.addEventListener('focus', () => {
        if (window.matchMedia?.('(max-width: 767px)').matches) {
          setTimeout(() => {
            openTextarea.scrollIntoView({ block: 'center', behavior: 'smooth' });
          }, 260);
        }
      });
      openTextarea.addEventListener('input', (e) => {
        currentResponse = {
          ...(typeof currentResponse === 'object' && currentResponse ? currentResponse : { self: null }),
          text: e.target.value,
        };
        emitChange();
      });
    }

    container.querySelector('[data-action="reveal-rubric"]')?.addEventListener('click', () => {
      haptic('light');
      rubricRevealed = true;
      render('[data-action="pick-self-score"]');
    });

    container.querySelectorAll('[data-action="pick-self-score"]').forEach((btn) => {
      btn.addEventListener('click', () => {
        haptic('selection');
        const pts = Number(btn.dataset.points);
        currentResponse = {
          text: currentResponse?.text ?? '',
          self: pts,
        };
        emitChange();
        if (mode !== 'exam' && !isChecked) {
          triggerCheck();
        } else {
          render(`[data-action="pick-self-score"][data-points="${pts}"]`);
        }
      });
    });

    // Subtle Horizontal Swipe Navigation in Originals & Exam (respects iOS/Android edge gestures & scrollable elements)
    if ((mode === 'originals' || mode === 'exam') && (onNext || onPrev)) {
      const cardEl = container.querySelector('.task-card');
      if (cardEl) {
        let swipeStartX = 0;
        let swipeStartY = 0;
        let swipeStartAt = 0;
        let swipeActive = false;

        cardEl.addEventListener('touchstart', (e) => {
          swipeActive = false;
          if (!e.touches || e.touches.length !== 1) return;
          const touch = e.touches[0];
          const vw = window.innerWidth || 0;
          // Preserve iOS left-edge back gesture & Android edge predictive back
          if (touch.clientX < 28 || (vw > 0 && touch.clientX > vw - 28)) return;
          const target = e.target;
          if (target?.closest?.('table, .originals-strip, input, textarea, select, .katex-display, .passage-panel')) return;
          swipeStartX = touch.clientX;
          swipeStartY = touch.clientY;
          swipeStartAt = Date.now();
          swipeActive = true;
        }, { passive: true });

        cardEl.addEventListener('touchcancel', () => {
          swipeActive = false;
        }, { passive: true });

        cardEl.addEventListener('touchend', (e) => {
          if (!swipeActive || !e.changedTouches || e.changedTouches.length !== 1) return;
          swipeActive = false;
          if (window.getSelection && window.getSelection()?.toString()) return;
          const dt = Date.now() - swipeStartAt;
          if (dt > 650) return;
          const touch = e.changedTouches[0];
          const dx = touch.clientX - swipeStartX;
          const dy = touch.clientY - swipeStartY;
          if (Math.abs(dx) <= 68 || Math.abs(dx) <= 1.8 * Math.abs(dy)) return;
          if (dx < 0 && onNext) {
            haptic('selection');
            onNext();
          } else if (dx > 0 && onPrev) {
            haptic('selection');
            onPrev();
          }
        }, { passive: true });
      }
    }

    // Footer buttons
    container.querySelector('[data-action="toggle-hint"]')?.addEventListener('click', () => {
      hintOpen = !hintOpen;
      render('[data-action="toggle-hint"]');
    });
    container.querySelector('[data-action="check-answer"]')?.addEventListener('click', () => {
      triggerCheck();
    });
    container.querySelector('[data-action="next-task"]')?.addEventListener('click', () => {
      if (onNext) onNext();
    });
    container.querySelector('[data-action="prev-task"]')?.addEventListener('click', () => {
      if (onPrev) onPrev();
    });
    container.querySelector('[data-action="similar-task"]')?.addEventListener('click', () => {
      if (onSimilar) onSimilar();
    });
    container.querySelector('[data-action="finish-exam-inline"]')?.addEventListener('click', () => {
      if (opts.onFinishExam) opts.onFinishExam();
    });

    container.querySelector('[data-action="ask-ai-task"]')?.addEventListener('click', () => {
      haptic('selection');
      try {
        const plainUserAns = (() => {
          if (currentResponse === null || currentResponse === undefined) return '';
          if (task.format === 'single') {
            const idx = Number(currentResponse);
            return `${LETTERS[idx] ?? idx + 1}) ${task.options?.[idx] ?? ''}`;
          }
          if (task.format === 'multi' && Array.isArray(currentResponse)) {
            return currentResponse.map((i) => `${LETTERS[i] ?? i + 1}) ${task.options?.[i] ?? ''}`).join('; ');
          }
          if (task.format === 'open') return currentResponse?.text || `self=${currentResponse?.self ?? ''}`;
          return typeof currentResponse === 'object' ? JSON.stringify(currentResponse) : String(currentResponse);
        })();
        const plainCanonical = formatCanonicalAnswer(task).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
        sessionStorage.setItem('ulduz_ai_task_ctx', JSON.stringify({
          subject: task.subject || 'math',
          topic: task.topic || '',
          stem: task.stem || '',
          userAnswer: plainUserAns,
          canonicalAnswer: plainCanonical,
          explanation: task.explanation || '',
          durationSec: lastCheckedDurationSec || 0,
        }));
      } catch {
        // ignore storage errors
      }
      window.location.hash = '#/ai?from=task';
    });
  }

  render();

  // Expose keyboard handler for the active view
  return {
    handleKeyDown(e) {
      const active = document.activeElement;
      const tag = active?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (e.ctrlKey || e.altKey || e.metaKey) return;

      // Flag toggle in exam mode takes priority over option letter F
      if ((e.key === 'f' || e.key === 'F' || e.key === 'а' || e.key === 'А') && mode === 'exam' && onToggleFlag) {
        e.preventDefault();
        onToggleFlag();
        return;
      }

      // Hint toggle in practice/originals mode
      if ((e.key === 'h' || e.key === 'H' || e.key === 'р' || e.key === 'Р') && task.hint && !isChecked && mode !== 'exam') {
        e.preventDefault();
        hintOpen = !hintOpen;
        render('[data-action="toggle-hint"]');
        return;
      }

      // 1..6 or A..F for single/multi options
      if (!isChecked && (task.format === 'single' || task.format === 'multi')) {
        const optsLen = task.options?.length ?? 0;
        let idx = -1;
        if (e.key >= '1' && e.key <= '8') idx = Number(e.key) - 1;
        else {
          const upper = e.key.toUpperCase();
          idx = LETTERS.indexOf(upper);
        }
        if (idx >= 0 && idx < optsLen) {
          e.preventDefault();
          eliminated.delete(idx);
          if (task.format === 'single') {
            currentResponse = idx;
          } else {
            const set = new Set(Array.isArray(currentResponse) ? currentResponse : []);
            if (set.has(idx)) set.delete(idx);
            else set.add(idx);
            currentResponse = [...set].sort((a, b) => a - b);
          }
          emitChange();
          const inOptions = Boolean(active?.closest?.('.options-list'));
          const focusSel = inOptions
            ? `[data-action="${task.format === 'single' ? 'pick-single' : 'toggle-multi'}"][data-index="${idx}"]`
            : null;
          render(focusSel);
          return;
        }
      }

      // P0 #3: Guard global Enter identically to Space against ALL interactive controls!
      const isInteractiveTarget = Boolean(
        e.target?.closest?.('a, button, summary, input, textarea, select, [role="tab"]') ||
        active?.closest?.('a, button, summary, input, textarea, select, [role="tab"]')
      );

      if (e.key === 'Enter') {
        if (isInteractiveTarget) return;
        if (mode !== 'exam') {
          if (!isChecked && hasResponse(task, currentResponse)) {
            e.preventDefault();
            triggerCheck();
          } else if (isChecked && onNext) {
            e.preventDefault();
            onNext();
          }
        }
      } else if ((e.key === ' ' || e.code === 'Space') && isChecked && mode !== 'exam' && onNext) {
        if (!isInteractiveTarget) {
          e.preventDefault();
          onNext();
        }
      } else if (e.key === 'ArrowRight' && mode === 'exam' && onNext && !isInteractiveTarget) {
        e.preventDefault();
        onNext();
      } else if (e.key === 'ArrowLeft' && mode === 'exam' && onPrev && !isInteractiveTarget) {
        e.preventDefault();
        onPrev();
      }
    },
  };
}
