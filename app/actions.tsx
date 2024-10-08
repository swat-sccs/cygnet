'use server'

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import fs from "fs";
import { DbInfo } from "@/components/pagebody";
import { queryDb } from "./queryDb";

import sharp from 'sharp';

import BadWordsNext from "bad-words-next";
import en from 'bad-words-next/data/en.json';
import { StudentOverlay } from "@prisma/client";

export async function getUser(id: string | undefined) {
    if (!id) {
        notFound();
    }

    // @ts-ignore
    const raw: any[] =
        await queryDb(`SELECT FIRST_NAME, LAST_NAME, GRAD_YEAR, DORM, DORM_ROOM \
        FROM student_data WHERE USER_ID='${id}' `);

    const student: DbInfo = raw[0];

    let path = "/placeholder.jpg";

    const modPath = `/mod/${id}_m.jpg`;
    const genModPath = `${__dirname}/../../../../photos${modPath}`;

    // production needs domain due to external static server
    // dev uses next public dir b/c doesn't need build-time copy
    const staticPath = `/${id}.jpg`;
    const genPath = `${__dirname}/../../../../photos${staticPath}`;

    if (fs.existsSync(genModPath)) {
        path = modPath;
    } else if (fs.existsSync(genPath)) {
        //path = fullPath
        path = staticPath;
    } else {
        const imgBuffer = await queryDb(
            `SELECT PHOTO FROM student_data WHERE USER_ID='${id}' `
        );

        // @ts-ignore
        fs.writeFileSync(genPath, imgBuffer[0]["PHOTO"]);
        // path = fullPath
        path = staticPath;
    }

    const user_data: StudentOverlay = {
        firstName: student["FIRST_NAME"],
        lastName: student["LAST_NAME"],
        gradYear: student["GRAD_YEAR"],
        dorm: student["DORM"],
        dormRoom: student["DORM_ROOM"],
        uid: id,
        photoPath: path,
        pronouns: "",
        showDorm: true,
        showPhoto: true,
        showProfile: true,
    };

    return user_data;
}

export async function submitData(prevState: {
    message: string;
}, formData: FormData) {
    const badwords = new BadWordsNext({ data: en });
    const session = await auth();

    if (session && session.user) {

        if (badwords.check(formData.get("fName")?.toString() || "")
            || badwords.check(formData.get("lName")?.toString() || "")
            || badwords.check(formData.get("pNouns")?.toString() || "")) {
            return { message: "Inappropriate language detected!" };
        }

        const id = session.user.email?.split("@")[0];
        if (!id) return { message: "ID not found!" };

        let photo_path = (await getUser(id)).photoPath;

        const picData = formData.get("picFile") as File;
        if (picData) {
            const modPath = `/mod/${id}_m.jpg`;
            const genModPath = `${__dirname}/../../../../photos${modPath}`;

            const imageReader = picData.stream().getReader();
            const imageDataU8: number[] = [];

            while (true) {

                const { done, value } = await imageReader.read();
                if (done) break;

                //@ts-ignore
                imageDataU8.push(...value);

            }

            //@ts-ignore
            const imageBinary = Buffer.from(imageDataU8, 'binary');

            try {
                await sharp(imageBinary)
                    .toFormat('jpg')
                    .toFile(genModPath);

                photo_path = modPath;
            } catch (e) {
                console.log("Did not save!");
            }
        }

        const rawFormData = {
            firstName: formData.get("fName")?.toString() || "",
            lastName: formData.get("lName")?.toString() || "",
            pronouns: formData.get("pNouns")?.toString() || "",
            showDorm: formData.get("showDorm"),
            showPhoto: formData.get("showPhoto"),
            showProfile: formData.get("showProfile"),
        };

        //@ts-ignore
        const itsRecord: any[] = await queryDb(`SELECT GRAD_YEAR, DORM, DORM_ROOM \
            FROM student_data WHERE USER_ID='${id}' `);

        await prisma.studentOverlay.upsert({
            where: {
                uid: id,
            },
            update: {
                firstName: rawFormData.firstName,
                lastName: rawFormData.lastName,
                pronouns: rawFormData.pronouns,
                photoPath: photo_path,
                showProfile: rawFormData.showProfile === "on" ? true : false,
                showDorm: rawFormData.showDorm === "on" ? true : false,
                showPhoto: rawFormData.showPhoto === "on" ? true : false,
            },
            create: {
                uid: id,
                firstName: rawFormData.firstName,
                lastName: rawFormData.lastName,
                pronouns: rawFormData.pronouns,
                photoPath: photo_path,
                dorm: itsRecord[0]["DORM"],
                dormRoom: itsRecord[0]["DORM_ROOM"],
                gradYear: itsRecord[0]["GRAD_YEAR"],
                showProfile: rawFormData.showProfile === "on" ? true : false,
                showDorm: rawFormData.showDorm === "on" ? true : false,
                showPhoto: rawFormData.showPhoto === "on" ? true : false,
            },
        });

        return { message: "Done!" };
    }

    return { message: "Not authenticated!" };
}
