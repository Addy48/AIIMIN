import React, { useState, useEffect } from 'react';

const DEFAULT_HABITS = [
  { id: 'h1', name: 'Morning Workout', icon: '🏋️', category: 'Health', color: '#22C55E', description: 'Gym session / home workout', target: 7 },
  { id: 'h2', name: 'Read 30 mins', icon: '📚', category: 'Learning', color: '#3B82F6', description: 'Books, articles, technical docs', target: 7 },
  { id: 'h3', name: 'Journaling', icon: '✍️', category: 'Mindset', color: '#F59E0B', description: 'Daily reflection & gratitude', target: 7 },
  { id: 'h4', name: 'Drink 3L Water', icon: '💧', category: 'Health', color: '#06B6D4', description: 'Hydration goal', target: 7 },
  { id: 'h5', name: 'DSA Practice', icon: '💻', category: 'Career', color: '#8B5CF6', description: 'LeetCode / competitive prog', target: 5 },
  { id: 'h6', name: 'No Junk Food', icon: '🥗', category: 'Health', color: '#EC4899', description: 'Clean eating only', target: 7 },
];

const STORAGE_KEY = 'aiimin_habits_v3';
const LOG_KEY     = 'aiimin_habits_logs_v3';

export default function YearlyHabitMatrix() {
  const [data, setData] = useState({});
  const [totalHabits, setTotalHabits] = useState(1);

  useEffect(() => {
    let habits = [];
    try { habits = JSON.parse(localStorage.getItem(STORAGE_KEY)) || DEFAULT_HABITS; }
    catch { habits = DEFAULT_HABITS; }
    
    let logs = {};
    try { logs = JSON.parse(localStorage.getItem(LOG_KEY) || '{}'); }
    catch { logs = {}; }

    setTotalHabits(habits.length || 1);

    const heatmapData = {};
    Object.keys(logs).forEach(date => {
        let count = 0;
        Object.keys(logs[date]).forEach(habitId => {
            if (logs[date][habitId]) count++;
        });
        heatmapData[date] = count;
    });
    setData(heatmapData);
  }, []);

  const now = new Date();
  const startD = new Date(now);
  startD.setDate(startD.getDate() - 364);

  const matrix = [];
  for (let i = 0; i < 7; i++) matrix.push(new Array(53).fill(null));

  let col = 0;
  let row = startD.getDay() === 0 ? 6 : startD.getDay() - 1;

  for (let i = 0; i < 365; i++) {
    const d = new Date(startD);
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];

    let count = data[dateStr] || 0;
    let pct = count / totalHabits;
    
    let color = 'var(--color-surface)';
    if (pct > 0) color = 'rgba(34, 197, 94, 0.3)';
    if (pct > 0.4) color = 'rgba(34, 197, 94, 0.6)';
    if (pct > 0.7) color = 'rgba(34, 197, 94, 0.8)';
    if (pct >= 1.0) color = '#22C55E';
    
    if (pct === 0) color = 'var(--color-elevated)';

    matrix[row][col] = { date: dateStr, pct, color, count };

    row++;
    if (row > 6) {
      row = 0;
      col++;
    }
  }

  return (
    <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '24px', padding: '24px', overflowX: 'auto', marginTop: '32px' }}>
      <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-3)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
         <span style={{ fontSize: '14px' }}>🔥</span> Yearly Habit Heatmap
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', justifyContent: 'space-around', paddingRight: '4px', fontSize: '10px', color: 'var(--color-text-3)', fontWeight: 700, textTransform: 'uppercase' }}>
          <span style={{ height: '12px', lineHeight: '12px' }}>Mon</span>
          <span style={{ height: '12px', lineHeight: '12px' }}></span>
          <span style={{ height: '12px', lineHeight: '12px' }}>Wed</span>
          <span style={{ height: '12px', lineHeight: '12px' }}></span>
          <span style={{ height: '12px', lineHeight: '12px' }}>Fri</span>
          <span style={{ height: '12px', lineHeight: '12px' }}></span>
          <span style={{ height: '12px', lineHeight: '12px' }}>Sun</span>
        </div>
        <div style={{ display: 'flex', gap: '4px' }}>
          {matrix[0].map((_, c) => (
            <div key={c} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {matrix.map((r, ri) => {
                const cell = matrix[ri][c];
                return (
                  <div key={ri} 
                    title={cell ? `${cell.count} habits on ${cell.date}` : ''}
                    style={{
                      width: '14px', height: '14px', borderRadius: '4px',
                      background: cell ? cell.color : 'transparent',
                      border: cell && cell.count === 0 ? '1px solid var(--color-border)' : 'none',
                      transition: 'transform 0.1s', cursor: cell ? 'pointer' : 'default'
                  }} 
                  onMouseEnter={e => { if (cell) e.target.style.transform = 'scale(1.2)' }}
                  onMouseLeave={e => { if (cell) e.target.style.transform = 'scale(1)' }}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '8px', marginTop: '16px', fontSize: '10px', color: 'var(--color-text-3)', fontWeight: 700 }}>
         <span>Less</span>
         <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'var(--color-elevated)', border: '1px solid var(--color-border)' }} />
         <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'rgba(34, 197, 94, 0.3)' }} />
         <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'rgba(34, 197, 94, 0.6)' }} />
         <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'rgba(34, 197, 94, 0.8)' }} />
         <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#22C55E' }} />
         <span>More</span>
      </div>
    </div>
  );
}
