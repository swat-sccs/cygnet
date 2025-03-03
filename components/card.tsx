"use client";
import { StudentOverlay } from "@prisma/client";
import UserImage from "./userimage";
import UserInfo from "./userinfo";

export default function Card(props: StudentOverlay | any) {
  if (props.uid && props.showProfile) {
    return (
      <div className="items-center bg-white dark:bg-dark-blue rounded-lg py-6 px-3 cont shadow-md grow h-full transform transition hover:scale-125 hover:shadow-lg hover:z-50">
        <UserImage
          photo_path={props.showPhoto ? props.photoPath : "/placeholder.jpg"}
          button={(props.button && props.showPhoto) ? props.button : false}
        />{" "}
        <UserInfo
          firstName={props.firstName}
          lastName={props.lastName}
          gradYear={props.gradYear}
          dorm={(props.showDorm && props.dorm) ? props.dorm : "Room Not Shown"}
          dormRoom={props.showDorm ? props.dormRoom : ""}
          uid={props.uid}
          photoPath={props.showPhoto ? props.photoPath : "/placeholder.jpg"}
          pronouns={props.pronouns}
          showDorm={props.showDorm}
          showPhoto={props.showPhoto}
          showProfile={props.showProfile}
        />
      </div>
    );
  } else {
    return (
      <div className="items-center justify-center bg-white dark:bg-dark-blue rounded-lg py-6 px-3 cont shadow-md grow h-full transform transition hover:scale-125 hover:shadow-lg hover:z-50">
        <UserImage />
        <UserInfo />
      </div>
    );
  }
}
