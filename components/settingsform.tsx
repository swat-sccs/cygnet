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
        if(props.pending) {
            closeSnackbar();
            openSnackbar("Loading...");
        } else if(props.state.message !== "") {
            closeSnackbar();
            openSnackbar(props.state.message);
        }
    }, [props.pending, props.state.message]);

    return (
        <div className="row container-md mx-auto mb-4">
            <div className="col-12 col-md-3 flex-grow-1 gy-4">
                <Card {...userData} button={true} />
            </div>
            <div className="col-12 col-md-9 flex-grow-1 gy-4">
                <div className="bg-white py-3 px-4 shadow-sm rounded-lg mont h-100 flex-grow-1">
                    <h1 className="h4 text-center">Edit Profile</h1>
                    <div className="row">
                        <div className="col-12 col-md-4 gy-2">
                            <label className="h6 d-block">First Name</label>
                            <input
                                name="fName"
                                className="py-1 px-2 w-full d-block"
                                value={userData.first}
                                onChange={(e) => {
                                    setUserData(
                                        Object.assign({}, userData, { first: e.target.value })
                                    )
                                }
                                }
                            />
                        </div>
                        <div className="col-12 col-md-4 gy-2">
                            <label className="h6 d-block">Last Name</label>
                            <input
                                name="lName"
                                className="py-1 px-2 w-full d-block"
                                value={userData.last}
                                onChange={(e) => {
                                    setUserData(
                                        Object.assign({}, userData, { last: e.target.value })
                                    )
                                }
                                }
                            />
                        </div>
                        <div className="col-12 col-md-4 gy-2">
                            <label className="h6 d-block">Pronouns</label>
                            <input
                                name="pNouns"
                                className="py-1 px-2 w-full d-block"
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
                    <div className="row mt-4">
                        <div className="form-check form-switch col-12 col-md-4">
                            <input
                                className="form-check-input mx-1"
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
                            <label className="mont form-check-label" htmlFor="showDorm">Show Dorm</label>
                        </div>
                        <div className="form-check form-switch col-12 col-md-4">
                            <input
                                className="form-check-input mx-1"
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
                            <label className="mont form-check-label" htmlFor="showPicture">Show Picture</label>
                        </div>
                        <div className="form-check form-switch col-12 col-md-4">
                            <input
                                className="form-check-input mx-1"
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
                            <label className="mont form-check-label" htmlFor="showProfile">Show Profile</label>
                        </div>
                    </div>
                    <input type="submit" value="Submit" aria-disabled={props.pending} className="mt-4 mx-auto w-full" />
                </div>
            </div>
        </div>
    );
}
