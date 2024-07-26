import Nav from '@/components/nav'
import './globals.css'
import Script from 'next/script'
import { NextAuthProvider } from './NextAuthProvider';
import Footer from '@/components/footer';
import { mont } from './fonts';

export const metadata = {
    title: 'Cygnet',
    description: 'The Swarthmore student directory | by SCCS',
    generator: 'Cygnet',
    applicationName: 'Cygnet',
    keywords: ['Cygnet', 'Swarthmore', 'student', 'directory'],
    authors: [{ name: "SCCS", url: "https://sccs.swarthmore.edu"}],
    creator: "Swarthmore College Computer Society",
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <NextAuthProvider>
            <html lang="en" className={`${mont.className} font-medium`}>
                <body className="bg-page-bg-light dark:bg-page-bg-dark">
                    <Nav />
                    <div className="most-height py-4 flex flex-col">
                        {children}
                    </div>
                    <Footer/>
                </body>
                <Script src="https://kit.fontawesome.com/3d9fad96a7.js" crossOrigin="anonymous" />
            </html>
        </NextAuthProvider>
    )
}
