import 'bootstrap/dist/css/bootstrap.css';
import './globals.css';
import { Suspense } from 'react';
import SearchBar from '@/components/searchbar';
import CardBody from '@/components/cardbody';
import PageBody from '@/components/pagebody';

export default async function Home({ searchParams }: {
    searchParams?: {
        query?: string;
        filters?: string;
    }
}) {

    return (
        <>
            <Suspense>
                <SearchBar />
            </Suspense>
            <Suspense>
                <PageBody searchParams={searchParams} />
            </Suspense>
        </>
    );
}
