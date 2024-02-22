export const dynamic = 'force-dynamic'
import 'bootstrap/dist/css/bootstrap.css';
import './globals.css';
import './createDb'; // creates ITS database pool connection
import { queryDb } from './queryDb';

import PageBody from '../components/pagebody';
import Card from '@/components/card';

export interface StudentInfo {
  FIRST_NAME: string;
  LAST_NAME: string;
  GRAD_YEAR: string;
  DORM: string;
  DORM_ROOM: string;
  USER_ID: string;
  PHOTO: Uint8Array; // | object not permanent -- just to avoid type errors
}

export default async function Home() {
  // for now, grab photo (this takes 16 seconds as opposed to 0.2 without it)

  var start:Date = new Date()
  const raw:StudentInfo[] = JSON.parse(JSON.stringify(await queryDb("SELECT * FROM student_data WHERE DORM='Wharton'")));
  // const raw:StudentInfo[] = JSON.parse(JSON.stringify(await queryDb("SELECT FIRST_NAME, LAST_NAME, GRAD_YEAR, DORM, DORM_ROOM, USER_ID FROM student_data")));
  
  const data:StudentInfo[] = raw.map(a => {return {...a}}) // hard copy 
  // data.forEach((prof:StudentInfo) => {
  //   // prof.PHOTO = [] // does NOT deliver photo to client
  //   // phillip this is where you'll have to convert uint8Array to real images (it's okay 
  //   // if this is slow for now)
  //   // const imageDataArray = new Uint8ClampedArray(prof.PHOTO);
  //   // const image = new ImageData(imageDataArray, 100, 100);
    
  // })
  var end:Date = new Date();
  console.log(end.getTime()-start.getTime())

  return <PageBody data={data}/>
}
