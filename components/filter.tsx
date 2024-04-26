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
        <div className={props.filterOn ? "position-absolute filterwindow d-flex row mx-2 mont" : "position-absolute opacity-0 invisible"}>
            <p className="h4 font-semibold col-12 gx-2 gy-2">Filters</p>
            <div className="col-12 col-md-4 gx-2 gy-2">
                <div className="filterSelect shadow-md row w-100 g-0 px-2">
                    <select className="col-10" value={dorm} onChange={handleDormChange} title="Dorm">
                        <option>Dorms</option>
                        {dormsList.map((dormName) => (
                            <option key={dormName} value={dormName}>
                                {dormName}
                            </option>
                        ))}
                    </select>
                    <div className="col-2 p-0 d-inline-flex align-items-center justify-content-end px-2">
                        <Image className="chevron-sm" src="/imgs/chevron.svg" width={30} height={30} alt="" />
                    </div>
                </div>
            </div>
            <div className="col-12 col-md-4 gx-2 gy-2">
                <div className="filterSelect shadow-md row w-100 g-0 px-2">
                    <select className="col-10" value={gradYear} onChange={handleYearChange} title="Year">
                        <option >Class Year</option>
                        {yearsList.map((year) => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>
                    <div className="col-2 p-0 d-inline-flex align-items-center justify-content-end px-2">
                        <Image className="chevron-sm" src="/imgs/chevron.svg" width={30} height={30} alt="" />
                    </div>
                </div>
            </div>
            <div className="col-12 col-md-4 gx-2 gy-2">
                <button className="filterButton shadow-md w-100" onClick={handleReset}>Reset</button>
            </div>
        </div>
    )
}
