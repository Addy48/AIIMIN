import React, { useCallback, useMemo, useRef, useState } from 'react';
import './tokens.css';
import {
  MIN_LABELS, RAIL_LABELS, PAIRS, CHIP_DEFS,
  SEED_LEDGER, SEED_CAPTURES, SEED_HOLDS, ID_ALTS,
  TIERS, TIER_LABELS,
} from './data';
import { computeScore, scoreDelta, scoreBand, minsLabel, minsPenalty } from './score';
import BottomNav from './components/BottomNav';
import BrandMark from './components/BrandMark';
import DaySheet from './screens/DaySheet';
import LiveScore from './screens/LiveScore';
import Money from './screens/Money';
import Capture from './screens/Capture';
import Lab from './screens/Lab';
import OsId from './screens/OsId';
import Config from './screens/Config';
import Onboarding from './screens/Onboarding';
import EdgeStates from './screens/EdgeStates';

const SCREENS = {
  hero: DaySheet, score: LiveScore, money: Money, cap: Capture,
  lab: Lab, osid: OsId, set: Config, onb: Onboarding, state: EdgeStates,
};

// Dev toolbar jump targets (outside the phone — not part of the design).
const JUMPS = [
  ['onb', 'START'], ['hero', 'DAY'], ['score', 'SCORE'], ['money', 'MONEY'],
  ['cap', 'CAPTURE'], ['lab', 'LAB'], ['osid', 'OS-ID'], ['set', 'CONFIG'], ['state', 'STATES'],
];

const INITIAL = {
  theme: 'dark',
  screen: 'hero',
  moneyTab: 'over',
  mins: [true, true, true, false, false],
  rails: [85, 70, 55],
  rung: 4,
  pair: 0,
  capText: '',
  chips: CHIP_DEFS.map((c) => c.on),
  ledger: SEED_LEDGER,
  captures: SEED_CAPTURES,
  holds: SEED_HOLDS,
  spent: 28410,
  showAction: true,
  reduceMotion: false,
  synced: true,
  chosenId: 'ADIT2K04',
  toast: null,
  lastLedger: null,
  tier: 'pro',
  lifeMode: 'BUILD',
};

