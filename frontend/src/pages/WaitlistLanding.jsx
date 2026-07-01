import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import WaitlistForm from '../components/waitlist/WaitlistForm';
import WaitlistQuickFeedback from '../components/waitlist/WaitlistQuickFeedback';
import Wordmark from '../components/brand/Wordmark';
import { ShippedBeamsBackground, ShippedScrollHeadline } from '../components/design/ShippedUI';

const API_BASE = process.env.REACT_APP_API_URL || '/api';

const PROBLEM_APPS = ['Habitify', 'Notion', 'Cricbuzz', 'CRED', 'Forest', 'YouTube'];

/** Market-backed hooks — what ambitious 18–28 Indians actually want unified */
const COMING_SOON = [
  {
    badge: 'Elite only',
    title: 'Life Score™',
    desc: 'One number that fuses sleep, habits, focus, and mood — not six disconnected charts.',
    tease: 'See what actually moved your week',
  },
  {
    badge: 'Pro+',
    title: 'Discipline Engine',
    desc: 'Urge surfing, streak recovery, and pattern alerts when you slip — built for the doom-scroll generation.',
    tease: 'Compassionate accountability',
  },
  {
    badge: 'Pro',
    title: 'Family Vault',
    desc: 'Documents, reminders, emergency pins — for students living away from home.',
    tease: 'Peace of mind for parents too',
  },
  {
    badge: 'Core',
    title: 'Sports Arena + AI previews',
    desc: 'Cricket, football, F1 — personalized feed with match context, not another scores ticker.',
    tease: 'Your teams, your briefing',
  },
  {
    badge: 'Core',
    title: 'Money OS',
    desc: 'Student-budget finance with Excel import, 13 categories, and net-worth at a glance.',
    tease: '₹25/mo — less than one Swiggy order',
  },
  {
    badge: 'Explore → Core',
    title: 'Cognitive Lab',
    desc: 'Typing drills, STAR prep, reaction benchmarks — gamified like Duolingo, serious like placement season.',
    tease: 'Train the mind you bring to work',
  },
];

const FEATURE_CARDS = [
  {
    title: 'Habits & Goals',
    desc: 'One system links your daily habits to long-term goals — no more siloed trackers.',
    stat: '3× completion rate',
  },
  {
    title: 'Discipline Engine',
    desc: 'Streak tracking with trigger analysis, urge surfing, and compassionate restarts.',
    stat: 'Pattern-aware',
  },
  {
    title: 'Life Intelligence',
    desc: 'Finance, sports, journal, and focus data connected in one AI-powered overview.',
    stat: '5 domains scored',
  },
];

const PERSONAS = [
  { emoji: '🎓', title: 'College Students', desc: 'Build discipline, track placements, manage money on a student budget.' },
  { emoji: '💼', title: 'Early Professionals', desc: 'Run your life like a system — habits, focus, finance, growth in one place.' },
  { emoji: '🏏', title: 'Sports Fans', desc: 'Personalized cricket, football, and F1 feed — not another generic scores app.' },
  { emoji: '🧠', title: 'Self-Improvers', desc: 'Journal, lab cognitive drills, and AI insights that actually connect to your data.' },
];

const PRICING = [
  { tier: 'Explore', price: 'Free', sub: '', tag: 'Try the OS with limited usage' },
  { tier: 'Core', price: '₹25', sub: '/mo', tag: 'Most people start here' },
  { tier: 'Pro', price: '₹61', sub: '/mo', tag: 'Everything + family vault' },
  { tier: 'Elite', price: '₹99', sub: '/mo', tag: 'Unlimited AI + priority' },
];

