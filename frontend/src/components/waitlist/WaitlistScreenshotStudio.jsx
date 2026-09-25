import React, { useEffect, useState } from 'react';
import CommandCenter from '../overview/CommandCenter';
import ReportWorkspace from '../reports/ReportWorkspace';
import FinanceOverview from '../finance/FinanceOverview';
import { DEMO_REPORT, DEMO_REPORT_GEN } from '../../utils/reportDemoFixture';

const DEMO_USER = {
  id: 'guest-capture-01',
  full_name: 'Devansh Verma',
  username: 'devansh',
  email: 'devansh.verma@example.com',
  isGuest: true,
};

const formatCurrency = (amt) => '₹' + Number(amt || 0).toLocaleString('en-IN');

const FINANCE_PROPS = {
  totalNetWorth: 187500,
  returnPct: 12.4,
  monthlyIncome: 85000,
  monthlyExpenses: 34500,
  monthTxCount: 28,
  formatCurrency,
  aiSummaryLoading: false,
  aiSummary: {
    provenance: '100% verified graph',
    observations: ['Monthly savings rate maintained at 59%', 'Runway calculated at 18.5 months'],
    anomalies: []
  },
  savingsRate: 59,
  fiYears: 8.5,
  fiProgressPct: 42,
  totalBalance: 109500,
  totalReturns: 14500,
  financeChecks: [
    { key: 'runway', status: 'pass', label: '18.5 months runway' },
    { key: 'savings', status: 'pass', label: '59% savings rate' }
  ],
  velocityData: [
    { name: 'May', value: 142000 },
    { name: 'Jun', value: 155000 },
    { name: 'Jul', value: 168000 },
    { name: 'Aug', value: 176000 },
    { name: 'Sep', value: 187500 },
  ]
};

function seedLocalStorage() {
  const habits = [
    { id: 'h-1', name: 'Morning Gym Minimum', emoji: '🏋️', category: 'Health' },
    { id: 'h-2', name: '3h Deep Code Block', emoji: '💻', category: 'Career' },
    { id: 'h-3', name: 'Evening Debrief Journal', emoji: '📝', category: 'Mind' },
  ];
  localStorage.setItem('aiimin_habits_v3', JSON.stringify(habits));

  const habitLogs = {};
  const sleepLogs = {};
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    habitLogs[dateStr] = { 'h-1': true, 'h-2': true, 'h-3': true };
    sleepLogs[dateStr] = { hours: 8.2, quality: 5 };
    localStorage.setItem(
      `aiimin_cmd_priorities_${dateStr}`,
      JSON.stringify([
        { id: 1, text: 'Ship 2x Retina screenshot engine for Waitlist OS', done: true },
        { id: 2, text: 'Review 5D Life Score correlation metrics with dev team', done: true },
        { id: 3, text: 'Run 45m gym workout minimum & log evening reflection', done: true },
      ])
    );
    localStorage.setItem(
      `aiimin_cmd_note_${dateStr}`,
      'Shipped the core release today. Feeling grateful, energized and focused.'
    );
  }
  localStorage.setItem('aiimin_habits_logs_v3', JSON.stringify(habitLogs));
  localStorage.setItem('aiimin_sleep_logs', JSON.stringify(sleepLogs));
  localStorage.setItem('aiimin_life_score_prev', '80');
}

