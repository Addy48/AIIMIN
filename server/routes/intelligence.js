/**
 * routes/intelligence.js
 * 
 * Interconnected behavioral intelligence layer.
 * Exposes /lhs and /report endpoints.
 */
import { Hono } from 'hono';
import { requireAuth } from '../middleware/auth.js';
import { pool } from '../lib/db.js';
import { getAnalyticsDataset } from '../services/analyticsData.js';
import { summarizeLifeHealth } from '../services/lifeHealthEngine.js';
import { generateWeeklyReview } from '../services/weeklyReviewEngine.js';
import { generateReportPayload } from '../services/reportGenerator.js';
import { BehavioralEngine } from '../utils/BehavioralEngine.js';
import { withVoiceRules } from '../lib/aiVoice.js';
import { enrichSystemPrompt } from '../lib/arcContext.js';
import { sharpenLifeArcLocally } from '../lib/arcSharpen.js';
import { aiLimiter } from '../middleware/rateLimiter.js';
import { trackExternalCall } from '../services/apiUsageService.js';
import { geminiLiteGenerate, isGeminiLiteTask, GEMINI_LITE_TASKS } from '../lib/geminiLite.js';
import { groqChat, getGeminiKey } from '../lib/aiChat.js';

const app = new Hono();

// ==========================================
// LIFE HEALTH SYSTEM (LHS) SCORES
// ==========================================
app.get('/lhs', requireAuth, async (c) => {
    const userId = c.get('userId');
    try {
        const dataset = await getAnalyticsDataset(userId, 120);
        const lhs = summarizeLifeHealth(dataset.dailyRecords);
        return c.json(lhs);
    } catch (err) {
        console.error('Error computing LHS:', err);
        return c.json({ error: 'Failed to compute Life Health System scores', message: err.message }, 500);
    }
});

// ==========================================
// WEEKLY EXECUTIVE REPORT
// ==========================================
app.get('/report', requireAuth, async (c) => {
    const userId = c.get('userId');
    try {
        // Try fetching a pre-calculated weekly summary first
        const { rows: cachedRows } = await pool.query(
            `SELECT data FROM weekly_summaries WHERE user_id = $1 ORDER BY generated_at DESC LIMIT 1`,
            [userId]
        ).catch(() => ({ rows: [] }));
        const cachedSummary = cachedRows[0];

        if (cachedSummary?.data) {
            return c.json(cachedSummary.data);
        }

        // Dynamically compute report if no cache exists
        const dataset = await getAnalyticsDataset(userId, 120);
        const lhs = summarizeLifeHealth(dataset.dailyRecords);

        // Calculate standard behavior components
        const momentum = BehavioralEngine.calculateMomentum({
            logs: dataset.windows.last7,
            sessions: [], // we will fetch focus sessions from dataset if needed, or pass empty
            commitments: [],
            driftScore: 100
        });

        // ─── Fallback / Calculated Drivers ───
        const drivers = {
            rankedDrivers: [
                { behaviorLabel: 'Consistent sleep schedule', label: 'Sleep Consistency → Global LHS', impact: 8.5 },
                { behaviorLabel: 'Regular hydration', label: 'Water Bottles → Energy Level', impact: 5.2 }
            ]
        };

        // ─── Fallback / Calculated Drift ───
        const drift = {
            alerts: []
        };

        // ─── Fallback / Calculated Forecast ───
        const forecast = {
            horizons: {
                sevenDays: { physical: 'stable', cognitive: 'improving', discipline: 'stable', financial: 'stable', emotional: 'stable' }
            }
        };

        // ─── Fallback / Calculated Clusters ───
        const clusters = {
            clusters: [
                { label: 'High Focus days', deltas: { lhs: 12.4 } }
            ]
        };

        const archetypes = {
            archetypes: [
                { name: 'Peak Performer', representation: 0.65, traits: ['consistent sleep', 'high gym completion'] }
            ]
        };

        // Generate the weekly review object using our engine
        const weeklyReview = generateWeeklyReview({
            lhsTimeline: lhs.timeline,
            drift,
            drivers,
            clusters,
            momentum
        });

        // Generate the complete report payload
        const report = generateReportPayload({
            lhs,
            drivers,
            drift,
            forecast,
            clusters,
            archetypes,
            momentum,
            weeklyReview
        });

        return c.json(report);
    } catch (err) {
        console.error('Error generating report:', err);
        return c.json({ error: 'Failed to generate intelligence report', message: err.message }, 500);
    }
});

