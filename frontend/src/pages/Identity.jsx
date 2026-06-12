import React, { useState, useEffect, useRef } from 'react';
// Identity page — AIIMIN brand hub
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

/* ─── Animated Counter ─────────────────────────────────────── */
function Counter({ to, suffix = '', duration = 2000 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const start = Date.now();
        const tick = () => {
          const elapsed = Date.now() - start;
          const p = Math.min(elapsed / duration, 1);
          const ease = 1 - Math.pow(1 - p, 4);
          setCount(Math.round(ease * to));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [to, duration]);
  return <span ref={ref}>{count}{suffix}</span>;
}

/* ─── Floating Orb ─────────────────────────────────────────── */
function Orb({ style }) {
  return (
    <motion.div
      animate={{ y: [0, -24, 0], x: [0, 12, 0], scale: [1, 1.05, 1] }}
      transition={{ duration: 8 + Math.random() * 4, repeat: Infinity, ease: 'easeInOut' }}
      style={{
        position: 'absolute',
        borderRadius: '50%',
        filter: 'blur(60px)',
        pointerEvents: 'none',
        ...style,
      }}
    />
  );
}

/* ─── Scroll Progress Bar ──────────────────────────────────── */
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: '2px',
        background: 'var(--color-accent)', transformOrigin: '0%',
        scaleX: scrollYProgress, zIndex: 9999,
      }}
    />
  );
}

/* ─── Section Wrapper ──────────────────────────────────────── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay },
});

const fadeIn = (delay = 0) => ({
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true },
  transition: { duration: 0.6, delay },
});

/* ─── Data ─────────────────────────────────────────────────── */
const stats = [
  { value: 12, suffix: '+', label: 'Modules', color: 'var(--text-1)' },
  { value: 50, suffix: '', label: 'Lab Sets', color: 'var(--text-1)' },
  { value: 100, suffix: '%', label: 'Data Privacy', color: 'var(--color-accent)' },
  { value: 1, suffix: '', label: 'Platform', color: 'var(--text-1)' },
];

const ACCENT = 'var(--color-accent)';
const MUTED_1 = 'hsl(220 14% 46%)';
const MUTED_2 = 'hsl(220 9% 56%)';

const pillars = [
  {
    icon: '🏛️',
    title: 'Structure is Freedom',
    desc: 'Ambiguity breeds anxiety. When every area of your life has a system, decision fatigue disappears and clarity becomes your default state. We give your chaos a container.',
    color: 'var(--color-accent)',
    border: 'color-mix(in srgb, var(--color-accent) 25%, var(--border))',
    bg: 'color-mix(in srgb, var(--color-accent) 6%, var(--bg-elevated))',
  },
  {
    icon: '📈',
    title: 'Compounding Discipline',
    desc: 'A 1% improvement every day leads to 37× growth in a year. AIIMIN is designed around the mathematics of consistency — small daily actions that accumulate into extraordinary outcomes.',
    color: 'var(--text-1)',
    border: 'var(--border)',
    bg: 'var(--bg-elevated)',
  },
  {
    icon: '🔐',
    title: 'Sovereign Data',
    desc: 'Your life data belongs to you — not advertisers, not algorithms. AIIMIN is your private vault. We will never sell, share or exploit what you choose to store here.',
    color: 'var(--text-1)',
    border: 'var(--border)',
    bg: 'var(--bg-elevated)',
  },
];

const modules = [
  { emoji: '💰', name: 'Finance', desc: 'Net worth, budgets & cashflow' },
  { emoji: '🎯', name: 'Goals', desc: 'OKRs, milestones & progress' },
  { emoji: '🔁', name: 'Habits', desc: 'Streaks, scoring & rituals' },
  { emoji: '🧪', name: 'Lab', desc: 'Self-experimentation engine' },
  { emoji: '📓', name: 'Journal', desc: 'Reflections & daily insights' },
  { emoji: '⚡', name: 'Discipline', desc: 'Accountability & consistency' },
  { emoji: '🏠', name: 'Family', desc: 'Documents & legacy storage' },
  { emoji: '📝', name: 'Notes', desc: 'Structured knowledge capture' },
  { emoji: '🎯', name: 'Focus', desc: 'Deep work & flow sessions' },
  { emoji: '📊', name: 'Insights', desc: 'Life metrics & skill tree' },
  { emoji: '🤝', name: 'Placements', desc: 'Career pipeline & prep' },
  { emoji: '⚙️', name: 'Settings', desc: 'Privacy, data & preferences' },
];

