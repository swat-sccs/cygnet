import styles from "./cardbody.module.css"
import Card from './card'
export default function CardBody() {
  return (
    <>
        <div className={styles.container}>
            <Card />
            <Card />
            <Card />
            <Card />
        </div>
    </>
    
  )
}
