/**
 * Shared chat helpers — prefer working providers (Groq first for heavy work).
 */

export function getGeminiKey() {
  return (
    process.env.GEMINI_LITE_API_KEY
    || process.env.GEMINI_API_KEY
    || ''
  ).replace(/^"|"$/g, '').trim() || null;
}

export function getGroqKey() {
  return (process.env.GROQ_API_KEY || '').replace(/^"|"$/g, '').trim() || null;
}

export function getNvidiaKey() {
  return (
    process.env.NVIDIA_API_KEY
    || process.env.KIMI_API_KEY
    || ''
  ).replace(/^"|"$/g, '').trim() || null;
}

/**
 * Heavy text generation via Groq (working free tier).
 * @returns {{ ok: boolean, text?: string, error?: string, provider: string }}
 */
export async function groqChat({
  messages,
  maxTokens = 512,
  temperature = 0.7,
  model = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
}) {
  const apiKey = getGroqKey();
  if (!apiKey) return { ok: false, error: 'GROQ_API_KEY missing', provider: 'groq' };

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages,
      max_tokens: maxTokens,
      temperature,
    }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return {
      ok: false,
      error: data.error?.message || `Groq HTTP ${res.status}`,
      provider: 'groq',
    };
  }

  return {
    ok: true,
    text: data.choices?.[0]?.message?.content || '',
    provider: 'groq',
    model,
  };
}

/** Default: Nemotron Nano — free NIM, fast. Llama 3.3-70B often cold-starts / times out. */
export function getNvidiaChatModel() {
  return (
    process.env.NVIDIA_CHAT_MODEL
    || 'nvidia/nemotron-3-nano-30b-a3b'
  ).trim();
}

/**
 * Try NVIDIA NIM, then Groq.
 */
export async function nvidiaOrGroqChat(opts) {
  const nvidiaKey = getNvidiaKey();
  const model = opts.nvidiaModel || getNvidiaChatModel();
  if (nvidiaKey) {
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
  return groqChat(opts);
}
