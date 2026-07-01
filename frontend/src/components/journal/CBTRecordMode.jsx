import React, { useState } from 'react';
import useThemeColors from '../../hooks/useThemeColors';
import { analyzeJournalEntry } from '../../services/aiService';
import JournalMoodStrip from './JournalMoodStrip';

const FIELDS = [
  { key: 'situation', label: 'Situation', placeholder: 'What happened? Stick to facts.' },
  { key: 'automaticThought', label: 'Automatic thought', placeholder: 'What went through your mind?' },
  { key: 'emotion', label: 'Emotion', placeholder: 'Name the feeling…', hasSlider: true },
  { key: 'evidenceFor', label: 'Evidence for', placeholder: 'What supports this thought?' },
  { key: 'evidenceAgainst', label: 'Evidence against', placeholder: 'What contradicts it?' },
  { key: 'balancedThought', label: 'Balanced thought', placeholder: 'A fairer, more accurate take.' },
];

export default function CBTRecordMode({ onSave, initialFields = {}, initialAnalysis = null, readOnly = false }) {
  const c = useThemeColors();
  const [fields, setFields] = useState({
    situation: '',
    automaticThought: '',
    emotion: '',
    emotionIntensity: 5,
    evidenceFor: '',
    evidenceAgainst: '',
    balancedThought: '',
    ...initialFields,
  });
  const [analysis, setAnalysis] = useState(initialAnalysis);
  const [mood, setMood] = useState(6);
  const [saving, setSaving] = useState(false);

  const update = (key, val) => setFields((f) => ({ ...f, [key]: val }));

  const handleSave = async () => {
    setSaving(true);
    const plain = Object.values(fields).filter(Boolean).join('\n');
    onSave?.({ fields, mood });
    analyzeJournalEntry(plain, 3, 3).then((res) => {
      if (res) setAnalysis(res);
    }).finally(() => setSaving(false));
  };

  const chip = (label, type = 'neutral') => {
    const colors = {
      emotion: { bg: c.accentDim, color: c.accent },
      warning: { bg: 'var(--color-warning-dim)', color: c.warning },
      neutral: { bg: c.surface4, color: c.text2 },
    };
    const s = colors[type] || colors.neutral;
    return (
      <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 6, background: s.bg, color: s.color, border: `1px solid ${c.border}` }}>
        {label}
      </span>
    );
  };

  return (
    <div style={{ padding: 24, maxWidth: 720, margin: '0 auto' }}>
      <h2 className="text-h2" style={{ color: c.text1, marginBottom: 20 }}>CBT Thought Record</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {FIELDS.map(({ key, label, placeholder, hasSlider }) => (
          <div key={key}>
            <label className="text-label" style={{ display: 'block', marginBottom: 8, color: c.text3 }}>{label}</label>
            {hasSlider ? (
              <div>
                <input type="range" min={1} max={10} value={fields.emotionIntensity} onChange={(e) => update('emotionIntensity', Number(e.target.value))} disabled={readOnly} style={{ width: '100%', accentColor: c.accent }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span className="text-caption tabular-nums">Intensity: {fields.emotionIntensity}/10</span>
                </div>
                <input value={fields.emotion} onChange={(e) => update('emotion', e.target.value)} readOnly={readOnly} placeholder={placeholder} style={inputStyle(c)} />
              </div>
            ) : (
              <textarea value={fields[key]} onChange={(e) => update(key, e.target.value)} readOnly={readOnly} placeholder={placeholder} rows={key === 'situation' ? 2 : 3} style={inputStyle(c)} />
            )}
          </div>
        ))}
      </div>

      <div style={{ marginTop: 16 }}>
        <JournalMoodStrip value={mood} onChange={setMood} disabled={readOnly} />
      </div>

      {!readOnly && (
        <button type="button" className="btn-primary btn-action" onClick={handleSave} disabled={saving} style={{ marginTop: 24, width: '100%', padding: 14, background: c.accent, color: '#fff', border: 'none', borderRadius: 12, fontWeight: 800, cursor: 'pointer' }}>
          {saving ? 'Saving…' : 'Save record'}
        </button>
      )}

      {analysis && (
        <div style={{ marginTop: 20, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {analysis.emotionalTone && chip(analysis.emotionalTone, 'emotion')}
          {analysis.cognitiveDistortion && analysis.cognitiveDistortion !== 'None' && chip(analysis.cognitiveDistortion, 'warning')}
          {analysis.theme && chip(analysis.theme)}
        </div>
      )}
    </div>
  );
}

function inputStyle(c) {
  return {
    width: '100%',
    padding: 14,
    borderRadius: 10,
    border: `1px solid ${c.border}`,
    background: c.inputBg,
    color: c.text1,
    fontSize: 14,
    lineHeight: 1.6,
    resize: 'vertical',
    boxSizing: 'border-box',
  };
}
