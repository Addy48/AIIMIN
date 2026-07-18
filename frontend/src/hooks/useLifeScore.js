import { useQuery } from '@tanstack/react-query';
import { apiGet } from '../utils/api';
import { calculateLifeScoreLocal } from '../utils/lifeScoreEngine';

const SCORE_PREV_KEY = 'aiimin_life_score_prev';

function mapLhsToDisplay(lhs) {
    const ss = lhs?.systemScores || {};
    const score = Math.round(Number(lhs?.globalScore) || 0);
    let delta = 0;
    try {
        const prev = Number(localStorage.getItem(SCORE_PREV_KEY));
        if (!Number.isNaN(prev) && prev > 0) delta = score - prev;
        localStorage.setItem(SCORE_PREV_KEY, String(score));
    } catch { /* ignore */ }

    const contributors = {
        behavioral: { score: Math.round(ss.discipline || 0), label: 'Behavioral' },
        mental_clarity: { score: Math.round(ss.emotional || 0), label: 'Mental Clarity' },
        goal_momentum: { score: Math.round(ss.cognitive || 0), label: 'Goal Momentum' },
        financial: { score: Math.round(ss.financial || 0), label: 'Financial' },
        recovery: { score: Math.round(ss.physical || 0), label: 'Recovery' },
    };

    const dims = Object.values(contributors);
    const best = dims.reduce((a, b) => (a.score >= b.score ? a : b));
    const worst = dims.reduce((a, b) => (a.score <= b.score ? a : b));
    let explanation = 'Score reflects your logged habits, sleep, focus, money, and mood.';
    if (best.score - worst.score > 20) {
        explanation = `${best.label} is strongest; ${worst.label.toLowerCase()} needs attention.`;
    }

    return { score, delta, explanation, source: 'api', contributors, lhs };
}

async function fetchLifeScore(user) {
    if (!user || user.isGuest) {
        return calculateLifeScoreLocal(user);
    }
    try {
        const lhs = await apiGet('/intelligence/lhs?days=30');
        if (lhs?.globalScore != null) return mapLhsToDisplay(lhs);
    } catch (err) {
        console.warn('[useLifeScore] API fallback:', err.message);
    }
    return calculateLifeScoreLocal(user);
}

export function useLifeScore(user, { enabled = true } = {}) {
    const query = useQuery({
        queryKey: ['life-score', user?.id],
        queryFn: () => fetchLifeScore(user),
        enabled: Boolean(enabled && user),
        staleTime: 60_000,
    });

    return {
        lifeScore: query.data,
        loading: query.isLoading,
        error: query.error,
        refetch: query.refetch,
    };
}

export { fetchLifeScore, mapLhsToDisplay };
