import { useState } from "react";
import CardBody from "./cardbody";
import SearchBar from "./searchbar";
import data from '../data/data.json';

export default function PageBody() {
  const [searchQuery, setSearchQuery] = useState('');
  const filteredData = data.filter((item) =>
  `${item.FIRST_NAME} ${item.LAST_NAME} ${item.DORM} ${item.DORM_ROOM}`
    .toLowerCase()
    .includes(searchQuery.toLowerCase())
  );

  return (
    <>
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <CardBody filteredData={filteredData}/>
    </>
  )
}
