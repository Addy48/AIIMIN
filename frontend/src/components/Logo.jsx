import React from 'react';
import { useThemeContext } from '../context/ThemeContext';

/**
 * AIIMIN Logo — exact path from favicon-dark.svg / favicon-light.svg
 * Dark mode:  parchment fill (#f2ebda) on transparent bg
 * Light mode: dark ink fill (#23503B) on transparent bg
 * With bg:    white mark on forest-green square (navbar use)
 */
const LOGO_PATH = `
  M 256.00 90.00
  C 220.00 90.00 195.00 120.00 170.00 170.00
  L 95.00 330.00
  C 60.00 405.00 65.00 445.00 110.00 465.00
  C 155.00 485.00 195.00 455.00 215.00 405.00
  L 225.00 380.00
  L 225.00 305.00
  L 175.00 320.00
  L 256.00 195.00
  L 337.00 320.00
  L 287.00 305.00
  L 287.00 380.00
  L 297.00 405.00
  C 317.00 455.00 357.00 485.00 402.00 465.00
  C 447.00 445.00 452.00 405.00 417.00 330.00
  L 342.00 170.00
  C 317.00 120.00 292.00 90.00 256.00 90.00
  Z
`;

export default function Logo({ size = 36, withBg = true }) {
  const { theme } = useThemeContext();
  const isDark = theme === 'dark';

  if (withBg) {
    // Navbar variant: premium gradient on green rounded square
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 512 512"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block', flexShrink: 0, filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }}
      >
        <defs>
          <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2D6A4F" />
            <stop offset="100%" stopColor="#1B4332" />
          </linearGradient>
        </defs>
        <rect width="512" height="512" rx="120" fill="url(#logoGrad)" />
        <path d={LOGO_PATH} fill="#FFFFFF" fillOpacity="0.95" />
      </svg>
    );
  }

  // Standalone variant: adapts to theme
  const fill = isDark ? '#f2ebda' : '#23503B';
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', flexShrink: 0 }}
    >
      <path d={LOGO_PATH} fill={fill} />
    </svg>
  );
}
