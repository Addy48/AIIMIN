import React, { useState } from 'react';

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

    return (
        <SectionCard icon="🌙" title="SLEEP" complete={complete}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                    <label style={labelSt}>Bedtime</label>
                    <input type="time" value={data.sleepStart || ''} onChange={e => onChange('sleepStart', e.target.value)}
                        style={timeInput} />
                </div>
                <div>
                    <label style={labelSt}>Wake up</label>
                    <input type="time" value={data.sleepEnd || ''} onChange={e => onChange('sleepEnd', e.target.value)}
                        style={timeInput} />
                </div>
            </div>
            {sleepHours > 0 && (
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
            )}
        </SectionCard>
    );
};

const MobileBodySection = ({ data, onChange, complete }) => (
    <SectionCard icon="💪" title="BODY" complete={complete}>
        <ToggleRow label="Gym" active={data.gymDone} onToggle={() => onChange('gymDone', !data.gymDone)} />
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
        <ToggleRow label="Breakfast" active={data.breakfastDone} onToggle={() => onChange('breakfastDone', !data.breakfastDone)} icon="🍳" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '4px' }}>
            <div>
                <label style={labelSt}>Steps</label>
                <input type="number" inputMode="numeric" value={data.steps || ''} placeholder="0"
                    onChange={e => onChange('steps', e.target.value ? Number(e.target.value) : 0)}
                    style={numInput} />
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
    </SectionCard>
);

const MobileTaskSection = ({ tasks, onAdd, onToggle }) => {
    const [title, setTitle] = useState('');
    const [type, setType] = useState('task');
    const [time, setTime] = useState('');

    const handleAdd = () => {
        if (!title.trim()) return;
        onAdd({ title: title.trim(), type, time: time || null });
        setTitle(''); setTime('');
    };

    const pending = tasks.filter(t => !t.completed);
    const done = tasks.filter(t => t.completed);

    return (
        <SectionCard icon="📋" title="TASKS & REMINDERS">
            <div style={{ background: 'var(--bg-elevated)', borderRadius: '10px', padding: '12px', marginBottom: '12px' }}>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)}
                    placeholder="What needs to be done?" onKeyDown={e => e.key === 'Enter' && handleAdd()}
                    style={{ ...numInput, width: '100%', marginBottom: '8px', fontSize: '14px' }} />
                <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
                    {['task', 'reminder', 'todo'].map(t => (
                        <Chip key={t} label={t.charAt(0).toUpperCase() + t.slice(1)} active={type === t}
                            onClick={() => setType(t)} />
                    ))}
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input type="time" value={time} onChange={e => setTime(e.target.value)}
                        style={{ ...timeInput, flex: 1 }} />
                    <button onClick={handleAdd} disabled={!title.trim()}
                        style={{
                            padding: '10px 16px', borderRadius: '8px', border: 'none',
                            background: title.trim() ? 'var(--accent)' : 'var(--bg-card)',
                            color: title.trim() ? '#fff' : 'var(--text-3)',
                            fontWeight: 700, fontSize: '13px', cursor: title.trim() ? 'pointer' : 'default',
                            minHeight: '44px',
                        }}>Add ✓</button>
                </div>
            </div>
            {pending.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    {pending.map(t => <TaskRow key={t.id} task={t} onToggle={onToggle} />)}
                </div>
            )}
            {done.length > 0 && (
                <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    {done.map(t => <TaskRow key={t.id} task={t} onToggle={onToggle} />)}
                </div>
            )}
            {tasks.length === 0 && (
                <p style={{ fontSize: '12px', color: 'var(--text-3)', textAlign: 'center', padding: '8px' }}>
                    No tasks today. Add one above.
                </p>
            )}
        </SectionCard>
    );
};

