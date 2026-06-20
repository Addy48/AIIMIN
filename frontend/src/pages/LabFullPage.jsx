import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useThemeContext } from '../context/ThemeContext';
import { supabase } from '../utils/supabase';
import VocalMastery from '../components/lab/VocalMastery';
import TypingTest from '../components/lab/TypingTest';
import DecisionMatrix from '../components/lab/DecisionMatrix';
import DopamineProtocol from '../components/lab/DopamineProtocol';
import ATSAnalyzer from './ATSAnalyzer';
import AptitudeTest from '../components/lab/AptitudeTest';
import QuantitativeMaths from '../components/lab/QuantitativeMaths';
import TechSimulator from '../components/lab/TechSimulator';
import STARMethod from '../components/lab/STARMethod';
import DomainFlashcards from '../components/lab/DomainFlashcards';
import SystemDesign from '../components/lab/SystemDesign';
import AddictionTracker from '../components/lab/AddictionTracker';
import PersonalitySwipe from '../components/lab/PersonalitySwipe';
import { calculateLifeScore } from '../utils/lifeScoreEngine';
import './lab/lab.css';

import GrowthLoop from '../components/lab/GrowthLoop';

/* ─────────────────────────────────────────────────────────────
   LabFullPage — reads directly from Supabase, no backend needed
───────────────────────────────────────────────────────────── */

// TypingTestSupabase removed and replaced by premium component from ../components/lab/TypingTest

// MindsetLoggerSupabase and others removed as they are redundant with Quick Pulse on Overview

