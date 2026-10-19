import React from 'react';
import { Blueprint } from '../components/Blueprint';
import { ScreenHead, SectionRule, F } from '../components/ui';

const LEGEND = [
  ['Rent', '₹12,000', 'var(--color-accent)'],
  ['Food', '₹7,560', 'var(--muted)'],
  ['Transport', '₹1,910', 'var(--rule)'],
  ['Subs', '₹1,438', 'var(--tint)'],
];
const WOW = [
  ['W27', 38, 'var(--hair)', 'var(--muted)'],
  ['W28', 46, 'var(--hair)', 'var(--muted)'],
  ['W29', 52, 'var(--rule)', 'var(--muted)'],
  ['W30', 41, 'var(--rule)', 'var(--muted)'],
  ['W31', 36, 'var(--color-accent)', 'var(--color-accent)'],
];
const ALLOC = [
  ['FOOD & DELIVERY', '7,560 / 9,000', 84, 'var(--color-accent)'],
  ['RENT', '12,000 / 12,000', 100, 'var(--muted)'],
  ['TRANSPORT', '1,910 / 4,000', 48, 'var(--rule)'],
  ['SUBSCRIPTIONS', '1,438 / 1,500', 96, 'var(--color-accent)'],
  ['SAVINGS', '5,000 / 5,000', 100, 'var(--muted)'],
];
const UPCOMING = [
  ['Rent · landlord', '05 AUG · AUTOPAY', '₹12,000'],
  ['Jio postpaid', '09 AUG · AUTOPAY', '₹399'],
  ['Gym · cult.fit', '12 AUG · CARD', '₹1,499'],
  ['Spotify', '14 AUG · AUTOPAY', '₹119'],
];

function Tab({ label, active, onClick }) {
  return (
    <button
      className="tap"
      onClick={onClick}
      style={{
        border: 'none',
        borderRight: '1px solid var(--hair)',
        padding: '9px 0',
        font: "600 10.5px 'Barlow Condensed', sans-serif",
        letterSpacing: '.14em',
        cursor: 'pointer',
        color: active ? 'var(--color-accent)' : 'var(--muted)',
        background: active ? 'var(--tint)' : 'transparent',
      }}
    >
      {label}
    </button>
  );
}