const brandValues = [
  { emoji: '💎', name: 'Clarity', desc: 'Every pixel exists to reduce noise, not add to it.' },
  { emoji: '🦾', name: 'Discipline', desc: 'We practice what we preach — rigor in every layer.' },
  { emoji: '🔐', name: 'Privacy', desc: 'Your data is sacred. We treat it like our own.' },
  { emoji: '✦', name: 'Premium', desc: 'No compromises on craft. Beauty that actually works.' },
  { emoji: '📈', name: 'Compounding', desc: 'Small improvements, relentlessly stacked. This is the way.' },
];

const painPoints = [
  { icon: '◻', text: 'Scattered across 10+ apps with no unified view' },
  { icon: '◻', text: 'No single source of truth for personal progress' },
  { icon: '◻', text: "Habit trackers that don't connect to real outcomes" },
  { icon: '◻', text: 'Finance dashboards with data but no insight' },
  { icon: '◻', text: 'Journaling siloed from goals and growth plans' },
  { icon: '◻', text: 'No accountability layer when plans are forgotten' },
  { icon: '◻', text: 'Family documents lost across folders and email' },
  { icon: '◻', text: 'Tools built for features, not for the user' },
];

const legalLinks = [
  { label: 'Privacy Policy', to: '/privacy' },
  { label: 'Terms of Service', to: '/terms' },
  { label: 'Security', to: '/security' },
  { label: 'Data Deletion', to: '/data-deletion' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

/* ─── Component ────────────────────────────────────────────── */
export default function Identity() {
  const [hoveredModule, setHoveredModule] = useState(null);

  useEffect(() => {
    const style = document.createElement('style');
    style.id = 'identity-responsive';
    style.textContent = `
      .identity-stats { grid-template-columns: repeat(4, 1fr) !important; }
      .identity-modules { grid-template-columns: repeat(6, 1fr) !important; }
      .identity-pain { grid-template-columns: repeat(4, 1fr) !important; }
      .identity-values { grid-template-columns: repeat(5, 1fr) !important; }
      .identity-mission { grid-template-columns: 1fr 1fr !important; }
      @media (max-width: 900px) {
        .identity-stats { grid-template-columns: repeat(2, 1fr) !important; }
        .identity-modules { grid-template-columns: repeat(3, 1fr) !important; }
        .identity-pain { grid-template-columns: repeat(2, 1fr) !important; }
        .identity-values { grid-template-columns: repeat(3, 1fr) !important; }
        .identity-mission { grid-template-columns: 1fr !important; }
      }
      @media (max-width: 600px) {
        .identity-modules { grid-template-columns: repeat(2, 1fr) !important; }
        .identity-pain { grid-template-columns: 1fr 1fr !important; }
        .identity-values { grid-template-columns: repeat(2, 1fr) !important; }
      }
    `;
    document.head.appendChild(style);
    return () => { const el = document.getElementById('identity-responsive'); if (el) el.remove(); };
  }, []);

  return (
    <>
      <ScrollProgress />
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px 140px', fontFamily: 'var(--font-sans)' }}>

        {/* ══════════ HERO ══════════ */}
        <section style={{ position: 'relative', textAlign: 'center', padding: '100px 24px 80px', overflow: 'hidden' }}>
          {/* Single centered orb - accent only */}
          <Orb style={{ width: 600, height: 400, top: -100, left: '50%', transform: 'translateX(-50%)', background: 'radial-gradient(ellipse, color-mix(in srgb, var(--color-accent) 10%, transparent) 0%, transparent 70%)', pointerEvents: 'none' }} />

          {/* Badge */}
          <motion.div {...fadeIn(0)} style={{ marginBottom: '36px' }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '7px 20px', borderRadius: '100px',
              border: '1px solid var(--border)',
              background: 'var(--bg-card)',
              backdropFilter: 'blur(12px)',
              color: 'var(--text-3)', fontSize: '12px',
              letterSpacing: '0.1em', textTransform: 'uppercase',
            }}>
              <motion.span
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                style={{ display: 'inline-block' }}
              >✦</motion.span>
              Personal Operating System — v2025
            </span>
          </motion.div>

          {/* Wordmark — matches navbar logo style */}
          <motion.h1
            {...fadeUp(0.06)}
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(72px, 14vw, 130px)',
              fontWeight: 900, letterSpacing: '-0.05em', lineHeight: 0.92,
              margin: '0 0 36px',
              color: 'var(--text-1)',
            }}
          >
            AIIMIN
          </motion.h1>

          {/* Tagline */}
          <motion.p {...fadeUp(0.14)} style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(20px, 3vw, 28px)',
            color: 'var(--text-2)', maxWidth: '700px', margin: '0 auto 20px',
            lineHeight: 1.35, fontWeight: 500,
          }}>
            The Personal Operating System<br />
            for the Modern Ambitious Individual.
          </motion.p>

          <motion.p {...fadeUp(0.2)} style={{ fontSize: '15px', color: 'var(--text-3)', maxWidth: '480px', margin: '0 auto 48px', lineHeight: 1.6 }}>
            One platform. Every dimension of your life — structured, measured, and compounding.
          </motion.p>

          {/* CTA row */}
          <motion.div {...fadeUp(0.26)} style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/overview" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '14px 32px', background: 'var(--color-accent)', color: '#fff',
              borderRadius: '14px', fontWeight: 700, fontSize: '14px', textDecoration: 'none',
              boxShadow: '0 8px 32px color-mix(in srgb, var(--color-accent) 40%, transparent)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 16px 40px color-mix(in srgb, var(--color-accent) 50%, transparent)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 32px color-mix(in srgb, var(--color-accent) 40%, transparent)'; }}
            >
              Enter Dashboard →
            </Link>
            <Link to="/privacy" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '14px 28px', background: 'var(--bg-elevated)', color: 'var(--text-1)',
              border: '1px solid var(--border)', borderRadius: '14px',
              fontWeight: 600, fontSize: '14px', textDecoration: 'none',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-accent)'; e.currentTarget.style.color = 'var(--color-accent)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-1)'; }}
            >
              Our Privacy Promise
            </Link>
          </motion.div>

          {/* Divider */}
          <motion.div {...fadeIn(0.4)} style={{ marginTop: '72px', display: 'flex', alignItems: 'center', gap: '16px', justifyContent: 'center' }}>
            <div style={{ height: '1px', width: '80px', background: 'linear-gradient(90deg, transparent, var(--border))' }} />
            <span style={{ fontSize: '11px', color: 'var(--text-3)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Scroll to explore</span>
            <div style={{ height: '1px', width: '80px', background: 'linear-gradient(90deg, var(--border), transparent)' }} />
          </motion.div>
        </section>

        {/* ══════════ STATS BAR ══════════ */}
        <motion.section
          {...fadeUp(0.1)}
          className="identity-stats"
          style={{
            display: 'grid', gap: '0',
            background: 'var(--bg-card)',
            borderRadius: '20px', overflow: 'hidden',
            border: '1px solid var(--border)', marginTop: '28px',
          }}
        >
          {stats.map((s, i) => (
            <div key={s.label} style={{
              background: 'transparent',
              padding: '36px 24px', textAlign: 'center',
              borderRight: i < stats.length - 1 ? '1px solid var(--border)' : 'none',
            }}>
              <div style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(36px, 4vw, 52px)', fontWeight: 900,
                color: s.color, lineHeight: 1, marginBottom: '8px',
                letterSpacing: '-0.03em',
              }}>
                <Counter to={s.value} suffix={s.suffix} />
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-3)', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                {s.label}
              </div>
            </div>
          ))}
        </motion.section>

        {/* ══════════ PHILOSOPHY PILLARS ══════════ */}
        <section style={{ marginTop: '100px' }}>
          <motion.div {...fadeUp(0)}>
            <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: '12px' }}>
              Our Philosophy
            </p>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(30px, 4vw, 46px)', fontWeight: 800, color: 'var(--text-1)', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '16px' }}>
              Three convictions.<br />Everything we build.
            </h2>
            <p style={{ fontSize: '17px', color: 'var(--text-2)', lineHeight: 1.7, maxWidth: '560px' }}>
              AIIMIN is built on principles about how ambitious people should relate to their time, data and potential.
            </p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px', marginTop: '48px' }}>
            {pillars.map((p, i) => (
              <motion.div
                key={p.title}
                {...fadeUp(i * 0.1)}
                whileHover={{ y: -5, scale: 1.01 }}
                style={{
                  background: p.bg,
                  border: `1px solid ${p.border}`,
                  borderRadius: '24px', padding: '36px 32px',
                  position: 'relative', overflow: 'hidden',
                  cursor: 'default',
                  transition: 'box-shadow 0.3s',
                }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 16px 40px color-mix(in srgb, var(--color-accent) 10%, transparent)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: p.color, opacity: 0.7 }} />
                <div style={{ fontSize: '40px', lineHeight: 1, marginBottom: '20px', marginTop: '4px' }}>{p.icon}</div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '21px', fontWeight: 800, color: 'var(--text-1)', marginBottom: '14px', letterSpacing: '-0.02em' }}>
                  {p.title}
                </h3>
                <p style={{ fontSize: '15px', color: 'var(--text-2)', lineHeight: 1.75 }}>{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ══════════ WHAT WE SOLVE ══════════ */}
        <section style={{ marginTop: '100px' }}>
          <motion.div {...fadeUp(0)}>
            <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: '12px' }}>
              The Problem
            </p>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(30px, 4vw, 46px)', fontWeight: 800, color: 'var(--text-1)', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '16px' }}>
              Real friction.<br />Real solutions.
            </h2>
            <p style={{ fontSize: '17px', color: 'var(--text-2)', lineHeight: 1.7, maxWidth: '560px' }}>
              Every ambitious person deals with the same invisible drag. Here is the chaos AIIMIN was built to replace.
            </p>
          </motion.div>

          <div className="identity-pain" style={{ display: 'grid', gap: '12px', marginTop: '48px' }}>
            {painPoints.map((pt, i) => (
              <motion.div
                key={i}
                {...fadeUp(i * 0.04)}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: '14px',
                  padding: '18px 20px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: '14px',
                  cursor: 'default',
                }}
              >
                <span style={{
                  width: '20px', height: '20px', borderRadius: '6px', flexShrink: 0, marginTop: '1px',
                  background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '11px', color: 'var(--text-3)', fontWeight: 700,
                }}>✗</span>
                <span style={{ fontSize: '14px', color: 'var(--text-2)', lineHeight: 1.55, fontWeight: 500 }}>{pt.text}</span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ══════════ MODULES ══════════ */}
        <section style={{ marginTop: '100px' }}>
          <motion.div {...fadeUp(0)}>
            <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: '12px' }}>
              What We Offer
            </p>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(30px, 4vw, 46px)', fontWeight: 800, color: 'var(--text-1)', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '16px' }}>
              12 modules.<br />One operating system.
            </h2>
            <p style={{ fontSize: '17px', color: 'var(--text-2)', lineHeight: 1.7, maxWidth: '620px' }}>
              Every module is purpose-built and deeply interconnected — so your goals talk to your habits, your finances connect to your lab, and your journal informs your growth.
            </p>
          </motion.div>

          <div className="identity-modules" style={{ display: 'grid', gap: '12px', marginTop: '48px' }}>
            {modules.map((mod, i) => (
              <motion.div
                key={mod.name}
                {...fadeUp(i * 0.03)}
                whileHover={{ y: -5, scale: 1.02 }}
                onHoverStart={() => setHoveredModule(mod.name)}
                onHoverEnd={() => setHoveredModule(null)}
                style={{
                  background: hoveredModule === mod.name ? 'color-mix(in srgb, var(--color-accent) 6%, var(--bg-card))' : 'var(--bg-card)',
                  border: `1.5px solid ${hoveredModule === mod.name ? 'var(--color-accent)' : 'var(--border)'}`,
                  borderRadius: '16px', padding: '20px 14px', textAlign: 'center',
                  cursor: 'default', position: 'relative', overflow: 'hidden',
                  transition: 'all 0.22s cubic-bezier(0.22, 1, 0.36, 1)',
                  boxShadow: hoveredModule === mod.name ? '0 12px 32px color-mix(in srgb, var(--color-accent) 15%, transparent)' : 'none',
                }}
              >
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: hoveredModule === mod.name ? 'var(--color-accent)' : 'var(--border)', transition: 'background 0.2s' }} />
                <div style={{ fontSize: '28px', lineHeight: 1, marginBottom: '10px', marginTop: '4px' }}>{mod.emoji}</div>
                <p style={{ fontSize: '12px', fontWeight: 800, color: hoveredModule === mod.name ? 'var(--color-accent)' : 'var(--text-1)', marginBottom: '4px', letterSpacing: '0.01em', transition: 'color 0.2s' }}>{mod.name}</p>
                <p style={{ fontSize: '10.5px', color: 'var(--text-3)', lineHeight: 1.4 }}>{mod.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ══════════ MANIFESTO ══════════ */}
        <motion.section
          {...fadeUp(0)}
          style={{
            marginTop: '100px', position: 'relative', overflow: 'hidden',
            background: 'var(--bg-elevated)', border: '1px solid var(--border)',
            borderRadius: '28px', padding: 'clamp(48px, 8vw, 80px) clamp(32px, 6vw, 72px)',
            textAlign: 'center',
          }}
        >
          {/* Background orbs */}
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-40%', left: '-10%', width: '60%', height: '200%', background: 'radial-gradient(circle, color-mix(in srgb, var(--color-accent) 8%, transparent), transparent 60%)', borderRadius: '50%' }} />
            <div style={{ position: 'absolute', top: '-40%', right: '-10%', width: '60%', height: '200%', background: 'radial-gradient(circle, rgba(139,92,246,0.08), transparent 60%)', borderRadius: '50%' }} />
          </div>
          <div style={{ position: 'relative' }}>
            <p style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: '24px' }}>
              The AIIMIN Manifesto
            </p>
            <p style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(22px, 3.5vw, 34px)',
              fontWeight: 700, color: 'var(--text-1)',
              lineHeight: 1.4, maxWidth: '740px', margin: '0 auto',
              letterSpacing: '-0.02em',
            }}>
              "You don't rise to the level of your goals.<br />
              You fall to the level of your systems."
            </p>
            <p style={{ marginTop: '20px', fontSize: '13px', color: 'var(--text-3)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              — James Clear · The Design Ethos of AIIMIN
            </p>
            <div style={{ marginTop: '40px', display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              {['Build your system.', 'Track what matters.', 'Compound daily.'].map((tag, i) => (
                <motion.span
                  key={tag}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12 + 0.3 }}
                  style={{
                    padding: '8px 20px', borderRadius: '100px',
                    border: '1px solid var(--border)', background: 'var(--bg-card)',
                    fontSize: '13px', fontWeight: 700, color: 'var(--text-2)',
                    letterSpacing: '0.02em',
                  }}
                >
                  {tag}
                </motion.span>
              ))}
            </div>
          </div>
        </motion.section>

        {/* ══════════ BRAND VALUES ══════════ */}
        <section style={{ marginTop: '100px' }}>
          <motion.div {...fadeUp(0)}>
            <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: '12px' }}>
              Brand Values
            </p>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(30px, 4vw, 46px)', fontWeight: 800, color: 'var(--text-1)', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '16px' }}>
              What we stand for.
            </h2>
            <p style={{ fontSize: '17px', color: 'var(--text-2)', lineHeight: 1.7, maxWidth: '540px' }}>
              Five principles we design against, ship against, and build against — every single day.
            </p>
          </motion.div>

          <div className="identity-values" style={{ display: 'grid', gap: '14px', marginTop: '48px' }}>
            {brandValues.map((v, i) => (
              <motion.div
                key={v.name}
                {...fadeUp(i * 0.07)}
                whileHover={{ y: -6, scale: 1.03 }}
                style={{
                  background: 'var(--bg-card)', border: '1px solid var(--border)',
                  borderRadius: '20px', padding: '28px 20px', textAlign: 'center',
                  position: 'relative', overflow: 'hidden',
                  cursor: 'default', transition: 'box-shadow 0.25s, border-color 0.25s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-accent)'; e.currentTarget.style.boxShadow = '0 12px 32px color-mix(in srgb, var(--color-accent) 12%, transparent)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'var(--color-accent)', opacity: 0.5 }} />
                <div style={{ fontSize: '32px', lineHeight: 1, marginBottom: '14px', marginTop: '6px' }}>{v.emoji}</div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '15px', fontWeight: 800, color: 'var(--text-1)', marginBottom: '10px', letterSpacing: '-0.01em' }}>{v.name}</h3>
                <p style={{ fontSize: '12px', color: 'var(--text-3)', lineHeight: 1.55 }}>{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ══════════ MISSION STATEMENT ══════════ */}
        <motion.section
          {...fadeUp(0)}
          className="identity-mission"
          style={{ marginTop: '100px', display: 'grid', gap: '32px', alignItems: 'center' }}
        >
          <div>
            <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: '12px' }}>
              Our Mission
            </p>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(26px, 3.5vw, 40px)', fontWeight: 800, color: 'var(--text-1)', letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: '20px' }}>
              Built for people who refuse to settle.
            </h2>
            <p style={{ fontSize: '16px', color: 'var(--text-2)', lineHeight: 1.75, marginBottom: '16px' }}>
              AIIMIN is for the student who wants to get placed at a top company while maintaining a 4.0 GPA, building wealth, and becoming physically and mentally elite — all simultaneously.
            </p>
            <p style={{ fontSize: '15px', color: 'var(--text-3)', lineHeight: 1.7 }}>
              We don't believe these goals conflict. We believe the right system makes all of them possible. That system is AIIMIN.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { icon: '🎓', title: 'For the ambitious student', desc: 'Placement prep, aptitude training, resume matching.' },
              { icon: '💰', title: 'For the wealth builder', desc: 'Net worth tracking, investment logging, budget optimization.' },
              { icon: '🧠', title: 'For the self-optimizer', desc: 'Habits, discipline, focus, and personal development lab.' },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  display: 'flex', gap: '16px', alignItems: 'flex-start',
                  padding: '20px 22px', background: 'var(--bg-card)',
                  border: '1px solid var(--border)', borderRadius: '16px',
                }}
              >
                <span style={{ fontSize: '28px', lineHeight: 1, flexShrink: 0 }}>{item.icon}</span>
                <div>
                  <p style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-1)', marginBottom: '4px' }}>{item.title}</p>
                  <p style={{ fontSize: '13px', color: 'var(--text-3)', lineHeight: 1.5 }}>{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ══════════ FOOTER ══════════ */}
        <motion.footer {...fadeIn(0.2)} style={{ marginTop: '120px', padding: '60px 0 0', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', fontWeight: 900, letterSpacing: '-0.04em', color: 'var(--text-1)', marginBottom: '6px' }}>
            AIIMIN
          </p>
          <p style={{ fontSize: '13px', color: 'var(--text-3)', marginBottom: '32px' }}>
            Your Personal Operating System · Built for the ambitious
          </p>
          <nav style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px 24px', marginBottom: '40px' }}>
            {legalLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                style={{ fontSize: '13px', color: 'var(--text-3)', textDecoration: 'none', fontWeight: 500, transition: 'color 0.15s' }}
                onMouseEnter={e => { e.target.style.color = 'var(--color-accent)'; }}
                onMouseLeave={e => { e.target.style.color = 'var(--text-3)'; }}
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <p style={{ fontSize: '12px', color: 'var(--text-3)', paddingBottom: '40px', letterSpacing: '0.04em' }}>
            © {new Date().getFullYear()} AIIMIN Systems. All rights reserved. Your data, your vault.
          </p>
        </motion.footer>

      </div>
    </>
  );
}
