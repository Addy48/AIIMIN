/**
 * Shared chat helpers.
 * - Lite (low tokens): Gemini → OpenRouter free (available models) → Groq last resort
 * - Heavy: Groq primary; OpenRouter only as weak last-ditch (free models are limited)
 */

import { getOrderedGroqKeys, recordKeyFailure, recordKeySuccess, maskKey } from './groqRotator.js';

export function getGeminiKey() {
  return (
    process.env.GEMINI_LITE_API_KEY
    || process.env.GEMINI_API_KEY
    || ''
  ).replace(/^"|"$/g, '').trim() || null;
}

export function getGroqKey() {
  const keys = getOrderedGroqKeys();
  return keys[0] || null;
}


export function getOpenRouterKey() {
  return (process.env.OPENROUTER_API_KEY || '').replace(/^"|"$/g, '').trim() || null;
}

export function getNvidiaKey() {
  return (
    process.env.NVIDIA_API_KEY
    || process.env.KIMI_API_KEY
    || ''
  ).replace(/^"|"$/g, '').trim() || null;
}

/** Prefer available free models; override via env CSV. */
export function getOpenRouterLiteModels() {
  const raw = process.env.OPENROUTER_LITE_MODELS
    || process.env.OPENROUTER_LITE_MODEL
    || process.env.OPENROUTER_MODEL
    || '';
  const configured = raw.split(',').map((s) => s.trim()).filter(Boolean);
  return [...new Set([...configured, 'nex-agi/nex-n2.5-mini:free', 'nvidia/nemotron-3.5-lightning:free'])];
}

/** Heavy OpenRouter tries (usually rate-limited). Keep off critical path. */
export function getOpenRouterHeavyModels() {
  const raw = process.env.OPENROUTER_HEAVY_MODELS
    || process.env.OPENROUTER_HEAVY_MODEL
    || '';
  const configured = raw.split(',').map((s) => s.trim()).filter(Boolean);
  return [...new Set([...configured, 'nex-agi/nex-n2.5-mini:free', 'nvidia/nemotron-3.5-lightning:free'])];
}

function extractChatText(data) {
  const msg = data?.choices?.[0]?.message || {};
  let content = (msg.content || '').trim();
  if (content) {
    if (content.includes('</think>')) {
      content = content.split('</think>').pop().trim();
    }
    return content;
  }
  // Some free models dump answer into reasoning when max_tokens too low
  const reasoning = (msg.reasoning || '').trim();
  if (!reasoning) return '';
  const lines = reasoning.split('\n').map((l) => l.trim()).filter(Boolean);
  const last = lines[lines.length - 1] || '';
  if (last.length > 8 && last.length < 400 && !/^okay[,.]?\s/i.test(last)) {
    return last.replace(/^["']|["']$/g, '');
  }
  return '';
}

/**
 * Heavy text generation via Groq with automatic model fallback.
 * @returns {{ ok: boolean, text?: string, error?: string, provider: string, model?: string }}
 */
export async function groqChat({
  messages,
  maxTokens = 512,
  temperature = 0.7,
  model = null,
}) {
  const candidateKeys = getOrderedGroqKeys();
  if (candidateKeys.length === 0) return { ok: false, error: 'GROQ_API_KEY missing', provider: 'groq' };

  const preferredModel = (model || process.env.GROQ_MODEL || 'qwen/qwen3.8-27b').trim();
  const modelsToTry = [preferredModel, 'qwen/qwen3.8-27b', 'groq/compound-mini'];
  const uniqueModels = [...new Set(modelsToTry.filter(Boolean))];

  let lastError = 'Groq failed';

  for (const apiKey of candidateKeys) {
    let keyRateLimited = false;

    for (const m of uniqueModels) {
      try {
        const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: m,
            messages,
            max_tokens: maxTokens,
            temperature,
          }),
        });

        const data = await res.json().catch(() => ({}));

        if (res.status === 429 || res.status === 401 || res.status === 403) {
          lastError = data.error?.message || `Groq HTTP ${res.status} (${maskKey(apiKey)})`;
          recordKeyFailure(apiKey, res.status);
          keyRateLimited = true;
          break; // Immediately try next rotated key in pool
        }

        if (!res.ok) {
          lastError = data.error?.message || `Groq HTTP ${res.status} (${m})`;
          console.warn(`[groqChat] model ${m} failed (${res.status}):`, lastError);
          continue; // Try next model on same key (e.g. if 404)
        }

        const text = data.choices?.[0]?.message?.content || '';
        recordKeySuccess(apiKey);
        return {
          ok: true,
          text,
          provider: 'groq',
          model: m,
        };
      } catch (err) {
        lastError = err.message || String(err);
        console.warn(`[groqChat] model ${m} exception:`, lastError);
      }
    }

    if (keyRateLimited) {
      continue;
    }
  }

  return {
    ok: false,
    error: lastError,
    provider: 'groq',
  };
}

/**
 * OpenRouter chat with model failover list.
 * Free reasoning models need enough max_tokens + low reasoning effort or content is empty.
 */
