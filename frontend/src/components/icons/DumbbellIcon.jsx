/**
 * DumbbellIcon — replaces all gym emoji with a consistent dumbbell graphic.
 * Renders as inline SVG that scales with fontSize.
 */
export default function DumbbellIcon({ size = 20, color = 'currentColor', style = {} }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 64 64"
            width={size}
            height={size}
            style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}
            aria-label="Gym"
        >
            {/* Left weight plate outer */}
            <rect x="4" y="14" width="8" height="36" rx="3" fill={color} opacity="0.85" />
            {/* Left weight plate inner */}
            <rect x="12" y="18" width="6" height="28" rx="2" fill={color} opacity="0.65" />
            {/* Bar */}
            <rect x="18" y="28" width="28" height="8" rx="4" fill={color} opacity="0.45" />
            {/* Right weight plate inner */}
            <rect x="46" y="18" width="6" height="28" rx="2" fill={color} opacity="0.65" />
            {/* Right weight plate outer */}
            <rect x="52" y="14" width="8" height="36" rx="3" fill={color} opacity="0.85" />
        </svg>
    );
}
