'use client'
import { Suspense, useState } from "react";
import CardBody from "./cardbody";
import SearchBar from "./searchbar";

export interface StudentInfo {
    FIRST_NAME: string;
    LAST_NAME: string;
    GRAD_YEAR: string;
    DORM: string;
    DORM_ROOM: string;
    USER_ID: string;
    PHOTO: Uint8Array; // | object not permanent -- just to avoid type errors
}

async function filterData({ userSettings, rawPromise }: { userSettings: any; rawPromise: Promise<any> }) {
    let raw: StudentInfo[] = JSON.parse(JSON.stringify(await rawPromise));

    raw = raw.filter((student) => {
        return !(student.USER_ID in userSettings[0]['EXCLUDED_USERS']);
    })

    raw.forEach((student) => {

        if (student.USER_ID in userSettings[0]['ROOM_HIDDEN']) {
            student.DORM_ROOM = '';
            student.DORM = '';
        }

        if (student.USER_ID in userSettings[0]['PHOTO_HIDDEN']) {
            student.PHOTO = new Uint8Array();
        }
    })

    return raw;
}

export default function PageBody({ userSettings, rawPromise }: { userSettings: any; rawPromise: Promise<any> }) {

    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState('');

    const filteredData = filterData({ userSettings, rawPromise }).then(raw => {
        const data: StudentInfo[] = raw.map(a => { return { ...a } }) // hard copy

        return data.filter((item: any) =>
            `${item.FIRST_NAME} ${item.LAST_NAME} ${item.DORM_ROOM}`
                .toLowerCase()
                .includes(searchQuery.toLowerCase().trim()) &&
            `${item.DORM}${item.GRAD_YEAR}`
                .toLowerCase()
                .includes(filters.toLowerCase())
        );
    })

    return (
        <>
            <SearchBar setSearchQuery={setSearchQuery} setFilters={setFilters} />
            <Suspense fallback={<CardBody filteredData={undefined} />}>
                <CardBody filteredData={filteredData} />
            </Suspense>
        </>
    )
}
