import UserImage from "./userimage"
import UserInfo from "./userinfo"

export interface Data {
  LAST_NAME: string;
  FIRST_NAME: string;
  GRAD_YEAR: string;
  DORM: string;
  DORM_ROOM: string;
  EMAIL_ADDRESS: string;
}
export default function Card( props: Data ) {
  const { LAST_NAME, FIRST_NAME, GRAD_YEAR, DORM, DORM_ROOM, EMAIL_ADDRESS } = props;
  return (
    <>
        <div className="d-flex align-items-center flex-column bg-white rounded-lg pt-3 pb-2 width-full position-relative cont shadow-sm">
            <UserImage /> {/*sourced from where?*/}
            <UserInfo 
                FIRST_NAME={FIRST_NAME} 
                LAST_NAME = {LAST_NAME} 
                GRAD_YEAR = {GRAD_YEAR} 
                DORM = {DORM} 
                DORM_ROOM = {DORM_ROOM} 
                EMAIL_ADDRESS = {EMAIL_ADDRESS}
            />
        </div>
    </>
  )
}
