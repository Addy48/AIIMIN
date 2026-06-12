import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useThemeContext } from '../context/ThemeContext';
import { supabase } from '../utils/supabase';
import { Search, Plus, BookOpen, Feather } from 'lucide-react';
import Notes from './Notes';
import MoodHeatmap from '../components/journal/MoodHeatmap';
import JournalEditor from '../components/journal/JournalEditor';

/* ── Configuration & Constants ── */
const MOODS = [
  { val: 1, emoji: '😞', label: 'Rough', color: '#ef4444' },
  { val: 2, emoji: '😐', label: 'Meh', color: '#f59e0b' },
  { val: 3, emoji: '😊', label: 'Okay', color: '#10b981' },
  { val: 4, emoji: '😄', label: 'Good', color: '#3b82f6' },
  { val: 5, emoji: '🔥', label: 'Great', color: '#8b5cf6' },
];




const JournalPage = () => {
  const { user } = useAuth();
  const { theme } = useThemeContext();
  const isDark = theme === 'dark';

  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('mindset'); // 'mindset' | 'notes'

  // Styling Tokens
  const border = 'var(--color-border)';
  const text1 = 'var(--color-text-1)';
  const text2 = 'var(--color-text-2)';
  const text3 = 'var(--color-text-3)';




  const fetchEntries = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });
      
      if (error) throw error;
      setEntries(data || []);
      setSelectedEntry(prev => {
        if (prev || !data?.length) return prev;
        return data[0];
      });
    } catch (e) {
      console.error("Journal fetch error:", e);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const handleEntrySelect = (entry) => {
    setSelectedEntry(entry);
  };

  const handleNewEntry = () => {
    const today = new Date().toISOString().split('T')[0];
    const initialTemplate = `# Mindset & Momentum\n\n## 🎯 Core Aims & Focus for Today\n- \n\n## 🔥 Achievements & Wins\n- \n\n## 🌱 Approach to Life & Reflections\n- \n`;
    const newEntry = {
      id: 'temp-' + Date.now(),
      date: today,
      encrypted_content: initialTemplate,
      mood: 3,
      energy_level: 3,
      sleep_hours: 7
    };
    setSelectedEntry(newEntry);
  };

  const deleteEntry = async (id) => {
    if (!window.confirm("Are you sure you want to delete this entry?")) return;
    try {
      const { error } = await supabase.from('journal_entries').delete().eq('id', id);
      if (error) throw error;
      setEntries(entries.filter(e => e.id !== id));
      if (selectedEntry?.id === id) {
        setSelectedEntry(entries[0] || null);
      }
    } catch (e) {
      console.error("Delete error:", e);
    }
  };

  const handleSaveSuccess = (savedEntry, isNew) => {
    if (isNew) {
      setEntries(prev => [savedEntry, ...prev]);
      setSelectedEntry(savedEntry);
    } else {
      setEntries(prev => prev.map(e => e.id === savedEntry.id ? savedEntry : e));
      setSelectedEntry(prev => prev?.id === savedEntry.id ? savedEntry : prev);
    }
  };

  const filteredEntries = entries.filter(e =>
    !search || e.encrypted_content?.toLowerCase().includes(search.toLowerCase())
  );

  const groupedEntries = filteredEntries.reduce((acc, entry) => {
    const date = new Date(entry.date);
    const key = date.toLocaleString('default', { month: 'long', year: 'numeric' });
    if (!acc[key]) acc[key] = [];
    acc[key].push(entry);
    return acc;
  }, {});

  return (
    <div style={{ 
      display: 'flex', flexDirection: 'column', 
      height: 'calc(100vh - var(--nav-height) - 40px)',
      background: isDark ? 'var(--color-base)' : '#FBFBFA',
      margin: '-20px -24px',
    }}>
      {/* ── TOP NAV ── */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '16px', borderBottom: `1px solid ${border}` }}>
        <div style={{ display: 'flex', background: 'var(--bg-elevated)', borderRadius: '12px', padding: '4px' }}>
          <button 
            onClick={() => setActiveTab('mindset')}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer',
              fontWeight: 600, fontSize: '13px',
              background: activeTab === 'mindset' ? 'var(--color-accent)' : 'transparent',
              color: activeTab === 'mindset' ? '#fff' : text2,
              transition: 'all 0.2s'
            }}
          >
            <Feather size={16} /> Journal
          </button>
          <button 
            onClick={() => setActiveTab('notes')}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer',
              fontWeight: 600, fontSize: '13px',
              background: activeTab === 'notes' ? 'var(--color-accent)' : 'transparent',
              color: activeTab === 'notes' ? '#fff' : text2,
              transition: 'all 0.2s'
            }}
          >
            <BookOpen size={16} /> Notes
          </button>
        </div>
      </div>

      {activeTab === 'notes' ? (
        <div style={{ flex: 1, overflowY: 'auto' }} className="custom-scrollbar">
          <Notes />
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '320px 1fr', 
          flex: 1,
          background: isDark ? 'var(--color-base)' : '#FBFBFA',
          overflow: 'hidden',
        }}>
          
          {/* ── SIDEBAR ── */}
      <aside style={{ 
        borderRight: `1px solid ${border}`,
        background: isDark ? 'rgba(255,255,255,0.01)' : 'rgba(0,0,0,0.01)',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <div style={{ padding: '32px 24px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '11px', fontWeight: 800, color: text3, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Notebook</h2>
            <button 
              onClick={handleNewEntry}
              style={{ 
                background: 'var(--color-accent-dim)', border: `1px solid var(--color-accent-soft)`, 
                color: 'var(--color-accent)', cursor: 'pointer', padding: '6px', borderRadius: '8px',
                display: 'flex', alignItems: 'center', transition: 'all 200ms ease'
              }}
              className="hover-glow"
            ><Plus size={16} /></button>
          </div>
          <div style={{ position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: text3, opacity: 0.6 }} />
            <input 
              type="text"
              placeholder="Search reflections..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%', padding: '10px 12px 10px 36px', borderRadius: '10px',
                border: `1px solid ${border}`, background: isDark ? 'rgba(255,255,255,0.03)' : '#fff',
                fontSize: '13px', outline: 'none', color: text1, transition: 'all 0.2s'
              }}
            />
          </div>
        </div>

        <MoodHeatmap entries={entries} onSelectEntry={handleEntrySelect} />

        <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px 40px' }} className="custom-scrollbar">
          {Object.keys(groupedEntries).length === 0 && !loading && (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: text3, fontSize: '12px', fontStyle: 'italic' }}>
              Your story begins here.
            </div>
          )}
          {Object.keys(groupedEntries).map(group => (
            <div key={group} style={{ marginTop: '24px' }}>
              <div style={{ fontSize: '10px', fontWeight: 700, color: text3, padding: '0 12px 10px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{group}</div>
              {groupedEntries[group].map(entry => {
                const active = selectedEntry?.id === entry.id;
                const isRelapse = entry.encrypted_content?.includes('#relapse-reflection');
                const isUrge = entry.encrypted_content?.includes('#urge-surfed');
                
                let firstLine = entry.encrypted_content?.trim().split('\n')[0] || 'Untitled Reflection';
                if (firstLine.startsWith('#')) firstLine = firstLine.replace(/^#+\s*/, '');
                
                let title = firstLine;
                if (isRelapse) title = '⚠️ Relapse Reflection';
                if (isUrge) title = '🛡️ Urge Surfed';

                const dateObj = new Date(entry.date);
                return (
                  <motion.div
                    layout
                    key={entry.id}
                    onClick={() => handleEntrySelect(entry)}
                    style={{
                      padding: '12px', borderRadius: '10px', cursor: 'pointer',
                      background: active ? (isDark ? 'rgba(255,255,255,0.06)' : '#fff') : (isRelapse ? 'rgba(239, 68, 68, 0.05)' : isUrge ? 'rgba(16, 185, 129, 0.05)' : 'transparent'),
                      marginBottom: '4px',
                      border: active ? `1px solid ${border}` : (isRelapse ? '1px solid rgba(239, 68, 68, 0.2)' : isUrge ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid transparent'),
                      boxShadow: active ? 'var(--shadow-sm)' : 'none',
                      transition: 'all 200ms ease',
                    }}
                    whileHover={{ x: 2, background: active ? (isDark ? 'rgba(255,255,255,0.08)' : '#fff') : (isRelapse ? 'rgba(239, 68, 68, 0.1)' : isUrge ? 'rgba(16, 185, 129, 0.1)' : (isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)')) }}
                  >
                    <div style={{ 
                      fontSize: '13px', fontWeight: active ? 700 : 600, 
                      color: isRelapse ? '#ef4444' : isUrge ? '#10b981' : (active ? text1 : text2),
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: '4px'
                    }}>
                      {title}
                    </div>
                    <div style={{ fontSize: '11px', color: text3, display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-mono)' }}>
                      <span>{dateObj.getDate()} {dateObj.toLocaleString('default', { month: 'short' })}</span>
                      <span style={{ opacity: 0.3 }}>|</span>
                      <span>{MOODS.find(m => m.val === entry.mood)?.emoji}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ))}
        </div>
      </aside>

      {/* ── EDITOR ── */}
      {selectedEntry ? (
        <JournalEditor 
          selectedEntry={selectedEntry}
          user={user}
          onSaveSuccess={handleSaveSuccess}
          onDelete={deleteEntry}
          onClose={() => setSelectedEntry(null)}
        />
      ) : (
        <main style={{ overflowY: 'auto', background: isDark ? 'var(--color-base)' : '#fff', position: 'relative' }} className="custom-scrollbar">
          <div style={{ 
            height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: text3, textAlign: 'center', padding: '40px'
          }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div style={{ fontSize: '64px', marginBottom: '24px', filter: 'grayscale(0.5)' }}>📝</div>
              <h3 style={{ fontSize: '20px', color: text1, marginBottom: '12px', fontWeight: 700 }}>Architect Your Mindset</h3>
              <p style={{ fontSize: '15px', maxWidth: '340px', margin: '0 auto', color: text3, lineHeight: 1.6 }}>
                "This isn't a diary. It's a structured log of your ambitions, momentum, and approach to life."
              </p>
              <button 
                onClick={handleNewEntry}
                style={{ 
                  marginTop: '32px', background: 'var(--color-accent)', color: '#fff',
                  border: 'none', padding: '12px 32px', borderRadius: '12px', fontWeight: 700,
                  cursor: 'pointer', boxShadow: 'var(--shadow-lg)'
                }}
                className="hover-glow"
              >Start New Entry</button>
            </motion.div>
          </div>
        </main>
      )}
    </div>
    )}
    </div>
  );
};

export default JournalPage;
