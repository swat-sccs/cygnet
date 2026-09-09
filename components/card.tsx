"use client";
import { StudentOverlay } from "@prisma/client";
import UserImage from "./userimage";
import UserInfo from "./userinfo";

const cardClass =
  "group relative flex flex-col items-center text-center bg-surface border border-line rounded-2xl p-5 shadow-card transition duration-200 hover:shadow-card-hover hover:-translate-y-0.5 hover:border-line-2 h-full animate-rise";

export default function Card(props: StudentOverlay | any) {
  if (props.uid && props.showProfile) {
    return (
      <div className={cardClass}>
        <UserImage
          photo_path={props.showPhoto ? props.photoPath : "/placeholder.jpg"}
          button={props.button && props.showPhoto ? props.button : false}
        />
        <UserInfo
          firstName={props.firstName}
          lastName={props.lastName}
          gradYear={props.gradYear}
          dorm={(props.showDorm && props.dorm) ? props.dorm : "Room Not Shown"}
          dormRoom={props.showDorm ? props.dormRoom : ""}
          uid={props.uid}
          photoPath={props.showPhoto ? props.photoPath : "/placeholder.jpg"}
          showDorm={props.showDorm}
          showPhoto={props.showPhoto}
          showProfile={props.showProfile}
        />
      </div>
    );
  }

  return (
    <div className={cardClass}>
      <UserImage />
      <UserInfo />
    </div>
  );
}
