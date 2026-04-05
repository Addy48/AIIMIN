import React, { useEffect, useState } from 'react';
import { playSuccess } from '../../utils/soundEngine';

const AchievementUnlock = ({ achievement, onDismiss }) => {
    const [phase, setPhase] = useState(0); // 0=enter, 1=show, 2=exit

    useEffect(() => {
        if (achievement) {
            playSuccess();
            const t1 = setTimeout(() => setPhase(1), 100);
            const t2 = setTimeout(() => {
                setPhase(2);
            }, 3000); // Auto-dismiss after 3s
            return () => {
                clearTimeout(t1);
                clearTimeout(t2);
            };
        }
    }, [achievement]);

    const handleDismiss = () => {
        setPhase(2);
        setTimeout(onDismiss, 300);
    };

    if (!achievement) return null;

    return (
        <div onClick={handleDismiss} style={{
            position: 'fixed',
            bottom: '32px',
            right: '32px',
            zIndex: 9998,
        }}>
            <style>{`
                @keyframes achieveSlide {
                    0% { transform: translateX(400px); opacity: 0; }
                    100% { transform: translateX(0); opacity: 1; }
                }
                @keyframes achieveExit {
                    0% { transform: translateX(0); opacity: 1; }
                    100% { transform: translateX(400px); opacity: 0; }
                }
                @keyframes achieveBounce {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                }
                .achievement-card {
                    background: var(--color-surface);
                    border: 1px solid var(--color-border);
                    border-radius: 12px;
                    padding: '16px';
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
                    animation: ${phase === 2 ? 'achieveExit' : 'achieveSlide'} 0.3s ease;
                    cursor: pointer;
                    transition: transform 0.2s ease;
                }
                .achievement-card:hover {
                    transform: scale(1.02);
                }
                .achievement-badge {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #ff6b35, #ffa500);
                    font-size: 32px;
                    animation: achieveBounce 0.6s ease;
                    margin-bottom: 12px;
                }
                .achievement-text-title {
                    font-size: 14px;
                    font-weight: 700;
                    color: var(--color-text-1);
                    margin-bottom: 4px;
                }
                .achievement-text-desc {
                    font-size: 12px;
                    color: var(--color-text-3);
                    line-height: 1.4;
                }
            `}</style>

            <div className="achievement-card">
                <div className="achievement-badge">🏆</div>
                <div className="achievement-text-title">Achievement Unlocked!</div>
                <div className="achievement-text-title" style={{ color: '#ff6b35' }}>
                    {achievement.name}
                </div>
                <div className="achievement-text-desc">
                    {achievement.description}
                </div>
                <div className="achievement-text-desc" style={{ marginTop: '8px', color: '#10b981', fontWeight: 600 }}>
                    +{achievement.xpReward} XP
                </div>
            </div>
        </div>
    );
};

export default AchievementUnlock;
