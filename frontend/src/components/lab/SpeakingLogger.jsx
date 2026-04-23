import React, { useState } from 'react';
import supabase from '../../utils/supabase';

const SLIDERS = [
    { key: 'confidence_score', label: 'Confidence', desc: 'How confident did you feel delivering your point?' },
    { key: 'clarity_score', label: 'Clarity', desc: 'How clear and structured was your speech?' },
    { key: 'pace_score', label: 'Pace', desc: 'How well did you control your speaking pace?' },
];

const SPEAKING_PROMPTS = [
    "Explain your primary career objective as if you were talking to a 50-year-old mentor.",
    "Describe a complex technical concept you recently learned, but explain it to a non-technical friend.",
    "Walk through your decision process for your most significant purchase in the last 12 months.",
    "What is the single most important habit you've formed in 2026? Justify why it matters.",
    "If you had to pitch AIIMIN's core value proposition to a high-performer in 60 seconds, what would you say?",
    "Describe a time you failed to communicate clearly. What was the impact, and what would you change?"
];

export default function SpeakingLogger({ onComplete }) {
    const [promptIndex, setPromptIndex] = useState(0);
    const [scores, setScores] = useState({ confidence_score: 50, clarity_score: 50, pace_score: 50 });
    const [notes, setNotes] = useState('');
    const [saving, setSaving] = useState(false);
    const [result, setResult] = useState(null);

    const cyclePrompt = () => setPromptIndex(prev => (prev + 1) % SPEAKING_PROMPTS.length);

    const handleSave = async () => {
        setSaving(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            const { data, error } = await supabase
                .from('lab_speaking_logs')
                .insert({
                    user_id: user.id,
                    ...scores,
                    notes: notes || null,
                    logged_at: new Date().toISOString()
                })
                .select()
                .single();

            if (error) throw error;
            
            setResult(data);
            onComplete?.(data);
        } catch (err) {
            console.error('[SpeakingLogger] Save error:', err);
            alert('Failed to save log to Supabase.');
        } finally {
            setSaving(false);
        }
    };

    if (result) {
        return (
            <div className="lab-metric-card" style={{ padding: 'var(--space-5)', textAlign: 'center' }}>
                <div className="lab-metric-header"><span className="lab-metric-title">Speaking Logged</span></div>
                <div style={{ font: '300 28px/1 var(--font-sans)', color: 'var(--color-hero)', margin: 'var(--space-4) 0 var(--space-2)' }}>
                    {scores.confidence_score}/100
                </div>
                <p style={{ font: 'var(--text-subtext)', color: 'var(--color-accent)' }}>
                    {result.mastery_change ? `🏅 ${result.mastery_change.toUpperCase()} earned!` : `${result.streak_days} day streak.`}
                </p>
            </div>
        );
    }

    return (
        <div className="lab-metric-card" style={{ padding: 'var(--space-5)' }}>
            <div className="lab-metric-header"><span className="lab-metric-title">Speaking Logger</span></div>

            <div style={{ background: 'var(--color-elevated)', borderRadius: 'var(--r-sm)', padding: 'var(--space-3)', margin: 'var(--space-3) 0' }}>
                <div style={{ font: 'var(--text-label)', color: 'var(--color-accent)', marginBottom: 'var(--space-1)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Prompt:</div>
                <p style={{ font: '300 14px/1.5 var(--font-sans)', color: 'var(--color-text-1)', fontStyle: 'italic' }}>
                    "{SPEAKING_PROMPTS[promptIndex]}"
                </p>
                <button onClick={cyclePrompt} style={{ background: 'none', border: 'none', color: 'var(--color-text-3)', font: '500 11px var(--font-mono)', cursor: 'pointer', padding: 'var(--space-1) 0', marginTop: 'var(--space-2)' }}>
                    CYCLE PROMPT ↻
                </button>
            </div>

            <p style={{ font: 'var(--text-subtext)', color: 'var(--color-text-3)', marginBottom: 'var(--space-4)' }}>
                Record a 60-second response, then score your performance below.
            </p>

            {SLIDERS.map(({ key, label, desc }) => (
                <div key={key} style={{ marginBottom: 'var(--space-4)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ font: '500 13px/1 var(--font-sans)', color: 'var(--color-text-1)' }}>{label}</span>
                        <span style={{ font: '400 13px/1 var(--font-mono)', color: 'var(--color-text-2)' }}>{scores[key]}</span>
                    </div>
                    <input type="range" min="1" max="100" value={scores[key]}
                        onChange={e => setScores(s => ({ ...s, [key]: parseInt(e.target.value) }))}
                        style={{ width: '100%', accentColor: 'var(--color-accent)' }}
                    />
                    <span style={{ font: 'var(--text-label)', color: 'var(--color-text-3)' }}>{desc}</span>
                </div>
            ))}
            <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Notes (optional)"
                style={{
                    width: '100%', minHeight: '60px', resize: 'vertical',
                    font: '400 13px/1.5 var(--font-sans)', color: 'var(--color-text-1)',
                    background: 'var(--color-elevated)', border: '1px solid var(--color-border)',
                    borderRadius: 'var(--r-sm)', padding: 'var(--space-3)', outline: 'none',
                }}
            />
            <button onClick={handleSave} disabled={saving} className="lab-retry-btn" style={{ marginTop: 'var(--space-3)', width: '100%' }}>
                {saving ? 'Saving...' : 'Log Speaking'}
            </button>
        </div>
    );
}
