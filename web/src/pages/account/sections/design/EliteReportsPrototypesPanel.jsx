import React, { useEffect, useMemo, useState } from 'react';
import { LabCard } from './PrototypePrimitives';
import './eliteReportsPrototypes.css';

const A = '#FF6B35';

const SCORES = Array.from({ length: 90 }, (_, i) => {
  const tr = 68 + i * 0.115;
  const w = Math.sin(i * 0.41) * 2.8 + Math.cos(i * 0.93) * 1.9;
  return Math.round(Math.min(82, Math.max(60, tr + w)));
});

function scoreColor(s) {
  const n = (s - 60) / 22;
  if (n < 0.25) return '#2D1008';
  if (n < 0.45) return '#6B2A10';
  if (n < 0.65) return '#B5401A';
  if (n < 0.82) return '#E05820';
  return A;
}

const CORR = [
  { a: 'Morning mobility', b: 'Focus hours', r: 0.71, dir: 1, x: 'Days with mobility before 9am produce 2.3× more sustained focus blocks.' },
  { a: 'Late caffeine', b: 'Next-day focus', r: 0.64, dir: -1, x: 'Caffeine after 4pm costs ~2.1 focus hours the following day.' },
  { a: 'Journal streak', b: 'Mood average', r: 0.58, dir: 1, x: '31-day streak aligns with your 3 highest-mood weeks.' },
  { a: 'Sleep consistency', b: 'Life Score', r: 0.67, dir: 1, x: 'Wake-time variance accounts for most week-over-week dips.' },
];

const FINDINGS = [
  'Life Score improved 9.2 points from Q2 baseline.',
  '7.3-point gap on days with morning mobility.',
  'Late caffeine costs ~2.1 focus hours next day.',
];

const CHAPTERS = [
  { id: 'overview', label: '01 Overview' },
  { id: 'domains', label: '02 Domains' },
  { id: 'signals', label: '03 Signals' },
  { id: 'actions', label: '04 Actions' },
];

/** 1 — Fingerprint Brief: sticky nav + hover fingerprint + scroll sections (reference direction) */
function ProtoFingerprintBrief() {
  const [tip, setTip] = useState('');
  const [sec, setSec] = useState('overview');
  return (
    <div className="er-shell er-brief">
      <header className="er-brief__bar">
        <div className="er-brief__brand">
          <span>AIIMIN</span>
          <em>ELITE</em>
        </div>
        <nav>
          {['OVERVIEW', 'DOMAINS', 'SIGNALS', 'ACTIONS'].map((n) => (
            <button
              key={n}
              type="button"
              className={sec === n.toLowerCase() ? 'is-on' : ''}
              onClick={() => setSec(n.toLowerCase())}
            >
              {n}
            </button>
          ))}
        </nav>
        <div className="er-brief__who">Kabir Mehta · OS-7F2A91</div>
      </header>
      <div className="er-brief__body">
        <div className="er-kicker">10 APR — 8 JUL 2026 · 90-DAY INTELLIGENCE</div>
        <h2>Your quarter,<br /><span>decoded.</span></h2>
        <div className="er-kicker" style={{ marginTop: 22 }}>90-DAY LIFE FINGERPRINT · HOVER</div>
        <div className="er-fp">
          {SCORES.map((s, i) => (
            <div
              key={i}
              className="er-fp__bar"
              style={{ height: `${Math.max(12, ((s - 60) / 22) * 100)}%`, background: scoreColor(s) }}
              onMouseEnter={() => setTip(`Day ${i + 1} · Score ${s}`)}
              onMouseLeave={() => setTip('')}
            />
          ))}
        </div>
        <div className="er-fp__tip">{tip || 'Hover any day'}</div>
        <div className="er-statgrid">
          {[['AVG', '74'], ['PEAK', '82'], ['FOCUS', '186h'], ['HABIT', '81%']].map(([k, v]) => (
            <div key={k}><em>{k}</em><strong>{v}</strong></div>
          ))}
        </div>
        <p className="er-prose">
          April–July marked a measurable behavioral upgrade. Morning mobility before 9am produces a 7.3-point Life Score gap — larger than any other single behavior in 90 days.
        </p>
      </div>
    </div>
  );
}

