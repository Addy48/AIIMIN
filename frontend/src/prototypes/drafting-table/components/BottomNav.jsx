import React from 'react';
import { LineChart, Wallet, Plus, FlaskConical, SlidersHorizontal } from 'lucide-react';

// Five tabs: DAY · MONEY · CAPTURE · LAB · CONFIG. Active tab full opacity,
// the rest at 0.4 (matches the prototype's op_* behaviour).
const TABS = [
  { key: 'hero', label: 'DAY', Icon: LineChart },
  { key: 'money', label: 'MONEY', Icon: Wallet },
  { key: 'cap', label: 'CAPTURE', Icon: Plus },
  { key: 'lab', label: 'LAB', Icon: FlaskConical },
  { key: 'set', label: 'CONFIG', Icon: SlidersHorizontal },
];

export default function BottomNav({ screen, go }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 66,
        background: 'var(--color-bg)',
        borderTop: '1px solid var(--rule)',
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        alignItems: 'center',
        zIndex: 6,
      }}
    >
      {TABS.map(({ key, label, Icon }) => (
        <button
          key={key}
          className="tap"
          onClick={() => go(key)}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 5,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            opacity: screen === key ? 1 : 0.4,
          }}
        >
          <Icon size={18} strokeWidth={1.5} color="var(--color-text)" />
          <span
            style={{
              font: "600 9px 'Barlow Condensed', sans-serif",
              letterSpacing: '.14em',
              color: 'var(--color-text)',
            }}
          >
            {label}
          </span>
        </button>
      ))}
    </div>
  );
}
