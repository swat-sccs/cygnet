import "@/app/createDb"; // creates ITS database pool connection
import { queryDb } from "@/app/queryDb";
import fs from "fs";
import { Suspense } from "react";
import CardBody from "./cardbody";
import prisma from "@/lib/prisma";

export interface DbInfo {
  FIRST_NAME: string;
  LAST_NAME: string;
  GRAD_YEAR: string;
  DORM: string;
  DORM_ROOM: string;
  USER_ID: string;
}

export interface StudentInfo {
  first: string;
  last: string;
  year: string;
  dorm: string;
  room: string;
  id: string;
  photo_path: string;
  pronouns: string;
  showDorm: boolean;
  showProfile: boolean;
  showPicture: boolean;
}

async function filterData(searchParams: { query?: string; filters?: string }) {
  const searchQuery = (searchParams?.query || "").split(" ");
  const filters = (searchParams?.filters || "").split(",");

  console.log(searchQuery);
  console.log(filters);

  let filterString: string = searchQuery[0]
    ? searchQuery
        .map((filter: string) => {
          return `FIRST_NAME LIKE '%${filter}%' OR LAST_NAME LIKE \
        '%${filter}%' OR GRAD_YEAR LIKE '%${filter}%' OR DORM LIKE \
        '%${filter}%' OR DORM_ROOM LIKE '%${filter}%' OR USER_ID LIKE \
        '%${filter}%'`;
        })
        .join(" OR ")
    : "";

  if (filters[0]) {
    filterString += searchQuery[0] ? ") AND (" : "";
    filterString += filters
      .map((filter: string) => {
        return `GRAD_YEAR LIKE '%${filter}%' OR DORM LIKE \
                '%${filter}%' OR DORM_ROOM LIKE '%${filter}%'`;
      })
      .join(" OR ");
  }

  console.log(filterString);

  let query = `SELECT FIRST_NAME, LAST_NAME, GRAD_YEAR, DORM, DORM_ROOM, \
        USER_ID FROM student_data WHERE (${filterString}) `;

  // @ts-ignore
  let raw: any[] = await queryDb(query);
  let data: StudentInfo[] = [];

  await Promise.all(
    raw.map(async (student) => {
      const user = await prisma.studentOverlay.findUnique({
        where: {
            uid: student["USER_ID"],
        }
      })

      if (user && !user.showProfile) {
        return;
      }

      let path = "/placeholder.jpg";

      if (!user || user.showPhoto) {
        const modPath = `/photos/mod/${student["USER_ID"]}_m.jpg`;
        const genModPath = `${__dirname}/../../..${modPath}`;

        // production needs domain due to external static server
        // dev uses next public dir b/c doesn't need build-time copy
        const prePath =
          process.env.NODE_ENV === "production" ? process.env.DOMAIN : "";
        const staticPath = `/photos/${student["USER_ID"]}.jpg`;
        const genPath = `${__dirname}/../../..${staticPath}`;

        if (fs.existsSync(genModPath)) {
          path = prePath + modPath;
        } else if (fs.existsSync(genPath)) {
          //path = fullPath
          path = prePath + staticPath;
        } else {
          const imgBuffer = await queryDb(
            `SELECT PHOTO FROM student_data WHERE USER_ID='${student["USER_ID"]}' `
          );

          // @ts-ignore
          fs.writeFileSync(genPath, imgBuffer[0]["PHOTO"]);
          // path = fullPath
          path = prePath + staticPath;
        }
      }

      let newStudent: StudentInfo = {
        first: user?.firstName ? user.firstName : student["FIRST_NAME"],
        last: user?.lastName ? user.lastName : student["LAST_NAME"],
        year: student["GRAD_YEAR"],
        dorm: student["DORM"],
        room: student["DORM_ROOM"],
        id: student["USER_ID"],
        photo_path: path,
        pronouns: user?.pronouns ? user.pronouns : "",
        showDorm: true,
        showPicture: true,
        showProfile: true,
      };

      if (user && !user.showDorm) {
        newStudent.showDorm = false;
      }

      data.push(newStudent);
    })
  );

  return data;
}

export default function PageBody({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    filters?: string;
  };
}) {
  if (searchParams?.query || searchParams?.filters) {
    const filteredData = filterData(searchParams);

    return (
      <div className="">
        <Suspense fallback={<CardBody filteredData={undefined} />}>
          <CardBody filteredData={filteredData} />
        </Suspense>
      </div>
    );
  }
}
