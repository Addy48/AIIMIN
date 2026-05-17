import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useThemeContext } from '../context/ThemeContext';
import { supabase } from '../utils/supabase';
import { Search, Plus, MoreHorizontal, Smile, Zap, Moon, Calendar, ChevronRight, Hash, Type, Trash2, Save, FileText, X } from 'lucide-react';

/* ── Configuration & Constants ── */
const MOODS = [
  { val: 1, emoji: '😞', label: 'Rough', color: '#ef4444' },
  { val: 2, emoji: '😐', label: 'Meh', color: '#f59e0b' },
  { val: 3, emoji: '😊', label: 'Okay', color: '#10b981' },
  { val: 4, emoji: '😄', label: 'Good', color: '#3b82f6' },
  { val: 5, emoji: '🔥', label: 'Great', color: '#8b5cf6' },
];

const COVERS = [
  'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&q=80&w=2000',
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=2000',
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=2000',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=2000',
  'https://images.unsplash.com/photo-1500627845662-01210452945d?auto=format&fit=crop&q=80&w=2000',
];

const JournalPage = () => {
  const { user } = useAuth();
  const { theme } = useThemeContext();
  const isDark = theme === 'dark';

  // State
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [search, setSearch] = useState('');
  
  // Editor State
  const [content, setContent] = useState('');
  const [mood, setMood] = useState(3);
  const [energy, setEnergy] = useState(3);
  const [sleep, setSleep] = useState(7);
  const [isSaving, setIsSaving] = useState(false);
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [slashMenuPos, setSlashMenuPos] = useState({ top: 0, left: 0 });
  const saveTimeoutRef = useRef(null);
  const editorRef = useRef(null);

  // Styling Tokens
  const border = 'var(--color-border)';
  const text1 = 'var(--color-text-1)';
  const text2 = 'var(--color-text-2)';
  const text3 = 'var(--color-text-3)';
  const accent = 'var(--color-accent)';

  useEffect(() => {
    if (user) fetchEntries();
  }, [user]);

  const fetchEntries = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });
      
      if (error) throw error;
      setEntries(data || []);
      if (data?.length > 0 && !selectedEntry) {
        setSelectedEntry(data[0]);
        syncEditor(data[0]);
      }
    } catch (e) {
      console.error("Journal fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  const syncEditor = (entry) => {
    setContent(entry.encrypted_content || '');
    setMood(entry.mood || 3);
    setEnergy(entry.energy_level || 3);
    setSleep(entry.sleep_hours || 7);
  };

  const handleEntrySelect = (entry) => {
    setIsCreating(false);
    setSelectedEntry(entry);
    syncEditor(entry);
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
    setIsCreating(true);
    setSelectedEntry(newEntry);
    syncEditor(newEntry);
  };

  const deleteEntry = async (id) => {
    if (!window.confirm("Are you sure you want to delete this entry?")) return;
    try {
      const { error } = await supabase.from('journal_entries').delete().eq('id', id);
      if (error) throw error;
      setEntries(entries.filter(e => e.id !== id));
      if (selectedEntry?.id === id) {
        setSelectedEntry(entries[0] || null);
        if (entries[0]) syncEditor(entries[0]);
      }
    } catch (e) {
      console.error("Delete error:", e);
    }
  };

  // Auto-save logic
  useEffect(() => {
    if (!selectedEntry || selectedEntry.id.toString().startsWith('temp')) return;

    const hasChanged = 
      content !== (selectedEntry.encrypted_content || '') ||
      mood !== (selectedEntry.mood || 3) ||
      energy !== (selectedEntry.energy_level || 3) ||
      sleep !== (selectedEntry.sleep_hours || 7);

    if (!hasChanged) return;

    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    
    saveTimeoutRef.current = setTimeout(() => {
      saveEntry();
    }, 1500);

    return () => clearTimeout(saveTimeoutRef.current);
  }, [content, mood, energy, sleep]);

  const saveEntry = async () => {
    if (!selectedEntry || !user) return;
    setIsSaving(true);
    
    try {
      const payload = {
        encrypted_content: content,
        mood,
        energy_level: energy,
        sleep_hours: sleep,
        user_id: user.id,
        date: selectedEntry.date
      };

      if (selectedEntry.id.toString().startsWith('temp')) {
        const { data, error } = await supabase
          .from('journal_entries')
          .insert(payload)
          .select()
          .single();
        if (error) throw error;
        setEntries([data, ...entries]);
        setSelectedEntry(data);
        setIsCreating(false);
      } else {
        const { error } = await supabase
          .from('journal_entries')
          .update(payload)
          .eq('id', selectedEntry.id);
        if (error) throw error;
        setEntries(entries.map(e => e.id === selectedEntry.id ? { ...e, ...payload } : e));
      }
    } catch (e) {
      console.error("Save error:", e);
    } finally {
      setIsSaving(false);
    }
  };

  const insertCommand = (type) => {
    if (!editorRef.current) return;
    const start = editorRef.current.selectionStart;
    const end = editorRef.current.selectionEnd;
    const currentVal = content;
    
    // Remove the '/' that triggered the menu
    const beforeSlash = currentVal.substring(0, start - 1);
    const afterSlash = currentVal.substring(end);
    
    let insertion = '';
    let newCursorPos = start;

    switch (type) {
      case 'h1':
        insertion = '# ';
        break;
      case 'h2':
        insertion = '## ';
        break;
      case 'hr':
        insertion = '\n---\n';
        break;
      case 'template':
        insertion = '\n# Mindset & Momentum\n\n## 🎯 Core Aims & Focus\n- \n\n## 🔥 Achievements & Wins\n- \n\n## 🌱 Approach to Life\n- \n';
        break;
      case 'list':
        insertion = '- ';
        break;
      default:
        insertion = '';
    }

    const newVal = beforeSlash + insertion + afterSlash;
    setContent(newVal);
    setShowSlashMenu(false);
    
    // Restore focus and set cursor (needs timeout to let React update)
    setTimeout(() => {
      editorRef.current.focus();
      const pos = beforeSlash.length + insertion.length;
      editorRef.current.setSelectionRange(pos, pos);
    }, 10);
  };

  const handleTextareaChange = (e) => {
    const value = e.target.value;
    const cursorPos = e.target.selectionStart;
    setContent(value);

    // Simple Slash Command Detection
    const lastChar = value[cursorPos - 1];
    if (lastChar === '/') {
      // Calculate a rough position for the menu
      // In a real app, we'd use a hidden mirror div to get exact pixel coordinates
      const lines = value.substring(0, cursorPos).split('\n');
      const currentLine = lines.length;
      setSlashMenuPos({ top: Math.min(currentLine * 36, 400), left: 0 }); 
      setShowSlashMenu(true);
    } else {
      setShowSlashMenu(false);
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
      display: 'grid', 
      gridTemplateColumns: '320px 1fr', 
      height: 'calc(100vh - var(--nav-height) - 40px)',
      background: isDark ? 'var(--color-base)' : '#FBFBFA',
      margin: '-20px -24px',
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
                const firstLine = entry.encrypted_content?.trim().split('\n')[0] || 'Untitled Reflection';
                const dateObj = new Date(entry.date);
                return (
                  <motion.div
                    layout
                    key={entry.id}
                    onClick={() => handleEntrySelect(entry)}
                    style={{
                      padding: '12px', borderRadius: '10px', cursor: 'pointer',
                      background: active ? (isDark ? 'rgba(255,255,255,0.06)' : '#fff') : 'transparent',
                      marginBottom: '4px',
                      border: active ? `1px solid ${border}` : '1px solid transparent',
                      boxShadow: active ? 'var(--shadow-sm)' : 'none',
                      transition: 'all 200ms ease',
                    }}
                    whileHover={{ x: 2, background: active ? (isDark ? 'rgba(255,255,255,0.08)' : '#fff') : (isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)') }}
                  >
                    <div style={{ 
                      fontSize: '13px', fontWeight: active ? 700 : 500, color: active ? text1 : text2,
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: '4px'
                    }}>
                      {firstLine}
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
      <main style={{ overflowY: 'auto', background: isDark ? 'var(--color-base)' : '#fff', position: 'relative' }} className="custom-scrollbar">
        {selectedEntry ? (
          <div style={{ paddingBottom: '120px' }}>
            {/* Cover Area */}
            <div style={{ 
              height: '340px', width: '100%', position: 'relative',
              background: `url(${COVERS[new Date(selectedEntry.date).getDate() % COVERS.length]}) center/cover no-repeat`,
            }}>
              <div style={{ 
                position: 'absolute', inset: 0, 
                background: isDark ? 'linear-gradient(to bottom, transparent 40%, var(--color-base) 100%)' : 'linear-gradient(to bottom, transparent 40%, #fff 100%)'
              }} />
              
              {/* Floating Action Menu */}
              <div style={{ position: 'absolute', top: '24px', right: '40px', display: 'flex', gap: '8px' }}>
                 <button onClick={saveEntry} style={{ background: 'rgba(0,0,0,0.3)', border: 'none', color: '#fff', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', backdropFilter: 'blur(10px)', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                   <Save size={14} /> Save
                 </button>
                 <button onClick={() => deleteEntry(selectedEntry.id)} style={{ background: 'rgba(239, 68, 68, 0.3)', border: 'none', color: '#ff8080', padding: '8px', borderRadius: '8px', cursor: 'pointer', backdropFilter: 'blur(10px)' }}>
                   <Trash2 size={16} />
                 </button>
                 <button onClick={() => setSelectedEntry(null)} style={{ background: 'rgba(0, 0, 0, 0.3)', border: 'none', color: '#fff', padding: '8px', borderRadius: '8px', cursor: 'pointer', backdropFilter: 'blur(10px)' }}>
                   <X size={16} />
                 </button>
              </div>

              <div style={{ 
                position: 'absolute', bottom: '0px', left: 'max(40px, 15%)',
                fontSize: '84px', filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.3))',
                transform: 'translateY(30%)'
              }}>
                {MOODS.find(m => m.val === mood)?.emoji || '📓'}
              </div>
            </div>

            {/* Content Container */}
            <div style={{ maxWidth: '800px', margin: '80px auto 0', padding: '0 60px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Calendar size={14} style={{ color: accent }} />
                  <span style={{ fontSize: '13px', color: text3, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                    {new Date(selectedEntry.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                {isSaving && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: accent }}>
                    <div className="spinner-small" style={{ width: '12px', height: '12px', border: `2px solid ${accent}`, borderTopColor: 'transparent' }} />
                    <span style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '0.1em' }}>SYNCING</span>
                  </motion.div>
                )}
              </div>

              {/* Properties Grid — Notion Style */}
              <div style={{ 
                padding: '32px 0', borderTop: `1px solid ${border}`, borderBottom: `1px solid ${border}`,
                marginBottom: '56px', display: 'flex', flexDirection: 'column', gap: '20px'
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', alignItems: 'center' }}>
                  <div style={{ color: text3, fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Smile size={16} /> Mood
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {MOODS.map(m => (
                      <button
                        key={m.val}
                        onClick={() => setMood(m.val)}
                        style={{
                          background: mood === m.val ? m.color + '15' : 'transparent',
                          border: mood === m.val ? `1.5px solid ${m.color}` : `1px solid ${border}`,
                          color: mood === m.val ? m.color : text2,
                          padding: '5px 14px', borderRadius: '20px', cursor: 'pointer',
                          fontSize: '12px', fontWeight: 700, transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
                          display: 'flex', alignItems: 'center', gap: '6px'
                        }}
                      ><span>{m.emoji}</span> {m.label}</button>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', alignItems: 'center' }}>
                  <div style={{ color: text3, fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Zap size={16} /> Energy Level
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <input 
                      type="range" min="1" max="5" value={energy} 
                      onChange={e => setEnergy(parseInt(e.target.value))}
                      style={{ width: '160px', accentColor: accent }}
                    />
                    <span style={{ fontSize: '13px', fontWeight: 700, color: text2 }}>{energy}/5</span>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', alignItems: 'center' }}>
                  <div style={{ color: text3, fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Moon size={16} /> Sleep Quality
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <input 
                      type="number" value={sleep} step="0.5"
                      onChange={e => setSleep(parseFloat(e.target.value))}
                      style={{ 
                        width: '60px', background: 'transparent', border: `1px solid ${border}`,
                        color: text1, padding: '6px 10px', borderRadius: '8px', fontSize: '14px', fontWeight: 600
                      }}
                    />
                    <span style={{ fontSize: '13px', color: text3 }}>hours</span>
                  </div>
                </div>
              </div>

              {/* Writing Area */}
              <div style={{ position: 'relative' }}>
                <textarea
                  ref={editorRef}
                  value={content}
                  onChange={handleTextareaChange}
                  placeholder="Press '/' for commands or just start typing..."
                  style={{
                    width: '100%',
                    minHeight: '600px',
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: text1,
                    fontSize: '20px',
                    lineHeight: '1.8',
                    fontFamily: '"Lora", "Georgia", serif',
                    resize: 'none',
                    padding: '0',
                    fontWeight: 400,
                  }}
                />

                {/* Slash Menu Simulation */}
                <AnimatePresence>
                  {showSlashMenu && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                      style={{
                        position: 'absolute', top: slashMenuPos.top, left: slashMenuPos.left,
                        background: isDark ? 'var(--bg-elevated)' : '#fff',
                        border: `1px solid ${border}`, borderRadius: '12px',
                        boxShadow: 'var(--shadow-xl)', padding: '8px', zIndex: 100, width: '240px'
                      }}
                    >
                      <div style={{ fontSize: '10px', fontWeight: 800, color: text3, padding: '8px 12px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Commands</div>
                      {[
                        { icon: <FileText size={14}/>, label: 'Standard Template', cmd: 'template', desc: 'Add structure to your day' },
                        { icon: <Hash size={14}/>, label: 'Heading 1', cmd: 'h1', desc: 'Large section heading' },
                        { icon: <Type size={14}/>, label: 'Heading 2', cmd: 'h2', desc: 'Medium section heading' },
                        { icon: <MoreHorizontal size={14}/>, label: 'Divider', cmd: 'hr', desc: 'Visual separation' },
                        { icon: <Plus size={14}/>, label: 'Bulleted List', cmd: 'list', desc: 'Simple bullet point' },
                      ].map(item => (
                        <div 
                          key={item.cmd}
                          onClick={() => insertCommand(item.cmd)}
                          style={{ 
                            padding: '10px 12px', borderRadius: '8px', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '12px', transition: 'all 200ms ease'
                          }}
                          className="hover-bg-notion"
                        >
                          <div style={{ 
                            width: '32px', height: '32px', borderRadius: '6px', background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', color: accent, border: `1px solid ${border}`
                          }}>{item.icon}</div>
                          <div>
                            <div style={{ fontSize: '13px', fontWeight: 600, color: text1 }}>{item.label}</div>
                            <div style={{ fontSize: '10px', color: text3, marginTop: '2px' }}>{item.desc}</div>
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        ) : (
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
        )}
      </main>
    </div>
  );
};

export default JournalPage;

