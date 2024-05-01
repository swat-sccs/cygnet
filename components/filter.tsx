'use client'
import React, { ChangeEvent } from 'react';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import filterData from '../data/filterData.json';
interface FilterProps {
    filterOn: boolean;
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
        <div className={props.filterOn ? "absolute filterwindow bg-gray-50/25 dark:bg-gray-800/25 grid gap-4 grid-cols-3 grid-rows-2 mx-2" : "absolute opacity-0 invisible"}>
            <div className="grow flex-col w-full col-span-3">
                <p className="h4 font-semibold text-2xl dark:text-white ml-1">Filters</p>
            </div>
            <div className="grow flex-col w-full col-span-1">
                <div className="filterSelect shadow w-full g-0">
                    <select className="w-full" value={dorm} onChange={handleDormChange} title="Dorm">
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
                <div className="filterSelect shadow w-full g-0">
                    <select className="w-full" value={gradYear} onChange={handleYearChange} title="Year">
                        <option >Class Year</option>
                        {yearsList.map((year) => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="grow flex-col w-full col-span-1">
                <button className="filterButton shadow w-full" onClick={handleReset}>Reset</button>
            </div>
        </div>
    )
}
