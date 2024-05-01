"use client"
import { useEffect, useState } from "react";
import { StudentInfo } from "./pagebody";
import Card from "./card";
import { useSnackbar } from '@swat-sccs/react-simple-snackbar';

const snackOptions = {
    position: 'bottom-left' as const,
    style: {
        backgroundColor: 'white',
        border: 'none',
        color: 'black',
        fontFamily: 'Montserrat, sans-serif',
        fontSize: '12px',
        transform: 'translateY(-8dvh)',
        boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
    },
    closeStyle: {
        color: '#44608F',
        fontSize: '12px',
    },
}

export default function SettingsForm(props: { inData: StudentInfo, pending: boolean, state: { message: string } }) {

    const [userData, setUserData] = useState(props.inData);
    const [openSnackbar, closeSnackbar] = useSnackbar(snackOptions);

    useEffect(() => {
        if (props.pending) {
            closeSnackbar();
            openSnackbar("Loading...");
        } else if (props.state.message !== "") {
            closeSnackbar();
            openSnackbar(props.state.message);
        }
    }, [props.pending, props.state.message]);

    return (
        <div className="mt-4 max-w-screen-lg md:mx-auto grid gap-4 grid-cols-4">
            <div className="flex-col grow col-span-1">
                <Card {...userData} button={true} />
            </div>
            <div className="flex-col grow col-span-3">
                <div className="bg-white h-full grow dark:bg-dark-blue py-3 px-4 shadow rounded-lg grow text-black dark:text-white">
                    <h1 className="h4 text-center">Edit Profile</h1>
                    <div className="grid gap-4 grid-cols-3">
                        <div className="flex-col col-span-1">
                            <label className="h6 d-block">First Name</label>
                            <input
                                name="fName"
                                className="py-1 px-2 w-full d-block rounded bg-primary-600 dark:bg-primary-800 border-0"
                                value={userData.first}
                                onChange={(e) => {
                                    setUserData(
                                        Object.assign({}, userData, { first: e.target.value })
                                    )
                                }
                                }
                            />
                        </div>
                        <div className="flex-col col-span-1">
                            <label className="h6 d-block">Last Name</label>
                            <input
                                name="lName"
                                className="py-1 px-2 w-full d-block rounded bg-primary-600 dark:bg-primary-800 border-0"
                                value={userData.last}
                                onChange={(e) => {
                                    setUserData(
                                        Object.assign({}, userData, { last: e.target.value })
                                    )
                                }
                                }
                            />
                        </div>
                        <div className="flex-col col-span-1">
                            <label className="h6 d-block">Pronouns</label>
                            <input
                                name="pNouns"
                                className="py-1 px-2 w-full d-block rounded bg-primary-600 dark:bg-primary-800 border-0"
                                value={userData.pronouns}
                                onChange={(e) => {
                                    setUserData(
                                        Object.assign({}, userData, { pronouns: e.target.value })
                                    )
                                }
                                }
                            />
                        </div>
                    </div>
                    <div className="grid gap-4 grid-cols-3 mt-4">
                        <div className="flex-col col-span-1 justify-center">
                            <input
                                className="w-5 h-5 mb-px text-primary-600 dark:text-primary-800 border-0 rounded mx-1"
                                type="checkbox"
                                name="showDorm"
                                id="showDorm"
                                role="switch"
                                checked={userData.showDorm}
                                onChange={(e) =>
                                    setUserData(
                                        Object.assign({}, userData, { showDorm: !(userData.showDorm) })
                                    )
                                }
                            />
                            <label className="text-black dark:text-white" htmlFor="showDorm">Show Dorm</label>
                        </div>
                        <div className="flex-col col-span-1 justify-center">
                            <input
                                className="w-5 h-5 mb-px text-primary-600 dark:text-primary-800 border-0 rounded mx-1"
                                type="checkbox"
                                name="showPicture"
                                id="showPicture"
                                role="switch"
                                checked={userData.showPicture}
                                onChange={(e) =>
                                    setUserData(
                                        Object.assign({}, userData, { showPicture: !(userData.showPicture) })
                                    )
                                }
                            />
                            <label className="text-black dark:text-white" htmlFor="showPicture">Show Picture</label>
                        </div>
                        <div className="flex-col col-span-1 justify-center">
                            <input
                                className="w-5 h-5 mb-px text-primary-600 dark:text-primary-800 border-0 rounded mx-1"
                                type="checkbox"
                                name="showProfile"
                                id="showProfile"
                                role="switch"
                                checked={userData.showProfile}
                                onChange={(e) =>
                                    setUserData(
                                        Object.assign({}, userData, { showProfile: !(userData.showProfile) })
                                    )
                                }
                            />
                            <label className="text-black dark:text-white" htmlFor="showProfile">Show Profile</label>
                        </div>
                    </div>
                    <div className="flex flex-row justify-center">
                        <input type="submit" value="Submit" aria-disabled={props.pending} className="mt-8 mx-auto w-full bg-primary-600 dark:bg-primary-800 rounded h-8 max-w-2xl" />
                    </div>
                </div>
            </div>
        </div>
    );
}
