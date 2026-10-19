import React from 'react';

/**
 * PomodoroPresets — Duration preset pills and custom duration inputs.
 */
const PomodoroPresets = ({ presets, selectedPreset, showCustom, isRunning, workDuration, breakDuration, onPresetSelect, onToggleCustom, onDurationEdit }) => (
    <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
        <div style={{ fontSize: '9px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
            Duration
        </div>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '6px' }}>
            {presets.map((p, i) => (
                <button
                    key={i}
                    onClick={() => onPresetSelect(i)}
                    disabled={isRunning}
                    style={{
                        padding: '8px 18px', borderRadius: '99px', fontSize: '13px', fontWeight: 700,
                        cursor: isRunning ? 'not-allowed' : 'pointer', transition: 'all 0.2s',
                        border: selectedPreset === i && !showCustom ? '1px solid var(--accent)' : '1px solid var(--border)',
                        background: selectedPreset === i && !showCustom ? 'var(--accent-dim)' : 'var(--bg-elevated)',
                        color: selectedPreset === i && !showCustom ? 'var(--accent)' : 'var(--text-2)',
                        opacity: isRunning ? 0.5 : 1,
                    }}
                >
                    {p.work} min
                </button>
            ))}
            <button
                onClick={onToggleCustom}
                disabled={isRunning}
                style={{
                    padding: '8px 14px', borderRadius: '99px', fontSize: '12px', fontWeight: 600,
                    cursor: isRunning ? 'not-allowed' : 'pointer', transition: 'all 0.2s',
                    border: showCustom ? '1px solid var(--accent)' : '1px solid var(--border)',
                    background: showCustom ? 'var(--accent-dim)' : 'var(--bg-elevated)',
                    color: showCustom ? 'var(--accent)' : 'var(--text-3)',
                    opacity: isRunning ? 0.5 : 1,
                }}
            >
                ⚙ Custom
            </button>
        </div>

        {!showCustom && (
            <div style={{ fontSize: '11px', color: 'var(--text-3)', fontWeight: 500 }}>
                Rest: {presets[selectedPreset].rest} min
            </div>
        )}

        {showCustom && (
            <div className="fade-up" style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-2)' }}>
                    Focus
                    <input
                        type="number" value={workDuration} min={1} max={120}
                        onChange={(e) => onDurationEdit('work', e.target.value)}
                        style={{
                            width: '52px', textAlign: 'center', background: 'var(--bg-elevated)',
                            border: '1px solid var(--border-accent)', borderRadius: '6px',
                            color: 'var(--accent)', fontSize: '14px', fontWeight: 700, padding: '4px'
                        }}
                    />
                    min
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-2)' }}>
                    Rest
                    <input
                        type="number" value={breakDuration} min={1} max={30}
                        onChange={(e) => onDurationEdit('break', e.target.value)}
                        style={{
                            width: '52px', textAlign: 'center', background: 'var(--bg-elevated)',
                            border: '1px solid var(--border-accent)', borderRadius: '6px',
                            color: 'var(--accent)', fontSize: '14px', fontWeight: 700, padding: '4px'
                        }}
                    />
                    min
                </div>
            </div>
        )}
    </div>
);

export default PomodoroPresets;
