/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx}", // Note the addition of the `app` directory.
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            spacing: {
                'most': '98%',
            },
            fontFamily: {
                sans: ["var(--font-mont)"],
                play: ["var(--font-play)"],
                mont: ["var(--font-mont)"],
            },
            colors: {
                'primary': {
                    '50': '#f5f7fa',
                    '100': '#eaedf4',
                    '200': '#cfd8e8',
                    '300': '#a5b8d4',
                    '400': '#7591bb',
                    '500': '#5474a3',
                    '600': '#44608f', /* this is cygnet primary */
                    '700': '#35496f',
                    '800': '#2f405d',
                    '900': '#2b384f',
                    '950': '#1d2434',
                },
                'sccs': {
                    '50': '#f5f7fa',
                    '100': '#eaedf4',
                    '200': '#d0d9e7',
                    '300': '#a6b7d3',
                    '400': '#7692ba',
                    '500': '#5574a2',
                    '600': '#425d87',
                    '700': '#364a6e',
                    '800': '#31425f', /* this is our primary */
                    '900': '#2c384e',
                },
                'gray': {
                    '50': '#f8f8f8',
                    '100': '#f1f1f1',
                    '200': '#dcdcdc',
                    '300': '#bdbdbd',
                    '400': '#989898',
                    '500': '#7c7c7c',
                    '600': '#656565',
                    '700': '#525252',
                    '800': '#464646',
                    '900': '#3d3d3d',
                    '950': '#292929',
                },
                "page-bg": {
                    "light": "#f1f1f1",
                    "dark": "#0d111a",
                },
                "card-bg": "#ffffff",
                "alt-blue": "#364a6d",
                "dark-blue": "#161e2c",
            },
            screens: {
                'xs': '0px',
                'sm': '640px',
                'md': '768px',
                'lg': '1280px',
                'xl': '2160px',
            },
        }
    },
    plugins: [require("@tailwindcss/forms")],
};
