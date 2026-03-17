/**
 * server/routes/ats.js
 * ATS Resume Analyzer — keyword matching + Kimi-powered gap analysis
 */
import { Hono } from 'hono';
import { requireAuth } from '../middleware/auth.js';
import { generateKimiAtsAnalysis } from '../services/kimiAtsService.js';

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

const requireAuthUnlessGuest = async (c, next) => {
    const isGuest = c.req.header('X-Guest') === 'true';
    if (isGuest) return next();
    return requireAuth(c, next);
};

const readAnalyzeBody = async (c) => {
    const contentType = c.req.header('content-type') || '';
    if (contentType.includes('multipart/form-data') || contentType.includes('application/x-www-form-urlencoded')) {
        const body = await c.req.parseBody();
        return {
            jd: body.jd,
            resume_text: body.resume_text,
        };
    }
    return c.req.json();
};

atsRoutes.post('/analyze', requireAuthUnlessGuest, async (c) => {
    const isGuest = c.req.header('X-Guest') === 'true';

    try {
        const body = await readAnalyzeBody(c);
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

        const { aiAnalysis, aiStatus } = await generateKimiAtsAnalysis({
            jdText,
            resumeText,
            sortedMissing,
            matchScore,
            isGuest,
        });

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
