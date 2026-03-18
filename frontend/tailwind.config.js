/** @type {import('tailwindcss').Config} */
module.exports = {
content: ["./src/**/*.{js,jsx,ts,tsx}"],
darkMode: "class",
theme: {
extend: {
colors: {
bgDark: "#1a1a1a",
cardDark: "#2d2d2d",
accent: "#ff6b35",
complete: "#10b981",
incomplete: "#6b7280",
bgLight: "#f9f9f9",
cardLight: "#ffffff",
},
},
},
plugins: [],
};
