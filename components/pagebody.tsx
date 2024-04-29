import "@/app/createDb"; // creates ITS database pool connection
import { queryDb } from "@/app/queryDb";
import fs from "fs";
import { Suspense } from "react";
import CardBody from "./cardbody";
import prisma from "@/lib/prisma";
import { StudentOverlay } from "@prisma/client";
//import TextModerate from 'text-moderate';

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

async function getPhoto(uid: string) {
    let path = "/placeholder.jpg";

    const modPath = `/mod/${uid}_m.jpg`;
    const genModPath = `${__dirname}/../../../photos${modPath}`;

    const staticPath = `/${uid}.jpg`;
    const genPath = `${__dirname}/../../../photos${staticPath}`;

    if (fs.existsSync(genModPath)) {
        path = modPath;
    } else if (fs.existsSync(genPath)) {
        //path = fullPath
        path = staticPath;
    } else {
        const imgBuffer = await queryDb(
            `SELECT PHOTO FROM student_data WHERE USER_ID='${uid}' `
        );

        // @ts-ignore
        fs.writeFileSync(genPath, imgBuffer[0]["PHOTO"]);
        // path = fullPath
        path = staticPath;
    }

    return path;
}

async function filterData(searchParams: { query?: string; filters?: string }) {
    const searchQuery = (searchParams?.query || "").split(" ").filter((value: string) => {
        if (value.match(/^\s*$/g))
            return false;
        return true;
    });

    if (!searchQuery.length) {
        return [];
    }

    let prismaQuery: any[] = [];

    const filters = (searchParams?.filters || "").split(",");

    let filterString: string = searchQuery[0]
        ? searchQuery
            .map((filter: string) => {
                prismaQuery.push({
                    OR: [{
                        firstName: {
                            contains: filter,
                        }
                    },
                    {
                        lastName: {
                            contains: filter,
                        }
                    },
                    {
                        gradYear: {
                            contains: filter,
                        }
                    },
                    {
                        dorm: {
                            contains: filter,
                        }
                    },
                    {
                        dormRoom: {
                            contains: filter,
                        }
                    },
                    {
                        uid: {
                            contains: filter,
                        }
                    }]
                });
                return `FIRST_NAME LIKE '%${filter}%' OR LAST_NAME LIKE \
        '%${filter}%' OR GRAD_YEAR LIKE '%${filter}%' OR DORM LIKE \
        '%${filter}%' OR DORM_ROOM LIKE '%${filter}%' OR USER_ID LIKE \
        '%${filter}%'`;
            })
            .join(") AND (")
        : "";

    if (filters[0]) {
        filterString += searchQuery[0] ? ") AND (" : "";
        filterString += filters
            .map((filter: string) => {
                prismaQuery.push({
                    OR: [{
                        firstName: {
                            contains: filter,
                        }
                    },
                    {
                        lastName: {
                            contains: filter,
                        }
                    },
                    {
                        gradYear: {
                            contains: filter,
                        }
                    },
                    {
                        dorm: {
                            contains: filter,
                        }
                    },
                    {
                        dormRoom: {
                            contains: filter,
                        }
                    },
                    {
                        uid: {
                            contains: filter,
                        }
                    }]
                });
                return `GRAD_YEAR LIKE '%${filter}%' OR DORM LIKE \
                '%${filter}%' OR DORM_ROOM LIKE '%${filter}%'`;
            })
            .join(") AND (");
    }
    
    filterString.replaceAll(/\W/g, ' ')
    const query = `SELECT FIRST_NAME, LAST_NAME, GRAD_YEAR, DORM, DORM_ROOM, \
        USER_ID FROM student_data WHERE (${filterString})`;


    // @ts-ignore
    const raw: any[] = await queryDb(query);
    const data: StudentInfo[] = [];

    // reuse query instead of reprocessing
    const overlay: StudentOverlay[] = await prisma.studentOverlay.findMany({
        where: {
            AND: prismaQuery
        }
    })

    const records = Promise.allSettled([
        overlay.map(async (student) => {
            let newStudent: StudentInfo = {
                first: student.firstName,
                last: student.lastName,
                year: student.gradYear,
                dorm: student.dorm,
                room: student.dormRoom,
                id: student.uid,
                photo_path: student.photoPath,
                pronouns: student.pronouns,
                showDorm: student.showDorm,
                showPicture: student.showPhoto,
                showProfile: student.showProfile,
            };

            data.push(newStudent);
        }),
        raw.map(async (student) => {

            if (overlay.find((record) => {
                return record.uid === student["USER_ID"]
            })) {
                return;
            }

            let newStudent: StudentInfo = {
                first: student["FIRST_NAME"],
                last: student["LAST_NAME"],
                year: student["GRAD_YEAR"],
                dorm: student["DORM"],
                room: student["DORM_ROOM"],
                id: student["USER_ID"],
                photo_path: await getPhoto(student["USER_ID"]),
                pronouns: "",
                showDorm: true,
                showPicture: true,
                showProfile: true,
            };

            data.push(newStudent);
        })]
    );

    await records;

    return data.sort((a: StudentInfo, b: StudentInfo) => {
        if (a.first < b.first)
            return -1;
        return 1;
    });
}

export default async function PageBody({
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
            <Suspense fallback={<CardBody filteredData={undefined} />}>
                <CardBody filteredData={filteredData} />
            </Suspense>
        );
    } else {
        return (
            <div className="mont d-flex mt-5 align-items-center justify-content-center row w-100">
                <div className="col-12">
                    <p
                        className="h4 text-center"
                    >
                        Welcome to<br />
                        <span className="play text-black">the&nbsp;<span className="h1">CYGNET</span><span className="h4 grad"> by SCCS</span></span>
                    </p>
                </div>
                <div className="col-12">
                    <p
                        className="text-center h6 mt-5"
                    >
                        Enter a query or add a filter to begin
                    </p>
                </div>
            </div>
        )
    }
}