/* ── Main Lab Page ──────────────────────────────────────────── */
export default function LabFullPage() {
  const { user } = useAuth();
  const { theme } = useThemeContext();
  const isDark = theme === 'dark';
  const location = useLocation();
  const [activeModule, setActiveModule] = useState(null);
  const [typingStats, setTypingStats] = useState(null);
  const [todayMindset, setTodayMindset] = useState(null);
  const [lifeScore, setLifeScore] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check URL parameters for active module
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const mod = params.get('module');
    if (mod) {
      setActiveModule(mod);
    }
  }, [location.search]);

  // Hook into popstate to update activeModule on browser back/forward
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const mod = params.get('module');
      setActiveModule(mod || null);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const cardBg = 'var(--color-surface)';
  const border = 'var(--color-border)';
  const text1 = 'var(--color-text-1)';
  const text2 = 'var(--color-text-2)';
  const text3 = 'var(--color-text-3)';

  const fetchStats = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().split("T")[0];
      const [typingRes, mindsetRes, ls] = await Promise.all([
        supabase.from("lab_typing_tests").select("wpm,accuracy_pct,day_of,test_invalid")
          .eq("user_id", user.id).gte("day_of", weekAgo).order("wpm", { ascending: false }),
        supabase.from("lab_mindset_logs").select("state,logged_at,day_of")
          .eq("user_id", user.id).eq("day_of", new Date().toISOString().split("T")[0])
          .order("logged_at", { ascending: false }).limit(1),
        calculateLifeScore(user)
      ]);
      const validTests = (typingRes.data || []).filter(t => !t.test_invalid);
      const bestWpm = validTests.length > 0 ? Math.max(...validTests.map(t => t.wpm)) : null;
      const avgAccuracy = validTests.length > 0
        ? Number((validTests.reduce((s, t) => s + Number(t.accuracy_pct), 0) / validTests.length).toFixed(1))
        : null;
      setTypingStats({ bestWpm, avgAccuracy, testsThisWeek: validTests.length, totalTests: typingRes.data?.length || 0 });
      setTodayMindset((mindsetRes.data || [])[0] || null);
      setLifeScore(ls);
    } catch (e) { /* silent */ }
    finally { setLoading(false); }
  }, [user]); // eslint-disable-line

  useEffect(() => { fetchStats(); }, [fetchStats]);

  if (!user) return null;

  const categorizedModules = {
    "Mental Models & Focus": [
      { key: "decision", emoji: "🤔", label: "Decision Matrix", desc: "De-bias choices via mental models", color: "#3B82F6" },
      { key: "dopamine", emoji: "📉", label: "Dopamine Detox", desc: "Stimulus tracking & baseline recovery", color: "#10B981" },
      { key: "addiction", emoji: "🔒", label: "Addiction Tracker", desc: "Private craving & trigger logging", color: "#EF4444" },
      { key: "personality", emoji: "🧬", label: "Personality AI", desc: "Behavioral swiping insights", color: "#F43F5E" }
    ],
    "Cognitive Training": [
      { key: "typing",     emoji: "⌨️",  label: "Typing Speed",   desc: "WPM & accuracy benchmark",       color: "#3B82F6" },
      { key: "aptitude", emoji: "🧠", label: "Aptitude Tests", desc: "Logical reasoning & pattern recognition", color: "#F59E0B" },
      { key: "quant", emoji: "📐", label: "Quantitative Maths", desc: "Speed math for screening rounds", color: "#F97316" }
    ],
    "Interview Prep": [
      { key: "speaking",   emoji: "🎙️", label: "Vocal Mastery", desc: "60-sec vocal response & review", color: "#8B5CF6" },
      { key: "star", emoji: "⭐", label: "STAR Method", desc: "Behavioral interview storytelling", color: "#EAB308" },
      { key: "resume", emoji: "📄", label: "Resume ATS Matcher", desc: "Match your resume against Job Descriptions", color: "#6366F1" }
    ],
    "Skill Forge": [
      { key: "techsim", emoji: "💻", label: "Tech Simulator", desc: "Code output prediction & tricky MCQs", color: "#06B6D4" },
      { key: "flashcards", emoji: "🗂️", label: "Domain Flashcards", desc: "Spaced repetition for tech stacks", color: "#14B8A6" },
      { key: "sysdesign", emoji: "🏗️", label: "System Design", desc: "Architecture whiteboard sandbox", color: "#8B5CF6" }
    ]
  };

  const modules = Object.values(categorizedModules).flat();

  return (
    <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start', minHeight: 'calc(100vh - 120px)' }}>
      {/* Sidebar Navigation */}
      {!activeModule && (
        <div style={{ 
          width: '260px', 
          flexShrink: 0, 
          position: 'sticky', 
          top: '20px', 
          maxHeight: 'calc(100vh - 40px)', 
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          paddingBottom: '80px',
          borderRight: `1px solid ${border}`,
          paddingRight: '20px'
        }}>
          <div>
            <div style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: text3, marginBottom: "8px" }}>
              Personal Development
            </div>
            <h1 style={{ font: "var(--text-hero)", color: text1, margin: 0, letterSpacing: "-0.02em", fontSize: '32px' }}>
              The Lab.
            </h1>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <SidebarButton 
              active={!activeModule} 
              onClick={() => {
                setActiveModule(null);
                const newUrl = new URL(window.location);
                newUrl.searchParams.delete('module');
                window.history.pushState({}, '', newUrl);
              }} 
              emoji="📊" 
              label="Overview" 
              color="#3B82F6"
            />
          </div>

          {Object.entries(categorizedModules).map(([category, mods]) => (
            <div key={category}>
              <div style={{ marginBottom: "8px", fontSize: "10px", fontWeight: 600, color: text3, textTransform: "uppercase", letterSpacing: "0.06em", display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '6px', height: '6px', background: 'var(--color-accent)', borderRadius: '50%' }} /> {category}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {mods.map(m => (
                  <SidebarButton 
                    key={m.key} 
                    active={activeModule === m.key} 
                    onClick={() => {
                      setActiveModule(m.key);
                      const newUrl = new URL(window.location);
                      newUrl.searchParams.set('module', m.key);
                      window.history.pushState({}, '', newUrl);
                    }} 
                    emoji={m.emoji} 
                    label={m.label} 
                    color={m.color}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Main Content Area */}
      <div style={{ 
        flex: 1, 
        minWidth: 0, 
        ...(activeModule ? { minHeight: 'calc(100vh - 120px)' } : { height: 'calc(100vh - 120px)', overflowY: 'auto' }),
        paddingRight: activeModule ? '0' : '20px', 
        paddingBottom: '60px' 
      }}>
        {activeModule ? (
          <div style={{ animation: 'fadeIn 0.2s ease-out' }}>
              {/* Unified Back to Lab Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', paddingBottom: '24px', borderBottom: `1px solid ${border}` }}>
                <button 
                  onClick={() => {
                    setActiveModule(null);
                    const newUrl = new URL(window.location);
                    newUrl.searchParams.delete('module');
                    window.history.pushState({}, '', newUrl);
                  }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '10px 20px', borderRadius: '99px',
                    background: 'var(--color-surface)', border: `1px solid ${border}`,
                    color: text1, fontSize: '14px', fontWeight: 600, cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-elevated)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'var(--color-surface)'; }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                  Back to Lab
                </button>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {(() => {
                    const modData = modules.find(m => m.key === activeModule);
                    return modData ? (
                      <>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: modData.color, boxShadow: `0 0 10px ${modData.color}` }} />
                        <span style={{ fontSize: '16px', fontWeight: 700, color: text1, letterSpacing: '-0.01em' }}>{modData.label}</span>
                      </>
                    ) : null;
                  })()}
                </div>
              </div>
              
              {activeModule === 'typing'      && <TypingTest userId={user.id} onComplete={() => fetchStats()} onClose={() => setActiveModule(null)} />}
              {activeModule === 'speaking'    && <VocalMastery onComplete={() => fetchStats()} onClose={() => setActiveModule(null)} />}
              {activeModule === 'decision'    && <DecisionMatrix onBack={() => setActiveModule(null)} />}
              {activeModule === 'dopamine'    && <DopamineProtocol onBack={() => setActiveModule(null)} />}
              {activeModule === 'reading'     && <ReadingLog userId={user.id} isDark={isDark} onClose={() => { fetchStats(); setActiveModule(null); }} />}
              {activeModule === 'resume'      && <ATSAnalyzer onClose={() => setActiveModule(null)} />}
              {activeModule === 'aptitude'    && <AptitudeTest onClose={() => setActiveModule(null)} />}
              {activeModule === 'quant'       && <QuantitativeMaths onClose={() => setActiveModule(null)} />}
              {activeModule === 'techsim'     && <TechSimulator onClose={() => setActiveModule(null)} />}
              {activeModule === 'star'        && <STARMethod onClose={() => setActiveModule(null)} />}
              {activeModule === 'flashcards'  && <DomainFlashcards onClose={() => setActiveModule(null)} />}
              {activeModule === 'sysdesign'   && <SystemDesign onClose={() => setActiveModule(null)} />}
              {activeModule === 'addiction'   && <AddictionTracker onClose={() => setActiveModule(null)} />}
              {activeModule === 'personality' && <PersonalitySwipe onClose={() => setActiveModule(null)} />}
          </div>
        ) : (
          <div style={{ animation: 'fadeIn 0.2s ease-out' }}>
            <GrowthLoop />

            <h2 style={{ fontSize: '24px', fontWeight: 800, color: text1, margin: '0 0 24px 0', letterSpacing: '-0.02em' }}>
              Overview & Analytics
            </h2>

            {!loading && typingStats && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px", marginBottom: "32px" }}>
                {[
                  { label: "Best WPM (7d)", value: typingStats.bestWpm ?? "—", color: "#3B82F6" },
                  { label: "Avg Accuracy",  value: typingStats.avgAccuracy ? `${typingStats.avgAccuracy}%` : "—", color: "#22C55E" },
                  { label: "Tests This Week", value: typingStats.testsThisWeek, color: "#F59E0B" },
                  { label: "Life Score", value: lifeScore?.score ?? "—", color: "#8B5CF6", desc: lifeScore?.delta >= 0 ? `+${lifeScore?.delta}` : lifeScore?.delta },
                ].map(stat => (
                  <div key={stat.label} style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: "12px", padding: "20px", borderTop: `4px solid ${stat.color}`, boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                    <div style={{ fontSize: "11px", fontWeight: 600, color: text3, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>{stat.label}</div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                      <div style={{ fontSize: "28px", fontWeight: 800, color: text1, letterSpacing: "-0.02em", lineHeight: 1, textTransform: "capitalize" }}>{stat.value}</div>
                      {stat.desc && <div style={{ fontSize: "12px", fontWeight: 600, color: stat.desc.toString().startsWith('+') ? '#22C55E' : '#EF4444' }}>{stat.desc}</div>}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && typingStats && typingStats.totalTests > 0 && (
              <div>
                <div style={{ fontSize: "12px", fontWeight: 600, color: text3, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "16px" }}>Recent Typing Tests</div>
                <TypingHistory userId={user.id} isDark={isDark} cardBg={cardBg} border={border} text1={text1} text2={text2} text3={text3} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function SidebarButton({ active, onClick, emoji, label, color }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        padding: '10px 14px', borderRadius: '8px', border: 'none',
        background: active ? `color-mix(in srgb, ${color} 15%, transparent)` : 'transparent',
        color: active ? color : 'var(--color-text-2)',
        cursor: 'pointer', textAlign: 'left',
        transition: 'all 0.15s',
        fontWeight: active ? 700 : 500,
        fontSize: '14px'
      }}
      onMouseEnter={e => {
        if (!active) e.currentTarget.style.background = 'var(--color-elevated)';
      }}
      onMouseLeave={e => {
        if (!active) e.currentTarget.style.background = 'transparent';
      }}
    >
      <span style={{ fontSize: '16px', filter: active ? 'none' : 'grayscale(0.5)', opacity: active ? 1 : 0.7 }}>{emoji}</span>
      <span>{label}</span>
    </button>
  );
}

function TypingHistory({ userId, cardBg, border, text1, text2, text3 }) {
  const [rows, setRows] = useState([]);
  useEffect(() => {
    const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().split("T")[0];
    supabase.from("lab_typing_tests").select("id,wpm,accuracy_pct,day_of,test_invalid")
      .eq("user_id", userId).gte("day_of", weekAgo).order("day_of", { ascending: false }).limit(10)
      .then(({ data }) => setRows(data || []));
  }, [userId]);
  if (!rows.length) return null;
  return (
    <div style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: "12px", overflow: "hidden" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 80px 80px 80px", padding: "10px 16px", borderBottom: `1px solid ${border}` }}>
        {["Date","WPM","Accuracy","Status"].map(h => <div key={h} style={{ fontSize: "10px", fontWeight: 600, color: text3, textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</div>)}
      </div>
      {rows.map(r => (
        <div key={r.id} style={{ display: "grid", gridTemplateColumns: "1fr 80px 80px 80px", padding: "10px 16px", borderBottom: `1px solid ${border}` }}>
          <div style={{ fontSize: "12px", color: text2 }}>{new Date(r.day_of).toLocaleDateString("en-IN",{month:"short",day:"numeric"})}</div>
          <div style={{ fontSize: "13px", fontWeight: 600, color: text1 }}>{r.wpm}</div>
          <div style={{ fontSize: "13px", fontWeight: 600, color: Number(r.accuracy_pct)>=95?"#22C55E":"#f59e0b" }}>{Number(r.accuracy_pct).toFixed(1)}%</div>
          <div style={{ fontSize: "11px", color: r.test_invalid?"#ef4444":"#22C55E", fontWeight: 500 }}>{r.test_invalid?"Invalid":"Valid"}</div>
        </div>
      ))}
    </div>
  );
}

// DailyReflection, MoodEnergyTracker, HabitStreaks removed as they are redundant

function ReadingLog({ userId, isDark, onClose }) {
  const [form, setForm] = useState({ title: "", author: "", type: "book", pages: "", rating: 4, notes: "" });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [recent, setRecent] = useState([]);
  const border = 'var(--color-border)';
  const text1 = 'var(--color-text-1)';
  const text3 = 'var(--color-text-3)';
  const inp = { width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--color-border)', background: 'rgba(255,255,255,0.04)', color: 'var(--color-text-1)', fontSize: '13px', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.15s', fontFamily: 'inherit' };
  useEffect(() => {
    supabase.from("lab_reading_log").select("title,author,rating,logged_at").eq("user_id", userId)
      .order("logged_at", { ascending: false }).limit(5).then(({ data }) => setRecent(data || []));
  }, [userId]);
  const handleSave = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      await supabase.from("lab_reading_log").insert({ user_id: userId, ...form, pages: Number(form.pages)||0, logged_at: new Date().toISOString() });
      setSaved(true); setTimeout(onClose, 1200);
    } catch { setSaving(false); }
  };
  return (
    <div style={{ padding: "32px", position: "relative" }}>

      <div style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: text3, marginBottom: "8px" }}>Reading Log</div>
      <h2 style={{ fontSize: "24px", fontWeight: 700, color: text1, margin: "0 0 24px" }}>Log what you read</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <input placeholder="Title *" value={form.title} onChange={e => setForm(f=>({...f,title:e.target.value}))} style={inp} />
        <input placeholder="Author" value={form.author} onChange={e => setForm(f=>({...f,author:e.target.value}))} style={inp} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          <select value={form.type} onChange={e => setForm(f=>({...f,type:e.target.value}))} style={inp}>
            <option value="book">📚 Book</option>
            <option value="article">📰 Article</option>
            <option value="paper">📄 Paper</option>
          </select>
          <input type="number" placeholder="Pages / mins" value={form.pages} onChange={e => setForm(f=>({...f,pages:e.target.value}))} style={inp} />
        </div>
        <div>
          <div style={{ fontSize: "12px", color: text3, marginBottom: "8px" }}>Rating: {"⭐".repeat(form.rating)}</div>
          <input type="range" min={1} max={5} value={form.rating} onChange={e => setForm(f=>({...f,rating:Number(e.target.value)}))} style={{ width: "100%", accentColor: "#F59E0B" }} />
        </div>
        <textarea placeholder="Key takeaways..." value={form.notes} onChange={e => setForm(f=>({...f,notes:e.target.value}))} rows={3} style={{ ...inp, resize: "vertical" }} />
      </div>
      <button onClick={handleSave} disabled={saving||saved||!form.title.trim()}
        style={{ marginTop: "16px", width: "100%", padding: "14px", background: saved?"#22C55E":"var(--color-accent)", color: "#fff", border: "none", borderRadius: "10px", fontSize: "14px", fontWeight: 700, cursor: "pointer" }}>
        {saved ? "✓ Logged!" : saving ? "Saving..." : "Log Reading"}
      </button>
      {recent.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <div style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: text3, marginBottom: "10px" }}>Recent</div>
          {recent.map((r,i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${border}` }}>
              <span style={{ fontSize: "13px", color: text1, fontWeight: 600 }}>{r.title}</span>
              <span style={{ fontSize: "12px", color: text3 }}>{"⭐".repeat(r.rating)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
