'use client'
import UserImage from "./userimage"
import UserInfo from "./userinfo"
import { StudentInfo } from "@/components/pagebody";

export default function Card(props: StudentInfo | any) {
    //probably can just use props -abhi
    if (props.id) {
        return (
            <div className="col-6 col-md-4 col-lg-3 gy-4">
                <div className="align-items-center bg-white rounded-lg pt-3 pb-2 cont shadow-sm">
                    <UserImage
                        photo_path={props.photo_path}
                    //NEWPHOTO = {NEWPHOTO}
                    /> {/*sourced from where?*/}
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
            </div>
        )
    } else {
        return (
            <div className="col-6 col-md-4 col-lg-3 gy-4">
                <div className="align-items-center bg-white rounded-lg pt-3 pb-2 cont shadow-sm">
                    <UserImage />
                    <UserInfo />
                </div>
            </div>
        )
    }
}
