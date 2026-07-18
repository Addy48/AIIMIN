/**
 * Maps server LHS payload to Overview life-score display shape.
 */
export function mapLhsToLifeScoreDisplay(lhs, { prevScore = null } = {}) {
    const ss = lhs?.systemScores || {};
    const score = Math.round(Number(lhs?.globalScore) || 0);
    const prev = prevScore != null ? Number(prevScore) : null;
    const delta = prev != null && !Number.isNaN(prev) ? score - prev : 0;

    const contributors = {
        behavioral: { score: Math.round(ss.discipline || 0), label: 'Behavioral' },
        mental_clarity: { score: Math.round(ss.emotional || 0), label: 'Mental Clarity' },
        goal_momentum: { score: Math.round(ss.cognitive || 0), label: 'Goal Momentum' },
        financial: { score: Math.round(ss.financial || 0), label: 'Financial' },
        recovery: { score: Math.round(ss.physical || 0), label: 'Recovery' },
    };

    const dims = Object.values(contributors).map((c) => c.score);
    const best = Math.max(...dims);
    const worst = Math.min(...dims);
    const bestKey = Object.entries(contributors).find(([, v]) => v.score === best)?.[1]?.label;
    const worstKey = Object.entries(contributors).find(([, v]) => v.score === worst)?.[1]?.label;

    let explanation = 'Score reflects your logged habits, sleep, focus, money, and mood.';
    if (best - worst > 20 && bestKey && worstKey) {
        explanation = `${bestKey} is strongest; ${worstKey.toLowerCase()} needs attention.`;
    } else if (best > 70 && bestKey) {
        explanation = `Strong ${bestKey.toLowerCase()} is lifting your score.`;
    }

    return {
        score,
        delta,
        explanation,
        source: 'api',
        globalScore: score,
        systemScores: ss,
        contributors,
    };
}
