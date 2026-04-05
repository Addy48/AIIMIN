import React, { useState } from 'react';

const PROMPTS = [
    'What was your biggest win this week?',
    'What habit slipped and why?',
    'What did you learn that you want to keep?',
    'What will you do differently next week?',
    'Rate this week 1-10 and explain.',
];

const WEEK_KEY = `aiimin_review_w${Math.ceil((new Date() - new Date(new Date().getFullYear(), 0, 1)) / 604800000)}`;

const WeeklyLifeReview = () => {
    const stored = JSON.parse(localStorage.getItem(WEEK_KEY) || '{}');
    const [answers, setAnswers] = useState(stored);
    const [saved, setSaved] = useState(Object.keys(stored).length === PROMPTS.length);

    const update = (i, val) => setAnswers(prev => ({ ...prev, [i]: val }));

    const save = () => {
        localStorage.setItem(WEEK_KEY, JSON.stringify(answers));
        setSaved(true);
    };

    return (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    Weekly Life Review
                </div>
                {saved && (
                    <button onClick={() => setSaved(false)} style={{ fontSize: '11px', color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontWeight: 700 }}>
                        Edit
                    </button>
                )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {PROMPTS.map((p, i) => (
                    <div key={i}>
                        <div style={{ fontSize: '12px', color: 'var(--text-2)', fontWeight: 600, marginBottom: '6px' }}>{i + 1}. {p}</div>
                        {saved ? (
                            <div style={{ fontSize: '13px', color: 'var(--text-1)', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                                {answers[i] || '—'}
                            </div>
                        ) : (
                            <textarea
                                value={answers[i] || ''}
                                onChange={e => update(i, e.target.value)}
                                rows={2}
                                style={{ width: '100%', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '6px', padding: '8px 10px', color: 'var(--text-1)', fontSize: '12px', resize: 'vertical', boxSizing: 'border-box' }}
                            />
                        )}
                    </div>
                ))}
                {!saved && (
                    <button onClick={save} style={{ alignSelf: 'flex-end', padding: '8px 20px', background: 'var(--accent)', border: 'none', borderRadius: '6px', color: '#fff', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
                        Save Review
                    </button>
                )}
            </div>
        </div>
    );
};

export default WeeklyLifeReview;
