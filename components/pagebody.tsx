"use client"
import { useState } from "react";
import CardBody from "./cardbody";
import SearchBar from "./searchbar";
import { UserInfo } from "../app/page"

export default function PageBody( {data} : {data: any}) {
  // const fdata = await fetch('../app/api/db/');
  // console.log(fdata);

  data = data.response;
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState('');
  const filteredData = data.filter((item: any) =>
  `${item.FIRST_NAME} ${item.LAST_NAME} ${item.DORM_ROOM}`
    .toLowerCase()
    .includes(searchQuery.toLowerCase().trim()) &&
  `${item.DORM}${item.GRAD_YEAR}`
    .toLowerCase()
    .includes(filters.toLowerCase())
  );

  return (
    <>
        <SearchBar setSearchQuery={setSearchQuery} setFilters={setFilters}/>
        <CardBody filteredData={filteredData}/>
    </>
  )
}
