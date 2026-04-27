import React from 'react';
import { SectionCard } from './Shared';
import { timeInput } from "../MobileUI";

const SLEEP_TAGS = ['😰 Stress', '☕ Caffeine', '📱 Screen', '🏋️ Gym fatigue', '🌙 Late night', '🔊 Noise', '🤒 Sickness', '💊 Meds'];

const MobileSleepSection = ({ data, onChange, complete }) => {
    const sleepHours = (() => {
        if (!data.sleepStart || !data.sleepEnd) return 0;
        const s = data.sleepStart.split(':').map(Number);
        const e = data.sleepEnd.split(':').map(Number);
        let sm = s[0] * 60 + s[1], em = e[0] * 60 + e[1];
        if (em <= sm) em += 1440;
        return Number(((em - sm) / 60).toFixed(1));
    })();
    const debt = sleepHours > 0 ? (8 - sleepHours) : 0;
    const barPct = sleepHours > 0 ? Math.min((sleepHours / 10) * 100, 100) : 0;
    const barColor = sleepHours >= 7 ? 'var(--success)' : sleepHours >= 6 ? 'var(--accent)' : 'var(--danger)';
    const tags = data.sleepTags || [];
    const toggleTag = (tag) => {
        const next = tags.includes(tag) ? tags.filter(t => t !== tag) : [...tags, tag];
        onChange('sleepTags', next);
    };

    return (
        <SectionCard icon="🌙" title="SLEEP" complete={complete}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                    <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px', display: 'block' }}>Bedtime</label>
                    <input type="time" value={data.sleepStart || ''} onChange={e => onChange('sleepStart', e.target.value)}
                        style={timeInput} />
                </div>
                <div>
                    <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px', display: 'block' }}>Wake up</label>
                    <input type="time" value={data.sleepEnd || ''} onChange={e => onChange('sleepEnd', e.target.value)}
                        style={timeInput} />
                </div>
            </div>
            {sleepHours > 0 && (
                <>
                    <div style={{ marginTop: '12px', background: 'var(--bg-elevated)', borderRadius: '10px', padding: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <span style={{ fontSize: '18px', fontWeight: 800, color: barColor }}>{sleepHours}h</span>
                            <span style={{ fontSize: '12px', fontWeight: 600, color: debt > 0 ? 'var(--danger)' : 'var(--success)' }}>
                                {debt > 0 ? `Debt: +${debt.toFixed(1)}h` : '✓ Well rested'}
                            </span>
                        </div>
                        <div style={{ height: '6px', borderRadius: '3px', background: 'var(--border)' }}>
                            <div style={{ height: '100%', borderRadius: '3px', background: barColor, width: `${barPct}%`, transition: 'width 0.3s' }} />
                        </div>
                    </div>
                    {sleepHours < 7 && (
                        <div style={{ marginTop: '10px' }}>
                            <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px', display: 'block' }}>Why was sleep poor?</label>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                {SLEEP_TAGS.map(tag => (
                                    <button key={tag} type="button" onClick={() => toggleTag(tag)}
                                        style={{
                                            padding: '6px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: 600,
                                            border: tags.includes(tag) ? '1.5px solid var(--accent)' : '1px solid var(--border)',
                                            background: tags.includes(tag) ? 'rgba(255,107,53,0.15)' : 'var(--bg-elevated)',
                                            color: tags.includes(tag) ? 'var(--accent)' : 'var(--text-2)',
                                            cursor: 'pointer', transition: 'all 0.15s',
                                        }}>
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}
        </SectionCard>
    );
};

export default MobileSleepSection;
