import { Suspense } from 'react';
import { headers } from 'next/headers';
import SearchBar from '@/components/searchbar';
import PageBody from '@/components/pagebody';
import { auth } from '@/lib/auth';
import SignIn from '@/components/signin';
import { MOCK_ENABLED } from '@/lib/mock';

async function IP() {
    const FALLBACK_IP_ADDRESS = '0.0.0.0'
    const curHeaders = await headers()
    const forwardedFor = curHeaders.get('x-forwarded-for')

    if (forwardedFor) {
        return forwardedFor.split(',')[0] ?? FALLBACK_IP_ADDRESS
    }

    return curHeaders.get('x-real-ip') ?? FALLBACK_IP_ADDRESS
}

type SearchParams = Promise<{
    query?: string;
    filters?: string;
}>

export default async function Home({ searchParams }: { searchParams: SearchParams }) {
    // check ip or authentication
    const clientIPArr = (await IP()).split('.');
    if(MOCK_ENABLED || (clientIPArr[0].includes('130') && clientIPArr[1] === '58') ||
            (clientIPArr[0].includes('172')) || await auth()) {
        return (
            <div className="px-4 flex flex-col flex-grow">
                <Suspense>
                    <SearchBar />
                </Suspense>
                <Suspense>
                    <PageBody searchParams={await searchParams} />
                </Suspense>
            </div>
        );
    }

    // otherwise sign in
    return <SignIn />;
}
