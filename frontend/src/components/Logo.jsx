import React from 'react';
import useTheme from '../hooks/useTheme';

const Logo = ({ size = 28, style = {} }) => {
    const { theme } = useTheme();
    const isLight = theme === 'light';

    return (
        <div
            className="aiimin-logo-container"
            aria-label="AIIMIN Logo"
            style={{
                width: size,
                height: size,
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'center',
                flexShrink: 0,
                borderRadius: size > 40 ? '16px' : '8px',
                ...style
            }}
        >
            <img
                src="/logo-light.jpg"
                alt="AIIMIN Icon"
                style={{
                    width: '105%',
                    height: '145%',
                    objectFit: 'cover',
                    objectPosition: 'top center',
                    mixBlendMode: isLight ? 'darken' : 'screen',
                    // In light mode: darken blend drops the beige bg.
                    // In dark mode: invert makes brown white and beige black. Contrast ensures bg is pure black and logo is pure white.
                    filter: isLight ? 'contrast(1.02)' : 'invert(1) grayscale(1) contrast(5) brightness(1.1)',
                    opacity: isLight ? 1 : 0.9, // match dark mode text softness
                    transform: 'translateY(-2%)'
                }}
            />
        </div>
    );
};

export default Logo;
