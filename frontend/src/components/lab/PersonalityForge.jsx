import React, { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase';

const TRAITS = [
  { key: 'openness', label: 'Openness', desc: 'Curiosity and creativity vs. consistency and caution', color: '#8B5CF6' },
  { key: 'conscientiousness', label: 'Conscientiousness', desc: 'Organization and dependability vs. easy-going and careless', color: '#3B82F6' },
  { key: 'extraversion', label: 'Extraversion', desc: 'Outgoing and energetic vs. solitary and reserved', color: '#F59E0B' },
  { key: 'agreeableness', label: 'Agreeableness', desc: 'Friendly and compassionate vs. critical and rational', color: '#10B981' },
  { key: 'neuroticism', label: 'Neuroticism', desc: 'Sensitive and nervous vs. secure and confident', color: '#EF4444' },
];

export default function PersonalityForge({ userId, isDark, onClose }) {
  const [traits, setTraits] = useState({
    openness: 5,
    conscientiousness: 5,
    extraversion: 5,
    agreeableness: 5,
    neuroticism: 5
  });
  const [values, setValues] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const border = 'var(--color-border)';
  const text1 = 'var(--color-text-1)';
  const text2 = 'var(--color-text-2)';

  useEffect(() => {
    async function loadLatest() {
      const { data } = await supabase
        .from('lab_personality_logs')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (data && data[0]) {
        const { id, user_id, created_at, values: v, ...rest } = data[0];
        setTraits(rest);
        setValues(v || '');
      }
    }
    loadLatest();
  }, [userId]);

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase.from('lab_personality_logs').insert({
      user_id: userId,
      ...traits,
      values: values.trim() || null
    });
    setSaving(false);
    if (!error) {
      setSaved(true);
      setTimeout(onClose, 1500);
    }
  };

  return (
    <div style={{ padding: '32px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 800, color: text1, margin: '0 0 8px' }}>Personality Forge</h2>
        <p style={{ fontSize: '14px', color: text2 }}>Map your psychological baseline and core values.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '32px' }}>
        {TRAITS.map(t => (
          <div key={t.key}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: text1 }}>{t.label}</div>
                <div style={{ fontSize: '11px', color: text2 }}>{t.desc}</div>
              </div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: t.color, fontFamily: 'var(--font-mono)' }}>{traits[t.key]}</div>
            </div>
            <input 
              type="range" min="1" max="10" 
              value={traits[t.key]} 
              onChange={e => setTraits(prev => ({ ...prev, [t.key]: parseInt(e.target.value) }))}
              style={{ width: '100%', accentColor: t.color, height: '6px', borderRadius: '3px', cursor: 'pointer' }}
            />
          </div>
        ))}
      </div>

      <div style={{ marginBottom: '24px' }}>
        <label style={{ fontSize: '13px', fontWeight: 600, color: text1, display: 'block', marginBottom: '8px' }}>Core Values / Mission Statement</label>
        <textarea 
          value={values} 
          onChange={e => setValues(e.target.value)}
          placeholder="What are the non-negotiables that drive you?"
          style={{ 
            width: '100%', minHeight: '100px', padding: '12px', borderRadius: '12px', 
            border: `1px solid ${border}`, background: 'var(--color-surface)',
            color: text1, fontSize: '13px', fontFamily: 'var(--font-sans)', resize: 'none', outline: 'none'
          }}
        />
      </div>

      <button 
        onClick={handleSave} 
        disabled={saving || saved}
        style={{ 
          width: '100%', padding: '14px', borderRadius: '12px', background: saved ? '#22C55E' : 'var(--color-accent)',
          color: '#fff', border: 'none', fontSize: '14px', fontWeight: 700, cursor: 'pointer', transition: 'all 200ms'
        }}
      >
        {saved ? '✓ Profile Forge Complete' : saving ? 'Forging...' : 'Save Personality Profile'}
      </button>
    </div>
  );
}
