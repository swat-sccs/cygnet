export const dynamic = 'force-dynamic'
import 'bootstrap/dist/css/bootstrap.css';
import './globals.css';
import './createDb'; // creates ITS database pool connection
import { queryDb } from './queryDb';
import { promises as fs } from 'fs';
import { Suspense } from 'react';
import SearchBar from '@/components/searchbar';
import CardBody from '@/components/cardbody';

export interface StudentInfo {
    FIRST_NAME: string;
    LAST_NAME: string;
    GRAD_YEAR: string;
    DORM: string;
    DORM_ROOM: string;
    USER_ID: string;
    PHOTO: any | undefined; // base64
}

function base64ArrayBuffer(arrayBuffer: Uint8Array) {
    var base64 = ''
    var encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

    var bytes = new Uint8Array(arrayBuffer)
    var byteLength = bytes.byteLength
    var byteRemainder = byteLength % 3
    var mainLength = byteLength - byteRemainder

    var a, b, c, d
    var chunk

    // Main loop deals with bytes in chunks of 3
    for (var i = 0; i < mainLength; i = i + 3) {
        // Combine the three bytes into a single integer
        chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2]

        // Use bitmasks to extract 6-bit segments from the triplet
        a = (chunk & 16515072) >> 18 // 16515072 = (2^6 - 1) << 18
        b = (chunk & 258048) >> 12 // 258048   = (2^6 - 1) << 12
        c = (chunk & 4032) >> 6 // 4032     = (2^6 - 1) << 6
        d = chunk & 63               // 63       = 2^6 - 1

        // Convert the raw binary segments to the appropriate ASCII encoding
        base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d]
    }

    // Deal with the remaining bytes and padding
    if (byteRemainder == 1) {
        chunk = bytes[mainLength]

        a = (chunk & 252) >> 2 // 252 = (2^6 - 1) << 2

        // Set the 4 least significant bits to zero
        b = (chunk & 3) << 4 // 3   = 2^2 - 1

        base64 += encodings[a] + encodings[b] + '=='
    } else if (byteRemainder == 2) {
        chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1]

        a = (chunk & 64512) >> 10 // 64512 = (2^6 - 1) << 10
        b = (chunk & 1008) >> 4 // 1008  = (2^6 - 1) << 4

        // Set the 2 least significant bits to zero
        c = (chunk & 15) << 2 // 15    = 2^4 - 1

        base64 += encodings[a] + encodings[b] + encodings[c] + '='
    }

    return base64
}

async function filterData({ user_settings, rawPromise }: { user_settings: any; rawPromise: Promise<any> }) {
    console.time("awaitRawPromise")
    let raw: StudentInfo[] = JSON.parse(JSON.stringify(await rawPromise));
    console.timeEnd("awaitRawPromise")
    let data: StudentInfo[] = [];

    console.time("foreach")
    raw.forEach((student) => {
        if(student.USER_ID in user_settings[0]['EXCLUDED_USERS']) {
            return;
        }

        let photo = (student.USER_ID in user_settings[0]['PHOTO_HIDDEN']) ?
                undefined : base64ArrayBuffer(student.PHOTO.data)
        
        let newStudent : StudentInfo = {
            FIRST_NAME: student.FIRST_NAME,
            LAST_NAME: student.LAST_NAME,
            GRAD_YEAR: student.GRAD_YEAR,
            DORM: student.DORM,
            DORM_ROOM: student.DORM_ROOM,
            USER_ID: student.USER_ID,
            PHOTO: photo
        }

        if (student.USER_ID in user_settings[0]['ROOM_HIDDEN']) {
            newStudent.DORM_ROOM = '';
            newStudent.DORM = '';
        }

        data.push(newStudent)
    })
    console.timeEnd("foreach")

    return data;
}

export default async function Home({searchParams} : {searchParams?: {
    query?: string;
    filters?: string;
}}) {
    const searchQuery = searchParams?.query || '';
    const filters = searchParams?.filters || '';
    // absolute path to settings file: /usr/src/app/student_settings/
    const file = await fs.readFile('/usr/src/app/student_settings/student_settings.txt', 'utf8');
    // const file = fs.readFileSync(path.resolve(__dirname, '../../../student_settings/student_settings.txt', { encoding: 'utf8', flag: 'r' }));
    const user_settings = JSON.parse(file);

    // start querying db
    console.time("dbquery");
    let rawPromise = queryDb("SELECT * FROM student_data WHERE DORM='Wharton' ")

    const filteredData = filterData({ user_settings, rawPromise }).then(raw => {
        console.timeEnd("dbquery")
        return raw.filter((item: any) =>
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
            <SearchBar />
            <CardBody filteredData={filteredData} />
        </>
    );
}
