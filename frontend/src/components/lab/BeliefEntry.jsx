import React, { useState, useEffect } from 'react';
import supabase from '../../utils/supabase';

export default function BeliefEntry({ quarterLabel, completedDomains = [], onComplete }) {
    const [prompts, setPrompts] = useState([]);
    const [selectedDomain, setSelectedDomain] = useState(null);
    const [selectedPrompt, setSelectedPrompt] = useState(null);
    const [response, setResponse] = useState('');
    const [saving, setSaving] = useState(false);
    const [done, setDone] = useState(false);

    const allDomains = ['money', 'opportunity', 'women', 'identity', 'society', 'fear'];
    const remaining = allDomains.filter(d => !completedDomains.includes(d));

    useEffect(() => {
        const fetchPrompts = async () => {
            try {
                const { data, error } = await supabase
                    .from('lab_belief_prompts')
                    .select('*')
                    .order('sort_order', { ascending: true });
                
                if (error) throw error;
                setPrompts(data || []);
            } catch (err) {
                console.error('[BeliefEntry] Fetch prompts error:', err);
            }
        };
        fetchPrompts();
    }, []);

    const handleSave = async () => {
        if (!selectedDomain || !selectedPrompt || !response.trim()) return;
        setSaving(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            // Convert "Q1 2026" to "2026-01-01"
            const [q, year] = quarterLabel.split(' ');
            const month = q === 'Q1' ? '01' : q === 'Q2' ? '04' : q === 'Q3' ? '07' : '10';
            const anchorDate = `${year}-${month}-01`;

            const { error } = await supabase
                .from('lab_beliefs')
                .insert({
                    user_id: user.id,
                    domain: selectedDomain,
                    prompt_id: selectedPrompt.id,
                    response_text: response,
                    quarter_anchor: anchorDate,
                    created_at: new Date().toISOString()
                });

            if (error) throw error;

            setDone(true);
            onComplete?.({ domain: selectedDomain });
        } catch (err) {
            console.error('[BeliefEntry] Save error:', err);
            alert('Failed to save belief to Supabase.');
        } finally {
            setSaving(false);
        }
    };

    if (done) {
        return (
            <div className="lab-audit-row">
                <div className="lab-audit-left">
                    <span className="lab-audit-title">Belief logged — {selectedDomain}</span>
                    <span className="lab-audit-subtitle">{quarterLabel}</span>
                </div>
                <span className="lab-audit-value">✓</span>
            </div>
        );
    }

    const domainPrompts = prompts.filter(p => p.domain === selectedDomain);

    return (
        <div className="lab-metric-card" style={{ padding: 'var(--space-5)' }}>
            <div className="lab-metric-header">
                <span className="lab-metric-title">Belief Inventory · {quarterLabel}</span>
                <span style={{ font: 'var(--text-label)', color: 'var(--color-text-3)' }}>
                    {completedDomains.length}/6
                </span>
            </div>

            {remaining.length === 0 ? (
                <p style={{ font: 'var(--text-subtext)', color: 'var(--color-accent)', padding: 'var(--space-4) 0', textAlign: 'center' }}>
                    All 6 domains completed for {quarterLabel}. 🏅
                </p>
            ) : !selectedDomain ? (
                <>
                    <p style={{ font: 'var(--text-subtext)', color: 'var(--color-text-3)', margin: 'var(--space-2) 0 var(--space-4)' }}>
                        Choose a domain to write about. Be honest, not performative.
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-2)' }}>
                        {allDomains.map(d => (
                            <button key={d} onClick={() => !completedDomains.includes(d) && setSelectedDomain(d)}
                                disabled={completedDomains.includes(d)}
                                style={{
                                    background: completedDomains.includes(d) ? 'var(--color-surface)' : 'var(--color-elevated)',
                                    border: '1px solid var(--color-border)', borderRadius: 'var(--r-sm)',
                                    padding: 'var(--space-3)', color: completedDomains.includes(d) ? 'var(--color-text-3)' : 'var(--color-text-1)',
                                    cursor: completedDomains.includes(d) ? 'not-allowed' : 'pointer',
                                    font: '500 12px/1 var(--font-sans)', textTransform: 'capitalize',
                                    opacity: completedDomains.includes(d) ? 0.5 : 1,
                                }}
                            >
                                {d} {completedDomains.includes(d) ? '✓' : ''}
                            </button>
                        ))}
                    </div>
                </>
            ) : !selectedPrompt ? (
                <>
                    <p style={{ font: '500 13px/1 var(--font-sans)', color: 'var(--color-accent)', margin: 'var(--space-3) 0', textTransform: 'capitalize' }}>
                        {selectedDomain}
                    </p>
                    {domainPrompts.map(p => (
                        <button key={p.id} onClick={() => setSelectedPrompt(p)}
                            style={{
                                display: 'block', width: '100%', textAlign: 'left',
                                background: 'var(--color-elevated)', border: '1px solid var(--color-border)',
                                borderRadius: 'var(--r-sm)', padding: 'var(--space-3)',
                                color: 'var(--color-text-1)', cursor: 'pointer',
                                font: '300 13px/1.5 var(--font-sans)', marginBottom: 'var(--space-2)',
                                transition: 'border-color 0.2s',
                            }}
                            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--color-accent)'}
                            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--color-border)'}
                        >
                            {p.prompt_text}
                        </button>
                    ))}
                    <button onClick={() => setSelectedDomain(null)}
                        style={{ background: 'none', border: 'none', color: 'var(--color-text-3)', cursor: 'pointer', font: 'var(--text-label)', marginTop: 'var(--space-2)' }}>
                        ← Back
                    </button>
                </>
            ) : (
                <>
                    <p style={{ font: '300 14px/1.6 var(--font-sans)', color: 'var(--color-text-1)', fontStyle: 'italic', background: 'var(--color-elevated)', borderRadius: 'var(--r-sm)', padding: 'var(--space-3)', margin: 'var(--space-3) 0' }}>
                        {selectedPrompt.prompt_text}
                    </p>
                    <textarea value={response} onChange={e => setResponse(e.target.value)}
                        placeholder="Write your honest response..."
                        style={{
                            width: '100%', minHeight: '120px', resize: 'vertical',
                            font: '400 14px/1.6 var(--font-sans)', color: 'var(--color-text-1)',
                            background: 'var(--color-surface)', border: '1px solid var(--color-border)',
                            borderRadius: 'var(--r-sm)', padding: 'var(--space-3)', outline: 'none',
                        }}
                    />
                    <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-3)' }}>
                        <button onClick={handleSave} disabled={saving || !response.trim()} className="lab-retry-btn" style={{ flex: 1 }}>
                            {saving ? 'Saving...' : 'Save Belief'}
                        </button>
                        <button onClick={() => { setSelectedPrompt(null); setResponse(''); }}
                            style={{ background: 'none', border: '1px solid var(--color-border)', borderRadius: 'var(--r-sm)', padding: 'var(--space-2) var(--space-4)', color: 'var(--color-text-2)', cursor: 'pointer', font: 'var(--text-label)' }}>
                            Back
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
