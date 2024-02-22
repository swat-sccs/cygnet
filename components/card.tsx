import UserImage from "./userimage"
import UserInfo from "./userinfo"
import { StudentInfo } from "@/app/page";

export default function Card( props: StudentInfo ) {
  //probably can just use props -abhi
  const { LAST_NAME, FIRST_NAME, GRAD_YEAR, DORM, DORM_ROOM, USER_ID, PHOTO } = props;
  return (
    <>
        <div className="d-flex align-items-center flex-column bg-white rounded-lg pt-3 pb-2 width-full position-relative cont shadow-sm">
            <UserImage
                FIRST_NAME={FIRST_NAME} 
                LAST_NAME = {LAST_NAME}
                GRAD_YEAR = {GRAD_YEAR} 
                DORM = {DORM} 
                DORM_ROOM = {DORM_ROOM} 
                USER_ID= {USER_ID}
                PHOTO = {PHOTO}
                //NEWPHOTO = {NEWPHOTO}
            /> {/*sourced from where?*/}
            <UserInfo 
                FIRST_NAME={FIRST_NAME} 
                LAST_NAME = {LAST_NAME}
                GRAD_YEAR = {GRAD_YEAR} 
                DORM = {DORM} 
                DORM_ROOM = {DORM_ROOM} 
                USER_ID= {USER_ID}
                PHOTO = {PHOTO}
                //NEWPHOTO = {NEWPHOTO}
            />
        </div>
    </>
  )
}
