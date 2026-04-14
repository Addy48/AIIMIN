import React, { useState } from 'react';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const SLIDERS = [
    { key: 'confidence_score', label: 'Confidence', desc: 'How confident did you feel delivering your point?' },
    { key: 'clarity_score', label: 'Clarity', desc: 'How clear and structured was your speech?' },
    { key: 'pace_score', label: 'Pace', desc: 'How well did you control your speaking pace?' },
];

export default function SpeakingLogger({ onComplete }) {
    const [scores, setScores] = useState({ confidence_score: 50, clarity_score: 50, pace_score: 50 });
    const [notes, setNotes] = useState('');
    const [saving, setSaving] = useState(false);
    const [result, setResult] = useState(null);

    const handleSave = async () => {
        setSaving(true);
        try {
            const token = localStorage.getItem('access_token');
            const res = await fetch(`${API_BASE}/lab/practice/speaking`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...scores, notes: notes || null }),
            });
            const data = await res.json();
            setResult(data);
            onComplete?.(data);
        } catch (err) {
            console.error('[SpeakingLogger] Save error:', err);
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
            <p style={{ font: 'var(--text-subtext)', color: 'var(--color-text-3)', margin: 'var(--space-2) 0 var(--space-4)' }}>
                Rate your last speaking effort. Record a 60-second response, then score yourself.
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
