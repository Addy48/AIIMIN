import React, { useState, useEffect } from 'react';
import { InsightsSection } from '../components/system/DashboardSections';
import { useAuth } from '../hooks/useAuth';
import { useThemeContext } from '../context/ThemeContext';
import { useLHSData } from '../hooks/useLHSData';
import supabase from '../utils/supabase';
import { motion } from 'framer-motion';

/* ─────────────────────────────────────────────────
   SKILL DOMAINS — editable / pulled from DB later
───────────────────────────────────────────────── */
const SKILL_DOMAINS = [
  {
    key: 'technical',
    label: 'Technical',
    emoji: '💻',
    color: '#3B82F6',
    skills: [
      { name: 'Data Structures & Algorithms', level: 4, lastPracticed: '2 days ago', xp: 820 },
      { name: 'System Design',                level: 3, lastPracticed: '5 days ago', xp: 540 },
      { name: 'SQL & Databases',              level: 3, lastPracticed: '1 week ago', xp: 480 },
      { name: 'React / Frontend',             level: 4, lastPracticed: 'Yesterday',  xp: 710 },
    ],
  },
  {
    key: 'communication',
    label: 'Communication',
    emoji: '🗣️',
    color: '#8B5CF6',
    skills: [
      { name: 'Public Speaking',   level: 3, lastPracticed: '3 days ago', xp: 390 },
      { name: 'Writing & Clarity', level: 4, lastPracticed: 'Yesterday',  xp: 620 },
      { name: 'Negotiation',       level: 2, lastPracticed: '2 weeks ago', xp: 210 },
    ],
  },
  {
    key: 'physical',
    label: 'Physical',
    emoji: '💪',
    color: '#22C55E',
    skills: [
      { name: 'Strength Training', level: 4, lastPracticed: 'Yesterday',  xp: 780 },
      { name: 'Cardio Endurance',  level: 3, lastPracticed: '3 days ago', xp: 420 },
      { name: 'Flexibility',       level: 2, lastPracticed: '1 week ago', xp: 180 },
    ],
  },
  {
    key: 'mental',
    label: 'Mental',
    emoji: '🧠',
    color: '#F59E0B',
    skills: [
      { name: 'Deep Work Focus',   level: 4, lastPracticed: 'Today',      xp: 690 },
      { name: 'Emotional Regulation', level: 3, lastPracticed: 'Yesterday', xp: 450 },
      { name: 'Meditation',        level: 2, lastPracticed: '4 days ago', xp: 240 },
    ],
  },
  {
    key: 'career',
    label: 'Career & Placement',
    emoji: '💼',
    color: '#EC4899',
    skills: [
      { name: 'Interview Readiness', level: 3, lastPracticed: '4 days ago', xp: 520 },
      { name: 'Resume Score',        level: 4, lastPracticed: '1 week ago', xp: 880 },
      { name: 'System Design',       level: 3, lastPracticed: '5 days ago', xp: 540 },
      { name: 'Aptitude & Logic',    level: 4, lastPracticed: '2 days ago', xp: 720 },
    ],
  },
];

const MAX_XP = 1000;

/* ─── Star Rating ──────────────────────────────── */
function Stars({ level, color }) {
  return (
    <div style={{ display: 'flex', gap: '3px' }}>
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} style={{
          width: '8px', height: '8px', borderRadius: '50%',
          background: i <= level ? color : 'rgba(255,255,255,0.1)',
          transition: 'background 200ms',
        }} />
      ))}
    </div>
  );
}

