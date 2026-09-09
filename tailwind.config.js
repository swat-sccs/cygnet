/** @type {import('tailwindcss').Config} */

// Semantic color tokens. The RGB triplets live in app/globals.css and flip
// automatically with prefers-color-scheme, so components never need `dark:`
// variants for color. Use `bg-surface`, `text-fg-2`, `border-line`, etc.
const token = (name) => `rgb(var(--${name}) / <alpha-value>)`;

module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
            },
            colors: {
                // page + surfaces
                "bg": token("bg"),
                "surface": token("surface"),
                "surface-2": token("surface-2"),
                "surface-3": token("surface-3"),
                // text
                "fg": token("fg"),
                "fg-2": token("fg-2"),
                "fg-3": token("fg-3"),
                // borders
                "line": token("line"),
                "line-2": token("line-2"),
                // brand accent (SwatGPT burnt orange)
                "accent": {
                    DEFAULT: token("accent"),
                    hover: token("accent-hover"),
                    fg: token("accent-fg"),
                    soft: token("accent-soft"),
                },
                "ring-token": token("ring"),
                // raw palette from swat-sccs/SwatGPT, for the rare one-off
                "paper": {
                    20: "#f6f2ea", 50: "#faf6ef", 100: "#f1ebe0", 200: "#e8e1d3", 300: "#d5d0c4",
                    card: "#fffdf8",
                },
                "ink": {
                    400: "#8a8f9c", 500: "#575c6a", 600: "#444a5a", 650: "#3a4050", 700: "#313646",
                    800: "#1a1f2e", 850: "#141825", 875: "#10141f", 900: "#0c101a",
                },
                "navy": {
                    20: "#f0f2f5", 50: "#eceff3", 100: "#d9d9d9", 200: "#bec7d1", 300: "#9fadbc",
                    400: "#929aa6", 500: "#4a566a", 600: "#343f52", 650: "#2b3546", 700: "#252e3e",
                    800: "#1a2332", 850: "#151d2b", 875: "#111722", 900: "#0c1019",
                },
            },
            borderRadius: {
                "xl2": "1.25rem",
            },
            boxShadow: {
                "card": "0 1px 2px rgb(0 0 0 / 0.04), 0 1px 3px rgb(0 0 0 / 0.06)",
                "card-hover": "0 10px 24px -8px rgb(0 0 0 / 0.16), 0 2px 6px rgb(0 0 0 / 0.06)",
                "pop": "0 12px 32px -8px rgb(0 0 0 / 0.28), 0 2px 8px rgb(0 0 0 / 0.08)",
            },
            transitionTimingFunction: {
                "out-expo": "cubic-bezier(0.22, 1, 0.36, 1)",
            },
            screens: {
                'xs': '0px',
                'sm': '640px',
                'md': '768px',
                'lg': '1024px',
                'xl': '1280px',
            },
        }
    },
    plugins: [require("@tailwindcss/forms")],
};
