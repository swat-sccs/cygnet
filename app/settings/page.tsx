import Card from '@/components/card';
import { DbInfo, StudentInfo } from '@/components/pagebody';
import { auth } from '@/lib/auth';
import fs from 'fs';
import 'bootstrap/dist/css/bootstrap.css';
import ForceSignin from '@/components/forceSignIn';
import { notFound, redirect } from 'next/navigation';
import { queryDb } from '../queryDb';

// will need to be loaded from our own database eventually, 
// just UI functional for now

async function getUser(id: string | undefined) {
    if (!id) {
        notFound();
    }

    console.log("UID: " + id);
    const file = fs.readFileSync(`${__dirname}/../../../../student_settings/student_settings.json`, 'utf8');
    const user_settings = JSON.parse(file);

    // @ts-ignore
    const raw: any[] = await queryDb(`SELECT FIRST_NAME, LAST_NAME, GRAD_YEAR, DORM, DORM_ROOM \
        FROM student_data WHERE USER_ID='${id}' `);

    const student: DbInfo = raw[0];

    let path = '/placeholder.jpg';

    if (!(user_settings[0]['PHOTO_HIDDEN'].includes(id))) {
        const modPath = `/photos/mod/${id}_m.jpg`;
        const genModPath = `${__dirname}/../../../..${modPath}`;
        console.log(genModPath)

        // production needs domain due to external static server
        // dev uses next public dir b/c doesn't need build-time copy
        const prePath = (process.env.NODE_ENV === "production") ? process.env.DOMAIN : "";
        const staticPath = `/photos/${id}.jpg`;
        const genPath = `${__dirname}/../../../../${staticPath}`;

        if (fs.existsSync(genModPath)) {
            path = prePath + modPath
        }
        else if (fs.existsSync(genPath)) {
            //path = fullPath
            path = prePath + staticPath
        } else {
            const imgBuffer = await queryDb(`SELECT PHOTO FROM student_data WHERE USER_ID='${id}' `)

            // @ts-ignore
            fs.writeFileSync(genPath, imgBuffer[0]['PHOTO']);
            // path = fullPath
            path = prePath + staticPath
        }
    }

    const user_data: StudentInfo = {
        first: student['FIRST_NAME'],
        last: student['LAST_NAME'],
        year: student['GRAD_YEAR'],
        dorm: student['DORM'],
        room: student['DORM_ROOM'],
        id: id,
        photo_path: path,
        pronouns: ""
    }

    return user_data;
}

export default async function Settings() {
    // await auth check
    const session = (await auth());
    if (session?.user) {
        const user_data = await getUser(session.user.email?.split('@')[0]);
        return (
            <div className="d-inline-flex w-full margin-spacing container">
                <div className="row">
                    <div className="col-12 col-md-4 h-100 w-full">
                        <Card {...user_data} />
                    </div>
                    <div className="col-12 col-md-8 h-100 bg-white pt-3 pb-2 px-4 shadow-sm rounded-lg mont">
                        <h1 className="h4">Edit Profile</h1>
                        <div className="d-inline-flex w-75 mt-3">
                            <div className="w-full mr-2">
                                <label className="h6 d-block">First Name</label>
                                <input
                                    className="py-1 px-2 w-full d-block"
                                    placeholder={user_data.first} />
                            </div>
                            <div className="w-full ml-2">
                                <label className="h6 d-block">Last Name</label>
                                <input
                                    className="py-1 px-2 w-full d-block"
                                    placeholder={user_data.last} />
                            </div>
                            <div className="w-full ml-2">
                                <label className="h6 d-block">Pronouns</label>
                                <input
                                    className="py-1 px-2 w-75 d-block"
                                    placeholder={""/*prounouns will go in here eventually*/} />
                            </div>
                        </div>
                        <div className="form-check form-switch mt-4">
                            <input className="form-check-input" type="checkbox" />
                            <label className="mont">Show Dorm</label>
                        </div>
                        <div className="form-check form-switch mt-3">
                            <input className="form-check-input" type="checkbox" />
                            <label className="mont">Show Picture</label>
                        </div>
                        <div className="form-check form-switch mt-3">
                            <input className="form-check-input" type="checkbox" />
                            <label className="mont">Show Profile</label>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    return (<ForceSignin />)
}
