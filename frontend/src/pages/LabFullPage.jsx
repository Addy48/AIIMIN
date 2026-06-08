import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useThemeContext } from '../context/ThemeContext';
import { supabase } from '../utils/supabase';
import SpeakingLogger from '../components/lab/SpeakingLogger';
import TypingTest from '../components/lab/TypingTest';
import PersonalityForge from '../components/lab/PersonalityForge';
import ThePit from '../components/lab/ThePit';
import './lab/lab.css';

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
  const [activeModule, setActiveModule] = useState(null);
  const [typingStats, setTypingStats] = useState(null);
  const [todayMindset, setTodayMindset] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (activeModule) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [activeModule]);

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
      const [typingRes, mindsetRes] = await Promise.all([
        supabase.from("lab_typing_tests").select("wpm,accuracy_pct,day_of,test_invalid")
          .eq("user_id", user.id).gte("day_of", weekAgo).order("wpm", { ascending: false }),
        supabase.from("lab_mindset_logs").select("state,logged_at,day_of")
          .eq("user_id", user.id).eq("day_of", new Date().toISOString().split("T")[0])
          .order("logged_at", { ascending: false }).limit(1),
      ]);
      const validTests = (typingRes.data || []).filter(t => !t.test_invalid);
      const bestWpm = validTests.length > 0 ? Math.max(...validTests.map(t => t.wpm)) : null;
      const avgAccuracy = validTests.length > 0
        ? Number((validTests.reduce((s, t) => s + Number(t.accuracy_pct), 0) / validTests.length).toFixed(1))
        : null;
      setTypingStats({ bestWpm, avgAccuracy, testsThisWeek: validTests.length, totalTests: typingRes.data?.length || 0 });
      setTodayMindset((mindsetRes.data || [])[0] || null);
    } catch (e) { /* silent */ }
    finally { setLoading(false); }
  }, [user]); // eslint-disable-line

  useEffect(() => { fetchStats(); }, [fetchStats]);

  if (!user) return null;

  const modules = [
    { key: "typing",     emoji: "⌨️",  label: "Typing Speed",   desc: "WPM & accuracy benchmark",       color: "#3B82F6" },
    { key: "speaking",   emoji: "🎙️", label: "Speaking Logger", desc: "60-sec vocal response & review", color: "#8B5CF6" },
    { key: "personality",emoji: "🧬",  label: "Personality Forge",desc: "Core trait & value alignment",  color: "#EC4899" },
    { key: "pit",       emoji: "⛓️",  label: "The Pit",        desc: "Hard-mode & resilience logs",   color: "#EF4444" },
    { key: "reading",    emoji: "📖",  label: "Reading Log",    desc: "Log books, articles & ratings",  color: "#10B981" },
    { key: "aptitude", emoji: "🧠", label: "Aptitude Tests", desc: "Logical reasoning & pattern recognition", color: "#F59E0B" },
    { key: "quant", emoji: "📐", label: "Quantitative Maths", desc: "Speed math for screening rounds", color: "#F97316" },
    { key: "techsim", emoji: "💻", label: "Tech Simulator", desc: "Code output prediction & tricky MCQs", color: "#06B6D4" },
    { key: "star", emoji: "⭐", label: "STAR Method", desc: "Behavioral interview storytelling", color: "#EAB308" },
    { key: "resume", emoji: "📄", label: "Resume ATS Matcher", desc: "Match your resume against Job Descriptions", color: "#6366F1" },
    { key: "flashcards", emoji: "🗂️", label: "Domain Flashcards", desc: "Spaced repetition for tech stacks", color: "#14B8A6" },
    { key: "sysdesign", emoji: "🏗️", label: "System Design", desc: "Architecture whiteboard sandbox", color: "#8B5CF6" },
  ];

  return (
    <div style={{ flex: 1 }}>
      <div style={{ marginBottom: "36px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <div style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: text3, marginBottom: "8px" }}>
            Lab · Personal Development
          </div>
          <h1 style={{ font: "var(--text-hero)", color: text1, margin: 0, letterSpacing: "-0.02em" }}>
            Iteration on self.
          </h1>
        </div>
      </div>

      {!loading && typingStats && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "32px" }}>
          {[
            { label: "Best WPM (7d)", value: typingStats.bestWpm ?? "—", color: "#3B82F6" },
            { label: "Avg Accuracy",  value: typingStats.avgAccuracy ? `${typingStats.avgAccuracy}%` : "—", color: "#22C55E" },
            { label: "Tests This Week", value: typingStats.testsThisWeek, color: "#F59E0B" },
            { label: "Mindset Today", value: todayMindset?.state ?? "—", color: "#8B5CF6" },
          ].map(stat => (
            <div key={stat.label} style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: "10px", padding: "16px", borderTop: `3px solid ${stat.color}` }}>
              <div style={{ fontSize: "10px", fontWeight: 600, color: text3, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>{stat.label}</div>
              <div style={{ fontSize: "22px", fontWeight: 700, color: text1, letterSpacing: "-0.02em", lineHeight: 1, textTransform: "capitalize" }}>{stat.value}</div>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginBottom: "16px", fontSize: "11px", fontWeight: 600, color: text3, textTransform: "uppercase", letterSpacing: "0.06em" }}>Modules</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px" }}>
        {modules.map(m => (
          <button key={m.key} onClick={() => setActiveModule(m.key)}
            style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: "14px", padding: "24px", textAlign: "left", cursor: "pointer", transition: "all 150ms ease", borderLeft: `4px solid ${m.color}` }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.15)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
            <div style={{ fontSize: "26px", marginBottom: "12px" }}>{m.emoji}</div>
            <div style={{ fontSize: "14px", fontWeight: 700, color: text1, marginBottom: "5px" }}>{m.label}</div>
            <div style={{ fontSize: "12px", color: text2 }}>{m.desc}</div>
          </button>
        ))}
      </div>

      {!loading && typingStats && typingStats.totalTests > 0 && (
        <div style={{ marginTop: "32px" }}>
          <div style={{ fontSize: "11px", fontWeight: 600, color: text3, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "16px" }}>Recent Typing Tests</div>
          <TypingHistory userId={user.id} isDark={isDark} cardBg={cardBg} border={border} text1={text1} text2={text2} text3={text3} />
        </div>
      )}

      {activeModule && (() => {
        const config = {
          typing: { title: "Improvement Lab — Keyboard Dexterity & Speed Test", width: "1150px" },
          speaking: { title: "Improvement Lab — Vocal Resonance Speech Logger", width: "1150px" },
          personality: { title: "Improvement Lab — Identity & Trait Sculptor", width: "780px" },
          pit: { title: "Improvement Lab — Self-Honesty Ledger & Challenges", width: "950px" },
          reading: { title: "Improvement Lab — Intellect & Reading Log", width: "780px" },
          aptitude: { title: "Improvement Lab — Aptitude & Logical Reasoning", width: "900px" },
          quant: { title: "Improvement Lab — Quantitative Mathematics", width: "900px" },
          techsim: { title: "Improvement Lab — Technical Interview Simulator", width: "1000px" },
          star: { title: "Improvement Lab — STAR Behavioral Framework", width: "900px" },
          resume: { title: "Improvement Lab — ATS Resume Matcher", width: "1100px" },
          flashcards: { title: "Improvement Lab — Technical Flashcards", width: "800px" },
          sysdesign: { title: "Improvement Lab — System Design Architecture", width: "1200px" },
        }[activeModule] || { title: "Improvement Lab module", width: "780px" };

        const winBg = isDark ? 'var(--color-surface)' : 'var(--color-overlay)';
        const headerBg = isDark ? 'var(--color-elevated)' : 'var(--color-surface)';
        const winBorder = 'var(--color-border)';

        return (
          <div onClick={() => setActiveModule(null)}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", backdropFilter: "blur(8px)" }}>
            <div onClick={e => e.stopPropagation()}
              style={{
                background: winBg,
                border: `1px solid ${winBorder}`,
                borderRadius: "16px",
                width: config.width,
                maxWidth: "95vw",
                height: "82vh",
                maxHeight: "85vh",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                boxShadow: isDark ? "0 24px 64px rgba(0,0,0,0.7)" : "0 24px 64px rgba(0,0,0,0.15)",
                backdropFilter: "blur(20px)"
              }}>
              
              {/* Dark Title Bar — matches site theme */}
              <div style={{
                height: '52px',
                minHeight: '52px',
                padding: '0 18px 0 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid rgba(255,255,255,0.07)',
                background: 'rgba(255,255,255,0.03)',
                flexShrink: 0,
              }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontFamily: 'var(--font-mono, monospace)', letterSpacing: '0.03em' }}>
                    {config.title}
                  </div>
                </div>
                <button
                  onClick={() => setActiveModule(null)}
                  style={{
                    width: '32px', height: '32px', borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.08)',
                    background: 'rgba(255,255,255,0.05)',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--color-text-3)', transition: 'all 0.15s', flexShrink: 0,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)'; e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'var(--color-text-3)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
                >
                  ✕
                </button>
              </div>

              {/* Scrollable Contents */}
              <div style={{ flex: 1, overflowY: "auto", padding: "32px 40px" }}>
                {activeModule === "typing"      && <TypingTest userId={user.id} onComplete={() => fetchStats()} onClose={() => setActiveModule(null)} />}
                {activeModule === "speaking"    && <SpeakingLogger onComplete={() => fetchStats()} onClose={() => setActiveModule(null)} />}
                {activeModule === "personality" && <PersonalityForge userId={user.id} isDark={isDark} onClose={() => { fetchStats(); setActiveModule(null); }} />}
                {activeModule === "pit"         && <ThePit userId={user.id} isDark={isDark} onClose={() => { fetchStats(); setActiveModule(null); }} />}
                {activeModule === "reading"     && <ReadingLog userId={user.id} isDark={isDark} onClose={() => { fetchStats(); setActiveModule(null); }} />}
                
                {["aptitude", "quant", "techsim", "star", "resume", "flashcards", "sysdesign"].includes(activeModule) && (
                  <div style={{ textAlign: "center", padding: "60px 20px" }}>
                    <div style={{ fontSize: "48px", marginBottom: "24px" }}>🚧</div>
                    <h2 style={{ color: text1, fontSize: "24px", fontWeight: 700, marginBottom: "12px" }}>Module Under Construction</h2>
                    <p style={{ color: text2, fontSize: "15px", maxWidth: "400px", margin: "0 auto", lineHeight: 1.6 }}>
                      This BTech interview prep module is currently being built. Check back soon for the full interactive experience.
                    </p>
                  </div>
                )}
              </div>

            </div>
          </div>
        );
      })()}
    </div>
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
      const { data: { user } } = await supabase.auth.getUser();
      await supabase.from("lab_reading_log").insert({ user_id: user.id, ...form, pages: Number(form.pages)||0, logged_at: new Date().toISOString() });
      setSaved(true); setTimeout(onClose, 1200);
    } catch { setSaving(false); }
  };
  return (
    <div style={{ padding: "32px" }}>
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
