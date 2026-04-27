import React, { useState, useEffect, useCallback } from 'react';
import supabase from '../utils/supabase';
import { insertRow, updateRow } from '../services/dbService';
import toast from '../utils/toast';

/* ─── Platform config ─── */
const PLATFORMS = {
    leetcode:    { label: 'LeetCode',     color: '#f89f1b', icon: '🟡' },
    codeforces:  { label: 'Codeforces',   color: '#1890ff', icon: '🔵' },
    gfg:         { label: 'GeeksForGeeks', color: '#2f8d46', icon: '🟢' },
    codechef:    { label: 'CodeChef',     color: '#5b4638', icon: '🟤' },
    hackerrank:  { label: 'HackerRank',   color: '#00ea64', icon: '🟩' },
    other:       { label: 'Other',        color: '#9b8af5', icon: '🟣' },
};

const DIFFICULTIES = {
    easy:   { label: 'Easy',   color: '#10b981', bg: 'rgba(16,185,129,0.08)' },
    medium: { label: 'Medium', color: '#f5a623', bg: 'rgba(245,166,35,0.08)' },
    hard:   { label: 'Hard',   color: '#ef4444', bg: 'rgba(239,68,68,0.08)' },
};

/* ─── Add problem form ─── */
const AddProblemForm = ({ onSubmit, onCancel }) => {
    const [title, setTitle] = useState('');
    const [platform, setPlatform] = useState('leetcode');
    const [difficulty, setDifficulty] = useState('medium');
    const [topic, setTopic] = useState('');

    const handleSubmit = () => {
        if (!title.trim()) { toast.error('Problem name required'); return; }
        onSubmit({ title: title.trim(), platform, difficulty, topic: topic.trim() || null });
        setTitle(''); setTopic('');
    };

    return (
        <div style={{
            padding: '16px', background: 'var(--bg-elevated)', borderRadius: '12px',
            border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '12px',
        }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-1)' }}>Log Problem</div>

            <input
                type="text" placeholder="Problem name (e.g. Two Sum)"
                value={title} onChange={e => setTitle(e.target.value)} autoFocus
                onKeyDown={e => { if (e.key === 'Enter' && title.trim()) handleSubmit(); }}
                style={{
                    width: '100%', padding: '10px 12px', borderRadius: '8px',
                    border: '1px solid var(--border)', background: 'var(--bg-primary)',
                    color: 'var(--text-1)', fontSize: '14px', fontWeight: 600, outline: 'none',
                }}
            />

            {/* Platform selector */}
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                {Object.entries(PLATFORMS).map(([key, cfg]) => (
                    <button key={key} onClick={() => setPlatform(key)} style={{
                        padding: '5px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 700,
                        border: platform === key ? `1px solid ${cfg.color}` : '1px solid var(--border)',
                        background: platform === key ? `${cfg.color}15` : 'transparent',
                        color: platform === key ? cfg.color : 'var(--text-3)',
                        cursor: 'pointer', transition: 'all 0.15s',
                    }}>
                        {cfg.icon} {cfg.label}
                    </button>
                ))}
            </div>

            {/* Difficulty */}
            <div style={{ display: 'flex', gap: '6px' }}>
                {Object.entries(DIFFICULTIES).map(([key, cfg]) => (
                    <button key={key} onClick={() => setDifficulty(key)} style={{
                        flex: 1, padding: '7px 0', borderRadius: '8px', fontSize: '12px', fontWeight: 700,
                        border: difficulty === key ? `1px solid ${cfg.color}` : '1px solid var(--border)',
                        background: difficulty === key ? cfg.bg : 'transparent',
                        color: difficulty === key ? cfg.color : 'var(--text-3)',
                        cursor: 'pointer', transition: 'all 0.15s',
                    }}>
                        {cfg.label}
                    </button>
                ))}
            </div>

            {/* Topic tag */}
            <input
                type="text" placeholder="Topic (optional — e.g. DP, Trees, Graphs)"
                value={topic} onChange={e => setTopic(e.target.value)}
                style={{
                    width: '100%', padding: '8px 12px', borderRadius: '8px',
                    border: '1px solid var(--border)', background: 'var(--bg-primary)',
                    color: 'var(--text-1)', fontSize: '12px', outline: 'none',
                }}
            />

            {/* Actions */}
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button onClick={onCancel} style={{
                    padding: '8px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: 700,
                    background: 'transparent', color: 'var(--text-3)', border: '1px solid var(--border)', cursor: 'pointer',
                }}>Cancel</button>
                <button onClick={handleSubmit} style={{
                    padding: '8px 20px', borderRadius: '8px', fontSize: '12px', fontWeight: 700,
                    background: 'var(--accent)', color: 'white', border: 'none', cursor: 'pointer',
                    opacity: title.trim() ? 1 : 0.5,
                }}>Log</button>
            </div>
        </div>
    );
};

