import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Flame, History, Download, PenLine, Feather, Brain, Sun, Coffee, BarChart2, X,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useUserProfile } from '../hooks/useUserProfile';
import useThemeColors from '../hooks/useThemeColors';
import { apiPost, apiGet } from '../utils/api';
import { supabase } from '../utils/supabase';
import { trackEvent } from '../hooks/usePageAnalytics';
import toast from '../utils/toast';
import useMediaQuery from '../hooks/useMediaQuery';
import FeatureTip from '../components/ui/FeatureTip';
import FeatureGate from '../components/account/FeatureGate';
import JournalSidebar from '../components/journal/JournalSidebar';
import FreeWriteMode from '../components/journal/FreeWriteMode';
import CBTRecordMode from '../components/journal/CBTRecordMode';
import WhatWentWellMode from '../components/journal/WhatWentWellMode';
import MorningPagesMode from '../components/journal/MorningPagesMode';
import WeeklyReviewMode from '../components/journal/WeeklyReviewMode';
import JournalCapture from '../components/journal/JournalCapture';
import JournalReadView from '../components/journal/JournalReadView';
import {
  JOURNAL_MODES,
  MODE_BY_PARAM,
  serializeEntry,
  parseEntry,
  calcJournalStreak,
  exportEntriesPlainText,
  emotionTagToMood,
  findEntryForDate,
  getPlainTextFromPayload,
  syncJournalToDailyLog,
} from '../components/journal/journalUtils';
import { useSwipeTabs } from '../hooks/useSwipeTabs';
import '../styles/journalStudio.css';

const MODE_META = {
  write: { icon: <PenLine size={14} />, label: 'Today', param: 'write' },
  free_write: { icon: <Feather size={14} />, label: 'Free Write', param: 'free' },
  cbt: { icon: <Brain size={14} />, label: 'CBT Record', param: 'cbt' },
  www: { icon: <Sun size={14} />, label: 'What Went Well', param: 'www' },
  morning: { icon: <Coffee size={14} />, label: 'Morning Pages', param: 'morning' },
  weekly: { icon: <BarChart2 size={14} />, label: 'Weekly Review', param: 'weekly' },
};

function mapMoodToEntryColumn(mood) {
  return Math.max(1, Math.min(5, Math.round(Number(mood || 6) / 2)));
}

