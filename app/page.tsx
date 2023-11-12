"use server"
import 'bootstrap/dist/css/bootstrap.css';
import './globals.css';

import PageBody from '../components/pagebody';

export interface UserInfo {
  FIRST_NAME: string;
  LAST_NAME: string;
  GRAD_YEAR: string;
  DORM: string;
  DORM_ROOM: string;
  USER_ID: string;
}


export default async function Home() {
  const getData = await fetch('http://localhost:3000/api/db', {cache: "no-store"});
  const data = await getData.json();
  console.log(data);
  return <PageBody data={data}/>
}
