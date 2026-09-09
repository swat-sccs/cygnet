'use client'
import Filter from './filter';
import { useState } from 'react';
import { Height } from 'react-animate-height';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';

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

    const [filterHeight, setFilterHeight] = useState<Height>(0);
    const filtersOpen = filterHeight !== 0;
    const filtersActive = Boolean(searchParams.get('filters'));

    return (
        <div className="max-w-3xl mx-auto w-full px-4 sm:px-6 pt-8 sm:pt-12">
            <div className="relative flex items-center h-14 rounded-2xl bg-surface border border-line shadow-card focus-within:border-line-2 focus-within:shadow-card-hover transition">
                <svg
                    className="ml-4 h-5 w-5 shrink-0 text-fg-3"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                >
                    <circle cx="11" cy="11" r="7" />
                    <path d="m20 20-3.5-3.5" />
                </svg>

                <label htmlFor="student-search" className="sr-only">Search students</label>
                <input
                    id="student-search"
                    type="search"
                    className="flex-1 min-w-0 bg-transparent border-0 focus:ring-0 focus:outline-none text-base sm:text-lg text-fg placeholder:text-fg-3 px-3 [&::-webkit-search-cancel-button]:appearance-none"
                    onChange={(e) => {
                        handleSearch(e.target.value);
                    }}
                    placeholder="Search students by name, dorm, or class year"
                    autoComplete="off"
                    defaultValue={searchParams.get('query')?.toString()} />

                <button
                    type="button"
                    className="relative mr-2.5 h-9 px-3 rounded-full text-sm font-medium inline-flex items-center gap-1.5 border border-line bg-surface-2 hover:bg-surface-3 text-fg-2 hover:text-fg transition shrink-0"
                    aria-expanded={filtersOpen}
                    aria-controls="filter-panel"
                    onClick={() => setFilterHeight(filterHeight === 0 ? 'auto' : 0)}
                >
                    <svg
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                    >
                        <line x1="4" y1="7" x2="20" y2="7" />
                        <line x1="4" y1="12" x2="20" y2="12" />
                        <line x1="4" y1="17" x2="20" y2="17" />
                        <circle cx="9" cy="7" r="2" fill="currentColor" stroke="none" />
                        <circle cx="15" cy="12" r="2" fill="currentColor" stroke="none" />
                        <circle cx="10" cy="17" r="2" fill="currentColor" stroke="none" />
                    </svg>
                    <span>Filters</span>
                    <svg
                        className={`h-4 w-4 transition-transform duration-150 ease-out ${filtersOpen ? 'rotate-180' : ''}`}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                    >
                        <path d="m6 9 6 6 6-6" />
                    </svg>
                    {filtersActive && (
                        <span
                            className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-accent ring-2 ring-surface"
                            aria-hidden="true"
                        />
                    )}
                    {filtersActive && <span className="sr-only">(filters active)</span>}
                </button>
            </div>

            <Filter filterHeight={filterHeight} setFilters={handleFilters} />
        </div>
    )
}
