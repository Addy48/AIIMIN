import React from 'react';
import useTheme from '../hooks/useTheme';

const Logo = ({ size = 28, style = {} }) => {
    const { theme } = useTheme();
    const isLight = theme === 'light';

    const src = isLight ? '/light_cropped_removed.jpeg' : '/dark_cropped_removed.jpeg';

    return (
        <img
            src={src}
            alt="AIIMIN"
            aria-label="AIIMIN Logo"
            width={size}
            height={size}
            style={{
                display: 'block',
                flexShrink: 0,
                borderRadius: size > 48 ? '20px' : '10px',
                objectFit: 'cover',
                ...style
            }}
        />
    );
};

export default Logo;