export default function JournalPage() {
  const { user } = useAuth();
  const { profile } = useUserProfile();
  const c = useThemeColors();
  const isMobile = useMediaQuery('(max-width: 767px)');
  const [searchParams, setSearchParams] = useSearchParams();
  const modeParam = searchParams.get('mode') || 'write';
  const activeMode = MODE_BY_PARAM[modeParam] || 'write';

  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modeFilter, setModeFilter] = useState('all');
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [streak, setStreak] = useState(0);
  const [analysisMap, setAnalysisMap] = useState({});
  const [draftSuggestions, setDraftSuggestions] = useState([]);
  const [showStructuredModes, setShowStructuredModes] = useState(false);

  const setMode = (param) => {
    setSearchParams({ mode: param });
    setSelectedEntry(null);
  };

  const fetchEntries = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(100);
      if (error) throw error;
      const rows = data || [];
      setEntries(rows);
      setStreak(calcJournalStreak(rows));
      const cached = {};
      rows.forEach((entry) => {
        try {
          const raw = localStorage.getItem(`aiimin_journal_ai_${entry.id}`);
          if (raw) cached[entry.id] = JSON.parse(raw);
        } catch {
          // ignore corrupt cache
        }
      });
      setAnalysisMap(cached);
    } catch (err) {
      console.error('[Journal] fetch failed:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  useEffect(() => {
    if (!user?.id) return undefined;
    const today = new Date().toISOString().split('T')[0];
    apiGet(`/daily-logs/${user.id}/${today}`)
      .then((log) => {
        const drafts = [];
        if (log && log.gym_done === false) {
          drafts.push({ id: 'gym-skip', text: 'Skipped gym today — note why or how I feel about it.' });
        }
        if (log && Number(log.mood) <= 2) {
          drafts.push({ id: 'low-mood', text: 'Rough day — mood dipped. What triggered it?' });
        }
        if (log && log.learning_done && log.learning_topic) {
          drafts.push({ id: 'learn', text: `Learned: ${log.learning_topic}. Key takeaway?` });
        }
        setDraftSuggestions(drafts.slice(0, 2));
      })
      .catch(() => setDraftSuggestions([]));
    return undefined;
  }, [user?.id, entries.length]);

  const classifyAndTagEntry = async (entryId, body, mood) => {
    if (!body?.trim() || body === '[mood check-in]') return;
    try {
      const analysis = await apiPost('/daily-logs/journal/ai-analyze', {
        text: body,
        mood: mapMoodToEntryColumn(mood),
        energy: 3,
      });
      if (analysis?.sentiment) {
        const tag = analysis.sentiment === 'warning' ? 'cbt' : analysis.sentiment === 'reflective' ? 'morning' : 'write';
        localStorage.setItem(`aiimin_journal_mode_${entryId}`, tag);
      }
    } catch {
      // auto-tag is best-effort
    }
  };

  const syncWinsToGoals = async (wins = []) => {
    if (!user?.id) return;
    const today = new Date().toISOString().split('T')[0];
    const valid = wins.filter((win) => win?.text?.trim());
    await Promise.all(valid.map((win) => supabase.from('wins').insert({
      user_id: user.id,
      date: today,
      title: win.text.trim(),
      description: win.why?.trim() || null,
    })));
  };

  const persistEntryAnalysis = async (entryId, mode, payload, analysis) => {
    const normalized = {
      emotionalTone: analysis.emotion_tag,
      cognitiveDistortion: analysis.cognitive_distortion,
      theme: analysis.theme,
    };
    const enriched = serializeEntry(mode, { ...payload, ai: normalized });
    await supabase
      .from('journal_entries')
      .update({ encrypted_content: enriched })
      .eq('id', entryId)
      .eq('user_id', user.id);
    localStorage.setItem(`aiimin_journal_ai_${entryId}`, JSON.stringify(normalized));
    setAnalysisMap((m) => ({ ...m, [entryId]: normalized }));
    setEntries((prev) => prev.map((e) => (e.id === entryId ? { ...e, encrypted_content: enriched } : e)));
    syncJournalToDailyLog({
      userId: user?.id,
      date: new Date().toISOString().split('T')[0],
      mood: emotionTagToMood(analysis.emotion_tag),
    }).catch(() => {});
  };

  const saveEntry = async (mode, payload, moodValue = payload?.mood || 6) => {
    if (!user?.id) return;
    const today = new Date().toISOString().split('T')[0];
    const mood = Number(moodValue) || 6;
    const bodyText = getPlainTextFromPayload(mode, payload);
    if (!bodyText && mode !== 'write') return;
    const payloadWithMeta = {
      ...payload,
      meta: { ...(payload.meta || {}), mood, captured_via: payload.body === '[mood check-in]' ? 'mood_only' : 'capture' },
    };
    const encrypted_content = serializeEntry(mode, payloadWithMeta);
    const existing = findEntryForDate(entries, today, mode);
    const row = {
      user_id: user.id,
      date: today,
      encrypted_content,
      mood: mapMoodToEntryColumn(mood),
      energy_level: 3,
      sleep_hours: 7,
    };

    let saved;
    if (existing?.id) {
      const { data, error } = await supabase
        .from('journal_entries')
        .update(row)
        .eq('id', existing.id)
        .eq('user_id', user.id)
        .select()
        .single();
      if (error) throw error;
      saved = data;
    } else {
      const { data, error } = await supabase
        .from('journal_entries')
        .insert(row)
        .select()
        .single();
      if (error) throw error;
      saved = data;
    }

    setEntries((prev) => {
      if (existing) {
        return prev.map((entry) => (entry.id === saved.id ? saved : entry));
      }
      return [saved, ...prev];
    });
    setSelectedEntry(null);
    const nextEntries = existing
      ? entries.map((entry) => (entry.id === saved.id ? saved : entry))
      : [saved, ...entries];
    setStreak(calcJournalStreak(nextEntries));
    trackEvent('journal_saved', { mode });
    toast.success(payload.body === '[mood check-in]' ? 'Mood logged' : 'Captured');
    if (mode === 'www' && payload.wins) syncWinsToGoals(payload.wins).catch(() => {});
    syncJournalToDailyLog({
      userId: user.id,
      date: today,
      journalEntry: getPlainTextFromPayload(mode, payload),
      mood,
    }).catch(() => {});
    apiPost('/daily-logs/journal/ai-analyze', {
      text: bodyText || payload.body,
      mood: mapMoodToEntryColumn(mood),
      energy: 3,
    })
      .then((analysis) => {
        if (analysis?.emotion_tag) {
          persistEntryAnalysis(saved.id, mode, payloadWithMeta, analysis).catch(() => {});
        } else if (analysis?.sentiment) {
          classifyAndTagEntry(saved.id, bodyText || payload.body, mood);
        }
      })
      .catch(() => {});
  };

  const saveQuickMood = (payload) => saveEntry('write', { body: payload.body, meta: { mood: payload.mood } }, payload.mood);

  const saveCapture = (payload) => saveEntry('write', { body: payload.body, meta: { mood: payload.mood } }, payload.mood);

  const handleExport = () => {
    const blob = new Blob([exportEntriesPlainText(entries)], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `aiimin-journal-${new Date().toISOString().split('T')[0]}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const today = new Date().toISOString().split('T')[0];
  const todayModeEntry = useMemo(() => findEntryForDate(entries, today, activeMode), [entries, today, activeMode]);
  const todayMorning = useMemo(() => findEntryForDate(entries, today, 'morning'), [entries, today]);
  const todayWrite = useMemo(() => findEntryForDate(entries, today, 'write'), [entries, today]);
  const modeIndex = JOURNAL_MODES.findIndex((m) => m.id === activeMode);
  const { onTouchStart, onTouchEnd } = useSwipeTabs(
    JOURNAL_MODES,
    modeIndex >= 0 ? modeIndex : 0,
    (index) => setMode(JOURNAL_MODES[index]?.param || 'write'),
    { enabled: isMobile },
  );

  const sidebar = (
    <JournalSidebar
      entries={entries}
      loading={loading}
      search={search}
      onSearch={setSearch}
      modeFilter={modeFilter}
      onModeFilter={setModeFilter}
      selectedId={selectedEntry?.id}
      onSelect={(entry) => {
        setSelectedEntry(entry);
        if (isMobile) setSidebarOpen(false);
      }}
      onExport={handleExport}
      analysisMap={analysisMap}
    />
  );

  return (
    <div
      className="journal-studio"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - var(--nav-height) - 40px)',
        margin: '-20px -24px',
        background: c.base,
        minHeight: 0,
      }}
    >
      <div className="journal-studio__header">
        <div className="journal-studio__title-row">
          <div className="journal-studio__title-block">
            <h1 className="text-h2" style={{ color: c.text1 }}>Journal.</h1>
            <p className="journal-studio__date">
              {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
          </div>
          <div className="journal-studio__header-actions">
            {streak > 0 && (
              <span className="journal-studio__chip journal-studio__chip--accent">
                <Flame size={14} /> {streak}d
              </span>
            )}
            {isMobile && (
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open history"
                className="journal-studio__chip"
              >
                <History size={14} /> History
              </button>
            )}
            <button
              type="button"
              onClick={handleExport}
              aria-label="Export journal"
              className="journal-studio__chip"
            >
              <Download size={14} /> Export
            </button>
          </div>
        </div>

        <FeatureTip
          tipId="journal_tip"
          message="Capture in one tap — type, hold mic, or mood only. Templates are optional."
          seenTips={profile?.seen_tips || []}
        />

        {showStructuredModes ? (
          <div className="journal-studio__templates">
            {JOURNAL_MODES.filter((m) => m.id !== 'write').map((m) => {
              const meta = MODE_META[m.id] || {};
              const isActive = activeMode === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMode(m.param)}
                  className={`journal-studio__template-pill ${isActive ? 'journal-studio__template-pill--active' : ''}`}
                >
                  <span style={{ opacity: isActive ? 1 : 0.7 }}>{meta.icon}</span>
                  {meta.label || m.label}
                </button>
              );
            })}
            <button
              type="button"
              className="journal-studio__template-pill"
              onClick={() => {
                setShowStructuredModes(false);
                setMode('write');
              }}
            >
              Back to capture
            </button>
          </div>
        ) : (
          <div className="journal-studio__templates journal-studio__templates--minimal">
            <button
              type="button"
              className="journal-studio__template-pill journal-studio__template-pill--ghost"
              onClick={() => setShowStructuredModes(true)}
            >
              Structured modes (CBT, morning pages…)
            </button>
          </div>
        )}
      </div>

      <div className={`journal-studio__layout${isMobile ? ' is-mobile' : ''}`}>
        {!isMobile && sidebar}

        <main
          className="journal-studio__main custom-scrollbar"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedEntry?.id || activeMode}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.18 }}
              style={{ minHeight: '100%' }}
            >
              {selectedEntry ? (
                <JournalReadView entry={selectedEntry} onNewEntry={() => setSelectedEntry(null)} />
              ) : (
                <>
                  {activeMode === 'write' && (
                    <JournalCapture
                      key={`capture-${todayWrite?.id || 'new'}`}
                      initialBody={parseEntry(todayWrite?.encrypted_content).body === '[mood check-in]' ? '' : (parseEntry(todayWrite?.encrypted_content).body || '')}
                      initialMood={parseEntry(todayWrite?.encrypted_content).meta?.mood || 6}
                      todaySaved={Boolean(todayWrite)}
                      draftSuggestions={draftSuggestions}
                      onSave={saveCapture}
                      onQuickMoodSave={saveQuickMood}
                    />
                  )}
                  {activeMode === 'free_write' && <FreeWriteMode onSave={(p) => saveEntry('free_write', p)} />}
                  {activeMode === 'cbt' && (
                    <FeatureGate feature="journal_ai" requiredTier="core" label="CBT Record with AI analysis">
                      <CBTRecordMode onSave={(p) => saveEntry('cbt', p, p?.mood)} />
                    </FeatureGate>
                  )}
                  {activeMode === 'www' && <WhatWentWellMode onSave={(p) => saveEntry('www', p, p?.mood)} />}
                  {activeMode === 'morning' && (
                    <MorningPagesMode
                      todayEntry={todayMorning ? parseEntry(todayMorning.encrypted_content) : null}
                      onSave={(p) => saveEntry('morning', { body: p.body, meta: p.meta || {} }, p.mood)}
                      initialBody={parseEntry(todayModeEntry?.encrypted_content).body || ''}
                    />
                  )}
                  {activeMode === 'weekly' && (
                    <WeeklyReviewMode
                      onSave={(p) => saveEntry('weekly', p, p?.mood)}
                      initialBody={parseEntry(todayModeEntry?.encrypted_content).body || ''}
                      initialMood={parseEntry(todayModeEntry?.encrypted_content).meta?.mood || 6}
                      initialStats={parseEntry(todayModeEntry?.encrypted_content).stats || null}
                    />
                  )}
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <AnimatePresence>
        {isMobile && sidebarOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close history"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.45)',
                border: 'none',
                zIndex: 40,
              }}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 380, damping: 34 }}
              style={{
                position: 'fixed',
                top: 'var(--nav-height)',
                left: 0,
                bottom: 0,
                width: 'min(320px, 88vw)',
                zIndex: 41,
                boxShadow: 'var(--shadow-lg)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'flex-end', padding: 10, background: c.surface2, borderBottom: `1px solid ${c.border}` }}>
                <button
                  type="button"
                  onClick={() => setSidebarOpen(false)}
                  aria-label="Close sidebar"
                  style={{ background: 'none', border: 'none', color: c.text3, cursor: 'pointer', padding: 6 }}
                >
                  <X size={18} />
                </button>
              </div>
              {sidebar}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
