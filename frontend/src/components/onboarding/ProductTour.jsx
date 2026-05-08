import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useThemeContext } from '../../context/ThemeContext';

const TOUR_STEPS = [
    {
        target: '/overview',
        title: 'Welcome to AIIMIN',
        content: 'Your personal operating system for behavior shaping. This Overview gives you a birds-eye view of your day, mood, and upcoming goals.',
        position: 'center'
    },
    {
        target: '/habits',
        title: 'Build Better Habits',
        content: 'Track your daily routines and build streaks. Consistency is key to long-term success.',
        position: 'center'
    },
    {
        target: '/placements',
        title: 'Career & Placements',
        content: 'Manage your job applications, track interview stages, and prep for technical rounds all in one place.',
        position: 'center'
    },
    {
        target: '/lab',
        title: 'The Improvement Lab',
        content: 'Train your skills. Test your typing speed, log speaking exercises, and forge your core personality traits.',
        position: 'center'
    },
    {
        target: '/finance',
        title: 'Wealth Management',
        content: 'Keep an eye on your assets. Track Gold, Silver, Mutual Funds, and Foreign Stocks directly from your dashboard.',
        position: 'center'
    }
];

export default function ProductTour() {
    const { theme } = useThemeContext();
    const navigate = useNavigate();
    const isDark = theme === 'dark';

    const [isOpen, setIsOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);

    const startTour = useCallback(() => {
        setIsOpen(true);
        setCurrentStep(0);
        navigate(TOUR_STEPS[0].target);
    }, [navigate]);

    const endTour = () => {
        setIsOpen(false);
        localStorage.setItem('aiimin_tour_seen', 'true');
    };

    const nextStep = () => {
        if (currentStep < TOUR_STEPS.length - 1) {
            const next = currentStep + 1;
            setCurrentStep(next);
            navigate(TOUR_STEPS[next].target);
        } else {
            endTour();
        }
    };

    // We expose a global window method for easy testing / manual trigger from navbar
    useEffect(() => {
        window.startProductTour = startTour;
        return () => { delete window.startProductTour; };
    }, [startTour]);

    const bg = isDark ? '#161616' : '#ffffff';
    const border = isDark ? '#2a2a2a' : '#e5e7eb';
    const text1 = isDark ? '#ededed' : '#111111';
    const text2 = isDark ? '#a1a1aa' : '#6b7280';
    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 10000, pointerEvents: 'none' }}>
                        {/* Backdrop */}
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', pointerEvents: 'auto' }}
                            onClick={endTour}
                        />

                        {/* Dialog */}
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: '400px',
                                background: bg,
                                border: `1px solid ${border}`,
                                borderRadius: '24px',
                                padding: '32px',
                                boxShadow: isDark ? '0 24px 64px rgba(0,0,0,0.5)' : '0 24px 64px rgba(0,0,0,0.15)',
                                pointerEvents: 'auto'
                            }}
                        >
                            <div style={{ fontSize: '12px', fontWeight: 700, color: text2, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>
                                Step {currentStep + 1} of {TOUR_STEPS.length}
                            </div>
                            <h2 style={{ fontSize: '24px', fontWeight: 800, color: text1, marginBottom: '16px', letterSpacing: '-0.02em', fontFamily: 'var(--font-serif)' }}>
                                {TOUR_STEPS[currentStep].title}
                            </h2>
                            <p style={{ fontSize: '15px', color: text2, lineHeight: 1.6, marginBottom: '32px' }}>
                                {TOUR_STEPS[currentStep].content}
                            </p>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <button onClick={endTour} style={{ background: 'none', border: 'none', color: text2, cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
                                    Skip Tour
                                </button>
                                <button 
                                    onClick={nextStep}
                                    style={{
                                        background: 'var(--color-accent)',
                                        color: isDark ? '#000' : '#fff',
                                        border: 'none',
                                        padding: '12px 24px',
                                        borderRadius: '12px',
                                        fontSize: '14px',
                                        fontWeight: 700,
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px'
                                    }}
                                >
                                    {currentStep === TOUR_STEPS.length - 1 ? (
                                        <>Finish <Check size={16} /></>
                                    ) : (
                                        <>Next <ChevronRight size={16} /></>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
