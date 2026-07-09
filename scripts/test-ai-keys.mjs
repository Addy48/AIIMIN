#!/usr/bin/env node
/**
 * Smoke-test AI provider keys from root .env — prints status only, never keys.
 */
import 'dotenv/config';

const results = [];

async function test(name, fn) {
  try {
    const out = await fn();
    results.push({ name, ok: out.ok, status: out.status, note: out.note || '' });
  } catch (err) {
    results.push({ name, ok: false, status: 0, note: err.message });
  }
}

await test('GEMINI_LITE_API_KEY', async () => {
  const key = (process.env.GEMINI_LITE_API_KEY || process.env.GEMINI_API_KEY)?.replace(/^"|"$/g, '');
  if (!key) return { ok: false, status: 0, note: 'missing' };
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(key)}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: 'Hi' }] }] }),
    },
  );
  const body = await res.json().catch(() => ({}));
  const ok = res.ok && body.candidates?.[0]?.content?.parts?.[0]?.text;
  return { ok: Boolean(ok), status: res.status, note: ok ? 'ok' : (body.error?.message || 'failed').slice(0, 80) };
});

await test('GEMINI_LITE_API_KEY (Bearer)', async () => {
  const key = (process.env.GEMINI_LITE_API_KEY || process.env.GEMINI_API_KEY)?.replace(/^"|"$/g, '');
  if (!key) return { ok: false, status: 0, note: 'missing' };
  const res = await fetch(
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify({ contents: [{ parts: [{ text: 'Hi' }] }] }),
    },
  );
  const body = await res.json().catch(() => ({}));
  const ok = res.ok && body.candidates?.[0]?.content?.parts?.[0]?.text;
  return { ok: Boolean(ok), status: res.status, note: ok ? 'ok' : (body.error?.message || 'failed').slice(0, 80) };
});

await test('GEMINI_API_KEY (legacy)', async () => {
  const key = process.env.GEMINI_API_KEY?.replace(/^"|"$/g, '');
  if (!key) return { ok: false, status: 0, note: 'missing' };
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(key)}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: 'Hi' }] }] }),
    },
  );
  const body = await res.json().catch(() => ({}));
  const ok = res.ok && body.candidates?.[0]?.content?.parts?.[0]?.text;
  return { ok: Boolean(ok), status: res.status, note: ok ? 'ok' : (body.error?.message || 'failed').slice(0, 80) };
});

await test('GEMINI_API_KEY (legacy Bearer)', async () => {
  const key = process.env.GEMINI_API_KEY?.replace(/^"|"$/g, '');
  if (!key) return { ok: false, status: 0, note: 'missing' };
  const res = await fetch(
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify({ contents: [{ parts: [{ text: 'Hi' }] }] }),
    },
  );
  const body = await res.json().catch(() => ({}));
  const ok = res.ok && body.candidates?.[0]?.content?.parts?.[0]?.text;
  return { ok: Boolean(ok), status: res.status, note: ok ? 'ok' : (body.error?.message || 'failed').slice(0, 80) };
});

await test('GROQ_API_KEY', async () => {
  const key = process.env.GROQ_API_KEY?.replace(/^"|"$/g, '');
  if (!key) return { ok: false, status: 0, note: 'missing' };
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: 'Hi' }],
      max_tokens: 5,
    }),
  });
  const body = await res.json().catch(() => ({}));
  const ok = res.ok && body.choices?.[0]?.message?.content;
  return { ok: Boolean(ok), status: res.status, note: ok ? 'ok' : (body.error?.message || 'failed').slice(0, 80) };
});

await test('NVIDIA_API_KEY (KIMI)', async () => {
  const key = (process.env.NVIDIA_API_KEY || process.env.KIMI_API_KEY)?.replace(/^"|"$/g, '');
  if (!key) return { ok: false, status: 0, note: 'missing' };
  const res = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'moonshotai/kimi-k2.6',
      messages: [{ role: 'user', content: 'Hi' }],
      max_tokens: 5,
    }),
  });
  const body = await res.json().catch(() => ({}));
  const ok = res.ok && body.choices?.[0]?.message?.content;
  return { ok: Boolean(ok), status: res.status, note: ok ? 'ok' : (body.error?.message || 'failed').slice(0, 80) };
});

await test('XAI_API_KEY', async () => {
  const key = process.env.XAI_API_KEY?.replace(/^"|"$/g, '');
  if (!key) return { ok: false, status: 0, note: 'missing' };
  const res = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'grok-3-mini',
      messages: [{ role: 'user', content: 'Hi' }],
      max_tokens: 5,
    }),
  });
  const body = await res.json().catch(() => ({}));
  const ok = res.ok && body.choices?.[0]?.message?.content;
  return { ok: Boolean(ok), status: res.status, note: ok ? 'ok' : (body.error?.message || 'failed').slice(0, 80) };
});

console.log(JSON.stringify(results, null, 2));
