import React, { useState } from 'react';

const MobileResetSection = ({ user }) => {
    const [open, setOpen] = useState(false);
    const [entries, setEntries] = useState([]);
    const [count, setCount] = useState(0);

    React.useEffect(() => {
        if (!user) return;
        const fetch = async () => {
            const { default: supabase } = await import('../../../utils/supabase');
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
            const { upsertRow } = await import('../../../services/dbService');
            const today = new Date().toLocaleDateString('en-CA');
            await upsertRow('daily_logs', {
                user_id: user.id, date: today,
                rc_count: newCount, rc_entries: JSON.stringify(newEntries),
            }, 'user_id,date');
            // Reset clean streak when logging a reset
            await upsertRow('user_xp', {
                user_id: user.id, clean_streak: 0, updated_at: new Date().toISOString(),
            }, 'user_id');
            setEntries(newEntries);
            setCount(newCount);
        } catch (err) {
            const { default: toast } = await import('../../../utils/toast');
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




export default MobileResetSection;
