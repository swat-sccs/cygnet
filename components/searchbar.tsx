'use client'
import Image from 'next/image';
import Filter from './filter';
import { useState } from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';

interface SearchbarProps {
    setSearchQuery: (query: string) => void;
    setFilters: (query: string) => void;
}

export default function SearchBar() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    function handleSearch(term: string) {
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set('query', term);
        } else {
            params.delete('query');
        }
        replace(`${pathname}?${params.toString()}`);
    }

    function handleFilters(term: string) {
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set('filters', term);
        } else {
            params.delete('filters');
        }
        replace(`${pathname}?${params.toString()}`);
    }

    const [filterOn, setFilterOn] = useState(false);

    return (
        <div className="flex justify-center">
            <div className="max-w-screen-lg md:mx-auto mt-4 grow">
                <div className="bg-white dark:bg-dark-blue rounded-full inline-flex items-center w-full px-6 shadow py-3 relative">
                    <svg width="30" height="30" viewBox="0 0 39 39" fill="none" className="stroke-gray-500 dark:stroke-white" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.9538 30.1576C24.9494 30.1576 30.6204 24.4865 30.6204 17.4909C30.6204 10.4953 24.9494 4.82422 17.9538 4.82422C10.9582 4.82422 5.28711 10.4953 5.28711 17.4909C5.28711 24.4865 10.9582 30.1576 17.9538 30.1576Z" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M33.7869 33.324L26.8994 26.4365" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>

                    <input
                        type="search"
                        className="grow flex-row mx-4 mont border-0 bg-transparent searchbar text-black dark:text-white"
                        onChange={(e) => {
                            handleSearch(e.target.value);
                        }}
                        placeholder="Search for Swarthmore College students..."
                        defaultValue={searchParams.get('query')?.toString()} />
                    <svg className="stroke-gray-500 dark:stroke-white" width="30" height="30" viewBox="0 0 3 52" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <line x1="1.18359" y1="0.314453" x2="1.18359" y2="51.2774" stroke-width="2" />
                    </svg>

                    <svg className="stroke-gray-500 dark:stroke-white" onClick={() => setFilterOn(!filterOn)} width="30" height="30" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.01855 13.9951L17.7686 22.7451L26.5186 13.9951" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    <Filter filterOn={filterOn} setFilters={handleFilters} />
                </div>
            </div>
        </div>
    )
}
