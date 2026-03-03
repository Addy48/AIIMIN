import React from 'react';
import useTheme from '../hooks/useTheme';

const Logo = ({ size = 28, style = {}, forceColor }) => {
    const { theme } = useTheme();
    const color = forceColor || (theme === 'dark' ? '#F5A623' : '#0A0A0F');

    return (
        <div
            style={{
                width: size,
                height: size,
                backgroundColor: color,
                WebkitMaskImage: 'url(/logo-aiimin.png)',
                WebkitMaskSize: 'contain',
                WebkitMaskRepeat: 'no-repeat',
                WebkitMaskPosition: 'center',
                maskImage: 'url(/logo-aiimin.png)',
                maskSize: 'contain',
                maskRepeat: 'no-repeat',
                maskPosition: 'center',
                flexShrink: 0,
                ...style
            }}
            aria-label="AIIMIN Logo"
        />
    );
};

export default Logo;
