import 'bootstrap/dist/css/bootstrap.css';
import './globals.css';

import Head from 'next/head';

import Nav from '../components/nav';
import SearchBar from '../components/searchbar';
import CardBody from '../components/cardbody';
import useSWR from 'swr';

export default function Home() {
  
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <body>
        <Nav />
        <div className="container">
          <SearchBar/>
          <CardBody />
        </div>
      </body>
    </>
  )
}