/* ─── Single problem row ─── */
const ProblemRow = ({ problem, onDelete }) => {
    const plat = PLATFORMS[problem.platform] || PLATFORMS.other;
    const diff = DIFFICULTIES[problem.difficulty] || DIFFICULTIES.medium;
    const solvedDate = new Date(problem.solved_at);

    return (
        <div style={{
            display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px',
            background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '10px',
        }}>
            <span style={{ fontSize: '14px' }}>{plat.icon}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {problem.title}
                </div>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginTop: '3px' }}>
                    <span style={{
                        fontSize: '10px', fontWeight: 700, color: diff.color,
                        padding: '1px 6px', borderRadius: '4px', background: diff.bg,
                    }}>
                        {diff.label}
                    </span>
                    {problem.topic && (
                        <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-3)' }}>
                            {problem.topic}
                        </span>
                    )}
                    <span style={{ fontSize: '10px', color: 'var(--text-3)' }}>
                        {solvedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                </div>
            </div>
            <button onClick={() => onDelete(problem.id)} style={{
                width: '26px', height: '26px', borderRadius: '6px', border: 'none',
                background: 'transparent', color: 'var(--text-3)', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px',
            }} title="Remove">✕</button>
        </div>
    );
};

/* ─── Main DSA Counter ─── */
const DSACounter = ({ user }) => {
    const [problems, setProblems] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [viewRange, setViewRange] = useState('week'); // week | month | all

    const fetchProblems = useCallback(async () => {
        if (!user?.id) return;
        setLoading(true);

        let query = supabase.from('dsa_problems').select('*')
            .eq('user_id', user.id).is('deleted_at', null)
            .order('solved_at', { ascending: false });

        // Date filter
        const now = new Date();
        if (viewRange === 'week') {
            const weekAgo = new Date(now);
            weekAgo.setDate(weekAgo.getDate() - 7);
            query = query.gte('solved_at', weekAgo.toISOString());
        } else if (viewRange === 'month') {
            const monthAgo = new Date(now);
            monthAgo.setDate(monthAgo.getDate() - 30);
            query = query.gte('solved_at', monthAgo.toISOString());
        }

        const { data, error } = await query;
        if (!error) setProblems(data || []);
        setLoading(false);
    }, [user?.id, viewRange]);

    useEffect(() => { fetchProblems(); }, [fetchProblems]);

    const handleAdd = async (formValues) => {
        try {
            await insertRow('dsa_problems', {
                user_id: user.id,
                title: formValues.title,
                platform: formValues.platform,
                difficulty: formValues.difficulty,
                topic: formValues.topic,
                solved_at: new Date().toISOString(),
            });
            toast.success('Problem logged');
            setShowForm(false);
            fetchProblems();
        } catch (err) { toast.error(err.message); }
    };

    const handleDelete = async (id) => {
        try {
            await updateRow('dsa_problems', { deleted_at: new Date().toISOString() }, 'id', id);
            fetchProblems();
        } catch (err) { toast.error(err.message); }
    };

    /* ── Stats ── */
    const byDifficulty = { easy: 0, medium: 0, hard: 0 };
    const byPlatform = {};
    problems.forEach(p => {
        byDifficulty[p.difficulty] = (byDifficulty[p.difficulty] || 0) + 1;
        byPlatform[p.platform] = (byPlatform[p.platform] || 0) + 1;
    });

    const topPlatform = Object.entries(byPlatform).sort((a, b) => b[1] - a[1])[0];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* ── Header ── */}
            <div style={{
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: '16px', padding: '20px 22px', boxShadow: 'var(--shadow-sm)',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                            width: '34px', height: '34px', background: 'var(--bg-elevated)',
                            border: '1px solid var(--border)', borderRadius: '10px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px'
                        }}>💻</div>
                        <div>
                            <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-1)' }}>DSA Tracker</div>
                            <div style={{ fontSize: '10px', color: 'var(--text-3)', fontWeight: 500 }}>
                                Coding problems solved
                            </div>
                        </div>
                    </div>
                    <button onClick={() => { setShowForm(true); }} style={{
                        display: 'flex', alignItems: 'center', gap: '5px',
                        padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 700,
                        background: 'var(--accent)', color: 'white', border: 'none', cursor: 'pointer',
                    }}>
                        <span style={{ fontSize: '14px' }}>+</span> Log
                    </button>
                </div>

                {/* Stats row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                    <div style={{ textAlign: 'center', padding: '10px 0', background: 'var(--bg-elevated)', borderRadius: '10px', border: '1px solid var(--border)' }}>
                        <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-1)' }}>{problems.length}</div>
                        <div style={{ fontSize: '9px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total</div>
                    </div>
                    {Object.entries(DIFFICULTIES).map(([key, cfg]) => (
                        <div key={key} style={{ textAlign: 'center', padding: '10px 0', background: cfg.bg, borderRadius: '10px', border: `1px solid ${cfg.color}20` }}>
                            <div style={{ fontSize: '20px', fontWeight: 800, color: cfg.color }}>{byDifficulty[key] || 0}</div>
                            <div style={{ fontSize: '9px', fontWeight: 700, color: cfg.color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{cfg.label}</div>
                        </div>
                    ))}
                </div>

                {/* Top platform */}
                {topPlatform && (
                    <div style={{ marginTop: '10px', fontSize: '11px', color: 'var(--text-3)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>{PLATFORMS[topPlatform[0]]?.icon}</span>
                        Most active: {PLATFORMS[topPlatform[0]]?.label} ({topPlatform[1]} solved)
                    </div>
                )}

                {/* Range toggle */}
                <div style={{ display: 'flex', gap: '4px', marginTop: '14px', background: 'var(--bg-elevated)', borderRadius: '8px', padding: '3px' }}>
                    {[
                        { key: 'week', label: 'This Week' },
                        { key: 'month', label: 'This Month' },
                        { key: 'all', label: 'All Time' },
                    ].map(r => (
                        <button key={r.key} onClick={() => setViewRange(r.key)} style={{
                            flex: 1, padding: '6px 0', borderRadius: '6px', fontSize: '11px', fontWeight: 700,
                            border: 'none', cursor: 'pointer', transition: 'all 0.15s',
                            background: viewRange === r.key ? 'var(--bg-card)' : 'transparent',
                            color: viewRange === r.key ? 'var(--text-1)' : 'var(--text-3)',
                            boxShadow: viewRange === r.key ? 'var(--shadow-sm)' : 'none',
                        }}>
                            {r.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Add form ── */}
            {showForm && (
                <AddProblemForm onSubmit={handleAdd} onCancel={() => setShowForm(false)} />
            )}

            {/* ── Problems list ── */}
            <div style={{
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: '16px', padding: '18px 20px', boxShadow: 'var(--shadow-sm)',
            }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-1)', marginBottom: '12px' }}>
                    Recent Problems
                </div>
                {loading ? (
                    <div style={{ padding: '20px', textAlign: 'center', fontSize: '12px', color: 'var(--text-3)' }}>Loading...</div>
                ) : problems.length === 0 ? (
                    <div style={{
                        padding: '32px 20px', textAlign: 'center',
                        border: '1px dashed var(--border)', borderRadius: '12px',
                    }}>
                        <div style={{ fontSize: '20px', marginBottom: '8px' }}>📝</div>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-2)' }}>No problems logged yet</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-3)', marginTop: '4px' }}>
                            Click + Log to record your first solved problem
                        </div>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {problems.map(p => (
                            <ProblemRow key={p.id} problem={p} onDelete={handleDelete} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DSACounter;
