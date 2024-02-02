export const dynamic = 'force-dynamic'
import 'bootstrap/dist/css/bootstrap.css';
import './globals.css';
import './createDb';
import { queryDb } from './queryDb';

import PageBody from '../components/pagebody';

export interface StudentInfo {
  FIRST_NAME: string;
  LAST_NAME: string;
  GRAD_YEAR: string;
  DORM: string;
  DORM_ROOM: string;
  USER_ID: string;
  PHOTO: Uint8Array; //what should this be
}


export default async function Home() {
  const raw = await queryDb("SELECT FIRST_NAME, LAST_NAME, GRAD_YEAR, DORM, DORM_ROOM, USER_ID FROM student_data")
  const data:StudentInfo[] = raw ? raw : []

  return <PageBody data={data}/>
}
