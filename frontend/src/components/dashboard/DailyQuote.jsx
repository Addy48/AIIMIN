import React, { useMemo } from 'react';
import { getContextualQuote } from '../../utils/xpEngine';

// Determine which quote context fits best based on available data
function pickContext(logSnapshot) {
    const s = logSnapshot || {};
    if ((s.rc_count || 0) > 0) return 'after_reset';

    // Perfect day check: 8/8 metrics present
    const filled = [
        s.sleep_start && s.sleep_end,
        s.gym_done,
        s.breakfast_done,
        (s.steps || 0) >= 1000,
        (s.water_bottles || 0) >= 2,
        (s.mood || 0) > 0,
        s.learning_done,
        s.journal_entry?.trim(),
    ].filter(Boolean).length;
    if (filled === 8) return 'perfect_day';

    return 'morning_empty';
}

const CONTEXT_LABEL = {
    after_reset: { label: 'Comeback', color: '#f59e0b' },
    milestone_30: { label: '30-Day Milestone', color: '#10b981' },
    clean_streak_7: { label: 'discipline', color: '#8b5cf6' },
    perfect_day: { label: 'Perfect Day', color: 'var(--accent)' },
    morning_empty: { label: 'Today', color: 'var(--accent)' },
};

const DailyQuote = ({ logSnapshot }) => {
    const context = useMemo(() => pickContext(logSnapshot), [logSnapshot]);
    const quote = useMemo(() => getContextualQuote(context), [context]);
    const meta = CONTEXT_LABEL[context] || CONTEXT_LABEL.morning_empty;

    return (
        <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 'var(--r-lg)', padding: '16px 20px',
            borderLeft: `3px solid ${meta.color}`,
            display: 'flex', flexDirection: 'column', gap: '6px',
        }}>
            <span style={{
                fontSize: '10px', fontWeight: 700, textTransform: 'uppercase',
                letterSpacing: '0.08em', color: meta.color,
            }}>
                {meta.label}
            </span>
            <p style={{
                fontSize: '14px', fontWeight: 600, color: 'var(--text-1)',
                lineHeight: 1.55, margin: 0,
                fontStyle: 'italic',
            }}>
                "{quote}"
            </p>
        </div>
    );
};

export default DailyQuote;
