// AI Gateway Client for OpenCode Zen, Kilo Gateway, and Custom OpenAI-Compatible APIs.
// Default model: DeepSeek (`deepseek-v4.1-flash-free` on OpenCode Zen) with seamless automatic
// fallback to Kilo Gateway Free (`kilo-auto/free`, 100% keyless!) whenever OpenCode returns 429/401/403.
// Routes through CORS-free Rust `reqwest` bridge inside Tauri native Android/Desktop builds.

import { isNativeApp, nativeAiChatCompletion, nativeAiListModels } from './native.js';

export const AI_PROVIDERS = {
  opencode: {
    id: 'opencode',
    name: 'OpenCode Zen',
    baseUrl: 'https://opencode.ai/zen/v1',
    defaultModel: 'deepseek-v4.1-flash-free',
    docsUrl: 'https://opencode.ai/docs/zen/',
    models: [
      { id: 'deepseek-v4.1-flash-free', label: 'DeepSeek V4.1 Flash (Free · Default)', free: true, deepseek: true },
      { id: 'mimo-v2.6-flash-free', label: 'MiMo V2.6 Flash (Free)', free: true },
      { id: 'big-pickle', label: 'Big Pickle (Free)', free: true },
      { id: 'nemotron-3.5-super-vl-free', label: 'Nemotron 3.5 Super VL (Free)', free: true },
      { id: 'nemotron-3.5-lightning-free', label: 'Nemotron 3.5 Lightning (Free)', free: true },
      { id: 'flint-40b-free', label: 'Flint 40B (Free)', free: true },
      { id: 'beam-free', label: 'Beam (Free)', free: true },
      { id: 'deepseek-v4.1-flash', label: 'DeepSeek V4.1 Flash (API Key)', free: false, deepseek: true },
      { id: 'deepseek-v4-pro', label: 'DeepSeek V4 Pro (API Key)', free: false, deepseek: true },
    ],
  },
  kilo: {
    id: 'kilo',
    name: 'Kilo Gateway',
    baseUrl: 'https://api.kilo.ai/api/gateway',
    defaultModel: 'kilo-auto/free',
    docsUrl: 'https://kilo.ai/docs/gateway',
    models: [
      { id: 'kilo-auto/free', label: 'Kilo Auto Free (Keyless)', free: true },
      { id: 'nvidia/nemotron-3-ultra-550b-a55b:free', label: 'Nemotron 3 Ultra 550B (Free)', free: true },
      { id: 'nvidia/nemotron-3.5-super-vl:free', label: 'Nemotron 3.5 Super VL (Free)', free: true },
      { id: 'nvidia/nemotron-3.5-lightning:free', label: 'Nemotron 3.5 Lightning (Free)', free: true },
      { id: 'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free', label: 'Nemotron 3 Nano Reasoning (Free)', free: true },
      { id: 'inclusionai/ling-3.2-flash:free', label: 'Ling 3.2 Flash (Free)', free: true },
      { id: 'baidu/ernie-5.5-flash-preview:free', label: 'ERNIE 5.5 Flash (Free)', free: true },
      { id: 'recursive/flint-v1.0:free', label: 'Flint v1.0 (Free)', free: true },
      { id: 'reflection/beam-free', label: 'Beam (Free)', free: true },
      { id: 'deepseek/deepseek-v4.1-flash', label: 'DeepSeek V4.1 Flash (Kilo Key)', free: false, deepseek: true },
      { id: 'deepseek/deepseek-v4-pro', label: 'DeepSeek V4 Pro (Kilo Key)', free: false, deepseek: true },
      { id: 'deepseek/deepseek-r1-0528', label: 'DeepSeek R1 (Kilo Key)', free: false, deepseek: true },
    ],
  },
  custom: {
    id: 'custom',
    name: 'Custom OpenAI',
    baseUrl: '',
    defaultModel: 'deepseek-chat',
    docsUrl: '',
    models: [
      { id: 'deepseek-chat', label: 'deepseek-chat', free: false, deepseek: true },
      { id: 'deepseek-reasoner', label: 'deepseek-reasoner', free: false, deepseek: true },
    ],
  },
};

