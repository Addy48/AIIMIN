import React, { useState, useEffect } from 'react';

const DSA_PLATFORMS = { leetcode: '🟡', codeforces: '🔵', gfg: '🟢', codechef: '🟤', hackerrank: '🟩', other: '🟣' };
const DSA_DIFF = { easy: 'var(--color-success)', medium: 'var(--color-warning)', hard: 'var(--color-danger)' };

const MobileDSASection = ({ user }) => {
    const [problems, setProblems] = useState([]);
    const [adding, setAdding] = useState(false);
    const [title, setTitle] = useState('');
    const [platform, setPlatform] = useState('leetcode');
    const [difficulty, setDifficulty] = useState('medium');

    useEffect(() => {
        if (!user) return;
        (async () => {
            const { default: supabase } = await import('../../../utils/supabase');
            const { data } = await supabase.from('dsa_problems')
                .select('*').eq('user_id', user.id).is('deleted_at', null)
                .order('solved_at', { ascending: false }).limit(30);
            if (data) setProblems(data);
        })();
    }, [user]);

    const handleAdd = async () => {
        if (!title.trim()) return;
        try {
            const { insertRow } = await import('../../../services/dbService');
            const row = await insertRow('dsa_problems', {
                user_id: user.id, title: title.trim(), platform, difficulty,
            });
            if (row?.[0]) setProblems(prev => [row[0], ...prev]);
            setTitle(''); setAdding(false);
        } catch {
            const { default: toast } = await import('../../../utils/toast');
            toast.error('Failed to log problem');
        }
    };

    const todayStr = new Date().toLocaleDateString('en-CA');
    const todayCount = problems.filter(p => p.solved_at?.startsWith(todayStr)).length;
    const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7);
    const weekCount = problems.filter(p => new Date(p.solved_at) >= weekAgo).length;
    const byDiff = { easy: 0, medium: 0, hard: 0 };
    problems.forEach(p => { if (byDiff[p.difficulty] !== undefined) byDiff[p.difficulty]++; });

    return (
        <div style={{
            background: 'var(--bg-card)', borderRadius: '14px', padding: '16px',
            border: '1px solid var(--border)', margin: '0 16px',
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>🧩 DSA TRACKER</span>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent)' }}>{problems.length} total</span>
            </div>

            {/* Stats row */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                <div style={{ flex: 1, background: 'var(--bg-elevated)', borderRadius: '8px', padding: '8px', textAlign: 'center' }}>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--accent)' }}>{todayCount}</div>
                    <div style={{ fontSize: '10px', color: 'var(--text-3)', fontWeight: 600 }}>Today</div>
                </div>
                <div style={{ flex: 1, background: 'var(--bg-elevated)', borderRadius: '8px', padding: '8px', textAlign: 'center' }}>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-1)' }}>{weekCount}</div>
                    <div style={{ fontSize: '10px', color: 'var(--text-3)', fontWeight: 600 }}>This Week</div>
                </div>
                {Object.entries(byDiff).map(([d, c]) => (
                    <div key={d} style={{ flex: 1, background: 'var(--bg-elevated)', borderRadius: '8px', padding: '8px', textAlign: 'center' }}>
                        <div style={{ fontSize: '18px', fontWeight: 800, color: DSA_DIFF[d] }}>{c}</div>
                        <div style={{ fontSize: '10px', color: 'var(--text-3)', fontWeight: 600, textTransform: 'capitalize' }}>{d}</div>
                    </div>
                ))}
            </div>

            {/* Add form */}
            {adding ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <input type="text" placeholder="Problem name" value={title} onChange={e => setTitle(e.target.value)} autoFocus
                        onKeyDown={e => { if (e.key === 'Enter' && title.trim()) handleAdd(); }}
                        style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-elevated)', color: 'var(--text-1)', fontSize: '13px', fontWeight: 600 }} />
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                        {Object.entries(DSA_PLATFORMS).map(([k, icon]) => (
                            <button key={k} type="button" onClick={() => setPlatform(k)}
                                style={{ padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 600, border: platform === k ? '1px solid var(--accent)' : '1px solid var(--border)', background: platform === k ? 'var(--accent-dim)' : 'transparent', color: platform === k ? 'var(--accent)' : 'var(--text-3)', cursor: 'pointer' }}>
                                {icon} {k}
                            </button>
                        ))}
                    </div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                        {Object.entries(DSA_DIFF).map(([d, color]) => (
                            <button key={d} type="button" onClick={() => setDifficulty(d)}
                                style={{ flex: 1, padding: '6px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, border: difficulty === d ? `1px solid ${color}` : '1px solid var(--border)', background: difficulty === d ? `var(--color-${d === 'easy' ? 'success' : d === 'medium' ? 'warning' : 'danger'}-dim)` : 'transparent', color: difficulty === d ? color : 'var(--text-3)', cursor: 'pointer', textTransform: 'capitalize' }}>
                                {d}
                            </button>
                        ))}
                    </div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                        <button type="button" onClick={handleAdd} style={{ flex: 1, padding: '8px', borderRadius: '8px', border: 'none', background: 'var(--accent)', color: '#fff', fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}>Save</button>
                        <button type="button" onClick={() => { setAdding(false); setTitle(''); }} style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-3)', fontWeight: 600, fontSize: '12px', cursor: 'pointer' }}>Cancel</button>
                    </div>
                </div>
            ) : (
                <button type="button" onClick={() => setAdding(true)} style={{
                    width: '100%', padding: '10px', borderRadius: '8px', border: '1px dashed var(--border)',
                    background: 'transparent', color: 'var(--text-3)', fontWeight: 600, fontSize: '12px', cursor: 'pointer',
                }}>+ Log Problem</button>
            )}

            {/* Recent problems */}
            {problems.slice(0, 5).map(p => (
                <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 0', borderTop: '1px solid var(--border)', marginTop: '6px' }}>
                    <span>{DSA_PLATFORMS[p.platform] || '🟣'}</span>
                    <span style={{ flex: 1, fontSize: '12px', fontWeight: 600, color: 'var(--text-1)' }}>{p.title}</span>
                    <span style={{ fontSize: '10px', fontWeight: 700, color: DSA_DIFF[p.difficulty] || 'var(--text-3)', textTransform: 'uppercase' }}>{p.difficulty}</span>
                </div>
            ))}
        </div>
    );
};

export default MobileDSASection;
