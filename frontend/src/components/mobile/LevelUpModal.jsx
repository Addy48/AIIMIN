import React, { useEffect, useState } from 'react';
import { RANK_UP_LINES } from '../../utils/xpEngine';
import { playLevelUp } from '../../utils/soundEngine';

const LevelUpModal = ({ rank, onDismiss }) => {
    const [phase, setPhase] = useState(0); // 0=enter, 1=show, 2=exit

    useEffect(() => {
        playLevelUp();
        const t1 = setTimeout(() => setPhase(1), 100);
        return () => clearTimeout(t1);
    }, []);

    const handleDismiss = () => {
        setPhase(2);
        setTimeout(onDismiss, 400);
    };

    if (!rank) return null;

    const particles = Array.from({ length: 24 }, (_, i) => {
        const angle = (i / 24) * 360;
        const dist = 60 + Math.random() * 100;
        const size = 3 + Math.random() * 5;
        const delay = Math.random() * 0.5;
        return { angle, dist, size, delay };
    });

    return (
        <div onClick={handleDismiss} style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(0,0,0,0.85)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            opacity: phase === 2 ? 0 : phase === 1 ? 1 : 0,
            transition: 'opacity 0.4s ease',
            cursor: 'pointer',
        }}>
            <style>{`
                @keyframes lvlParticle {
                    0% { transform: translate(-50%,-50%) scale(0); opacity: 1; }
                    50% { opacity: 1; }
                    100% { opacity: 0; }
                }
                @keyframes lvlPulse {
                    0% { transform: scale(0.5); opacity: 0; }
                    50% { transform: scale(1.05); opacity: 1; }
                    100% { transform: scale(1); opacity: 1; }
                }
                @keyframes lvlGlow {
                    0%, 100% { box-shadow: 0 0 20px ${rank.color}40; }
                    50% { box-shadow: 0 0 60px ${rank.color}80, 0 0 120px ${rank.color}30; }
                }
                @keyframes lvlSlide {
                    0% { transform: translateY(20px); opacity: 0; }
                    100% { transform: translateY(0); opacity: 1; }
                }
            `}</style>

            {/* Particle burst */}
            <div style={{ position: 'absolute', width: '1px', height: '1px' }}>
                {particles.map((p, i) => (
                    <div key={i} style={{
                        position: 'absolute',
                        width: p.size + 'px', height: p.size + 'px',
                        borderRadius: '50%', background: rank.color,
                        left: `${Math.cos(p.angle * Math.PI / 180) * p.dist}px`,
                        top: `${Math.sin(p.angle * Math.PI / 180) * p.dist}px`,
                        animation: `lvlParticle 1.5s ease-out ${p.delay}s both`,
                    }} />
                ))}
            </div>

            {/* Rank circle */}
            <div style={{
                width: '120px', height: '120px', borderRadius: '50%',
                border: `3px solid ${rank.color}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                animation: 'lvlPulse 0.6s ease-out both, lvlGlow 2s ease-in-out infinite 0.6s',
                marginBottom: '24px',
            }}>
                <span style={{ fontSize: '36px', fontWeight: 900, color: rank.color }}>
                    {rank.rank}
                </span>
            </div>

            {/* Rank name */}
            <div style={{
                fontSize: '28px', fontWeight: 900, color: rank.color,
                textTransform: 'uppercase', letterSpacing: '0.12em',
                animation: 'lvlSlide 0.5s ease-out 0.3s both',
                marginBottom: '12px',
            }}>
                {rank.name}
            </div>

            {/* Motivational line */}
            <div style={{
                fontSize: '14px', color: 'var(--text-2, #ccc)',
                maxWidth: '280px', textAlign: 'center', lineHeight: '1.6',
                animation: 'lvlSlide 0.5s ease-out 0.5s both',
                marginBottom: '32px', fontStyle: 'italic',
            }}>
                "{RANK_UP_LINES[rank.rank] || 'New level unlocked.'}"
            </div>

            {/* Dismiss */}
            <div style={{
                fontSize: '13px', fontWeight: 700, color: rank.color,
                textTransform: 'uppercase', letterSpacing: '0.08em',
                animation: 'lvlSlide 0.5s ease-out 0.7s both',
                opacity: 0.8,
            }}>
                Keep going →
            </div>
        </div>
    );
};

export default LevelUpModal;
