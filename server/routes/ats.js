/**
 * server/routes/ats.js
 * ATS Resume Analyzer — keyword matching + Gemini-powered gap analysis
 */
import { Hono } from 'hono';

const atsRoutes = new Hono();

// Common English stopwords for filtering
const STOPWORDS = new Set([
    'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been',
    'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
    'could', 'should', 'may', 'might', 'shall', 'can', 'not', 'no', 'nor',
    'as', 'if', 'then', 'than', 'so', 'that', 'this', 'these', 'those',
    'it', 'its', 'we', 'you', 'he', 'she', 'they', 'them', 'their', 'our',
    'your', 'my', 'his', 'her', 'who', 'which', 'what', 'when', 'where',
    'why', 'how', 'all', 'each', 'every', 'both', 'few', 'more', 'most',
    'other', 'such', 'into', 'through', 'during', 'before', 'after',
    'above', 'below', 'up', 'down', 'out', 'off', 'over', 'under', 'again',
    'further', 'once', 'here', 'there', 'while', 'about', 'against',
    'between', 'must', 'just', 'also', 'well', 'very', 'any', 'only',
    'own', 'same', 'too', 'now', 'etc', 'within', 'without', 'across',
    'position', 'role', 'candidate', 'team', 'work', 'working', 'good',
    'strong', 'experience', 'excellent', 'ability', 'knowledge', 'skills',
    'company', 'join', 'apply', 'job', 'opportunity'
]);

