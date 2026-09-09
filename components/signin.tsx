'use client'

import { useSession, signIn, signOut } from "next-auth/react"

export default function SignIn() {
    const { data: session } = useSession();
    if (session?.user) {
        return (
            <div className="flex-1 flex items-center justify-center px-4">
                <div className="bg-surface border border-line rounded-2xl p-6 shadow-card w-full max-w-sm flex flex-col gap-4 animate-rise">
                    <div>
                        <p className="m-0 text-xs font-medium uppercase tracking-wider text-fg-3">Signed in as</p>
                        <p className="m-0 mt-1 text-fg font-medium break-all">{session.user.email}</p>
                    </div>
                    <button
                        type="button"
                        className="inline-flex items-center justify-center h-10 px-4 rounded-full bg-surface border border-line hover:bg-surface-2 text-fg font-medium transition-colors duration-150 focus:outline-none"
                        onClick={() => signOut()}
                    >
                        Sign out
                    </button>
                </div>
            </div>
        )
    }
    return (
        <div className="flex-1 flex items-center justify-center px-4">
            <div className="flex flex-col items-center text-center max-w-md animate-rise">
                <span className="text-xs font-medium text-accent bg-accent/10 rounded-full px-3 py-1">
                    Swarthmore student directory
                </span>
                <h1 className="mt-5 mb-0 text-4xl sm:text-5xl font-semibold tracking-tight text-fg">
                    Cygnet
                </h1>
                <p className="mt-3 mb-0 text-fg-2 text-base leading-relaxed">
                    Find classmates by name, dorm, or class year. Sign in with your Swarthmore account to continue.
                </p>
                <button
                    type="button"
                    className="mt-8 inline-flex items-center gap-2 h-10 px-4 rounded-full bg-accent text-accent-fg hover:bg-accent-hover font-medium transition-colors duration-150 focus:outline-none"
                    onClick={() => signIn("keycloak")}
                >
                    Sign in with Swarthmore
                    <svg
                        className="h-4 w-4"
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                </button>
                <p className="mt-4 mb-0 text-xs text-fg-3">
                    Only accessible to current students and on-campus networks.
                </p>
            </div>
        </div>
    )
}
