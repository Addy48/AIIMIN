const KIMI_MODEL = 'moonshotai/kimi-k2.6';
const NVIDIA_COMPLETIONS_URL = 'https://integrate.api.nvidia.com/v1/chat/completions';

const trimString = (value, maxLength) => (
    typeof value === 'string' ? value.trim().slice(0, maxLength) : ''
);

export function extractJsonObject(rawText) {
    if (!rawText || typeof rawText !== 'string') return null;

    const cleaned = rawText
        .replace(/```json/gi, '')
        .replace(/```/g, '')
        .trim();

    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) return null;

    try {
        return JSON.parse(cleaned.slice(firstBrace, lastBrace + 1));
    } catch (_) {
        return null;
    }
}

export function normalizeAtsAnalysis(value) {
    const source = value && typeof value === 'object' ? value : {};

    const missingSkills = Array.isArray(source.missingSkills)
        ? source.missingSkills
            .filter((item) => item && typeof item === 'object')
            .map((item) => ({
                skill: trimString(item.skill, 80),
                reason: trimString(item.reason, 280),
            }))
            .filter((item) => item.skill && item.reason)
            .slice(0, 5)
        : [];

    const bulletPoints = Array.isArray(source.bulletPoints)
        ? source.bulletPoints
            .map((item) => trimString(item, 260))
            .filter(Boolean)
            .slice(0, 5)
        : [];

    return {
        missingSkills,
        bulletPoints,
        overallFeedback: trimString(source.overallFeedback, 500),
    };
}

export function buildFallbackAnalysis(sortedMissing = [], matchScore = 0, isGuest = false) {
    const topMissing = sortedMissing.filter(Boolean).slice(0, 5);
    const missingSkills = topMissing.map((skill) => ({
        skill,
        reason: `"${skill}" appears in the job description but is not clearly represented in the resume. Add a truthful project, responsibility, or tool reference with measurable impact.`,
    }));

    while (missingSkills.length < 5) {
        missingSkills.push({
            skill: 'Role-specific evidence',
            reason: 'The resume needs more direct evidence tied to the target role. Add concrete outcomes, tools, scale, and business impact where accurate.',
        });
    }

    const primary = topMissing[0] || 'core platform work';
    const secondary = topMissing[1] || 'cross-functional delivery';
    const tertiary = topMissing[2] || 'production reliability';
    const quaternary = topMissing[3] || 'data-informed decisions';

    return {
        missingSkills,
        bulletPoints: [
            isGuest
                ? 'Sign in to unlock AI-powered resume bullet suggestions tailored to this exact job description.'
                : `Delivered ${primary} improvements by translating requirements into measurable production outcomes across reliability, speed, or user impact.`,
            `Built and maintained ${secondary} workflows, reducing manual effort and improving stakeholder visibility through clear metrics.`,
            `Improved ${tertiary} by identifying failure points, implementing fixes, and validating results with repeatable checks.`,
            `Used ${quaternary} to prioritize work, measure progress, and communicate tradeoffs to technical and non-technical partners.`,
            'Rewrote experience bullets with action verbs, specific tools, quantified outcomes, and keywords naturally aligned to the job description.',
        ],
        overallFeedback: `Your resume matches about ${matchScore}% of the extracted job-description keywords. Focus on adding truthful, specific evidence for the missing terms instead of keyword stuffing.`,
    };
}

function buildPrompt({ jdText, resumeText, sortedMissing }) {
    return `You are an expert ATS consultant and resume coach for production-grade professional resumes. Analyze the job description and resume, then give targeted, truthful advice.

JOB DESCRIPTION:
${jdText.slice(0, 3000)}

RESUME:
${resumeText.slice(0, 3000)}

TOP MISSING KEYWORDS: ${sortedMissing.slice(0, 12).join(', ')}

Respond ONLY with valid JSON in exactly this shape:
{
  "missingSkills": [
    { "skill": "skill name", "reason": "Why this matters and how to add it truthfully. 2 sentences max." }
  ],
  "bulletPoints": [
    "Tailored resume bullet ready to adapt, using an action verb and measurable impact placeholder only where the resume lacks a metric."
  ],
  "overallFeedback": "2-3 sentence overall assessment"
}

Provide exactly 5 missingSkills and 5 bulletPoints. Do not include markdown fences. Do not invent employers, credentials, degrees, certifications, or fake metrics.`;
}

export async function generateKimiAtsAnalysis({
    jdText,
    resumeText,
    sortedMissing,
    matchScore,
    isGuest = false,
    fetchImpl = fetch,
    apiKey = process.env.NVIDIA_API_KEY,
}) {
    if (isGuest) {
        return {
            aiAnalysis: buildFallbackAnalysis(sortedMissing, matchScore, true),
            aiStatus: 'guest_demo',
        };
    }

    if (!apiKey) {
        return {
            aiAnalysis: buildFallbackAnalysis(sortedMissing, matchScore, false),
            aiStatus: 'missing_key',
        };
    }

    try {
        const response = await fetchImpl(NVIDIA_COMPLETIONS_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                model: KIMI_MODEL,
                messages: [{ role: 'user', content: buildPrompt({ jdText, resumeText, sortedMissing }) }],
                max_tokens: 4096,
                temperature: 0.35,
                top_p: 0.9,
                stream: false,
                chat_template_kwargs: { thinking: true },
            }),
            signal: AbortSignal.timeout(30_000),
        });

        if (response.status === 401 || response.status === 403) {
            return {
                aiAnalysis: buildFallbackAnalysis(sortedMissing, matchScore, false),
                aiStatus: 'unauthorized',
            };
        }

        if (response.status === 429) {
            return {
                aiAnalysis: buildFallbackAnalysis(sortedMissing, matchScore, false),
                aiStatus: 'limit_reached',
            };
        }

        if (!response.ok) {
            return {
                aiAnalysis: buildFallbackAnalysis(sortedMissing, matchScore, false),
                aiStatus: 'provider_error',
            };
        }

        const payload = await response.json();
        const rawText = payload.choices?.[0]?.message?.content;
        const parsed = extractJsonObject(rawText);
        const normalized = normalizeAtsAnalysis(parsed);

        if (
            normalized.missingSkills.length === 0 ||
            normalized.bulletPoints.length === 0 ||
            !normalized.overallFeedback
        ) {
            return {
                aiAnalysis: buildFallbackAnalysis(sortedMissing, matchScore, false),
                aiStatus: 'invalid_response',
            };
        }

        return {
            aiAnalysis: normalized,
            aiStatus: 'success',
        };
    } catch (err) {
        const status = err?.name === 'TimeoutError' || err?.name === 'AbortError'
            ? 'timeout'
            : 'provider_error';
        return {
            aiAnalysis: buildFallbackAnalysis(sortedMissing, matchScore, false),
            aiStatus: status,
        };
    }
}
