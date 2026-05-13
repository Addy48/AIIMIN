import React from 'react';

export default function Logo({ size = 36 }) {
    return (
        <svg 
            width={size} 
            height={size} 
            viewBox="0 0 100 100" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            style={{ display: "block" }}
        >
            {/* Stylized A - Left Pillar */}
            <path 
                d="M32 85L48 20H40L24 85H32Z" 
                fill="currentColor" 
            />
            {/* Stylized A - Right Pillar */}
            <path 
                d="M68 85L52 20H60L76 85H68Z" 
                fill="currentColor" 
            />
            {/* Central Sparkle/Star */}
            <path 
                d="M50 32C50 42 54 45 62 45C54 45 50 48 50 58C50 48 46 45 38 45C46 45 50 42 50 32Z" 
                fill="currentColor" 
            />
        </svg>
    );
}
