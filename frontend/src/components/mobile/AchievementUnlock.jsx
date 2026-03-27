import React, { useEffect } from 'react';
import { playSound } from '../../utils/soundEngine';

// Full-screen achievement unlock celebration
const AchievementUnlock = ({ achievement, onDismiss }) => {
    useEffect(() => {
        playSound('chime');
        const timer = setTimeout(onDismiss, 6000);
        return () => clearTimeout(timer);
    }, [onDismiss]);

    return (
        <div onClick={onDismiss} style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(0,0,0,0.85)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexDirection: 'column', cursor: 'pointer',
            animation: 'achFadeIn 0.4s ease-out',
        }}>
            {/* Glow ring */}
            <div style={{
                width: '120px', height: '120px', borderRadius: '50%',
                background: 'radial-gradient(circle, var(--accent-dim), transparent 70%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                animation: 'achPulse 2s ease-in-out infinite',
                boxShadow: 'var(--shadow-gold)',
            }}>
                <span style={{ fontSize: '56px' }}>{achievement.icon}</span>
            </div>

            <div style={{
                marginTop: '24px', fontSize: '12px', fontWeight: 800,
                color: 'var(--accent)', letterSpacing: '0.2em', textTransform: 'uppercase',
            }}>ACHIEVEMENT UNLOCKED</div>

            <div style={{
                marginTop: '12px', fontSize: '24px', fontWeight: 900,
                color: '#fff', textAlign: 'center',
            }}>{achievement.name}</div>

            <div style={{
                marginTop: '8px', fontSize: '14px', color: 'rgba(255,255,255,0.6)',
                textAlign: 'center', maxWidth: '280px',
            }}>{achievement.desc}</div>

            <div style={{
                marginTop: '16px', fontSize: '18px', fontWeight: 800,
                color: '#ff6b35',
            }}>+{achievement.xp} XP</div>

            <div style={{
                marginTop: '32px', fontSize: '12px', color: 'rgba(255,255,255,0.3)',
            }}>tap to dismiss</div>

            <style>{`
                @keyframes achFadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes achPulse {
                    0%, 100% { transform: scale(1); box-shadow: var(--shadow-gold); }
                    50% { transform: scale(1.08); box-shadow: var(--accent-glow); }
                }
            `}</style>
        </div>
    );
};

export default AchievementUnlock;