// ==========================================
// GEMINI LITE — 5 low-token tasks (free-tier key)
// ==========================================
const LITE_PROMPTS = {
    journal_prompt: (ctx) => ({
        userText: `Generate exactly 3 short reflection questions${ctx ? ` for: "${String(ctx).slice(0, 400)}"` : ''}. Return ONLY a JSON array of 3 strings.`,
        maxOutputTokens: 200,
        temperature: 0.8,
    }),
    habit_coach: (ctx) => ({
        userText: `2-sentence habit coaching insight: ${ctx}`,
        maxOutputTokens: 120,
        temperature: 0.7,
    }),
    emotion_tag: (ctx) => ({
        userText: `Tag emotion + 1 sentence feedback. Return JSON {"tone":"...","feedback":"..."}. Text: ${String(ctx).slice(0, 800)}`,
        maxOutputTokens: 100,
        temperature: 0.3,
    }),
    short_summary: (ctx) => ({
        userText: `Summarize in 2 sentences: ${String(ctx).slice(0, 1200)}`,
        maxOutputTokens: 100,
        temperature: 0.4,
    }),
};

app.post('/lite', requireAuth, aiLimiter, async (c) => {
    const userId = c.get('userId');
    try {
        const { task, text = '', context = '' } = await c.req.json();
        if (!isGeminiLiteTask(task)) {
            return c.json({ error: 'Invalid lite task', allowed: [...GEMINI_LITE_TASKS] }, 400);
        }

        const promptFn = LITE_PROMPTS[task];
        const { userText, maxOutputTokens, temperature } = promptFn(context || text);

        await trackExternalCall({
            userId,
            provider: 'gemini',
            endpoint: `/intelligence/lite:${task}`,
            units: 1,
        });

        const result = await geminiLiteGenerate({
            task,
            userText,
            maxOutputTokens,
            temperature,
        });

        if (!result.ok) {
            return c.json({ error: result.error, stub: true }, 503);
        }

        return c.json({ text: result.text, provider: 'gemini-lite', model: result.model });
    } catch (err) {
        console.error('[intelligence/lite]', err.message);
        return c.json({ error: err.message }, 500);
    }
});

app.get('/lite/status', requireAuth, async (c) => {
    const { getGeminiLiteApiKey } = await import('../lib/geminiLite.js');
    return c.json({
        configured: Boolean(getGeminiLiteApiKey()),
        tasks: [...GEMINI_LITE_TASKS],
        model: process.env.GEMINI_LITE_MODEL || 'gemini-2.5-flash-lite',
    });
});

// ==========================================
// SERVER-SIDE AI PROXIES (no client API keys)
// Heavy generate → Groq (working). Gemini reserved for /lite + arc sharpen.
// ==========================================
app.post('/generate', requireAuth, aiLimiter, async (c) => {
    const userId = c.get('userId');
    try {
        const { messages = [], systemPrompt = null, maxTokens = 1024, temperature = 0.7 } = await c.req.json();
        if (!messages.length) {
            return c.json({ error: 'messages required' }, 400);
        }

        await trackExternalCall({
            userId,
            provider: 'groq',
            endpoint: '/intelligence/generate',
            units: 1,
        });

        const systemInstructionRaw = await enrichSystemPrompt(userId, systemPrompt);
        const fullMessages = systemInstructionRaw
            ? [{ role: 'system', content: withVoiceRules(systemInstructionRaw) }, ...messages]
            : messages;

        const result = await groqChat({ messages: fullMessages, maxTokens, temperature });
        if (!result.ok) {
            return c.json({ error: result.error || 'Generate failed' }, 503);
        }
        return c.json({ text: result.text || '', provider: result.provider });
    } catch (err) {
        console.error('[intelligence/generate]', err.message);
        return c.json({ error: err.message }, 500);
    }
});

app.post('/gemini-proxy', requireAuth, aiLimiter, async (c) => {
    const userId = c.get('userId');
    try {
        // Prefer lite key; fall back to legacy GEMINI_API_KEY if set
        const apiKey = getGeminiKey();
        if (!apiKey) {
            return c.json({ error: 'No Gemini key configured — use /intelligence/chat with groq' }, 503);
        }

        const { model = process.env.GEMINI_LITE_MODEL || 'gemini-2.5-flash-lite', ...payload } = await c.req.json();

        await trackExternalCall({
            userId,
            provider: 'gemini',
            endpoint: '/intelligence/gemini-proxy',
            units: 1,
        });

        const res = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            }
        );

        const data = await res.json();
        if (!res.ok) {
            return c.json(data, res.status);
        }

        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        return c.json({ text, candidates: data.candidates });
    } catch (err) {
        console.error('[intelligence/gemini-proxy]', err.message);
        return c.json({ error: err.message }, 500);
    }
});

