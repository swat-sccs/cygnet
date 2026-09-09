"use client"
import { useEffect, useState } from "react";
import Card from "./card";
import { useSnackbar } from '@swat-sccs/react-simple-snackbar';
import { StudentOverlay } from "@prisma/client";

const snackOptions = {
    position: 'bottom-left' as const,
    style: {
        backgroundColor: 'rgb(var(--surface))',
        color: 'rgb(var(--fg))',
        border: '1px solid rgb(var(--line))',
        borderRadius: '12px',
        fontFamily: 'Inter, sans-serif',
        fontSize: '13px',
        boxShadow: '0 12px 32px -8px rgb(0 0 0 / 0.28)',
    },
    closeStyle: {
        color: 'rgb(var(--accent))',
        fontSize: '12px',
    },
}

const labelClass = "block text-xs font-medium text-fg-3 uppercase tracking-wider mb-1.5";
const inputClass =
    "w-full bg-surface-2 border border-transparent focus:border-line-2 focus:bg-surface rounded-xl h-10 px-3 text-sm text-fg placeholder:text-fg-3 focus:ring-0 focus:outline-none transition";
const toggleClass =
    "appearance-none shrink-0 h-6 w-11 rounded-full border-0 bg-surface-3 checked:bg-accent checked:bg-none relative transition cursor-pointer " +
    "before:content-[''] before:absolute before:top-0.5 before:left-0.5 before:h-5 before:w-5 before:rounded-full before:bg-white before:shadow before:transition " +
    "checked:before:translate-x-5 focus:ring-0 focus:outline-none";
const rowClass = "flex items-center justify-between gap-4 py-3 border-b border-line last:border-0";

export default function SettingsForm(props: { inData: StudentOverlay, pending: boolean, state: { message: string } }) {

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
        <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 pt-8 sm:pt-12">
            <header className="mb-6">
                <h1 className="text-2xl font-semibold tracking-tight text-fg">Settings</h1>
                <p className="text-fg-2 text-sm mt-1">Control what other students can see about you.</p>
            </header>

            <div className="grid gap-6 grid-cols-1 md:grid-cols-[280px,1fr]">
                <div className="md:self-start">
                    <p className="text-xs uppercase tracking-wider text-fg-3 font-medium mb-2">Preview</p>
                    <Card {...userData} button={true} />
                </div>

                <div className="bg-surface border border-line rounded-2xl p-5 sm:p-6">
                    <section>
                        <h2 className="text-sm font-semibold text-fg mb-4">Profile</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass} htmlFor="fName">First name</label>
                                <input
                                    id="fName"
                                    name="fName"
                                    className={inputClass}
                                    value={userData.firstName}
                                    onChange={(e) => {
                                        setUserData(
                                            Object.assign({}, userData, { firstName: e.target.value })
                                        )
                                    }}
                                />
                            </div>
                            <div>
                                <label className={labelClass} htmlFor="lName">Last name</label>
                                <input
                                    id="lName"
                                    name="lName"
                                    className={inputClass}
                                    value={userData.lastName}
                                    onChange={(e) => {
                                        setUserData(
                                            Object.assign({}, userData, { lastName: e.target.value })
                                        )
                                    }}
                                />
                            </div>
                        </div>
                    </section>

                    <div className="border-t border-line my-6" />

                    <section>
                        <h2 className="text-sm font-semibold text-fg mb-1">Visibility</h2>
                        <div className={rowClass}>
                            <div>
                                <label className="block text-sm font-medium text-fg cursor-pointer" htmlFor="showDorm">Show dorm</label>
                                <p className="text-xs text-fg-3">Display your dorm and room number</p>
                            </div>
                            <input
                                className={toggleClass}
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
                        </div>
                        <div className={rowClass}>
                            <div>
                                <label className="block text-sm font-medium text-fg cursor-pointer" htmlFor="showPhoto">Show picture</label>
                                <p className="text-xs text-fg-3">Display your photo on your card</p>
                            </div>
                            <input
                                className={toggleClass}
                                type="checkbox"
                                name="showPhoto"
                                id="showPhoto"
                                role="switch"
                                checked={userData.showPhoto}
                                onChange={(e) =>
                                    setUserData(
                                        Object.assign({}, userData, { showPhoto: !(userData.showPhoto) })
                                    )
                                }
                            />
                        </div>
                        <div className={rowClass}>
                            <div>
                                <label className="block text-sm font-medium text-fg cursor-pointer" htmlFor="showProfile">Show profile</label>
                                <p className="text-xs text-fg-3">Include you in search results at all</p>
                            </div>
                            <input
                                className={toggleClass}
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
                        </div>
                    </section>

                    <div className="mt-6 flex justify-end">
                        <input
                            type="submit"
                            value="Save changes"
                            aria-disabled={props.pending}
                            className={`cursor-pointer bg-accent text-accent-fg hover:bg-accent-hover rounded-full px-4 h-10 text-sm font-medium transition disabled:opacity-60 ${props.pending ? "opacity-60" : ""}`}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
