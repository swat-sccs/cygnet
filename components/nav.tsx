"use client";

import insta from "../public/imgs/insta.svg";
import Image from "next/image";

import { useRouter, usePathname } from "next/navigation";

export default function Nav() {
  const router = useRouter();
  const pathName = usePathname();

  return (
    <div className="bg-white navbar navbar-expand-lg shadow-sm mont w-full z-max">
      <div className="container">
        <p
          className="play h1 mt-2 cursor-pointer"
          onClick={() => router.push("/")}
        >
          CYGNET<span className="h4 grad"> by SCCS</span>
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
            <li className="nav-item my-auto ml-a pt-3 h5">
              <a
                href="https://www.sccs.swarthmore.edu/docs"
                target="_blank"
                className="text-decoration-none text-black"
              >
                <p>About</p>
              </a>
            </li>
            <li className="nav-item ms-auto my-auto pt-3 h5">
              <p
                onClick={() => router.push("/settings")}
                className={pathName == "/settings" ? "text-selected" : ""}
              >
                Settings
              </p>
            </li>
            <li className="nav-item ms-auto pt-3">
              <a href="https://www.instagram.com/swatsccs/" target="_blank">
                <Image src={insta} alt="insta" className="insta-size" />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
