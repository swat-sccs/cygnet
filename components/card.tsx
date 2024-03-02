import { Suspense } from "react";
import UserImage from "./userimage"
import UserInfo from "./userinfo"
import { StudentInfo } from "@/app/page";

export default function Card(props: StudentInfo | any) {
    //probably can just use props -abhi
    if (props.id) {
        return (
            <>
                <div className="d-flex align-items-center flex-column bg-white rounded-lg pt-3 pb-2 width-full position-relative cont shadow-sm">
                    <Suspense fallback={<UserImage />}>
                        <UserImage
                            photo_path={props.photo_path}
                        //NEWPHOTO = {NEWPHOTO}
                        /> {/*sourced from where?*/}
                    </Suspense>
                    <UserInfo
                        first={props.first}
                        last={props.last}
                        year={props.year}
                        dorm={props.dorm}
                        room={props.room}
                        id={props.id}
                        photo_path={props.photo_path}
                    //NEWPHOTO = {NEWPHOTO}
                    />
                </div>
            </>
        )
    } else {
        return (
            <>
                <div className="d-flex align-items-center flex-column bg-white rounded-lg pt-3 pb-2 width-full position-relative cont shadow-sm">
                    <UserImage />
                    <UserInfo />
                </div>
            </>
        )
    }
}
