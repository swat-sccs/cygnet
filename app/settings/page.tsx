import { StudentInfo } from "@/components/pagebody";
import { auth } from "@/lib/auth";
import SignIn from "@/components/signin";
import prisma from "../../lib/prisma";

import { getUser } from "@/app/actions";
import SnackbarWrapper from "@/components/snackwrapper";

// will need to be loaded from our own database eventually,
// just UI functional for now

export default async function Settings() {
    // await auth check
    const session = await auth();
    if (session?.user) {
        const user_data_prisma = await prisma.studentOverlay.findUnique({
            where: {
                uid: session.user.email?.split("@")[0],
            },
        });

        const cygnet_user_data = await getUser(session.user.email?.split("@")[0]);

        let user_data: StudentInfo;

        if (user_data_prisma) {
            user_data = {
                first: user_data_prisma.firstName,
                last: user_data_prisma.lastName,
                pronouns: user_data_prisma.pronouns,
                id: user_data_prisma.uid,
                photo_path: user_data_prisma.photoPath,
                year: user_data_prisma.gradYear,
                dorm: user_data_prisma.dorm,
                room: user_data_prisma.dormRoom,
                showDorm: user_data_prisma.showDorm,
                showPicture: user_data_prisma.showPhoto,
                showProfile: user_data_prisma.showProfile,
            };
        } else {
            user_data = {
                first: cygnet_user_data.first,
                last: cygnet_user_data.last,
                pronouns: cygnet_user_data.pronouns,
                id: cygnet_user_data.id,
                year: cygnet_user_data.year,
                dorm: cygnet_user_data.dorm,
                room: cygnet_user_data.room,
                photo_path: cygnet_user_data.photo_path,
                showDorm: true,
                showPicture: true,
                showProfile: true,
            };
        }

        return (
            <SnackbarWrapper user_data={user_data}/>
        );
    }
    return <SignIn />;
}