/* ─── Skill Row ────────────────────────────────── */
function SkillRow({ skill, color, isDark }) {
  const border = isDark ? '#222' : '#e5e7eb';
  const text1  = isDark ? '#ededed' : '#111';
  const text3  = isDark ? '#52525b' : '#9ca3af';
  const pct = (skill.xp / MAX_XP) * 100;

  return (
    <div style={{ padding: '14px 0', borderBottom: `1px solid ${border}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <div>
          <span style={{ fontSize: '13px', fontWeight: 600, color: text1 }}>{skill.name}</span>
          <span style={{ fontSize: '11px', color: text3, marginLeft: '10px' }}>last: {skill.lastPracticed}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Stars level={skill.level} color={color} />
          <span style={{ fontSize: '11px', color: text3, fontFamily: 'var(--font-mono)', minWidth: '50px', textAlign: 'right' }}>{skill.xp} xp</span>
        </div>
      </div>
      <div style={{ height: '3px', background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)', borderRadius: '9999px', overflow: 'hidden' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{ height: '100%', background: color, borderRadius: '9999px' }}
        />
      </div>
    </div>
  );
}

/* ─── Domain Card ──────────────────────────────── */
function DomainCard({ domain, isDark, isActive, onSelect }) {
  const avgLevel = Math.round(domain.skills.reduce((s, sk) => s + sk.level, 0) / domain.skills.length);
  const totalXp  = domain.skills.reduce((s, sk) => s + sk.xp, 0);
  const border   = isDark ? '#222' : '#e5e7eb';
  const text1    = isDark ? '#ededed' : '#111';
  const text3    = isDark ? '#52525b' : '#9ca3af';

  return (
    <button
      onClick={() => onSelect(isActive ? null : domain.key)}
      style={{
        background: isActive
          ? (isDark ? `${domain.color}18` : `${domain.color}12`)
          : (isDark ? '#111' : '#fff'),
        border: `1px solid ${isActive ? domain.color : border}`,
        borderRadius: '16px', padding: '20px', textAlign: 'left',
        cursor: 'pointer', transition: 'all 200ms ease',
      }}
    >
      <div style={{ fontSize: '24px', marginBottom: '10px' }}>{domain.emoji}</div>
      <div style={{ fontSize: '14px', fontWeight: 700, color: text1, marginBottom: '4px' }}>{domain.label}</div>
      <Stars level={avgLevel} color={domain.color} />
      <div style={{ fontSize: '11px', color: text3, marginTop: '8px', fontFamily: 'var(--font-mono)' }}>
        {totalXp.toLocaleString()} xp · {domain.skills.length} skills
      </div>
    </button>
  );
}

/* ─── Main Insights / Skills Page ─────────────── */
const Insights = () => {
  const { user, session } = useAuth();
  const { theme } = useThemeContext();
  const isDark = theme === 'dark';
  const { lhsData, reportData, loading: lhsLoading } = useLHSData(session);
  const [recentLogs, setRecentLogs] = useState([]);
  const [logsLoading, setLogsLoading] = useState(true);
  const [showReview, setShowReview] = useState(true);
  const [activeTab, setActiveTab] = useState('skills');   // 'skills' | 'insights'
  const [activeDomain, setActiveDomain] = useState(null);

  const border  = isDark ? '#222' : '#e5e7eb';
  const text1   = isDark ? '#ededed' : '#111';
  const text3   = isDark ? '#52525b' : '#9ca3af';
  const cardBg  = isDark ? '#111' : '#fff';

  useEffect(() => {
    if (!user) return;
    const sixtyDaysAgo = new Date(Date.now() - 60 * 86400000).toLocaleDateString('en-CA');
    supabase.from('daily_logs').select('*').eq('user_id', user.id)
      .gte('date', sixtyDaysAgo).order('date', { ascending: false })
      .then(({ data }) => setRecentLogs(data || []))
      .finally(() => setLogsLoading(false));
  }, [user]);

  if (!user) return null;

  const totalXp = SKILL_DOMAINS.flatMap(d => d.skills).reduce((s, sk) => s + sk.xp, 0);
  const overallLevel = Math.round(SKILL_DOMAINS.flatMap(d => d.skills).reduce((s, sk) => s + sk.level, 0) / SKILL_DOMAINS.flatMap(d => d.skills).length);
  const selectedDomain = SKILL_DOMAINS.find(d => d.key === activeDomain);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>

      {/* ── Page header ── */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: text3, marginBottom: '12px' }}>
          Skills · Mastery Engine
        </div>
        <h1 style={{ fontSize: '52px', fontWeight: 800, color: text1, margin: 0, letterSpacing: '-0.03em' }}>
          Build yourself.
        </h1>
      </div>

      {/* ── XP summary ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '32px' }}>
        {[
          { label: 'Total XP', value: totalXp.toLocaleString(), color: '#F59E0B', emoji: '🔥' },
          { label: 'Domains', value: SKILL_DOMAINS.length, color: '#3B82F6', emoji: '💠' },
          { label: 'Skills Tracked', value: SKILL_DOMAINS.flatMap(d => d.skills).length, color: '#22C55E', emoji: '🎯' },
          { label: 'Avg Level', value: `${overallLevel} / 5`, color: '#8B5CF6', emoji: '⭐' },
        ].map(m => (
          <div key={m.label} style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: '20px', padding: '24px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', right: '-10px', top: '-10px', fontSize: '64px', opacity: 0.05 }}>{m.emoji}</div>
            <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: text3, marginBottom: '12px' }}>{m.label}</div>
            <div style={{ fontSize: '28px', fontWeight: 900, color: m.color, fontFamily: 'var(--font-mono)' }}>{m.value}</div>
          </div>
        ))}
      </div>

      {/* ── Tab switcher ── */}
      <div style={{ display: 'flex', gap: '4px', padding: '4px', background: isDark ? '#1a1a1a' : '#f3f4f6', borderRadius: '12px', marginBottom: '28px', width: 'fit-content' }}>
        {[{ key: 'skills', label: '🎯 Skill Tree' }, { key: 'insights', label: '📊 Insights' }].map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)} style={{
            padding: '8px 20px', borderRadius: '9px', border: 'none', cursor: 'pointer',
            fontSize: '13px', fontWeight: 600, transition: 'all 150ms',
            background: activeTab === t.key ? (isDark ? '#222' : '#fff') : 'transparent',
            color: activeTab === t.key ? text1 : text3,
            boxShadow: activeTab === t.key ? '0 1px 4px rgba(0,0,0,0.15)' : 'none',
          }}>{t.label}</button>
        ))}
      </div>

      {/* ── SKILLS TAB ── */}
      {activeTab === 'skills' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* Domain cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
            {SKILL_DOMAINS.map(d => (
              <DomainCard key={d.key} domain={d} isDark={isDark} isActive={activeDomain === d.key} onSelect={setActiveDomain} />
            ))}
          </div>

          {/* Expanded domain skills */}
          {selectedDomain && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              style={{ background: cardBg, border: `1px solid ${selectedDomain.color}`, borderRadius: '16px', padding: '28px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '22px' }}>{selectedDomain.emoji}</span>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: text1, margin: 0 }}>{selectedDomain.label} Skills</h3>
                </div>
                <button style={{
                  padding: '6px 14px', borderRadius: '8px', border: `1px solid ${border}`,
                  background: 'transparent', color: text3, fontSize: '12px', cursor: 'pointer',
                }}
                  onClick={() => setActiveDomain(null)}>Close ✕</button>
              </div>
              {selectedDomain.skills.map(sk => (
                <SkillRow key={sk.name} skill={sk} color={selectedDomain.color} isDark={isDark} />
              ))}
              <button style={{
                marginTop: '16px', padding: '10px 16px', background: `${selectedDomain.color}15`,
                border: `1px dashed ${selectedDomain.color}`, borderRadius: '10px',
                color: selectedDomain.color, fontSize: '13px', fontWeight: 600, cursor: 'pointer', width: '100%',
              }}>
                + Add Skill to {selectedDomain.label}
              </button>
            </motion.div>
          )}

          {/* All skills flat view if no domain selected */}
          {!selectedDomain && (
            <div style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: '16px', padding: '28px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: text3, marginBottom: '16px' }}>
                All Skills — click a domain above to filter
              </div>
              {SKILL_DOMAINS.flatMap(d => d.skills.map(sk => ({ ...sk, color: d.color, domain: d.label }))).map(sk => (
                <SkillRow key={sk.name + sk.domain} skill={sk} color={sk.color} isDark={isDark} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── INSIGHTS TAB ── */}
      {activeTab === 'insights' && (
        (lhsLoading || logsLoading)
          ? <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', borderRadius: '8px', overflow: 'hidden', border: `1px solid ${border}` }}>
              {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: '72px' }} />)}
            </div>
          : <InsightsSection
              lhsData={lhsData}
              reportData={reportData}
              recentLogs={recentLogs}
              showReview={showReview}
              onDismissReview={() => setShowReview(false)}
            />
      )}
    </div>
  );
};

export const PageHeader = ({ label, title }) => (
  <div style={{ marginBottom: '40px' }}>
    <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-text-3)', fontFamily: 'var(--font-mono)', marginBottom: '8px' }}>{label}</div>
    <h1 style={{ font: 'var(--text-hero)', color: 'var(--color-text-1)', margin: 0, letterSpacing: '-0.02em' }}>{title}</h1>
  </div>
);

export default Insights;
