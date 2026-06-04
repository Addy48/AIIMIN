import React, { useState } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';
import { apiPost } from '../utils/api';
import { useAuth } from '../hooks/useAuth';
import { useThemeContext } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function FeedbackWidget() {
    const { theme } = useThemeContext();
    const isDark = theme === 'dark';
    
    const [isOpen, setIsOpen] = useState(false);
    const [feedback, setFeedback] = useState('');
    const [type, setType] = useState('general');
    const [status, setStatus] = useState('idle'); // idle | submitting | success | error

    const bg = isDark ? '#161616' : '#ffffff';
    const border = isDark ? '#2a2a2a' : '#e5e7eb';
    const text1 = isDark ? '#ededed' : '#111111';
    const text2 = isDark ? '#a1a1aa' : '#6b7280';
    const accent = isDark ? '#ededed' : '#111111';

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!feedback.trim()) return;

        setStatus('submitting');
        try {
            // Call backend API which sends email to developer
            try {
                await apiPost('/feedback', { type, message: feedback });
            } catch (apiError) {
                console.error("Feedback submit error:", apiError);
                throw apiError;
            }
            
            setStatus('success');
            setTimeout(() => {
                setIsOpen(false);
                setFeedback('');
                setStatus('idle');
            }, 2000);
        } catch (err) {
            console.error(err);
            setStatus('error');
        }
    };

    return (
        <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999 }}>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        style={{
                            position: 'absolute',
                            bottom: '60px',
                            right: '0',
                            width: '320px',
                            background: bg,
                            border: `1px solid ${border}`,
                            borderRadius: '16px',
                            boxShadow: isDark ? '0 12px 40px rgba(0,0,0,0.5)' : '0 12px 40px rgba(0,0,0,0.1)',
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                    >
                        <div style={{ padding: '16px', borderBottom: `1px solid ${border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '14px', fontWeight: 600, color: text1, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <MessageSquare size={16} /> Send Feedback
                            </span>
                            <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: text2, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                                <X size={16} />
                            </button>
                        </div>

                        {status === 'success' ? (
                            <div style={{ padding: '40px 20px', textAlign: 'center', color: '#22c55e' }}>
                                <div style={{ fontSize: '32px', marginBottom: '8px' }}>✨</div>
                                <div style={{ fontSize: '14px', fontWeight: 600 }}>Thank you for your feedback!</div>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <select 
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '10px 12px',
                                        borderRadius: '8px',
                                        border: `1px solid ${border}`,
                                        background: isDark ? '#000' : '#f9fafb',
                                        color: text1,
                                        fontSize: '13px',
                                        outline: 'none'
                                    }}
                                >
                                    <option value="general">General Feedback</option>
                                    <option value="bug">Report a Bug</option>
                                    <option value="feature">Feature Request</option>
                                </select>
                                
                                <textarea
                                    placeholder="What's on your mind?"
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                    rows={4}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        borderRadius: '8px',
                                        border: `1px solid ${border}`,
                                        background: isDark ? '#000' : '#f9fafb',
                                        color: text1,
                                        fontSize: '13px',
                                        resize: 'none',
                                        outline: 'none',
                                        fontFamily: 'inherit'
                                    }}
                                />

                                <button
                                    type="submit"
                                    disabled={!feedback.trim() || status === 'submitting'}
                                    style={{
                                        background: accent,
                                        color: isDark ? '#000' : '#fff',
                                        border: 'none',
                                        padding: '12px',
                                        borderRadius: '8px',
                                        fontSize: '13px',
                                        fontWeight: 600,
                                        cursor: feedback.trim() ? 'pointer' : 'not-allowed',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px',
                                        opacity: feedback.trim() ? 1 : 0.5
                                    }}
                                >
                                    {status === 'submitting' ? 'Sending...' : <><Send size={14} /> Submit</>}
                                </button>
                            </form>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '24px',
                    background: accent,
                    color: isDark ? '#000' : '#fff',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: isDark ? '0 8px 24px rgba(255,255,255,0.1)' : '0 8px 24px rgba(0,0,0,0.2)',
                    transition: 'transform 0.2s',
                    transform: isOpen ? 'scale(0.9)' : 'scale(1)'
                }}
            >
                {isOpen ? <X size={20} /> : <MessageSquare size={20} />}
            </button>
        </div>
    );
}
