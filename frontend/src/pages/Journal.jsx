import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useThemeContext } from '../context/ThemeContext';
import { supabase } from '../utils/supabase';

/* ── Real schema:
   id, user_id, date (DATE), encrypted_content (TEXT),
   mood (INTEGER 1-5), sleep_hours, energy_level, created_at
─────────────────────────────────────────────── */

const MOODS = [
  { val: 1, emoji: '😞', label: 'Rough' },
  { val: 2, emoji: '😐', label: 'Meh' },
  { val: 3, emoji: '😊', label: 'Okay' },
  { val: 4, emoji: '😄', label: 'Good' },
  { val: 5, emoji: '🔥', label: 'Great' },
];

const moodEmoji = (val) => MOODS.find(m => m.val === val)?.emoji || '😊';

const JournalPage = () => {
  const { user } = useAuth();
  const { theme } = useThemeContext();
  const isDark = theme === 'dark';

  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drafting, setDrafting] = useState(false);
  const [body, setBody] = useState('');
  const [mood, setMood] = useState(3);
  const [sleepHours, setSleepHours] = useState('');
  const [energyLevel, setEnergyLevel] = useState(3);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [error, setError] = useState(null);

  const border = 'var(--color-border)';
  const text1 = 'var(--color-text-1)';
  const text2 = 'var(--color-text-2)';
  const text3 = 'var(--color-text-3)';

  useEffect(() => {
    if (!user) return;
    fetchEntries();
  }, [user]);

  const fetchEntries = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchErr } = await supabase
        .from('journal_entries')
        .select('id, date, encrypted_content, mood, sleep_hours, energy_level, created_at')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(50);
      if (fetchErr) throw fetchErr;
      setEntries(data || []);
    } catch (e) {
      setError('Could not load entries.');
      setEntries([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!body.trim()) return;
    setSaving(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      const payload = {
        user_id: user.id,
        date: today,
        encrypted_content: body.trim(),
        mood: mood,
        energy_level: energyLevel,
        ...(sleepHours ? { sleep_hours: parseFloat(sleepHours) } : {}),
      };
      const { data, error: insertErr } = await supabase
        .from('journal_entries')
        .insert(payload)
        .select()
        .single();
      if (insertErr) throw insertErr;
      setEntries(prev => [data, ...prev]);
      setBody('');
      setMood(3);
      setSleepHours('');
      setEnergyLevel(3);
      setDrafting(false);
    } catch (e) {
      setError('Failed to save. Try again.');
      setTimeout(() => setError(null), 3000);
    }
    setSaving(false);
  };

  const filteredEntries = entries.filter(e =>
    !search || e.encrypted_content?.toLowerCase().includes(search.toLowerCase())
  );

  if (!user) return null;

  const inputStyle = {
    padding: '10px 14px', borderRadius: '10px', border: `1px solid ${border}`,
    background: 'var(--color-surface)', color: text1,
    fontFamily: 'var(--font-sans)', fontSize: '13px', outline: 'none',
    transition: 'all 200ms var(--ease)',
  };

  return (
    <div style={{ flex: 1, paddingBottom: '80px' }}>
      {/* Header */}
      <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-accent)', fontFamily: 'var(--font-mono)', marginBottom: '8px' }}>
            Journal · Private
          </div>
          <h1 style={{ font: 'var(--text-hero)', color: text1, margin: 0, letterSpacing: '-0.03em' }}>
            What's on your mind?
          </h1>
        </div>
        <span style={{ fontSize: '12px', color: text3, fontFamily: 'var(--font-sans)', fontStyle: 'italic', opacity: 0.8 }}>
          {entries.length} reflections logged
        </span>
      </div>

      {/* Error banner */}
      {error && (
        <div style={{ padding: '12px 16px', background: 'var(--color-danger-dim)', border: '1px solid var(--color-danger)', borderRadius: '12px', color: 'var(--color-danger)', fontSize: '13px', fontFamily: 'var(--font-sans)', marginBottom: '24px' }}>
          {error}
        </div>
      )}

      {/* Compose */}
      {!drafting ? (
        <button
          onClick={() => setDrafting(true)}
          className="glass-panel"
          style={{
            width: '100%', padding: '24px', borderRadius: '16px',
            border: `1px dashed ${border}`, background: 'var(--glass-bg)',
            color: text3, fontFamily: 'var(--font-sans)', fontSize: '15px',
            cursor: 'pointer', textAlign: 'left', marginBottom: '32px',
            transition: 'all 200ms var(--ease)',
            display: 'flex', alignItems: 'center', gap: '12px',
          }}
        >
          <span style={{ fontSize: '20px', opacity: 0.6 }}>✍️</span>
          <span>Start today's entry…</span>
        </button>
      ) : (
        <div className="glass-panel" style={{ background: 'var(--glass-bg)', border: `1px solid ${border}`, borderRadius: '20px', padding: '28px', marginBottom: '32px', boxShadow: 'var(--glass-shadow-md)' }}>
          {/* Mood row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: text3, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em', marginRight: '6px' }}>Mood</span>
            {MOODS.map(m => (
              <button
                key={m.val}
                onClick={() => setMood(m.val)}
                title={m.label}
                style={{
                  width: '40px', height: '40px', borderRadius: '12px',
                  border: `1px solid ${m.val === mood ? 'var(--color-accent)' : border}`,
                  background: m.val === mood ? 'var(--color-accent-dim)' : 'transparent',
                  fontSize: '20px', cursor: 'pointer', transition: 'all 200ms var(--ease)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >{m.emoji}</button>
            ))}
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-accent)', fontFamily: 'var(--font-sans)', marginLeft: '8px' }}>
              {MOODS.find(m => m.val === mood)?.label}
            </span>
          </div>

          {/* Quick metrics */}
          <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <div>
              <label style={{ fontSize: '10px', fontWeight: 700, color: text3, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '6px' }}>Sleep (hrs)</label>
              <input
                type="number" min="0" max="24" step="0.5" placeholder="7.5"
                value={sleepHours} onChange={e => setSleepHours(e.target.value)}
                style={{ ...inputStyle, width: '90px' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '10px', fontWeight: 700, color: text3, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '6px' }}>Energy (1–5)</label>
              <select value={energyLevel} onChange={e => setEnergyLevel(Number(e.target.value))} style={{ ...inputStyle, width: '90px' }}>
                {[1,2,3,4,5].map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
          </div>

          {/* Text area */}
          <textarea
            value={body}
            onChange={e => setBody(e.target.value)}
            placeholder="Write freely. This is encrypted and private."
            autoFocus
            style={{
              width: '100%', minHeight: '180px', background: 'transparent',
              border: 'none', outline: 'none', resize: 'vertical',
              fontFamily: 'var(--font-sans)', fontSize: '16px', lineHeight: 1.8,
              color: text1, boxSizing: 'border-box',
              padding: '12px 0',
            }}
          />

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', paddingTop: '20px', borderTop: `1px solid ${border}` }}>
            <span style={{ fontSize: '12px', color: text3, fontFamily: 'var(--font-mono)', opacity: 0.7 }}>
              {body.length > 0 ? `${body.trim().split(/\s+/).filter(Boolean).length} words recorded` : 'Capture your thoughts…'}
            </span>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => { setDrafting(false); setBody(''); }} style={{
                padding: '8px 16px', borderRadius: '10px', border: `1px solid ${border}`,
                background: 'transparent', color: text2, fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 500, cursor: 'pointer',
                transition: 'all 200ms var(--ease)',
              }}>Discard</button>
              <button
                onClick={handleSave}
                disabled={!body.trim() || saving}
                style={{
                  padding: '8px 24px', borderRadius: '10px', border: 'none',
                  background: body.trim() ? 'var(--color-accent)' : 'var(--color-text-3)',
                  color: '#fff', fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 600,
                  cursor: body.trim() ? 'pointer' : 'not-allowed',
                  transition: 'all 200ms var(--ease)',
                  opacity: body.trim() ? 1 : 0.4,
                }}
              >{saving ? 'Saving…' : 'Save Reflection'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Search */}
      {entries.length > 3 && (
        <div style={{ position: 'relative', marginBottom: '24px' }}>
          <input
            type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search through your history…"
            style={{ ...inputStyle, width: '100%', paddingLeft: '40px', boxSizing: 'border-box' }}
          />
          <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }}>🔍</span>
        </div>
      )}

      {/* Entries list */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[1,2,3].map(i => (
            <div key={i} className="glass-panel" style={{ height: '120px', borderRadius: '16px', background: 'var(--glass-bg)', opacity: 0.5 }} />
          ))}
        </div>
      ) : filteredEntries.length === 0 ? (
        <div className="glass-panel" style={{ background: 'var(--glass-bg)', border: `1px solid ${border}`, borderRadius: '20px', padding: '60px 24px', textAlign: 'center' }}>
          <div style={{ fontSize: '40px', marginBottom: '16px', opacity: 0.6 }}>📖</div>
          <div style={{ fontSize: '16px', fontWeight: 600, color: text1, fontFamily: 'var(--font-sans)', marginBottom: '6px' }}>
            {search ? 'No matches found' : 'The page is blank'}
          </div>
          <div style={{ fontSize: '13px', color: text3, fontFamily: 'var(--font-sans)', maxWidth: '280px', margin: '0 auto' }}>
            {search ? 'Try searching for a different keyword or date.' : 'Your personal log is completely private and encrypted.'}
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredEntries.map(entry => {
            const dateObj = new Date(entry.date || entry.created_at);
            const dateStr = dateObj.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' });
            const preview = entry.encrypted_content?.slice(0, 280).replace(/\n/g, ' ');
            const moodVal = typeof entry.mood === 'number' ? entry.mood : 3;

            return (
              <div
                key={entry.id}
                className="glass-panel"
                style={{ 
                  background: 'var(--glass-bg)', border: `1px solid ${border}`, borderRadius: '16px', padding: '24px', 
                  transition: 'all 200ms var(--ease)', cursor: 'default',
                  boxShadow: 'var(--glass-shadow-sm)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'var(--color-accent)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = border;
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ 
                      width: '32px', height: '32px', background: 'var(--color-surface)', borderRadius: '8px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px',
                      border: `1px solid ${border}`
                    }}>
                      {moodEmoji(moodVal)}
                    </div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: text1, fontFamily: 'var(--font-sans)' }}>{dateStr}</div>
                      <div style={{ fontSize: '10px', color: text3, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '1px' }}>
                        {entry.sleep_hours && `💤 ${entry.sleep_hours}h`}
                        {entry.sleep_hours && entry.energy_level && ' · '}
                        {entry.energy_level && `⚡ Energy: ${entry.energy_level}/5`}
                      </div>
                    </div>
                  </div>
                </div>
                <div style={{ 
                  fontSize: '14px', color: text2, fontFamily: 'var(--font-sans)', lineHeight: 1.75, 
                  display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' 
                }}>
                  {preview}{entry.encrypted_content?.length > 280 ? '…' : ''}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default JournalPage;
