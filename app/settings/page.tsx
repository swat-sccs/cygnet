import { DbInfo, StudentInfo } from "@/components/pagebody";
import { auth } from "@/lib/auth";
import fs from "fs";
import "bootstrap/dist/css/bootstrap.css";
import ForceSignin from "@/components/forceSignIn";
import { notFound, redirect } from "next/navigation";
import { queryDb } from "../queryDb";
import prisma from "../../lib/prisma";
import SettingsForm from "@/components/settingsform";

// will need to be loaded from our own database eventually,
// just UI functional for now

async function getUser(id: string | undefined) {
  if (!id) {
    notFound();
  }

  console.log("UID: " + id);
  const file = fs.readFileSync(
    `${__dirname}/../../../../student_settings/student_settings.json`,
    "utf8"
  );
  const user_settings = JSON.parse(file);

  // @ts-ignore
  const raw: any[] =
    await queryDb(`SELECT FIRST_NAME, LAST_NAME, GRAD_YEAR, DORM, DORM_ROOM \
        FROM student_data WHERE USER_ID='${id}' `);

  const student: DbInfo = raw[0];

  let path = "/placeholder.jpg";

  if (!user_settings[0]["PHOTO_HIDDEN"].includes(id)) {
    const modPath = `/photos/mod/${id}_m.jpg`;
    const genModPath = `${__dirname}/../../../..${modPath}`;
    console.log(genModPath);

    // production needs domain due to external static server
    // dev uses next public dir b/c doesn't need build-time copy
    const prePath =
      process.env.NODE_ENV === "production" ? process.env.DOMAIN : "";
    const staticPath = `/photos/${id}.jpg`;
    const genPath = `${__dirname}/../../../../${staticPath}`;

    if (fs.existsSync(genModPath)) {
      path = prePath + modPath;
    } else if (fs.existsSync(genPath)) {
      //path = fullPath
      path = prePath + staticPath;
    } else {
      const imgBuffer = await queryDb(
        `SELECT PHOTO FROM student_data WHERE USER_ID='${id}' `
      );

      // @ts-ignore
      fs.writeFileSync(genPath, imgBuffer[0]["PHOTO"]);
      // path = fullPath
      path = prePath + staticPath;
    }
  }

  const user_data: StudentInfo = {
    first: student["FIRST_NAME"],
    last: student["LAST_NAME"],
    year: student["GRAD_YEAR"],
    dorm: student["DORM"],
    room: student["DORM_ROOM"],
    id: id,
    photo_path: path,
    pronouns: "",
  };

  return user_data;
}

export default async function Settings() {
  async function submitData(formData: FormData) {
    "use server";

    const session = await auth();

    if (session && session.user) {
      const id = session.user.email?.split("@")[0];
      const old_data = await prisma.studentOverlay.findUnique({
        where: {
          uid: id,
        },
      });
      if (!id) notFound();

      const rawFormData = {
        firstName:
          formData.get("fName")?.toString() || old_data?.firstName || "",
        lastName: formData.get("lName")?.toString() || old_data?.lastName || "",
        pronouns:
          formData.get("pNouns")?.toString() || old_data?.pronouns || "",
      };

      await prisma.studentOverlay.upsert({
        where: {
          uid: id,
        },
        update: {
          firstName: rawFormData.firstName,
          lastName: rawFormData.lastName,
          pronouns: rawFormData.pronouns,
        },
        create: {
          uid: id,
          firstName: rawFormData.firstName,
          lastName: rawFormData.lastName,
          pronouns: rawFormData.pronouns,
          photoPath: "",
        },
      });
    }
  }

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
        year: cygnet_user_data.year,
        dorm: cygnet_user_data.dorm,
        room: cygnet_user_data.room,
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
      };
    }

    return (
      <form action={submitData}>
        <SettingsForm inData={user_data} />
      </form>
    );
  }
  return <ForceSignin />;
}
