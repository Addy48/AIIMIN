import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../utils/supabase';
import { createJournalEntry } from '../../api/journal';
import { generateWithGemini } from '../../utils/serverAi';
import {
  Search,
  Compass,
  BookOpen,
  Heart,
  TrendingUp,
  Target,
  Brain,
  Calendar,
  FileText,
  Zap,
  Star,
  Activity,
  Settings,
  ChevronRight,
  BarChart2,
  Briefcase,
  Shield,
  Smile,
  CheckCircle,
  StickyNote,
  Mic,
} from 'lucide-react';

/* ─────────────────────────────────────────────
   ACTION REGISTRY
   type: 'navigate' | 'inline_input' | 'mood'
───────────────────────────────────────────── */
const ALL_ACTIONS = [
  // ── Navigation ──────────────────────────────
  {
    id: 'nav_overview',
    label: 'Go to Overview',
    description: 'Your daily command center',
    route: '/overview',
    icon: Compass,
    category: 'Navigation',
    type: 'navigate',
    keywords: ['home', 'overview', 'today', 'dashboard'],
  },
  {
    id: 'nav_habits',
    label: 'Go to Habits',
    description: 'Track your daily habits',
    route: '/habits',
    icon: Activity,
    category: 'Navigation',
    type: 'navigate',
    keywords: ['habits', 'streaks', 'routine'],
  },
  {
    id: 'nav_goals',
    label: 'Go to Goals',
    description: 'Manage your long-term goals',
    route: '/goals',
    icon: Target,
    category: 'Navigation',
    type: 'navigate',
    keywords: ['goals', 'targets', 'objectives'],
  },
  {
    id: 'nav_discipline',
    label: 'Go to Discipline',
    description: 'Discipline tracking & scores',
    route: '/discipline',
    icon: Shield,
    category: 'Navigation',
    type: 'navigate',
    keywords: ['discipline', 'score', 'consistency'],
  },
  {
    id: 'nav_journal',
    label: 'Go to Journal',
    description: 'Write and reflect',
    route: '/journal',
    icon: BookOpen,
    category: 'Navigation',
    type: 'navigate',
    keywords: ['journal', 'write', 'reflect', 'diary'],
  },
  {
    id: 'nav_focus',
    label: 'Go to Focus Room',
    description: 'Deep work & Pomodoro',
    route: '/focus',
    icon: Zap,
    category: 'Navigation',
    type: 'navigate',
    keywords: ['focus', 'pomodoro', 'deep work', 'timer'],
  },
  {
    id: 'nav_notes',
    label: 'Go to Notes',
    description: 'Quick notes & knowledge base',
    route: '/notes',
    icon: FileText,
    category: 'Navigation',
    type: 'navigate',
    keywords: ['notes', 'knowledge', 'docs'],
  },
  {
    id: 'nav_calendar',
    label: 'Go to Calendar',
    description: 'Schedule & events',
    route: '/calendar',
    icon: Calendar,
    category: 'Navigation',
    type: 'navigate',
    keywords: ['calendar', 'schedule', 'events', 'appointments'],
  },
  {
    id: 'nav_finance',
    label: 'Go to Finance',
    description: 'Wealth & money tracking',
    route: '/finance',
    icon: TrendingUp,
    category: 'Navigation',
    type: 'navigate',
    keywords: ['finance', 'money', 'wealth', 'budget', 'spending'],
  },
  {
    id: 'nav_lab',
    label: 'Go to Lab',
    description: 'Experiments & analytics',
    route: '/lab',
    icon: Brain,
    category: 'Navigation',
    type: 'navigate',
    keywords: ['lab', 'experiments', 'analytics'],
  },
  {
    id: 'nav_vocal_mastery',
    label: 'Go to Vocal Mastery',
    description: 'AI Voice logging & debate',
    route: '/lab?module=speaking',
    icon: Mic,
    category: 'Navigation',
    type: 'navigate',
    keywords: ['voice', 'speaking', 'vocal', 'mastery', 'logger', 'command'],
  },
  {
    id: 'nav_family',
    label: 'Go to Family Vault',
    description: 'Family health & bonds',
    route: '/family',
    icon: Heart,
    category: 'Navigation',
    type: 'navigate',
    keywords: ['family', 'vault', 'health', 'bonds'],
  },
  {
    id: 'nav_reports',
    label: 'Go to Reports',
    description: 'Report · patterns · skills (ex-Insights)',
    route: '/reports',
    icon: BarChart2,
    category: 'Navigation',
    type: 'navigate',
    keywords: ['reports', 'insights', 'patterns', 'skills', 'weekly', 'monthly'],
  },
  {
    id: 'nav_reports_patterns',
    label: 'Go to Patterns',
    description: 'Behavioral patterns inside Reports',
    route: '/reports?tab=patterns',
    icon: BarChart2,
    category: 'Navigation',
    type: 'navigate',
    keywords: ['patterns', 'insights', 'behavior', 'drivers'],
  },
  {
    id: 'nav_placements',
    label: 'Go to Placements',
    description: 'Career & placement tracking',
    route: '/placements',
    icon: Briefcase,
    category: 'Navigation',
    type: 'navigate',
    keywords: ['placements', 'career', 'jobs', 'internships'],
  },
  {
    id: 'nav_settings',
    label: 'Go to Settings',
    description: 'App preferences & account',
    route: '/settings',
    icon: Settings,
    category: 'Navigation',
    type: 'navigate',
    keywords: ['settings', 'preferences', 'account', 'theme'],
  },
  {
    id: 'nav_sports',
    label: 'Go to Sports',
    description: 'Live sports context',
    route: '/sports',
    icon: Activity,
    category: 'Navigation',
    type: 'navigate',
    keywords: ['sports', 'cricket', 'football', 'scores', 'live'],
  },
  {
    id: 'nav_account',
    label: 'Go to Account',
    description: 'Profile, billing, personalization',
    route: '/account',
    icon: Settings,
    category: 'Navigation',
    type: 'navigate',
    keywords: ['account', 'profile', 'billing', 'personalization'],
  },

  // ── Quick Actions ────────────────────────────
  {
    id: 'ai_log',
    label: 'Smart AI Log',
    description: 'Tell AI what happened (voice or text) and let it sort',
    icon: Brain,
    category: 'Quick Log',
    type: 'ai_log',
    placeholder: 'Tell AI what you did... (Enter to save)',
    keywords: ['ai', 'smart', 'log', 'voice', 'auto', 'brain'],
  },
  {
    id: 'log_win',
    label: 'Log a Win',
    description: 'Capture a quick win or achievement',
    icon: Star,
    category: 'Quick Log',
    type: 'inline_input',
    action: 'log_win',
    supabaseTable: 'wins',
    placeholder: 'Describe your win… (Enter to save)',
    keywords: ['win', 'achievement', 'log win', 'victory', 'success'],
  },
  {
    id: 'log_note',
    label: 'Log a Note',
    description: 'Jot down a quick thought or idea',
    icon: StickyNote,
    category: 'Quick Log',
    type: 'inline_input',
    action: 'log_note',
    supabaseTable: 'notes',
    placeholder: 'Type your note… (Enter to save)',
    keywords: ['note', 'idea', 'thought', 'log note', 'jot'],
  },

  {
    id: 'voice_log',
    label: 'Voice Log',
    description: 'Quickly dictate a note or log entry',
    icon: Mic,
    category: 'Quick Log',
    type: 'voice',
    supabaseTable: 'notes',
    keywords: ['voice', 'dictate', 'audio', 'log voice', 'record'],
  },
  {
    id: 'check_mood',
    label: 'Check Mood',
    description: 'Log how you\'re feeling right now (1–10)',
    icon: Smile,
    category: 'Quick Log',
    type: 'mood',
    supabaseTable: 'lab_mindset_logs',
    keywords: ['mood', 'feel', 'feeling', 'emotion', 'vibe'],
  },
];

