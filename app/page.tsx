"use client"
import 'bootstrap/dist/css/bootstrap.css';
import './globals.css';

import Head from 'next/head';

import Nav from '../components/nav';
import PageBody from '../components/pagebody';

export default function Home() {
  
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <body>
        <Nav />
        <div className="container">
          <PageBody />
        </div>
      </body>
    </>
  )
}
