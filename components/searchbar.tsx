'use client'
import search from '../public/imgs/graysearch.svg';
import line from '../public/imgs/line.svg';
import chevron from '../public/imgs/chevron.svg';
import { ChangeEvent } from 'react';
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
        <div className="container-md">
                <div className="bg-white margin-spacing rounded-pill d-inline-flex align-items-center w-full px-4 shadow-sm py-3 position-relative">
                    <Image src={search} alt="search" className="search-size-g" />
                    <input
                        type="search"
                        className="flex-grow-1 mx-4 mont border-0 searchbar"
                        onChange={(e) => {
                            handleSearch(e.target.value);
                        }}
                        placeholder="Search for Swarthmore College students..."
                        defaultValue={searchParams.get('query')?.toString()} />
                    <Image src={line} alt="|" className="search-size-g" />
                    <Image src={chevron} alt="filters" onClick={() => setFilterOn(!filterOn)} className={filterOn ? "chevron-down chevron" : "chevron"} />
                    <Filter filterOn={filterOn} setFilters={handleFilters} />
                </div>
        </div>
    )
}
