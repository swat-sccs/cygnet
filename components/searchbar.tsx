import styles from './searchbar.module.css'
export default function SearchBar() {
  return (
    <>
        <div className={styles.container}>
            <input type="text" placeholder="Search..." />
        </div>
    </> 
  )
}