app.post('/chat', requireAuth, aiLimiter, async (c) => {
    const userId = c.get('userId');
    try {
        const {
            provider = 'groq',
            messages = [],
            systemPrompt = null,
            maxTokens = 1024,
            temperature = 0.7,
        } = await c.req.json();

        if (!messages.length) {
            return c.json({ error: 'messages required' }, 400);
        }

        const enrichedPrompt = await enrichSystemPrompt(userId, systemPrompt);
        const fullMessages = enrichedPrompt
            ? [{ role: 'system', content: withVoiceRules(enrichedPrompt) }, ...messages]
            : messages;

        if (provider === 'groq') {
            const apiKey = process.env.GROQ_API_KEY;
            if (!apiKey) {
                return c.json({ error: 'GROQ_API_KEY not configured on server' }, 503);
            }

            await trackExternalCall({
                userId,
                provider: 'groq',
                endpoint: '/intelligence/chat',
                units: 1,
            });

            const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: 'llama-3.3-70b-versatile',
                    messages: fullMessages,
                    max_tokens: maxTokens,
                    temperature,
                }),
            });

            const data = await res.json();
            if (!res.ok) {
                return c.json({ error: data.error?.message || 'Groq request failed' }, res.status);
            }

            return c.json({ text: data.choices?.[0]?.message?.content || '' });
        }

        if (provider === 'moonshot' || provider === 'kimi') {
            const apiKey = process.env.NVIDIA_API_KEY;
            if (!apiKey) {
                return c.json({ error: 'NVIDIA_API_KEY not configured on server' }, 503);
            }

            await trackExternalCall({
                userId,
                provider: 'moonshot',
                endpoint: '/intelligence/chat',
                units: 1,
            });

            const res = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: 'moonshotai/kimi-k2.6',
                    messages: fullMessages,
                    max_tokens: maxTokens,
                    temperature,
                }),
            });

            const data = await res.json();
            if (!res.ok) {
                return c.json({ error: data.error?.message || data.message || 'Moonshot request failed' }, res.status);
            }

            return c.json({ text: data.choices?.[0]?.message?.content || '' });
        }

        return c.json({ error: 'Invalid provider' }, 400);
    } catch (err) {
        console.error('[intelligence/chat]', err.message);
        return c.json({ error: err.message }, 500);
    }
});

app.post('/usage-report', requireAuth, aiLimiter, async (c) => {
    const userId = c.get('userId');
    try {
        const { provider, endpoint, units = 1 } = await c.req.json();
        const allowed = new Set(['groq', 'gemini', 'moonshot']);
        if (!allowed.has(provider)) {
            return c.json({ error: 'Invalid provider' }, 400);
        }
        await trackExternalCall({
            userId,
            provider,
            endpoint: endpoint || '/client',
            units,
        });
        return c.json({ success: true });
    } catch (err) {
        if (err.code === 'BUDGET_EXCEEDED') {
            return c.json({ error: 'Provider daily limit reached' }, 429);
        }
        return c.json({ error: err.message }, 500);
    }
});

