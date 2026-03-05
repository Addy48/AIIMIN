import React from 'react';
import useTheme from '../hooks/useTheme';

const Logo = ({ size = 28, style = {} }) => {
    const { theme } = useTheme();
    const isLight = theme === 'light';

    return (
        <img
            src="/logo-aiimin.png"
            alt="AIIMIN Logo"
            style={{
                width: size,
                height: size,
                objectFit: 'contain',
                flexShrink: 0,
                // If the logo is white-on-dark:
                // In dark mode: 'screen' drops the dark bg and keeps white lines.
                // In light mode: 'invert(1)' + 'multiply' makes it black-on-light, dropping the light bg.
                mixBlendMode: isLight ? 'multiply' : 'screen',
                filter: isLight ? 'invert(1)' : 'none',
                ...style
            }}
        />
    );
};

export default Logo;
