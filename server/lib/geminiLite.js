/**
 * Light tasks — Gemini first, then OpenRouter free (available), then tiny Groq.
 * Heavy work stays on Groq via /intelligence/chat + heavyChat.
 */

import { liteChat } from './aiChat.js';

const LITE_MODEL = process.env.GEMINI_LITE_MODEL || 'gemini-2.5-flash-lite';

export const GEMINI_LITE_TASKS = new Set([
  'arc_sharpen',
  'journal_prompt',
  'habit_coach',
  'emotion_tag',
  'short_summary',
]);

export function getGeminiLiteApiKey() {
  return (process.env.GEMINI_LITE_API_KEY || process.env.GEMINI_API_KEY || '')
    .replace(/^"|"$/g, '')
    .trim() || null;
}

export function isGeminiLiteTask(task) {
  return GEMINI_LITE_TASKS.has(task);
}

let _client;
async function getClient() {
  const apiKey = getGeminiLiteApiKey();
  if (!apiKey) return null;
  if (!_client) {
    const { GoogleGenAI } = await import('@google/genai');
    _client = new GoogleGenAI({ apiKey });
  }
  return _client;
}

const LITE_SYSTEM = {
  arc_sharpen: 'Rewrite into one clear sentence, max 25 words. Plain text only. No quotes.',
  journal_prompt: 'Suggest 3 short journal prompts. Plain text, numbered list.',
  habit_coach: 'Give one short actionable habit tip (max 40 words). Plain text only.',
  emotion_tag: 'Reply with one emotion label and a short reason. Plain text only.',
  short_summary: 'Summarize in 1-2 short sentences. Plain text only.',
};

/**
 * @param {{ task: string, userText: string, systemInstruction?: string, maxOutputTokens?: number, temperature?: number }} opts
 */
export async function geminiLiteGenerate(opts) {
  const {
    task,
    userText,
    systemInstruction,
    maxOutputTokens = 128,
    temperature = 0.3,
  } = opts;

  const system = systemInstruction || LITE_SYSTEM[task] || 'Be concise. Plain text only.';

  const genai = await getClient();
  if (genai) {
    try {
      const result = await genai.models.generateContent({
        model: LITE_MODEL,
        contents: [{ role: 'user', parts: [{ text: userText }] }],
        config: {
          systemInstruction: system,
          maxOutputTokens,
          temperature,
        },
      });
      const text = (result.text || '').trim();
      if (text) return { ok: true, text, task, model: LITE_MODEL, provider: 'gemini-lite' };
    } catch (err) {
      console.warn(`[geminiLite:${task}]`, err.message, '→ OpenRouter lite');
    }
  }

  // Gemini dead / quota — use available OpenRouter free models (low tokens)
  const or = await liteChat({
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: userText },
    ],
    maxTokens: Math.min(Math.max(maxOutputTokens || 128, 192), 384),
    temperature,
  });

  if (or.ok && or.text) {
    return {
      ok: true,
      text: or.text.trim(),
      task,
      model: or.model,
      provider: or.provider === 'groq' ? 'groq-lite' : 'openrouter-lite',
    };
  }

  return {
    ok: false,
    error: or.error || 'GEMINI_LITE_API_KEY not configured and OpenRouter lite failed',
    task,
  };
}
