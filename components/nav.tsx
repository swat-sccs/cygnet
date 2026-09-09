"use client";

import { usePathname } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { useCollapse } from "react-collapsed";

function InstagramIcon({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
        >
            <rect x="3" y="3" width="18" height="18" rx="5" />
            <circle cx="12" cy="12" r="3.75" />
            <path d="M17.5 6.5h.01" />
        </svg>
    );
}

export default function Nav() {
    const pathName = usePathname();
    const { getCollapseProps, getToggleProps, isExpanded } = useCollapse();

    const { data: session } = useSession();

    const isSettings = pathName === "/settings";
    const authLabel = session?.user ? "Sign out" : "Sign in";
    const handleAuth = () => (session?.user ? signOut() : signIn("keycloak"));

    return (
        <nav className="sticky top-0 z-40 bg-surface/80 backdrop-blur border-b border-line">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
                {/* Wordmark */}
                <div className="flex items-baseline gap-2">
                    <Link
                        href="/"
                        className="font-semibold tracking-tight text-lg text-fg no-underline hover:text-fg"
                    >
                        Cygnet
                    </Link>
                    <Link
                        href="https://www.sccs.swarthmore.edu/"
                        className="text-fg-3 text-xs font-medium uppercase tracking-wider no-underline hover:text-fg transition-colors duration-150"
                    >
                        by SCCS
                    </Link>
                </div>

                {/* Mobile toggle */}
                <button
                    data-collapse-toggle="navbar-default"
                    type="button"
                    className="inline-flex md:hidden items-center justify-center h-9 w-9 rounded-lg text-fg-2 hover:text-fg hover:bg-surface-2 transition-colors duration-150 focus:outline-none"
                    aria-label={isExpanded ? "Close main menu" : "Open main menu"}
                    {...getToggleProps()}
                >
                    <span className="sr-only">{isExpanded ? "Close main menu" : "Open main menu"}</span>
                    {isExpanded ? (
                        <svg
                            className="h-5 w-5"
                            aria-hidden="true"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.75"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M18 6 6 18M6 6l12 12" />
                        </svg>
                    ) : (
                        <svg
                            className="h-5 w-5"
                            aria-hidden="true"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.75"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M4 7h16M4 12h16M4 17h16" />
                        </svg>
                    )}
                </button>

                {/* Desktop links */}
                <div className="hidden md:block">
                    <ul className="flex items-center gap-1 text-sm font-medium m-0 p-0 list-none">
                        <li>
                            <Link
                                href="/settings"
                                aria-current={isSettings ? "page" : undefined}
                                className={`inline-flex items-center h-9 px-3 rounded-full no-underline transition-colors duration-150 ${
                                    isSettings
                                        ? "text-fg bg-surface-2"
                                        : "text-fg-2 hover:text-fg hover:bg-surface-2"
                                }`}
                            >
                                Settings
                            </Link>
                        </li>
                        <li>
                            <button
                                type="button"
                                onClick={handleAuth}
                                className="inline-flex items-center h-9 px-3 rounded-full text-fg-2 hover:text-fg hover:bg-surface-2 transition-colors duration-150 focus:outline-none"
                            >
                                {authLabel}
                            </button>
                        </li>
                        <li>
                            <Link
                                href="https://www.instagram.com/swatsccs/"
                                aria-label="SCCS on Instagram"
                                className="inline-flex items-center justify-center h-9 w-9 rounded-full text-fg-2 hover:text-fg hover:bg-surface-2 transition-colors duration-150"
                            >
                                <InstagramIcon />
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Mobile panel */}
            <section {...getCollapseProps()}>
                <div className="md:hidden bg-surface border-b border-line" id="navbar-default">
                    <ul className="flex flex-col px-4 sm:px-6 py-2 m-0 list-none text-sm font-medium">
                        <li>
                            <Link
                                href="/settings"
                                aria-current={isSettings ? "page" : undefined}
                                className={`flex items-center w-full h-11 px-3 rounded-xl no-underline transition-colors duration-150 ${
                                    isSettings
                                        ? "text-fg bg-surface-2"
                                        : "text-fg-2 hover:text-fg hover:bg-surface-2"
                                }`}
                            >
                                Settings
                            </Link>
                        </li>
                        <li>
                            <button
                                type="button"
                                onClick={handleAuth}
                                className="flex items-center w-full h-11 px-3 rounded-xl text-left text-fg-2 hover:text-fg hover:bg-surface-2 transition-colors duration-150 focus:outline-none"
                            >
                                {authLabel}
                            </button>
                        </li>
                        <li>
                            <Link
                                href="https://www.instagram.com/swatsccs/"
                                className="flex items-center gap-2 w-full h-11 px-3 rounded-xl no-underline text-fg-2 hover:text-fg hover:bg-surface-2 transition-colors duration-150"
                            >
                                <InstagramIcon />
                                <span>Instagram</span>
                            </Link>
                        </li>
                    </ul>
                </div>
            </section>
        </nav>
    );
}
