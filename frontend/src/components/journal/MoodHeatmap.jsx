import React, { useState } from 'react';
import { useThemeContext } from '../../context/ThemeContext';

const MOODS = [
  { val: 1, emoji: '😞', label: 'Rough', color: '#ef4444' },
  { val: 2, emoji: '😐', label: 'Meh', color: '#f59e0b' },
  { val: 3, emoji: '😊', label: 'Okay', color: '#10b981' },
  { val: 4, emoji: '😄', label: 'Good', color: '#3b82f6' },
  { val: 5, emoji: '🔥', label: 'Great', color: '#8b5cf6' },
];

export default function MoodHeatmap({ entries, onSelectEntry }) {
  const { theme } = useThemeContext();
  const isDark = theme === 'vercel' || theme === 'midnight';
  
  const [currentDate, setCurrentDate] = useState(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(1);
    return d;
  });

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  
  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(year, month, i));
  }

  const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <div style={{ padding: '0 24px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-2)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{monthName}</div>
        <div style={{ display: 'flex', gap: '4px' }}>
          <button onClick={prevMonth} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-text-3)', padding: '2px 6px', fontSize: '14px' }}>{'<'}</button>
          <button onClick={nextMonth} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-text-3)', padding: '2px 6px', fontSize: '14px' }}>{'>'}</button>
        </div>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center', marginBottom: '4px' }}>
        {DAY_LABELS.map((lbl, i) => (
          <div key={i} style={{ fontSize: '9px', fontWeight: 800, color: 'var(--color-text-3)', opacity: 0.5 }}>{lbl}</div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
        {days.map((d, idx) => {
          if (!d) return <div key={`empty-${idx}`} />;
          
          const dateStr = new Date(d.getTime() - (d.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
          const entry = entries.find(e => e.date === dateStr);
          const moodObj = entry ? MOODS.find(m => m.val === entry.mood) : null;
          const isToday = dateStr === new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString().split('T')[0];
          
          const dayNumber = d.getDate();
          
          return (
            <div 
              key={dateStr}
              onClick={() => { if(entry) onSelectEntry(entry); }}
              title={`${dateStr} ${moodObj ? '- ' + moodObj.label + ' ' + moodObj.emoji : ''}`}
              style={{
                aspectRatio: '1',
                borderRadius: '6px',
                background: moodObj ? moodObj.color : (isDark ? 'rgba(255,255,255,0.03)' : '#fff'),
                opacity: moodObj ? 0.9 : 1,
                cursor: entry ? 'pointer' : 'default',
                transition: 'all 0.2s ease',
                border: isToday ? '1px solid var(--color-text-3)' : (entry ? `1px solid ${moodObj.color}` : `1px solid ${isDark ? 'transparent' : 'var(--border)'}`),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                fontWeight: moodObj ? 800 : 600,
                color: moodObj ? '#fff' : 'var(--color-text-3)',
                boxShadow: entry ? '0 2px 4px rgba(0,0,0,0.1)' : 'none'
              }}
              onMouseEnter={e => { 
                e.currentTarget.style.opacity = 1; 
                e.currentTarget.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={e => { 
                e.currentTarget.style.opacity = moodObj ? 0.9 : 1;
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              {dayNumber}
            </div>
          );
        })}
      </div>
    </div>
  );
}
