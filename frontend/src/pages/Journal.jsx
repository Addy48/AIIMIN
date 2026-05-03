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

  const bg = isDark ? '#0A0A0A' : '#F9FAFB';
  const cardBg = isDark ? '#111111' : '#FFFFFF';
  const border = isDark ? '#222222' : '#E5E7EB';
  const text1 = isDark ? '#EDEDED' : '#111111';
  const text2 = isDark ? '#A1A1AA' : '#6B7280';
  const text3 = isDark ? '#52525B' : '#9CA3AF';

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
      // show inline error
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
    padding: '9px 14px', borderRadius: '8px', border: `1px solid ${border}`,
    background: isDark ? '#161616' : '#F9FAFB', color: text1,
    fontFamily: 'var(--font-sans)', fontSize: '13px', outline: 'none',
  };

  return (
    <div style={{ minHeight: '100vh', maxWidth: '760px' }}>
      {/* Header */}
      <div style={{ marginBottom: '36px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: text3, fontFamily: 'var(--font-sans)', marginBottom: '8px' }}>
            Journal · Private
          </div>
          <h1 style={{ font: 'var(--text-hero)', color: text1, margin: 0, letterSpacing: '-0.02em' }}>
            What's on your mind?
          </h1>
        </div>
        <span style={{ fontSize: '13px', color: text2, fontFamily: 'var(--font-sans)', fontStyle: 'italic' }}>
          {entries.length} entries
        </span>
      </div>

      {/* Error banner */}
      {error && (
        <div style={{ padding: '10px 16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', color: '#ef4444', fontSize: '13px', fontFamily: 'var(--font-sans)', marginBottom: '16px' }}>
          {error}
        </div>
      )}

      {/* Compose */}
      {!drafting ? (
        <button
          onClick={() => setDrafting(true)}
          style={{
            width: '100%', padding: '18px 22px', borderRadius: '12px',
            border: `1px dashed ${border}`, background: 'transparent',
            color: text3, fontFamily: 'var(--font-sans)', fontSize: '14px',
            cursor: 'pointer', textAlign: 'left', marginBottom: '28px',
            transition: 'all 150ms ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#22C55E'; e.currentTarget.style.color = text2; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = border; e.currentTarget.style.color = text3; }}
        >
          ✍️ &nbsp; Start today's entry…
        </button>
      ) : (
        <div style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: '12px', padding: '22px', marginBottom: '28px' }}>
          {/* Mood row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: text3, fontFamily: 'var(--font-sans)', textTransform: 'uppercase', letterSpacing: '0.06em', marginRight: '4px' }}>Mood</span>
            {MOODS.map(m => (
              <button
                key={m.val}
                onClick={() => setMood(m.val)}
                title={m.label}
                style={{
                  width: '36px', height: '36px', borderRadius: '8px',
                  border: `1px solid ${m.val === mood ? '#22C55E' : border}`,
                  background: m.val === mood ? 'rgba(34,197,94,0.12)' : 'transparent',
                  fontSize: '18px', cursor: 'pointer', transition: 'all 100ms ease',
                }}
              >{m.emoji}</button>
            ))}
            <span style={{ fontSize: '12px', color: text2, fontFamily: 'var(--font-sans)', marginLeft: '4px' }}>
              {MOODS.find(m => m.val === mood)?.label}
            </span>
          </div>

          {/* Quick metrics */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '14px', flexWrap: 'wrap' }}>
            <div>
              <label style={{ fontSize: '10px', fontWeight: 600, color: text3, fontFamily: 'var(--font-sans)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '5px' }}>Sleep (hrs)</label>
              <input
                type="number" min="0" max="24" step="0.5" placeholder="7.5"
                value={sleepHours} onChange={e => setSleepHours(e.target.value)}
                style={{ ...inputStyle, width: '80px' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '10px', fontWeight: 600, color: text3, fontFamily: 'var(--font-sans)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '5px' }}>Energy (1–5)</label>
              <select value={energyLevel} onChange={e => setEnergyLevel(Number(e.target.value))} style={{ ...inputStyle, width: '80px' }}>
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
              width: '100%', minHeight: '140px', background: 'transparent',
              border: 'none', outline: 'none', resize: 'vertical',
              fontFamily: 'var(--font-sans)', fontSize: '15px', lineHeight: 1.7,
              color: text1, boxSizing: 'border-box',
            }}
          />

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px', paddingTop: '14px', borderTop: `1px solid ${border}` }}>
            <span style={{ fontSize: '11px', color: text3, fontFamily: 'var(--font-sans)' }}>
              {body.length > 0 ? `${body.trim().split(/\s+/).filter(Boolean).length} words` : 'Start writing…'}
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => { setDrafting(false); setBody(''); }} style={{
                padding: '7px 14px', borderRadius: '8px', border: `1px solid ${border}`,
                background: 'transparent', color: text2, fontFamily: 'var(--font-sans)', fontSize: '12px', cursor: 'pointer',
              }}>Discard</button>
              <button
                onClick={handleSave}
                disabled={!body.trim() || saving}
                style={{
                  padding: '7px 18px', borderRadius: '8px', border: 'none',
                  background: body.trim() ? '#22C55E' : '#3F3F3F',
                  color: '#fff', fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 600,
                  cursor: body.trim() ? 'pointer' : 'not-allowed',
                }}
              >{saving ? 'Saving…' : 'Save entry'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Search */}
      {entries.length > 3 && (
        <input
          type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search entries…"
          style={{ ...inputStyle, width: '100%', marginBottom: '18px', boxSizing: 'border-box' }}
        />
      )}

      {/* Entries list */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[1,2,3].map(i => (
            <div key={i} style={{ height: '90px', borderRadius: '12px', background: isDark ? '#161616' : '#F3F4F6', border: `1px solid ${border}` }} />
          ))}
        </div>
      ) : filteredEntries.length === 0 ? (
        <div style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: '12px', padding: '48px 24px', textAlign: 'center' }}>
          <div style={{ fontSize: '32px', marginBottom: '10px' }}>📖</div>
          <div style={{ fontSize: '14px', fontWeight: 600, color: text1, fontFamily: 'var(--font-sans)', marginBottom: '4px' }}>
            {search ? 'No matches' : 'No entries yet'}
          </div>
          <div style={{ fontSize: '12px', color: text2, fontFamily: 'var(--font-sans)' }}>
            {search ? 'Try a different keyword' : 'Your journal is private.'}
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filteredEntries.map(entry => {
            const dateObj = new Date(entry.date || entry.created_at);
            const dateStr = dateObj.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' });
            const preview = entry.encrypted_content?.slice(0, 220).replace(/\n/g, ' ');
            const moodVal = typeof entry.mood === 'number' ? entry.mood : 3;

            return (
              <div
                key={entry.id}
                style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: '12px', padding: '18px 22px', transition: 'border-color 150ms ease', cursor: 'default' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = isDark ? '#3F3F3F' : '#D1D5DB'}
                onMouseLeave={e => e.currentTarget.style.borderColor = border}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '16px' }}>{moodEmoji(moodVal)}</span>
                    <span style={{ fontSize: '11px', color: text3, fontFamily: 'var(--font-sans)' }}>{dateStr}</span>
                    {entry.sleep_hours && (
                      <span style={{ fontSize: '10px', color: text3, fontFamily: 'var(--font-sans)' }}>· 💤 {entry.sleep_hours}h</span>
                    )}
                    {entry.energy_level && (
                      <span style={{ fontSize: '10px', color: text3, fontFamily: 'var(--font-sans)' }}>· ⚡ {entry.energy_level}/5</span>
                    )}
                  </div>
                </div>
                <div style={{ fontSize: '13px', color: text2, fontFamily: 'var(--font-sans)', lineHeight: 1.65, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {preview}{entry.encrypted_content?.length > 220 ? '…' : ''}
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
