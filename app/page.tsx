import 'bootstrap/dist/css/bootstrap.css';
import './globals.css';
import { Suspense } from 'react';
import { headers } from 'next/headers';
import SearchBar from '@/components/searchbar';
import PageBody from '@/components/pagebody';
import { auth } from '@/lib/auth';
import { signIn } from 'next-auth/react';
import { notFound } from 'next/navigation';

function IP() {
    const FALLBACK_IP_ADDRESS = '0.0.0.0'
    const forwardedFor = headers().get('x-forwarded-for')

    if (forwardedFor) {
        return forwardedFor.split(',')[0] ?? FALLBACK_IP_ADDRESS
    }

    return headers().get('x-real-ip') ?? FALLBACK_IP_ADDRESS
}

export default async function Home({ searchParams }: {
    searchParams?: {
        query?: string;
        filters?: string;
    }
}) {

    // check ip or authentication
    const clientIPArr = IP().split('.');
    if((clientIPArr[0].includes('130') && clientIPArr[1] === '58') ||
            (clientIPArr[0].includes('172')) || await auth()) {
        return (
            <div className="">
                <Suspense>
                    <SearchBar />
                </Suspense>
                <Suspense>
                    <PageBody searchParams={searchParams} />
                </Suspense>
            </div>
        );
    }

    // otherwise sign in
    notFound();
}
