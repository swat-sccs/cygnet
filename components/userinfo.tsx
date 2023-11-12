
import { StudentInfo } from "@/app/page";
export default function UserInfo(props: StudentInfo) {
  const { LAST_NAME, FIRST_NAME, GRAD_YEAR, DORM, DORM_ROOM, USER_ID, PHOTO } = props;
  return (
    <div className="mont mt-2 text-center">
        <div className="h4 mb-0">{FIRST_NAME} {LAST_NAME}</div>
        <p className="font-light mb-0">he/him</p> {/*get pronouns from where*/}
        <div className="h6 font-light mt-3">{DORM} {DORM_ROOM} | {GRAD_YEAR}</div>
        <div className="h6 mt-3">{USER_ID}</div>

    </div> 
  )
}
