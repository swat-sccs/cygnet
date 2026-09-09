'use client'
import React, { ChangeEvent } from 'react';
import { useState, useEffect } from 'react';
import filterData from '../data/filterData.json';
import AnimateHeight, { Height } from 'react-animate-height';

interface FilterProps {
    filterHeight: Height;
    setFilters: (query: string) => void;
}

const dormsList = filterData[0].DORMS;
const currentYear = new Date().getFullYear();
const yearsList = Array.from({ length: 4 }, (_, i) => currentYear + i)

const selectClass = "w-full h-10 rounded-xl bg-surface-2 border border-transparent focus:border-line-2 focus:bg-surface text-fg text-sm px-3 pr-9 appearance-none focus:ring-0 focus:outline-none transition";
const labelClass = "block text-xs font-medium text-fg-3 uppercase tracking-wider mb-1.5";

function ChevronDown() {
    return (
        <svg
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-fg-3"
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
    );
}

export default function Filter(props: FilterProps) {
    const { setFilters } = props;
    const [dorm, setDorm] = useState('');
    const [gradYear, setGradYear] = useState('');

    useEffect(() => {
        handleFilterChange();
    }, [dorm, gradYear]);

    const handleFilterChange = () => {
        let filterString = "";
        if (dorm)
            filterString += dorm;
        if (dorm && gradYear)
            filterString += ',';
        if (gradYear)
            filterString += gradYear;

        setFilters(filterString);
    }
    const handleDormChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setDorm(event.target.value === "" ? "" : event.target.value);
    }
    const handleYearChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setGradYear(event.target.value === "" ? "" : event.target.value);
    }

    const handleReset = () => {
        setDorm("");
        setGradYear("");
    }

    const hasSelection = dorm !== "" || gradYear !== "";

    return (
        <AnimateHeight
            id="filter-panel"
            duration={250}
            easing="cubic-bezier(0.22, 1, 0.36, 1)"
            height={props.filterHeight}
        >
            <div className="mt-3 rounded-2xl bg-surface border border-line shadow-card p-4 sm:p-5">
                <div className="flex items-center justify-between mb-4">
                    <p className="text-sm font-semibold text-fg">Filters</p>
                    <button
                        type="button"
                        className="text-sm text-fg-2 hover:text-fg rounded-md px-1.5 -mr-1.5 transition disabled:opacity-50 disabled:pointer-events-none"
                        onClick={handleReset}
                        disabled={!hasSelection}
                    >
                        Reset
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                        <label htmlFor="filter-dorm" className={labelClass}>Dorm</label>
                        <div className="relative">
                            <select
                                id="filter-dorm"
                                className={selectClass}
                                value={dorm}
                                onChange={handleDormChange}
                                title="Dorm"
                            >
                                <option value="">All dorms</option>
                                {dormsList.map((dormName) => (
                                    <option key={dormName} value={dormName}>
                                        {dormName}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="filter-year" className={labelClass}>Class year</label>
                        <div className="relative">
                            <select
                                id="filter-year"
                                className={selectClass}
                                value={gradYear}
                                onChange={handleYearChange}
                                title="Year"
                            >
                                <option value="">All years</option>
                                {yearsList.map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown />
                        </div>
                    </div>
                </div>
            </div>
        </AnimateHeight>
    )
}