/** 2 — Case Dossier: left chapter rail + expandable evidence drawers */
function ProtoCaseDossier() {
  const [chapter, setChapter] = useState('overview');
  const [open, setOpen] = useState(0);
  return (
    <div className="er-shell er-dossier">
      <aside className="er-dossier__rail">
        <div className="er-dossier__stamp">CASE<br />IQ-Q2</div>
        {CHAPTERS.map((c) => (
          <button
            key={c.id}
            type="button"
            className={chapter === c.id ? 'is-on' : ''}
            onClick={() => setChapter(c.id)}
          >
            {c.label}
          </button>
        ))}
      </aside>
      <div className="er-dossier__main">
        <div className="er-dossier__meta">CONFIDENTIAL · SUBJECT KM · 90 DAYS</div>
        <h2>Behavioral case file</h2>
        <p className="er-prose">Evidence drawers below. Click to expand measured rules — not observations.</p>
        {CORR.map((c, i) => (
          <button
            key={c.a}
            type="button"
            className={`er-dossier__drawer ${open === i ? 'is-open' : ''}`}
            onClick={() => setOpen(open === i ? -1 : i)}
          >
            <div className="er-dossier__drawer-head">
              <span className={c.dir > 0 ? 'pos' : 'neg'}>{c.dir > 0 ? '+' : '−'}{c.r}</span>
              <strong>{c.a} ↔ {c.b}</strong>
              <em>{open === i ? '−' : '+'}</em>
            </div>
            {open === i && <p>{c.x}</p>}
          </button>
        ))}
      </div>
    </div>
  );
}

