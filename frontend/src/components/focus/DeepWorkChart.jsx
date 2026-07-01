import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import useThemeColors from '../../hooks/useThemeColors';
import { fetchFocusWeekStats } from '../../api/focus';

/** Last 7 days deep work minutes — Kolb: measure before you optimize. */
export default function DeepWorkChart({ user }) {
  const c = useThemeColors();
  const [data, setData] = useState([]);

  useEffect(() => {
    const load = async () => {
      const days = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        days.push({
          key: d.toISOString().split('T')[0],
          label: d.toLocaleDateString('en-US', { weekday: 'short' }),
          minutes: 0,
        });
      }

      try {
        const localMins = parseInt(localStorage.getItem('aiimin_focus_mins') || '0', 10);
        const todayKey = new Date().toISOString().split('T')[0];
        const idx = days.findIndex((d) => d.key === todayKey);
        if (idx >= 0 && localMins) days[idx].minutes = localMins;
      } catch { /* noop */ }

      if (user?.id) {
        try {
          const rows = await fetchFocusWeekStats(7);
          (rows || []).forEach((row) => {
            const i = days.findIndex((d) => d.key === row.date);
            if (i >= 0) {
              days[i].minutes = Math.max(days[i].minutes, Number(row.minutes) || 0);
            }
          });
        } catch (e) {
          console.warn('[DeepWorkChart]', e);
        }
      }

      setData(days.map((d) => ({ day: d.label, minutes: d.minutes, hours: Math.round((d.minutes / 60) * 10) / 10 })));
    };
    load();
  }, [user?.id]);

  const totalMins = data.reduce((s, d) => s + d.minutes, 0);

  return (
    <div className="card" style={{ padding: 20, marginTop: 24, background: c.cardBg, border: `1px solid ${c.border}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
        <div>
          <h3 className="text-h3" style={{ margin: 0, color: c.text1 }}>Deep work hours</h3>
          <p className="text-sm" style={{ margin: '4px 0 0', color: c.text3 }}>Last 7 days</p>
        </div>
        <div style={{ fontSize: 22, fontWeight: 800, color: c.accent }}>
          {(totalMins / 60).toFixed(1)}h
        </div>
      </div>
      <div style={{ height: 180 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={c.border} />
            <XAxis dataKey="day" tick={{ fill: c.text3, fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: c.text3, fontSize: 11 }} axisLine={false} tickLine={false} width={32} />
            <Tooltip
              contentStyle={{ background: c.modalCard, border: `1px solid ${c.border}`, borderRadius: 10 }}
              formatter={(v) => [`${v} min`, 'Focus']}
            />
            <Bar dataKey="minutes" fill="#2563EB" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