const liveModelsCache = new Map();

function trimSlash(url) {
  return String(url || '').trim().replace(/\/+$/, '');
}

function buildChatUrl(providerId, customBaseUrl = '') {
  if (providerId === 'custom') {
    const clean = trimSlash(customBaseUrl);
    if (!clean) return '';
    return clean.endsWith('/chat/completions') ? clean : `${clean}/chat/completions`;
  }
  const base = AI_PROVIDERS[providerId]?.baseUrl || AI_PROVIDERS.opencode.baseUrl;
  return `${base}/chat/completions`;
}

function buildModelsUrl(providerId, customBaseUrl = '') {
  if (providerId === 'custom') {
    const clean = trimSlash(customBaseUrl);
    if (!clean) return '';
    if (clean.endsWith('/chat/completions')) {
      return clean.replace(/\/chat\/completions$/, '/models');
    }
    return clean.endsWith('/models') ? clean : `${clean}/models`;
  }
  const base = AI_PROVIDERS[providerId]?.baseUrl || AI_PROVIDERS.opencode.baseUrl;
  return `${base}/models`;
}

function isFreeModelRecord(item) {
  const id = String(item?.id || '').toLowerCase();
  if (id.includes('free') || id === 'big-pickle') return true;
  if (item?.pricing) {
    const p = Number(item.pricing.prompt);
    const c = Number(item.pricing.completion);
    if (p === 0 && c === 0) return true;
  }
  if (item?.price === 0 || item?.cost?.input === 0) return true;
  return false;
}

/**
 * Return cached live models if available, otherwise curated defaults for the provider.
 * @param {'opencode'|'kilo'|'custom'} providerId
 */
export function getProviderModels(providerId) {
  const cached = liveModelsCache.get(providerId);
  if (Array.isArray(cached) && cached.length > 0) return cached;
  return AI_PROVIDERS[providerId]?.models || AI_PROVIDERS.opencode.models;
}

/**
 * Resolve active provider's configured model ID & API key from `settings.ai`.
 */
export function resolveActiveAiConfig(aiSettings = {}) {
  const provider = AI_PROVIDERS[aiSettings.provider] ? aiSettings.provider : 'opencode';
  if (provider === 'kilo') {
    return {
      provider: 'kilo',
      providerName: AI_PROVIDERS.kilo.name,
      model: (aiSettings.kiloModel || AI_PROVIDERS.kilo.defaultModel).trim(),
      apiKey: (aiSettings.kiloApiKey || '').trim(),
      baseUrl: AI_PROVIDERS.kilo.baseUrl,
    };
  }
  if (provider === 'custom') {
    return {
      provider: 'custom',
      providerName: AI_PROVIDERS.custom.name,
      model: (aiSettings.customModel || 'deepseek-chat').trim(),
      apiKey: (aiSettings.customApiKey || '').trim(),
      baseUrl: trimSlash(aiSettings.customBaseUrl || ''),
    };
  }
  return {
    provider: 'opencode',
    providerName: AI_PROVIDERS.opencode.name,
    model: (aiSettings.model || AI_PROVIDERS.opencode.defaultModel).trim(),
    apiKey: (aiSettings.opencodeApiKey || '').trim(),
    baseUrl: AI_PROVIDERS.opencode.baseUrl,
  };
}

async function performJsonRequest({ method = 'POST', url, apiKey = '', body = null, signal = null }) {
  if (!url) {
    const err = new Error('Endpoint URL is empty');
    err.code = 'bad_config';
    throw err;
  }

  if (isNativeApp()) {
    try {
      const res = method === 'GET'
        ? await nativeAiListModels({ url, apiKey })
        : await nativeAiChatCompletion({ url, apiKey, body: JSON.stringify(body) });
      if (!res) {
        const err = new Error('Native HTTP bridge unavailable');
        err.code = 'network_error';
        throw err;
      }
      return { status: Number(res.status || 0), text: String(res.body || '') };
    } catch (err) {
      if (!err.code) err.code = 'network_error';
      throw err;
    }
  }

  // Web/PWA fetch fallback
  const headers = { Accept: 'application/json' };
  if (method === 'POST') headers['Content-Type'] = 'application/json';
  if (apiKey && apiKey.trim()) headers.Authorization = `Bearer ${apiKey.trim()}`;

  try {
    const resp = await fetch(url, {
      method,
      headers,
      body: method === 'POST' ? JSON.stringify(body) : undefined,
      signal: signal || undefined,
    });
    const text = await resp.text();
    return { status: resp.status, text };
  } catch (err) {
    if (err?.name === 'AbortError') {
      err.code = 'aborted';
      throw err;
    }
    const wrapped = new Error(err?.message || 'Network or CORS request failed');
    wrapped.code = err instanceof TypeError ? 'cors_blocked' : 'network_error';
    throw wrapped;
  }
}

