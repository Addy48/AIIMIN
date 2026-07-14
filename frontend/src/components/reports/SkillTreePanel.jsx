import React, { useState } from 'react';
import { motion } from 'framer-motion';

/** Skill domains — placeholder levels until a real skills store lands. */
const SKILL_DOMAINS = [
  {
    key: 'technical',
    label: 'Technical',
    emoji: '💻',
    color: '#3B82F6',
    skills: [
      { name: 'Data Structures & Algorithms', level: 4, lastPracticed: '2 days ago', xp: 820 },
      { name: 'System Design', level: 3, lastPracticed: '5 days ago', xp: 540 },
      { name: 'SQL & Databases', level: 3, lastPracticed: '1 week ago', xp: 480 },
      { name: 'React / Frontend', level: 4, lastPracticed: 'Yesterday', xp: 710 },
    ],
  },
  {
    key: 'communication',
    label: 'Communication',
    emoji: '🗣️',
    color: '#8B5CF6',
    skills: [
      { name: 'Public Speaking', level: 3, lastPracticed: '3 days ago', xp: 390 },
      { name: 'Writing & Clarity', level: 4, lastPracticed: 'Yesterday', xp: 620 },
      { name: 'Negotiation', level: 2, lastPracticed: '2 weeks ago', xp: 210 },
    ],
  },
  {
    key: 'physical',
    label: 'Physical',
    emoji: '💪',
    color: '#22C55E',
    skills: [
      { name: 'Strength Training', level: 4, lastPracticed: 'Yesterday', xp: 780 },
      { name: 'Cardio Endurance', level: 3, lastPracticed: '3 days ago', xp: 420 },
      { name: 'Flexibility', level: 2, lastPracticed: '1 week ago', xp: 180 },
    ],
  },
  {
    key: 'mental',
    label: 'Mental',
    emoji: '🧠',
    color: '#F59E0B',
    skills: [
      { name: 'Deep Work Focus', level: 4, lastPracticed: 'Today', xp: 690 },
      { name: 'Emotional Regulation', level: 3, lastPracticed: 'Yesterday', xp: 450 },
      { name: 'Meditation', level: 2, lastPracticed: '4 days ago', xp: 240 },
    ],
  },
  {
    key: 'career',
    label: 'Career & Placement',
    emoji: '💼',
    color: '#EC4899',
    skills: [
      { name: 'Interview Readiness', level: 3, lastPracticed: '4 days ago', xp: 520 },
      { name: 'Resume Score', level: 4, lastPracticed: '1 week ago', xp: 880 },
      { name: 'Aptitude & Logic', level: 4, lastPracticed: '2 days ago', xp: 720 },
    ],
  },
];

const MAX_XP = 1000;

