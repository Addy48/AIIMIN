import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Check, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useThemeContext } from '../../context/ThemeContext';

const TOUR_STEPS = [
    {
        target: '/overview',
        title: 'Welcome to AIIMIN Dashboard',
        content: 'This is your central command center. Here you get a birds-eye view of your day\'s schedules, habits completion rate, ongoing focus statistics, and visual mood/productivity patterns.',
        position: 'center'
    },
    {
        target: '/habits',
        title: 'Habits Tracking System',
        content: 'Consistency breeds excellence. Create personal habits, track your daily routines, and earn progressive streak milestones to reinforce positive behavioral habits.',
        position: 'center'
    },
    {
        target: '/goals',
        title: 'Core Goals & Milestones',
        content: 'Turn abstract dreams into absolute results. Set long-term life objectives, define key metrics, and break them down into granular, actionable todo checklist items.',
        position: 'center'
    },
    {
        target: '/journal',
        title: 'Structured Daily Journaling',
        content: 'Forge deep self-awareness. Log morning reflections and evening gratitude, rating your daily productivity, focus, and mindfulness scores in your permanent log.',
        position: 'center'
    },
    {
        target: '/focus',
        title: 'Deep Focus & Pomodoro Room',
        content: 'Lock in and tune out distractions. Start custom Pomodoro sessions, play soothing background noise generators (Lofi, Rain, White Noise), and track every block of deep work.',
        position: 'center'
    },
    {
        target: '/placements',
        title: 'Placement & Job Tracker',
        content: 'Supercharge your career prep. A full Kanban board to track job applications, maintain interview steps, log key contacts, and organize resume variants all in one workspace.',
        position: 'center'
    },
    {
        target: '/finance',
        title: 'Wealth & Asset Ledger',
        content: 'Take absolute control of your finances. Record dynamic transactions, build monthly budgets, and track live market prices for Gold, Silver, Mutual Funds, and global equities.',
        position: 'center'
    },
    {
        target: '/sports',
        title: 'Live Sports scores & Alerts',
        content: 'Track your favorite sports without leaving your personal OS. Live updates, match results, and custom ESPN-powered schedules for Cricket, Football, Formula 1, and Basketball.',
        position: 'center'
    },
    {
        target: '/lab',
        title: 'Self-Improvement Lab',
        content: 'Train your attributes like an RPG character. Take real-time typing speed speedruns, track verbal practice logs, and structure core identity affirmations.',
        position: 'center'
    },
    {
        target: '/calendar',
        title: 'Unified Calendar & Deadlines',
        content: 'Synchronize your life seamlessly. Full Google Calendar integration combining your tasks, deadlines, schedules, and custom sessions into one responsive calendar view.',
        position: 'center'
    },
    {
        target: '/insights',
        title: 'AI Behavioral Insights',
        content: 'Discover hidden patterns in your life. Our analysis engine correlates your financial habits, productivity sessions, sleep logs, and focus levels into actionable graphs.',
        position: 'center'
    },
    {
        target: '/settings',
        title: 'Custom Themes & Preferences',
        content: 'Make AIIMIN fully yours. Toggle responsive dark/light modes, update credentials, configure active API integrations, and choose from 9 custom-tailored visual themes.',
        position: 'center'
    }
];

