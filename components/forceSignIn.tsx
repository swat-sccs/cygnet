'use client'

import { useSession, signIn, signOut } from "next-auth/react"

export default function ForceSignin() {
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
        <div className="d-inline-flex w-full margin-spacing">
            Not signed in <br />
            <button className="mt-8" onClick={() => signIn()}>Sign in</button>
        </div >
    )
}