export default function Money({ vm }) {
  const tab = vm.moneyTab;
  return (
    <div className="scr" style={{ padding: '6px var(--space-6) 28px' }}>
      <ScreenHead title="MONEY · AUGUST" meta="SHEET 03" />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', border: '1px solid var(--hair)', borderRight: 'none', marginTop: 'var(--space-4)' }}>
        <Tab label="OVERVIEW" active={tab === 'over'} onClick={() => vm.setMoneyTab('over')} />
        <Tab label="BUDGETS" active={tab === 'bud'} onClick={() => vm.setMoneyTab('bud')} />
        <Tab label="LEDGER" active={tab === 'led'} onClick={() => vm.setMoneyTab('led')} />
      </div>

      {tab === 'over' && (
        <div>
          <Blueprint legend="SAFE TO SPEND · TODAY" style={{ marginTop: 'var(--space-6)', padding: 'var(--space-6) var(--space-4) var(--space-4)' }}>
            <div className="fig" key={vm.safe} style={{ font: "700 56px/.88 'JetBrains Mono', monospace", letterSpacing: '-.04em' }}>
              ₹{vm.safe}
            </div>
            <div style={{ display: 'flex', height: 8, marginTop: 'var(--space-4)', border: '1px solid var(--rule)' }}>
              <i style={{ background: 'var(--color-accent)', display: 'block', width: vm.spentPct }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', ...F.mono(10), color: 'var(--muted)', marginTop: 5 }}>
              <span>₹{vm.spent} SPENT</span>
              <span>₹34,000 BUDGET</span>
            </div>
          </Blueprint>

          <SectionRule label="CATEGORY BREAKDOWN · MTD" />
          <div style={{ display: 'flex', height: 26, marginTop: 'var(--space-3)', border: '1px solid var(--rule)' }}>
            <i style={{ width: '42%', background: 'var(--color-accent)', display: 'block' }} />
            <i style={{ width: '27%', background: 'var(--muted)', display: 'block' }} />
            <i style={{ width: '14%', background: 'var(--rule)', display: 'block' }} />
            <i style={{ width: '9%', background: 'var(--tint)', borderLeft: '1px solid var(--rule)', display: 'block' }} />
            <i style={{ width: '8%', background: 'transparent', borderLeft: '1px solid var(--rule)', display: 'block' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 'var(--space-4)', marginTop: 'var(--space-3)' }}>
            {LEGEND.map(([name, amt, sw]) => (
              <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '4px 0' }}>
                <i style={{ width: 9, height: 9, background: sw, border: sw === 'var(--tint)' ? '1px solid var(--rule)' : 'none', display: 'block' }} />
                <span style={{ ...F.body(12), flex: 1 }}>{name}</span>
                <span style={{ ...F.mono(11.5, 500), color: 'var(--muted)' }}>{amt}</span>
              </div>
            ))}
          </div>

          <SectionRule label="WEEK OVER WEEK" value="−12.4%" />
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 56, marginTop: 'var(--space-3)' }}>
            {WOW.map(([lbl, h, bar, fg]) => (
              <div key={lbl} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <i style={{ width: '100%', height: h, background: bar, display: 'block' }} />
                <span style={{ ...F.mono(9), color: fg }}>{lbl}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', border: '1px solid var(--hair)', borderRight: 'none', marginTop: 'var(--space-6)' }}>
            <div style={{ borderRight: '1px solid var(--hair)', padding: 'var(--space-3)' }}>
              <div style={F.cellLabel}>NET WORTH</div>
              <div style={{ font: "700 19px/1 'JetBrains Mono', monospace", marginTop: 4 }}>₹3,42,180</div>
              <div style={{ ...F.mono(10), color: 'var(--color-accent)' }}>+₹8,400 MoM</div>
            </div>
            <div style={{ borderRight: '1px solid var(--hair)', padding: 'var(--space-3)' }}>
              <div style={F.cellLabel}>RECEIVABLE</div>
              <div style={{ font: "700 19px/1 'JetBrains Mono', monospace", marginTop: 4 }}>₹2,500</div>
              <div style={{ ...F.mono(10), color: 'var(--muted)' }}>ROHAN · 11d</div>
            </div>
          </div>
        </div>
      )}

      {tab === 'bud' && (
        <div>
          <div style={{ marginTop: 'var(--space-6)', ...F.sectionLabel }}>ALLOCATIONS</div>
          <div style={{ marginTop: 'var(--space-3)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {ALLOC.map(([name, val, pct, bar]) => (
              <div key={name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', ...F.body(12.5) }}>
                  <span>{name}</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", color: 'var(--muted)' }}>{val}</span>
                </div>
                <div style={{ display: 'flex', height: 7, border: '1px solid var(--rule)', marginTop: 5 }}>
                  <i style={{ width: `${pct}%`, background: bar, display: 'block' }} />
                </div>
              </div>
            ))}
          </div>
          <SectionRule label="UPCOMING · NEXT 14 DAYS" />
          <div style={{ marginTop: 'var(--space-2)' }}>
            {UPCOMING.map(([name, meta, amt], i, arr) => (
              <div
                key={name}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '9px 0',
                  borderBottom: i < arr.length - 1 ? '1px solid var(--hair)' : 'none',
                }}
              >
                <span>
                  <span style={{ display: 'block', ...F.body(13) }}>{name}</span>
                  <span style={{ display: 'block', ...F.mono(10), color: 'var(--muted)' }}>{meta}</span>
                </span>
                <span style={F.mono(13, 500)}>{amt}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'led' && (
        <div>
          <SectionRule label="LEDGER" value={vm.ledgerCount} />
          <div style={{ marginTop: 'var(--space-2)' }}>
            {vm.ledger.map((t, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid var(--hair)' }}>
                <span>
                  <span style={{ display: 'block', ...F.body(13.5) }}>{t.name}</span>
                  <span style={{ display: 'block', ...F.mono(10), color: 'var(--muted)' }}>{t.meta}</span>
                </span>
                <span style={{ ...F.mono(13.5, 500), color: t.color }}>{t.amt}</span>
              </div>
            ))}
          </div>
          <button
            className="tap"
            onClick={() => vm.go('cap')}
            style={{
              width: '100%',
              marginTop: 'var(--space-6)',
              font: "600 12.5px 'Barlow Condensed', sans-serif",
              letterSpacing: '.14em',
              textTransform: 'uppercase',
              color: 'var(--color-accent)',
              background: 'transparent',
              border: '1px solid var(--rule)',
              borderRadius: 'var(--radius-md)',
              padding: 12,
              cursor: 'pointer',
            }}
          >
            + ADD A TRANSACTION
          </button>
        </div>
      )}
    </div>
  );
}
