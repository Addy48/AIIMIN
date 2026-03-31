/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    darkMode: ["selector", "[data-theme='dark']"],
    theme: {
        extend: {
            colors: {
                /* CSS Variable bridges — use these for Tailwind classes */
                surface: {
                    primary: "var(--bg-primary)",
                    card: "var(--bg-card)",
                    elevated: "var(--bg-elevated)",
                    glass: "var(--bg-surface)",
                },
                accent: {
                    DEFAULT: "var(--accent)",
                    hover: "var(--accent-hover)",
                    dim: "var(--accent-dim)",
                },
                content: {
                    1: "var(--text-1)",
                    2: "var(--text-2)",
                    3: "var(--text-3)",
                },

                /* Static palette */
                gold: "#D4AF37",
                "gold-light": "#E5C14A",
                "gold-muted": "#CA8A04",
                silver: "#8E8E93",
                complete: "#5CB87A",
                incomplete: "#78716C",
            },
            fontFamily: {
                display: ["'Bodoni Moda'", "Georgia", "serif"],
                heading: ["'Jost'", "sans-serif"],
                sans: ["'Jost'", "Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
                mono: ["'SF Mono'", "Menlo", "Monaco", "monospace"],
            },
            spacing: {
                "space-1": "4px",
                "space-2": "8px",
                "space-3": "12px",
                "space-4": "16px",
                "space-5": "24px",
                "space-6": "32px",
                "space-7": "40px",
                "space-8": "48px",
                "space-9": "64px",
            },
            backdropBlur: {
                glass: "20px",
            },
            boxShadow: {
                glass: "0 4px 30px rgba(0, 0, 0, 0.5), inset 0 0 0 1px rgba(255,255,255,0.05)",
                "glass-gold": "0 4px 24px rgba(212, 175, 55, 0.2), 0 0 0 1px rgba(212, 175, 55, 0.12)",
                gold: "0 4px 24px rgba(212, 175, 55, 0.2), 0 0 0 1px rgba(212, 175, 55, 0.12)",
            },
            borderRadius: {
                glass: "20px",
                pill: "9999px",
            },
        },
    },
    plugins: [],
};
