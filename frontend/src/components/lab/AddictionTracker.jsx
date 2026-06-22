import React, { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase';
import { useAuth } from '../../hooks/useAuth';
import { motion } from 'framer-motion';

export default function AddictionTracker() {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [addictionName, setAddictionName] = useState('Social Media'); // default or pulled from user settings
  const [form, setForm] = useState({
    intensity: 5,
    trigger: '',
    did_relapse: false,
    replacement_habit_used: '',
    notes: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && !user.isGuest) fetchLogs();
    else setLoading(false);
  }, [user]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const { data } = await supabase
        .from('addiction_tracking')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(30);
      if (data) setLogs(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user.isGuest) {
      alert("Guest mode: Data won't be saved.");
      return;
    }
    try {
      const { data, error } = await supabase
        .from('addiction_tracking')
        .insert([{
          user_id: user.id,
          addiction_name: addictionName,
          craving_intensity: form.intensity,
          trigger_diary: form.trigger,
          did_relapse: form.did_relapse,
          replacement_habit_used: form.replacement_habit_used,
          notes: form.notes
        }])
        .select();
      
      if (!error && data) {
        setLogs([data[0], ...logs]);
        setForm({ intensity: 5, trigger: '', did_relapse: false, replacement_habit_used: '', notes: '' });
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', animation: 'fadeIn 0.3s ease-out' }}>
      <div style={{ background: 'var(--bg-elevated)', borderRadius: '16px', padding: '32px', border: '1px solid var(--border)' }}>
        <h2 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: 800, color: 'var(--text-1)' }}>Private Addiction Tracker</h2>
        <p style={{ color: 'var(--text-2)', fontSize: '15px', marginBottom: '24px' }}>Track cravings, triggers, and replacement behaviors completely privately.</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-1)' }}>What are you tracking?</label>
            <input 
              value={addictionName} 
              onChange={e => setAddictionName(e.target.value)} 
              style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-1)', fontSize: '15px' }} 
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-1)' }}>Craving Intensity (1-10)</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <input 
                type="range" min="1" max="10" 
                value={form.intensity} 
                onChange={e => setForm({...form, intensity: parseInt(e.target.value)})} 
                style={{ flex: 1, accentColor: 'var(--color-accent)' }} 
              />
              <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-accent)', width: '30px', textAlign: 'center' }}>{form.intensity}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '20px' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-1)' }}>What triggered it?</label>
              <input 
                value={form.trigger} 
                onChange={e => setForm({...form, trigger: e.target.value})} 
                placeholder="e.g. Stress, Boredom, Location..." 
                style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-1)', fontSize: '15px' }} 
              />
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-1)' }}>Replacement Habit Used</label>
              <input 
                value={form.replacement_habit_used} 
                onChange={e => setForm({...form, replacement_habit_used: e.target.value})} 
                placeholder="e.g. Pushups, Water, Walk..." 
                style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-1)', fontSize: '15px' }} 
              />
            </div>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', background: 'var(--bg-card)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)' }}>
            <input 
              type="checkbox" 
              checked={form.did_relapse} 
              onChange={e => setForm({...form, did_relapse: e.target.checked})} 
              style={{ width: '20px', height: '20px', accentColor: 'var(--color-danger, #ef4444)' }} 
            />
            <span style={{ fontSize: '15px', fontWeight: 600, color: form.did_relapse ? 'var(--color-danger, #ef4444)' : 'var(--text-1)' }}>I slipped / relapsed</span>
          </label>

          <button type="submit" style={{ padding: '16px', background: 'var(--color-accent)', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: 700, cursor: 'pointer', marginTop: '8px' }}>
            Log Entry
          </button>
        </form>
      </div>

      <div style={{ marginTop: '32px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-1)', marginBottom: '16px' }}>Recent Logs</h3>
        {loading ? (
          <p style={{ color: 'var(--text-3)' }}>Loading logs...</p>
        ) : logs.length === 0 ? (
          <p style={{ color: 'var(--text-3)' }}>No logs yet. Your tracking history will appear here.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {logs.map((log, i) => (
              <div key={i} style={{ background: 'var(--bg-card)', borderRadius: '12px', padding: '16px', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-1)' }}>{new Date(log.created_at).toLocaleDateString()}</span>
                    {log.did_relapse ? (
                      <span style={{ fontSize: '11px', fontWeight: 700, color: '#ef4444', background: '#ef444422', padding: '2px 8px', borderRadius: '100px' }}>Relapse</span>
                    ) : (
                      <span style={{ fontSize: '11px', fontWeight: 700, color: '#10b981', background: '#10b98122', padding: '2px 8px', borderRadius: '100px' }}>Resisted</span>
                    )}
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text-2)' }}>
                    Trigger: <span style={{ color: 'var(--text-1)' }}>{log.trigger_diary || 'None'}</span> • 
                    Replacement: <span style={{ color: 'var(--text-1)' }}>{log.replacement_habit_used || 'None'}</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-accent)' }}>{log.craving_intensity}/10</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Intensity</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
