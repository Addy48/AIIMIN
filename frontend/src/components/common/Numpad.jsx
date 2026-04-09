import React, { useEffect, useCallback } from 'react';

/**
 * Numpad — A 3x4 grid locker-style number pad.
 * Escalated to "Premium Obsidian Gold" standard with physical depth and reactive lighting.
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
        const isBackspace = btn === '⌫';

        return {
            height: '64px',
            background: isSpecial ? 'rgba(255,255,255,0.01)' : 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 'var(--r-md)',
            color: isBackspace ? '#ff5f5f' : (btn === 'C' ? 'var(--color-accent)' : 'var(--color-text-1)'),
            fontSize: '22px',
            fontFamily: btn === '⌫' ? 'sans-serif' : 'var(--font-mono)',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.1s cubic-bezier(0.4, 0, 0.2, 1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            userSelect: 'none',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), inset 0 1px 1px rgba(255,255,255,0.03)',
            position: 'relative',
            overflow: 'hidden'
        };
    };

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px',
            width: '100%',
            maxWidth: '340px',
            marginTop: '28px'
        }}>
            {buttons.map((btn, idx) => (
                <button
                    key={idx}
                    type="button"
                    onClick={() => handleClick(btn)}
                    style={getButtonStyle(btn)}
                    onMouseDown={(e) => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                        e.currentTarget.style.borderColor = 'var(--color-accent)';
                        e.currentTarget.style.transform = 'translateY(1px) scale(0.96)';
                        e.currentTarget.style.boxShadow = '0 0 15px var(--color-accent-glow), inset 0 2px 4px rgba(0,0,0,0.3)';
                    }}
                    onMouseUp={(e) => {
                        e.currentTarget.style.transform = 'translateY(0) scale(1)';
                        e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.1), inset 0 1px 1px rgba(255,255,255,0.03)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0) scale(1)';
                        e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.1), inset 0 1px 1px rgba(255,255,255,0.03)';
                        e.currentTarget.style.background = (btn === '⌫' || btn === 'C') ? 'rgba(255,255,255,0.01)' : 'rgba(255,255,255,0.03)';
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                    }}
                >
                    {btn}
                </button>
            ))}
        </div>
    );
};

export default Numpad;
