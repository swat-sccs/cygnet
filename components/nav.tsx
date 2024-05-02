"use client";

import { usePathname } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react"
import Link from "next/link";
import { useCollapse } from 'react-collapsed';
import { play } from "@/app/fonts";

export default function Nav() {
    const pathName = usePathname();
    const { getCollapseProps, getToggleProps, isExpanded } = useCollapse()

    const { data: session } = useSession();

    return (
        <nav className="bg-white dark:bg-dark-blue shadow flex-col">
            <div className="max-w-screen-lg md:mx-auto flex flex-wrap items-center justify-between p-4">
                <p className={`${play.className} cursor-pointer`}>
                    <Link className="text-decoration-none nav-item transition transition-colors text-black dark:md:hover:text-primary-800 md:hover:text-primary-500 md:p-0 dark:text-white text-4xl" href="/">
                        CYGNET
                    </Link>
                    <span className="grad transition transition-colors hover:brightness-150 dark:brightness-150 dark:hover:brightness-100">
                        <Link href="https://www.sccs.swarthmore.edu/" className="text-decoration-none">
                            by SCCS
                        </Link>
                    </span>
                </p>
                <button
                    data-collapse-toggle="navbar-default"
                    type="button"
                    className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:focus:ring-gray-600"
                    {...getToggleProps()}>
                    <span className="sr-only">Open main menu</span>
                    <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15" />
                    </svg>
                </button>
                <div className="w-full hidden md:visible md:block md:w-auto">
                    <ul className="font-medium flex items-center p-4 p-0 flex-row space-x-8 rtl:space-x-reverse mt-0">
                        <li>
                            <Link href="/settings" className="block py-2 px-3 text-decoration-none text-lg text-black transition transition-colors dark:md:hover:text-primary-800 md:hover:text-primary-500 md:p-0 dark:text-white" aria-current="page">
                                <p className={pathName == "/settings" ? "text-selected" : ""}>
                                    Settings
                                </p>
                            </Link>
                        </li>
                        <li>
                            <p onClick={() => session?.user ? signOut() : signIn("keycloak")} className="block py-2 px-3 cursor-pointer transition transition-colors text-lg text-decoration-none text-black dark:md:hover:text-primary-800 md:hover:text-primary-500 md:p-0 dark:text-white">
                                {session?.user ? "Sign Out" : "Sign In"}
                            </p>
                        </li>
                        <li>
                            <Link href="https://www.instagram.com/swatsccs/" className="block py-2 px-3 text-decoration-none md:p-0">
                                <svg className="stroke-black dark:stroke-white dark:md:hover:stroke-primary-800 md:hover:stroke-primary-500 transition transition-colors" width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M19.8333 2.33301H8.16658C4.94492 2.33301 2.33325 4.94468 2.33325 8.16634V19.833C2.33325 23.0547 4.94492 25.6663 8.16658 25.6663H19.8333C23.0549 25.6663 25.6666 23.0547 25.6666 19.833V8.16634C25.6666 4.94468 23.0549 2.33301 19.8333 2.33301Z" stroke-width="2.33333" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M18.6667 13.2654C18.8106 14.2363 18.6448 15.2279 18.1927 16.0992C17.7406 16.9705 17.0253 17.677 16.1485 18.1183C15.2718 18.5596 14.2782 18.7132 13.3091 18.5573C12.34 18.4013 11.4447 17.9438 10.7506 17.2497C10.0566 16.5556 9.599 15.6604 9.44306 14.6913C9.28712 13.7222 9.44073 12.7286 9.88203 11.8518C10.3233 10.975 11.0299 10.2597 11.9011 9.80763C12.7724 9.35555 13.764 9.1897 14.735 9.33369C15.7254 9.48055 16.6423 9.94206 17.3503 10.65C18.0583 11.358 18.5198 12.2749 18.6667 13.2654Z" stroke-width="2.33333" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M20.4167 7.58301H20.4284" stroke-width="2.33333" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>

                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
            <section {...getCollapseProps()}>
                <div className="w-full md:hidden" id="navbar-default">
                    <ul className="font-medium flex flex-col items-center px-4 pb-4 md:p-0 rounded-lg">
                        <li className="grow w-full">
                            <Link href="/settings" className="flex flex-row justify-end py-2 px-3 text-decoration-none text-lg text-black transition transition-colors dark:text-white" aria-current="page">
                                <p className={pathName == "/settings" ? "text-selected" : ""}>
                                    Settings
                                </p>
                            </Link>
                        </li>
                        <li className="grow w-full">
                            <p onClick={() => session?.user ? signOut() : signIn("keycloak")} className="flex flex-row justify-end py-2 px-3 cursor-pointer transition transition-colors text-lg text-decoration-none text-black dark:text-white">
                                {session?.user ? "Sign Out" : "Sign In"}
                            </p>
                        </li>
                        <li className="grow w-full">
                            <Link href="https://www.instagram.com/swatsccs/" className="flex flex-row justify-end py-2 px-3 text-decoration-none md:p-0">
                                <svg className="stroke-black dark:stroke-white transition transition-colors" width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M19.8333 2.33301H8.16658C4.94492 2.33301 2.33325 4.94468 2.33325 8.16634V19.833C2.33325 23.0547 4.94492 25.6663 8.16658 25.6663H19.8333C23.0549 25.6663 25.6666 23.0547 25.6666 19.833V8.16634C25.6666 4.94468 23.0549 2.33301 19.8333 2.33301Z" stroke-width="2.33333" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M18.6667 13.2654C18.8106 14.2363 18.6448 15.2279 18.1927 16.0992C17.7406 16.9705 17.0253 17.677 16.1485 18.1183C15.2718 18.5596 14.2782 18.7132 13.3091 18.5573C12.34 18.4013 11.4447 17.9438 10.7506 17.2497C10.0566 16.5556 9.599 15.6604 9.44306 14.6913C9.28712 13.7222 9.44073 12.7286 9.88203 11.8518C10.3233 10.975 11.0299 10.2597 11.9011 9.80763C12.7724 9.35555 13.764 9.1897 14.735 9.33369C15.7254 9.48055 16.6423 9.94206 17.3503 10.65C18.0583 11.358 18.5198 12.2749 18.6667 13.2654Z" stroke-width="2.33333" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M20.4167 7.58301H20.4284" stroke-width="2.33333" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>

                            </Link>
                        </li>
                    </ul>
                </div>
            </section>
        </nav>
    );
}
