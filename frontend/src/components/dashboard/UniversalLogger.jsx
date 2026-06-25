import React, { useState, useRef } from 'react';
import { getCurrentAccessToken, API_URL } from '../../utils/api';
import toast from '../../utils/toast';

const EXAMPLES = [
  "Worked out for 45 mins, feeling great. 8/10 today.",
  "Skipped gym, ate junk food. Mood 4/10.",
  "3 hours of deep focus. Diet on track. Energy 9/10.",
  "Slept 9 hours, meditated. Feeling 7/10.",
];

const STATES = {
  idle: 'idle',
  thinking: 'thinking',
  success: 'success',
  error: 'error',
};

export default function UniversalLogger({ onSuccess }) {
  const [text, setText] = useState('');
  const [state, setState] = useState(STATES.idle);
  const [results, setResults] = useState([]);
  const [exampleIdx, setExampleIdx] = useState(0);
  const inputRef = useRef(null);

  const placeholder = EXAMPLES[exampleIdx % EXAMPLES.length];

  const handleSubmit = async () => {
    if (!text.trim() || state === STATES.thinking) return;
    setState(STATES.thinking);
    try {
      const token = await getCurrentAccessToken();
      const response = await fetch(`${API_URL}/intelligence/universal-log`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ text: text.trim() }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed');
      setResults(data.actions || []);
      setState(STATES.success);
      setText('');
      toast.success('AI logged your entry!');
      if (onSuccess) onSuccess(data.actions);
      // Reset to idle after 3 seconds
      setTimeout(() => {
        setState(STATES.idle);
        setResults([]);
        setExampleIdx(i => i + 1);
      }, 3000);
    } catch (err) {
      console.error('Universal log error:', err);
      setState(STATES.error);
      toast.error(err.message || 'Failed to process entry');
      setTimeout(() => setState(STATES.idle), 2000);
    }
  };

  const actionEmoji = (type) => {
    if (type === 'log_mood') return '😊';
    if (type === 'log_habit') return '✅';
    if (type === 'add_journal') return '📝';
    if (type === 'log_discipline') return '🔁';
    return '⚡';
  };

  const actionLabel = (action) => {
    if (action.type === 'log_mood') return `Mood logged: ${action.score}/10`;
    if (action.type === 'log_habit') return `${action.name}: ${action.completed ? 'Completed ✓' : 'Skipped ✗'}`;
    if (action.type === 'add_journal') return 'Saved to journal';
    if (action.type === 'log_discipline') return `Discipline: ${action.reset ? 'Reset' : 'Maintained'}`;
    return action.type;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
        <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>✨</div>
        <div>
          <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--color-text-1)', lineHeight: 1 }}>Universal Logger</div>
          <div style={{ fontSize: '10px', color: 'var(--color-text-3)', fontWeight: 600 }}>AI-powered · speak naturally</div>
        </div>
      </div>

      {/* Input */}
      <div style={{
        background: 'var(--color-elevated)', borderRadius: '14px',
        border: `1.5px solid ${state === STATES.thinking ? '#6366f1' : state === STATES.success ? '#10B981' : state === STATES.error ? '#ef4444' : 'var(--color-border)'}`,
        transition: 'border-color 0.2s', overflow: 'hidden',
        boxShadow: state === STATES.thinking ? '0 0 0 3px rgba(99,102,241,0.12)' : state === STATES.success ? '0 0 0 3px rgba(16,185,129,0.12)' : 'none',
      }}>
        <textarea
          ref={inputRef}
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder={placeholder}
          disabled={state === STATES.thinking}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey && text.trim()) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          style={{
            width: '100%', minHeight: '72px', padding: '12px 14px',
            background: 'transparent', border: 'none', outline: 'none',
            color: 'var(--color-text-1)', fontSize: '13px', lineHeight: 1.5,
            fontFamily: 'inherit', resize: 'none', boxSizing: 'border-box',
            opacity: state === STATES.thinking ? 0.6 : 1,
          }}
        />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 10px 10px', borderTop: '1px solid var(--color-border)' }}>
          <span style={{ fontSize: '10px', color: 'var(--color-text-3)', fontWeight: 500 }}>
            {state === STATES.thinking ? '🤖 Thinking...' : state === STATES.success ? '✓ Done!' : 'Press Enter or click →'}
          </span>
          <button
            onClick={handleSubmit}
            disabled={!text.trim() || state === STATES.thinking}
            style={{
              padding: '6px 14px', borderRadius: '8px', border: 'none', cursor: text.trim() && state === STATES.idle ? 'pointer' : 'default',
              background: text.trim() && state === STATES.idle ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'var(--color-border)',
              color: text.trim() && state === STATES.idle ? '#fff' : 'var(--color-text-3)',
              fontSize: '12px', fontWeight: 700, transition: 'all 0.2s',
            }}
          >
            {state === STATES.thinking ? '...' : '→'}
          </button>
        </div>
      </div>

      {/* Results */}
      {state === STATES.success && results.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {results.map((action, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '8px 12px', borderRadius: '10px',
              background: action.status === 'success' ? 'rgba(16,185,129,0.08)' : 'rgba(245,158,11,0.08)',
              border: `1px solid ${action.status === 'success' ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)'}`,
            }}>
              <span style={{ fontSize: '14px' }}>{actionEmoji(action.type)}</span>
              <span style={{ fontSize: '12px', fontWeight: 600, color: action.status === 'success' ? '#10B981' : '#F59E0B' }}>
                {actionLabel(action)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
