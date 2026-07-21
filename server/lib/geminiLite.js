/**
 * Gemini Flash — light tasks only (free-tier friendly).
 * Heavy work stays on Groq / NVIDIA via /intelligence/chat.
 */

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

/**
 * @param {{ task: string, userText: string, systemInstruction?: string, maxOutputTokens?: number, temperature?: number }} opts
 */
export async function geminiLiteGenerate(opts) {
  const genai = await getClient();
  if (!genai) {
    return { ok: false, error: 'GEMINI_LITE_API_KEY not configured' };
  }

  const {
    task,
    userText,
    systemInstruction,
    maxOutputTokens = 128,
    temperature = 0.3,
  } = opts;

  try {
    const result = await genai.models.generateContent({
      model: LITE_MODEL,
      contents: [{ role: 'user', parts: [{ text: userText }] }],
      config: {
        systemInstruction: systemInstruction || undefined,
        maxOutputTokens,
        temperature,
      },
    });
    const text = (result.text || '').trim();
    if (!text) return { ok: false, error: 'empty response', task };
    return { ok: true, text, task, model: LITE_MODEL };
  } catch (err) {
    console.error(`[geminiLite:${task}]`, err.message);
    return { ok: false, error: err.message, task };
  }
}
