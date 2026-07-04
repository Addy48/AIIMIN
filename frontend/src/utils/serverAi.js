/**
 * Server-side AI proxy helpers — never embed API keys in the client bundle.
 */
import { apiPost } from './api';

export async function generateWithGemini({
  prompt,
  messages,
  systemPrompt = null,
  maxTokens = 1024,
  temperature = 0.7,
}) {
  const payloadMessages = messages || [{ role: 'user', content: prompt }];
  const data = await apiPost('/intelligence/generate', {
    messages: payloadMessages,
    systemPrompt,
    maxTokens,
    temperature,
  });
  return data.text || '';
}

export async function proxyGeminiGenerate({ model = 'gemini-2.0-flash', ...payload }) {
  return apiPost('/intelligence/gemini-proxy', { model, ...payload });
}

export async function chatWithProvider({
  provider = 'groq',
  messages,
  systemPrompt = null,
  maxTokens = 1024,
  temperature = 0.7,
}) {
  const data = await apiPost('/intelligence/chat', {
    provider,
    messages,
    systemPrompt,
    maxTokens,
    temperature,
  });
  return data.text || '';
}
