import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { API_URL } from '../../utils/api';
import toast from '../../utils/toast';
import {
  OPEN_LOGGER_EVENT,
  loggerShortcutLabel,
} from '../../utils/loggerShortcut';
import '../../styles/todayCapture.css';

const EXAMPLES = [
  'Worked out for 45 mins, feeling great. 8/10 today.',
  'Skipped gym, ate junk food. Mood 4/10.',
  '3 hours of deep focus. Diet on track. Energy 9/10.',
  'Slept 9 hours, meditated. Feeling 7/10.',
  'Spent ₹420 on groceries. Mood 6.',
];

const DESTINATIONS = [
  { to: '/habits', label: 'Habits' },
  { to: '/journal', label: 'Journal' },
  { to: '/finance', label: 'Finance' },
  { to: '/goals', label: 'Goals' },
];

const STATES = {
  idle: 'idle',
  thinking: 'thinking',
  success: 'success',
  error: 'error',
};

function actionLabel(action) {
  if (action.type === 'log_mood') return `Mood logged: ${action.score}/10`;
  if (action.type === 'log_habit') {
    return `${action.name}: ${action.completed ? 'Completed' : 'Skipped'}`;
  }
  if (action.type === 'add_journal') return 'Saved to journal';
  if (action.type === 'log_discipline') {
    return `Discipline: ${action.reset ? 'Reset' : 'Maintained'}`;
  }
  if (action.type === 'log_expense' || action.type === 'add_expense') {
    return action.name || 'Expense logged';
  }
  return action.type;
}

/**
 * Sole Today-fold capture surface (J0 = A).
 * Speaks naturally → AI sorts habits / mood / journal / money.
 */
export default function UniversalLogger({ onSuccess }) {
  const [text, setText] = useState('');
  const [state, setState] = useState(STATES.idle);
  const [results, setResults] = useState([]);
  const [exampleIdx, setExampleIdx] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    const onOpen = (event) => {
      inputRef.current?.focus({ preventScroll: true });
      if (event?.detail?.focusAiLog) {
        inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    };
    window.addEventListener(OPEN_LOGGER_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_LOGGER_EVENT, onOpen);
  }, []);

  const placeholder = EXAMPLES[exampleIdx % EXAMPLES.length];

  const handleSubmit = async () => {
    if (!text.trim() || state === STATES.thinking) return;
    setState(STATES.thinking);
    try {
      const response = await fetch(`${API_URL}/intelligence/universal-log`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text.trim() }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed');
      setResults(data.actions || []);
      setState(STATES.success);
      setText('');
      toast.success('Logged');
      if (onSuccess) onSuccess(data.actions);
      setTimeout(() => {
        setState(STATES.idle);
        setResults([]);
        setExampleIdx((i) => i + 1);
      }, 3200);
    } catch (err) {
      console.error('Universal log error:', err);
      setState(STATES.error);
      toast.error(err.message || 'Failed to process entry');
      setTimeout(() => setState(STATES.idle), 2200);
    }
  };

  const boxState =
    state === STATES.thinking
      ? 'is-thinking'
      : state === STATES.success
        ? 'is-success'
        : state === STATES.error
          ? 'is-error'
          : '';

  const hint =
    state === STATES.thinking
      ? 'Sorting into habits, mood, journal…'
      : state === STATES.success
        ? 'Done — keep going or open a section below'
        : 'Enter to log · Shift+Enter for newline';

  return (
    <section className="today-capture" aria-label="Today capture">
      <div className="today-capture__head">
        <div className="today-capture__identity">
          <div className="today-capture__mark" aria-hidden>
            <Sparkles size={18} strokeWidth={2} />
          </div>
          <div>
            <p className="today-capture__eyebrow">Capture</p>
            <h2 className="today-capture__title">Tell AIIMIN what happened</h2>
            <p className="today-capture__sub">
              One box. Describe your day — habits, mood, journal, money. AI sorts it.
            </p>
          </div>
        </div>
        <span className="today-capture__chord" title="Global shortcut">
          {loggerShortcutLabel()}
        </span>
      </div>

      <div className={`today-capture__box ${boxState}`.trim()}>
        <textarea
          ref={inputRef}
          className="today-capture__textarea"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={placeholder}
          disabled={state === STATES.thinking}
          aria-label="Describe what to log"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey && text.trim()) {
              e.preventDefault();
              handleSubmit();
            }
          }}
        />
        <div className="today-capture__bar">
          <span className="today-capture__hint">{hint}</span>
          <button
            type="button"
            className="today-capture__submit"
            onClick={handleSubmit}
            disabled={!text.trim() || state === STATES.thinking}
          >
            {state === STATES.thinking ? 'Logging…' : (
              <>
                Log
                <ArrowRight size={14} strokeWidth={2.5} />
              </>
            )}
          </button>
        </div>
      </div>

      {state === STATES.success && results.length > 0 && (
        <div className="today-capture__results" role="status">
          {results.map((action, i) => (
            <div
              key={`${action.type}-${i}`}
              className={`today-capture__result${action.status === 'success' ? '' : ' is-warn'}`}
            >
              {actionLabel(action)}
            </div>
          ))}
        </div>
      )}

      <div className="today-capture__dest">
        <span className="today-capture__dest-label">Need a full page</span>
        {DESTINATIONS.map((d) => (
          <Link key={d.to} to={d.to}>
            {d.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
