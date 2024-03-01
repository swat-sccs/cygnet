import { Suspense } from "react";
import UserImage from "./userimage"
import UserInfo from "./userinfo"

export default function Card(props: any) {
    //probably can just use props -abhi
    const { LAST_NAME, FIRST_NAME, GRAD_YEAR, DORM, DORM_ROOM, USER_ID, PHOTO } = props;
    if (USER_ID) {
        return (
            <>
                <div className="d-flex align-items-center flex-column bg-white rounded-lg pt-3 pb-2 width-full position-relative cont shadow-sm">
                    <Suspense fallback={<UserImage />}>
                        <UserImage
                            FIRST_NAME={FIRST_NAME}
                            LAST_NAME={LAST_NAME}
                            GRAD_YEAR={GRAD_YEAR}
                            DORM={DORM}
                            DORM_ROOM={DORM_ROOM}
                            USER_ID={USER_ID}
                            PHOTO={PHOTO}
                        //NEWPHOTO = {NEWPHOTO}
                        /> {/*sourced from where?*/}
                    </Suspense>
                    <UserInfo
                        FIRST_NAME={FIRST_NAME}
                        LAST_NAME={LAST_NAME}
                        GRAD_YEAR={GRAD_YEAR}
                        DORM={DORM}
                        DORM_ROOM={DORM_ROOM}
                        USER_ID={USER_ID}
                        PHOTO={PHOTO}
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
