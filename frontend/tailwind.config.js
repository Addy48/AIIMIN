/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                /* Obsidian Gold — Dark */
                obsidian: "#050505",
                "obsidian-surface": "#101010",
                "obsidian-raised": "#1A1A1A",

                /* Alabaster Stone — Light */
                alabaster: "#FAFAF9",
                "alabaster-warm": "#F5F0E8",

                /* Gold accent */
                gold: "#D4AF37",
                "gold-light": "#E5C14A",
                "gold-muted": "#CA8A04",

                /* Silver / Muted */
                silver: "#8E8E93",

                /* Semantic — preserved from original */
                complete: "#5CB87A",
                incomplete: "#78716C",
            },
            fontFamily: {
                display: ["'Bodoni Moda'", "Georgia", "serif"],
                sans: ["'Jost'", "Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
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
                pill: "9999px",
            },
        },
    },
    plugins: [],
};
