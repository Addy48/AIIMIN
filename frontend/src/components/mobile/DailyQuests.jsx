import React from 'react';
import { getDailyQuests, checkQuests } from '../../utils/xpEngine';

const DailyQuests = ({ dateStr, logData }) => {
    const quests = getDailyQuests(dateStr);
    const checked = checkQuests(quests, logData);
    const completedCount = checked.filter(q => q.completed).length;

    return (
        <div className="glass-panel" style={{
            padding: '16px',
            margin: '0 16px',
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    ⚔️ DAILY QUESTS
                </span>
                <span style={{
                    fontSize: '10px', fontWeight: 700,
                    color: completedCount === 3 ? 'var(--success)' : 'var(--text-3)',
                }}>
                    {completedCount}/3
                </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {checked.map(q => (
                    <div key={q.id} style={{
                        display: 'flex', alignItems: 'center', gap: '10px',
                        padding: '10px 12px', borderRadius: '10px',
                        background: q.completed ? 'var(--success-dim)' : 'var(--bg-elevated)',
                        border: q.completed ? '1px solid var(--success-dim)' : '1px solid transparent',
                        transition: 'all 0.3s ease',
                    }}>
                        {/* Check circle */}
                        <div style={{
                            width: '22px', height: '22px', borderRadius: '50%', flexShrink: 0,
                            border: q.completed ? 'none' : '2px solid var(--border)',
                            background: q.completed ? 'var(--success)' : 'transparent',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'all 0.3s ease',
                        }}>
                            {q.completed && (
                                <span style={{ color: '#fff', fontSize: '12px', fontWeight: 700 }}>✓</span>
                            )}
                        </div>

                        {/* Quest text */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <span style={{
                                fontSize: '13px', fontWeight: 600,
                                color: q.completed ? 'var(--success)' : 'var(--text-1)',
                                textDecoration: q.completed ? 'line-through' : 'none',
                                opacity: q.completed ? 0.8 : 1,
                            }}>
                                {q.text}
                            </span>
                        </div>

                        {/* XP reward */}
                        <span style={{
                            fontSize: '11px', fontWeight: 700,
                            color: q.completed ? 'var(--success)' : 'var(--accent)',
                            whiteSpace: 'nowrap',
                        }}>
                            +{q.xp} XP
                        </span>
                    </div>
                ))}
            </div>

            {completedCount === 3 && (
                <div style={{
                    marginTop: '10px', padding: '8px', borderRadius: '8px',
                    background: 'var(--color-success-dim)', textAlign: 'center',
                    fontSize: '12px', fontWeight: 700, color: 'var(--success)',
                }}>
                    All quests complete! ⚡
                </div>
            )}
        </div>
    );
};

export default DailyQuests;
