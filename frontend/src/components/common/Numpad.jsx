import React, { useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Delete } from 'lucide-react';

/**
 * Numpad — Nordic Calm Edition
 * Minimalist circular keys with organic feedback.
 */
const Numpad = ({ onEntry, onDelete, onClear, maxLength = 6, currentLength = 0, isDark = true }) => {

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
        let color;
        let border;
        let background;
        const fontW = 700; // Extra prominent bold weight for supreme visibility
        
        if (isDark) {
            color = isSpecial && btn === 'C' ? 'rgba(255, 255, 255, 0.4)' : '#FFFFFF';
            border = '1px solid rgba(255, 255, 255, 0.08)';
            background = 'rgba(255, 255, 255, 0.03)';
        } else {
            // Nordic light theme: High contrast deep black text against solid white circular key
            color = isSpecial && btn === 'C' ? 'rgba(31, 32, 29, 0.5)' : '#000000';
            border = '1px solid rgba(31, 32, 29, 0.12)';
            background = '#ffffff';
        }

        return {
            width: '68px',
            height: '68px',
            background: background,
            border: border,
            borderRadius: '50%',
            color: color,
            fontSize: isSpecial ? '16px' : '26px', // Bold, extra-large for maximum readability
            fontFamily: 'var(--font-sans)',
            fontWeight: fontW,
            cursor: 'pointer',
            transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            userSelect: 'none',
            outline: 'none',
            boxShadow: isDark ? '0 4px 12px rgba(0,0,0,0.3)' : '0 4px 12px rgba(31,32,29,0.05)',
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
                        borderColor: isDark ? 'var(--color-accent)' : '#1E5C3A', // Nordic forest green for hover accent
                        color: isDark ? 'var(--color-accent)' : '#1E5C3A',
                        background: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(30, 92, 58, 0.08)',
                        boxShadow: isDark ? '0 6px 16px rgba(0,0,0,0.5)' : '0 6px 16px rgba(30,92,58,0.12)',
                        scale: 1.06,
                    }}
                    whileTap={{
                        scale: 0.94,
                        background: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(30, 92, 58, 0.14)'
                    }}
                >
                    {btn === '⌫' ? <Delete size={20} strokeWidth={2} /> : btn}
                </motion.button>
            ))}
        </div>
    );
};

export default Numpad;
