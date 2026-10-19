import React, { useState } from 'react';

const TODAY_KEY = `aiimin_intention_${new Date().toLocaleDateString('en-CA')}`;

const DailyIntention = () => {
    const [intention, setIntention] = useState(() => localStorage.getItem(TODAY_KEY) || '');
    const [saved, setSaved] = useState(!!localStorage.getItem(TODAY_KEY));

    const handleSave = () => {
        if (!intention.trim()) return;
        localStorage.setItem(TODAY_KEY, intention.trim());
        setSaved(true);
    };

    return (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: '20px' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '10px' }}>
                Today's Intention
            </div>
            {saved ? (
                <div>
                    <div style={{ fontSize: '15px', color: 'var(--text-1)', fontStyle: 'italic', lineHeight: 1.5, marginBottom: '10px' }}>
                        "{intention}"
                    </div>
                    <button onClick={() => setSaved(false)} style={{ fontSize: '11px', color: 'var(--text-3)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                        Edit
                    </button>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <textarea
                        value={intention}
                        onChange={e => setIntention(e.target.value)}
                        placeholder="What is your intention for today?"
                        rows={3}
                        style={{ width: '100%', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '6px', padding: '10px', color: 'var(--text-1)', fontSize: '13px', resize: 'vertical', boxSizing: 'border-box' }}
                    />
                    <button onClick={handleSave} style={{ alignSelf: 'flex-end', padding: '7px 16px', background: 'var(--accent)', border: 'none', borderRadius: '6px', color: '#fff', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
                        Set Intention
                    </button>
                </div>
            )}
        </div>
    );
};

export default DailyIntention;
