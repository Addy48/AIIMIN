import React from 'react';

/**
 * AIIMIN Logo — uses the official A-mark from logo-symbol.svg
 * The mark is a bold geometric "A" with a crossbar gap, representing
 * Adaptive Intelligence & Identity Management.
 */
export default function Logo({ size = 36 }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 512 512"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ display: 'block', flexShrink: 0 }}
        >
            {/* Green rounded square background */}
            <rect width="512" height="512" rx="120" fill="#23503B" />

            {/* White A mark — clean geometric letterform */}
            <path
                d="M256 88L96 424h72l28-64h120l28 64h72L256 88zm-36 218l36-84 36 84H220z"
                fill="#FFFFFF"
            />
        </svg>
    );
}