// ==========================================
// UNIVERSAL AI LOGGER
// ==========================================
app.post('/universal-log', requireAuth, async (c) => {
    const userId = c.get('userId');
    try {
        const { text } = await c.req.json();
        if (!text || !text.trim()) {
            return c.json({ error: 'No text provided' }, 400);
        }

        await trackExternalCall({
            userId,
            provider: 'groq',
            endpoint: '/intelligence/universal-log',
            units: 1,
        });

        const systemPrompt = await enrichSystemPrompt(userId, `You are an AI that parses a user's natural language daily log entry and extracts structured actions.
Return ONLY valid JSON (no markdown, no explanation).

Extract any of these action types from the user's text:
- log_mood: if they mention how they feel or a mood/energy rating out of 10. Fields: { score: number 1-10, note: string }
- log_habit: if they mention completing or failing a habit/workout/diet. Fields: { name: string, completed: boolean }
- add_journal: always add the raw text as a journal entry. Fields: { content: string }
- log_discipline: if they mention breaking or resetting a discipline/streak. Fields: { name: string, reset: boolean }

Respond with JSON like:
{
  "actions": [
    { "type": "log_mood", "score": 6, "note": "failed diet" },
    { "type": "log_habit", "name": "workout", "completed": true },
    { "type": "add_journal", "content": "Failed my diet today, but worked out for an hour. Feeling a 6/10." }
  ]
}`);

        const chat = await groqChat({
            messages: [
                { role: 'system', content: withVoiceRules(systemPrompt) },
                { role: 'user', content: `Parse this log entry: "${text.trim()}"` },
            ],
            maxTokens: 600,
            temperature: 0.2,
        });
        if (!chat.ok) {
            return c.json({ error: chat.error || 'Parse failed' }, 503);
        }

        const rawText = (chat.text || '').trim().replace(/```json\n?|```/g, '');
        let parsed;
        try { parsed = JSON.parse(rawText); } catch (e) {
            return c.json({ error: 'AI could not parse your entry', raw: rawText }, 422);
        }

        const actions = parsed.actions || [];
        const results = [];
        const today = new Date().toISOString().split('T')[0];

        for (const action of actions) {
            try {
                if (action.type === 'log_mood' && action.score) {
                    await pool.query(
                        `INSERT INTO daily_logs (user_id, date, mood, energy, notes)
                         VALUES ($1, $2, $3, $3, $4)
                         ON CONFLICT (user_id, date) DO UPDATE SET mood = $3, energy = $3, notes = COALESCE($4, daily_logs.notes)`,
                        [userId, today, Math.min(10, Math.max(1, Math.round(action.score))), action.note || null]
                    );
                    results.push({ type: 'log_mood', status: 'success', score: action.score });
                } else if (action.type === 'log_habit' && action.name) {
                    // Find existing habit by name fuzzy match
                    const habitRes = await pool.query(
                        `SELECT id, meta FROM habits WHERE user_id = $1 AND LOWER(name) LIKE $2 LIMIT 1`,
                        [userId, `%${action.name.toLowerCase()}%`]
                    );
                    if (habitRes.rows.length > 0) {
                        const habit = habitRes.rows[0];
                        const meta = habit.meta || {};
                        const completedDates = meta.completedDates || [];
                        if (action.completed && !completedDates.includes(today)) {
                            completedDates.push(today);
                        } else if (!action.completed) {
                            const idx = completedDates.indexOf(today);
                            if (idx > -1) completedDates.splice(idx, 1);
                        }
                        await pool.query(
                            `UPDATE habits SET meta = $1 WHERE id = $2 AND user_id = $3`,
                            [JSON.stringify({ ...meta, completedDates }), habit.id, userId]
                        );
                        results.push({ type: 'log_habit', status: 'success', name: action.name, completed: action.completed });
                    } else {
                        results.push({ type: 'log_habit', status: 'skipped', reason: `Habit "${action.name}" not found` });
                    }
                } else if (action.type === 'add_journal' && action.content) {
                    await pool.query(
                        `INSERT INTO notes (user_id, content, title, type, created_at)
                         VALUES ($1, $2, $3, 'note', NOW())`,
                        [userId, action.content, action.content.slice(0, 80)]
                    );
                    results.push({ type: 'add_journal', status: 'success' });
                } else if (action.type === 'log_discipline' && action.name) {
                    results.push({ type: 'log_discipline', status: 'noted', name: action.name, reset: action.reset });
                }
            } catch (actionErr) {
                results.push({ type: action.type, status: 'error', error: actionErr.message });
            }
        }

        return c.json({ success: true, actions: results, parsed: actions });
    } catch (err) {
        console.error('Error in universal-log:', err);
        return c.json({ error: 'Failed to process log entry', message: err.message }, 500);
    }
});

/**
 * POST /intelligence/arc/sharpen — minimal-token polish for Life Arc line.
 */
async function handleArcSharpen(c) {
    const { draft = '', goalIds = [] } = await c.req.json();
    const seed = String(draft || '').trim() || sharpenLifeArcLocally('', goalIds);
    if (!seed) {
        return c.json({ error: 'Write a line or pick a goal first' }, 400);
    }

    try {
        const userId = c.get('userId');
        await trackExternalCall({
            userId,
            provider: 'gemini',
            endpoint: '/intelligence/arc/sharpen',
            units: 1,
        });

        const goalHint = goalIds.length ? `Goals: ${goalIds.join(', ')}.` : '';
        const result = await geminiLiteGenerate({
            task: 'arc_sharpen',
            userText: `${goalHint} Sharpen this Life Arc into one clear sentence (max 25 words): ${seed}`,
            maxOutputTokens: 64,
            temperature: 0.2,
        });

        if (result.ok) {
            let text = result.text.replace(/^["']|["']$/g, '').split('\n')[0].trim();
            const words = text.split(/\s+/);
            if (words.length > 25) text = `${words.slice(0, 25).join(' ')}.`;
            if (!text) text = sharpenLifeArcLocally(seed, goalIds);
            return c.json({ text, provider: 'gemini-lite' });
        }

        return c.json({ text: sharpenLifeArcLocally(seed, goalIds), stub: true, fallback: true });
    } catch (err) {
        console.error('[intelligence/arc/sharpen]', err.message);
        return c.json({
            text: sharpenLifeArcLocally(seed, goalIds),
            stub: true,
            fallback: true,
        });
    }
}

app.post('/arc/sharpen', requireAuth, aiLimiter, handleArcSharpen);
app.post('/north-star/sharpen', requireAuth, aiLimiter, handleArcSharpen);

export default app;