function Stars({ level, color }) {
  return (
    <div style={{ display: 'flex', gap: 3 }} aria-label={`Level ${level} of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: i <= level ? color : 'color-mix(in srgb, var(--color-text-3) 35%, transparent)',
          }}
        />
      ))}
    </div>
  );
}

function SkillRow({ skill, color }) {
  const pct = (skill.xp / MAX_XP) * 100;
  return (
    <div style={{ padding: '14px 0', borderBottom: '1px solid var(--border)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, gap: 12 }}>
        <div style={{ minWidth: 0 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-1)' }}>{skill.name}</span>
          <span style={{ fontSize: 11, color: 'var(--color-text-3)', marginLeft: 10 }}>last: {skill.lastPracticed}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <Stars level={skill.level} color={color} />
          <span style={{ fontSize: 11, color: 'var(--color-text-3)', fontFamily: 'var(--font-mono)', minWidth: 50, textAlign: 'right' }}>
            {skill.xp} xp
          </span>
        </div>
      </div>
      <div style={{ height: 3, background: 'var(--bg-elevated)', borderRadius: 999, overflow: 'hidden' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{ height: '100%', background: color, borderRadius: 999 }}
        />
      </div>
    </div>
  );
}

export default function SkillTreePanel() {
  const [activeDomain, setActiveDomain] = useState(null);
  const selected = SKILL_DOMAINS.find((d) => d.key === activeDomain);
  const totalXp = SKILL_DOMAINS.flatMap((d) => d.skills).reduce((s, sk) => s + sk.xp, 0);
  const overallLevel = Math.round(
    SKILL_DOMAINS.flatMap((d) => d.skills).reduce((s, sk) => s + sk.level, 0)
    / SKILL_DOMAINS.flatMap((d) => d.skills).length,
  );

  return (
    <div>
      <p style={{ fontSize: 13, color: 'var(--color-text-3)', margin: '0 0 20px', maxWidth: 560 }}>
        Skill map moved from Insights. Levels below are a working sketch until a live practice log wires XP —
        still useful as a personal scoreboard.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Total XP', value: totalXp.toLocaleString() },
          { label: 'Domains', value: SKILL_DOMAINS.length },
          { label: 'Skills', value: SKILL_DOMAINS.flatMap((d) => d.skills).length },
          { label: 'Avg level', value: `${overallLevel} / 5` },
        ].map((m) => (
          <div key={m.label} style={{ padding: 20, borderRadius: 16, background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-3)', marginBottom: 8 }}>
              {m.label}
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--color-text-1)', fontFamily: 'var(--font-mono)' }}>{m.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12, marginBottom: 20 }}>
        {SKILL_DOMAINS.map((d) => {
          const avg = Math.round(d.skills.reduce((s, sk) => s + sk.level, 0) / d.skills.length);
          const xp = d.skills.reduce((s, sk) => s + sk.xp, 0);
          const on = activeDomain === d.key;
          return (
            <button
              key={d.key}
              type="button"
              onClick={() => setActiveDomain(on ? null : d.key)}
              style={{
                textAlign: 'left',
                padding: 18,
                borderRadius: 16,
                cursor: 'pointer',
                background: on ? `color-mix(in srgb, ${d.color} 14%, var(--bg-card))` : 'var(--bg-card)',
                border: `1px solid ${on ? d.color : 'var(--border)'}`,
              }}
            >
              <div style={{ fontSize: 22, marginBottom: 8 }}>{d.emoji}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-1)', marginBottom: 6 }}>{d.label}</div>
              <Stars level={avg} color={d.color} />
              <div style={{ fontSize: 11, color: 'var(--color-text-3)', marginTop: 8, fontFamily: 'var(--font-mono)' }}>
                {xp.toLocaleString()} xp · {d.skills.length} skills
              </div>
            </button>
          );
        })}
      </div>

      <div style={{ background: 'var(--bg-card)', border: `1px solid ${selected?.color || 'var(--border)'}`, borderRadius: 16, padding: 24 }}>
        {selected ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h3 style={{ margin: 0, fontSize: 16, color: 'var(--color-text-1)' }}>
                {selected.emoji} {selected.label}
              </h3>
              <button
                type="button"
                onClick={() => setActiveDomain(null)}
                style={{
                  border: '1px solid var(--border)',
                  background: 'transparent',
                  color: 'var(--color-text-3)',
                  borderRadius: 8,
                  padding: '6px 12px',
                  fontSize: 12,
                  cursor: 'pointer',
                }}
              >
                Show all
              </button>
            </div>
            {selected.skills.map((sk) => (
              <SkillRow key={sk.name} skill={sk} color={selected.color} />
            ))}
          </>
        ) : (
          <>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-3)', marginBottom: 12 }}>
              All skills — pick a domain to filter
            </div>
            {SKILL_DOMAINS.flatMap((d) => d.skills.map((sk) => ({ ...sk, color: d.color, domain: d.label }))).map((sk) => (
              <SkillRow key={`${sk.domain}-${sk.name}`} skill={sk} color={sk.color} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
