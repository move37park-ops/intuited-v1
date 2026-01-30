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
        },
    },
    plugins: [],
};