export async function openRouterChat({
  messages,
  maxTokens = 512,
  temperature = 0.7,
  models = null,
  model = null,
  reasoningEffort = 'minimal',
  purpose = 'general',
}) {
  const apiKey = getOpenRouterKey();
  if (!apiKey) return { ok: false, error: 'OPENROUTER_API_KEY missing', provider: 'openrouter' };

  const list = models
    || (model ? [model] : null)
    || (purpose === 'lite' ? getOpenRouterLiteModels() : getOpenRouterHeavyModels());

  // Reasoning models burn budget on CoT — floor so content can appear
  const floor = purpose === 'lite' ? 192 : 256;
  const capped = Math.max(floor, Math.min(maxTokens || floor, purpose === 'lite' ? 384 : maxTokens || 1024));

  let lastError = 'OpenRouter failed';
  for (const m of list) {
    try {
      const body = {
        model: m,
        messages,
        max_tokens: capped,
        temperature,
      };
      if (reasoningEffort) {
        body.reasoning = { effort: reasoningEffort };
      }

      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.OPENROUTER_HTTP_REFERER || 'https://aiimin.in',
          'X-Title': process.env.OPENROUTER_APP_TITLE || 'AIIMIN',
        },
        body: JSON.stringify(body),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        lastError = data.error?.message || `OpenRouter HTTP ${res.status} (${m})`;
        console.warn('[openRouterChat]', m, res.status, lastError.slice(0, 120));
        continue;
      }

      const text = extractChatText(data);
      if (!text) {
        lastError = `OpenRouter empty content (${m})`;
        console.warn('[openRouterChat]', lastError);
        continue;
      }

      return {
        ok: true,
        text,
        provider: 'openrouter',
        model: m,
      };
    } catch (err) {
      lastError = err.message || String(err);
      console.warn('[openRouterChat]', m, lastError);
    }
  }

  return { ok: false, error: lastError, provider: 'openrouter' };
}

/**
 * Low-token tasks: OpenRouter free (available) primary when Gemini already failed upstream.
 * Caps tokens. Groq last resort with same small budget so free-key pool stays for heavy.
 */
export async function liteChat(opts) {
  const maxTokens = Math.min(opts.maxTokens ?? 256, 384);
  const messages = opts.messages || [];

  const or = await openRouterChat({
    ...opts,
    messages,
    maxTokens,
    purpose: 'lite',
    reasoningEffort: 'minimal',
  });
  if (or.ok && or.text) return or;

  // Tiny Groq rescue — do not steal large heavy budget
  const groq = await groqChat({
    ...opts,
    messages,
    maxTokens: Math.min(maxTokens, 256),
  });
  if (groq.ok && groq.text) return { ...groq, via: 'lite-rescue' };

  return {
    ok: false,
    error: or.error || groq.error || 'Lite providers failed',
    provider: 'lite',
  };
}

/** Groq first for real work. OpenRouter only last-ditch (weak free models). */
export async function heavyChat(opts) {
  const groq = await groqChat(opts);
  if (groq.ok && groq.text) return groq;

  const or = await openRouterChat({
    ...opts,
    purpose: 'heavy',
    reasoningEffort: 'minimal',
    maxTokens: Math.max(opts.maxTokens || 512, 384),
  });
  if (or.ok && or.text) return or;

  return {
    ok: false,
    error: groq.error || or.error || 'All heavy providers failed',
    provider: groq.error && !getOpenRouterKey() ? 'groq' : 'heavy',
  };
}

/** Default: Llama 3.2 11B Vision — active NVIDIA NIM. */
export function getNvidiaChatModel() {
  return (
    process.env.NVIDIA_CHAT_MODEL
    || 'meta/llama-3.2-11b-vision-instruct'
  ).trim();
}

/**
 * Try NVIDIA NIM, then Groq, then OpenRouter.
 */
export async function nvidiaOrGroqChat(opts) {
  const nvidiaKey = getNvidiaKey();
  const configuredModel = opts.nvidiaModel || getNvidiaChatModel();
  const modelsToTry = [configuredModel, 'meta/llama-3.2-11b-vision-instruct'];
  const uniqueModels = [...new Set(modelsToTry.filter(Boolean))];

  if (nvidiaKey) {
    for (const model of uniqueModels) {
      try {
        const res = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${nvidiaKey}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            model,
            messages: opts.messages,
            max_tokens: opts.maxTokens || 512,
            temperature: opts.temperature ?? 0.7,
            top_p: opts.topP ?? 0.7,
            stream: false,
          }),
          signal: AbortSignal.timeout(opts.timeoutMs || 45000),
        });
        if (res.ok) {
          const data = await res.json();
          const text = data.choices?.[0]?.message?.content || '';
          if (text) return { ok: true, text, provider: 'nvidia', model };
        }
        console.warn('[aiChat] NVIDIA failed:', res.status, model);
      } catch (err) {
        console.warn('[aiChat] NVIDIA error:', err.message, model);
      }
    }
  }
  return heavyChat(opts);
}
