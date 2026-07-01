import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link2, Plus, Trash2 } from 'lucide-react';
import { apiGet } from '../../utils/api';
import { fetchReplacementHabits, addReplacementHabit, deleteReplacementHabit } from '../../api/discipline';
import useThemeColors from '../../hooks/useThemeColors';

/** Links discipline replacement protocols to real habits from the Habits page. */
export default function ReplacementHabitLinker({ addictionType }) {
  const c = useThemeColors();
  const qc = useQueryClient();
  const [habitId, setHabitId] = useState('');
  const [customName, setCustomName] = useState('');

  const { data: habits = [] } = useQuery({
    queryKey: ['habits-for-discipline'],
    queryFn: () => apiGet('/habits'),
  });

  const { data: replacements = [], isLoading } = useQuery({
    queryKey: ['replacement-habits'],
    queryFn: fetchReplacementHabits,
  });

  const addMutation = useMutation({
    mutationFn: addReplacementHabit,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['replacement-habits'] }),
  });

  const delMutation = useMutation({
    mutationFn: deleteReplacementHabit,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['replacement-habits'] }),
  });

  const selected = habits.find((h) => h.id === habitId);
  const name = selected ? `${selected.emoji} ${selected.name}` : customName.trim();

  const handleAdd = () => {
    if (!name) return;
    addMutation.mutate({
      habit_name: name,
      linked_to_addiction: addictionType || null,
    });
    setHabitId('');
    setCustomName('');
  };

  return (
    <div style={{ padding: 24, borderRadius: 20, background: c.cardBg, border: `1px solid ${c.border}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <Link2 size={18} color={c.accent} />
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: c.text1 }}>Replacement habit linker</h3>
      </div>
      <p className="text-sm" style={{ color: c.text2, marginBottom: 16 }}>
        Connect your recovery protocol to habits you already track — one tap when an urge hits.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
        <select
          value={habitId}
          onChange={(e) => { setHabitId(e.target.value); setCustomName(''); }}
          style={{ padding: 10, borderRadius: 8, border: `1px solid ${c.border}`, background: c.inputBg, color: c.text1 }}
        >
          <option value="">Pick from habits…</option>
          {habits.map((h) => (
            <option key={h.id} value={h.id}>{h.emoji} {h.name}</option>
          ))}
        </select>
        <input
          value={customName}
          onChange={(e) => { setCustomName(e.target.value); setHabitId(''); }}
          placeholder="Or type custom replacement"
          style={{ padding: 10, borderRadius: 8, border: `1px solid ${c.border}`, background: c.inputBg, color: c.text1 }}
        />
      </div>
      <button
        type="button"
        onClick={handleAdd}
        disabled={!name || addMutation.isPending}
        style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: c.accent, color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, cursor: 'pointer', opacity: name ? 1 : 0.5, marginBottom: 20 }}
      >
        <Plus size={16} /> Add linker
      </button>

      {isLoading ? (
        <p style={{ color: c.text3, fontSize: 13 }}>Loading…</p>
      ) : replacements.length === 0 ? (
        <p style={{ color: c.text3, fontSize: 13 }}>No linked replacements yet.</p>
      ) : (
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {replacements.map((r) => (
            <li key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', borderRadius: 10, background: c.surface3, border: `1px solid ${c.border}` }}>
              <div>
                <div style={{ fontWeight: 700, color: c.text1, fontSize: 14 }}>{r.habit_name}</div>
                {r.linked_to_addiction && (
                  <div style={{ fontSize: 11, color: c.text3 }}>↳ when fighting: {r.linked_to_addiction}</div>
                )}
              </div>
              <button type="button" onClick={() => delMutation.mutate(r.id)} aria-label="Remove" style={{ background: 'none', border: 'none', color: c.text3, cursor: 'pointer' }}>
                <Trash2 size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
