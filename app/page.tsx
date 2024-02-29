export const dynamic = 'force-dynamic'
import 'bootstrap/dist/css/bootstrap.css';
import './globals.css';
import './createDb'; // creates ITS database pool connection
import { queryDb } from './queryDb';
import { promises as fs } from 'fs';
//import fs from 'fs';
//import path from 'path';
import PageBody from '../components/pagebody';

export default async function Home() {
    // absolute path to settings file: /usr/src/app/student_settings/
    const file = await fs.readFile('/usr/src/app/student_settings/student_settings.txt', 'utf8');
    // const file = fs.readFileSync(path.resolve(__dirname, '../../../student_settings/student_settings.txt', { encoding: 'utf8', flag: 'r' }));
    const user_settings = JSON.parse(file);

    // start querying db
    let rawPromise = queryDb("SELECT * FROM student_data WHERE DORM='Wharton'")

    return (
        <PageBody userSettings={user_settings} rawPromise={rawPromise} />
    );
}
