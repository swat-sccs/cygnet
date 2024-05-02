"use client";
import UserImage from "./userimage";
import UserInfo from "./userinfo";
import { StudentInfo } from "@/components/pagebody";

export default function Card(props: StudentInfo | any) {
  //probably can just use props -abhi
  if (props.id && props.showProfile) {
    return (
      <div className="items-center bg-white dark:bg-dark-blue rounded-lg py-6 px-3 cont shadow grow h-full">
        <UserImage
          photo_path={props.showPicture ? props.photo_path : "/placeholder.jpg"}
          button={(props.button && props.showPicture) ? props.button : false}
        />{" "}
        <UserInfo
          first={props.first}
          last={props.last}
          year={props.year}
          dorm={(props.showDorm && props.dorm) ? props.dorm : "Room Not Shown"}
          room={props.showDorm ? props.room : ""}
          id={props.id}
          photo_path={props.showPicture ? props.photo_path : "/placeholder.jpg"}
          pronouns={props.pronouns}
        />
      </div>
    );
  } else {
    return (
      <div className="items-center justify-center bg-white dark:bg-dark-blue rounded-lg py-6 px-3 cont shadow grow h-full">
        <UserImage />
        <UserInfo />
      </div>
    );
  }
}
