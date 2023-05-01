import React, { ChangeEvent } from 'react';
import chevron from '../public/imgs/chevron.svg';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import filterData from '../data/filterData.json';
interface FilterProps {
    filterOn: boolean;
    setFilters: (query: string) => void;
}
const dormsList = filterData[0].DORMS;
const yearsList = filterData[0].YEARS;

export default function Filter(props: FilterProps) {
    const { setFilters } = props;
    const [ dorm, setDorm ] = useState('');
    const [ gradYear, setGradYear ] = useState('');

    useEffect(() => {
        handleFilterChange();
      }, [dorm, gradYear]);

    const handleFilterChange = () => {
        setFilters(dorm + gradYear);
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
    return(
        <div className={props.filterOn?"position-absolute filterwindow":"position-absolute opacity-0 invisible"}>
            <p className="h4 font-semibold">Filters</p>
            <div className="filterSelect shadow-lg d-inline-block position-relative">
                <select value={dorm} onChange={handleDormChange}>
                    <option selected>Dorms</option>
                    {dormsList.map( (dormName) => (
                        <option key={dormName} value={dormName}>
                            {dormName}
                        </option>  
                    ))}
                </select>
                <Image className="chevron-sm position-absolute" src = {chevron} alt="" />
            </div>
            <div className="filterSelect shadow-lg d-inline-block position-relative">
                <select value={gradYear} onChange={handleYearChange}>
                    <option selected>Class Year</option>
                    {yearsList.map( (year) => (
                        <option key={year} value={year}>
                            {year}
                        </option>  
                    ))}
                </select>
                <Image className="chevron-sm position-absolute" src = {chevron} alt="" />
            </div>
            <button className="filterButton shadow" onClick={handleReset}>Reset</button>
        </div>
    )
}