export default function WaitlistScreenshotStudio() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    seedLocalStorage();
    setReady(true);
  }, []);

  if (!ready) return <div style={{ color: '#888', padding: '40px' }}>Loading UI Studio...</div>;

  return (
    <div style={{ background: '#121212', padding: '40px', minHeight: '100vh', color: '#f9f9f9', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <h1 style={{ fontSize: '20px', marginBottom: '8px', color: '#749dc4' }}>AIIMIN Original Component UI Capture Studio</h1>
      <p style={{ fontSize: '13px', color: '#888', marginBottom: '32px' }}>
        Rendering actual AIIMIN production React components (`CommandCenter`, `ReportWorkspace`, `FinanceOverview`) for Retina screenshot generation.
      </p>

      {/* ── 1. HERO COMMAND CENTER FRAME ── */}
      <section style={{ marginBottom: '60px' }}>
        <h2 style={{ fontSize: '14px', color: '#888', marginBottom: '12px' }}>1. Hero Command Center (Real AIIMIN Component)</h2>
        <div id="hero-capture" style={{ width: '1200px', background: '#181818', borderRadius: '16px', border: '1px solid #2d2d2d', overflow: 'hidden', boxShadow: '0 24px 60px rgba(0,0,0,0.7)' }}>
          {/* Chrome Top Bar */}
          <div style={{ height: '42px', background: '#222222', borderBottom: '1px solid #2d2d2d', display: 'flex', alignItems: 'center', padding: '0 18px', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <span style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#ff5f56' }} />
              <span style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#ffbd2e' }} />
              <span style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#27c93f' }} />
            </div>
            <div style={{ background: '#181818', border: '1px solid #333', borderRadius: '6px', padding: '4px 18px', fontSize: '11px', color: '#888', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ background: '#2d2d2d', padding: '1px 5px', borderRadius: '3px', fontSize: '10px', color: '#aaa', fontWeight: 700 }}>⌘K</span>
              <span>Jump to Today, Money, Discipline, Score...</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '11px' }}>
              <span style={{ color: '#888', fontFamily: 'monospace' }}>BUILD: v2.0.4</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', fontWeight: 700 }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
                <span>SERVER LHS: LIVE</span>
              </div>
            </div>
          </div>

          {/* Actual Production Composite Grid */}
          <div style={{ padding: '24px', background: '#181818', display: 'grid', gridTemplateColumns: '1.45fr 1fr', gap: '20px', alignItems: 'start' }}>
            {/* Left Col: Real CommandCenter */}
            <div>
              <CommandCenter user={DEMO_USER} />
            </div>

            {/* Right Col: Companion Modules Snapshot */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Card 1: 5D Multi-Domain Radar */}
              <div style={{ background: '#222222', border: '1px solid #2d2d2d', borderRadius: '16px', padding: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '12px' }}>📊</span>
                    <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#888' }}>5D LIFE DOMAINS</span>
                  </div>
                  <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 700 }}>84/100 · Strong</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px', textAlign: 'center' }}>
                  {[
                    { label: 'BODY', score: 82, color: '#ff6b35' },
                    { label: 'MIND', score: 94, color: '#749dc4' },
                    { label: 'DISC', score: 90, color: '#10b981' },
                    { label: 'MONEY', score: 85, color: '#eab308' },
                    { label: 'MOOD', score: 80, color: '#a855f7' }
                  ].map(d => (
                    <div key={d.label} style={{ background: '#1a1a1a', border: '1px solid #2d2d2d', borderRadius: '10px', padding: '8px 4px' }}>
                      <div style={{ fontSize: '14px', fontWeight: 900, color: d.color }}>{d.score}</div>
                      <div style={{ fontSize: '9px', color: '#777', fontWeight: 700, marginTop: '2px' }}>{d.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card 2: Money OS Mini Snapshot */}
              <div style={{ background: '#222222', border: '1px solid #2d2d2d', borderRadius: '16px', padding: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '12px' }}>💰</span>
                    <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#888' }}>MONEY OS</span>
                  </div>
                  <span style={{ fontSize: '11px', color: '#749dc4', fontWeight: 700 }}>18.5 mo runway</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <div>
                    <div style={{ fontSize: '10px', color: '#888', textTransform: 'uppercase', fontWeight: 700 }}>Net Worth</div>
                    <div style={{ fontSize: '22px', fontWeight: 900, color: '#fff', fontFamily: 'monospace' }}>₹1,87,500</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '10px', color: '#888', textTransform: 'uppercase', fontWeight: 700 }}>Savings Rate</div>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: '#10b981', fontFamily: 'monospace' }}>59% (Optimal)</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '12px', marginTop: '12px', paddingTop: '10px', borderTop: '1px dashed #333', fontSize: '11px', color: '#aaa' }}>
                  <span>Income: <strong style={{ color: '#10b981' }}>₹85,000</strong></span>
                  <span>Spent: <strong style={{ color: '#ff6b35' }}>₹34,500</strong></span>
                  <span>Surplus: <strong style={{ color: '#fff' }}>+₹50,500</strong></span>
                </div>
              </div>

              {/* Card 3: Deep Focus Sprint */}
              <div style={{ background: '#222222', border: '1px solid #2d2d2d', borderRadius: '16px', padding: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '12px' }}>⚡</span>
                    <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#888' }}>FOCUS LAB & RECOVERY</span>
                  </div>
                  <span style={{ fontSize: '10px', background: 'rgba(255,107,53,0.15)', color: '#ff6b35', border: '1px solid rgba(255,107,53,0.3)', padding: '2px 8px', borderRadius: '999px', fontWeight: 700 }}>SPRINT ACTIVE</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '8px' }}>
                  <div style={{ background: '#1a1a1a', border: '1px solid #2d2d2d', borderRadius: '10px', padding: '10px' }}>
                    <div style={{ fontSize: '10px', color: '#777', fontWeight: 700 }}>SLEEP RECOVERY</div>
                    <div style={{ fontSize: '15px', fontWeight: 900, color: '#fff', marginTop: '2px' }}>8.2h · 98%</div>
                  </div>
                  <div style={{ background: '#1a1a1a', border: '1px solid #2d2d2d', borderRadius: '10px', padding: '10px' }}>
                    <div style={{ fontSize: '10px', color: '#777', fontWeight: 700 }}>RESTING HRV</div>
                    <div style={{ fontSize: '15px', fontWeight: 900, color: '#749dc4', marginTop: '2px' }}>64ms · Prime</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. THREE REAL SURFACES ── */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '60px', maxWidth: '1080px' }}>
        
        {/* Surface 1: Today Command Center Component */}
        <div>
          <h2 style={{ fontSize: '14px', color: '#888', marginBottom: '12px' }}>2. Today Execution Board (Real Component)</h2>
          <div id="surface-today-capture" style={{ background: '#1a1a1a', border: '1px solid #2d2d2d', borderRadius: '16px', padding: '24px' }}>
            <CommandCenter user={DEMO_USER} />
          </div>
        </div>

        {/* Surface 2: 5D Life Score & Reports Workspace Component */}
        <div>
          <h2 style={{ fontSize: '14px', color: '#888', marginBottom: '12px' }}>3. 5D Life Score & Correlation Lab (Real Component)</h2>
          <div id="surface-score-capture" style={{ background: '#1a1a1a', border: '1px solid #2d2d2d', borderRadius: '16px', padding: '24px' }}>
            <ReportWorkspace report={DEMO_REPORT} reportGen={DEMO_REPORT_GEN} tier="elite" />
          </div>
        </div>

        {/* Surface 3: Money OS Component */}
        <div>
          <h2 style={{ fontSize: '14px', color: '#888', marginBottom: '12px' }}>4. Money OS (Real Component)</h2>
          <div id="surface-money-capture" style={{ background: '#1a1a1a', border: '1px solid #2d2d2d', borderRadius: '16px', padding: '24px' }}>
            <FinanceOverview {...FINANCE_PROPS} />
          </div>
        </div>

      </section>
    </div>
  );
}
