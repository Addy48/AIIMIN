import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Square, AlertTriangle, TreePine, Leaf, Info } from 'lucide-react';
import toast from '../utils/toast';

export default function FocusRoom() {
    const [status, setStatus] = useState('idle'); // idle | running | dead | success
    const [timeRemaining, setTimeRemaining] = useState(25 * 60);
    const [duration, setDuration] = useState(25 * 60);
    const [treeLevel, setTreeLevel] = useState(0); // 0 (seed) to 4 (full tree)
    
    const intervalRef = useRef(null);
    const visibilityTimeoutRef = useRef(null);

    // Handle visibility change
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (status === 'running' && document.hidden) {
                // User left the tab
                toast.error("Focus lost! Tree is dying...");
                visibilityTimeoutRef.current = setTimeout(() => {
                    killTree();
                }, 5000); // 5 second grace period
            } else if (status === 'running' && !document.hidden) {
                // User returned in time
                if (visibilityTimeoutRef.current) {
                    clearTimeout(visibilityTimeoutRef.current);
                    visibilityTimeoutRef.current = null;
                    toast.success("Saved it! Keep focusing.", { icon: '🌱' });
                }
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            if (visibilityTimeoutRef.current) clearTimeout(visibilityTimeoutRef.current);
        };
    }, [status]);

    useEffect(() => {
        if (status === 'running') {
            intervalRef.current = setInterval(() => {
                setTimeRemaining(prev => {
                    if (prev <= 1) {
                        finishSession();
                        return 0;
                    }
                    
                    // Update tree level based on progress
                    const progress = 1 - (prev / duration);
                    if (progress > 0.8) setTreeLevel(4);
                    else if (progress > 0.6) setTreeLevel(3);
                    else if (progress > 0.4) setTreeLevel(2);
                    else if (progress > 0.2) setTreeLevel(1);
                    else setTreeLevel(0);
                    
                    return prev - 1;
                });
            }, 1000);
        } else {
            if (intervalRef.current) clearInterval(intervalRef.current);
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [status, duration]);

    const startSession = () => {
        setStatus('running');
        setTreeLevel(0);
    };

    const killTree = () => {
        setStatus('dead');
        if (intervalRef.current) clearInterval(intervalRef.current);
        toast.error("Your tree withered away because you left the tab.", { duration: 5000 });
    };

    const abortSession = () => {
        if (window.confirm("Are you sure? Your tree will die!")) {
            killTree();
        }
    };

    const finishSession = () => {
        setStatus('success');
        setTreeLevel(4);
        toast.success("Focus session completed! A new tree has been planted.", { duration: 5000, icon: '🌲' });
    };

    const reset = () => {
        setStatus('idle');
        setTimeRemaining(duration);
        setTreeLevel(0);
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const getTreeVisual = () => {
        if (status === 'dead') return <span style={{ fontSize: '100px', filter: 'grayscale(1)' }}>🥀</span>;
        switch(treeLevel) {
            case 0: return <span style={{ fontSize: '100px' }}>🌱</span>; // Seedling
            case 1: return <span style={{ fontSize: '100px' }}>🪴</span>; // Small plant
            case 2: return <span style={{ fontSize: '100px' }}>🌿</span>; // Growing
            case 3: return <span style={{ fontSize: '100px' }}>🌳</span>; // Almost there
            case 4: return <span style={{ fontSize: '100px' }}>🌲</span>; // Full tree
            default: return <span style={{ fontSize: '100px' }}>🌱</span>;
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '40px 20px', textAlign: 'center' }}>
            <h1 className="text-section" style={{ marginBottom: '8px' }}>Focus Room</h1>
            <p className="text-caption" style={{ marginBottom: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <AlertTriangle size={14} color="var(--color-warning)" />
                Strict Mode: Leaving this tab will kill your tree!
            </p>

            <div className="glass-surface card-hover" style={{ padding: '60px 40px', borderRadius: '24px', position: 'relative', overflow: 'hidden' }}>
                
                {/* Background pulse when running */}
                {status === 'running' && (
                    <motion.div 
                        animate={{ scale: [1, 1.1, 1], opacity: [0.05, 0.1, 0.05] }}
                        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                        style={{ position: 'absolute', inset: 0, background: 'var(--accent)', zIndex: 0 }}
                    />
                )}

                <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={treeLevel + status}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 1.1, opacity: 0 }}
                                transition={{ type: 'spring' }}
                            >
                                {getTreeVisual()}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <div style={{ fontSize: '64px', fontWeight: 800, fontFamily: 'var(--font-mono)', letterSpacing: '-0.02em', color: status === 'dead' ? 'var(--color-danger)' : 'var(--text-1)', marginBottom: '40px' }}>
                        {formatTime(timeRemaining)}
                    </div>

                    {status === 'idle' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                {[15, 25, 45, 60].map(mins => (
                                    <button 
                                        key={mins}
                                        onClick={() => { setDuration(mins * 60); setTimeRemaining(mins * 60); }}
                                        style={{ 
                                            background: duration === mins * 60 ? 'var(--accent)' : 'var(--bg-elevated)',
                                            color: duration === mins * 60 ? '#000' : 'var(--text-1)',
                                            border: `1px solid ${duration === mins * 60 ? 'var(--accent)' : 'var(--border)'}`,
                                            padding: '8px 16px',
                                            borderRadius: '20px',
                                            cursor: 'pointer',
                                            fontWeight: 600
                                        }}
                                    >
                                        {mins}m
                                    </button>
                                ))}
                            </div>
                            <button onClick={startSession} className="btn-primary" style={{ width: '100%', padding: '16px', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', borderRadius: '16px' }}>
                                <Play size={20} fill="currentColor" /> Plant Tree & Focus
                            </button>
                        </div>
                    )}

                    {status === 'running' && (
                        <button onClick={abortSession} style={{ background: 'var(--color-danger-dim)', color: 'var(--color-danger)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '16px', fontSize: '16px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', borderRadius: '16px', width: '100%', cursor: 'pointer' }}>
                            <Square size={18} fill="currentColor" /> Give Up
                        </button>
                    )}

                    {(status === 'dead' || status === 'success') && (
                        <button onClick={reset} className="btn-secondary" style={{ width: '100%', padding: '16px', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', borderRadius: '16px' }}>
                            {status === 'dead' ? 'Try Again' : 'Plant Another'}
                        </button>
                    )}
                </div>
            </div>
            
            <div style={{ marginTop: '24px', padding: '16px', borderRadius: '12px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', textAlign: 'left', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <Info size={20} color="var(--text-3)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <p style={{ fontSize: '13px', color: 'var(--text-2)', margin: 0, lineHeight: 1.5 }}>
                    <strong>How it works:</strong> The Focus Room forces you to concentrate. Once you start the timer, you cannot navigate to another tab or app. If the window loses focus for more than 5 seconds, your tree will die. Use this for deep, uninterrupted work sessions.
                </p>
            </div>
        </div>
    );
}
