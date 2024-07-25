'use client'

import { play } from "@/app/fonts";
import { useSession, signIn, signOut } from "next-auth/react"

export default function SignIn() {
    const { data: session } = useSession();
    if (session?.user) {
        return (
            <div className="inline-flex w-full margin-spacing">
                Signed in as {session.user.email} <br />
                <button className="mt-8" onClick={() => signOut()}>Sign out</button>
            </div>
        )
    }
    return (
        <div className="flex pt-16 items-center justify-center flex-col w-full text-lg text-black dark:text-white">
            <div className="flex-row justify-center">
                <p
                    className="text-center"
                >
                    Welcome to<br />
                    <span className={`${play.className}`}>the&nbsp;<span className="text-3xl dark:brightness-150">CYGNET</span><span className="grad"> by SCCS</span></span>
                </p>
            </div>
            <div className="flex-row justify-center">
                <p
                    className="text-center mt-5"
                >
                    Please sign in to continue
                </p>
            </div>
            <div className="flex-row justify-center">
                <button className="shadow px-6 py-2 mt-5 rounded-full bg-primary-600 hover:bg-primary-800 dark:bg-dark-blue text-white transition-colors border-0" onClick={() => signIn("keycloak")}>Sign in</button>
            </div>
        </div>
    )
}
