import React, { useEffect, useState } from 'react';
import { Link2 } from 'lucide-react';
import useThemeColors from '../../hooks/useThemeColors';
import { apiGet, apiPost } from '../../utils/api';

/**
 * Habit stacking — IF anchor THEN new habit.
 * Gollwitzer (1999): implementation intentions via IF-THEN anchoring increases goal attainment 200–300%.
 */
export default function HabitStackPanel({ habits, onStackCreated }) {
  const c = useThemeColors();
  const [anchorId, setAnchorId] = useState('');
  const [newHabitId, setNewHabitId] = useState('');
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const [stacks, setStacks] = useState([]);
  const [loadingStacks, setLoadingStacks] = useState(true);

  const habitById = (id) => habits.find((h) => h.id === id);

  const loadStacks = async () => {
    setLoadingStacks(true);
    try {
      const rows = await apiGet('/habits/stacks');
      setStacks(rows || []);
    } catch {
      setStacks([]);
    } finally {
      setLoadingStacks(false);
    }
  };

  useEffect(() => {
    if (habits.length >= 2) loadStacks();
    else setLoadingStacks(false);
  }, [habits.length, onStackCreated]);

  const save = async () => {
    if (!anchorId || !newHabitId) return;
    setSaving(true);
    try {
      const anchor = habitById(anchorId);
      const stacked = habitById(newHabitId);
      const stackName = name.trim() || `After ${anchor?.name || 'habit'} → ${stacked?.name || 'habit'}`;
      await apiPost('/habits/stacks', {
        name: stackName,
        habit_ids: [anchorId, newHabitId],
      });
      onStackCreated?.();
      await loadStacks();
      setAnchorId('');
      setNewHabitId('');
      setName('');
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  if (habits.length < 2) return null;

  return (
    <div className="card" style={{ padding: 20, marginBottom: 24, background: c.cardBg, border: `1px solid ${c.border}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <Link2 size={18} color={c.accent} />
        <h3 className="text-h3" style={{ margin: 0, color: c.text1 }}>Habit stacking</h3>
      </div>
      <p className="text-sm" style={{ color: c.text2, marginBottom: 16 }}>
        After I complete one habit, I will do another. IF-THEN linking doubles follow-through.
      </p>

      {!loadingStacks && stacks.length > 0 && (
        <div style={{ marginBottom: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div className="text-label" style={{ color: c.text3, marginBottom: 4 }}>Your stacks</div>
          {stacks.map((stack) => {
            const anchor = habitById(stack.habit_ids?.[0]);
            const next = habitById(stack.habit_ids?.[1]);
            return (
              <div
                key={stack.id}
                style={{
                  padding: '12px 14px',
                  borderRadius: 10,
                  border: `1px solid ${c.border}`,
                  background: c.surface2,
                  fontSize: 13,
                  color: c.text1,
                }}
              >
                <div style={{ fontWeight: 800, marginBottom: 4 }}>{stack.name}</div>
                <div style={{ color: c.text2, lineHeight: 1.5 }}>
                  After <strong>{anchor?.emoji} {anchor?.name || '…'}</strong>
                  {' → '}
                  I will <strong>{next?.emoji} {next?.name || '…'}</strong>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
        <div>
          <label className="text-label" style={{ color: c.text3 }}>After I…</label>
          <select value={anchorId} onChange={(e) => setAnchorId(e.target.value)} style={{ width: '100%', marginTop: 6, padding: 10, borderRadius: 8, border: `1px solid ${c.border}`, background: c.inputBg, color: c.text1 }}>
            <option value="">Pick anchor habit</option>
            {habits.map((h) => <option key={h.id} value={h.id}>{h.emoji} {h.name}</option>)}
          </select>
        </div>
        <div>
          <label className="text-label" style={{ color: c.text3 }}>I will…</label>
          <select value={newHabitId} onChange={(e) => setNewHabitId(e.target.value)} style={{ width: '100%', marginTop: 6, padding: 10, borderRadius: 8, border: `1px solid ${c.border}`, background: c.inputBg, color: c.text1 }}>
            <option value="">Pick stacked habit</option>
            {habits.filter((h) => h.id !== anchorId).map((h) => <option key={h.id} value={h.id}>{h.emoji} {h.name}</option>)}
          </select>
        </div>
      </div>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Stack name (optional)"
        style={{ width: '100%', marginBottom: 12, padding: 10, borderRadius: 8, border: `1px solid ${c.border}`, background: c.inputBg, color: c.text1 }}
      />
      <button
        type="button"
        className="btn-action"
        onClick={save}
        disabled={!anchorId || !newHabitId || saving}
        style={{ padding: '10px 18px', background: c.accent, color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, cursor: 'pointer', opacity: anchorId && newHabitId ? 1 : 0.5 }}
      >
        {saving ? 'Saving…' : 'Save stack'}
      </button>
    </div>
  );
}

/** Returns stacked habit to prompt after anchor completion, if any. */
export function getStackedHabitAfter(stacks, completedHabitId, habits) {
  const stack = (stacks || []).find((s) => s.habit_ids?.[0] === completedHabitId);
  if (!stack?.habit_ids?.[1]) return null;
  return habits.find((h) => h.id === stack.habit_ids[1]) || null;
}
