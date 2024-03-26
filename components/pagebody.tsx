export const dynamic = 'force-dynamic'
import '@/app/createDb'; // creates ITS database pool connection
import { queryDb } from '@/app/queryDb';
import fs from 'fs';
import { Suspense } from 'react';
import CardBody from './cardbody';

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

async function filterData({ user_settings, searchParams }: { user_settings: any, searchParams?: {
    query?: string;
    filters?: string;
} }) {
    const searchQuery = searchParams?.query || '';
    const filters = searchParams?.filters || '';

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
        
        if (searchQuery && !(`${student['FIRST_NAME']} ${student['LAST_NAME']} ${student['DORM_ROOM']}`
            .toLowerCase().includes(searchQuery.toLowerCase().trim()))) {
                return;
        }

        // TODO: Change 'filters' to be array ('Dana' filter currently overlaps with 'Danawell Hall')
        if (filters && !(`${student['DORM']}${student['GRAD_YEAR']}`
            .toLowerCase().includes(filters.toLowerCase().trim()))) {
            return;
        }

        let path = '/placeholder.jpg';

        if (!(student['USER_ID'] in user_settings[0]['PHOTO_HIDDEN'])) {
            const modPath = `/photos/mod/${student['USER_ID']}_m.jpg`;
            const genModPath = `${__dirname}/../../..${modPath}`;

            // production needs domain due to external static server
            // dev uses next public dir b/c doesn't need build-time copy
            const prePath = (process.env.NODE_ENV === "production") ? process.env.DOMAIN : "";
            const staticPath = `/photos/${student['USER_ID']}.jpg`;
            const genPath = `${__dirname}/../../..${staticPath}`;

            if (fs.existsSync(genModPath)) {
                path = prePath + modPath
            }
            else if(fs.existsSync(genPath)) {
                //path = fullPath
                path = prePath + staticPath
            } else {
                const imgBuffer = await queryDb(`SELECT PHOTO FROM student_data WHERE USER_ID='${student['USER_ID']}' `)

                // @ts-ignore
                fs.writeFileSync(genPath, imgBuffer[0]['PHOTO']);
                // path = fullPath
                path = prePath + staticPath
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

export default function PageBody({ searchParams }: {
    searchParams?: {
        query?: string;
        filters?: string;
    }
}) {
        // absolute path to settings file: cygnet/student_settings/
        const file = fs.readFileSync(`${__dirname}/../../../student_settings/student_settings.txt`, 'utf8');
        // const file = fs.readFileSync(path.resolve(__dirname, '../../../student_settings/student_settings.txt', { encoding: 'utf8', flag: 'r' }));
        const user_settings = JSON.parse(file);
    
        const filteredData = filterData({user_settings, searchParams})
    
        console.timeEnd("dbquery")

        return (
            <>
                <Suspense fallback={<CardBody filteredData={undefined} />}>
                    <CardBody filteredData={filteredData} />
                </Suspense>
            </>
        )
}

