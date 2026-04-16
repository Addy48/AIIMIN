import React, { useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Delete, X } from 'lucide-react';

/**
 * Numpad — Nordic Calm Edition
 * Minimalist circular keys with organic feedback.
 */
const Numpad = ({ onEntry, onDelete, onClear, maxLength = 6, currentLength = 0 }) => {

    const handleKeyPress = useCallback((e) => {
        if (e.key >= '0' && e.key <= '9') {
            if (currentLength < maxLength) {
                onEntry(e.key);
            }
        } else if (e.key === 'Backspace') {
            onDelete();
        } else if (e.key === 'Escape') {
            onClear();
        }
    }, [onEntry, onDelete, onClear, currentLength, maxLength]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [handleKeyPress]);

    const buttons = [
        '1', '2', '3',
        '4', '5', '6',
        '7', '8', '9',
        'C', '0', '⌫'
    ];

    const handleClick = (btn) => {
        if (btn === '⌫') {
            onDelete();
        } else if (btn === 'C') {
            onClear();
        } else {
            if (currentLength < maxLength) {
                onEntry(btn);
            }
        }
    };

    const getButtonStyle = (btn) => {
        const isSpecial = btn === '⌫' || btn === 'C';
        return {
            width: '64px',
            height: '64px',
            background: 'transparent',
            border: '1px solid var(--color-border)',
            borderRadius: '50%',
            color: isSpecial && btn === 'C' ? 'var(--color-text-3)' : 'var(--color-text-1)',
            fontSize: isSpecial ? '14px' : '20px',
            fontFamily: 'var(--font-mono)',
            fontWeight: 300,
            cursor: 'pointer',
            transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            userSelect: 'none',
            outline: 'none',
        };
    };

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '24px',
            width: '100%',
            maxWidth: '280px',
            marginTop: '8px'
        }}>
            {buttons.map((btn, idx) => (
                <motion.button
                    key={idx}
                    type="button"
                    onClick={() => handleClick(btn)}
                    style={getButtonStyle(btn)}
                    whileHover={{
                        borderColor: 'var(--color-accent)',
                        color: 'var(--color-accent)',
                        background: 'rgba(68, 99, 79, 0.05)'
                    }}
                    whileTap={{
                        scale: 0.92,
                        background: 'rgba(68, 99, 79, 0.1)'
                    }}
                >
                    {btn === '⌫' ? <Delete size={18} strokeWidth={1.5} /> : btn}
                </motion.button>
            ))}
        </div>
    );
};

export default Numpad;
