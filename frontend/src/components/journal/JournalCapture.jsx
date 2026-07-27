import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Mic, Send, Sparkles } from 'lucide-react';
import useJournalVoice from '../../hooks/useJournalVoice';
import JournalMoodStrip from './JournalMoodStrip';

function appendText(base, chunk) {
  const cleanChunk = String(chunk || '').trim();
  if (!cleanChunk) return base;
  if (!base) return cleanChunk;
  return `${base} ${cleanChunk}`;
}

const MOOD_ONLY_BODY = '[mood check-in]';

/**
 * Frictionless journal capture — input row + voice + mood-only save. No blank textarea default.
 */
export default function JournalCapture({
  onSave,
  onQuickMoodSave,
  initialBody = '',
  initialMood = 6,
  todaySaved = false,
  draftSuggestions = [],
  readOnly = false,
}) {
  const [text, setText] = useState(initialBody);
  const [mood, setMood] = useState(initialMood);
  const [interimText, setInterimText] = useState('');
  const [saving, setSaving] = useState(false);
  const [showStructured, setShowStructured] = useState(false);
  const inputRef = useRef(null);
  const holdTimerRef = useRef(null);
  const [holdingMic, setHoldingMic] = useState(false);

  const canSave = !readOnly && (text.trim().length > 0 || todaySaved);

  const { isListening, supported, error, toggle, stop } = useJournalVoice({
    enabled: !readOnly,
    onTranscript: (chunk, isFinal) => {
      if (!chunk) return;
      if (isFinal) {
        setText((prev) => appendText(prev, chunk));
        setInterimText('');
      } else {
        setInterimText(chunk.trim());
      }
    },
  });

  const handleMoodOnly = useCallback(async (value) => {
    if (readOnly) return;
    setMood(value);
    setSaving(true);
    try {
      await onQuickMoodSave?.({ mood: value, body: MOOD_ONLY_BODY });
    } finally {
      setSaving(false);
    }
  }, [onQuickMoodSave, readOnly]);

  const handleSubmit = useCallback(async () => {
    const body = text.trim();
    if (!body || readOnly) return;
    setSaving(true);
    try {
      await onSave?.({ body, mood, autoClassify: true });
      if (!todaySaved) setText('');
    } finally {
      setSaving(false);
    }
  }, [mood, onSave, readOnly, text, todaySaved]);

  const onMicPointerDown = () => {
    if (!supported || readOnly) return;
    holdTimerRef.current = setTimeout(() => {
      setHoldingMic(true);
      if (!isListening) toggle();
    }, 120);
  };

  const onMicPointerUp = () => {
    clearTimeout(holdTimerRef.current);
    if (holdingMic && isListening) {
      stop();
      setHoldingMic(false);
    }
  };

  useEffect(() => () => clearTimeout(holdTimerRef.current), []);

  const displayHint = useMemo(() => {
    if (todaySaved) return 'Logged today — add more or tap mood to update.';
    return 'Short entries count. Type, speak, or pick a mood.';
  }, [todaySaved]);

  return (
    <section className="journal-capture">
      <div className="journal-capture__hero">
        <p className="journal-capture__hint">{displayHint}</p>
        {draftSuggestions.length > 0 && (
          <div className="journal-capture__drafts" role="list" aria-label="Suggested entries">
            {draftSuggestions.map((draft) => (
              <button
                key={draft.id}
                type="button"
                className="journal-capture__draft"
                onClick={() => setText(draft.text)}
              >
                <Sparkles size={13} aria-hidden="true" />
                <span>{draft.text}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <JournalMoodStrip
        value={mood}
        disabled={readOnly || saving}
        onChange={(value) => {
          setMood(value);
          if (!text.trim()) handleMoodOnly(value);
        }}
      />

      <div className="journal-capture__row">
        <input
          ref={inputRef}
          type="text"
          className="journal-capture__input"
          value={text}
          readOnly={readOnly}
          placeholder="What's on your mind?"
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
        />
        <button
          type="button"
          className={`journal-capture__mic ${isListening || holdingMic ? 'journal-capture__mic--active' : ''}`}
          disabled={!supported || readOnly}
          aria-label={isListening ? 'Release to stop recording' : 'Hold to speak'}
          onPointerDown={onMicPointerDown}
          onPointerUp={onMicPointerUp}
          onPointerLeave={onMicPointerUp}
          onClick={() => {
            if (!holdingMic) toggle();
          }}
        >
          <Mic size={18} />
        </button>
        <button
          type="button"
          className="journal-capture__send"
          disabled={!canSave || saving}
          onClick={handleSubmit}
          aria-label="Save entry"
        >
          <Send size={16} />
        </button>
      </div>

      {interimText ? (
        <p className="journal-capture__interim">{interimText}</p>
      ) : null}

      {error ? <p className="journal-capture__error">{error}</p> : null}

      <div className="journal-capture__footer">
        <button
          type="button"
          className="journal-capture__structured-toggle"
          onClick={() => setShowStructured((v) => !v)}
        >
          {showStructured ? 'Hide structured modes' : 'Structured templates (optional)'}
        </button>
        {showStructured ? (
          <p className="journal-capture__structured-note">
            CBT, morning pages, and weekly review live in the row above — use only when you want depth.
          </p>
        ) : null}
      </div>
    </section>
  );
}
