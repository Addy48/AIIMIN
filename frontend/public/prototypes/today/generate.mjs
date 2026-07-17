import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const dir = dirname(fileURLToPath(import.meta.url));

/* ── Realistic AIIMIN Today data (mirrors Overview / CommandCenter) ── */
const D = {
  user: 'Aaditya',
  rank: 'Warrior',
  xp: 2840,
  xpNext: 3200,
  date: 'Wed, 8 Jul 2026',
  dateLong: 'Wednesday, July 8',
  weekNum: 27,
  dayOfYear: 189,
  phase: 'Night reset',
  sunrise: '5:42 AM',
  sunset: '7:18 PM',
  timeLeft: '2h 13m left',
  lifeScore: 74,
  lifeDelta: '+3',
  lifeExplain: 'Solid behavioral baseline. Sleep logged, gym pending, mood stable.',
  behavioral: 78,
  mental: 69,
  priorities: [
    { text: 'Finish placement outreach batch (12 DMs)', done: false },
    { text: 'Log sleep + mood before midnight', done: false },
    { text: 'Review weekly goals in journal', done: true },
  ],
  habits: [
    { icon: '🏋️', name: 'Morning gym', streak: 12, status: 'at_risk', pct: 86, label: '⚠ at risk' },
    { icon: '📚', name: 'DSA 1 problem', streak: 8, status: 'healthy', pct: 57, label: 'on track' },
    { icon: '💧', name: '3L water', streak: 5, status: 'healthy', pct: 36, label: '✓ done' },
  ],
  finance: { spent: 18420, income: 45000, tx: 23, budget: 25000 },
  note: 'Placement sprint — keep outreach tight. No new side quests until Friday review.',
  microTask: 'Send 3 follow-up emails to recruiters',
  microDone: false,
  target: { name: 'Placement sprint', daysLeft: 18, end: '26 Jul 2026' },
  executionRatio: 63,
  trajectory: [
    { label: 'Day', pct: 87.4, sub: '2h 13m left', color: '#10b981' },
    { label: 'Week', pct: 54.2, sub: '3d left', color: '#3b82f6' },
    { label: 'Month', pct: 25.8, sub: '23d left', color: '#ec4899' },
    { label: 'Year', pct: 51.6, sub: '176d left', color: '#f97316' },
  ],
  week: [
    { day: 'Mon', num: 6, today: false, events: ['Team standup 10:00'], tasks: ['Outreach list'] },
    { day: 'Tue', num: 7, today: false, events: [], tasks: ['Resume tweak', 'Gym ✓'] },
    { day: 'Wed', num: 8, today: true, events: ['Focus block 4–6pm'], tasks: ['12 DMs', 'Mood log'] },
    { day: 'Thu', num: 9, today: false, events: ['Mock interview 3pm'], tasks: [] },
    { day: 'Fri', num: 10, today: false, events: [], tasks: ['Weekly review'] },
    { day: 'Sat', num: 11, today: false, events: [], tasks: ['DSA contest'] },
    { day: 'Sun', num: 12, today: false, events: ['Family call'], tasks: [] },
  ],
  dailyLog: [
    { icon: '😴', label: 'Sleep', val: '6.8h', sub: 'bed 12:40' },
    { icon: '💪', label: 'Gym', val: '—', sub: 'not yet' },
    { icon: '😊', label: 'Mood', val: '7/10', sub: 'stable' },
    { icon: '👟', label: 'Steps', val: '6,240', sub: 'goal 10k' },
    { icon: '💧', label: 'Water', val: '2/3', sub: 'bottles' },
    { icon: '📖', label: 'Learning', val: 'Graphs', sub: '45 min' },
    { icon: '✍️', label: 'Journal', val: '—', sub: 'pending' },
    { icon: '🧠', label: 'Fog', val: 'Okay', sub: '2/3' },
  ],
  weekNumbers: [
    { label: 'Gym days', val: '4', sub: 'of 7' },
    { label: 'Focus', val: '3', sub: 'sessions' },
    { label: 'Journal', val: '2', sub: 'entries' },
    { label: 'Spent', val: '₹4.2k', sub: '7d' },
  ],
  insight: {
    title: 'Mid-week dip pattern',
    body: 'Your mood drops when sleep < 7h. You slept 6.8h last night — consider an earlier wind-down tonight.',
  },
  widgets: [
    { id: 'command_center', label: 'Command Center', on: true },
    { id: 'trajectory', label: 'Trajectory', on: true },
    { id: 'timeline', label: 'Week grid', on: true },
    { id: 'monday_insight', label: 'Weekly Insight', on: true },
    { id: 'quick_capture', label: 'Quick Capture', on: true },
    { id: 'micro_task', label: 'Micro Task', on: true },
    { id: 'logger', label: 'Universal Logger', on: true },
    { id: 'week_numbers', label: 'Week in Numbers', on: false },
    { id: 'countdown', label: 'Execution Window', on: false },
    { id: 'wins', label: 'Recent Wins', on: false },
  ],
  quests: ['Log mood before 10pm', 'Complete 1 focus session', 'Hit 10k steps'],
  wins: ['Shipped navbar prototype', '12-day gym streak', 'Closed finance review'],
};

/* ── HTML partials ── */
const appBar = (active = 'Today') => `
<header class="app-bar">
  <div class="logo"><span class="logo-dot">A</span> AIIMIN</div>
  <nav class="nav-pills">
    ${['Today', 'Insights', 'Calendar', 'Journal', 'Finance', 'Habits', 'Goals', 'Settings'].map(n =>
      `<span class="${n === active ? 'on' : ''}">${n}</span>`).join('')}
  </nav>
  <div class="status"><span class="online"></span> OS Online · ${D.rank} · ${D.xp}/${D.xpNext} XP</div>
</header>`;

const statusStrip = () => `
<div class="status-strip">
  <div class="cell"><span>Active target</span><strong>${D.target.daysLeft}d</strong><small>${D.target.name}</small></div>
  <div class="cell"><span>Week</span><strong>${D.weekNum}</strong><small>Day ${D.dayOfYear} of 365</small></div>
  <div class="cell"><span>Calendar</span><strong>${D.week.filter(w => w.today)[0].events.length}</strong><small>events today</small></div>
  <div class="cell"><span>Execution</span><strong>${D.executionRatio}%</strong><small>${D.phase}</small></div>
</div>`;

const widgetBar = () => `
<div class="widget-bar">
  <button type="button" style="padding:6px 12px;border-radius:10px;border:1px solid var(--border);background:var(--surface);color:var(--text-2);font-size:11px;font-weight:700;cursor:pointer">⊞ Customize widgets</button>
  <div class="chips">${D.widgets.map(w => `<span class="widget-chip ${w.on ? 'on' : 'off'}">${w.on ? '●' : '○'} ${w.label}</span>`).join('')}</div>
</div>`;

const weekGrid = () => `
<div class="week-grid">${D.week.map(w => `
  <div class="week-cell${w.today ? ' today' : ''}">
    <div class="day-head"><span class="day-label">${w.day}</span><span class="day-num">${w.num}</span></div>
    ${w.events.map(e => `<div class="ev">🕒 ${e}</div>`).join('')}
    ${w.tasks.map(t => `<div class="task${t.includes('✓') ? ' done' : ''}">${t}</div>`).join('')}
    ${!w.events.length && !w.tasks.length ? '<div class="task" style="opacity:0.4;border-style:dashed">+ Add target</div>' : ''}
  </div>`).join('')}
</div>`;

