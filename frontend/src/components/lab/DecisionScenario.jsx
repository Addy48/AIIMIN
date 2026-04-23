import React, { useState } from 'react';
import supabase from '../../utils/supabase';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const DOMAINS = ['money', 'opportunity', 'women', 'identity', 'society', 'fear'];
const SCENARIOS = {
    money: 'You find ₹50,000 cash in an unmarked envelope at a café. No cameras, no witnesses. What do you do — and why?',
    opportunity: 'A friend offers you a 20% stake in a startup, but you must quit your job within 72 hours. What questions do you ask first?',
    women: 'A woman you admire tells you she does not want to date someone in your career. Do you change anything?',
    identity: 'Someone publicly misrepresents your views and it goes viral. You have one public response. What do you say?',
    society: 'Your family pressures you to take a prestigious but soul-crushing job. Walk through your decision process.',
    fear: 'You receive a diagnosis that limits your lifespan to 10 years. What changes immediately, and what stays the same?',
};

export default function DecisionScenario({ onComplete }) {
    const [domain, setDomain] = useState(null);
    const [response, setResponse] = useState('');
    const [quality, setQuality] = useState(3);
    const [saving, setSaving] = useState(false);
    const [result, setResult] = useState(null);

    const handleSave = async () => {
        if (!domain || !response.trim()) return;
        setSaving(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            const { data, error } = await supabase
                .from('lab_decision_scenarios')
                .insert({
                    user_id: user.id,
                    domain: domain,
                    response_text: response,
                    quality_self: quality,
                    responded_at: new Date().toISOString()
                })
                .select()
                .single();

            if (error) throw error;

            setResult(data);
            onComplete?.(data);
        } catch (err) {
            console.error('[DecisionScenario] Save error:', err);
            alert('Failed to save decision to Supabase.');
        } finally {
            setSaving(false);
        }
    };

    if (result) {
        return (
            <div className="lab-metric-card" style={{ padding: 'var(--space-5)', textAlign: 'center' }}>
                <div className="lab-metric-header"><span className="lab-metric-title">Decision Logged</span></div>
                <div style={{ font: '300 28px/1 var(--font-sans)', color: 'var(--color-hero)', margin: 'var(--space-4) 0' }}>
                    {domain}
                </div>
                <p style={{ font: 'var(--text-subtext)', color: 'var(--color-accent)' }}>
                    Quality self-rating: {quality}/5. {result.streak_days} day streak.
                </p>
            </div>
        );
    }

    return (
        <div className="lab-metric-card" style={{ padding: 'var(--space-5)' }}>
            <div className="lab-metric-header"><span className="lab-metric-title">Decision Scenario</span></div>
            {!domain ? (
                <>
                    <p style={{ font: 'var(--text-subtext)', color: 'var(--color-text-3)', margin: 'var(--space-2) 0 var(--space-4)' }}>
                        Pick a domain. One scenario takes 90 seconds.
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-2)' }}>
                        {DOMAINS.map(d => (
                            <button key={d} onClick={() => setDomain(d)}
                                style={{
                                    background: 'var(--color-elevated)', border: '1px solid var(--color-border)',
                                    borderRadius: 'var(--r-sm)', padding: 'var(--space-3)',
                                    color: 'var(--color-text-1)', cursor: 'pointer',
                                    font: '500 12px/1 var(--font-sans)', textTransform: 'capitalize',
                                    transition: 'border-color 0.2s',
                                }}
                                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--color-accent)'}
                                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--color-border)'}
                            >
                                {d}
                            </button>
                        ))}
                    </div>
                </>
            ) : (
                <>
                    <p style={{ font: '300 14px/1.6 var(--font-sans)', color: 'var(--color-text-1)', fontStyle: 'italic', background: 'var(--color-elevated)', borderRadius: 'var(--r-sm)', padding: 'var(--space-3)', margin: 'var(--space-3) 0' }}>
                        {SCENARIOS[domain]}
                    </p>
                    <textarea value={response} onChange={e => setResponse(e.target.value)}
                        placeholder="Your response..."
                        style={{
                            width: '100%', minHeight: '100px', resize: 'vertical',
                            font: '400 14px/1.6 var(--font-sans)', color: 'var(--color-text-1)',
                            background: 'var(--color-surface)', border: '1px solid var(--color-border)',
                            borderRadius: 'var(--r-sm)', padding: 'var(--space-3)', outline: 'none',
                        }}
                    />
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', margin: 'var(--space-3) 0' }}>
                        <span style={{ font: '500 13px/1 var(--font-sans)', color: 'var(--color-text-2)' }}>Quality:</span>
                        {[1, 2, 3, 4, 5].map(n => (
                            <button key={n} onClick={() => setQuality(n)}
                                style={{
                                    width: '32px', height: '32px', borderRadius: '50%',
                                    background: quality === n ? 'var(--color-accent)' : 'var(--color-elevated)',
                                    color: quality === n ? 'white' : 'var(--color-text-2)',
                                    border: '1px solid var(--color-border)', cursor: 'pointer',
                                    font: '500 13px var(--font-mono)',
                                }}
                            >
                                {n}
                            </button>
                        ))}
                    </div>
                    <button onClick={handleSave} disabled={saving || !response.trim()} className="lab-retry-btn" style={{ width: '100%' }}>
                        {saving ? 'Saving...' : 'Submit Decision'}
                    </button>
                </>
            )}
        </div>
    );
}