const MOOD_OPTIONS = [
  { value: 1,  emoji: '😩', label: 'Terrible' },
  { value: 2,  emoji: '😞', label: 'Bad' },
  { value: 3,  emoji: '😔', label: 'Low' },
  { value: 4,  emoji: '😐', label: 'Meh' },
  { value: 5,  emoji: '🙂', label: 'OK' },
  { value: 6,  emoji: '😊', label: 'Good' },
  { value: 7,  emoji: '😄', label: 'Great' },
  { value: 8,  emoji: '😁', label: 'Awesome' },
  { value: 9,  emoji: '🤩', label: 'Amazing' },
  { value: 10, emoji: '🔥', label: 'On Fire' },
];

const CATEGORY_COLORS = {
  Navigation: 'rgba(99, 179, 237, 0.15)',
  'Quick Log': 'rgba(154, 117, 234, 0.15)',
};

const CATEGORY_TEXT = {
  Navigation: '#63b3ed',
  'Quick Log': '#9a75ea',
};

/* ── Helpers ─────────────────────────────────── */
function matchesSearch(action, query) {
  const q = query.toLowerCase().trim();
  if (!q) return true;
  const haystack = [
    action.label,
    action.description || '',
    action.category,
    ...(action.keywords || []),
  ]
    .join(' ')
    .toLowerCase();
  return haystack.includes(q);
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
export default function CommandPalette() {
  const { user } = useAuth();
  const [isOpen, setIsOpen]             = useState(false);
  const [search, setSearch]             = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Inline action states
  const [activeAction, setActiveAction] = useState(null); // action object when expanded
  const [inlineText, setInlineText]     = useState('');
  const [successMsg, setSuccessMsg]     = useState('');

  // Voice State
  const [isListening, setIsListening] = useState(false);
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const recognitionRef = useRef(null);

  const inputRef       = useRef(null);
  const inlineInputRef = useRef(null);
  const listRef        = useRef(null);
  const navigate       = useNavigate();

  /* ── Open / close ─────────────────────────── */
  const openPalette = useCallback(() => {
    setIsOpen(true);
    setSearch('');
    setSelectedIndex(0);
    setActiveAction(null);
    setInlineText('');
    setSuccessMsg('');
  }, []);

  const closePalette = useCallback(() => {
    setIsOpen(false);
    setActiveAction(null);
    setInlineText('');
    setSuccessMsg('');
    setSearch('');
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, []);

  /* ── Voice Dictation logic ────────────────── */
  const toggleListening = useCallback(() => {
    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
    } else {
      if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        setSuccessMsg("Browser doesn't support speech recognition.");
        return;
      }
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      
      recognition.onresult = (event) => {
        let transcript = '';
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setInlineText(transcript);
      };
      
      recognition.onerror = (e) => console.error('Speech recognition error', e);
      
      try {
        recognition.start();
        setIsListening(true);
        recognitionRef.current = recognition;
      } catch (err) {
        console.error('Failed to start recognition', err);
      }
    }
  }, [isListening]);

  /* ── Spacebar to toggle voice ─────────────── */
  useEffect(() => {
    const onVoiceKeyDown = (e) => {
      if ((activeAction?.type === 'voice' || activeAction?.type === 'ai_log') && e.code === 'Space' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault();
        toggleListening();
      }
    };
    window.addEventListener('keydown', onVoiceKeyDown);
    return () => window.removeEventListener('keydown', onVoiceKeyDown);
  }, [activeAction, toggleListening]);

  /* ── Global keyboard listener ─────────────── */
  useEffect(() => {
    const onKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) closePalette();
        else openPalette();
      }
      if (e.key === 'Escape' && isOpen) closePalette();
    };
    const onOpenEvent = () => openPalette();
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('aiimin:open-command-palette', onOpenEvent);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('aiimin:open-command-palette', onOpenEvent);
    };
  }, [isOpen, openPalette, closePalette]);

  /* ── Focus management ─────────────────────── */
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        if (activeAction?.type === 'inline_input') {
          inlineInputRef.current?.focus();
        } else {
          inputRef.current?.focus();
        }
      }, 60);
    }
  }, [isOpen, activeAction]);

  /* ── Filter actions ───────────────────────── */
  const filteredActions = ALL_ACTIONS.filter((a) => matchesSearch(a, search));

  /* ── Reset selection when search changes ──── */
  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  /* ── Scroll selected item into view ──────── */
  useEffect(() => {
    if (!listRef.current) return;
    const items = listRef.current.querySelectorAll('[data-action-item]');
    if (items[selectedIndex]) {
      items[selectedIndex].scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  /* ── Execute a selected action ────────────── */
  const executeAction = useCallback(
    (action) => {
      if (action.type === 'navigate') {
        closePalette();
        navigate(action.route);
      } else if (action.type === 'inline_input' || action.type === 'mood' || action.type === 'voice' || action.type === 'ai_log') {
        setActiveAction(action);
        setInlineText('');
        setSuccessMsg('');
        setIsAiProcessing(false);
        if (action.type === 'inline_input' || action.type === 'ai_log') {
          setTimeout(() => inlineInputRef.current?.focus(), 80);
        }
      }
    },
    [closePalette, navigate]
  );

  /* ── Save inline text (win / note) ───────── */
  const saveInlineText = useCallback(async () => {
    if (!inlineText.trim() || !activeAction || !user || user.isGuest) {
        if(user?.isGuest) {
            setSuccessMsg('Guest: Saved Locally');
            setTimeout(() => closePalette(), 800);
        }
        return;
    }
    
    try {
        if (activeAction.type === 'ai_log') {
             setIsAiProcessing(true);
             const prompt = `Categorize the following text into one of these types: "win", "note", "mood", "task", "journal". Then extract the relevant text or value. Text: "${inlineText.trim()}". Respond strictly with JSON format: {"type": "win|note|mood|task|journal", "content": "extracted text or 1-10 value"}`;
             const responseText = await generateWithGemini({ prompt, maxTokens: 256, temperature: 0.2 });
             
             let parsed = { type: 'note', content: inlineText.trim() };
             try {
                 const jsonMatch = responseText.match(/\{[\s\S]*\}/);
                 if (jsonMatch) parsed = JSON.parse(jsonMatch[0]);
             } catch(e) {}
             
             if (parsed.type === 'win') {
                 await supabase.from('wins').insert([{ user_id: user.id, text: parsed.content, day_of: new Date().toISOString().split('T')[0] }]);
             } else if (parsed.type === 'mood') {
                 const mVal = parseInt(parsed.content) || 5;
                 await supabase.from('lab_mindset_logs').insert([{ user_id: user.id, state: mVal >= 7 ? 'Flow' : mVal >= 4 ? 'Neutral' : 'Burnout', notes: `AI Logged Mood: ${parsed.content}`, day_of: new Date().toISOString().split('T')[0] }]);
             } else if (parsed.type === 'task') {
                 await supabase.from('tasks').insert([{ user_id: user.id, text: parsed.content, is_completed: false, order_index: 0 }]);
             } else if (parsed.type === 'journal') {
                 await createJournalEntry({
                   user_id: user.id,
                   title: 'AI Log',
                   encrypted_content: parsed.content,
                   date: new Date().toISOString().split('T')[0],
                 });
             } else {
                 await supabase.from('notes').insert([{ user_id: user.id, text: parsed.content, created_at: new Date().toISOString() }]);
             }
             
             setIsAiProcessing(false);
             setSuccessMsg(`✓ AI categorised & logged as ${parsed.type}!`);
             setTimeout(() => closePalette(), 1200);
             return;
        }

        if (activeAction.action === 'log_win') {
             await supabase.from('wins').insert([{ user_id: user.id, text: inlineText.trim(), day_of: new Date().toISOString().split('T')[0] }]);
        } else if (activeAction.action === 'log_note') {
             await supabase.from('notes').insert([{ user_id: user.id, text: inlineText.trim(), created_at: new Date().toISOString() }]);
        }
        setSuccessMsg('✓ Logged to Vault!');
        setTimeout(() => closePalette(), 800);
    } catch(e) {
        console.error(e);
        setIsAiProcessing(false);
        setSuccessMsg('Error saving log.');
    }
  }, [inlineText, activeAction, closePalette, user]);

  /* ── Save mood ────────────────────────────── */
  const saveMood = useCallback(async (moodValue, moodLabel) => {
      if (!activeAction || !user || user.isGuest) {
          if(user?.isGuest) {
              setSuccessMsg(`Guest Mood: ${moodLabel}`);
              setTimeout(() => closePalette(), 800);
          }
          return;
      }
      try {
          await supabase.from('lab_mindset_logs').insert([{ 
              user_id: user.id, 
              state: moodValue >= 7 ? 'Flow' : moodValue >= 4 ? 'Neutral' : 'Burnout',
              notes: `Mood Logged: ${moodValue}/10 - ${moodLabel}`,
              day_of: new Date().toISOString().split('T')[0]
          }]);
          setSuccessMsg(`✓ Mood logged: ${moodLabel}`);
          setTimeout(() => closePalette(), 800);
      } catch(e) {
          console.error(e);
      }
    },
    [activeAction, closePalette, user]
  );

  /* ── Keyboard navigation in list ─────────── */
  const onSearchKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((i) => (i + 1) % Math.max(filteredActions.length, 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((i) =>
        (i - 1 + Math.max(filteredActions.length, 1)) % Math.max(filteredActions.length, 1)
      );
    } else if (e.key === 'Enter' && filteredActions.length > 0) {
      e.preventDefault();
      executeAction(filteredActions[selectedIndex]);
    }
  };

  /* ── Inline input keydown ─────────────────── */
  const onInlineKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveInlineText();
    } else if (e.key === 'Escape') {
      setActiveAction(null);
      setInlineText('');
      setTimeout(() => inputRef.current?.focus(), 60);
    }
  };

  /* ── Group filtered actions by category ───── */
  const grouped = filteredActions.reduce((acc, action) => {
    if (!acc[action.category]) acc[action.category] = [];
    acc[action.category].push(action);
    return acc;
  }, {});

  // Flat list with category headers for index tracking
  const flatList = filteredActions;

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '12vh',
        background: 'rgba(0,0,0,0.65)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
      }}
      onClick={closePalette}
    >
      {/* ── Palette card ─────────────────────── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: -16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: -8 }}
        transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '620px',
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: '18px',
          boxShadow: '0 32px 64px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.04)',
          overflow: 'hidden',
          position: 'relative',
          fontFamily: 'var(--font-sans)',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '72vh',
        }}
      >
        {/* ── Search bar ───────────────────────── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '14px 18px',
            borderBottom: '1px solid var(--color-border)',
            gap: '12px',
            flexShrink: 0,
          }}
        >
          <Search size={18} style={{ color: 'var(--color-text-3)', flexShrink: 0 }} />
          <input
            ref={inputRef}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              if (activeAction) setActiveAction(null);
            }}
            onKeyDown={onSearchKeyDown}
            placeholder="Search pages, log a win, check mood…"
            style={{
              flex: 1,
              border: 'none',
              background: 'transparent',
              outline: 'none',
              fontSize: '15px',
              color: 'var(--color-text-1)',
              fontFamily: 'var(--font-sans)',
            }}
          />
          <button
            onClick={() => {
              const aiLogAction = ALL_ACTIONS.find(a => a.id === 'ai_log');
              if (aiLogAction) {
                executeAction(aiLogAction);
                if (!isListening) setTimeout(() => toggleListening(), 150);
              }
            }}
            title="Start Voice Log"
            style={{
              background: isListening ? 'rgba(239, 68, 68, 0.1)' : 'transparent',
              border: 'none',
              color: isListening ? '#ef4444' : 'var(--color-text-3)',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s'
            }}
          >
            <Mic size={16} style={{ animation: isListening ? 'pulse 2s infinite' : 'none' }} />
          </button>
          <kbd
            style={{
              fontSize: '11px',
              color: 'var(--color-text-3)',
              background: 'var(--color-elevated)',
              border: '1px solid var(--color-border)',
              borderRadius: '5px',
              padding: '2px 6px',
              flexShrink: 0,
            }}
          >
            Esc
          </kbd>
        </div>

        {/* ── Inline expanded action area ───────── */}
        <AnimatePresence>
          {activeAction && (
            <motion.div
              key="inline-action"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.18 }}
              style={{
                borderBottom: '1px solid var(--color-border)',
                overflow: 'hidden',
                flexShrink: 0,
              }}
            >
              {successMsg ? (
                /* Success state */
                <div
                  style={{
                    padding: '20px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    color: 'var(--color-accent)',
                    fontSize: '14px',
                    fontWeight: 600,
                  }}
                >
                  <CheckCircle size={18} />
                  {successMsg}
                </div>
              ) : activeAction.type === 'inline_input' ? (
                /* Text input (win / note) */
                <div style={{ padding: '16px 18px' }}>
                  <div
                    style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      color: CATEGORY_TEXT['Quick Log'],
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      marginBottom: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <activeAction.icon size={12} />
                    {activeAction.label}
                  </div>
                  <input
                    ref={inlineInputRef}
                    value={inlineText}
                    onChange={(e) => setInlineText(e.target.value)}
                    onKeyDown={onInlineKeyDown}
                    placeholder={activeAction.placeholder}
                    style={{
                      width: '100%',
                      border: '1px solid var(--color-border)',
                      background: 'var(--color-elevated)',
                      borderRadius: '10px',
                      padding: '10px 14px',
                      outline: 'none',
                      fontSize: '14px',
                      color: 'var(--color-text-1)',
                      fontFamily: 'var(--font-sans)',
                      boxSizing: 'border-box',
                      transition: 'border-color 0.15s',
                    }}
                    onFocus={(e) =>
                      (e.target.style.borderColor = 'var(--color-accent)')
                    }
                    onBlur={(e) =>
                      (e.target.style.borderColor = 'var(--color-border)')
                    }
                  />
                  <div
                    style={{
                      marginTop: '8px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span style={{ fontSize: '12px', color: 'var(--color-text-3)' }}>
                      Press <strong>Enter</strong> to save · <strong>Esc</strong> to cancel
                    </span>
                    <button
                      onClick={saveInlineText}
                      disabled={!inlineText.trim() || isAiProcessing}
                      style={{
                        background: inlineText.trim() && !isAiProcessing ? 'var(--color-accent)' : 'var(--color-elevated)',
                        color: inlineText.trim() && !isAiProcessing ? '#fff' : 'var(--color-text-3)',
                        border: 'none',
                        borderRadius: '7px',
                        padding: '5px 14px',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: inlineText.trim() && !isAiProcessing ? 'pointer' : 'default',
                        fontFamily: 'var(--font-sans)',
                        transition: 'background 0.15s',
                      }}
                    >
                      {isAiProcessing ? 'Processing...' : 'Save'}
                    </button>
                  </div>
                </div>
              ) : activeAction.type === 'ai_log' ? (
                /* Text & Voice AI Input */
                <div style={{ padding: '16px 18px' }}>
                  <div
                    style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      color: CATEGORY_TEXT['Quick Log'],
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      marginBottom: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <activeAction.icon size={12} />
                    {activeAction.label}
                  </div>
                  
                  <div style={{ position: 'relative' }}>
                      <textarea
                        ref={inlineInputRef}
                        value={inlineText}
                        onChange={(e) => setInlineText(e.target.value)}
                        onKeyDown={onInlineKeyDown}
                        placeholder={isListening ? 'Listening...' : activeAction.placeholder}
                        style={{
                          width: '100%',
                          border: '1px solid var(--color-border)',
                          background: isListening ? 'rgba(99, 179, 237, 0.05)' : 'var(--color-elevated)',
                          borderRadius: '10px',
                          padding: '12px 14px',
                          outline: 'none',
                          fontSize: '15px',
                          color: 'var(--color-text-1)',
                          fontFamily: 'var(--font-sans)',
                          boxSizing: 'border-box',
                          transition: 'all 0.15s',
                          minHeight: '80px',
                          resize: 'none',
                          lineHeight: 1.5
                        }}
                        onFocus={(e) =>
                          (e.target.style.borderColor = 'var(--color-accent)')
                        }
                        onBlur={(e) =>
                          (e.target.style.borderColor = 'var(--color-border)')
                        }
                      />
                      <button
                        onClick={toggleListening}
                        style={{
                          position: 'absolute',
                          right: '12px',
                          bottom: '12px',
                          background: isListening ? 'rgba(239, 68, 68, 0.1)' : 'var(--color-elevated)',
                          color: isListening ? '#ef4444' : 'var(--color-text-3)',
                          border: '1px solid',
                          borderColor: isListening ? 'rgba(239, 68, 68, 0.2)' : 'var(--color-border)',
                          borderRadius: '8px',
                          padding: '6px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.15s'
                        }}
                        title="Toggle Voice (Space)"
                      >
                        <Mic size={16} style={{ animation: isListening ? 'pulse 2s infinite' : 'none' }} />
                      </button>
                  </div>

                  <div
                    style={{
                      marginTop: '12px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span style={{ fontSize: '12px', color: 'var(--color-text-3)' }}>
                      Press <strong>Enter</strong> to let AI process · <strong>Space</strong> for voice
                    </span>
                    <button
                      onClick={saveInlineText}
                      disabled={!inlineText.trim() || isAiProcessing || isListening}
                      style={{
                        background: inlineText.trim() && !isAiProcessing && !isListening ? 'var(--color-accent)' : 'var(--color-elevated)',
                        color: inlineText.trim() && !isAiProcessing && !isListening ? '#fff' : 'var(--color-text-3)',
                        border: 'none',
                        borderRadius: '7px',
                        padding: '6px 16px',
                        fontSize: '13px',
                        fontWeight: 600,
                        cursor: inlineText.trim() && !isAiProcessing && !isListening ? 'pointer' : 'default',
                        fontFamily: 'var(--font-sans)',
                        transition: 'background 0.15s',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      {isAiProcessing ? <><Brain size={14} style={{ animation: 'pulse 1s infinite' }} /> Processing...</> : 'Send to AI'}
                    </button>
                  </div>
                </div>
              ) : activeAction.type === 'mood' ? (
                /* Mood selector */
                <div style={{ padding: '16px 18px' }}>
                  <div
                    style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      color: CATEGORY_TEXT['Quick Log'],
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      marginBottom: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <Smile size={12} />
                    How are you feeling right now?
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      gap: '6px',
                      flexWrap: 'wrap',
                    }}
                  >
                    {MOOD_OPTIONS.map((m) => (
                      <button
                        key={m.value}
                        onClick={() => saveMood(m.value, m.label)}
                        title={`${m.value} – ${m.label}`}
                        style={{
                          background: 'var(--color-elevated)',
                          border: '1px solid var(--color-border)',
                          borderRadius: '10px',
                          padding: '8px 10px',
                          cursor: 'pointer',
                          fontSize: '20px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '2px',
                          transition: 'border-color 0.15s, transform 0.12s',
                          fontFamily: 'var(--font-sans)',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = 'var(--color-accent)';
                          e.currentTarget.style.transform = 'scale(1.12)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = 'var(--color-border)';
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                      >
                        <span>{m.emoji}</span>
                        <span
                          style={{
                            fontSize: '9px',
                            color: 'var(--color-text-3)',
                            fontWeight: 500,
                          }}
                        >
                          {m.value}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : activeAction.type === 'voice' ? (
                /* Voice Dictation area */
                <div style={{ padding: '16px 18px' }}>
                  <div
                    style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      color: CATEGORY_TEXT['Quick Log'],
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      marginBottom: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <Mic size={12} />
                    {activeAction.label}
                  </div>
                  
                  <div
                    style={{
                      width: '100%',
                      border: '1px solid var(--color-border)',
                      background: 'var(--color-elevated)',
                      borderRadius: '10px',
                      padding: '14px 14px',
                      minHeight: '80px',
                      fontSize: '15px',
                      color: 'var(--color-text-1)',
                      fontFamily: 'var(--font-sans)',
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'flex-start',
                      position: 'relative'
                    }}
                  >
                     {inlineText ? (
                       <span style={{ width: '100%', whiteSpace: 'pre-wrap' }}>{inlineText}</span>
                     ) : (
                       <span style={{ color: 'var(--color-text-3)', fontStyle: 'italic', width: '100%', textAlign: 'center', marginTop: '16px' }}>
                         {isListening ? 'Listening... Speak now' : 'Press Space to start/stop dictating'}
                       </span>
                     )}
                  </div>
                  <div
                    style={{
                      marginTop: '12px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <button
                      onClick={toggleListening}
                      style={{
                        background: isListening ? 'rgba(239, 68, 68, 0.1)' : 'var(--color-elevated)',
                        color: isListening ? '#ef4444' : 'var(--color-text-2)',
                        border: '1px solid',
                        borderColor: isListening ? 'rgba(239, 68, 68, 0.2)' : 'var(--color-border)',
                        borderRadius: '7px',
                        padding: '6px 14px',
                        fontSize: '13px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'all 0.15s'
                      }}
                    >
                      <Mic size={14} style={{ animation: isListening ? 'pulse 2s infinite' : 'none' }} />
                      {isListening ? 'Stop Dictating (Space)' : 'Start Dictating (Space)'}
                    </button>
                    
                    <button
                      onClick={saveInlineText}
                      disabled={!inlineText.trim() || isListening}
                      style={{
                        background: inlineText.trim() && !isListening ? 'var(--color-accent)' : 'var(--color-elevated)',
                        color: inlineText.trim() && !isListening ? '#fff' : 'var(--color-text-3)',
                        border: 'none',
                        borderRadius: '7px',
                        padding: '6px 16px',
                        fontSize: '13px',
                        fontWeight: 600,
                        cursor: inlineText.trim() && !isListening ? 'pointer' : 'default',
                        transition: 'background 0.15s',
                      }}
                    >
                      Save Note
                    </button>
                  </div>
                </div>
              ) : null}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Results list ─────────────────────── */}
        {!activeAction && (
          <div
            ref={listRef}
            style={{
              overflowY: 'auto',
              padding: '8px',
              flex: 1,
              minHeight: 0,
            }}
          >
            {flatList.length === 0 ? (
              <div
                style={{
                  padding: '40px',
                  textAlign: 'center',
                  color: 'var(--color-text-3)',
                  fontSize: '14px',
                }}
              >
                No commands found for "<strong>{search}</strong>"
              </div>
            ) : (
              Object.entries(grouped).map(([category, actions]) => (
                <div key={category}>
                  {/* Category header */}
                  <div
                    style={{
                      padding: '8px 12px 4px',
                      fontSize: '10px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      color: CATEGORY_TEXT[category] || 'var(--color-text-3)',
                    }}
                  >
                    {category}
                  </div>

                  {/* Actions in category */}
                  {actions.map((action) => {
                    const globalIdx = flatList.indexOf(action);
                    const isSelected = globalIdx === selectedIndex;
                    const Icon = action.icon;

                    return (
                      <div
                        key={action.id}
                        data-action-item
                        onClick={() => executeAction(action)}
                        onMouseEnter={() => setSelectedIndex(globalIdx)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '10px 12px',
                          borderRadius: '10px',
                          cursor: 'pointer',
                          gap: '12px',
                          background: isSelected
                            ? 'var(--color-elevated)'
                            : 'transparent',
                          transition: 'background 0.08s',
                          position: 'relative',
                        }}
                      >
                        {/* Icon */}
                        <div
                          style={{
                            width: '34px',
                            height: '34px',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: isSelected
                              ? CATEGORY_COLORS[action.category] || 'rgba(99,179,237,0.12)'
                              : 'var(--color-elevated)',
                            color: isSelected
                              ? CATEGORY_TEXT[action.category] || 'var(--color-accent)'
                              : 'var(--color-text-3)',
                            flexShrink: 0,
                            transition: 'background 0.1s, color 0.1s',
                          }}
                        >
                          <Icon size={16} />
                        </div>

                        {/* Label + description */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              fontSize: '14px',
                              fontWeight: 600,
                              color: isSelected
                                ? 'var(--color-text-1)'
                                : 'var(--color-text-1)',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {action.label}
                          </div>
                          <div
                            style={{
                              fontSize: '12px',
                              color: 'var(--color-text-3)',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {action.description}
                          </div>
                        </div>

                        {/* Category badge + chevron */}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            flexShrink: 0,
                          }}
                        >
                          <span
                            style={{
                              fontSize: '10px',
                              fontWeight: 600,
                              padding: '2px 7px',
                              borderRadius: '20px',
                              background:
                                CATEGORY_COLORS[action.category] ||
                                'rgba(99,179,237,0.12)',
                              color:
                                CATEGORY_TEXT[action.category] ||
                                'var(--color-accent)',
                              letterSpacing: '0.03em',
                            }}
                          >
                            {action.category}
                          </span>
                          {isSelected && (
                            <ChevronRight
                              size={14}
                              style={{ color: 'var(--color-text-3)' }}
                            />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))
            )}
          </div>
        )}

        {/* ── Bottom hint bar ──────────────────── */}
        <div
          style={{
            padding: '10px 18px',
            borderTop: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontSize: '11px',
              color: 'var(--color-text-3)',
              display: 'flex',
              gap: '12px',
              alignItems: 'center',
            }}
          >
            <span>
              <kbd style={kbdStyle}>↑</kbd>
              <kbd style={kbdStyle}>↓</kbd>{' '}
              Navigate
            </span>
            <span>
              <kbd style={kbdStyle}>↵</kbd> Select
            </span>
            <span>
              <kbd style={kbdStyle}>Esc</kbd> Close
            </span>
          </span>
          <span style={{ fontSize: '11px', color: 'var(--color-text-3)' }}>
            {flatList.length} command{flatList.length !== 1 ? 's' : ''}
          </span>
        </div>
      </motion.div>
    </div>
  );
}

/* ── Shared kbd style ─────────────────────────── */
const kbdStyle = {
  display: 'inline-block',
  background: 'var(--color-elevated)',
  border: '1px solid var(--color-border)',
  borderRadius: '4px',
  padding: '1px 5px',
  fontSize: '10px',
  fontFamily: 'var(--font-sans)',
  marginRight: '2px',
  color: 'var(--color-text-2)',
};
