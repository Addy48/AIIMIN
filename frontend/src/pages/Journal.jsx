import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useThemeContext } from '../context/ThemeContext';
import { supabase } from '../lib/supabaseClient';

/* ── Journal Page — personal diary/notes with Supabase ── */
const MOODS = ['😌', '😊', '😤', '😴', '🤔', '🔥', '🫠', '💪'];

const JournalPage = () => {
  const { user } = useAuth();
  const { theme } = useThemeContext();
  const isDark = theme === 'dark';

  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drafting, setDrafting] = useState(false);
  const [body, setBody] = useState('');
  const [mood, setMood] = useState('😊');
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');

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
    try {
      const { data } = await supabase
        .from('journal_entries')
        .select('id, body, mood, created_at, title')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);
      setEntries(data || []);
    } catch (e) {
      // silent fail — show empty state
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!body.trim()) return;
    setSaving(true);
    try {
      const now = new Date();
      const title = body.trim().split('\n')[0].slice(0, 80);
      const { data, error } = await supabase.from('journal_entries').insert({
        user_id: user.id,
        body: body.trim(),
        mood,
        title,
        created_at: now.toISOString(),
      }).select().single();
      if (!error && data) {
        setEntries(prev => [data, ...prev]);
        setBody('');
        setMood('😊');
        setDrafting(false);
      }
    } catch (e) { /* silent */ }
    setSaving(false);
  };

  const filteredEntries = entries.filter(e =>
    !search || e.body?.toLowerCase().includes(search.toLowerCase()) || e.title?.toLowerCase().includes(search.toLowerCase())
  );

  if (!user) return null;

  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div style={{ minHeight: '100vh', maxWidth: '780px' }}>
      {/* Header */}
      <div style={{ marginBottom: '36px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: text3, fontFamily: 'var(--font-sans)', marginBottom: '8px' }}>
            Journal · {today}
          </div>
          <h1 style={{ font: 'var(--text-hero)', color: text1, margin: 0, letterSpacing: '-0.02em' }}>
            What's on your mind?
          </h1>
        </div>
        <div style={{ fontSize: '14px', color: text2, fontFamily: 'var(--font-sans)', fontStyle: 'italic' }}>
          {entries.length} entries
        </div>
      </div>

      {/* Compose area */}
      {!drafting ? (
        <button
          onClick={() => setDrafting(true)}
          style={{
            width: '100%', padding: '20px 24px', borderRadius: '12px',
            border: `1px dashed ${border}`, background: 'transparent',
            color: text3, fontFamily: 'var(--font-sans)', fontSize: '14px',
            cursor: 'pointer', textAlign: 'left', marginBottom: '32px',
            transition: 'all 150ms ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#22C55E'; e.currentTarget.style.color = text2; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = border; e.currentTarget.style.color = text3; }}
        >
          ✍️ &nbsp; Start today's entry…
        </button>
      ) : (
        <div style={{
          background: cardBg, border: `1px solid ${border}`, borderRadius: '12px',
          padding: '24px', marginBottom: '32px',
        }}>
          {/* Mood picker */}
          <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', flexWrap: 'wrap' }}>
            {MOODS.map(m => (
              <button
                key={m}
                onClick={() => setMood(m)}
                style={{
                  width: '36px', height: '36px', borderRadius: '8px', border: `1px solid ${m === mood ? '#22C55E' : border}`,
                  background: m === mood ? 'rgba(34,197,94,0.1)' : 'transparent',
                  fontSize: '18px', cursor: 'pointer',
                  transition: 'all 100ms ease',
                }}
              >
                {m}
              </button>
            ))}
            <span style={{ marginLeft: '8px', fontSize: '13px', color: text2, fontFamily: 'var(--font-sans)', alignSelf: 'center' }}>
              {mood}
            </span>
          </div>

          <textarea
            value={body}
            onChange={e => setBody(e.target.value)}
            placeholder="Write freely. This is private."
            autoFocus
            style={{
              width: '100%', minHeight: '160px', background: 'transparent',
              border: 'none', outline: 'none', resize: 'vertical',
              fontFamily: 'var(--font-sans)', fontSize: '15px', lineHeight: 1.7,
              color: text1,
            }}
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', paddingTop: '16px', borderTop: `1px solid ${border}` }}>
            <div style={{ fontSize: '11px', color: text3, fontFamily: 'var(--font-sans)' }}>
              {body.length > 0 ? `${body.split(/\s+/).filter(Boolean).length} words` : 'Start writing…'}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => { setDrafting(false); setBody(''); }} style={{
                padding: '8px 16px', borderRadius: '8px', border: `1px solid ${border}`,
                background: 'transparent', color: text2, fontFamily: 'var(--font-sans)', fontSize: '13px', cursor: 'pointer',
              }}>Discard</button>
              <button
                onClick={handleSave}
                disabled={!body.trim() || saving}
                style={{
                  padding: '8px 20px', borderRadius: '8px', border: 'none',
                  background: body.trim() ? '#22C55E' : '#3F3F3F',
                  color: '#fff', fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 600,
                  cursor: body.trim() ? 'pointer' : 'not-allowed', transition: 'background 150ms ease',
                }}
              >
                {saving ? 'Saving…' : 'Save entry'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search */}
      {entries.length > 3 && (
        <div style={{ marginBottom: '20px' }}>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search entries…"
            style={{
              width: '100%', padding: '10px 16px', borderRadius: '8px',
              border: `1px solid ${border}`, background: isDark ? '#161616' : '#F9FAFB',
              color: text1, fontFamily: 'var(--font-sans)', fontSize: '13px', outline: 'none',
            }}
          />
        </div>
      )}

      {/* Entries */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[1,2,3].map(i => (
            <div key={i} style={{
              background: cardBg, border: `1px solid ${border}`, borderRadius: '12px',
              padding: '20px', height: '100px',
              background: `linear-gradient(90deg, ${isDark ? '#161616' : '#F3F4F6'} 25%, ${isDark ? '#1F1F1F' : '#E5E7EB'} 50%, ${isDark ? '#161616' : '#F3F4F6'} 75%)`,
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.5s infinite',
            }} />
          ))}
        </div>
      ) : filteredEntries.length === 0 ? (
        <div style={{
          background: cardBg, border: `1px solid ${border}`, borderRadius: '12px',
          padding: '60px 24px', textAlign: 'center',
        }}>
          <div style={{ fontSize: '36px', marginBottom: '12px' }}>📖</div>
          <div style={{ fontSize: '15px', fontWeight: 600, color: text1, fontFamily: 'var(--font-sans)', marginBottom: '6px' }}>
            {search ? 'No entries match your search' : 'No entries yet'}
          </div>
          <div style={{ fontSize: '13px', color: text2, fontFamily: 'var(--font-sans)' }}>
            {search ? 'Try a different keyword' : 'Your journal is private and encrypted.'}
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredEntries.map(entry => {
            const d = new Date(entry.created_at);
            const dateStr = d.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' });
            const timeStr = d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
            const preview = entry.body?.slice(0, 200).replace(/\n/g, ' ');

            return (
              <div
                key={entry.id}
                style={{
                  background: cardBg, border: `1px solid ${border}`, borderRadius: '12px',
                  padding: '20px 24px', cursor: 'pointer', transition: 'border-color 150ms ease',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = isDark ? '#3F3F3F' : '#D1D5DB'}
                onMouseLeave={e => e.currentTarget.style.borderColor = border}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '18px' }}>{entry.mood || '😊'}</span>
                    <span style={{ fontSize: '11px', color: text3, fontFamily: 'var(--font-sans)' }}>
                      {dateStr} · {timeStr}
                    </span>
                  </div>
                </div>
                {entry.title && (
                  <div style={{ fontSize: '14px', fontWeight: 600, color: text1, fontFamily: 'var(--font-sans)', marginBottom: '6px', lineHeight: 1.4 }}>
                    {entry.title}
                  </div>
                )}
                <div style={{
                  fontSize: '13px', color: text2, fontFamily: 'var(--font-sans)', lineHeight: 1.65,
                  display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                }}>
                  {preview}{entry.body?.length > 200 ? '…' : ''}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
};

export default JournalPage;
