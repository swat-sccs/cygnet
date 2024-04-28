'use client'

import { useSession, signIn, signOut } from "next-auth/react"

export default function SignIn() {
    const { data: session } = useSession();
    if (session?.user) {
        return (
            <div className="d-inline-flex w-full margin-spacing">
                Signed in as {session.user.email} <br />
                <button className="mt-8" onClick={() => signOut()}>Sign out</button>
            </div>
        )
    }
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
            <div className="col-12 d-flex justify-content-center">
                <p
                    className="text-center h6 mt-5"
                >
                    Please sign in to continue
                </p>
            </div>
            <div className="col-12 d-flex justify-content-center">
                <button className="filterButton shadow-md mt-5" onClick={() => signIn()}>Sign in</button>
            </div>
        </div>
    )
}