/** 3 — Quarter Timeline: vertical narrative spine with expandable day clusters */
function ProtoQuarterTimeline() {
  const [openWeek, setOpenWeek] = useState(8);
  const weeks = useMemo(() => (
    Array.from({ length: 13 }, (_, w) => ({
      w: w + 1,
      label: `W${w + 1}`,
      avg: Math.round(SCORES.slice(w * 7, w * 7 + 7).reduce((a, b) => a + b, 0) / 7),
      note: w === 8 ? 'Peak week · mobility locked' : w === 3 ? 'Caffeine leak cluster' : 'Steady compound',
    }))
  ), []);
  return (
    <div className="er-shell er-timeline">
      <div className="er-kicker">NARRATIVE SPINE · 13 WEEKS</div>
      <h2>The quarter as a story</h2>
      <div className="er-timeline__spine">
        {weeks.map((wk) => (
          <button
            key={wk.w}
            type="button"
            className={`er-timeline__node ${openWeek === wk.w ? 'is-open' : ''}`}
            onClick={() => setOpenWeek(wk.w)}
          >
            <span className="er-timeline__dot" style={{ background: scoreColor(wk.avg) }} />
            <div>
              <strong>{wk.label} · {wk.avg}</strong>
              <em>{wk.note}</em>
              {openWeek === wk.w && (
                <div className="er-timeline__days">
                  {SCORES.slice((wk.w - 1) * 7, (wk.w - 1) * 7 + 7).map((s, i) => (
                    <i key={i} style={{ background: scoreColor(s), height: 8 + (s - 60) }} title={`Score ${s}`} />
                  ))}
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

/** 4 — Correlation Lab: variable nodes + clickable edges as primary UI */
function ProtoCorrelationLab() {
  const [sel, setSel] = useState(0);
  const nodes = [
    { id: 'mob', label: 'Mobility', x: 18, y: 28 },
    { id: 'foc', label: 'Focus', x: 72, y: 22 },
    { id: 'caf', label: 'Caffeine', x: 22, y: 72 },
    { id: 'mood', label: 'Mood', x: 78, y: 68 },
    { id: 'sleep', label: 'Sleep', x: 50, y: 48 },
  ];
  const edges = [
    { from: 0, to: 1, i: 0 },
    { from: 2, to: 1, i: 1 },
    { from: 3, to: 4, i: 2 },
    { from: 4, to: 1, i: 3 },
  ];
  const c = CORR[sel];
  return (
    <div className="er-shell er-lab">
      <div className="er-kicker">CORRELATION LABORATORY · CLICK AN EDGE</div>
      <h2>Measured rules graph</h2>
      <div className="er-lab__stage">
        <svg viewBox="0 0 100 100" className="er-lab__svg">
          {edges.map((e) => {
            const a = nodes[e.from];
            const b = nodes[e.to];
            return (
              <line
                key={e.i}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                className={sel === e.i ? 'is-on' : ''}
                onClick={() => setSel(e.i)}
              />
            );
          })}
          {nodes.map((n) => (
            <g key={n.id}>
              <circle cx={n.x} cy={n.y} r="4.2" />
              <text x={n.x} y={n.y - 6}>{n.label}</text>
            </g>
          ))}
        </svg>
        <div className="er-lab__detail">
          <div className={`er-lab__rho ${c.dir < 0 ? 'neg' : ''}`}>{c.dir > 0 ? '+' : '−'}{c.r}</div>
          <strong>{c.a} → {c.b}</strong>
          <p>{c.x}</p>
        </div>
      </div>
    </div>
  );
}

/** 5 — Command Deck: instrument panels that open/close under sticky fingerprint */
function ProtoCommandDeck() {
  const [open, setOpen] = useState({ habits: true, focus: false, finance: false, signals: true });
  const toggle = (k) => setOpen((p) => ({ ...p, [k]: !p[k] }));
  return (
    <div className="er-shell er-deck">
      <div className="er-deck__sticky">
        <div className="er-kicker">COMMAND DECK · LIVE FINGERPRINT</div>
        <div className="er-fp er-fp--sm">
          {SCORES.map((s, i) => (
            <div key={i} className="er-fp__bar" style={{ height: `${Math.max(10, ((s - 60) / 22) * 100)}%`, background: scoreColor(s) }} />
          ))}
        </div>
      </div>
      <div className="er-deck__grid">
        {[
          { k: 'habits', title: 'HABITS', body: '81% avg · mobility 87% · late caffeine 61%' },
          { k: 'focus', title: 'FOCUS', body: '186h total · 2.1h avg session · upward weekly slope' },
          { k: 'finance', title: 'FINANCE', body: '₹2,86,400 · under budget 7/13 weeks' },
          { k: 'signals', title: 'SIGNALS', body: 'Top leak: late caffeine. Top lever: morning mobility.' },
        ].map((p) => (
          <button key={p.k} type="button" className={`er-deck__panel ${open[p.k] ? 'is-open' : ''}`} onClick={() => toggle(p.k)}>
            <div className="er-deck__panel-head">
              <strong>{p.title}</strong>
              <span>{open[p.k] ? 'CLOSE' : 'OPEN'}</span>
            </div>
            {open[p.k] && <p>{p.body}</p>}
          </button>
        ))}
      </div>
    </div>
  );
}

/** 6 — Briefing Slides: full-viewport slides with keyboard/dot nav */
function ProtoBriefingSlides() {
  const slides = [
    { t: 'Quarter brief', b: '90 days compressed. Avg 74 · Peak 82 · Focus 186h.' },
    { t: 'Fingerprint', b: 'Dark → bright orange = Life Score. Your Q2 shape at a glance.' },
    { t: 'Primary lever', b: 'Morning mobility before 9am: +7.3 Life Score gap.' },
    { t: 'Primary leak', b: 'Caffeine after 4pm: −2.1 focus hours next day.' },
    { t: 'Action set', b: 'Cutoff 2pm · calendar mobility · wake ±30m · journal after focus.' },
  ];
  const [i, setI] = useState(0);
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') setI((p) => Math.min(slides.length - 1, p + 1));
      if (e.key === 'ArrowLeft') setI((p) => Math.max(0, p - 1));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [slides.length]);
  const s = slides[i];
  return (
    <div className="er-shell er-slides">
      <div className="er-slides__stage">
        <div className="er-kicker">BRIEFING · SLIDE {String(i + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')} · ← →</div>
        <h2>{s.t}</h2>
        <p>{s.b}</p>
        {i === 1 && (
          <div className="er-fp er-fp--sm" style={{ marginTop: 28 }}>
            {SCORES.map((sc, idx) => (
              <div key={idx} className="er-fp__bar" style={{ height: `${Math.max(10, ((sc - 60) / 22) * 100)}%`, background: scoreColor(sc) }} />
            ))}
          </div>
        )}
        {i === 4 && (
          <ol className="er-slides__actions">
            {FINDINGS.map((f) => <li key={f}>{f}</li>)}
          </ol>
        )}
      </div>
      <div className="er-slides__dots">
        {slides.map((_, idx) => (
          <button key={idx} type="button" className={idx === i ? 'is-on' : ''} aria-label={`Slide ${idx + 1}`} onClick={() => setI(idx)} />
        ))}
      </div>
    </div>
  );
}

const PROTOS = [
  {
    id: 'fingerprint-brief',
    title: '01 · Fingerprint Brief',
    desc: 'Sticky section nav + 90-day hover fingerprint hero. Closest to the locked experience direction — Pro is a document; Elite is a scrollable brief.',
    badge: 'Reference',
    Component: ProtoFingerprintBrief,
  },
  {
    id: 'case-dossier',
    title: '02 · Case Dossier',
    desc: 'Left chapter rail + expandable evidence drawers. Feels like an intelligence case file, not a dashboard.',
    badge: 'Explore',
    Component: ProtoCaseDossier,
  },
  {
    id: 'quarter-timeline',
    title: '03 · Quarter Timeline',
    desc: 'Vertical narrative spine. Weeks as story beats; expand a week to see day-level fingerprint chips.',
    badge: 'Explore',
    Component: ProtoQuarterTimeline,
  },
  {
    id: 'correlation-lab',
    title: '04 · Correlation Lab',
    desc: 'Graph-first. Variables as nodes, Spearman edges clickable — correlation is the product surface.',
    badge: 'Explore',
    Component: ProtoCorrelationLab,
  },
  {
    id: 'command-deck',
    title: '05 · Command Deck',
    desc: 'Sticky fingerprint strip + instrument panels you open/close. Cockpit, not multipage PDF.',
    badge: 'Explore',
    Component: ProtoCommandDeck,
  },
  {
    id: 'briefing-slides',
    title: '06 · Briefing Slides',
    desc: 'Presentation mode. Full-stage slides, arrow-key / dot nav. Shareable briefing experience.',
    badge: 'Explore',
    Component: ProtoBriefingSlides,
  },
];

export default function EliteReportsPrototypesPanel() {
  const [active, setActive] = useState(PROTOS[0].id);
  const current = PROTOS.find((p) => p.id === active) || PROTOS[0];
  const Active = current.Component;

  return (
    <div className="design-lab__panel elite-reports-panel">
      <LabCard
        title="Elite Intelligence Report — interaction prototypes"
        desc="Elite is a web experience at /reports/[id], not a longer PDF. Six distinct interaction paradigms (not font skins). Pick a direction before production craft."
        badge="Elite craft"
        badgeVariant="proposed"
      >
        <div className="design-lab__select-row" style={{ marginBottom: 16, flexWrap: 'wrap' }}>
          {PROTOS.map((p) => (
            <button
              key={p.id}
              type="button"
              className={`design-lab__chip-btn ${active === p.id ? 'is-active' : ''}`}
              onClick={() => setActive(p.id)}
            >
              {p.title}
            </button>
          ))}
        </div>
        <p style={{ fontSize: 13, color: 'var(--color-text-2)', lineHeight: 1.6, marginBottom: 16, maxWidth: 720 }}>
          <strong style={{ color: 'var(--color-text-1)' }}>{current.title}</strong>
          {' — '}
          {current.desc}
        </p>
        <div className="elite-reports-frame">
          <Active />
        </div>
        <ul className="design-lab__checklist" style={{ marginTop: 18 }}>
          <li>Signature: 90-day Life Fingerprint strip (not available on Core/Pro)</li>
          <li>Product: interactive web URL · PDF download is archive snapshot only</li>
          <li>Generation: dedicated monthly pool (3 Deep / mo) — never burns daily AI</li>
        </ul>
      </LabCard>
    </div>
  );
}
