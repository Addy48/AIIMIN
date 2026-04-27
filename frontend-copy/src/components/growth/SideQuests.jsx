import React, { useState } from 'react';

const DEFAULT_QUESTS = [
    { id: 1, text: 'Read 20 pages of a technical book', done: false },
    { id: 2, text: 'Write one thing you learned today', done: false },
    { id: 3, text: 'Message one person from your network', done: false },
];

const SideQuests = () => {
    const [quests, setQuests] = useState(DEFAULT_QUESTS);
    const [input, setInput] = useState('');

    const toggle = id => setQuests(q => q.map(x => x.id === id ? { ...x, done: !x.done } : x));
    const add = () => {
        if (!input.trim()) return;
        setQuests(q => [...q, { id: Date.now(), text: input.trim(), done: false }]);
        setInput('');
    };

    return (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: '20px' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '14px' }}>
                Side Quests
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
                {quests.map(q => (
                    <label key={q.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                        <input type="checkbox" checked={q.done} onChange={() => toggle(q.id)} style={{ accentColor: 'var(--accent)' }} />
                        <span style={{ fontSize: '13px', color: q.done ? 'var(--text-3)' : 'var(--text-1)', textDecoration: q.done ? 'line-through' : 'none' }}>
                            {q.text}
                        </span>
                    </label>
                ))}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
                <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && add()}
                    placeholder="Add a side quest..."
                    style={{ flex: 1, background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '6px', padding: '7px 10px', color: 'var(--text-1)', fontSize: '12px' }}
                />
                <button onClick={add} style={{ padding: '7px 14px', background: 'var(--accent)', border: 'none', borderRadius: '6px', color: '#fff', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
                    +
                </button>
            </div>
        </div>
    );
};

export default SideQuests;
