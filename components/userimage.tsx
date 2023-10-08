import Image from 'next/image'
import eroth from '../public/imgs/eroth.jpeg'

export default function UserImage() {
  return (
    <> 
    {/*IMAGE MUST BE SQUARE*/}
        <div className="w-full relative d-flex justify-content-center">
            <Image 
            src={eroth}
            alt="image of person"
            className="rounded-circle gradBorder"
            />
        </div>
    </> 
  )
}