const commandCenter = () => `
<article class="cmd">
  <div class="cmd-head"><span class="label">Command Center</span><span style="font-size:11px;color:var(--text-3)">${D.date}</span></div>
  <div class="cmd-section">
    <div class="sec-head"><span>🧠 Life Score</span><span style="color:var(--success)">${D.lifeDelta} today</span></div>
    <div class="life-ring">
      <div class="ring" style="--pct:${D.lifeScore}" data-score="${D.lifeScore}"></div>
      <div class="meta">${D.lifeExplain}<div class="contrib"><span>Behav: ${D.behavioral}</span><span>Mental: ${D.mental}</span></div></div>
    </div>
  </div>
  <div class="cmd-section">
    <div class="sec-head"><span>🎯 Today's Priorities</span><span>${D.priorities.filter(p => p.done).length}/${D.priorities.length}</span></div>
    ${D.priorities.map(p => `<div class="priority-row${p.done ? ' done' : ''}"><div class="box"></div><span>${p.text}</span></div>`).join('')}
    <div style="margin-top:8px;padding:8px;border:1.5px dashed var(--border);border-radius:10px;text-align:center;font-size:11px;color:var(--text-3)">+ Add priority (max 3)</div>
  </div>
  <div class="cmd-section">
    <div class="sec-head"><span>🔥 Streak Monitor</span><span style="color:var(--text-3)">All habits →</span></div>
    ${D.habits.map(h => `
    <div class="habit-row">
      <div class="top"><span>${h.icon} ${h.name}</span><span><span style="color:${h.status === 'at_risk' ? 'var(--warning)' : 'var(--success)'};font-size:10px">${h.label}</span> 🔥 ${h.streak}</span></div>
      <div class="bar"><i style="width:${h.pct}%;background:${h.status === 'at_risk' ? 'var(--warning)' : 'var(--success)'}"></i></div>
    </div>`).join('')}
  </div>
  <div class="cmd-section">
    <div class="sec-head"><span>💰 Money This Month</span><span style="color:var(--text-3)">Finance →</span></div>
    <div class="money-row">
      <div><div style="font-size:10px;color:var(--text-3);font-weight:700;text-transform:uppercase">Spent</div><div class="spent">₹${D.finance.spent.toLocaleString('en-IN')}</div></div>
      <div class="income">Income ₹${D.finance.income.toLocaleString('en-IN')}<br/>${D.finance.tx} transactions</div>
    </div>
    <div style="margin-top:10px;height:4px;border-radius:99px;background:var(--border);overflow:hidden"><i style="display:block;height:100%;width:${Math.round(D.finance.spent / D.finance.budget * 100)}%;background:var(--accent)"></i></div>
    <div style="font-size:10px;color:var(--text-3);margin-top:4px">${Math.round(D.finance.spent / D.finance.budget * 100)}% of ₹${(D.finance.budget / 1000).toFixed(0)}k budget</div>
  </div>
  <div class="cmd-section">
    <div class="sec-head"><span>📝 Commander's Note</span></div>
    <div class="note-box">${D.note}</div>
  </div>
</article>`;

const trajectory = () => `
<article class="traj">
  <div style="font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:0.1em;color:var(--text-3);margin-bottom:12px">Trajectory · ${D.phase}</div>
  <div class="arc-wrap">
    <svg viewBox="0 0 220 118" aria-hidden="true">
      <path d="M 24 101 A 86 86 0 0 1 196 101" fill="none" stroke="var(--border)" stroke-width="3"/>
      <path d="M 24 101 A 86 86 0 0 1 196 101" fill="none" stroke="var(--success)" stroke-width="3" stroke-dasharray="270" stroke-dashoffset="${270 * (1 - D.trajectory[0].pct / 100)}" stroke-linecap="round"/>
      <circle cx="${24 + 172 * (1 - D.trajectory[0].pct / 100)}" cy="${101 - 86 * Math.sin(Math.PI * D.trajectory[0].pct / 100)}" r="6" fill="var(--warning)"/>
    </svg>
    <div class="sun-row"><span>☀ ${D.sunrise}</span><span>${D.phase}</span><span>${D.sunset} 🌙</span></div>
  </div>
  ${D.trajectory.map(r => `
  <div class="row">
    <div class="top"><div><span class="lbl">${r.label}</span><span class="sub">${r.sub}</span></div><span class="pct" style="color:${r.color}">${r.pct}%</span></div>
    <div class="track"><i style="width:${r.pct}%;background:linear-gradient(90deg, color-mix(in srgb, ${r.color} 60%, white), ${r.color})"></i></div>
  </div>`).join('')}
</article>`;

const dailyMetrics = () => `
<div class="metrics-row">${D.dailyLog.map(m => `
  <div class="metric-card"><div class="ico">${m.icon}</div><div class="val">${m.val}</div><div class="lbl">${m.label}</div><div style="font-size:9px;color:var(--text-3);margin-top:2px">${m.sub}</div></div>`).join('')}
</div>`;

const insightCard = () => `
<div class="insight-card"><div class="eyebrow">Weekly insight</div><h4>${D.insight.title}</h4><p>${D.insight.body}</p></div>`;

const microTask = () => `
<div><div style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:0.1em;color:var(--text-3);margin-bottom:10px">Today's micro-task</div>
<div class="micro-task"><div class="circle"></div><span>${D.microTask}</span></div></div>`;

const weekNumbers = () => `
<div class="metrics-row">${D.weekNumbers.map(w => `
  <div class="metric-card"><div class="val">${w.val}</div><div class="lbl">${w.label}</div><div style="font-size:9px;color:var(--text-3)">${w.sub}</div></div>`).join('')}
</div>`;

const decentNote = (text) => `<div class="decent-note">${text}</div>`;

const pageTitle = (h1, sub) => `
<div style="padding:20px 20px 12px"><h1 style="font-size:clamp(1.6rem,4vw,2.2rem);font-weight:800;letter-spacing:-0.02em">${h1}</h1>
<p style="font-size:13px;color:var(--text-2);margin-top:4px">${sub}</p></div>`;

