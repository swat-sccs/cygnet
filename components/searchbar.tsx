'use client'
import search from '../public/imgs/graysearch.svg';
import line from '../public/imgs/line.svg';
import chevron from '../public/imgs/chevron.svg';
import { ChangeEvent } from 'react';
import Image from 'next/image';
import Filter from './filter';
import { useState } from 'react';

interface SearchbarProps {
  setSearchQuery: (query: string) => void;
  setFilters: (query: string) => void;
}

export default function SearchBar(props: SearchbarProps) {
  const [filterOn, setFilterOn] = useState(false);
  const {setSearchQuery, setFilters} = props;
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  return (
    <>
        <div className="bg-white margin-spacing rounded-pill d-inline-flex align-items-center w-full px-4 shadow-sm py-3 position-relative">
          <Image src = {search} alt = "search" className="search-size-g"/>
          <input
          type = "search"
          className = "flex-grow-1 mx-4 mont border-0 searchbar"
          onChange={handleInputChange}
          placeholder="Search for Swarthmore College students..." />
          <Image src={line} alt="|" className="search-size-g" />
          <Image src={chevron} alt="filters" onClick={()=>setFilterOn(!filterOn)} className={filterOn?"chevron-down chevron":"chevron"}/>
          <Filter filterOn = {filterOn} setFilters = {setFilters}/>
        </div>
    </> 
  )
}
