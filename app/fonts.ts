import { Montserrat, Play } from 'next/font/google'

export const mont = Montserrat({
    subsets: ['latin', 'latin-ext'],
    display: 'swap',
    weight: ['300', '400', '500', '700'],
    variable: '--font-mont',
});

export const play = Play({
    subsets: ['latin', 'latin-ext'],
    display: 'swap',
    style: 'normal',
    weight: ['400', '700'],
    variable: '--font-play',
});
