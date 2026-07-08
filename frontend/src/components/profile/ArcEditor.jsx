import React, { useState, useCallback } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import ArcLockup from '../brand/ArcLockup';
import { apiPost } from '../../utils/api';
import useFieldSave, { FieldSaveIndicator } from '../../hooks/useFieldSave';
import {
  ARC_LAYERS,
  LIFE_ARC_QUESTION,
  LIFE_ARC_HELPER,
  LIFE_ARC_EXAMPLES,
  lifeArcFromGoals,
} from '../../constants/arc';

const fieldStyle = {
  width: '100%',
  padding: '14px 16px',
  borderRadius: 12,
  border: '1px solid var(--color-border)',
  background: 'var(--color-surface-2)',
  color: 'var(--color-text-1)',
  font: '600 15px/1.5 var(--font-sans)',
  outline: 'none',
  resize: 'vertical',
  minHeight: 96,
};

const chipBtnStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  padding: '7px 12px',
  borderRadius: 999,
  border: '1px solid var(--color-border)',
  background: 'var(--color-surface-1)',
  color: 'var(--color-text-2)',
  fontSize: 12,
  fontWeight: 600,
  cursor: 'pointer',
};

function stripQuotes(s) {
  return String(s || '').trim().replace(/^["']+|["']+$/g, '');
}

/**
 * Life Arc editor — shared by onboarding + account profile.
 */
export default function ArcEditor({
  value,
  onChange,
  onSave,
  goalHints = [],
  variant = 'profile',
  required = false,
  saveStatus: externalSaveStatus,
}) {
  const [aiLoading, setAiLoading] = useState(false);
  const [aiNote, setAiNote] = useState('');

  const internalSave = useCallback(async (v) => {
    if (onSave) await onSave(v);
  }, [onSave]);

  const { status: internalStatus, save } = useFieldSave(internalSave);
  const saveStatus = externalSaveStatus ?? internalStatus;

  const applyExample = (example) => {
    onChange(example);
    if (onSave) save(example);
  };

  const suggestFromGoals = () => {
    const suggestion = lifeArcFromGoals(goalHints);
    if (suggestion) {
      onChange(suggestion);
      setAiNote('Suggested from your goals — edit or sharpen.');
    }
  };

  const sharpenWithAi = async () => {
    const draft = stripQuotes(value);
    if (!draft && goalHints.length === 0) return;
    setAiLoading(true);
    setAiNote('');
    try {
      const res = await apiPost('/intelligence/arc/sharpen', {
        draft: draft || lifeArcFromGoals(goalHints),
        goalIds: goalHints,
      });
      const line = stripQuotes(res?.text);
      if (line) {
        onChange(line);
        if (onSave) await save(line);
        if (!res.stub) {
          setAiNote('Sharpened — tweak if needed.');
        }
      }
    } catch (err) {
      setAiNote(err.message || 'Could not sharpen. Your text is still saved.');
    } finally {
      setAiLoading(false);
    }
  };

  const isOnboarding = variant === 'onboarding';

  return (
    <div
      style={{
        padding: isOnboarding ? 0 : '18px 20px',
        borderRadius: isOnboarding ? 0 : 14,
        border: isOnboarding ? 'none' : '1px solid color-mix(in srgb, var(--color-accent) 22%, var(--color-border))',
        background: isOnboarding ? 'transparent' : 'linear-gradient(180deg, var(--color-surface-1) 0%, var(--color-surface-2) 100%)',
      }}
    >
      <ArcLockup
        size={isOnboarding ? 'lg' : 'md'}
        showTagline
        center={isOnboarding}
        style={{ marginBottom: isOnboarding ? 20 : 14 }}
      />

      {!isOnboarding && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
          {ARC_LAYERS.map((layer) => (
            <span
              key={layer.id}
              title={layer.hint}
              style={{
                padding: '6px 11px',
                borderRadius: 999,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.02em',
                border: layer.primary
                  ? '1px solid color-mix(in srgb, var(--color-accent) 45%, var(--color-border))'
                  : '1px solid var(--color-border)',
                background: layer.primary ? 'var(--color-accent-dim)' : 'var(--color-surface-1)',
                color: layer.primary ? 'var(--color-accent)' : 'var(--color-text-3)',
              }}
            >
              {layer.label}
            </span>
          ))}
        </div>
      )}

      {isOnboarding && (
        <p style={{ margin: '0 0 16px', fontSize: 12, lineHeight: 1.5, color: 'var(--color-text-3)', textAlign: 'center' }}>
          Daily Arc and Weekly Arc align to your Life Arc.
        </p>
      )}

      <p style={{ margin: '0 0 12px', fontSize: 14, lineHeight: 1.55, color: 'var(--color-text-2)', textAlign: isOnboarding ? 'center' : 'left' }}>
        {LIFE_ARC_QUESTION}
      </p>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => onSave && save(stripQuotes(value))}
        required={required}
        placeholder="e.g. Crack placements this year"
        rows={3}
        style={fieldStyle}
      />

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
        {!isOnboarding && goalHints.length > 0 && (
          <button type="button" onClick={suggestFromGoals} style={chipBtnStyle}>
            Suggest from goals
          </button>
        )}
        <button
          type="button"
          onClick={sharpenWithAi}
          disabled={aiLoading || (!stripQuotes(value) && goalHints.length === 0)}
          style={{
            ...chipBtnStyle,
            borderColor: 'color-mix(in srgb, var(--color-accent) 40%, var(--color-border))',
            color: 'var(--color-accent)',
            background: 'var(--color-accent-dim)',
            opacity: aiLoading ? 0.7 : 1,
          }}
        >
          {aiLoading ? <Loader2 size={14} style={{ animation: 'spin 0.8s linear infinite' }} /> : <Sparkles size={14} />}
          Sharpen Life Arc
        </button>
      </div>

      <div style={{ marginTop: 12 }}>
        <p style={{ margin: '0 0 8px', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-text-3)' }}>
          Examples
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {LIFE_ARC_EXAMPLES.map((example) => (
            <button
              key={example}
              type="button"
              onClick={() => applyExample(example)}
              style={{
                ...chipBtnStyle,
                background: value === example ? 'var(--color-accent-dim)' : 'var(--color-surface-1)',
                color: value === example ? 'var(--color-accent)' : 'var(--color-text-2)',
              }}
            >
              {example}
            </button>
          ))}
        </div>
      </div>

      <p style={{ margin: '14px 0 0', fontSize: 12, lineHeight: 1.55, color: 'var(--color-text-3)', textAlign: isOnboarding ? 'center' : 'left' }}>
        {LIFE_ARC_HELPER}
      </p>
      {aiNote && (
        <p style={{ margin: '8px 0 0', fontSize: 12, color: 'var(--color-text-3)', textAlign: isOnboarding ? 'center' : 'left' }}>
          {aiNote}
        </p>
      )}
      {onSave && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
          <FieldSaveIndicator status={saveStatus} />
        </div>
      )}
    </div>
  );
}
