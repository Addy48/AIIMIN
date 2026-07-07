import React, { useState } from 'react';
import { Bell, Sun, ChevronDown, LayoutGrid, Target, BookOpen, Wallet, Calendar, FlaskConical } from 'lucide-react';
import {
  NAV_ALL,
  NAV_PRIMARY,
  NAV_MORE,
  tokensToStyle,
} from './prototypeTokens';
import { PrototypeFrame, ProtoMark, ProtoWordmark, PageSnippet } from './PrototypePrimitives';

const CMD_ICONS = {
  Today: LayoutGrid,
  Habits: Target,
  Goals: Target,
  Journal: BookOpen,
  Finance: Wallet,
  Calendar,
  Lab: FlaskConical,
};

function NavActions({ tokens, showStatus = true }) {
  return (
    <div className="proto-nav__actions">
      {showStatus && (
        <div className="proto-nav__status">
          <span className="proto-nav__status-dot" />
          OS Online
        </div>
      )}
      <div className="proto-nav__icon-btn" aria-hidden>
        <Sun size={16} />
      </div>
      <div className="proto-nav__icon-btn" aria-hidden>
        <Bell size={16} />
      </div>
      <div className="proto-nav__avatar" style={{ background: tokens['--proto-logo-bg'] }}>
        G
      </div>
    </div>
  );
}

/** Live production layout: 3-col flex, 12 links, pill active, glass, OS Online */
export function NavbarCurrent({ tokens, active = 'Today' }) {
  return (
    <PrototypeFrame tokens={tokens} rounded={false}>
      <div className="proto-scroll">
        <div className="proto-scroll-inner">
          <nav className="proto-nav proto-nav--glass" style={tokensToStyle(tokens)}>
            <div style={{ flex: 1, display: 'flex' }}>
              <span className="proto-nav__brand" style={{ borderRight: 'none', paddingRight: 0 }}>
                <ProtoMark tokens={tokens} />
                <ProtoWordmark />
              </span>
            </div>
            <div className="proto-nav__links">
              {NAV_ALL.map((label) => (
                <span
                  key={label}
                  className={`proto-nav__link ${label === active ? 'proto-nav__link--pill-active' : ''}`}
                >
                  {label}
                </span>
              ))}
            </div>
            <NavActions tokens={tokens} />
          </nav>
          <PageSnippet tokens={tokens} titleStyle="serif" />
        </div>
      </div>
    </PrototypeFrame>
  );
}

/** Masthead: brand zone + hairline, 4 primary + More, underline active, 68px, no status pill */
export function NavbarMasthead({ tokens, active = 'Today' }) {
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <PrototypeFrame tokens={tokens} rounded={false}>
      <div className="proto-scroll">
        <div className="proto-scroll-inner">
          <nav className="proto-nav">
            <span className="proto-nav__brand">
              <ProtoMark tokens={tokens} />
              <ProtoWordmark />
            </span>
            <div className="proto-nav__links" style={{ justifyContent: 'flex-start', paddingLeft: 8 }}>
              {NAV_PRIMARY.map((label) => (
                <span
                  key={label}
                  className={`proto-nav__link ${label === active ? 'proto-nav__link--underline-active' : ''}`}
                >
                  {label}
                </span>
              ))}
              <button
                type="button"
                className="proto-nav__link proto-nav__more"
                onClick={() => setMoreOpen((o) => !o)}
                style={{
                  color: moreOpen ? tokens['--proto-accent'] : undefined,
                  fontWeight: moreOpen ? 700 : 500,
                }}
              >
                More
                <ChevronDown size={14} style={{ transform: moreOpen ? 'rotate(180deg)' : 'none', transition: 'transform 160ms ease-out' }} />
              </button>
            </div>
            <NavActions tokens={tokens} showStatus={false} />
          </nav>
          {moreOpen && (
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 6,
                padding: '10px 20px 12px',
                borderBottom: `1px solid ${tokens['--proto-border']}`,
                background: tokens['--proto-surface'],
              }}
            >
              {NAV_MORE.map((label) => (
                <span
                  key={label}
                  className="proto-nav__link"
                  style={{
                    fontSize: 13,
                    padding: '6px 10px',
                    background: tokens['--proto-elevated'],
                    borderRadius: 8,
                  }}
                >
                  {label}
                </span>
              ))}
            </div>
          )}
          <PageSnippet tokens={tokens} titleStyle="sans" showEyebrow={false} />
        </div>
      </div>
    </PrototypeFrame>
  );
}

/** Command bar: mark only, icon+label for 6 items, text for rest, 64px */
export function NavbarCommandBar({ tokens, active = 'Today' }) {
  const primary = ['Today', 'Habits', 'Goals', 'Journal', 'Finance', 'Calendar'];
  const rest = NAV_ALL.filter((l) => !primary.includes(l));

  return (
    <PrototypeFrame tokens={tokens} rounded={false}>
      <div className="proto-scroll">
        <div className="proto-scroll-inner">
          <nav className="proto-nav" style={{ ...tokensToStyle(tokens), '--proto-nav-h': '64px', height: 64 }}>
            <span className="proto-nav__brand" style={{ borderRight: 'none', paddingRight: 8 }}>
              <ProtoMark tokens={tokens} size={30} />
            </span>
            <div className="proto-nav__links" style={{ justifyContent: 'flex-start', gap: 0 }}>
              {primary.map((label) => {
                const Icon = CMD_ICONS[label] || LayoutGrid;
                const isActive = label === active;
                return (
                  <span
                    key={label}
                    className={`proto-nav__link proto-nav__link--cmd ${isActive ? 'proto-nav__link--underline-active' : ''}`}
                    style={isActive ? { color: tokens['--proto-accent'] } : undefined}
                  >
                    <Icon size={16} />
                    {label}
                  </span>
                );
              })}
              {rest.map((label) => (
                <span key={label} className="proto-nav__link" style={{ fontSize: 13 }}>
                  {label}
                </span>
              ))}
            </div>
            <NavActions tokens={tokens} showStatus={false} />
          </nav>
          <PageSnippet tokens={tokens} titleStyle="sans" showEyebrow={false} />
        </div>
      </div>
    </PrototypeFrame>
  );
}

export function NavbarComparisonPanel({ darkTokens, lightTokens, variant = 'masthead' }) {
  const [mode, setMode] = useState('dark');
  const tokens = mode === 'dark' ? darkTokens : lightTokens;
  const Nav = variant === 'current' ? NavbarCurrent : variant === 'command' ? NavbarCommandBar : NavbarMasthead;

  return (
    <>
      <div className="design-lab__select-row">
        {['dark', 'light'].map((m) => (
          <button
            key={m}
            type="button"
            className={`design-lab__chip-btn ${mode === m ? 'is-active' : ''}`}
            onClick={() => setMode(m)}
          >
            {m === 'dark' ? 'Proposed dark' : 'Proposed light'}
          </button>
        ))}
      </div>
      <Nav tokens={tokens} />
    </>
  );
}
