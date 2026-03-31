import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BehaviorReplayPlayer = ({ sequence, peakDay, onClose }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (currentIndex < sequence.length) {
            const timer = setTimeout(() => setCurrentIndex(c => c + 1), 2400);
            return () => clearTimeout(timer);
        }
    }, [currentIndex, sequence.length]);

    const progress = ((currentIndex) / sequence.length) * 100;

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(14,16,13,0.92)', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
            <div style={{ width: '100%', maxWidth: '600px', padding: '40px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', color: 'var(--text-2)' }}>
                    <div style={{ fontSize: '14px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Replaying Peak Day</div>
                    <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-1)', fontSize: '24px', cursor: 'pointer' }}>×</button>
                </div>

                {/* Progress Bar */}
                <div style={{ height: '4px', background: 'var(--bg-elevated)', borderRadius: '4px', overflow: 'hidden', marginBottom: '60px' }}>
                    <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.5 }} style={{ height: '100%', background: 'var(--accent)' }} />
                </div>

                <div style={{ height: '250px', position: 'relative' }}>
                    <AnimatePresence mode="wait">
                        {currentIndex < sequence.length ? (
                            <motion.div
                                key={currentIndex}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}
                            >
                                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: sequence[currentIndex].color, boxShadow: `0 0 24px ${sequence[currentIndex].color}80`, marginBottom: '24px' }}></div>
                                <div style={{ fontSize: '20px', fontWeight: 800, color: sequence[currentIndex].color, marginBottom: '8px', letterSpacing: '0.05em' }}>{sequence[currentIndex].time}</div>
                                <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-1)', lineHeight: 1.3 }}>{sequence[currentIndex].event}</div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="done"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                                style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}
                            >
                                <div style={{ fontSize: '56px', marginBottom: '24px' }}>🌟</div>
                                <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--gold)', marginBottom: '12px' }}>Replay Complete</div>
                                <div style={{ fontSize: '18px', color: 'var(--text-2)' }}>Consistent inputs create predictable outcomes.</div>
                                <button onClick={onClose} style={{ marginTop: '40px', padding: '14px 32px', background: 'var(--accent)', color: '#000', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 20px rgba(212,175,55,0.4)' }}>Close Replay</button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default BehaviorReplayPlayer;
