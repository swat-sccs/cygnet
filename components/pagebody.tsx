import "@/app/createDb"; // creates ITS database pool connection
import { queryDb } from "@/app/queryDb";
import fs from "fs";
import { Suspense } from "react";
import CardBody from "./cardbody";
import prisma from "@/lib/prisma";
import { StudentOverlay } from "@prisma/client";
import { play } from "@/app/fonts";
//import TextModerate from 'text-moderate';

export interface DbInfo {
    FIRST_NAME: string;
    LAST_NAME: string;
    GRAD_YEAR: string;
    DORM: string;
    DORM_ROOM: string;
    USER_ID: string;
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
        // account for just spaces
        if (value.match(/^\s*$/g))
            return false;
        return true;
    });

    // account for no terms
    if (!searchQuery.length) {
        return [];
    }

    // replace whitespace lumps with space for parsing0
    searchQuery[0] = searchQuery[0].replaceAll(/\W/g, ' ');

    // store prisma queries to execute
    let prismaQuery: any[] = [];

    const filters = (searchParams?.filters || "").split(",");

    // query based on search terms
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

    // query based on filters
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

    // build full sql query
    const query = `SELECT FIRST_NAME, LAST_NAME, GRAD_YEAR, DORM, DORM_ROOM, \
        USER_ID FROM student_data WHERE (${filterString})`;

    // @ts-ignore
    const raw: any[] = await queryDb(query);
    const data: StudentOverlay[] = [];

    // execute query
    const overlay: StudentOverlay[] = await prisma.studentOverlay.findMany({
        where: {
            AND: prismaQuery
        }
    })

    const records = Promise.allSettled([
        overlay.map(async (student) => {
            let newStudent: StudentOverlay = {
                firstName: student.firstName,
                lastName: student.lastName,
                gradYear: student.gradYear,
                dorm: student.dorm,
                dormRoom: student.dormRoom,
                uid: student.uid,
                photoPath: student.photoPath,
                pronouns: student.pronouns,
                showDorm: student.showDorm,
                showPhoto: student.showPhoto,
                showProfile: student.showProfile,
            };

            if(newStudent.showProfile)
                data.push(newStudent);
        }),
        raw.map(async (student) => {

            // check if in overlay with find => function
            const idx = data.findIndex((record) => {
                return record.uid === student["USER_ID"]
            })

            if(idx >= 0) {
                // check if properties ITS should control have changed
                if(data[idx].dorm !== student["DORM"] ||
                    data[idx].dormRoom !== student["DORM_ROOM"] ||
                    data[idx].gradYear !== student["GRAD_YEAR"]
                ) {
                    data[idx].dorm = student["DORM"]
                    data[idx].dormRoom = student["DORM_ROOM"]
                    data[idx].gradYear = student["GRAD_YEAR"]

                    prisma.studentOverlay.update({
                        where: {
                            uid: data[idx].uid
                        },
                        data: data[idx]
                    })

                    return // use overlay listing
                }
            }

            // construct StudentInfo dict from ITS db props
            let newStudent: StudentOverlay = {
                firstName: student["FIRST_NAME"],
                lastName: student["LAST_NAME"],
                gradYear: student["GRAD_YEAR"],
                dorm: student["DORM"],
                dormRoom: student["DORM_ROOM"],
                uid: student["USER_ID"],
                photoPath: await getPhoto(student["USER_ID"]),
                pronouns: "",
                showDorm: true,
                showPhoto: true,
                showProfile: true,
            };

            data.push(newStudent);
        })]
    );

    await records;

    // sort merged records
    return data.sort((a: StudentOverlay, b: StudentOverlay) => {
        if (a.firstName == b.firstName)
            if (a.lastName < b.lastName)
                return -1
            else
                return 1
        if (a.firstName < b.firstName)
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
            <div className="flex flex-grow flex-col mb-28 items-center justify-center w-full text-black dark:text-white">
                <div className="flex-row w-full">
                    <p
                        className="text-center"
                    >
                        Welcome to<br />
                        <span className={`${play.className} h1`}>
                            <span className="text-black dark:text-white text-3xl" >
                                CYGNET
                            </span>
                            <span className="grad dark:brightness-150 z-0">
                                by SCCS
                            </span>
                        </span>
                    </p>
                </div>
                <div className="flex-row w-full">
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
