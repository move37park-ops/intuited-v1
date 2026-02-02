/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "#000000",
                foreground: "#ffffff",
                primary: "#66fcf1",
                secondary: "#e5e7eb",
                accent: "#45a29e",
                surface: "#0a0a0a",
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
            animation: {
                'slow-pan': 'pan 20s linear infinite alternate',
                'bounce-slow': 'bounce 3s infinite',
                'pulse-slow': 'pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'spin-extremely-slow': 'spin 60s linear infinite',
            },
            keyframes: {
                pan: {
                    '0%': { transform: 'scale(1.05) translate(0%, 0%)' },
                    '100%': { transform: 'scale(1.15) translate(-2%, -2%)' },
                },
            },
            fontFamily: {
                sans: ["var(--font-pretendard)", "Inter", "sans-serif"],
            },
        },
    },
    plugins: [],
};
