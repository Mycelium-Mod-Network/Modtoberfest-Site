/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    theme: {
        extend: {
            colors: {
                brand: {
                    100: '#ADB2B9',
                    200: '#999EA5',
                    300: '#858A91',
                    400: '#71767D',
                    500: '#5D6269',
                    600: '#494E55',
                    700: '#353A41',
                    800: '#21262D',
                    900: '#0D1219'
                }
            },
            fontFamily: {
                mono: [
                    "Menlo",
                    "Monaco",
                    "Consolas",
                    '"Liberation Mono"',
                    '"Courier New"',
                    "monospace",
                ],
                brand: [
                    "Viga",
                    "Montserrat",
                    "system-ui",
                    "-apple-system",
                    "BlinkMacSystemFont",
                    '"Segoe UI"',
                    "Roboto",
                    '"Helvetica Neue"',
                    "Arial",
                    '"Noto Sans"',
                    "sans-serif",
                    '"Apple Color Emoji"',
                    '"Segoe UI Emoji"',
                    '"Segoe UI Symbol"',
                    '"Noto Color Emoji"',
                ],
            },
            typography: {
                DEFAULT: {
                    css: {
                        'blockquote p:first-of-type::before': null,
                        'blockquote p:last-of-type::after': null,
                    },
                },
            },
        },
        animation: {
            'spin-slow': 'spin 3s linear infinite',
        }
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
}
