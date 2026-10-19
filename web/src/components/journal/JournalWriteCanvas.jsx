import React, { useMemo, useState } from 'react';
import { Mic, MicOff } from 'lucide-react';
import useJournalVoice from '../../hooks/useJournalVoice';
import JournalMoodStrip from './JournalMoodStrip';
import { formatDate } from '../../utils/formatDate';

function appendText(base, chunk) {
  const cleanChunk = String(chunk || '').trim();
  if (!cleanChunk) return base;
  if (!base) return cleanChunk;
  const separator = /[.!?]\s*$/.test(base) ? ' ' : ' ';
  return `${base}${separator}${cleanChunk}`;
}

export default function JournalWriteCanvas({
  onSave,
  readOnly = false,
  initialBody = '',
  initialMood = 6,
  prompt = 'One honest page. Type or speak what is real right now.',
  saveLabel = 'Save entry',
  nudgeText = '',
}) {
  const [body, setBody] = useState(initialBody);
  const [mood, setMood] = useState(initialMood);
  const [interimText, setInterimText] = useState('');

  const wordCount = useMemo(() => {
    const trimmed = body.trim();
    if (!trimmed) return 0;
    return trimmed.split(/\s+/).length;
  }, [body]);

  const { isListening, supported, error, toggle } = useJournalVoice({
    enabled: !readOnly,
    onTranscript: (chunk, isFinal) => {
      if (!chunk) return;
      if (isFinal) {
        setBody((prev) => appendText(prev, chunk));
        setInterimText('');
      } else {
        setInterimText(chunk.trim());
      }
    },
  });

  const handleSave = () => {
    const cleanBody = body.trim();
    if (!cleanBody || readOnly) return;
    onSave?.({ body: cleanBody, mood });
  };

  return (
    <section className="journal-studio journal-studio__canvas">
      {nudgeText ? <div className="journal-studio__nudge">{nudgeText}</div> : null}
      <p className="journal-studio__prompt">{prompt}</p>
      <textarea
        value={body}
        className="journal-studio__editor"
        readOnly={readOnly}
        onChange={(event) => setBody(event.target.value)}
        placeholder="Start writing..."
      />
      {!!interimText && !readOnly ? (
        <p className="text-caption" style={{ marginTop: 8 }}>{interimText}</p>
      ) : null}
      <div className="journal-studio__toolbar">
        <div className="journal-studio__meta">
          <span>{wordCount} words</span>
          <span>•</span>
          <span>{formatDate(new Date())}</span>
        </div>
        <JournalMoodStrip value={mood} onChange={setMood} disabled={readOnly} />
        <div className="journal-studio__actions">
          <button
            type="button"
            onClick={toggle}
            disabled={!supported || readOnly}
            className={`journal-studio__voice-btn ${isListening ? 'journal-studio__voice-btn--active' : ''}`}
          >
            {isListening ? <MicOff size={14} /> : <Mic size={14} />}
            {isListening ? 'Stop mic' : 'Speak'}
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={readOnly || !body.trim()}
            className="journal-studio__save-btn"
          >
            {saveLabel}
          </button>
        </div>
      </div>
      {!supported && !readOnly ? (
        <p className="text-caption" style={{ marginTop: 10 }}>Voice is not supported in this browser.</p>
      ) : null}
      {!!error && !readOnly ? (
        <p className="text-caption" style={{ marginTop: 6 }}>{error}</p>
      ) : null}
    </section>
  );
}
