import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  PenLine,
  Wallet,
  Target,
  Sparkles,
  ArrowRight,
  LayoutTemplate,
  Layers,
} from 'lucide-react';
import './captureJ0Prototypes.css';

const TILES = [
  { label: 'Log a Habit', Icon: CheckCircle2, hint: 'Habits' },
  { label: 'Journal Entry', Icon: PenLine, hint: 'Journal' },
  { label: 'Track Expense', Icon: Wallet, hint: 'Finance' },
  { label: 'Add Goal', Icon: Target, hint: 'Goals' },
];

function ProtoMasthead() {
  return (
    <header className="cj0-masthead" aria-hidden>
      <div className="cj0-masthead__brand">AIIMIN</div>
      <nav className="cj0-masthead__links">
        {['Today', 'Habits', 'Goals', 'Journal', 'Finance', 'Calendar', 'More'].map((l) => (
          <span key={l} className={`cj0-masthead__link${l === 'Today' ? ' is-active' : ''}`}>{l}</span>
        ))}
      </nav>
      <div className="cj0-masthead__avatar">A</div>
    </header>
  );
}

function ProtoInsight() {
  return (
    <section className="cj0-insight">
      <p className="cj0-eyebrow">Weekly insight</p>
      <h2 className="cj0-insight__title">Today needs a clean reset.</h2>
      <p className="cj0-insight__body">
        Your week is quiet. Capture one signal, then pick the outcome that makes today count.
      </p>
    </section>
  );
}

function ProtoLogger({ labeled }) {
  return (
    <div className="cj0-logger">
      <div className="cj0-logger__head">
        <div className="cj0-logger__icon" aria-hidden>
          <Sparkles size={16} strokeWidth={2} />
        </div>
        <div>
          <div className="cj0-logger__title">Universal Logger</div>
          {labeled ? (
            <div className="cj0-logger__sub">Describe it — AI sorts habits, journal, mood, money</div>
          ) : (
            <div className="cj0-logger__sub">AI-powered · speak naturally</div>
          )}
        </div>
      </div>
      <div className="cj0-logger__box">
        <p className="cj0-logger__placeholder">
          Worked out for 45 mins, feeling great. 8/10 today.
        </p>
        <div className="cj0-logger__bar">
          <span>Press Enter or click →</span>
          <button type="button" className="cj0-logger__send" tabIndex={-1}>
            Log <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

function ProtoTiles({ labeled }) {
  return (
    <div className="cj0-tiles">
      <div className="cj0-section-head">
        <div>
          <p className="cj0-eyebrow">Quick Capture</p>
          {labeled && (
            <p className="cj0-section-purpose">Tap a destination — no typing needed</p>
          )}
        </div>
        <span className="cj0-section-link">Smart Log</span>
      </div>
      <div className="cj0-tiles__grid">
        {TILES.map(({ label, Icon }) => (
          <div key={label} className="cj0-tile">
            <Icon size={22} strokeWidth={1.75} className="cj0-tile__icon" />
            <span className="cj0-tile__label">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProtoRest() {
  return (
    <div className="cj0-rest" aria-hidden>
      <div className="cj0-card">
        <p className="cj0-eyebrow">Micro task</p>
        <p className="cj0-card__title">Ship one closed loop before lunch</p>
      </div>
      <div className="cj0-card">
        <p className="cj0-eyebrow">Command timeline</p>
        <div className="cj0-timeline">
          {['09', '11', '13', '15', '17'].map((t) => (
            <span key={t} className="cj0-timeline__slot">{t}:00</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function TodayPageShell({ option }) {
  const isA = option === 'A';
  return (
    <div className="cj0-today">
      <ProtoMasthead />
      <main className="cj0-today__main">
        <div className="cj0-today__intro">
          <p className="cj0-eyebrow">Tuesday · Today</p>
          <h1 className="cj0-today__h1">Good evening, Adi</h1>
        </div>
        <ProtoInsight />

        <section className="cj0-capture" aria-label="Capture fold prototype">
          <div className="cj0-capture__label-row">
            <span className="cj0-capture__kicker">Capture fold</span>
            <span className={`cj0-pill cj0-pill--${isA ? 'a' : 'b'}`}>
              Option {option}
            </span>
          </div>

          {isA ? (
            <>
              <p className="cj0-capture__thesis">
                One surface. Describe the day — AI routes to habits, journal, mood, expense, goals.
                Quick Capture tiles removed from this fold.
              </p>
              <ProtoLogger labeled={false} />
            </>
          ) : (
            <>
              <p className="cj0-capture__thesis">
                Two surfaces, two jobs. Tiles = zero typing jump. Logger = freeform AI sort.
              </p>
              <ProtoTiles labeled />
              <ProtoLogger labeled />
            </>
          )}
        </section>

        <ProtoRest />
      </main>
    </div>
  );
}

/**
 * J0 Capture consolidation prototypes — full Today page shells for A vs B.
 * Prototypes only. Does not change live Overview widgets.
 */
export default function CaptureJ0Prototypes({ embedded = false }) {
  const [option, setOption] = useState('A');

  return (
    <div className={`cj0-root${embedded ? ' cj0-root--embedded' : ''}`}>
      <div className="cj0-controls">
        <div className="cj0-controls__copy">
          <p className="cj0-eyebrow">Craft · Track J0</p>
          <h1 className="cj0-controls__title">Capture fold prototypes</h1>
          <p className="cj0-controls__sub">
            Pick the Today fold that feels clearer. Live Overview is unchanged until you decide.
          </p>
        </div>
        <div className="cj0-controls__actions" role="tablist" aria-label="Prototype option">
          <button
            type="button"
            role="tab"
            aria-selected={option === 'A'}
            className={`cj0-tab${option === 'A' ? ' is-active' : ''}`}
            onClick={() => setOption('A')}
          >
            <LayoutTemplate size={16} />
            A · Logger only
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={option === 'B'}
            className={`cj0-tab${option === 'B' ? ' is-active' : ''}`}
            onClick={() => setOption('B')}
          >
            <Layers size={16} />
            B · Tiles + Logger
          </button>
          {!embedded && (
            <Link to="/account?section=design" className="cj0-back">
              Design Lab
            </Link>
          )}
          {embedded && (
            <Link to="/design/capture-j0" className="cj0-back">
              Open full page
            </Link>
          )}
        </div>
        <div className="cj0-decision">
          <div className={`cj0-decision__card${option === 'A' ? ' is-focus' : ''}`}>
            <strong>A</strong>
            <span>Deprecate Quick Capture tiles. One AI logger owns the fold.</span>
          </div>
          <div className={`cj0-decision__card${option === 'B' ? ' is-focus' : ''}`}>
            <strong>B</strong>
            <span>Keep both. Labels make jobs distinct (tap vs describe).</span>
          </div>
        </div>
      </div>

      <div className="cj0-stage" data-option={option}>
        <TodayPageShell option={option} />
      </div>
    </div>
  );
}
