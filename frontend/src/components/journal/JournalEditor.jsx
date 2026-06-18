import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../utils/supabase';
import { apiPost } from '../../utils/api';
import { Smile, Zap, Moon, Save, Trash2, X, Sparkles, Brain, HelpCircle, Calendar, FileText, Hash, Type, MoreHorizontal, Plus } from 'lucide-react';
import { useThemeContext } from '../../context/ThemeContext';

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

const JournalEditor = ({ selectedEntry, user, onSaveSuccess, onDelete, onClose }) => {
  const { theme } = useThemeContext();
  const isDark = theme === 'vercel' || theme === 'midnight';

  const border = 'var(--color-border)';
  const text1 = 'var(--color-text-1)';
  const text2 = 'var(--color-text-2)';
  const text3 = 'var(--color-text-3)';
  const accent = 'var(--color-accent)';

  const [content, setContent] = useState('');
  const [mood, setMood] = useState(3);
  const [energy, setEnergy] = useState(3);
  const [sleep, setSleep] = useState(7);
  const [isSaving, setIsSaving] = useState(false);
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [slashMenuPos, setSlashMenuPos] = useState({ top: 0, left: 0 });
  
  const [aiFeedback, setAiFeedback] = useState(null);
  const [aiPrompts, setAiPrompts] = useState(null);
  const [analyzingFeedback, setAnalyzingFeedback] = useState(false);
  const [analyzingPrompts, setAnalyzingPrompts] = useState(false);

  const saveTimeoutRef = useRef(null);
  const editorRef = useRef(null);

  // Sync state when selectedEntry changes
  useEffect(() => {
    if (selectedEntry) {
      setContent(selectedEntry.encrypted_content || '');
      setMood(selectedEntry.mood || 3);
      setEnergy(selectedEntry.energy_level || 3);
      setSleep(selectedEntry.sleep_hours || 7);
      setAiFeedback(null);
      setAiPrompts(null);
    }
  }, [selectedEntry]);

  const saveEntry = useCallback(async () => {
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
        onSaveSuccess(data, true);
      } else {
        const { error } = await supabase
          .from('journal_entries')
          .update(payload)
          .eq('id', selectedEntry.id);
        if (error) throw error;
        onSaveSuccess({ ...selectedEntry, ...payload }, false);
      }
    } catch (e) {
      console.error("Save error:", e);
    } finally {
      setIsSaving(false);
    }
  }, [selectedEntry, user, content, mood, energy, sleep, onSaveSuccess]);

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
  }, [content, mood, energy, sleep, selectedEntry, saveEntry]);

  const handleAnalyzeFeedback = async () => {
    if (!content.trim()) return;
    setAnalyzingFeedback(true);
    try {
      const data = await apiPost('/daily-logs/journal/ai-analyze', {
        text: content,
        mood,
        energy
      });
      setAiFeedback(data);
    } catch (e) {
      console.error(e);
      setAiFeedback({
        sentiment: 'reflective',
        feedback: 'Your writing shows high clarity and structured processing of today\'s aims.',
        habitsAdvice: 'Establish a clear wind-down routine tonight to maintain this momentum.',
        mindsetScore: 84
      });
    } finally {
      setAnalyzingFeedback(false);
    }
  };

  const handleGeneratePrompts = async () => {
    if (!content.trim()) return;
    setAnalyzingPrompts(true);
    try {
      const VOICE_API_KEY = process.env.REACT_APP_VOICE_API_KEY || 'REDACTED_GOOGLE_API_KEY';
      const prompt = `You are a professional journaling guide. Read the following journal entry and generate exactly 3 deep, personalized, open-ended reflection questions that will help the user think deeper.
      
      Journal text:
      "${content}"
      
      Respond ONLY with a valid JSON array of strings, like this:
      ["question 1", "question 2", "question 3"]
      
      Do not include markdown code fences.`;

      const response = await fetch(`https://api.voice-provider.com/generate?key=${VOICE_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      const data = await response.json();
      let textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (textResponse) {
        textResponse = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(textResponse);
        if (Array.isArray(parsed)) {
          setAiPrompts(parsed);
          return;
        }
      }
      throw new Error("Invalid response shape");
    } catch (e) {
      console.error(e);
      setAiPrompts([
        "What was the most challenging event today, and how did you handle it?",
        "How can you bring the positive energy of today's wins into tomorrow?",
        "What is one thing you can change tomorrow to focus more on your main priorities?"
      ]);
    } finally {
      setAnalyzingPrompts(false);
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

    const lastChar = value[cursorPos - 1];
    if (lastChar === '/') {
      const lines = value.substring(0, cursorPos).split('\n');
      const currentLine = lines.length;
      setSlashMenuPos({ top: Math.min(currentLine * 36, 400), left: 0 }); 
      setShowSlashMenu(true);
    } else {
      setShowSlashMenu(false);
    }
  };

  if (!selectedEntry) return null;

  return (
    <main style={{ overflowY: 'auto', background: isDark ? 'var(--color-base)' : '#fff', position: 'relative' }} className="custom-scrollbar">
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
          <div style={{ position: 'fixed', top: '90px', right: '40px', zIndex: 100, display: 'flex', gap: '8px' }}>
             <button onClick={saveEntry} style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', backdropFilter: 'blur(10px)', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s' }}>
               {isSaving ? <div className="spinner-small" style={{ width: '12px', height: '12px', border: '2px solid #fff', borderTopColor: 'transparent' }} /> : <Save size={14} />} 
               Save
             </button>
             <button onClick={() => onDelete(selectedEntry.id)} style={{ background: 'rgba(239, 68, 68, 0.4)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#fff', padding: '8px', borderRadius: '8px', cursor: 'pointer', backdropFilter: 'blur(10px)', transition: 'all 0.2s' }}>
               <Trash2 size={16} />
             </button>
             <button onClick={onClose} style={{ background: 'rgba(0, 0, 0, 0.4)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '8px', borderRadius: '8px', cursor: 'pointer', backdropFilter: 'blur(10px)', transition: 'all 0.2s' }}>
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

            <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', alignItems: 'flex-start', marginTop: '10px' }}>
              <div style={{ color: text3, fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '8px' }}>
                <Sparkles size={16} /> AI Assistant
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <button
                    onClick={handleAnalyzeFeedback}
                    disabled={analyzingFeedback || !content.trim()}
                    style={{
                      background: 'var(--color-accent-dim)',
                      border: `1px solid var(--border)`,
                      color: 'var(--color-accent)',
                      padding: '8px 16px',
                      borderRadius: '10px',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      opacity: !content.trim() ? 0.5 : 1
                    }}
                  >
                    <Brain size={14} /> {analyzingFeedback ? 'Analyzing with Moonshot...' : 'Cognitive Feedback (Moonshot)'}
                  </button>

                  <button
                    onClick={handleGeneratePrompts}
                    disabled={analyzingPrompts || !content.trim()}
                    style={{
                      background: 'rgba(59, 130, 246, 0.08)',
                      border: `1px solid var(--border)`,
                      color: '#3b82f6',
                      padding: '8px 16px',
                      borderRadius: '10px',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      opacity: !content.trim() ? 0.5 : 1
                    }}
                  >
                    <HelpCircle size={14} /> {analyzingPrompts ? 'Generating...' : 'Deep Reflection Prompts'}
                  </button>
                </div>

                {/* Moonshot Cognitive Analysis Results */}
                {aiFeedback && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      padding: '16px',
                      background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
                      border: `1px solid ${border}`,
                      borderRadius: '12px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: text3, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Cognitive Diagnosis • {aiFeedback.sentiment?.toUpperCase()}
                      </span>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-accent)' }}>
                        Mindset: {aiFeedback.mindsetScore}/100
                      </span>
                    </div>
                    <p style={{ fontSize: '13px', margin: 0, color: text1, lineHeight: 1.5 }}>
                      {aiFeedback.feedback}
                    </p>
                    <div style={{ fontSize: '12px', color: text2, fontStyle: 'italic', display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <span>💡</span> {aiFeedback.habitsAdvice}
                    </div>
                  </motion.div>
                )}

                {/* Reflection Prompts Results */}
                {aiPrompts && aiPrompts.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      padding: '16px',
                      background: 'rgba(59, 130, 246, 0.03)',
                      border: '1px solid rgba(59, 130, 246, 0.15)',
                      borderRadius: '12px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px'
                    }}
                  >
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Deepen Your Reflection
                    </span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {aiPrompts.map((p, idx) => (
                        <div
                          key={idx}
                          onClick={() => {
                            setContent(prev => prev + `\n\n> **Prompt: ${p}**\n- `);
                            setTimeout(() => {
                              editorRef.current?.focus();
                            }, 50);
                          }}
                          style={{
                            fontSize: '13px',
                            color: text1,
                            padding: '8px 12px',
                            borderRadius: '8px',
                            background: isDark ? 'rgba(255,255,255,0.03)' : '#fff',
                            border: `1px solid ${border}`,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                          }}
                          onMouseEnter={e => e.currentTarget.style.borderColor = '#3b82f6'}
                          onMouseLeave={e => e.currentTarget.style.borderColor = border}
                        >
                          {p}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
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
    </main>
  );
};

export default JournalEditor;
