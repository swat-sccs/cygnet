"use client";
import UserImage from "./userimage";
import UserInfo from "./userinfo";
import { StudentInfo } from "@/components/pagebody";

export default function Card(props: StudentInfo | any) {
  //probably can just use props -abhi
  if (props.id && props.showProfile) {
    return (
      <div className="align-items-center bg-white rounded-lg py-3 px-2 cont shadow-sm flex-fill flex-grow-1 h-100">
        <UserImage
          photo_path={props.showPicture ? props.photo_path : "/placeholder.jpg"}
          button={props.button ? props.button : false}
          //NEWPHOTO = {NEWPHOTO}
        />{" "}
        {/*sourced from where?*/}
        <UserInfo
          first={props.first}
          last={props.last}
          year={props.year}
          dorm={(props.showDorm && props.dorm) ? props.dorm : "Room Not Shown"}
          room={props.showDorm ? props.room : ""}
          id={props.id}
          photo_path={props.showPicture ? props.photo_path : "/placeholder.jpg"}
          pronouns={props.pronouns}
          //NEWPHOTO = {NEWPHOTO}
        />
      </div>
    );
  } else {
    return (
      <div className="align-items-center bg-white rounded-lg py-3 px-2 cont shadow-sm">
        <UserImage />
        <UserInfo />
      </div>
    );
  }
}
