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
        event.target.value === "Dorms" ? setDorm("") : setDorm(event.target.value);
    }
    const handleYearChange = (event: ChangeEvent<HTMLSelectElement>) => {
        event.target.value === "Class Year" ? setGradYear("") : setGradYear(event.target.value);
    }

    const handleReset = () => {
        setDorm("");
        setGradYear("");
    }
    return (
        <div className="absolute filterwindow-wrapper z-30">
            <AnimateHeight
                id="filter-panel"
                duration={500}
                height={props.filterHeight} // see props documentation below
            >
                <div className="filterwindow bg-gray-50/25 dark:bg-primary-800/25 grid gap-4 grid-cols-3 grid-rows-2 m-5">
                    <div className="grow flex-col w-full col-span-3">
                        <p className="font-semibold text-2xl dark:text-white ml-1">Filters</p>
                    </div>
                    <div className="grow flex-col w-full col-span-1">
                        <div className="filterSelect shadow w-full g-0 rounded-full bg-primary-400 hover:bg-primary-500 dark:bg-primary-800 text-white dark:hover:bg-primary-900 border-0">
                            <select className="w-full text-black" value={dorm} onChange={handleDormChange} title="Dorm">
                                <option>Dorms</option>
                                {dormsList.map((dormName) => (
                                    <option key={dormName} value={dormName}>
                                        {dormName}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="grow flex-col w-full col-span-1">
                        <div className="filterSelect shadow w-full g-0 rounded-full bg-primary-400 hover:bg-primary-500 dark:bg-primary-800 text-white dark:hover:bg-primary-900 border-0">
                            <select className="w-full text-black" value={gradYear} onChange={handleYearChange} title="Year">
                                <option >Class Year</option>
                                {yearsList.map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="grow flex-col w-full col-span-1 rounded-full bg-primary-600 text-white border-0">
                        <button className="filterButton rounded-full shadow w-full bg-transparent" onClick={handleReset}>Reset</button>
                    </div>
                </div>
            </AnimateHeight>
        </div>
    )
}