function parseErrorSnippet(text, status) {
  try {
    const json = JSON.parse(text);
    const msg = json?.error?.message || json?.message || json?.error;
    if (typeof msg === 'string' && msg.trim()) {
      return `HTTP ${status}: ${msg.trim().slice(0, 180)}`;
    }
  } catch {
    // plain text fallback
  }
  const clean = String(text || '').replace(/\s+/g, ' ').trim().slice(0, 140);
  return clean ? `HTTP ${status}: ${clean}` : `HTTP ${status}`;
}

function extractAssistantReply(json) {
  const choice = Array.isArray(json?.choices) ? json.choices[0] : null;
  const msg = choice?.message || {};
  let content = '';
  if (typeof msg.content === 'string') {
    content = msg.content.trim();
  } else if (Array.isArray(msg.content)) {
    content = msg.content
      .map((part) => (typeof part === 'string' ? part : (part?.text || '')))
      .join('')
      .trim();
  }

  const reasoning = typeof msg.reasoning === 'string'
    ? msg.reasoning.trim()
    : typeof msg.reasoning_content === 'string'
    ? msg.reasoning_content.trim()
    : '';

  // Never show an empty reply if a reasoning model spent its tokens inside `reasoning`
  if (!content && reasoning) {
    return { content: reasoning, reasoning: '' };
  }
  return { content, reasoning };
}

/**
 * Fetch live `/models` list from OpenCode Zen, Kilo Gateway, or Custom OpenAI endpoint.
 * Merges live free & DeepSeek models into memory cache cleanly.
 */
export async function fetchLiveModels(providerId, { apiKey = '', customBaseUrl = '' } = {}) {
  const url = buildModelsUrl(providerId, customBaseUrl);
  if (!url) return getProviderModels(providerId);

  const { status, text } = await performJsonRequest({ method: 'GET', url, apiKey });
  if (status < 200 || status >= 300) {
    const err = new Error(parseErrorSnippet(text, status));
    err.status = status;
    err.code = status === 401 || status === 403 ? 'auth_required' : status === 429 ? 'rate_limited' : 'http_error';
    throw err;
  }

  const parsed = JSON.parse(text);
  const rawList = Array.isArray(parsed?.data) ? parsed.data : [];
  if (rawList.length === 0) return getProviderModels(providerId);

  const mapped = [];
  const seen = new Set();

  // Keep curated default first if present in live catalog (or always keep DeepSeek/Kilo Auto pinned)
  for (const item of rawList) {
    const id = String(item?.id || '').trim();
    if (!id || seen.has(id)) continue;
    const free = isFreeModelRecord(item);
    const deepseek = id.toLowerCase().includes('deepseek');
    if (providerId !== 'custom' && !free && !deepseek) continue;
    seen.add(id);
    const name = typeof item?.name === 'string' && item.name.trim() ? item.name.trim() : id;
    const suffix = free ? ' (Free)' : ' (Key)';
    const label = name.toLowerCase().includes('free') ? name : `${name}${suffix}`;
    mapped.push({ id, label, free, deepseek });
  }

  // Sort: DeepSeek Free first, then other Free models, then DeepSeek Key models
  mapped.sort((a, b) => {
    const rank = (m) => (m.free && m.deepseek ? 0 : m.id === 'kilo-auto/free' ? 0 : m.free ? 1 : m.deepseek ? 2 : 3);
    const diff = rank(a) - rank(b);
    return diff !== 0 ? diff : a.id.localeCompare(b.id);
  });

  if (mapped.length > 0) {
    liveModelsCache.set(providerId, mapped.slice(0, 28));
    return liveModelsCache.get(providerId);
  }
  return getProviderModels(providerId);
}

