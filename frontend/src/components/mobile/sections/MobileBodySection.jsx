import React from 'react';
import { SectionCard } from './Shared';
import { labelSt, numInput, stepBtn } from "../MobileUI";
import { Chip, MiniChip } from "../MobileComponents";

const MobileBodySection = ({ data, onChange, complete }) => (
    <SectionCard icon="💪" title="BODY" complete={complete}>
        {/* Gym — Yes / No */}
        <div style={{ marginBottom: '8px' }}>
            <label style={labelSt}>Gym</label>
            <div style={{ display: 'flex', gap: '8px' }}>
                <button type="button" onClick={() => onChange('gymDone', true)} style={{
                    flex: 1, padding: '10px', borderRadius: '10px', fontSize: '13px', fontWeight: 700,
                    border: data.gymDone ? '1.5px solid var(--success)' : '1px solid var(--border)',
                    background: data.gymDone ? 'rgba(16,185,129,0.12)' : 'var(--bg-elevated)',
                    color: data.gymDone ? 'var(--success)' : 'var(--text-3)', cursor: 'pointer',
                }}>✓ Yes</button>
                <button type="button" onClick={() => { onChange('gymDone', false); onChange('gymDuration', 0); }} style={{
                    flex: 1, padding: '10px', borderRadius: '10px', fontSize: '13px', fontWeight: 700,
                    border: data.gymDone === false ? '1.5px solid var(--danger)' : '1px solid var(--border)',
                    background: data.gymDone === false ? 'rgba(239,68,68,0.08)' : 'var(--bg-elevated)',
                    color: data.gymDone === false ? 'var(--danger)' : 'var(--text-3)', cursor: 'pointer',
                }}>✗ No</button>
            </div>
        </div>
        {data.gymDone && (
            <div style={{ marginBottom: '12px' }}>
                <label style={labelSt}>Duration</label>
                <div style={{ display: 'flex', gap: '6px' }}>
                    {[30, 45, 60, 90].map(m => (
                        <Chip key={m} label={`${m}m`} active={data.gymDuration === m}
                            onClick={() => onChange('gymDuration', m)} />
                    ))}
                </div>
            </div>
        )}

        {/* Breakfast — Yes / No */}
        <div style={{ marginBottom: '8px' }}>
            <label style={labelSt}>🍳 Breakfast</label>
            <div style={{ display: 'flex', gap: '8px' }}>
                <button type="button" onClick={() => onChange('breakfastDone', true)} style={{
                    flex: 1, padding: '10px', borderRadius: '10px', fontSize: '13px', fontWeight: 700,
                    border: data.breakfastDone ? '1.5px solid var(--success)' : '1px solid var(--border)',
                    background: data.breakfastDone ? 'rgba(16,185,129,0.12)' : 'var(--bg-elevated)',
                    color: data.breakfastDone ? 'var(--success)' : 'var(--text-3)', cursor: 'pointer',
                }}>✓ Yes</button>
                <button type="button" onClick={() => onChange('breakfastDone', false)} style={{
                    flex: 1, padding: '10px', borderRadius: '10px', fontSize: '13px', fontWeight: 700,
                    border: data.breakfastDone === false ? '1.5px solid var(--danger)' : '1px solid var(--border)',
                    background: data.breakfastDone === false ? 'rgba(239,68,68,0.08)' : 'var(--bg-elevated)',
                    color: data.breakfastDone === false ? 'var(--danger)' : 'var(--text-3)', cursor: 'pointer',
                }}>✗ No</button>
            </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '4px' }}>
            <div>
                <label style={labelSt}>Steps</label>
                <input type="text" inputMode="numeric" value={data.steps || ''} placeholder="0"
                    onChange={e => { const v = e.target.value.replace(/\D/g, ''); onChange('steps', v ? Number(v) : 0); }}
                    style={{ ...numInput, MozAppearance: 'textfield', WebkitAppearance: 'none' }} />
                <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                    {[5000, 8000, 10000, 12000].map(v => (
                        <MiniChip key={v} label={`${v / 1000}k`} onClick={() => onChange('steps', v)} active={data.steps === v} />
                    ))}
                </div>
            </div>
            <div>
                <label style={labelSt}>💧 Water</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                    <button type="button" onClick={() => onChange('waterBottles', Math.max(0, (data.waterBottles || 0) - 1))}
                        style={stepBtn}>−</button>
                    <span style={{ fontSize: '20px', fontWeight: 800, color: (data.waterBottles || 0) >= 3 ? 'var(--accent)' : 'var(--text-1)', flex: 1, textAlign: 'center' }}>
                        {data.waterBottles || 0}
                    </span>
                    <button type="button" onClick={() => onChange('waterBottles', (data.waterBottles || 0) + 1)}
                        style={{ ...stepBtn, borderColor: 'var(--accent)', color: 'var(--accent)', background: 'var(--accent-dim)' }}>+</button>
                </div>
                <div style={{ fontSize: '9px', color: 'var(--text-3)', textAlign: 'center', marginTop: '2px' }}>
                    {(data.waterBottles || 0) >= 3 ? '🎯 Goal met' : '× 1.5L · Goal: 3'}
                </div>
            </div>
        </div>
    </SectionCard>
);

export default MobileBodySection;
