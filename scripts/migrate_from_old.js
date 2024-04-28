// Run this with node --env-file=../.env migrate_from_old.js inside the cygnet container
const client = require('@prisma/client').PrismaClient;
const mysql = require('mysql2/promise');
const fs = require("fs");

const prisma = new client();

const host = process.env.DB_HOST;
const user = process.env.DB_USER;
const password = process.env.DB_PASS;
const db = process.env.DB_NAME;

const dbConfig = {
    host: host,
    user: user,
    password: password,
    database: db,
    port: 3306,
};

var pool = mysql.createPool(
    dbConfig
);

const file = fs.readFileSync(
    `${__dirname}/../student_settings/student_settings.json`,
    "utf8"
);
const user_settings = JSON.parse(file);

async function copyRecord(uid) {
    console.log(`Migrating ${uid}`);

    const connection = await pool.getConnection();
    const [rows, fields] = await connection.query(`SELECT FIRST_NAME, LAST_NAME, GRAD_YEAR, DORM, DORM_ROOM \
        FROM student_data WHERE USER_ID="${uid}" `);
    
    if (!rows) {
        console.log("no results!")
        return;
    }

    const record = rows[0];

    if (!record) {
        console.log("no results!")
        return;
    }

    const modPath = `/mod/${uid}_m.jpg`;
    const genModPath = `${__dirname}/../photos${modPath}`;

    const staticPath = `/${uid}.jpg`;
    const genPath = `${__dirname}/../photos${staticPath}`;

    let path = "/placeholder.jpg";

    if (user_settings[0]["PHOTO_HIDDEN"].includes(uid)) {
        console.log("not pulling photo");
    } else if (fs.existsSync(genModPath)) {
        path = modPath;
    } else if (fs.existsSync(genPath)) {
        path = staticPath;
    } else {
        const imgBuffer = (await connection.query(
            `SELECT PHOTO FROM student_data WHERE USER_ID='${uid}' `
        ))[0];

        if (imgBuffer[0]) {
            fs.writeFileSync(genPath, imgBuffer[0]["PHOTO"]);
            path = staticPath;
        }
        else return // remove old people
    }

    await prisma.studentOverlay.upsert({
        where: {
            uid: uid,
        },
        update: {
            photoPath: path,
            showProfile: user_settings[0]["EXCLUDED_USERS"].includes(uid) ? false : true,
            showDorm: user_settings[0]["ROOM_HIDDEN"].includes(uid) ? false : true,
            showPhoto: user_settings[0]["PHOTO_HIDDEN"].includes(uid) ? false : true,
        },
        create: {
            uid: uid,
            firstName: record['FIRST_NAME'],
            lastName: record['LAST_NAME'],
            pronouns: "",
            photoPath: path,
            showProfile: user_settings[0]["EXCLUDED_USERS"].includes(uid) ? false : true,
            showDorm: user_settings[0]["ROOM_HIDDEN"].includes(uid) ? false : true,
            showPhoto: user_settings[0]["PHOTO_HIDDEN"].includes(uid) ? false : true,
        },
    });
    connection.release();
}

user_settings[0]["EXCLUDED_USERS"].forEach(async uid => {
    await copyRecord(uid);
});

user_settings[0]["ROOM_HIDDEN"].forEach(async uid => {
    await copyRecord(uid);
});

user_settings[0]["PHOTO_HIDDEN"].forEach(async uid => {
    await copyRecord(uid);
});