export default function DraftingTableApp() {
  const [st, setSt] = useState(INITIAL);
  const toastTimer = useRef(null);

  const merge = useCallback((patch) => setSt((s) => ({ ...s, ...patch })), []);

  const flash = useCallback((msg) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setSt((s) => ({ ...s, toast: msg }));
    toastTimer.current = setTimeout(() => setSt((s) => ({ ...s, toast: null })), 4200);
  }, []);

  const go = useCallback((screen) => merge({ screen }), [merge]);

  const score = computeScore(st.mins, st.rails, st.rung);
  const done = st.mins.filter(Boolean).length;
  const dark = st.theme === 'dark';

  const vm = useMemo(() => {
    const spentPct = Math.min(100, Math.round((st.spent / 34000) * 100)) + '%';
    const p = PAIRS[st.pair];

    return {
      go,
      // Score
      score,
      delta: scoreDelta(score),
      band: scoreBand(score),
      minsLabel: minsLabel(st.mins),
      minsPenalty: minsPenalty(st.mins),

      // Day sheet
      showAction: st.showAction,
      deferAction: () => { merge({ showAction: false }); flash("Deferred to tomorrow's sheet."); },
      minsDone: done,
      minsTotal: st.mins.length,
      mins: MIN_LABELS.map((label, i) => ({
        label,
        done: st.mins[i],
        edge: st.mins[i] ? 'var(--color-accent)' : 'var(--rule)',
        fill: st.mins[i] ? 'var(--color-accent)' : 'transparent',
        color: st.mins[i] ? 'var(--muted)' : 'var(--color-text)',
        line: st.mins[i] ? 'line-through' : 'none',
        toggle: () => {
          const next = st.mins.slice();
          next[i] = !next[i];
          merge({ mins: next });
          flash(next[i] ? 'Marked done · ' + label : 'Reopened · ' + label);
        },
      })),

      // Live score
      rails: RAIL_LABELS.map((label, i) => ({
        label,
        value: st.rails[i],
        pct: st.rails[i] + '%',
        bump: () => {
          const next = st.rails.slice();
          next[i] = next[i] >= 100 ? 40 : next[i] + 5;
          merge({ rails: next });
        },
      })),
      rungs: [1, 2, 3, 4, 5].map((n) => ({
        n,
        h: (18 + n * 9) + 'px',
        bg: n === st.rung ? 'var(--color-accent)' : 'var(--hair)',
        fg: n === st.rung ? 'var(--color-accent)' : 'var(--muted)',
        set: () => { merge({ rung: n }); flash('Day marked ' + n + ' of 5.'); },
      })),
      settleDay: () => flash('Day settled at ' + score + '. Synced to aiimin.in.'),

      // Money
      moneyTab: st.moneyTab,
      setMoneyTab: (t) => merge({ moneyTab: t }),
      safe: Math.max(0, 34000 - st.spent - 4950).toLocaleString('en-IN'),
      spent: st.spent.toLocaleString('en-IN'),
      spentPct,
      ledger: st.ledger.map((t) => ({ ...t, color: t.pos ? 'var(--color-accent)' : 'var(--color-text)' })),
      ledgerCount: st.ledger.length + ' ENTRIES',

      // Capture
      capText: st.capText,
      onCapText: (e) => merge({ capText: e.target.value }),
      hasOffer: st.capText.trim().length > 0,
      chips: CHIP_DEFS.map((c, i) => ({
        label: c.label,
        bg: st.chips[i] ? 'var(--color-accent)' : 'transparent',
        fg: st.chips[i] ? 'var(--color-bg)' : 'var(--muted)',
        edge: st.chips[i] ? 'var(--color-accent)' : 'var(--rule)',
        toggle: () => { const n = st.chips.slice(); n[i] = !n[i]; merge({ chips: n }); },
      })),
      settleCapture: () => {
        const amt = (st.capText.match(/\d[\d,]*/) || ['0'])[0].replace(/,/g, '');
        const val = parseInt(amt, 10) || 0;
        const row = { name: st.capText.slice(0, 24) || 'Untitled capture', meta: 'CAPTURED · UPI · TODAY', amt: '−₹' + val.toLocaleString('en-IN'), pos: false };
        merge({
          ledger: [row].concat(st.ledger),
          captures: [{ label: row.name, time: '21:14' }].concat(st.captures),
          spent: st.spent + val,
          capText: '',
          lastLedger: row,
        });
        flash('Settled · ₹' + val.toLocaleString('en-IN') + ' written to the ledger.');
      },
      driftCapture: () => {
        merge({ holds: [{ label: st.capText.slice(0, 26) }].concat(st.holds), capText: '' });
        flash('Drifted. Kept in hold, nothing committed.');
      },
      preset_food: () => merge({ screen: 'cap', capText: 'paid 1240 swiggy dinner with rohan, felt sluggish after' }),
      preset_journal: () => merge({ capText: 'long day, shipped the sync fix, mind felt clear until evening' }),
      preset_voice: () => flash('Voice capture held · transcribing.'),
      preset_scan: () => flash('Receipt scanned · offer ready in hold.'),
      preset_habit: () => merge({ screen: 'hero' }),
      preset_note: () => merge({ capText: 'note: ask landlord about the August receipt' }),
      holds: st.holds,
      holdLabel: st.holds.length + ' WAITING',
      captures: st.captures,
      capCount: st.captures.length,

      // Lab
      pairs: PAIRS.map((q, i) => ({
        label: q.label, rho: q.rho, q: q.q,
        bg: i === st.pair ? 'var(--tint)' : 'transparent',
        pick: () => merge({ pair: i }),
      })),
      pairLabel: p.full, pairRho: p.rho, pairQ: p.q, pairN: p.n,

      // Config / sync / motion
      syncState: st.synced ? 'LIVE' : 'SYNCING',
      syncMeta: st.synced ? 'LAST 09:37 · 0 PENDING' : 'PUSHING 3 RECORDS…',
      syncNow: () => {
        merge({ synced: false });
        setTimeout(() => { merge({ synced: true }); flash('Synced with aiimin.in · 0 pending.'); }, 1300);
      },
      toggleMotion: () => merge({ reduceMotion: !st.reduceMotion }),
      motionX: st.reduceMotion ? '19px' : '2px',
      motionBg: st.reduceMotion ? 'var(--color-accent)' : 'var(--muted)',
      themeName: dark ? 'Drafting Table' : 'Industry light',
      toggleTheme: () => merge({ theme: dark ? 'light' : 'dark' }),

      // OS-ID / onboarding
      idCells: st.chosenId.split('').map((ch) => ({
        ch,
        fg: /[0-9]/.test(ch) ? 'var(--color-accent)' : 'var(--color-text)',
        bg: 'transparent',
      })),
      alts: ID_ALTS.map((id) => ({
        id,
        edge: id === st.chosenId ? 'var(--color-accent)' : 'var(--hair)',
        fg: id === st.chosenId ? 'var(--color-accent)' : 'var(--color-text)',
        pick: () => merge({ chosenId: id }),
      })),
      chosenId: st.chosenId,
      claimId: () => { merge({ screen: 'hero' }); flash(st.chosenId + ' is yours.'); },
      copyId: () => flash(st.chosenId + ' copied to clipboard.'),

      // Tier (interswitchable in testing)
      tier: st.tier,
      tierLabel: TIER_LABELS[st.tier],

      reduceMotion: st.reduceMotion,

      lifeMode: st.lifeMode,
      setLifeMode: (m) => { merge({ lifeMode: m }); flash('Life mode · ' + m.toLowerCase() + '.'); },

      // Toast
      undo: () => {
        if (st.lastLedger) merge({ ledger: st.ledger.filter((r) => r !== st.lastLedger), lastLedger: null, toast: null });
        else merge({ toast: null });
      },
    };
  }, [st, score, dark, go, merge, flash]);

  const Active = SCREENS[st.screen];

  return (
    <div
      className="dt-root dt-stage"
      data-theme={st.theme}
      data-reduce-motion={st.reduceMotion ? 'true' : 'false'}
    >
      <div style={{ width: 430 }}>
        {/* Dev chrome: brand + theme toggle */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <BrandMark size={18} />
            <span style={{ font: "600 14px 'Barlow Condensed', sans-serif", letterSpacing: '.26em', textTransform: 'uppercase', color: '#e7e7ea' }}>AIIMIN</span>
            <span style={{ font: "400 11px 'JetBrains Mono', monospace", color: '#6b6e73' }}>DRAFTING TABLE</span>
          </div>
          <button
            className="tap"
            onClick={vm.toggleTheme}
            style={{ display: 'flex', alignItems: 'center', gap: 7, font: "600 10px 'Barlow Condensed', sans-serif", letterSpacing: '.16em', padding: '6px 10px', border: '1px solid #34383e', background: 'transparent', color: '#b9bdc4', cursor: 'pointer' }}
          >
            <span style={{ width: 9, height: 9, background: '#749dc4', display: 'block' }} />
            {dark ? 'DARK' : 'LIGHT'}
          </button>
        </div>

        {/* Dev screen jumps */}
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 8 }}>
          {JUMPS.map(([key, label]) => (
            <button
              key={key}
              className="tap"
              onClick={() => go(key)}
              style={{
                font: "600 10.5px 'Barlow Condensed', sans-serif",
                letterSpacing: '.13em',
                padding: '6px 9px',
                border: `1px solid ${st.screen === key ? '#749dc4' : '#2c2f34'}`,
                background: 'transparent',
                color: st.screen === key ? '#749dc4' : '#8b9098',
                cursor: 'pointer',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Dev TIER switcher (interswitchable in testing) */}
        <div style={{ display: 'flex', gap: 4, alignItems: 'center', marginBottom: 12 }}>
          <span style={{ font: "600 10px 'Barlow Condensed', sans-serif", letterSpacing: '.16em', color: '#6b6e73', marginRight: 4 }}>TIER</span>
          {TIERS.map((t) => (
            <button
              key={t}
              className="tap"
              onClick={() => merge({ tier: t })}
              style={{
                font: "600 10px 'Barlow Condensed', sans-serif",
                letterSpacing: '.12em',
                padding: '5px 9px',
                border: `1px solid ${st.tier === t ? '#749dc4' : '#2c2f34'}`,
                background: st.tier === t ? '#1b232c' : 'transparent',
                color: st.tier === t ? '#749dc4' : '#8b9098',
                cursor: 'pointer',
              }}
            >
              {TIER_LABELS[t]}
            </button>
          ))}
        </div>

        {/* Phone frame */}
        <div
          style={{
            position: 'relative',
            width: 390,
            height: 844,
            borderRadius: 44,
            overflow: 'hidden',
            boxShadow: '0 0 0 1px #2c2f34, 0 34px 80px rgba(0,0,0,.6)',
            fontFamily: "Barlow, system-ui, sans-serif",
            background: 'var(--color-bg)',
            color: 'var(--color-text)',
          }}
        >
          {/* Status bar */}
          <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', font: "500 11.5px 'JetBrains Mono', monospace", color: 'var(--muted)', zIndex: 5 }}>
            <span>9:41</span>
            <span style={{ letterSpacing: '.06em' }}>{st.chosenId}</span>
          </div>

          {/* Scroll area */}
          <div className="sc" style={{ position: 'absolute', inset: '44px 0 66px 0', overflow: 'auto' }}>
            <Active vm={vm} />
          </div>

          {/* Toast */}
          {st.toast && (
            <div
              className="toast"
              style={{ position: 'absolute', left: 'var(--space-6)', right: 'var(--space-6)', bottom: 80, zIndex: 8, display: 'flex', alignItems: 'center', gap: 'var(--space-3)', border: '1px solid var(--color-accent)', background: 'var(--color-surface)', padding: '11px var(--space-4)' }}
            >
              <span style={{ width: 8, height: 8, background: 'var(--color-accent)', display: 'block', flex: 'none' }} />
              <span style={{ flex: 1, font: "400 12.5px Barlow, sans-serif" }}>{st.toast}</span>
              <button className="tap" onClick={vm.undo} style={{ font: "600 10.5px 'Barlow Condensed', sans-serif", letterSpacing: '.14em', color: 'var(--color-accent)', background: 'none', border: 'none', cursor: 'pointer' }}>
                UNDO
              </button>
            </div>
          )}

          <BottomNav screen={st.screen} go={go} />
        </div>

        <div style={{ font: "400 11px/1.6 Barlow, sans-serif", color: '#5f6367', marginTop: 14, maxWidth: 390, textWrap: 'pretty' }}>
          Everything here is live: tick minimums and the score recalculates, tap a rail or a rung to mark the day, switch Money tabs, type in Capture to get an Offer, Settle to write it into the ledger with an Undo. Toggle Drafting Table dark ↔ the light Industry sheet, and flip the TIER to check gating.
        </div>
      </div>
    </div>
  );
}
