export const dynamic = 'force-dynamic'
import 'bootstrap/dist/css/bootstrap.css';
import './globals.css';
import './createDb'; // creates ITS database pool connection
import { queryDb } from './queryDb';
import fs, { writeFileSync } from 'fs';
import { Suspense } from 'react';
import SearchBar from '@/components/searchbar';
import CardBody from '@/components/cardbody';
import sharp from 'sharp';

export interface DbInfo {
    FIRST_NAME: string;
    LAST_NAME: string;
    GRAD_YEAR: string;
    DORM: string;
    DORM_ROOM: string;
    USER_ID: string;
}

export interface StudentInfo {
    first: string;
    last: string;
    year: string;
    dorm: string;
    room: string;
    id: string;
    photo_path: string;
}

async function filterData({ user_settings }: { user_settings: any }) {
    // start querying db
    console.time("dbquery");

    // @ts-ignore
    let raw : any[] = await
        queryDb("SELECT FIRST_NAME, LAST_NAME, GRAD_YEAR, DORM, DORM_ROOM, \
            USER_ID FROM student_data ");
    let data: StudentInfo[] = [];

    console.time("foreach")
    await Promise.all(raw.map(async (student) => {
        if (student['USER_ID'] in user_settings[0]['EXCLUDED_USERS']) {
            return;
        }

        let path = '/placeholder.jpg';

        if (!(student['USER_ID'] in user_settings[0]['PHOTO_HIDDEN'])) {
            const staticPath = `/photos/${student['USER_ID']}.jpg`
            const genPath = `/usr/src/app/public${staticPath}`;
            if(fs.existsSync(genPath)) {
                path = staticPath
            } else {
                const imgBuffer = await queryDb(`SELECT PHOTO FROM student_data WHERE USER_ID='${student['USER_ID']}' `)

                // @ts-ignore
                sharp(imgBuffer[0]['PHOTO'])
                    .jpeg()
                    .toFile(genPath).then(() => {
                        path = staticPath
                    })
            }
        }

        let newStudent: StudentInfo = {
            first: student['FIRST_NAME'],
            last: student['LAST_NAME'],
            year: student['GRAD_YEAR'],
            dorm: student['DORM'],
            room: student['DORM_ROOM'],
            id: student['USER_ID'],
            photo_path: path
        }

        if (student['USER_ID'] in user_settings[0]['ROOM_HIDDEN']) {
            newStudent.room = '';
            newStudent.dorm = '';
        }

        data.push(newStudent)
    }))
    console.timeEnd("foreach")

    return data;
}

export default async function Home({ searchParams }: {
    searchParams?: {
        query?: string;
        filters?: string;
    }
}) {
    const searchQuery = searchParams?.query || '';
    const filters = searchParams?.filters || '';
    // absolute path to settings file: /usr/src/app/student_settings/
    const file = await fs.promises.readFile('/usr/src/app/student_settings/student_settings.txt', 'utf8');
    // const file = fs.readFileSync(path.resolve(__dirname, '../../../student_settings/student_settings.txt', { encoding: 'utf8', flag: 'r' }));
    const user_settings = JSON.parse(file);

    const filteredData = filterData({user_settings}).then((data) => {
        data.filter((item: any) =>
        `${item.FIRST_NAME} ${item.LAST_NAME} ${item.DORM_ROOM}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase().trim()) &&
        `${item.DORM}${item.GRAD_YEAR}`
            .toLowerCase()
            .includes(filters.toLowerCase())
        )
        return data;
    });
    console.timeEnd("dbquery")

    return (
        <>
            <SearchBar />
            <CardBody filteredData={filteredData} />
        </>
    );
}