export default function ProductTour() {
    const { theme } = useThemeContext();
    const navigate = useNavigate();
    const isDark = theme === 'dark';

    const [isOpen, setIsOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);

    const [showPill, setShowPill] = useState(false);

    const startTour = useCallback(() => {
        setShowPill(false);
        setIsOpen(true);
        setCurrentStep(0);
        navigate(TOUR_STEPS[0].target);
    }, [navigate]);

    const endTour = () => {
        setIsOpen(false);
        setShowPill(false);
        localStorage.setItem('aiimin_tour_completed', 'true');
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

    const prevStep = () => {
        if (currentStep > 0) {
            const prev = currentStep - 1;
            setCurrentStep(prev);
            navigate(TOUR_STEPS[prev].target);
        }
    };

    // Auto-show guided tour pill if not seen yet
    useEffect(() => {
        const completed = localStorage.getItem('aiimin_tour_completed');
        if (!completed) {
            const timer = setTimeout(() => {
                setShowPill(true);
            }, 2000); // 2-second buffer to allow UI to mount fully
            return () => clearTimeout(timer);
        }
    }, []);

    // Expose global trigger for manual settings retakes
    useEffect(() => {
        window.startProductTour = startTour;
        return () => { delete window.startProductTour; };
    }, [startTour]);

    const bg = isDark ? '#1a1a1a' : '#fcfbf9';
    const border = isDark ? '#2e2e2e' : '#e4e2db';
    const text1 = isDark ? '#f5f5f5' : '#1e201d';
    const text2 = isDark ? '#a0a0a0' : '#5a5c59';
    const accent = 'var(--color-accent)';

    return (
        <>
            <AnimatePresence>
                {showPill && !isOpen && (
                    <motion.button
                        key="pill"
                        initial={{ opacity: 0, y: 30, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 30, scale: 0.9 }}
                        onClick={startTour}
                        style={{
                            position: 'fixed',
                            bottom: '32px',
                            right: '32px',
                            zIndex: 9999,
                            background: accent,
                            color: '#fff',
                            border: 'none',
                            padding: '12px 20px',
                            borderRadius: '99px',
                            fontSize: '13px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            boxShadow: '0 10px 25px rgba(30,92,58,0.25)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontFamily: 'var(--font-sans)'
                        }}
                    >
                        <span style={{ 
                            width: '8px', height: '8px', borderRadius: '50%', background: '#fff', 
                            boxShadow: '0 0 8px #fff', animation: 'pulse 2s infinite' 
                        }} />
                        Take a Quick Tour
                        <div 
                            onClick={(e) => { e.stopPropagation(); endTour(); }}
                            style={{ marginLeft: '6px', opacity: 0.7, padding: '2px', display: 'flex' }}
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </div>
                    </motion.button>
                )}

                {isOpen && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 10000, pointerEvents: 'none' }}>

                        {/* Dialog */}
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, y: 30, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -30, scale: 0.96 }}
                            transition={{ type: 'spring', damping: 26, stiffness: 280 }}
                            style={{
                                position: 'absolute',
                                bottom: '32px',
                                right: '32px',
                                width: '100%',
                                maxWidth: '340px',
                                background: bg,
                                border: `1px solid ${border}`,
                                borderRadius: '24px',
                                padding: '24px',
                                boxShadow: isDark ? '0 30px 80px rgba(0,0,0,0.6)' : '0 30px 80px rgba(30,32,29,0.12)',
                                pointerEvents: 'auto'
                            }}
                        >
                            {/* Step Count indicator */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                <span style={{ fontSize: '10px', fontWeight: 800, color: accent, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                                    Walkthrough
                                </span>
                                <span style={{ fontSize: '10px', fontWeight: 700, color: text2, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                    Step {currentStep + 1} of {TOUR_STEPS.length}
                                </span>
                            </div>

                            {/* Step Title */}
                            <h2 style={{ fontSize: '18px', fontWeight: 800, color: text1, marginBottom: '12px', letterSpacing: '-0.02em', fontFamily: 'var(--font-sans)', lineHeight: 1.2 }}>
                                {TOUR_STEPS[currentStep].title}
                            </h2>

                            {/* Step Content */}
                            <p style={{ fontSize: '13px', color: text2, lineHeight: 1.5, marginBottom: '24px', fontFamily: 'var(--font-sans)' }}>
                                {TOUR_STEPS[currentStep].content}
                            </p>

                            {/* Controls */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <button 
                                    onClick={endTour} 
                                    style={{ 
                                        background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '13px', fontWeight: 700,
                                        fontFamily: 'var(--font-sans)' 
                                    }}
                                >
                                    Skip Intro
                                </button>

                                <div style={{ display: 'flex', gap: '10px' }}>
                                    {currentStep > 0 && (
                                        <button
                                            onClick={prevStep}
                                            style={{
                                                background: 'none',
                                                border: `1px solid ${border}`,
                                                color: text1,
                                                padding: '12px 18px',
                                                borderRadius: '12px',
                                                fontSize: '13px',
                                                fontWeight: 700,
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                fontFamily: 'var(--font-sans)'
                                            }}
                                        >
                                            <ArrowLeft size={14} /> Back
                                        </button>
                                    )}

                                    <button 
                                        onClick={nextStep}
                                        style={{
                                            background: accent,
                                            color: '#fff',
                                            border: 'none',
                                            padding: '12px 24px',
                                            borderRadius: '12px',
                                            fontSize: '13px',
                                            fontWeight: 700,
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            fontFamily: 'var(--font-sans)',
                                            boxShadow: '0 4px 12px rgba(30,92,58,0.15)'
                                        }}
                                    >
                                        {currentStep === TOUR_STEPS.length - 1 ? (
                                            <>Finish <Check size={14} /></>
                                        ) : (
                                            <>Next <ChevronRight size={14} /></>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