async function callSingleGateway({ providerId, model, apiKey, customBaseUrl, systemPrompt, messages, maxTokens = 1800, signal = null }) {
  const url = buildChatUrl(providerId, customBaseUrl);
  const cleanMessages = [
    ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
    ...messages
      .filter((m) => (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && m.content.trim())
      .slice(-14)
      .map((m) => ({ role: m.role, content: m.content })),
  ];

  const payload = {
    model,
    messages: cleanMessages,
    temperature: 0.45,
    max_tokens: maxTokens,
  };

  const { status, text } = await performJsonRequest({
    method: 'POST',
    url,
    apiKey,
    body: payload,
    signal,
  });

  if (status < 200 || status >= 300) {
    const err = new Error(parseErrorSnippet(text, status));
    err.status = status;
    err.code = status === 401 || status === 403
      ? 'auth_required'
      : status === 429
      ? 'rate_limited'
      : 'http_error';
    throw err;
  }

  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    const err = new Error('Gateway returned non-JSON response');
    err.code = 'parse_error';
    throw err;
  }

  const { content, reasoning } = extractAssistantReply(parsed);
  if (!content) {
    const err = new Error('Gateway returned an empty message');
    err.code = 'empty_reply';
    throw err;
  }

  return {
    content,
    reasoning,
    model: parsed?.model || model,
    provider: providerId,
  };
}

/**
 * Send a chat conversation through the active AI gateway with automatic OpenCode -> Kilo Free fallback.
 * @param {{ messages: Array<{role:string, content:string}>, aiSettings: object, systemPrompt: string, signal?: AbortSignal }} opts
 */
export async function sendAiChat({ messages, aiSettings = {}, systemPrompt = '', signal = null }) {
  const active = resolveActiveAiConfig(aiSettings);
  const allowFallback = active.provider === 'opencode' && aiSettings.autoFallback !== false;

  try {
    const reply = await callSingleGateway({
      providerId: active.provider,
      model: active.model,
      apiKey: active.apiKey,
      customBaseUrl: active.baseUrl,
      systemPrompt,
      messages,
      signal,
    });
    return {
      ...reply,
      fallbackNote: null,
    };
  } catch (primaryErr) {
    if (primaryErr?.code === 'aborted') throw primaryErr;

    const shouldFallback = allowFallback && (
      primaryErr?.status === 429 ||
      primaryErr?.status === 401 ||
      primaryErr?.status === 403 ||
      primaryErr?.status === 502 ||
      primaryErr?.status === 503 ||
      primaryErr?.code === 'rate_limited' ||
      primaryErr?.code === 'auth_required'
    );

    if (!shouldFallback) throw primaryErr;

    const kiloModel = (aiSettings.kiloModel || AI_PROVIDERS.kilo.defaultModel).trim();
    const kiloKey = (aiSettings.kiloApiKey || '').trim();
    const fallbackReply = await callSingleGateway({
      providerId: 'kilo',
      model: kiloModel,
      apiKey: kiloKey,
      customBaseUrl: '',
      systemPrompt,
      messages,
      signal,
    });
    const codeTag = primaryErr?.status ? `OpenCode ${primaryErr.status}` : 'OpenCode';
    return {
      ...fallbackReply,
      fallbackNote: codeTag,
    };
  }
}

/**
 * Quick live ping test for the Settings screen ("Проверить связь").
 */
export async function testGatewayConnection(aiSettings = {}) {
  const started = Date.now();
  const res = await sendAiChat({
    messages: [{ role: 'user', content: 'Reply with OK in one word.' }],
    aiSettings,
    systemPrompt: 'You are a concise healthcheck assistant. Reply with OK.',
  });
  return {
    ok: true,
    latencyMs: Math.max(1, Date.now() - started),
    provider: res.provider,
    model: res.model,
    fallbackNote: res.fallbackNote,
  };
}
