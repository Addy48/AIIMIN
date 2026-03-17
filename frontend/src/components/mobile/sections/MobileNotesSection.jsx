import React, { useState } from 'react';
import { SectionCard } from './Shared';
import { numInput } from "../MobileUI";

const MobileNotesSection = ({ user }) => {
    const [text, setText] = useState('');
    const [notes, setNotes] = useState([]);
    const [saving, setSaving] = useState(false);

    React.useEffect(() => {
        if (!user) return;
        const fetchNotes = async () => {
            const { default: supabase } = await import('../../../utils/supabase');
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
            const { insertRow } = await import('../../../services/dbService');
            const data = await insertRow('notes', { user_id: user.id, content: text.trim(), type: 'note' });
            if (data?.[0]) setNotes(prev => [data[0], ...prev]);
            setText('');
        } catch (err) {
            const { default: toast } = await import('../../../utils/toast');
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

export default MobileNotesSection;
