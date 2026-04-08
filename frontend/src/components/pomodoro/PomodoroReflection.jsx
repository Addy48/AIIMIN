import React from 'react';

/**
 * PomodoroReflection — Post-session reflection panel.
 */
const PomodoroReflection = ({ sessionMood, setSessionMood, sessionNote, setSessionNote, onSave, onSkip }) => (
    <div className="fade-up" style={{
        marginTop: '16px', padding: '24px', background: 'var(--bg-elevated)',
        border: '1px solid var(--border-accent)', borderRadius: '16px',
        boxShadow: 'var(--shadow-md)', textAlign: 'left', position: 'relative'
    }}>
        <button 
            onClick={onSkip}
            style={{ 
                position: 'absolute', top: '16px', right: '16px', 
                background: 'none', border: 'none', color: 'var(--text-3)', 
                cursor: 'pointer', padding: '4px' 
            }}
        >
            <span style={{ fontSize: '18px' }}>✕</span>
        </button>
        <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-1)', marginBottom: '12px' }}>
            Great focus! Quick reflection:
        </h4>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            {['😔', '😕', '😐', '🙂', '🔥'].map((emoji, i) => (
                <button
                    key={i}
                    onClick={() => setSessionMood(emoji)}
                    style={{
                        flex: 1, height: '36px', borderRadius: '8px', border: '1px solid var(--border)',
                        background: sessionMood === emoji ? 'var(--accent-dim)' : 'var(--bg-card)',
                        borderColor: sessionMood === emoji ? 'var(--accent)' : 'var(--border)',
                        fontSize: '18px', cursor: 'pointer', transition: 'all 0.2s'
                    }}
                >
                    {emoji}
                </button>
            ))}
        </div>
        <textarea
            placeholder="Key insight or struggle... (optional)"
            value={sessionNote}
            onChange={(e) => setSessionNote(e.target.value)}
            style={{
                width: '100%', height: '60px', borderRadius: '8px', padding: '10px',
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                color: 'var(--text-1)', fontSize: '13px', resize: 'none', outline: 'none',
                marginBottom: '16px'
            }}
        />
        <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={onSkip} style={{
                flex: 1, padding: '10px', borderRadius: '8px', background: 'var(--bg-card)',
                border: '1px solid var(--border)', color: 'var(--text-2)', fontSize: '13px', fontWeight: 700, cursor: 'pointer'
            }}>Skip</button>
            <button onClick={onSave} style={{
                flex: 2, padding: '10px', borderRadius: '8px', background: 'var(--accent)',
                border: 'none', color: 'white', fontSize: '13px', fontWeight: 700, cursor: 'pointer'
            }}>Save & Take Break</button>
        </div>
    </div>
);

export default PomodoroReflection;
