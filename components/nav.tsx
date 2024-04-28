"use client";

import Image from "next/image";

import { useRouter, usePathname } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react"
import Link from "next/link";

export default function Nav() {
    const pathName = usePathname();

    const { data: session } = useSession();

    return (
        <div className="bg-white navbar navbar-expand-lg shadow-sm mont w-full z-max">
            <div className="container">
                <p className="play h1 mt-2 cursor-pointer">
                    <Link className="text-decoration-none nav-item text-black" href="/">
                        CYGNET
                    </Link>
                    <span className="h4 grad grad-hover">
                        <Link href="https://www.sccs.swarthmore.edu/" className="text-decoration-none text-black">
                            by SCCS
                        </Link>
                    </span>
                </p>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div
                    className="collapse navbar-collapse justify-content-end"
                    id="navbarSupportedContent"
                >
                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0 gap-md-4">
                        <li className="nav-item ms-auto my-auto pt-3 h5">
                            <Link
                                href="/settings"
                                className="text-decoration-none text-black"
                            >
                                <p className={pathName == "/settings" ? "text-selected" : ""}>
                                    Settings
                                </p>
                            </Link>
                        </li>
                        <li className="nav-item ms-auto my-auto pt-3 h5">
                            <p
                                onClick={() => session?.user ? signOut() : signIn("keycloak")}
                            >
                                {session?.user ? "Sign Out" : "Sign In"}
                            </p>
                        </li>
                        <li className="nav-item ms-auto pt-3">
                            <Link href="https://www.instagram.com/swatsccs/" target="_blank">
                                <Image src="/imgs/insta.svg" width={30} height={30} alt="insta" className="insta-size" />
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