const WAITLIST_PERKS = [
  { icon: '🔒', title: 'OS-ID lock', desc: 'Reserve your 8-char username — first come, first served.' },
  { icon: '🎁', title: '3 months Core free', desc: 'Full Core tier at launch — habits, sports, money OS included.' },
  { icon: '🧪', title: 'Early prototypes', desc: 'Try Life Score, Discipline Engine, and Cognitive Lab before anyone else.' },
  { icon: '🏏', title: 'Priority sports feed', desc: 'Cricket, football, F1 — personalized briefings ahead of public rollout.' },
  { icon: '⚡', title: 'Priority onboarding', desc: 'Skip the queue when we open in September.' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function WaitlistLanding() {
  const [count, setCount] = useState(null);

  useEffect(() => {
    document.title = 'AIIMIN — Your AI Life Operating System';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute('content', 'Habits, discipline, sports, finance and cognitive growth in one intelligent place. Launching September 2026.');
    }

    const gaId = process.env.REACT_APP_GA_MEASUREMENT_ID;
    if (gaId && !document.getElementById('ga4-script')) {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function gtag() { window.dataLayer.push(arguments); };
      window.gtag('js', new Date());
      window.gtag('config', gaId);
      const s = document.createElement('script');
      s.id = 'ga4-script';
      s.async = true;
      s.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
      document.head.appendChild(s);
    }
  }, []);

  const fetchCount = () => {
    fetch(`${API_BASE}/waitlist/count`)
      .then((r) => r.json())
      .then((d) => setCount(typeof d.count === 'number' ? d.count : 0))
      .catch(() => setCount(0));
  };

  useEffect(() => {
    fetchCount();
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-base, #0A0C10)', color: '#EDEDED', fontFamily: 'var(--font-sans)' }}>
      {/* ── Hero ── */}
      <section
        id="hero"
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: 'clamp(80px, 12vw, 160px)',
          paddingBottom: 'clamp(60px, 8vw, 120px)',
          paddingLeft: 24,
          paddingRight: 24,
          background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(37,99,235,0.12) 0%, transparent 60%), var(--color-base, #0A0C10)',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <ShippedBeamsBackground />
        <ShippedScrollHeadline text="Track. Improve. Repeat." />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Wordmark
            style={{
              fontSize: 'clamp(28px, 5vw, 36px)',
              color: '#EDEDED',
            }}
          />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(36px, 6vw, 52px)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            margin: '24px 0 16px',
            maxWidth: '720px',
          }}
        >
          Run your life like a{' '}
          <span style={{ color: '#2563EB' }}>system</span>.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{ fontSize: 'clamp(15px, 2.5vw, 18px)', color: '#A0A0B0', maxWidth: '520px', margin: '0 0 28px', lineHeight: 1.6 }}
        >
          Habits, discipline, sports, finance and cognitive growth — connected in one intelligent place.
        </motion.p>

        <motion.span
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25 }}
          style={{
            display: 'inline-block',
            padding: '6px 16px',
            borderRadius: '9999px',
            border: '1px solid #2563EB',
            color: '#2563EB',
            fontSize: '13px',
            fontWeight: 700,
            marginBottom: '32px',
          }}
        >
          Opening September 2026
        </motion.span>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}
        >
          <WaitlistForm onSuccess={fetchCount} />
          {count !== null && (
            <p style={{ fontSize: '13px', color: '#6B6B7B', margin: 0 }}>
              Already joined by <strong style={{ color: '#A0A0B0' }}>{count.toLocaleString()}</strong> {count === 1 ? 'person' : 'people'}
            </p>
          )}
          <p style={{ fontSize: '13px', color: '#6B6B7B', margin: '8px 0 0' }}>
            Have an invite?{' '}
            <Link to="/login" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 600 }}>Sign in →</Link>
          </p>
        </motion.div>
      </section>

      {/* ── Waitlist exclusives ── */}
      <section id="waitlist-perks" style={{ padding: 'clamp(48px, 6vw, 80px) 24px', background: '#0E1016' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <motion.p
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            style={{ textAlign: 'center', color: '#10b981', fontSize: 12, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}
          >
            Waitlist exclusives
          </motion.p>
          <motion.h2
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(22px, 4vw, 32px)', fontWeight: 800, textAlign: 'center', marginBottom: 12 }}
          >
            Perks you only get by joining early
          </motion.h2>
          <p style={{ textAlign: 'center', color: '#6B6B7B', maxWidth: 520, margin: '0 auto 40px', lineHeight: 1.6, fontSize: 15 }}>
            Lock your OS-ID, get Core free for 3 months, and skip the line for prototypes and sports.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            {WAITLIST_PERKS.map((perk, i) => (
              <motion.div
                key={perk.title}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-20px' }}
                style={{
                  padding: 20,
                  borderRadius: 14,
                  background: '#111318',
                  border: '1px solid #252836',
                }}
              >
                <span style={{ fontSize: 24 }}>{perk.icon}</span>
                <h3 style={{ fontSize: 15, fontWeight: 700, margin: '10px 0 6px', fontFamily: 'var(--font-display)' }}>{perk.title}</h3>
                <p style={{ fontSize: 13, color: '#A0A0B0', lineHeight: 1.55, margin: 0 }}>{perk.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Coming soon teaser grid ── */}
      <section id="coming-soon" style={{ padding: 'clamp(60px, 8vw, 100px) 24px', background: 'linear-gradient(180deg, #0A0C10 0%, #0E1016 100%)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <motion.p
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            style={{ textAlign: 'center', color: '#2563EB', fontSize: 12, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}
          >
            Early access preview
          </motion.p>
          <motion.h2
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px, 4vw, 36px)', fontWeight: 800, textAlign: 'center', marginBottom: 16 }}
          >
            Built for productivity.<br />Designed for humans who are tired.
          </motion.h2>
          <p style={{ textAlign: 'center', color: '#6B6B7B', maxWidth: 520, margin: '0 auto 48px', lineHeight: 1.6, fontSize: 15 }}>
            We're not asking you to journal 500 words. Log in 60 seconds. Get a Life Score. Leave. Come back when it matters.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            {COMING_SOON.map((item, i) => (
              <motion.div
                key={item.title}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-30px' }}
                style={{
                  padding: 24,
                  borderRadius: 16,
                  background: 'linear-gradient(135deg, #111318 0%, #0d0f14 100%)',
                  border: '1px solid #252836',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <span style={{
                  fontSize: 10, fontWeight: 800, color: '#2563EB', textTransform: 'uppercase',
                  letterSpacing: '0.08em', background: 'rgba(37,99,235,0.12)', padding: '4px 10px', borderRadius: 999,
                }}>
                  {item.badge}
                </span>
                <h3 style={{ fontSize: 17, fontWeight: 700, margin: '14px 0 8px', fontFamily: 'var(--font-display)' }}>{item.title}</h3>
                <p style={{ fontSize: 14, color: '#A0A0B0', lineHeight: 1.55, margin: '0 0 12px' }}>{item.desc}</p>
                <p style={{ fontSize: 12, color: '#6B6B7B', margin: 0, fontStyle: 'italic' }}>{item.tease}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Quick feedback ── */}
      <section style={{ padding: '48px 24px 80px', background: '#0E1016', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Shape what we build</h2>
        <p style={{ color: '#6B6B7B', fontSize: 14, marginBottom: 24 }}>30 seconds. No account. We read everything.</p>
        <WaitlistQuickFeedback />
      </section>

      {/* ── The Problem ── */}
      <section id="problem" style={{ padding: 'clamp(40px, 6vw, 80px) 24px', maxWidth: '800px', margin: '0 auto', textAlign: 'center', background: 'var(--color-surface-1, #0E1016)' }}>
        <motion.h2
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 4vw, 32px)', fontWeight: 700, marginBottom: '32px' }}
        >
          You're juggling too many apps.
        </motion.h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center', marginBottom: '32px' }}>
          {PROBLEM_APPS.map((app, i) => (
            <motion.span
              key={app}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              style={{
                padding: '10px 20px',
                borderRadius: '10px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid #252836',
                color: '#6B6B7B',
                fontSize: '14px',
                fontWeight: 600,
              }}
            >
              {app}
            </motion.span>
          ))}
        </div>
        <motion.p
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          style={{ fontSize: '18px', color: '#A0A0B0', lineHeight: 1.7 }}
        >
          None of them talk to each other. AIIMIN is the connective tissue — your discipline streak knows your spending. Your goals nudge your focus sessions.
        </motion.p>
      </section>

      {/* ── Feature Glimpses ── */}
      <section id="features" style={{ padding: 'clamp(60px, 8vw, 120px) 24px', background: 'var(--color-base, #0A0C10)' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <motion.h2
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 4vw, 32px)', fontWeight: 700, textAlign: 'center', marginBottom: '48px' }}
          >
            One place. Everything connected.
          </motion.h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
            {FEATURE_CARDS.map((card, i) => (
              <motion.div
                key={card.title}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                style={{
                  padding: '28px',
                  borderRadius: '16px',
                  background: '#111318',
                  border: '1px solid #252836',
                }}
              >
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{card.stat}</span>
                <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '12px 0 8px', fontFamily: 'var(--font-display)' }}>{card.title}</h3>
                <p style={{ fontSize: '14px', color: '#A0A0B0', lineHeight: 1.6, margin: 0 }}>{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Who Is This For ── */}
      <section id="personas" style={{ padding: 'clamp(40px, 5vw, 80px) 24px', maxWidth: '960px', margin: '0 auto', background: 'var(--color-surface-1, #0E1016)' }}>
        <motion.h2
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 4vw, 32px)', fontWeight: 700, textAlign: 'center', marginBottom: '48px' }}
        >
          Built for ambitious Indians.
        </motion.h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          {PERSONAS.map((p, i) => (
            <motion.div
              key={p.title}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              style={{ padding: '24px', borderRadius: '14px', border: '1px solid #252836', background: '#111318' }}
            >
              <span style={{ fontSize: '28px' }}>{p.emoji}</span>
              <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '12px 0 6px' }}>{p.title}</h3>
              <p style={{ fontSize: '13px', color: '#A0A0B0', lineHeight: 1.55, margin: 0 }}>{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Pricing Preview ── */}
      <section id="pricing" style={{ padding: 'clamp(60px, 8vw, 100px) 24px', background: 'var(--color-base, #0A0C10)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <motion.h2
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 4vw, 32px)', fontWeight: 700, marginBottom: '12px' }}
          >
            Simple, India-first pricing.
          </motion.h2>
          <p style={{ color: '#6B6B7B', fontSize: '14px', marginBottom: '40px' }}>
            Launch pricing — waitlist gets Core free for 3 months at open.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px' }}>
            {PRICING.map((tier, i) => (
              <motion.div
                key={tier.tier}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                style={{
                  padding: '28px 20px',
                  borderRadius: '16px',
                  border: i === 1 ? '1px solid #2563EB' : '1px solid #252836',
                  background: '#111318',
                  opacity: i === 0 ? 0.9 : 1,
                }}
              >
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#2563EB', marginBottom: '8px' }}>{tier.tier}</div>
                <div style={{ fontSize: '32px', fontWeight: 800, fontFamily: 'var(--font-display)' }}>
                  {tier.price}<span style={{ fontSize: '14px', fontWeight: 500, color: '#6B6B7B' }}>{tier.sub}</span>
                </div>
                <p style={{ fontSize: '12px', color: '#6B6B7B', marginTop: '8px' }}>{tier.tag}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Repeat CTA ── */}
      <section id="join" style={{ padding: 'clamp(80px, 10vw, 140px) 24px', textAlign: 'center', background: 'var(--color-surface-1, #0E1016)' }}>
        <motion.h2
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 800, marginBottom: '24px' }}
        >
          Be first in line.
        </motion.h2>
        <motion.div
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}
        >
          <WaitlistForm compact onSuccess={fetchCount} />
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ padding: '40px 24px 60px', borderTop: '1px solid #252836', textAlign: 'center' }}>
        <Wordmark size={20} style={{ marginBottom: '8px' }} />
        <p style={{ fontSize: '13px', color: '#6B6B7B', margin: '0 0 16px' }}>Built in India 🇮🇳</p>
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/privacy" style={{ fontSize: '13px', color: '#A0A0B0', textDecoration: 'none' }}>Privacy</Link>
          <Link to="/terms" style={{ fontSize: '13px', color: '#A0A0B0', textDecoration: 'none' }}>Terms</Link>
          <Link to="/contact" style={{ fontSize: '13px', color: '#A0A0B0', textDecoration: 'none' }}>Contact</Link>
          <Link to="/login" style={{ fontSize: '13px', color: '#2563EB', textDecoration: 'none' }}>Sign in</Link>
        </div>
      </footer>
    </div>
  );
}
