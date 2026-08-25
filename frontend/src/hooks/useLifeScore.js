import { useQuery } from '@tanstack/react-query';
import { apiGet } from '../utils/api';
import { calculateLifeScoreLocal } from '../utils/lifeScoreEngine';

const SCORE_PREV_KEY = 'aiimin_life_score_prev';
const DIMENSIONS = ['physical', 'cognitive', 'discipline', 'financial', 'emotional'];
const LABELS = { physical: 'BODY', cognitive: 'MIND', discipline: 'DISCIPLINE', financial: 'MONEY', emotional: 'MOOD' };

function deltaFromPrevious(score) {
    if (score == null) return null;
    try {
        const prev = Number(localStorage.getItem(SCORE_PREV_KEY));
        localStorage.setItem(SCORE_PREV_KEY, String(score));
        return Number.isFinite(prev) && prev > 0 ? score - prev : null;
    } catch {
        return null;
    }
}

export function unavailableLifeScore(reason = 'unavailable') {
    return {
        score: null,
        delta: null,
        explanation: 'Life Score is temporarily unavailable. Your source records were not replaced with an estimate.',
        source: reason,
        confidence: 'insufficient',
        contributors: Object.fromEntries(DIMENSIONS.map((key) => [key, { score: null, label: LABELS[key] }])),
    };
}

function mapLhsToDisplay(lhs) {
    const scores = lhs?.systemScores || {};
    const score = lhs?.globalScore == null ? null : Math.round(Number(lhs.globalScore));
    const contributors = Object.fromEntries(DIMENSIONS.map((key) => [key, {
        score: scores[key] == null ? null : Math.round(Number(scores[key])),
        label: LABELS[key],
        coverage: lhs?.dimensions?.[key]?.coverage ?? null,
        confidence: lhs?.dimensions?.[key]?.confidence || 'insufficient',
    }]));
    const available = Object.values(contributors).filter((item) => item.score != null);
    const best = available.reduce((a, b) => (a.score >= b.score ? a : b), available[0] || null);
    const worst = available.reduce((a, b) => (a.score <= b.score ? a : b), available[0] || null);
    let explanation = lhs?.scoreMeta?.methodology || 'Score reflects observed source records across your five operating dimensions.';
    if (best && worst && best.score - worst.score > 20) explanation = `${best.label} is strongest in this window; ${worst.label.toLowerCase()} is the clearest area to inspect.`;

    return {
        score,
        delta: deltaFromPrevious(score),
        explanation,
        source: 'api',
        confidence: lhs?.scoreMeta?.confidence || 'insufficient',
        coverage: lhs?.scoreMeta?.coverage ?? 0,
        calculationVersion: lhs?.calculationVersion,
        contributors,
        lhs,
    };
}

async function fetchLifeScore(user) {
    if (!user || user.isGuest) return calculateLifeScoreLocal(user);
    try {
        const lhs = await apiGet('/intelligence/lhs?days=30');
        if (lhs?.calculationVersion && Object.prototype.hasOwnProperty.call(lhs, 'globalScore')) return mapLhsToDisplay(lhs);
        return unavailableLifeScore('invalid-api-contract');
    } catch (err) {
        console.warn('[useLifeScore] server score unavailable:', err.message);
        return unavailableLifeScore('api-unavailable');
    }
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
