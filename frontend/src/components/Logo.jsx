import React from 'react';

export default function Logo({ size = 36 }) {
    return (
        <svg 
            width={size} 
            height={size} 
            viewBox="0 0 512 512" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            style={{ 
                display: "block",
                filter: "drop-shadow(0 4px 12px rgba(35, 80, 59, 0.2))"
            }}
        >
            {/* Background Shape: Soft Hexagon/Nordic Shield */}
            <path 
                d="M256 32L448 128V384L256 480L64 384V128L256 32Z" 
                fill="#23503B" 
            />
            
            {/* Inner A-Symbol */}
            <path 
                d="M256 140L360 360H310L256 240L202 360H152L256 140Z" 
                fill="white" 
            />
            
            {/* Decorative Geometric Line */}
            <path 
                d="M180 300H332" 
                stroke="white" 
                strokeWidth="12" 
                strokeLinecap="round" 
                strokeOpacity="0.4"
            />
            
            {/* Subtle Outer Ring */}
            <path 
                d="M256 32L448 128V384L256 480L64 384V128L256 32Z" 
                stroke="white" 
                strokeWidth="4" 
                strokeOpacity="0.1"
            />
        </svg>
    );
}
