import styles from './page.module.css'
import Nav from '../components/nav';
import SearchBar from '../components/searchbar'
import CardBody from '../components/cardbody';
export default function Home() {
  return (
    <main className={styles.main}>
      <Nav />
      <SearchBar />
      <CardBody />
    </main>
  )
}
