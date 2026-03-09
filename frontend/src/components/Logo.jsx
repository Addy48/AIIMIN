import React from 'react';
import useTheme from '../hooks/useTheme';

const Logo = ({ style = {} }) => {
    const { theme } = useTheme();
    const isLight = theme === 'light';

    const src = isLight ? '/light_cropped_removed.jpeg' : '/dark_cropped_removed.jpeg';

    return (
        <div className="logo-container" style={style} aria-label="AIIMIN Logo">
            <img
                src={src}
                alt="AIIMIN"
                className="logo-image"
            />
        </div>
    );
};

export default Logo;
