import { Inter } from 'next/font/google'

// Single typeface, matching SwatGPT. Weights: 400 body, 500 UI, 600 headings.
export const inter = Inter({
    subsets: ['latin', 'latin-ext'],
    display: 'swap',
    variable: '--font-inter',
});
