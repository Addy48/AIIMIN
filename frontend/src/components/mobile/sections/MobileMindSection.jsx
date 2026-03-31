import React from 'react';
import { SectionCard } from './Shared';
import { labelSt, numInput } from "../MobileUI";
import { Chip, ToggleRow } from "../MobileComponents";

const MobileMindSection = ({ data, onChange, complete }) => (
    <SectionCard icon="🧠" title="MIND" complete={complete}>
        <div style={{ marginBottom: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={labelSt}>Mood</label>
                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--accent)' }}>{data.mood || '—'}/10</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '16px' }}>😞</span>
                <input type="range" min="1" max="10" value={data.mood || 5}
                    onChange={e => onChange('mood', Number(e.target.value))}
                    style={{ flex: 1, accentColor: 'var(--accent)', height: '28px' }} />
                <span style={{ fontSize: '16px' }}>😄</span>
            </div>
        </div>
        <div style={{ marginBottom: '14px' }}>
            <label style={labelSt}>Energy</label>
            <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                {[1, 2, 3, 4, 5].map(v => (
                    <button key={v} type="button" onClick={() => onChange('energyLevel', v)}
                        style={{
                            width: '36px', height: '36px', borderRadius: '50%', border: 'none',
                            background: v <= (data.energyLevel || 0) ? 'var(--accent)' : 'var(--bg-elevated)',
                            cursor: 'pointer', transition: 'all 0.15s',
                            fontSize: '12px', fontWeight: 700,
                            color: v <= (data.energyLevel || 0) ? '#fff' : 'var(--text-3)',
                        }}>{v}</button>
                ))}
            </div>
        </div>
        <ToggleRow label="Learning" active={data.learningDone} onToggle={() => onChange('learningDone', !data.learningDone)} icon="📚" />
        {data.learningDone && (
            <div style={{ marginTop: '4px' }}>
                <label style={labelSt}>Topic</label>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {['DSA', 'Dev', 'ML', 'Math', 'System Design'].map(t => (
                        <Chip key={t} label={t} active={data.learningTopic === t}
                            onClick={() => onChange('learningTopic', t)} />
                    ))}
                </div>
                <input type="text" value={data.learningTopic || ''} placeholder="Custom topic..."
                    onChange={e => onChange('learningTopic', e.target.value)}
                    style={{ ...numInput, width: '100%', marginTop: '6px', fontSize: '13px' }} />
            </div>
        )}

        {/* Brain Clarity */}
        <div style={{ marginTop: '14px' }}>
            <label style={labelSt}>Brain Clarity</label>
            <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                {[{ v: 1, label: '🌫️ Foggy', color: '#ef4444' }, { v: 2, label: '😐 Okay', color: '#f59e0b' }, { v: 3, label: '⚡ Sharp', color: '#10b981' }].map(opt => (
                    <button key={opt.v} type="button" onClick={() => onChange('brainFog', opt.v)}
                        style={{
                            flex: 1, padding: '8px 4px', borderRadius: '8px', border: 'none',
                            background: data.brainFog === opt.v ? opt.color + '20' : 'var(--bg-elevated)',
                            color: data.brainFog === opt.v ? opt.color : 'var(--text-3)',
                            fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                            outline: data.brainFog === opt.v ? `2px solid ${opt.color}` : '2px solid transparent',
                            transition: 'all 0.15s',
                        }}>{opt.label}</button>
                ))}
            </div>
        </div>

        {/* Headache */}
        <div style={{ marginTop: '10px' }}>
            <ToggleRow label="Headache today?" active={data.headache} onToggle={() => onChange('headache', !data.headache)} icon="🤕" />
        </div>
    </SectionCard>
);

export default MobileMindSection;
