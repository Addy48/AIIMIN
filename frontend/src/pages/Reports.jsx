import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useDailyStats } from '../hooks/useDailyStats';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';

const Reports = () => {
  const { user } = useAuth();
  const { thirtyDayTrend, computed, loading } = useDailyStats(user);

  const chartData = useMemo(() => {
    if (!thirtyDayTrend) return [];
    // Sort oldest to newest
    return [...thirtyDayTrend].sort((a, b) => a.date.localeCompare(b.date)).map(item => ({
      ...item,
      shortDate: item.date.slice(5), // MM-DD
      score: (item.gym_done ? 1 : 0) + (item.breakfast_done ? 1 : 0) + (item.learning_done ? 1 : 0) + (item.journal_entry ? 1 : 0)
    }));
  }, [thirtyDayTrend]);

  const pieData = useMemo(() => {
    if (!computed) return [];
    return [
      { name: 'Gym', value: computed.gymDays, color: 'var(--color-accent)' },
      { name: 'Learning', value: computed.learningDays, color: '#10B981' },
      { name: 'Inactivity', value: computed.loggedDays - Math.max(computed.gymDays, computed.learningDays), color: 'var(--color-border)' },
    ];
  }, [computed]);

  if (!user || loading) return <div style={{ padding: '40px', color: 'var(--color-text-3)' }}>Loading Reports...</div>;

  return (
    <div style={{ paddingBottom: '100px' }}>
      <div style={{ marginBottom: '40px' }}>
        <div style={{
          fontSize: '10px',
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'var(--color-text-3)',
          fontFamily: 'var(--font-sans)',
          marginBottom: '8px',
        }}>Reports · 30 Day Analytics</div>
        <h1 style={{
          font: 'var(--text-hero)',
          color: 'var(--color-text-1)',
          margin: 0,
          letterSpacing: '-0.02em',
        }}>
          System Telemetry.
        </h1>
        <p style={{ color: 'var(--color-text-2)', fontSize: '14px', maxWidth: '600px', marginTop: '12px' }}>
          Real-time analysis of your tasks, habits, and daily velocity across the past 30 days. No fluff, just the raw data of your execution.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '40px' }}>
        {[
          { label: 'Current Streak', val: `${computed.currentStreak} Days`, desc: 'Consecutive active days' },
          { label: 'Avg Sleep', val: `${computed.avgSleep}h`, desc: '7-day moving average' },
          { label: 'Avg Steps', val: computed.avgSteps.toLocaleString(), desc: '7-day moving average' },
          { label: 'System Uptime', val: `${Math.round((computed.loggedDays / 30) * 100)}%`, desc: 'Log completion rate (30d)' }
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            style={{
              padding: '24px',
              borderRadius: '24px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)'
            }}
          >
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-3)', marginBottom: '8px' }}>{stat.label}</div>
            <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--color-text-1)', letterSpacing: '-0.02em' }}>{stat.val}</div>
            <div style={{ fontSize: '11px', color: 'var(--color-accent)', marginTop: '8px', fontWeight: 500 }}>{stat.desc}</div>
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', alignItems: 'start' }}>
        {/* Main Chart */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            padding: '32px',
            borderRadius: '24px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border)'
          }}
        >
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: 'var(--color-text-1)' }}>Daily Discipline Score</h3>
            <p style={{ fontSize: '12px', color: 'var(--color-text-3)', margin: '4px 0 0 0' }}>Aggregated completion of daily core habits over 30 days.</p>
          </div>
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-accent)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--color-accent)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="shortDate" stroke="var(--color-text-3)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--color-text-3)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '12px' }}
                  itemStyle={{ color: 'var(--color-text-1)' }}
                />
                <Area type="monotone" dataKey="score" stroke="var(--color-accent)" strokeWidth={3} fill="url(#scoreGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{
            padding: '32px',
            borderRadius: '24px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border)'
          }}
        >
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: 'var(--color-text-1)' }}>Activity Distribution</h3>
            <p style={{ fontSize: '12px', color: 'var(--color-text-3)', margin: '4px 0 0 0' }}>30-day breakdown.</p>
          </div>
          <div style={{ height: '200px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
            {pieData.map(item => (
              <div key={item.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.color }} />
                  <span style={{ fontSize: '13px', color: 'var(--color-text-2)' }}>{item.name}</span>
                </div>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-1)' }}>{item.value} days</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Reports;
