import styles from './userimage.module.css'
import Image from 'next/image'
export default function UserImage() {
  return (
    <>
        <div className={styles.format}>
            <Image 
            src="/../public/placeholder-image-person-jpg.jpeg"
            alt="image of person"
            width = {150}
            height = {150}
            />
        </div>
    </> 
  )
}