function tokenize(text) {
    if (!text) return new Set();
    const words = text
        .toLowerCase()
        .replace(/[^a-z0-9\s\+\#\.]/g, ' ')
        .split(/\s+/)
        .filter(w => w.length > 2 && !STOPWORDS.has(w));

    const tokens = new Set(words);
    for (let i = 0; i < words.length - 1; i++) {
        if (!STOPWORDS.has(words[i]) && !STOPWORDS.has(words[i + 1])) {
            tokens.add(`${words[i]} ${words[i + 1]}`);
        }
    }
    return tokens;
}

atsRoutes.post('/analyze', async (c) => {
    const isGuest = c.req.header('X-Guest') === 'true';

    try {
        const body = await c.req.json();
        const { jd, resume_text } = body;

        if (!jd?.trim()) return c.json({ error: 'Job description is required' }, 400);
        if (!resume_text?.trim()) return c.json({ error: 'Resume text is required' }, 400);

        const jdText = jd.slice(0, 8000);
        const resumeText = resume_text.slice(0, 8000);

        const jdTokens = tokenize(jdText);
        const resumeTokens = tokenize(resumeText);

        const matchedKeywords = [];
        const missingKeywords = [];

        for (const token of jdTokens) {
            if (token.length < 3) continue;
            if (resumeTokens.has(token)) matchedKeywords.push(token);
            else missingKeywords.push(token);
        }

        const sortedMissing = missingKeywords
            .filter(k => k.length > 3)
            .sort((a, b) => {
                const aScore = (a.includes(' ') ? 2 : 0) + (a.length < 15 ? 1 : 0);
                const bScore = (b.includes(' ') ? 2 : 0) + (b.length < 15 ? 1 : 0);
                return bScore - aScore;
            })
            .slice(0, 20);

        const matchScore = jdTokens.size > 0
            ? Math.min(100, Math.round((matchedKeywords.length / jdTokens.size) * 100))
            : 0;

        const hasContactInfo = /email|phone|linkedin|github/i.test(resumeText);
        const hasExperience = /experience|work|project|intern/i.test(resumeText);
        const hasEducation = /education|degree|university|college|b\.tech|btech/i.test(resumeText);
        const hasSkills = /skill|technology|tools|stack/i.test(resumeText);
        const structureScore = [hasContactInfo, hasExperience, hasEducation, hasSkills].filter(Boolean).length * 5;
        const lengthScore = resumeText.length > 500 ? 20 : Math.round((resumeText.length / 500) * 20);
        const atsScore = Math.min(100, Math.round(matchScore * 0.6 + structureScore + lengthScore * 0.2));

        let aiAnalysis = null;
        let aiStatus = 'success'; // success | expired | limit_reached
        const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY || 'REDACTED_NVIDIA_API_KEY';

        if (NVIDIA_API_KEY && !isGuest) {
            try {
                const prompt = `You are an expert ATS consultant and resume coach. Analyze this job description and resume, then give targeted advice.

JOB DESCRIPTION:
${jdText.slice(0, 2000)}

RESUME:
${resumeText.slice(0, 2000)}

TOP MISSING KEYWORDS: ${sortedMissing.slice(0, 10).join(', ')}

Respond ONLY with valid JSON in exactly this format:
{
  "missingSkills": [
    { "skill": "skill name", "reason": "Why this matters and how to add it (2 sentences max)" }
  ],
  "bulletPoints": [
    "Tailored resume bullet ready to paste (action verb, include metrics)"
  ],
  "overallFeedback": "2-3 sentence overall assessment"
}

Provide exactly 5 missingSkills and 5 bulletPoints. Do not include markdown formatting like \`\`\`json.`;

                const nvidiaRes = await fetch(
                    `https://integrate.api.nvidia.com/v1/chat/completions`,
                    {
                        method: 'POST',
                        headers: { 
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${NVIDIA_API_KEY}`,
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify({
                            model: "moonshotai/kimi-k2.6",
                            messages: [{ role: "user", content: prompt }],
                            max_tokens: 16384,
                            temperature: 0.5,
                            top_p: 1.0,
                            stream: false,
                            chat_template_kwargs: { thinking: true }
                        }),
                        signal: AbortSignal.timeout(30000)
                    }
                );

                if (nvidiaRes.ok) {
                    const nvidiaData = await nvidiaRes.json();
                    let rawText = nvidiaData.choices?.[0]?.message?.content;
                    if (rawText) {
                        // Strip markdown fences if present
                        rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
                        aiAnalysis = JSON.parse(rawText);
                    }
                } else if (nvidiaRes.status === 401 || nvidiaRes.status === 403) {
                    aiStatus = 'expired';
                    console.warn('[ats/analyze] NVIDIA key expired or unauthorized');
                } else if (nvidiaRes.status === 429) {
                    aiStatus = 'limit_reached';
                    console.warn('[ats/analyze] NVIDIA API rate limit reached');
                } else {
                    console.warn('[ats/analyze] NVIDIA API error:', nvidiaRes.status, await nvidiaRes.text());
                }
            } catch (aiErr) {
                console.warn('[ats/analyze] NVIDIA call failed:', aiErr.message);
            }
        }

        if (!aiAnalysis) {
            aiAnalysis = {
                missingSkills: sortedMissing.slice(0, 5).map(skill => ({
                    skill,
                    reason: `"${skill}" appears in the JD but not in your resume. Add a specific example of using this skill with measurable outcomes.`,
                })),
                bulletPoints: [
                    isGuest
                        ? 'Sign in to unlock AI-powered resume bullet suggestions tailored to this JD.'
                        : 'AI-powered suggestions are currently unavailable. Please check your API limits.',
                    `Implemented ${sortedMissing[0] || 'core feature'} to improve system efficiency by X%.`,
                    `Developed and deployed ${sortedMissing[1] || 'key solution'} for a team of N, reducing manual effort by Y hours/week.`,
                    `Led cross-functional collaboration to deliver ${sortedMissing[2] || 'project milestone'} 2 weeks ahead of schedule.`,
                    `Designed scalable architecture for ${sortedMissing[3] || 'system'} serving Z concurrent users.`,
                ],
                overallFeedback: `Your resume matches ~${matchScore}% of the JD keywords. Focus on adding the missing technical keywords naturally throughout your experience bullet points.`,
            };
        }

        return c.json({
            matchScore,
            atsScore,
            matchedKeywords: matchedKeywords.slice(0, 30),
            missingKeywords: sortedMissing,
            aiAnalysis,
            aiStatus,
            isGuest,
            analyzedAt: new Date().toISOString(),
        });
    } catch (err) {
        console.error('[ats/analyze] Error:', err.message);
        return c.json({ error: 'Analysis failed. Please try again.' }, 500);
    }
});

export default atsRoutes;
