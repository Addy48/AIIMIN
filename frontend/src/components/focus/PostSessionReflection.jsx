import React, { useState } from 'react';
import Modal from '../ui/Modal';
import useThemeColors from '../../hooks/useThemeColors';

/**
 * Post-session reflection — Kolb (1984): without reflection, experience does not convert to skill.
 */
export default function PostSessionReflection({ isOpen, intent, onSubmit }) {
  const c = useThemeColors();
  const [reflection, setReflection] = useState('');
  const [energy, setEnergy] = useState(3);

  const handleSubmit = () => {
    if (!reflection.trim()) return;
    onSubmit({ reflection: reflection.trim(), energy_after: energy, session_intent: intent });
    setReflection('');
    setEnergy(3);
  };

  return (
    <Modal isOpen={isOpen} onClose={undefined} hideCloseButton title="Session reflection" maxWidth="480px">
      <p className="text-sm" style={{ color: c.text2, marginBottom: 8 }}>
        Kolb (1984): without reflection, experience does not convert to skill. This step is the learning loop.
      </p>
      <p className="text-sm" style={{ color: c.text2, marginBottom: 16 }}>
        You focused on: <strong style={{ color: c.text1 }}>{intent || 'your session'}</strong>
      </p>
      <label className="text-label" style={{ color: c.text3 }}>What did you actually accomplish?</label>
      <textarea
        value={reflection}
        onChange={(e) => setReflection(e.target.value)}
        rows={4}
        placeholder="Be specific — files touched, problems solved, pages written…"
        style={{ width: '100%', marginTop: 8, marginBottom: 16, padding: 12, borderRadius: 10, border: `1px solid ${c.border}`, background: c.inputBg, color: c.text1, resize: 'vertical' }}
      />
      <label className="text-label" style={{ color: c.text3 }}>Energy after session</label>
      <input type="range" min={1} max={5} value={energy} onChange={(e) => setEnergy(Number(e.target.value))} style={{ width: '100%', marginTop: 8, marginBottom: 20, accentColor: c.accent }} />
      <div style={{ display: 'flex', gap: 12 }}>
        <button type="button" onClick={handleSubmit} disabled={!reflection.trim()} className="btn-action" style={{ flex: 1, padding: 12, background: reflection.trim() ? c.accent : c.surface4, color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, cursor: reflection.trim() ? 'pointer' : 'not-allowed', opacity: reflection.trim() ? 1 : 0.6 }}>
          Save reflection
        </button>
      </div>
    </Modal>
  );
}
