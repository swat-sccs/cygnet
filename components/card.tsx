import styles from "./card.module.css"
import UserImage from "./userimage"
import UserInfo from "./userinfo"
import userinfo from './userinfo'

export default function Card() {
  return (
    <>
        <div className={styles.container}>
            <UserImage />
            <UserInfo />
        </div>
    </>
    
  )
}
