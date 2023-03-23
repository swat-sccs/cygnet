import UserImage from "./userimage"
import UserInfo from "./userinfo"
import Image from "next/image"

import enlarge from '../public/imgs/enlarge.svg';

export default function Card() {
  return (
    <>
        <div className="d-flex align-items-center flex-column bg-white rounded-lg py-4 width-full position-relative cont shadow-sm">
            <UserImage />
            <UserInfo />
            <Image src = {enlarge} className="enlarge-properties" alt="enlarge" />
        </div>
    </>
    
  )
}
