import search from '../public/imgs/graysearch.svg';
import line from '../public/imgs/line.svg';
import chevron from '../public/imgs/chevron.svg';

import Image from 'next/image';

export default function SearchBar() {
  return (
    <>
        <div className="bg-white margin-spacing rounded-pill d-inline-flex align-items-center w-full px-4 shadow-sm py-3">
          <Image src = {search} alt = "search" className="search-size-g"/>
          <input
          type = "search"
          className = "flex-grow-1 mx-4 mont border-0 searchbar"
          placeholder="Search for Swarthmore College students..." />
          <Image src={line} alt="|" className="search-size-g" />
          <Image src={chevron} alt="V" className="search-size-g"/>
        </div>
    </> 
  )
}