function shell(title, inspo, body, extraCss = '', tags = []) {
  const n = title.match(/^(\d+)/)?.[1];
  const prev = n ? String(Number(n) - 1).padStart(2, '0') : null;
  const next = n ? String(Number(n) + 1).padStart(2, '0') : null;
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>AIIMIN Today — ${title}</title>
<link rel="stylesheet" href="shared.css"/>
<style>${extraCss}</style>
</head>
<body>
<nav class="proto-nav">
  <strong>AIIMIN PROTOTYPE</strong>
  <div class="links"><a href="/overview">Live Today</a><a href="index.html">Gallery</a><span>${inspo}</span></div>
  <span class="badge">${title}</span>
</nav>
<div class="proto-shell">${body}</div>
<div class="proto-footer">
  <a href="index.html">Gallery</a>
  ${prev && prev !== '00' ? `<a href="${prev}.html">← Prev</a>` : ''}
  ${next && Number(next) <= 12 ? `<a href="${next}.html">Next →</a>` : ''}
</div>
</body>
</html>`;
}

const protos = [
  /* 01 Yohji — editorial 4-col module grid + full data rail */
  {
    file: '01.html', title: '01 Yohji Grid', inspo: 'Yohji Yamamoto',
    tags: ['editorial', 'grid', 'modules'],
    css: `
      .yohji { background:#f4f0ea; color:#1a1a1a; min-height:calc(100vh - 48px); }
      .yohji .app-bar, .yohji .status-strip, .yohji .widget-bar { background:#fff; border-color:#e5e0d8; }
      .yohji .status-strip .cell { background:#faf8f5; border-color:#e5e0d8; }
      .yohji .hero-title { font-family:var(--serif); font-size:clamp(3.5rem,12vw,8rem); color:#c41e3a; text-align:center; padding:32px 20px 16px; line-height:0.9; letter-spacing:-0.02em; }
      .yohji .hero-sub { text-align:center; font-size:12px; color:#666; margin-bottom:20px; text-transform:uppercase; letter-spacing:0.15em; }
      .yohji .grid { display:grid; grid-template-columns:repeat(4,1fr); gap:6px; padding:0 20px 24px; max-width:1280px; margin:0 auto; }
      .yohji .cell { min-height:200px; padding:16px; display:flex; flex-direction:column; justify-content:flex-end; position:relative; }
      .yohji .cell:nth-child(1){ background:#1a1a1a; color:#fff; }
      .yohji .cell:nth-child(2){ background:#e8e4de; }
      .yohji .cell:nth-child(3){ background:#c41e3a; color:#fff; }
      .yohji .cell:nth-child(4){ background:linear-gradient(160deg,#555,#222); color:#fff; }
      .yohji .cell:nth-child(5){ background:#fff; border:1px solid #ddd; grid-column:span 2; min-height:140px; }
      .yohji .cell:nth-child(6){ background:#1a1a1a; color:#fff; grid-column:span 2; }
      .yohji .cell h3 { font-size:11px; font-weight:800; text-transform:uppercase; letter-spacing:0.12em; margin-bottom:6px; }
      .yohji .cell .big { font-size:28px; font-weight:800; line-height:1; margin-bottom:4px; }
      .yohji .cell p { font-size:11px; opacity:0.85; line-height:1.4; }
      .yohji .cell .tags { display:flex; flex-wrap:wrap; gap:4px; margin-top:8px; }
      .yohji .cell .tags i { font-size:9px; padding:3px 8px; border-radius:999px; background:rgba(255,255,255,0.15); font-style:normal; }
      .yohji .cell:nth-child(2) .tags i, .yohji .cell:nth-child(5) .tags i { background:#eee; color:#444; }
      .yohji .lower { max-width:1280px; margin:0 auto; padding:0 20px 40px; display:grid; grid-template-columns:1.2fr 1fr; gap:16px; }
      .yohji .lower .cmd, .yohji .lower .traj { border-color:#e5e0d8; }
      @media(max-width:900px){ .yohji .grid{ grid-template-columns:repeat(2,1fr);} .yohji .cell:nth-child(5),.yohji .cell:nth-child(6){ grid-column:span 2;} .yohji .lower{ grid-template-columns:1fr;} }
    `,
    body: `
      <div class="yohji">
        ${appBar()}${statusStrip()}${widgetBar()}
        <h1 class="hero-title">Today</h1>
        <p class="hero-sub">${D.dateLong} · ${D.user}</p>
        <div class="grid">
          <div class="cell"><div class="big">${D.lifeScore}</div><h3>Life score</h3><p>${D.lifeExplain}</p><div class="tags"><i>${D.lifeDelta}</i><i>Behav ${D.behavioral}</i></div></div>
          <div class="cell"><div class="big">${D.target.daysLeft}d</div><h3>${D.target.name}</h3><p>Ends ${D.target.end} · execution ${D.executionRatio}%</p></div>
          <div class="cell"><div class="big">1/3</div><h3>Priorities</h3><p>${D.priorities[0].text}</p><div class="tags"><i>2 open</i><i>1 done</i></div></div>
          <div class="cell"><div class="big">W${D.weekNum}</div><h3>Week rhythm</h3><p>${D.phase} · ${D.timeLeft}</p><div class="tags"><i>☀ ${D.sunrise}</i><i>🌙 ${D.sunset}</i></div></div>
          <div class="cell" style="grid-column:span 2;min-height:140px;justify-content:flex-start"><h3>Habits at risk</h3>${D.habits.map(h => `<p style="margin-top:8px;font-size:11px">${h.icon} ${h.name} · 🔥${h.streak} · <span style="color:${h.status==='at_risk'?'#f59e0b':'#10b981'}">${h.label}</span></p>`).join('')}</div>
          <div class="cell" style="grid-column:span 2"><h3>Daily signals</h3><div class="tags" style="margin-top:12px">${D.dailyLog.map(m => `<i>${m.icon} ${m.val}</i>`).join('')}</div><p style="margin-top:12px">₹${(D.finance.spent/1000).toFixed(1)}k spent · ${D.finance.tx} tx · mood ${D.dailyLog[2].val}</p></div>
        </div>
        <div class="lower"><div style="margin-bottom:16px">${weekGrid()}</div>${commandCenter()}${trajectory()}</div>
      </div>`,
  },

  /* 02 GEN-AGE brutalist */
  {
    file: '02.html', title: '02 GEN-AGE Brutalist', inspo: 'GEN-AGE',
    tags: ['brutalist', 'modes', 'hero'],
    css: `
      .brute { background:#e8e8e8; color:#111; min-height:calc(100vh - 48px); }
      .brute .app-bar { background:#e8e8e8; border-color:#ccc; }
      .brute .mega { font-family:var(--mono); font-size:clamp(5rem,20vw,16rem); font-weight:700; letter-spacing:-0.07em; line-height:0.82; padding:40px 20px 0; text-transform:uppercase; pointer-events:none; }
      .brute .panel { margin:0 20px 20px; background:#111; color:#fff; border-radius:8px; padding:24px; display:grid; grid-template-columns:1fr 1fr; gap:20px; }
      .brute .panel h2 { font-size:22px; font-weight:800; margin-bottom:8px; }
      .brute .panel p { font-size:12px; opacity:0.8; line-height:1.5; margin-bottom:12px; }
      .brute .modes { display:flex; gap:8px; flex-wrap:wrap; padding:0 20px 16px; }
      .brute .mode { padding:10px 18px; border:2px solid #111; font-size:11px; font-weight:800; text-transform:uppercase; cursor:pointer; }
      .brute .mode.on { background:#111; color:#e8e8e8; }
      .brute .data-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:8px; }
      .brute .data-grid div { padding:12px; background:#222; border-radius:6px; }
      .brute .data-grid span { font-size:9px; text-transform:uppercase; opacity:0.6; }
      .brute .data-grid strong { display:block; font-size:20px; margin-top:4px; }
      .brute .stack { margin:0 20px 40px; }
      @media(max-width:768px){ .brute .panel{ grid-template-columns:1fr;} }
    `,
    body: `
      <div class="brute">
        ${appBar()}
        <div class="modes"><span class="mode on">Builder</span><span class="mode">Student</span><span class="mode">Athlete</span><span class="mode">Quiet ledger</span></div>
        <div class="mega">TO<br/>DAY</div>
        <div class="panel">
          <div>
            <h2>${D.target.name}</h2>
            <p>${D.target.daysLeft} days left · ${D.priorities[0].text}</p>
            <div class="data-grid">
              <div><span>Life score</span><strong>${D.lifeScore}</strong></div>
              <div><span>Streak</span><strong>${D.habits[0].streak}d</strong></div>
              <div><span>Spent</span><strong>₹${(D.finance.spent/1000).toFixed(1)}k</strong></div>
            </div>
          </div>
          <div class="traj" style="background:#1a1a1a;border-color:#333">${trajectory().replace(/<article class="traj">|<\/article>/g, '')}</div>
        </div>
        <div class="stack"><div class="cmd" style="background:#fff;color:#111;border-color:#ddd">${commandCenter().replace(/<article class="cmd">|<\/article>/g, '')}</div></div>
      </div>`,
  },

  /* 03 FUTURO orbit */
  {
    file: '03.html', title: '03 FUTURO Orbit', inspo: 'FUTURO',
    tags: ['orbit', 'focus', 'metrics'],
    css: `
      .futuro { background:#fafafa; color:#111; min-height:calc(100vh - 48px); }
      .futuro .app-bar { background:#fff; border-color:#eee; }
      .futuro .layout { display:grid; grid-template-columns:280px 1fr 300px; gap:0; min-height:calc(100vh - 140px); }
      .futuro .side { padding:24px; border-right:1px solid #eee; }
      .futuro .side.right { border-right:none; border-left:1px solid #eee; }
      .futuro .orbit-wrap { display:grid; place-items:center; padding:40px 20px; position:relative; }
      .futuro .ring { position:absolute; border:2px dashed #ddd; border-radius:50%; }
      .futuro .ring.r1{ width:min(480px,80vw); height:min(480px,80vw); }
      .futuro .ring.r2{ width:min(360px,60vw); height:min(360px,60vw); }
      .futuro .ring.r3{ width:min(240px,40vw); height:min(240px,40vw); }
      .futuro .core { position:relative; z-index:2; width:160px; height:160px; background:#111; border-radius:50%; color:#fff; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; }
      .futuro .core strong { font-size:2.5rem; font-weight:800; }
      .futuro .sat { position:absolute; width:80px; height:80px; border-radius:50%; background:#fff; border:1px solid #e5e5e5; display:grid; place-items:center; font-size:10px; font-weight:700; text-align:center; box-shadow:0 8px 24px rgba(0,0,0,0.06); z-index:3; padding:8px; line-height:1.2; }
      .futuro .tagline { font-size:11px; color:#888; text-transform:uppercase; letter-spacing:0.12em; margin-bottom:16px; }
      @media(max-width:1000px){ .futuro .layout{ grid-template-columns:1fr;} .futuro .side{ border:none; border-bottom:1px solid #eee;} }
    `,
    body: `
      <div class="futuro">
        ${appBar()}${statusStrip()}
        <div class="layout">
          <aside class="side">
            <p class="tagline">when everything aligns</p>
            ${microTask()}
            <div style="margin-top:20px">${insightCard()}</div>
            <div style="margin-top:16px">${decentNote('Orbit modules are user-pinned. Hide any satellite in widget settings.')}</div>
          </aside>
          <main class="orbit-wrap">
            <div class="ring r1"></div><div class="ring r2"></div><div class="ring r3"></div>
            <div class="core"><strong>${D.lifeScore}</strong><span style="font-size:11px;opacity:0.7">life score</span><span style="font-size:10px;margin-top:4px;color:var(--success)">${D.lifeDelta}</span></div>
            <div class="sat" style="top:8%;left:50%;transform:translateX(-50%)">🔥<br/>${D.habits[0].streak}d</div>
            <div class="sat" style="bottom:12%;left:8%">🎯<br/>${D.target.daysLeft}d</div>
            <div class="sat" style="bottom:12%;right:8%">📅<br/>${D.week[2].events.length} ev</div>
            <div class="sat" style="top:42%;right:2%">💰<br/>₹${(D.finance.spent/1000).toFixed(0)}k</div>
            <div class="sat" style="top:42%;left:2%">😴<br/>${D.dailyLog[0].val}</div>
          </main>
          <aside class="side right">
            <div style="font-size:11px;font-weight:800;text-transform:uppercase;color:#888;margin-bottom:12px">Priorities</div>
            ${D.priorities.map(p => `<div class="priority-row${p.done ? ' done' : ''}" style="background:#f5f5f5;border-color:#e5e5e5"><div class="box"></div><span style="color:#111">${p.text}</span></div>`).join('')}
            <div style="margin-top:20px">${dailyMetrics()}</div>
          </aside>
        </div>
      </div>`,
  },

  /* 04 Construction callouts */
  {
    file: '04.html', title: '04 Construction Technical', inspo: 'Construction Co.',
    tags: ['callouts', 'technical', 'annotated'],
    css: `
      .construct { background:linear-gradient(135deg,#e8f4fc,#d4e8f7); color:#1a3a52; min-height:calc(100vh - 48px); }
      .construct .app-bar { background:rgba(255,255,255,0.7); border-color:#c5d9e8; }
      .construct .wrap { max-width:1200px; margin:0 auto; padding:32px 20px; display:grid; grid-template-columns:1fr 1fr; gap:40px; align-items:start; }
      .construct h1 { font-size:clamp(1.8rem,4vw,2.8rem); font-weight:800; line-height:1.1; margin-bottom:12px; }
      .construct .sub { font-size:13px; color:#4a6a82; line-height:1.6; margin-bottom:20px; }
      .construct .helmet-zone { position:relative; min-height:380px; display:grid; place-items:center; }
      .construct .helmet { width:260px; height:260px; background:linear-gradient(145deg,#3b82f6,#1d4ed8); border-radius:50% 50% 42% 42%; position:relative; display:grid; place-items:center; font-size:72px; box-shadow:0 24px 48px rgba(29,78,216,0.25); }
      .construct .callout { position:absolute; font-size:11px; background:#fff; padding:10px 14px; border-radius:10px; box-shadow:0 8px 24px rgba(0,0,0,0.1); max-width:160px; line-height:1.4; }
      .construct .callout b { display:block; font-size:10px; text-transform:uppercase; letter-spacing:0.08em; color:var(--accent); margin-bottom:4px; }
      .construct .callout::after { content:''; position:absolute; width:48px; height:2px; background:var(--accent); }
      .construct .c1{ top:5%; right:-10px;} .construct .c1::after{ left:-52px; top:50%; }
      .construct .c2{ bottom:25%; left:-20px;} .construct .c2::after{ right:-52px; top:50%; }
      .construct .c3{ top:45%; right:-30px;} .construct .c3::after{ left:-52px; top:50%; }
      .construct .c4{ bottom:5%; right:20%;} .construct .c4::after{ left:50%; top:-12px; width:2px; height:24px; }
      .construct .lower { max-width:1200px; margin:0 auto; padding:0 20px 40px; display:grid; grid-template-columns:1fr 1fr; gap:16px; }
      @media(max-width:900px){ .construct .wrap,.construct .lower{ grid-template-columns:1fr;} }
    `,
    body: `
      <div class="construct">
        ${appBar()}
        <div class="wrap">
          <div>
            <h1>Shaping habits.<br/>Delivering clarity.<br/>Day ${D.dayOfYear} of ${D.daysInYear || 365}.</h1>
            <p class="sub">Annotated Today view for ${D.user}. Each callout maps to a real widget — toggle visibility in Customize widgets. No metric without an owner.</p>
            ${decentNote('User decentralization: you pick which callouts appear. Default set shown below.')}
            <div style="margin-top:16px;display:flex;gap:8px;flex-wrap:wrap">
              <span style="padding:10px 18px;border-radius:999px;background:var(--accent);color:#fff;font-size:12px;font-weight:700">Today</span>
              <span style="padding:10px 18px;border-radius:999px;background:#fff;border:1px solid #c5d9e8;font-size:12px;font-weight:600">Plan</span>
              <span style="padding:10px 18px;border-radius:999px;background:#fff;border:1px solid #c5d9e8;font-size:12px;font-weight:600">Review</span>
            </div>
          </div>
          <div class="helmet-zone">
            <div class="helmet">⛑</div>
            <div class="callout c1"><b>Life score</b>${D.lifeScore} · ${D.lifeDelta}<br/>Behav ${D.behavioral} · Mental ${D.mental}</div>
            <div class="callout c2"><b>Active target</b>${D.target.name}<br/>${D.target.daysLeft}d · ends ${D.target.end}</div>
            <div class="callout c3"><b>Trajectory</b>Day ${D.trajectory[0].pct}%<br/>${D.phase} · ${D.timeLeft}</div>
            <div class="callout c4"><b>Finance</b>₹${D.finance.spent.toLocaleString('en-IN')} spent<br/>${D.finance.tx} tx this month</div>
          </div>
        </div>
        <div class="lower">${commandCenter()}${weekGrid().replace('week-grid', 'week-grid" style="display:grid;gap:8px')}</div>
      </div>`,
  },

  /* 05 Everlane columns */
  {
    file: '05.html', title: '05 Everlane Columns', inspo: 'Everlane',
    tags: ['columns', 'domains', 'lifestyle'],
    css: `
      .everlane { background:#fff; color:#111; min-height:calc(100vh - 48px); }
      .everlane .app-bar { background:#fff; border-color:#eee; }
      .everlane .cols { display:grid; grid-template-columns:repeat(4,1fr); min-height:50vh; }
      .everlane .col { padding:24px 20px; display:flex; flex-direction:column; justify-content:flex-end; color:#fff; position:relative; border-right:1px solid rgba(255,255,255,0.1); }
      .everlane .col:nth-child(1){ background:linear-gradient(0deg,rgba(0,0,0,0.65),transparent),#2d4a3e; }
      .everlane .col:nth-child(2){ background:linear-gradient(0deg,rgba(0,0,0,0.65),transparent),#4a3728; }
      .everlane .col:nth-child(3){ background:linear-gradient(0deg,rgba(0,0,0,0.65),transparent),#1a3a5c; }
      .everlane .col:nth-child(4){ background:linear-gradient(0deg,rgba(0,0,0,0.65),transparent),#5c2a1a; }
      .everlane .col .pin { position:absolute; top:16px; right:16px; font-size:10px; padding:4px 8px; border-radius:999px; background:rgba(255,255,255,0.2); }
      .everlane .col h3 { font-size:12px; font-weight:800; text-transform:uppercase; letter-spacing:0.1em; }
      .everlane .col .vals { margin-top:12px; display:flex; flex-direction:column; gap:6px; }
      .everlane .col .vals div { font-size:11px; opacity:0.9; display:flex; justify-content:space-between; border-bottom:1px solid rgba(255,255,255,0.15); padding-bottom:4px; }
      .everlane .footer { display:grid; grid-template-columns:1.2fr auto 1fr; gap:24px; padding:32px 24px; align-items:end; max-width:1200px; margin:0 auto; }
      .everlane .footer h2 { font-size:clamp(1.5rem,3vw,2.2rem); font-weight:800; line-height:1.1; }
      .everlane .lower { padding:0 24px 40px; max-width:1200px; margin:0 auto; }
      @media(max-width:768px){ .everlane .cols{ grid-template-columns:repeat(2,1fr);} .everlane .footer{ grid-template-columns:1fr;} }
    `,
    body: `
      <div class="everlane">
        ${appBar()}${widgetBar()}
        <div class="cols">
          <div class="col"><span class="pin">● visible</span><h3>Rest · Sleep</h3><div class="vals"><div><span>Hours</span><strong>${D.dailyLog[0].val}</strong></div><div><span>Bedtime</span><strong>${D.dailyLog[0].sub}</strong></div><div><span>Fog</span><strong>${D.dailyLog[7].val}</strong></div></div></div>
          <div class="col"><span class="pin">● visible</span><h3>Body · Move</h3><div class="vals"><div><span>Gym</span><strong>${D.dailyLog[1].val}</strong></div><div><span>Steps</span><strong>${D.dailyLog[3].val}</strong></div><div><span>Water</span><strong>${D.dailyLog[4].val}</strong></div></div></div>
          <div class="col"><span class="pin">● visible</span><h3>Mind · Mood</h3><div class="vals"><div><span>Mood</span><strong>${D.dailyLog[2].val}</strong></div><div><span>Learning</span><strong>${D.dailyLog[5].val}</strong></div><div><span>Journal</span><strong>${D.dailyLog[6].val}</strong></div></div></div>
          <div class="col"><span class="pin">○ hidden</span><h3>Execute · Target</h3><div class="vals"><div><span>Target</span><strong>${D.target.daysLeft}d</strong></div><div><span>Priority</span><strong>1/3 done</strong></div><div><span>Focus</span><strong>0 today</strong></div></div></div>
        </div>
        <div class="footer">
          <h2>BUILT FOR<br/>YOUR DOMAINS</h2>
          <div style="display:flex;gap:8px"><button class="action-btn action-btn--ghost" style="color:#111;border-color:#ccc">Reorder</button><button class="action-btn action-btn--primary">Add column</button></div>
          <p style="font-size:12px;color:#666;line-height:1.5;text-align:right">Each column = life domain you own. Pin, hide, reorder. AIIMIN never forces a single dashboard narrative.</p>
        </div>
        <div class="lower">${weekGrid()}<div style="margin-top:16px">${commandCenter()}</div></div>
      </div>`,
  },

  /* 06 Rhode editorial */
  {
    file: '06.html', title: '06 Rhode Editorial', inspo: 'Rhode',
    tags: ['editorial', 'overlay', 'brief'],
    css: `
      .rhode { min-height:calc(100vh - 48px); position:relative; background:linear-gradient(135deg,#1a1a1a 0%,#2d1810 50%,#4a2c1a 100%); }
      .rhode .app-bar { background:rgba(0,0,0,0.4); border-color:rgba(255,255,255,0.1); color:#fff; position:relative; z-index:2; }
      .rhode .hero { min-height:calc(100vh - 100px); display:grid; grid-template-columns:1.1fr 0.9fr; }
      .rhode .left { padding:60px 48px; display:flex; flex-direction:column; justify-content:center; color:#fff; z-index:1; }
      .rhode h1 { font-family:var(--mono); font-size:clamp(2.5rem,6vw,4.5rem); font-weight:700; text-transform:uppercase; letter-spacing:-0.03em; line-height:0.95; margin-bottom:24px; }
      .rhode .right { padding:40px 32px; display:flex; flex-direction:column; gap:16px; justify-content:center; }
      .rhode .card { background:#fff; color:#111; padding:20px; border-radius:4px; }
      .rhode .card h3 { font-size:13px; font-weight:800; text-transform:uppercase; letter-spacing:0.08em; margin-bottom:8px; }
      .rhode .card p { font-size:12px; color:#555; line-height:1.55; margin-bottom:12px; }
      .rhode .card .row { display:flex; justify-content:space-between; font-size:11px; padding:6px 0; border-bottom:1px solid #eee; }
      .rhode .stack { display:flex; flex-direction:column; gap:12px; }
      @media(max-width:900px){ .rhode .hero{ grid-template-columns:1fr;} }
    `,
    body: `
      <div class="rhode">
        ${appBar()}
        <div class="hero">
          <div class="left">
            <h1>Edited.<br/>Intentional.<br/>Yours.</h1>
            <p style="font-size:14px;opacity:0.75;max-width:400px;line-height:1.6">${D.dateLong}. Life score ${D.lifeScore} (${D.lifeDelta}). ${D.insight.body}</p>
          </div>
          <div class="right">
            <div class="card"><h3>Today's brief</h3><p>${D.target.name} — ${D.target.daysLeft} days. ${D.priorities[0].text}</p>
              <div class="row"><span>Micro-task</span><strong>${D.microTask}</strong></div>
              <div class="row"><span>Commander note</span><strong style="max-width:60%;text-align:right">${D.note.slice(0,48)}…</strong></div>
              <a href="#" style="font-size:12px;font-weight:700;color:var(--accent)">Open command center →</a>
            </div>
            <div class="stack">${insightCard()}${microTask()}</div>
            <div class="card" style="background:#111;color:#fff"><h3 style="color:#fff">Week ${D.weekNum}</h3>${weekGrid()}</div>
          </div>
        </div>
      </div>`,
  },

  /* 07 Salomon dynamic */
  {
    file: '07.html', title: '07 Salomon Dynamic', inspo: 'Salomon',
    tags: ['dynamic', 'numbers', 'asymmetric'],
    css: `
      .salomon { background:#c5d4bc; color:#111; min-height:calc(100vh - 48px); }
      .salomon .app-bar { background:rgba(255,255,255,0.5); border-color:rgba(0,0,0,0.08); }
      .salomon .hero { display:grid; grid-template-columns:1fr 1fr; min-height:calc(100vh - 200px); }
      .salomon .left { padding:48px 40px; display:flex; flex-direction:column; justify-content:center; }
      .salomon .big { font-family:var(--mono); font-size:clamp(5rem,14vw,10rem); font-weight:700; letter-spacing:-0.05em; line-height:0.85; }
      .salomon .big em { font-size:0.28em; font-style:normal; display:block; margin-top:12px; font-weight:600; }
      .salomon .stats { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; margin-top:32px; }
      .salomon .stats div { padding:14px; background:rgba(255,255,255,0.5); border-radius:8px; }
      .salomon .stats span { font-size:9px; text-transform:uppercase; letter-spacing:0.1em; opacity:0.7; }
      .salomon .stats strong { display:block; font-size:22px; margin-top:4px; }
      .salomon .right { position:relative; display:grid; place-items:center; }
      .salomon .orb { width:min(380px,75%); aspect-ratio:1; background:linear-gradient(145deg,#fff,#e0e0e0); border-radius:50%; box-shadow:0 40px 80px rgba(0,0,0,0.12); display:grid; place-items:center; transform:rotate(-8deg); }
      .salomon .orb-inner { text-align:center; }
      .salomon .orb-inner strong { font-size:4rem; font-weight:800; display:block; }
      .salomon .inset { position:absolute; bottom:40px; right:40px; width:140px; padding:16px; background:#111; color:#fff; border-radius:8px; font-size:11px; line-height:1.5; }
      .salomon .lower { padding:0 24px 32px; display:grid; grid-template-columns:1fr 1fr; gap:16px; }
      @media(max-width:768px){ .salomon .hero,.salomon .lower{ grid-template-columns:1fr;} }
    `,
    body: `
      <div class="salomon">
        ${appBar()}${statusStrip()}
        <div class="hero">
          <div class="left">
            <div class="big">${D.habits[0].streak}D<em>/ ${D.target.daysLeft}d · ${D.target.name}</em></div>
            <div class="stats">
              <div><span>Life score</span><strong>${D.lifeScore}</strong></div>
              <div><span>Week</span><strong>${D.weekNum}</strong></div>
              <div><span>Spent</span><strong>₹${(D.finance.spent/1000).toFixed(1)}k</strong></div>
            </div>
            <button style="margin-top:24px;align-self:flex-start;padding:14px 28px;background:#111;color:#fff;border:none;border-radius:4px;font-weight:800;font-size:12px;letter-spacing:0.1em;cursor:pointer">LOG TODAY</button>
          </div>
          <div class="right">
            <div class="orb"><div class="orb-inner"><strong>${D.lifeScore}</strong><span style="font-size:12px">LIFE SCORE</span><div style="margin-top:8px;font-size:11px;color:var(--success)">${D.lifeDelta} today</div></div></div>
            <div class="inset">Week ${D.weekNum}<br/>Execution ${D.executionRatio}%<br/>${D.phase}<br/>${D.timeLeft}</div>
          </div>
        </div>
        <div class="lower">${commandCenter()}${trajectory()}</div>
      </div>`,
  },

  /* 08 Aesop ritual */
  {
    file: '08.html', title: '08 Aesop Ritual', inspo: 'Aesop',
    tags: ['atmospheric', 'ritual', 'moody'],
    css: `
      .aesop { background:#0a0a0a; color:#e8e4de; min-height:calc(100vh - 48px); }
      .aesop .app-bar { background:rgba(0,0,0,0.6); border-color:#222; }
      .aesop .trees { position:fixed; inset:0; opacity:0.25; pointer-events:none; background:url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><path fill="%23333" d="M0 300 L50 100 L80 300 M60 300 L120 60 L150 300 M140 300 L200 80 L240 300 M220 300 L280 40 L320 300"/></svg>') bottom/cover no-repeat; }
      .aesop .layout { position:relative; z-index:1; max-width:1100px; margin:0 auto; padding:40px 24px; }
      .aesop .hero { text-align:center; padding:40px 0 32px; }
      .aesop h1 { font-family:var(--serif); font-size:clamp(1.8rem,4vw,2.8rem); font-weight:400; letter-spacing:0.02em; max-width:640px; margin:0 auto 20px; line-height:1.35; }
      .aesop .jar { width:72px; height:90px; margin:0 auto 24px; background:linear-gradient(180deg,#3a3a3a,#1a1a1a); border-radius:8px 8px 20px 20px; border:1px solid #555; position:relative; }
      .aesop .jar::after { content:'${D.lifeScore}'; position:absolute; inset:0; display:grid; place-items:center; font-size:24px; font-weight:800; }
      .aesop .grid { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; margin-top:32px; }
      .aesop .ritual-card { padding:20px; border:1px solid #333; border-radius:12px; background:rgba(255,255,255,0.03); }
      .aesop .ritual-card h4 { font-size:11px; text-transform:uppercase; letter-spacing:0.12em; color:#888; margin-bottom:10px; }
      .aesop .ritual-card p { font-size:13px; line-height:1.55; color:#ccc; }
      .aesop .modules { display:flex; gap:8px; flex-wrap:wrap; justify-content:center; margin-top:24px; }
      .aesop .mod { padding:8px 16px; border:1px solid #444; border-radius:999px; font-size:11px; color:#999; }
      .aesop .mod.on { border-color:var(--success); color:var(--success); }
      @media(max-width:768px){ .aesop .grid{ grid-template-columns:1fr;} }
    `,
    body: `
      <div class="aesop">
        <div class="trees"></div>
        ${appBar()}${widgetBar()}
        <div class="layout">
          <div class="hero">
            <div class="jar"></div>
            <h1>Where raw signals become daily ritual</h1>
            <p style="font-size:13px;color:#888;max-width:520px;margin:0 auto">${D.insight.body}</p>
            <div class="modules">${D.widgets.filter(w=>w.on).map(w => `<span class="mod on">${w.label}</span>`).join('')}${D.widgets.filter(w=>!w.on).map(w => `<span class="mod">${w.label}</span>`).join('')}</div>
          </div>
          <div class="grid">
            <div class="ritual-card"><h4>Morning · Rest</h4><p>Sleep ${D.dailyLog[0].val} (${D.dailyLog[0].sub}). Fog: ${D.dailyLog[7].val}. ${D.habits[0].name}: ${D.habits[0].label}.</p></div>
            <div class="ritual-card"><h4>Midday · Execute</h4><p>${D.priorities[0].text}. Micro: ${D.microTask}. Calendar: ${D.week[2].events.join(', ')}.</p></div>
            <div class="ritual-card"><h4>Evening · Reflect</h4><p>${D.note} Mood ${D.dailyLog[2].val}. Journal ${D.dailyLog[6].val}.</p></div>
          </div>
          <div style="margin-top:24px;display:grid;grid-template-columns:1fr 1fr;gap:16px">${commandCenter()}${trajectory()}</div>
        </div>
      </div>`,
  },

  /* 09 Maison elegant */
  {
    file: '09.html', title: '09 Maison Elegant', inspo: 'Maison Nove',
    tags: ['serif', 'whitespace', 'quiet'],
    css: `
      .maison { background:#faf9f7; color:#2a2826; min-height:calc(100vh - 48px); }
      .maison .app-bar { background:#faf9f7; border-color:#e8e6e3; color:#2a2826; }
      .maison .hero { min-height:45vh; display:grid; place-items:center; position:relative; padding:48px; }
      .maison .title { font-family:var(--serif); font-size:clamp(4rem,12vw,7rem); font-weight:400; letter-spacing:-0.02em; z-index:1; }
      .maison .accent { position:absolute; font-size:140px; z-index:2; pointer-events:none; filter:drop-shadow(0 20px 40px rgba(0,0,0,0.1)); }
      .maison .corners { display:grid; grid-template-columns:1fr 1fr 1fr; gap:24px; padding:24px 48px 48px; font-size:12px; color:#666; border-top:1px solid #e8e6e3; }
      .maison .corners strong { display:block; color:#2a2826; font-size:14px; margin-bottom:6px; font-weight:700; }
      .maison .body { max-width:1000px; margin:0 auto; padding:0 24px 48px; display:grid; grid-template-columns:1fr 1fr; gap:20px; }
      .maison .cmd, .maison .traj { border-color:#e8e6e3; }
      @media(max-width:768px){ .maison .corners{ grid-template-columns:1fr;} .maison .body{ grid-template-columns:1fr;} }
    `,
    body: `
      <div class="maison">
        ${appBar()}
        <div class="hero">
          <h1 class="title">Today</h1>
          <div class="accent">🌿</div>
        </div>
        <div class="corners">
          <div><strong>${D.dateLong}</strong>${D.user}'s ledger. Life score ${D.lifeScore}. Week ${D.weekNum}, day ${D.dayOfYear}.</div>
          <div style="text-align:center"><strong>${D.target.name}</strong>${D.target.daysLeft} days · ${D.target.end}<br/>${D.priorities.filter(p=>!p.done).length} priorities open</div>
          <div style="text-align:right"><strong>Customize</strong>7 widgets on · 3 hidden<br/>Your layout, not ours</div>
        </div>
        <div class="body">${commandCenter()}<div>${trajectory()}<div style="margin-top:16px">${microTask()}<div style="margin-top:16px">${dailyMetrics()}</div></div></div></div>
      </div>`,
  },

  /* 10 Hand-Drawn Human — replaces Linear */
  {
    file: '10.html', title: '10 Hand-Drawn Brief', inspo: 'Figma sketch resources',
    tags: ['human', 'sketch', 'annotations'],
    css: `
      .sketch { background:#fffef8; color:#1a1a1a; min-height:calc(100vh - 48px); }
      .sketch .app-bar { background:#fffef8; border-color:#e8e4d8; }
      .sketch .page { max-width:900px; margin:0 auto; padding:32px 24px 48px; }
      .sketch h1 { font-family:var(--sketch); font-size:3.5rem; font-weight:700; margin-bottom:8px; position:relative; display:inline-block; }
      .sketch h1::after { content:''; position:absolute; left:0; right:0; bottom:4px; height:8px; background:url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 8"><path d="M0 4 Q50 0 100 4 T200 4" stroke="%23ff6b35" stroke-width="3" fill="none"/></svg>') no-repeat; background-size:100% 100%; }
      .sketch .arrow-note { font-family:var(--sketch); font-size:1.25rem; color:#555; margin:16px 0; display:flex; align-items:flex-start; gap:12px; }
      .sketch .arrow-note svg { flex-shrink:0; margin-top:4px; }
      .sketch .box { border:2px solid #1a1a1a; border-radius:4px; padding:20px; margin:20px 0; position:relative; background:#fff; }
      .sketch .box.highlight { box-shadow:0 0 0 3px rgba(255,107,53,0.3); }
      .sketch .circle-annotate { position:absolute; top:-12px; right:20px; width:48px; height:48px; border:2px solid var(--accent); border-radius:50%; transform:rotate(-8deg); }
      .sketch .priority { font-family:var(--sketch); font-size:1.35rem; padding:10px 0; border-bottom:1px dashed #ccc; display:flex; align-items:center; gap:10px; }
      .sketch .priority.done { opacity:0.5; text-decoration:line-through; }
      .sketch .doodle-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; margin-top:20px; }
      .sketch .doodle { text-align:center; padding:16px 8px; border:1.5px dashed #bbb; border-radius:8px; }
      .sketch .doodle strong { font-family:var(--sketch); font-size:1.5rem; display:block; }
    `,
    body: `
      <div class="sketch">
        ${appBar()}${statusStrip()}
        <div class="page">
          <h1>Hey ${D.user} — here's today</h1>
          <p style="font-size:14px;color:#666;margin-bottom:24px">${D.dateLong} · ${D.phase} · ${D.timeLeft}</p>
          <div class="arrow-note">
            <svg width="40" height="24" viewBox="0 0 40 24"><path d="M0 12 Q20 0 38 12" stroke="#1a1a1a" stroke-width="2" fill="none"/><polygon points="36,8 40,12 36,16" fill="#1a1a1a"/></svg>
            <span>Start here → your one micro-win for the day</span>
          </div>
          <div class="box highlight">
            <div class="circle-annotate"></div>
            <div style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:0.1em;color:var(--accent);margin-bottom:8px">Micro-task</div>
            <div style="font-family:var(--sketch);font-size:1.6rem">${D.microTask}</div>
          </div>
          <div class="arrow-note">
            <svg width="40" height="24" viewBox="0 0 40 24"><path d="M0 12 Q20 24 38 12" stroke="#1a1a1a" stroke-width="2" fill="none"/></svg>
            <span>Then knock these out (max 3 — you choose)</span>
          </div>
          <div class="box">
            ${D.priorities.map(p => `<div class="priority${p.done ? ' done' : ''}"><span>${p.done ? '☑' : '☐'}</span> ${p.text}</div>`).join('')}
          </div>
          <div class="arrow-note"><span>Your signals at a glance — tap any to log</span></div>
          <div class="doodle-grid">${D.dailyLog.map(m => `<div class="doodle"><strong>${m.val}</strong><span style="font-size:11px;color:#888">${m.icon} ${m.label}</span></div>`).join('')}</div>
          <div style="margin-top:32px;display:grid;grid-template-columns:1fr 1fr;gap:16px">
            <div class="box"><div style="font-size:11px;font-weight:800;color:#888;margin-bottom:8px">COMMANDER NOTE</div><p style="font-family:var(--sketch);font-size:1.2rem;line-height:1.4">${D.note}</p></div>
            <div class="box"><div style="font-size:11px;font-weight:800;color:#888;margin-bottom:8px">ACTIVE TARGET</div><p style="font-family:var(--sketch);font-size:1.4rem">${D.target.name}</p><p style="font-size:13px;color:#666;margin-top:8px">${D.target.daysLeft} days · ends ${D.target.end}</p></div>
          </div>
          ${decentNote('Hand-drawn layer = human-first UX. Annotations guide without forcing a corporate dashboard feel.')}
        </div>
      </div>`,
  },

  /* 11 Primitive OS — replaces Notion */
  {
    file: '11.html', title: '11 Primitive OS', inspo: 'Figma shape grid',
    tags: ['primitives', 'modular', 'decentralized'],
    css: `
      .primitive { background:#0d0d0d; color:#ededed; min-height:calc(100vh - 48px); }
      .primitive .app-bar { background:#0d0d0d; border-color:#222; }
      .primitive .layout { max-width:1200px; margin:0 auto; padding:24px; display:grid; grid-template-columns:200px 1fr; gap:24px; }
      .primitive .palette { display:grid; grid-template-columns:repeat(3,1fr); gap:6px; align-content:start; }
      .primitive .shape-btn { aspect-ratio:1; background:#1a1a1a; border:1px solid #333; border-radius:8px; display:grid; place-items:center; font-size:18px; cursor:pointer; transition:border-color 0.15s; }
      .primitive .shape-btn:hover { border-color:var(--accent); }
      .primitive .shape-btn.on { border-color:var(--success); background:color-mix(in srgb,var(--success) 10%,#1a1a1a); }
      .primitive .canvas { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; }
      .primitive .module { background:#1a1a1a; border:1px solid #2a2a2a; border-radius:16px; padding:18px; min-height:160px; display:flex; flex-direction:column; }
      .primitive .module .icon { font-size:24px; margin-bottom:10px; opacity:0.8; }
      .primitive .module h4 { font-size:11px; text-transform:uppercase; letter-spacing:0.1em; color:#888; margin-bottom:8px; }
      .primitive .module .val { font-size:22px; font-weight:800; margin-bottom:4px; }
      .primitive .module p { font-size:11px; color:#888; line-height:1.45; margin-top:auto; }
      .primitive .module.wide { grid-column:span 2; }
      .primitive .module.tall { grid-row:span 2; min-height:332px; }
      @media(max-width:900px){ .primitive .layout{ grid-template-columns:1fr;} .primitive .palette{ grid-template-columns:repeat(6,1fr);} }
    `,
    body: `
      <div class="primitive">
        ${appBar()}${widgetBar()}
        <div class="layout">
          <aside>
            <div style="font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:0.1em;color:#666;margin-bottom:12px">Module palette</div>
            <div class="palette">
              ${['◆','○','△','□','✦','⬡','◎','◐','⬢','◇','✧','◯'].map((s,i) => `<div class="shape-btn${i < 7 ? ' on' : ''}">${s}</div>`).join('')}
            </div>
            <p style="font-size:11px;color:#666;margin-top:16px;line-height:1.5">Drag primitives onto canvas. Each shape = widget slot. Your OS, your grid.</p>
          </aside>
          <main class="canvas">
            <div class="module tall" style="padding:0;overflow:hidden"><div style="transform:scale(0.92);transform-origin:top left;width:109%">${commandCenter()}</div></div>
            <div class="module"><div class="icon">◆</div><h4>Life score</h4><div class="val">${D.lifeScore}</div><p>${D.lifeDelta} · Behav ${D.behavioral}</p></div>
            <div class="module"><div class="icon">○</div><h4>Target</h4><div class="val">${D.target.daysLeft}d</div><p>${D.target.name}</p></div>
            <div class="module wide"><div class="icon">△</div><h4>Week grid</h4>${weekGrid()}</div>
            <div class="module"><div class="icon">□</div><h4>Trajectory</h4><div class="val">${D.trajectory[0].pct}%</div><p>${D.phase}</p></div>
            <div class="module"><div class="icon">✦</div><h4>Finance</h4><div class="val">₹${(D.finance.spent/1000).toFixed(1)}k</div><p>${D.finance.tx} tx</p></div>
            <div class="module wide">${trajectory()}</div>
          </main>
        </div>
      </div>`,
  },

  /* 12 Glass mesh */
  {
    file: '12.html', title: '12 Glass Mesh', inspo: '3D glass resources + Arc spatial',
    tags: ['glass', 'spatial', 'gradient'],
    css: `
      .glass { min-height:calc(100vh - 48px); background:linear-gradient(135deg,#1a1a2e,#16213e 50%,#0f3460); position:relative; overflow:hidden; }
      .glass .app-bar { background:rgba(0,0,0,0.3); border-color:rgba(255,255,255,0.08); position:relative; z-index:2; }
      .glass .blob { position:absolute; border-radius:50%; filter:blur(80px); opacity:0.45; pointer-events:none; }
      .glass .b1{ width:400px;height:400px;background:#ff6b35;top:5%;left:5%; }
      .glass .b2{ width:320px;height:320px;background:#10b981;bottom:10%;right:10%; }
      .glass .b3{ width:260px;height:260px;background:#3b82f6;top:40%;left:40%; }
      .glass .layout { position:relative; z-index:1; max-width:1200px; margin:0 auto; padding:24px; }
      .glass .grid { display:grid; grid-template-columns:repeat(12,1fr); gap:14px; }
      .glass .card { background:rgba(255,255,255,0.06); backdrop-filter:blur(24px); border:1px solid rgba(255,255,255,0.12); border-radius:20px; padding:20px; color:#fff; }
      .glass .card h3 { font-size:10px; text-transform:uppercase; letter-spacing:0.12em; opacity:0.65; margin-bottom:10px; }
      .glass .card .val { font-size:1.75rem; font-weight:800; }
      .glass .card p { font-size:12px; opacity:0.8; line-height:1.5; margin-top:8px; }
      .glass .hero { grid-column:span 8; grid-row:span 2; min-height:280px; display:flex; flex-direction:column; justify-content:flex-end; }
      .glass .hero .val { font-size:2.5rem; }
      .glass .c2{ grid-column:span 4; } .glass .c3{ grid-column:span 4; } .glass .c4{ grid-column:span 4; }
      .glass .c5{ grid-column:span 6; } .glass .c6{ grid-column:span 6; }
      .glass .shapes { display:flex; gap:8px; margin-top:14px; flex-wrap:wrap; }
      .glass .shape { width:36px;height:36px;border:1px solid rgba(255,255,255,0.2);border-radius:10px;display:grid;place-items:center;font-size:14px;background:rgba(255,255,255,0.04); }
      .glass .priority-mini { font-size:12px; padding:8px 0; border-bottom:1px solid rgba(255,255,255,0.08); display:flex; gap:8px; align-items:center; }
      @media(max-width:900px){ .glass .hero,.glass .c2,.glass .c3,.glass .c4,.glass .c5,.glass .c6{ grid-column:span 12;} }
    `,
    body: `
      <div class="glass">
        <div class="blob b1"></div><div class="blob b2"></div><div class="blob b3"></div>
        ${appBar()}${statusStrip()}${widgetBar()}
        <div class="layout">
          <div class="grid">
            <div class="card hero">
              <h3>Your today · ${D.date}</h3>
              <div class="val">${D.target.name}</div>
              <p>${D.target.daysLeft} days left · ${D.priorities[0].text}</p>
              <div class="shapes">${['◆','○','△','✦','⬡','◎'].map(s => `<span class="shape">${s}</span>`).join('')}</div>
            </div>
            <div class="card c2"><h3>Life score</h3><div class="val">${D.lifeScore}</div><p>${D.lifeDelta} · ${D.lifeExplain.slice(0,60)}…</p></div>
            <div class="card c3"><h3>Streak</h3><div class="val">${D.habits[0].streak}d</div><p>${D.habits[0].name} · ${D.habits[0].label}</p></div>
            <div class="card c4"><h3>Execution</h3><div class="val">${D.executionRatio}%</div><p>${D.phase} · ${D.timeLeft}</p></div>
            <div class="card c5">
              <h3>Priorities · ${D.priorities.filter(p=>p.done).length}/${D.priorities.length}</h3>
              ${D.priorities.map(p => `<div class="priority-mini"><span>${p.done?'✓':'○'}</span><span style="${p.done?'opacity:0.5;text-decoration:line-through':''}">${p.text}</span></div>`).join('')}
            </div>
            <div class="card c6">
              <h3>Daily signals</h3>
              <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:8px">${D.dailyLog.map(m => `<div style="text-align:center;font-size:11px"><div style="font-size:16px">${m.icon}</div><strong>${m.val}</strong><div style="opacity:0.6">${m.label}</div></div>`).join('')}</div>
            </div>
            <div class="card" style="grid-column:span 12">${weekGrid()}</div>
            <div class="card" style="grid-column:span 6">${insightCard()}</div>
            <div class="card" style="grid-column:span 6"><h3>Finance · month</h3><div class="val">₹${D.finance.spent.toLocaleString('en-IN')}</div><p>Income ₹${D.finance.income.toLocaleString('en-IN')} · ${Math.round(D.finance.spent/D.finance.budget*100)}% of budget</p></div>
          </div>
        </div>
      </div>`,
  },
];

// Fix D.daysInYear
D.daysInYear = 365;

const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>AIIMIN Today — 12 Prototypes</title>
<link rel="stylesheet" href="shared.css"/>
</head>
<body>
<nav class="proto-nav">
  <strong>AIIMIN</strong>
  <div class="links"><a href="/overview">Live Today page</a><a href="/settings">Design lab</a></div>
  <span class="badge">12 prototypes · v2</span>
</nav>
<div class="gallery">
  <h1>Today page prototypes</h1>
  <p>High-fidelity HTML explorations with real AIIMIN data: Command Center, trajectory, week grid, habits, finance, daily metrics, widget decentralization. Inspired by Figma hero refs — no competitor clones.</p>
  <div class="gallery-grid">
    ${protos.map(p => `
    <a class="gallery-card" href="${p.file}">
      <div class="num">${p.title.split(' ')[0]}</div>
      <h2>${p.title.replace(/^\d+\s/, '')}</h2>
      <p>Full Today surface with live-app data density</p>
      <div class="inspo">${p.inspo}</div>
      <div class="tags">${(p.tags||[]).map(t => `<span>${t}</span>`).join('')}</div>
    </a>`).join('')}
  </div>
</div>
</body>
</html>`;

writeFileSync(join(dir, 'index.html'), indexHtml);
protos.forEach(p => writeFileSync(join(dir, p.file), shell(p.title, p.inspo, p.body, p.css, p.tags)));
console.log('Generated', protos.length + 1, 'rich prototype files');
