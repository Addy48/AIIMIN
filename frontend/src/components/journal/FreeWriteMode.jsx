import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Eye, EyeOff } from 'lucide-react';
import useThemeColors from '../../hooks/useThemeColors';
import { getSocraticPrompt } from './journalUtils';

const DURATIONS = [10, 15, 20];

export default function FreeWriteMode({ onSave, readOnly = false, initialBody = '', initialMeta = {} }) {
  const c = useThemeColors();
  const [duration, setDuration] = useState(initialMeta.duration || 15);
  const [started, setStarted] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [body, setBody] = useState(initialBody);
  const [blur, setBlur] = useState(false);
  const [locked, setLocked] = useState(readOnly);
  const [socratic, setSocratic] = useState('');
  const idleRef = useRef(null);
  const textareaRef = useRef(null);

  const wordCount = body.trim() ? body.trim().split(/\s+/).length : 0;

  const resetIdle = useCallback(() => {
    if (locked || !started) return;
    clearTimeout(idleRef.current);
    setSocratic('');
    idleRef.current = setTimeout(() => setSocratic(getSocraticPrompt()), 90000);
  }, [locked, started]);

  useEffect(() => {
    if (!started || locked) return undefined;
    const tick = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(tick);
          setLocked(true);
          onSave?.({ body, meta: { duration, wordCount, completedAt: new Date().toISOString() } });
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(tick);
  }, [started, locked, body, duration, wordCount, onSave]);

  useEffect(() => () => clearTimeout(idleRef.current), []);

  const start = () => {
    setStarted(true);
    setSecondsLeft(duration * 60);
    resetIdle();
    setTimeout(() => textareaRef.current?.focus(), 100);
  };

  const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  if (!started && !locked) {
    return (
      <div style={{ padding: 32, textAlign: 'center' }}>
        <h2 className="text-h2" style={{ color: c.text1, marginBottom: 12 }}>Free Write</h2>
        <p className="text-sm" style={{ color: c.text2, marginBottom: 24 }}>Pennebaker protocol — uninterrupted writing for a set time.</p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 28 }}>
          {DURATIONS.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDuration(d)}
              style={{
                padding: '10px 20px',
                borderRadius: 10,
                border: duration === d ? `2px solid ${c.accent}` : `1px solid ${c.border}`,
                background: duration === d ? c.accentDim : c.surface2,
                color: duration === d ? c.accent : c.text2,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {d} min
            </button>
          ))}
        </div>
        <button type="button" className="btn-primary btn-action" onClick={start} style={{ padding: '14px 32px', background: c.accent, color: '#fff', border: 'none', borderRadius: 12, fontWeight: 800, cursor: 'pointer' }}>
          Start session
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span className="tabular-nums text-h3" style={{ color: c.text1, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Clock size={18} color={c.accent} /> {fmt(secondsLeft)}
          </span>
          <span className="text-caption">{wordCount} words</span>
        </div>
        {!locked && (
          <button type="button" onClick={() => setBlur((b) => !b)} aria-label="Toggle blur" style={{ display: 'flex', alignItems: 'center', gap: 6, background: c.surface4, border: `1px solid ${c.border}`, borderRadius: 8, padding: '8px 12px', color: c.text2, cursor: 'pointer' }}>
            {blur ? <EyeOff size={16} /> : <Eye size={16} />} Blur as you write
          </button>
        )}
      </div>

      <AnimatePresence>
        {socratic && !locked && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ padding: 14, marginBottom: 12, borderRadius: 10, background: c.accentDim, border: `1px solid ${c.border}`, color: c.text2, fontSize: 13, fontStyle: 'italic' }}>
            {socratic}
          </motion.div>
        )}
      </AnimatePresence>

      <textarea
        ref={textareaRef}
        value={body}
        onChange={(e) => { setBody(e.target.value); resetIdle(); }}
        readOnly={locked}
        className="prose-area"
        placeholder="Write here. No one's reading. Just write."
        style={{
          flex: 1,
          minHeight: 320,
          padding: 20,
          borderRadius: 12,
          border: `1px solid ${c.border}`,
          background: c.inputBg,
          color: c.text1,
          fontSize: 15,
          lineHeight: 1.7,
          resize: 'none',
          filter: blur && !locked ? 'blur(3px)' : 'none',
          transition: 'filter 0.2s',
        }}
      />

      {locked && (
        <p className="text-caption" style={{ marginTop: 12, color: c.success }}>
          Session complete. Entry saved — read-only now.
        </p>
      )}
    </div>
  );
}
