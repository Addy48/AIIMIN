import React from 'react';
import useTheme from '../hooks/useTheme';

const Logo = ({ size = 28, style = {} }) => {
    const { theme } = useTheme();
    const isLight = theme === 'light';

    return (
        <img
            src="/logo-light.jpg"
            alt="AIIMIN Logo"
            style={{
                width: size,
                height: size,
                objectFit: 'contain',
                flexShrink: 0,
                mixBlendMode: isLight ? 'multiply' : 'screen',
                filter: isLight ? 'none' : 'invert(1) grayscale(1) brightness(2)',
                ...style
            }}
        />
    );
};

export default Logo;
