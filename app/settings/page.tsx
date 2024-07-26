import { auth } from "@/lib/auth";
import SignIn from "@/components/signin";
import prisma from "../../lib/prisma";

import { getUser } from "@/app/actions";
import SnackbarWrapper from "@/components/snackwrapper";
import { StudentOverlay } from "@prisma/client";

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

        let user_data: StudentOverlay;

        if (user_data_prisma) {
            user_data = user_data_prisma;
        } else {
            user_data = cygnet_user_data
        }

        return (
            <SnackbarWrapper user_data={user_data}/>
        );
    }
    return <SignIn />;
}
