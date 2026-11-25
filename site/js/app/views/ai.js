// AI Tutor Chat Console (#/ai)
// Powered by OpenCode Zen (DeepSeek default) & Kilo Gateway Free with automatic fallback,
// live student solving/error/timing telemetry context, and KaTeX math rendering.

import {
  loadState,
  getLang,
  getSettings,
  updateAiSettings,
  getAiChatHistory,
  saveAiChatHistory,
  clearAiChatHistory,
} from '../../core/storage.js';
import {
  buildStudentTelemetrySnapshot,
  buildAiSystemPrompt,
  formatDurationShort,
  formatStudyTime,
} from '../../core/telemetry.js';
import {
  AI_PROVIDERS,
  getProviderModels,
  resolveActiveAiConfig,
  sendAiChat,
} from '../../core/ai-gateway.js';
import { haptic } from '../../core/native.js';
import { t, subjectTitle, subjectShort } from '../i18n.js';
import { icon } from '../icons.js';
import { escapeHtml, hydrateMath } from '../math.js';

/**
 * XSS-safe lightweight Markdown renderer that preserves `$...$` and `$$...$$` for KaTeX.
 */
function renderAiMarkdown(raw) {
  const src = String(raw || '').replace(/\r\n/g, '\n');
  const codeBlocks = [];
  const withPlaceholders = src.replace(/```([\w-]*)\n?([\s\S]*?)```/g, (_, langTag, code) => {
    const idx = codeBlocks.length;
    codeBlocks.push(`<pre class="ai-code-block"><code>${escapeHtml(code.trimEnd())}</code></pre>`);
    return `\u0000CODEBLOCK_${idx}\u0000`;
  });

  const formatInline = (text) => {
    const escaped = escapeHtml(text);
    return escaped
      .replace(/`([^`\n]+)`/g, '<code class="ai-inline-code">$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>');
  };

  const lines = withPlaceholders.split('\n');
  const out = [];
  let inUl = false;
  let inOl = false;

  const closeLists = () => {
    if (inUl) { out.push('</ul>'); inUl = false; }
    if (inOl) { out.push('</ol>'); inOl = false; }
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      closeLists();
      continue;
    }
    const blockMatch = trimmed.match(/^\u0000CODEBLOCK_(\d+)\u0000$/);
    if (blockMatch) {
      closeLists();
      out.push(codeBlocks[Number(blockMatch[1])] || '');
      continue;
    }
    const hMatch = trimmed.match(/^(#{1,4})\s+(.+)$/);
    if (hMatch) {
      closeLists();
      out.push(`<h4 class="ai-md-heading">${formatInline(hMatch[2])}</h4>`);
      continue;
    }
    const ulMatch = trimmed.match(/^[-*•]\s+(.+)$/);
    if (ulMatch) {
      if (inOl) { out.push('</ol>'); inOl = false; }
      if (!inUl) { out.push('<ul class="ai-md-list">'); inUl = true; }
      out.push(`<li>${formatInline(ulMatch[1])}</li>`);
      continue;
    }
    const olMatch = trimmed.match(/^\d+[.)]\s+(.+)$/);
    if (olMatch) {
      if (inUl) { out.push('</ul>'); inUl = false; }
      if (!inOl) { out.push('<ol class="ai-md-list">'); inOl = true; }
      out.push(`<li>${formatInline(olMatch[1])}</li>`);
      continue;
    }
    closeLists();
    out.push(`<p>${formatInline(trimmed)}</p>`);
  }
  closeLists();
  return out.join('');
}

function formatErrorHint(err) {
  if (!err) return '';
  if (err.code === 'cors_blocked') return t('aiErrCors');
  if (err.code === 'rate_limited' || err.status === 429) return t('aiErrRateLimit');
  if (err.code === 'auth_required' || err.status === 401 || err.status === 403) return t('aiErrAuth');
  if (err.code === 'bad_config') return t('aiErrBadConfig');
  return err.message || t('aiErrGeneric');
}

export async function renderAiView(container, { query, setKeyHandler, setCleanup }) {
  if (setKeyHandler) setKeyHandler(null);

  let messages = [...getAiChatHistory()];
  let draft = '';
  let isSending = false;
  let errorState = null;
  let activeAbort = null;
  let telemetryOpen = false;
  let taskContext = null;

  // Load optional task context passed from "Спросить ИИ" on a checked task
  if (query.get('from') === 'task') {
    try {
      const rawCtx = sessionStorage.getItem('ulduz_ai_task_ctx');
      if (rawCtx) taskContext = JSON.parse(rawCtx);
    } catch {
      taskContext = null;
    }
  }

  if (setCleanup) {
    setCleanup(() => {
      if (activeAbort) {
        try { activeAbort.abort(); } catch { /* ignore */ }
        activeAbort = null;
      }
    });
  }

  function scrollThreadToBottom() {
    const thread = container.querySelector('#ai-thread');
    if (thread) {
      thread.scrollTop = thread.scrollHeight;
    }
  }

  async function submitMessage(textOverride = null) {
    const text = String(textOverride ?? draft).trim();
    if (!text || isSending) return;

    haptic('selection');
    errorState = null;
    draft = '';

    const userMsg = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: text,
      at: Date.now(),
    };
    messages = [...messages, userMsg];
    saveAiChatHistory(messages);
    isSending = true;
    render();
    scrollThreadToBottom();

    const state = loadState();
    const lang = getLang();
    const aiSettings = getSettings().ai;
    const systemPrompt = buildAiSystemPrompt(state, lang, {
      style: aiSettings.systemStyle || 'coach',
      shareTelemetry: aiSettings.shareTelemetry !== false,
      taskContext,
    });

    activeAbort = typeof AbortController !== 'undefined' ? new AbortController() : null;

    try {
      const res = await sendAiChat({
        messages,
        aiSettings,
        systemPrompt,
        signal: activeAbort?.signal || null,
      });
      const assistantMsg = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        content: res.content,
        reasoning: res.reasoning || '',
        model: res.model,
        provider: res.provider,
        fallbackNote: res.fallbackNote || null,
        at: Date.now(),
      };
      messages = [...messages, assistantMsg];
      saveAiChatHistory(messages);
      haptic('success');
    } catch (err) {
      if (err?.code !== 'aborted') {
        errorState = {
          code: err?.code || 'error',
          message: formatErrorHint(err),
          raw: err?.message || '',
          lastUserText: text,
        };
        haptic('error');
      }
    } finally {
      isSending = false;
      activeAbort = null;
      render();
      scrollThreadToBottom();
    }
  }

  function render() {
    const state = loadState();
    const lang = getLang();
    const aiSettings = getSettings().ai;
    const activeCfg = resolveActiveAiConfig(aiSettings);
    const models = getProviderModels(activeCfg.provider);
    const hasCurrentInList = models.some((m) => m.id === activeCfg.model);
    const snap = buildStudentTelemetrySnapshot(state);
    const o = snap.overall;
    const weakest = snap.weakestTopics[0] || null;
    const slowest = snap.slowestTopics[0] || null;
    const shareOn = aiSettings.shareTelemetry !== false;

    const quickPrompts = taskContext
      ? [
          t('aiTaskPromptWhyWrong'),
          t('aiTaskPromptStepByStep'),
          t('aiTaskPromptSimilarRule'),
          t('aiQuickAnalyzeStats'),
        ]
      : [
          t('aiQuickAnalyzeStats'),
          t('aiQuickWhereSlow'),
          t('aiQuickWeekPlan'),
          t('aiQuickExplainMistakes'),
        ];

    container.innerHTML = `
      <div class="page-container ai-page-container">
        <nav class="breadcrumbs" aria-label="${escapeHtml(t('breadcrumbsAria'))}">
          <a href="#/">${escapeHtml(t('navHome'))}</a>
          <span aria-hidden="true">/</span>
          <span aria-current="page">${escapeHtml(t('navAi'))}</span>
        </nav>

        <div class="section-header section-header--split">
          <div>
            <h1 class="page-title">${escapeHtml(t('aiTitle'))}</h1>
            <p class="page-lead text-secondary">${escapeHtml(t('aiSubtitle'))}</p>
          </div>
          <div class="ai-head-controls">
            <div class="ai-gateway-select-wrap">
              <span class="ai-provider-pill mono-code">
                <span class="ai-provider-pip ai-provider-pip--${escapeHtml(activeCfg.provider)}" aria-hidden="true"></span>
                <span>${escapeHtml(activeCfg.providerName)}</span>
              </span>
              <label class="sr-only" for="ai-quick-model">${escapeHtml(t('settingsAiModelLabel'))}</label>
              <select id="ai-quick-model" class="control-select ai-quick-model">
                ${!hasCurrentInList ? `<option value="${escapeHtml(activeCfg.model)}" selected>${escapeHtml(activeCfg.model)}</option>` : ''}
                ${models.map((m) => `
                  <option value="${escapeHtml(m.id)}" ${m.id === activeCfg.model ? 'selected' : ''}>${escapeHtml(m.label)}</option>
                `).join('')}
              </select>
            </div>
            <a href="#/settings" class="btn btn--secondary btn--sm">
              ${icon('settings', { size: 15 })}
              <span>${escapeHtml(t('aiGatewaySettingsBtn'))}</span>
            </a>
            ${messages.length > 0 ? `
              <button type="button" class="btn btn--ghost btn--sm" data-action="clear-chat" ${isSending ? 'disabled' : ''}>
                ${icon('trash', { size: 14 })}
                <span class="hide-xs">${escapeHtml(t('aiClearChatBtn'))}</span>
              </button>
            ` : ''}
          </div>
        </div>

        <!-- Live Telemetry Context Bar (exact real metrics shared with the AI model) -->
        <section class="ai-telemetry-bar ${shareOn ? 'is-enabled' : 'is-paused'}" aria-label="${escapeHtml(t('aiTelemetryTitle'))}">
          <div class="ai-telemetry-bar__summary">
            <button type="button" class="ai-telemetry-toggle-btn" data-action="toggle-telemetry-drawer" aria-expanded="${telemetryOpen}">
              ${icon('activity', { size: 15 })}
              <span class="ai-telemetry-bar__title">${escapeHtml(t('aiTelemetryTitle'))}</span>
              <span class="ai-telemetry-bar__metrics mono-code tabular-nums">
                ${escapeHtml(t('aiTelemetrySummaryLine', {
                  solved: o.attempted,
                  acc: o.accuracy,
                  mistakes: o.activeMistakes,
                  avg: o.totalTimedAttempts > 0 ? formatDurationShort(o.avgSec, lang) : '—',
                }))}
              </span>
              ${icon(telemetryOpen ? 'chevron-up' : 'chevron-down', { size: 15 })}
            </button>
            <button type="button" class="seg-btn ${shareOn ? 'is-active' : ''}" data-action="toggle-share-telemetry" aria-pressed="${shareOn}">
              <span>${escapeHtml(shareOn ? t('aiTelemetryOn') : t('aiTelemetryOff'))}</span>
            </button>
          </div>
          ${telemetryOpen ? `
            <div class="ai-telemetry-details">
              <div class="ai-telemetry-kv">
                <span class="text-muted">${escapeHtml(t('statsKpiAvgTime', { total: formatStudyTime(o.totalSec, lang) }))}</span>
                <strong class="mono-code tabular-nums">${escapeHtml(o.totalTimedAttempts > 0 ? formatDurationShort(o.avgSec, lang) : '—')}</strong>
              </div>
              <div class="ai-telemetry-kv">
                <span class="text-muted">${escapeHtml(t('aiTelemetryWeakestLabel'))}</span>
                <strong>${weakest ? `${escapeHtml(subjectShort(weakest.subject))} · ${escapeHtml(weakest.topic)} (${weakest.accuracy}%)` : '—'}</strong>
              </div>
              <div class="ai-telemetry-kv">
                <span class="text-muted">${escapeHtml(t('aiTelemetrySlowestLabel'))}</span>
                <strong>${slowest ? `${escapeHtml(subjectShort(slowest.subject))} · ${escapeHtml(slowest.topic)} (${escapeHtml(formatDurationShort(slowest.avgSec, lang))})` : '—'}</strong>
              </div>
              <div class="ai-telemetry-kv">
                <span class="text-muted">${escapeHtml(t('statsPaceCorrectLabel'))} / ${escapeHtml(t('statsPaceWrongLabel'))}</span>
                <strong class="mono-code tabular-nums">${escapeHtml(o.correctAvgSec > 0 ? formatDurationShort(o.correctAvgSec, lang) : '—')} / ${escapeHtml(o.wrongAvgSec > 0 ? formatDurationShort(o.wrongAvgSec, lang) : '—')}</strong>
              </div>
            </div>
          ` : ''}
        </section>

        <!-- Optional Active Task Context Card -->
        ${taskContext ? `
          <div class="ai-task-context-card">
            <div class="ai-task-context-card__body">
              <div class="ai-task-context-card__meta mono-code">
                <span>${escapeHtml(t('aiTaskCtxBadge'))}</span>
                <span>·</span>
                <span>${escapeHtml(subjectTitle(taskContext.subject))}</span>
                ${taskContext.topic ? `<span>· ${escapeHtml(taskContext.topic)}</span>` : ''}
              </div>
              <p class="ai-task-context-card__stem">${escapeHtml(String(taskContext.stem || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 180))}</p>
            </div>
            <button type="button" class="btn-icon btn-icon--sm" data-action="dismiss-task-ctx" aria-label="${escapeHtml(t('btnCancel'))}">
              ${icon('x', { size: 15 })}
            </button>
          </div>
        ` : ''}

        <!-- Chat Console Surface -->
        <section class="ai-chat-shell" aria-label="${escapeHtml(t('aiThreadAria'))}">
          <div id="ai-thread" class="ai-thread">
            ${messages.length === 0 ? `
              <div class="ai-empty-state">
                <div class="ai-empty-state__icon" aria-hidden="true">${icon('bot', { size: 24 })}</div>
                <h2 class="ai-empty-state__title">${escapeHtml(t('aiWelcomeTitle'))}</h2>
                <p class="text-secondary ai-empty-state__desc">${escapeHtml(t('aiWelcomeDesc', { model: activeCfg.model }))}</p>
                <div class="ai-quick-chips">
                  ${quickPrompts.map((promptText, idx) => `
                    <button type="button" class="ai-chip-btn" data-action="quick-prompt" data-idx="${idx}">
                      <span>${escapeHtml(promptText)}</span>
                      ${icon('arrow-right', { size: 13 })}
                    </button>
                  `).join('')}
                </div>
              </div>
            ` : `
              ${messages.map((m) => {
                const isUser = m.role === 'user';
                const providerTitle = AI_PROVIDERS[m.provider]?.name || m.provider || '';
                const stamp = !isUser
                  ? `${providerTitle}${m.model ? ` · ${m.model}` : ''}${m.fallbackNote ? ` · ${t('aiFallbackTag', { reason: m.fallbackNote })}` : ''}`
                  : t('aiYouLabel');
                return `
                  <article class="ai-msg ${isUser ? 'ai-msg--user' : 'ai-msg--assistant'}">
                    <header class="ai-msg__head mono-code">
                      <span class="ai-msg__author">${escapeHtml(stamp)}</span>
                    </header>
                    ${!isUser && m.reasoning ? `
                      <details class="ai-reasoning-box">
                        <summary class="mono-code">${escapeHtml(t('aiReasoningLabel'))}</summary>
                        <div class="ai-reasoning-box__body">${renderAiMarkdown(m.reasoning)}</div>
                      </details>
                    ` : ''}
                    <div class="ai-msg__content">
                      ${isUser ? `<p>${escapeHtml(m.content).replace(/\n/g, '<br/>')}</p>` : renderAiMarkdown(m.content)}
                    </div>
                  </article>
                `;
              }).join('')}
              ${isSending ? `
                <article class="ai-msg ai-msg--assistant ai-msg--thinking" role="status">
                  <header class="ai-msg__head mono-code">
                    <span class="ai-msg__author">${escapeHtml(activeCfg.providerName)} · ${escapeHtml(activeCfg.model)}</span>
                  </header>
                  <div class="ai-thinking-line mono-code">
                    <span class="ai-thinking-bar" aria-hidden="true"></span>
                    <span>${escapeHtml(t('aiThinkingLabel'))}</span>
                  </div>
                </article>
              ` : ''}
            `}
          </div>

          ${errorState ? `
            <div class="ai-error-banner" role="alert">
              <div class="ai-error-banner__text">
                <strong>${escapeHtml(t('aiErrorTitle'))}</strong>
                <p>${escapeHtml(errorState.message)}</p>
              </div>
              <div class="ai-error-banner__actions">
                <button type="button" class="btn btn--secondary btn--xs" data-action="retry-last">
                  ${icon('refresh', { size: 13 })}
                  <span>${escapeHtml(t('aiRetryBtn'))}</span>
                </button>
                <a href="#/settings" class="btn btn--ghost btn--xs">${escapeHtml(t('navSettings'))}</a>
              </div>
            </div>
          ` : ''}

          ${messages.length > 0 && !isSending ? `
            <div class="ai-quick-strip">
              ${quickPrompts.slice(0, 3).map((promptText, idx) => `
                <button type="button" class="ai-chip-btn ai-chip-btn--compact" data-action="quick-prompt" data-idx="${idx}">
                  <span>${escapeHtml(promptText)}</span>
                </button>
              `).join('')}
            </div>
          ` : ''}

          <form id="ai-composer-form" class="ai-composer">
            <label class="sr-only" for="ai-input">${escapeHtml(t('aiInputAria'))}</label>
            <textarea
              id="ai-input"
              class="ai-composer__input"
              rows="2"
              placeholder="${escapeHtml(t('aiInputPlaceholder'))}"
              ${isSending ? 'disabled' : ''}
            >${escapeHtml(draft)}</textarea>
            ${isSending ? `
              <button type="button" class="btn btn--secondary ai-composer__send" data-action="stop-ai">
                ${icon('stop-square', { size: 15 })}
                <span>${escapeHtml(t('aiStopBtn'))}</span>
              </button>
            ` : `
              <button type="submit" class="btn btn--primary ai-composer__send" id="ai-send-btn" ${!draft.trim() ? 'disabled' : ''}>
                ${icon('send', { size: 15 })}
                <span>${escapeHtml(t('aiSendBtn'))}</span>
              </button>
            `}
          </form>
        </section>
      </div>
    `;

    hydrateMath(container);

    // Quick model select (updates active provider's model directly)
    container.querySelector('#ai-quick-model')?.addEventListener('change', (e) => {
      const nextModel = e.target.value;
      if (activeCfg.provider === 'kilo') updateAiSettings({ kiloModel: nextModel });
      else if (activeCfg.provider === 'custom') updateAiSettings({ customModel: nextModel });
      else updateAiSettings({ model: nextModel });
      haptic('selection');
      render();
    });

    container.querySelector('[data-action="clear-chat"]')?.addEventListener('click', () => {
      haptic('light');
      clearAiChatHistory();
      messages = [];
      errorState = null;
      render();
    });

    container.querySelector('[data-action="toggle-telemetry-drawer"]')?.addEventListener('click', () => {
      telemetryOpen = !telemetryOpen;
      render();
    });

    container.querySelector('[data-action="toggle-share-telemetry"]')?.addEventListener('click', () => {
      haptic('selection');
      updateAiSettings({ shareTelemetry: !shareOn });
      render();
    });

    container.querySelector('[data-action="dismiss-task-ctx"]')?.addEventListener('click', () => {
      taskContext = null;
      try { sessionStorage.removeItem('ulduz_ai_task_ctx'); } catch { /* ignore */ }
      render();
    });

    container.querySelectorAll('[data-action="quick-prompt"]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = Number(btn.dataset.idx);
        const text = quickPrompts[idx];
        if (text) void submitMessage(text);
      });
    });

    container.querySelector('[data-action="retry-last"]')?.addEventListener('click', () => {
      const retryText = errorState?.lastUserText;
      if (!retryText) return;
      // Avoid duplicating identical consecutive user message on retry
      if (messages.length > 0 && messages[messages.length - 1].role === 'user' && messages[messages.length - 1].content === retryText) {
        messages = messages.slice(0, -1);
      }
      void submitMessage(retryText);
    });

    container.querySelector('[data-action="stop-ai"]')?.addEventListener('click', () => {
      if (activeAbort) {
        try { activeAbort.abort(); } catch { /* ignore */ }
      }
      isSending = false;
      render();
    });

    const inputEl = container.querySelector('#ai-input');
    const sendBtn = container.querySelector('#ai-send-btn');
    if (inputEl) {
      inputEl.addEventListener('input', (e) => {
        draft = e.target.value;
        if (sendBtn) sendBtn.disabled = !draft.trim();
      });
      inputEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          if (draft.trim() && !isSending) {
            void submitMessage(draft);
          }
        }
      });
    }

    container.querySelector('#ai-composer-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      if (draft.trim() && !isSending) {
        void submitMessage(draft);
      }
    });
  }

  render();

  // Prefill helpful prompt when navigated from Stats ("Разобрать статистику с ИИ")
  if (query.get('prompt') === 'analyze' && !draft) {
    draft = t('aiQuickAnalyzeStats');
    render();
    container.querySelector('#ai-input')?.focus();
  } else if (taskContext && !draft) {
    draft = t('aiTaskPromptWhyWrong');
    render();
    container.querySelector('#ai-input')?.focus();
  }
}