const MobileMoneySection = ({ user, accounts }) => {
    const [txType, setTxType] = useState('expense');
    const [amount, setAmount] = useState('');
    const [desc, setDesc] = useState('');
    const [category, setCategory] = useState('');
    const [accountId, setAccountId] = useState('');
    const [recent, setRecent] = useState([]);
    const [saving, setSaving] = useState(false);

    const CATS = [
        { name: 'Food & Dining', icon: '🍛', color: '#ff6b35' },
        { name: 'Transport', icon: '🚗', color: '#3b82f6' },
        { name: 'Shopping', icon: '🛍️', color: '#a855f7' },
        { name: 'Utilities', icon: '🏠', color: '#f59e0b' },
        { name: 'Health', icon: '💊', color: '#10b981' },
        { name: 'Entertainment', icon: '🎬', color: '#ec4899' },
        { name: 'Other', icon: '📦', color: '#6b7280' },
    ];

    const KEYWORDS = {
        'Food & Dining': ['food', 'zomato', 'swiggy', 'lunch', 'dinner', 'breakfast', 'tea', 'coffee', 'snack', 'restaurant', 'cafe', 'biryani', 'pizza', 'burger', 'dominos', 'mcdonalds', 'kfc', 'mess', 'canteen', 'maggi', 'juice'],
        'Transport': ['uber', 'ola', 'metro', 'bus', 'train', 'petrol', 'fuel', 'auto', 'cab', 'rapido', 'parking', 'toll', 'diesel', 'rickshaw', 'taxi'],
        'Shopping': ['amazon', 'flipkart', 'myntra', 'clothes', 'shoes', 'electronics', 'phone', 'meesho', 'charger', 'headphones'],
        'Utilities': ['electricity', 'rent', 'wifi', 'water', 'gas', 'recharge', 'bill', 'maintenance', 'jio', 'airtel'],
        'Health': ['medicine', 'doctor', 'gym', 'pharmacy', 'hospital', 'supplement', 'protein', 'apollo', 'test'],
        'Entertainment': ['netflix', 'movie', 'spotify', 'game', 'concert', 'subscription', 'hotstar', 'prime'],
    };

    const matchCategory = (text) => {
        const lower = text.toLowerCase();
        for (const [cat, words] of Object.entries(KEYWORDS)) {
            if (words.some(w => lower.includes(w))) return cat;
        }
        return 'Other';
    };

    const handleDescChange = (val) => {
        setDesc(val);
        if (val.length >= 2 && !category) {
            const matched = matchCategory(val);
            if (matched !== 'Other') setCategory(matched);
        }
    };

    const handleLog = async () => {
        if (!amount || isNaN(amount)) return;
        setSaving(true);
        try {
            const { insertRow } = await import('../../services/dbService');
            const now = new Date();
            const dateStr = now.toLocaleDateString('en-CA');
            const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
            let finalAmount = parseFloat(amount);
            if (txType === 'expense') finalAmount = -Math.abs(finalAmount);
            else finalAmount = Math.abs(finalAmount);

            const catName = txType === 'income' ? 'Income' : (category || 'Other');

            const data = await insertRow('money_transactions', {
                user_id: user.id, date: dateStr, category: catName,
                description: desc.trim() || null, amount: finalAmount,
                source: 'mobile', currency: 'INR',
                type: txType, account_id: accountId || null,
                time_of_day: timeStr,
            });

            if (data?.[0]) {
                setRecent(prev => [data[0], ...prev].slice(0, 5));
                const { default: toast } = await import('../../utils/toast');
                toast.success('Logged ✓');
            }
            setAmount(''); setDesc(''); setCategory('');
        } catch (err) {
            const { default: toast } = await import('../../utils/toast');
            toast.error('Failed: ' + err.message);
        }
        setSaving(false);
    };

    // Fetch today's recent on mount
    React.useEffect(() => {
        if (!user) return;
        const fetchRecent = async () => {
            const { default: supabase } = await import('../../utils/supabase');
            const today = new Date().toLocaleDateString('en-CA');
            const { data } = await supabase.from('money_transactions')
                .select('*').eq('user_id', user.id).eq('date', today)
                .order('created_at', { ascending: false }).limit(5);
            if (data) setRecent(data);
        };
        fetchRecent();
    }, [user]);

    const fmtINR = (v) => '₹' + Math.abs(v).toLocaleString('en-IN', { maximumFractionDigits: 0 });

    const relTime = (ts) => {
        const diff = (Date.now() - new Date(ts).getTime()) / 60000;
        if (diff < 60) return `${Math.round(diff)}m`;
        return `${Math.round(diff / 60)}h`;
    };

    return (
        <SectionCard icon="💸" title="MONEY">
            {/* IN / OUT toggle */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
                <button type="button" onClick={() => setTxType('income')}
                    style={{
                        padding: '12px', borderRadius: '10px', border: 'none', fontWeight: 700, fontSize: '14px',
                        cursor: 'pointer', minHeight: '48px',
                        background: txType === 'income' ? '#0A1F14' : 'var(--bg-elevated)',
                        color: txType === 'income' ? '#63C185' : 'var(--text-3)',
                    }}>💰 IN</button>
                <button type="button" onClick={() => setTxType('expense')}
                    style={{
                        padding: '12px', borderRadius: '10px', border: 'none', fontWeight: 700, fontSize: '14px',
                        cursor: 'pointer', minHeight: '48px',
                        background: txType === 'expense' ? '#1F0A0A' : 'var(--bg-elevated)',
                        color: txType === 'expense' ? '#EF4444' : 'var(--text-3)',
                    }}>💸 OUT</button>
            </div>

            {/* Amount */}
            <div style={{ marginBottom: '10px' }}>
                <label style={labelSt}>Amount</label>
                <input type="number" inputMode="decimal" value={amount} placeholder="₹ 0"
                    onChange={e => setAmount(e.target.value)}
                    style={{ ...numInput, fontSize: '22px', fontWeight: 800, width: '100%', padding: '12px' }} />
            </div>

            {/* Description */}
            <div style={{ marginBottom: '10px' }}>
                <label style={labelSt}>What for?</label>
                <input type="text" value={desc} placeholder="e.g. Uber, Groceries..."
                    onChange={e => handleDescChange(e.target.value)}
                    style={{ ...numInput, width: '100%', fontSize: '14px' }} />
                {category && (
                    <div style={{ marginTop: '6px', display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                        {CATS.map(c => (
                            <button key={c.name} type="button" onClick={() => setCategory(c.name)}
                                style={{
                                    padding: '5px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: 600,
                                    border: `1.5px solid ${category === c.name ? c.color : 'var(--border)'}`,
                                    background: category === c.name ? c.color + '22' : 'var(--bg-elevated)',
                                    color: category === c.name ? c.color : 'var(--text-3)',
                                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px',
                                }}>
                                {c.icon} {c.name.split(' ')[0]}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Account */}
            {accounts.length > 0 && (
                <div style={{ marginBottom: '10px' }}>
                    <label style={labelSt}>Account</label>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {accounts.map(a => (
                            <button key={a.id} type="button" onClick={() => setAccountId(accountId === a.id ? '' : a.id)}
                                style={{
                                    padding: '8px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 600,
                                    border: `1.5px solid ${accountId === a.id ? 'var(--accent)' : 'var(--border)'}`,
                                    background: accountId === a.id ? 'var(--accent-dim)' : 'var(--bg-elevated)',
                                    color: accountId === a.id ? 'var(--accent)' : 'var(--text-3)',
                                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px',
                                    minHeight: '44px',
                                }}>
                                {a.icon} {a.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Timestamp */}
            <div style={{ fontSize: '11px', color: 'var(--text-3)', marginBottom: '10px' }}>
                ⏱ {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} · {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </div>

            {/* Log button */}
            <button onClick={handleLog} disabled={saving || !amount}
                style={{
                    width: '100%', padding: '14px', borderRadius: '10px', border: 'none',
                    background: amount ? 'var(--accent)' : 'var(--bg-elevated)',
                    color: amount ? '#fff' : 'var(--text-3)',
                    fontWeight: 700, fontSize: '14px', minHeight: '48px',
                    cursor: amount ? 'pointer' : 'default', opacity: saving ? 0.6 : 1,
                }}>
                {saving ? 'Logging...' : 'Log ✓'}
            </button>

            {/* Recent */}
            {recent.length > 0 && (
                <div style={{ marginTop: '14px', borderTop: '1px solid var(--border)', paddingTop: '10px' }}>
                    <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', marginBottom: '6px' }}>Today's Log</div>
                    {recent.map((tx, i) => {
                        const isIn = Number(tx.amount) > 0;
                        const cat = CATS.find(c => c.name === tx.category);
                        return (
                            <div key={tx.id || i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 0', fontSize: '12px' }}>
                                <span style={{ color: isIn ? 'var(--success)' : 'var(--danger)', fontWeight: 700 }}>{isIn ? '↑' : '↓'}</span>
                                <span style={{ fontWeight: 700, color: 'var(--text-1)', minWidth: '55px' }}>{fmtINR(tx.amount)}</span>
                                <span style={{ color: 'var(--text-2)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tx.description || tx.category}</span>
                                {cat && <span style={{ fontSize: '10px' }}>{cat.icon}</span>}
                                <span style={{ color: 'var(--text-3)', fontSize: '10px' }}>{relTime(tx.created_at)}</span>
                            </div>
                        );
                    })}
                </div>
            )}
        </SectionCard>
    );
};

const MobileNotesSection = ({ user }) => {
    const [text, setText] = useState('');
    const [notes, setNotes] = useState([]);
    const [saving, setSaving] = useState(false);

    React.useEffect(() => {
        if (!user) return;
        const fetchNotes = async () => {
            const { default: supabase } = await import('../../utils/supabase');
            const today = new Date().toLocaleDateString('en-CA');
            const { data } = await supabase.from('notes')
                .select('*').eq('user_id', user.id)
                .gte('created_at', today + 'T00:00:00')
                .order('created_at', { ascending: false });
            if (data) setNotes(data);
        };
        fetchNotes();
    }, [user]);

    const handleSave = async () => {
        if (!text.trim()) return;
        setSaving(true);
        try {
            const { insertRow } = await import('../../services/dbService');
            const data = await insertRow('notes', { user_id: user.id, content: text.trim(), type: 'note' });
            if (data?.[0]) setNotes(prev => [data[0], ...prev]);
            setText('');
        } catch (err) {
            const { default: toast } = await import('../../utils/toast');
            toast.error('Failed to save note');
        }
        setSaving(false);
    };

    const relTime = (ts) => {
        const diff = (Date.now() - new Date(ts).getTime()) / 60000;
        if (diff < 60) return `${Math.round(diff)}m`;
        return `${Math.round(diff / 60)}h`;
    };

    return (
        <SectionCard icon="📝" title="QUICK NOTE">
            <div style={{ display: 'flex', gap: '8px' }}>
                <input type="text" value={text} onChange={e => setText(e.target.value)}
                    placeholder="Type something quickly..."
                    onKeyDown={e => e.key === 'Enter' && handleSave()}
                    style={{ ...numInput, flex: 1, fontSize: '14px' }} />
                <button onClick={handleSave} disabled={saving || !text.trim()}
                    style={{
                        padding: '10px 16px', borderRadius: '8px', border: 'none',
                        background: text.trim() ? 'var(--accent)' : 'var(--bg-card)',
                        color: text.trim() ? '#fff' : 'var(--text-3)',
                        fontWeight: 700, fontSize: '13px', minHeight: '44px',
                        cursor: text.trim() ? 'pointer' : 'default',
                    }}>Save ✓</button>
            </div>
            {notes.length > 0 && (
                <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {notes.map((n, i) => (
                        <div key={n.id || i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', fontSize: '12px' }}>
                            <span style={{ color: 'var(--text-2)', flex: 1 }}>• {n.content}</span>
                            <span style={{ color: 'var(--text-3)', fontSize: '10px', marginLeft: '8px' }}>{relTime(n.created_at)}</span>
                        </div>
                    ))}
                </div>
            )}
        </SectionCard>
    );
};

const MobileWinSection = ({ data, onChange }) => (
    <SectionCard icon="🏆" title="TODAY'S WIN">
        <input type="text" value={data.winText || ''} placeholder="One thing I'm proud of today..."
            onChange={e => onChange('winText', e.target.value)}
            style={{ ...numInput, width: '100%', fontSize: '14px' }} />
    </SectionCard>
);

const MobileResetSection = ({ user }) => {
    const [open, setOpen] = useState(false);
    const [entries, setEntries] = useState([]);
    const [count, setCount] = useState(0);

    React.useEffect(() => {
        if (!user) return;
        const fetch = async () => {
            const { default: supabase } = await import('../../utils/supabase');
            const today = new Date().toLocaleDateString('en-CA');
            const { data } = await supabase.from('daily_logs')
                .select('rc_count, rc_entries')
                .eq('user_id', user.id).eq('date', today).single();
            if (data) {
                setCount(data.rc_count || 0);
                try { setEntries(typeof data.rc_entries === 'string' ? JSON.parse(data.rc_entries) : (data.rc_entries || [])); }
                catch { setEntries([]); }
            }
        };
        fetch();
    }, [user]);

    const handleAdd = async () => {
        const entry = { type: 'reset', timestamp: new Date().toISOString() };
        const newEntries = [...entries, entry];
        const newCount = newEntries.filter(e => e.type !== 'urge').length;
        try {
            const { upsertRow } = await import('../../services/dbService');
            const today = new Date().toLocaleDateString('en-CA');
            await upsertRow('daily_logs', {
                user_id: user.id, date: today,
                rc_count: newCount, rc_entries: JSON.stringify(newEntries),
            }, 'user_id,date');
            setEntries(newEntries);
            setCount(newCount);
        } catch (err) {
            const { default: toast } = await import('../../utils/toast');
            toast.error('Failed to log');
        }
    };

    return (
        <div style={{
            background: 'var(--bg-card)', borderRadius: '14px', padding: '14px 16px',
            border: '1px solid var(--border)', margin: '0 16px',
        }}>
            <div onClick={() => setOpen(!open)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-2)' }}>🔒 Private Log</span>
                <span style={{ fontSize: '12px', color: 'var(--text-3)' }}>{open ? '▴' : '▾'}</span>
            </div>
            {open && (
                <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-1)' }}>{count}</span>
                    <button onClick={handleAdd} style={{
                        padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border)',
                        background: 'var(--bg-elevated)', color: 'var(--text-2)', fontWeight: 600,
                        fontSize: '12px', cursor: 'pointer', minHeight: '40px',
                    }}>+ Log reset</button>
                    {entries.length > 0 && (
                        <span style={{ fontSize: '10px', color: 'var(--text-3)' }}>
                            Last: {new Date(entries[entries.length - 1].timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    )}
                </div>
            )}
        </div>
    );
};


/* ─── Shared primitives ─── */

const SectionCard = ({ icon, title, complete, children }) => (
    <div style={{
        background: 'var(--bg-card)', borderRadius: '14px', padding: '16px',
        border: '1px solid var(--border)', margin: '0 16px',
    }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{
                fontSize: '13px', fontWeight: 700, color: 'var(--text-2)',
                textTransform: 'uppercase', letterSpacing: '0.05em',
            }}>{icon} {title}</span>
            {complete !== undefined && (
                <span style={{ fontSize: '10px', color: complete ? 'var(--success)' : 'var(--text-3)' }}>
                    {complete ? '✓ done' : '○ todo'}
                </span>
            )}
        </div>
        {children}
    </div>
);

const ToggleRow = ({ label, active, onToggle, icon }) => (
    <div onClick={onToggle} style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 14px', borderRadius: '10px', marginBottom: '8px',
        border: active ? '1px solid rgba(245,166,35,0.25)' : '1px solid var(--border)',
        background: active ? 'rgba(245,166,35,0.08)' : 'var(--bg-elevated)',
        cursor: 'pointer',
    }}>
        <span style={{ fontSize: '14px', color: 'var(--text-1)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            {icon && <span>{icon}</span>}{label}
        </span>
        <div style={{
            width: '44px', height: '24px', borderRadius: '12px',
            background: active ? 'var(--accent)' : 'var(--border-hover)',
            position: 'relative', transition: 'background 0.2s',
        }}>
            <div style={{
                position: 'absolute', width: '18px', height: '18px', borderRadius: '50%',
                background: '#fff', top: '3px', left: active ? '23px' : '3px',
                transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
            }} />
        </div>
    </div>
);

const Chip = ({ label, active, onClick }) => (
    <button type="button" onClick={onClick} style={{
        padding: '8px 14px', borderRadius: '10px', fontSize: '12px', fontWeight: 600,
        border: `1.5px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
        background: active ? 'var(--accent-dim)' : 'var(--bg-elevated)',
        color: active ? 'var(--accent)' : 'var(--text-3)',
        cursor: 'pointer', minHeight: '40px',
    }}>{label}</button>
);

const MiniChip = ({ label, active, onClick }) => (
    <button type="button" onClick={onClick} style={{
        flex: 1, padding: '4px', borderRadius: '6px', fontSize: '10px', fontWeight: 600,
        border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
        background: active ? 'var(--accent-dim)' : 'transparent',
        color: active ? 'var(--accent)' : 'var(--text-3)', cursor: 'pointer',
    }}>{label}</button>
);

const TaskRow = ({ task, onToggle }) => {
    const timeStr = task.start_time ? new Date(task.start_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '';
    return (
        <div onClick={() => onToggle(task.id, !task.completed)} style={{
            display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px',
            borderRadius: '8px', cursor: 'pointer',
            background: task.completed ? 'transparent' : 'var(--bg-elevated)',
        }}>
            <span style={{ fontSize: '14px' }}>{task.completed ? '☑' : '☐'}</span>
            <span style={{
                flex: 1, fontSize: '13px', fontWeight: 500,
                color: task.completed ? 'var(--text-3)' : 'var(--text-1)',
                textDecoration: task.completed ? 'line-through' : 'none',
            }}>{task.title}</span>
            {task.event_type === 'reminder' && <span style={{ fontSize: '12px' }}>🔔</span>}
            <span style={{ fontSize: '10px', color: 'var(--text-3)' }}>
                {task.completed ? 'done' : timeStr}
            </span>
        </div>
    );
};

const labelSt = { fontSize: '11px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px', display: 'block' };
const timeInput = { width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--bg-elevated)', color: 'var(--text-1)', fontSize: '15px', fontWeight: 600 };
const numInput = { padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--bg-elevated)', color: 'var(--text-1)', fontSize: '15px', fontWeight: 600 };
const stepBtn = { width: '34px', height: '34px', borderRadius: '8px', fontSize: '16px', border: '1px solid var(--border)', background: 'var(--bg-elevated)', color: 'var(--text-3)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 };

export {
    MobileSleepSection,
    MobileBodySection,
    MobileMindSection,
    MobileTaskSection,
    MobileMoneySection,
    MobileNotesSection,
    MobileWinSection,
    MobileResetSection,
};
