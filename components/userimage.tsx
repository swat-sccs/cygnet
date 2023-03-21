import Image from 'next/image'
export default function UserImage() {
  return (
    <>
        <div>
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
