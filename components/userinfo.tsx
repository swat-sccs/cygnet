'use client'

import { StudentOverlay } from "@prisma/client"

const pillClass =
    "inline-flex items-center gap-1 rounded-full bg-surface-2 px-2.5 py-1 text-xs font-medium text-fg-2";

const iconProps = {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: "h-3.5 w-3.5 shrink-0 text-fg-3",
    "aria-hidden": true,
};

function CapIcon() {
    return (
        <svg {...iconProps}>
            <path d="M22 10L12 5 2 10l10 5 10-5z" />
            <path d="M6 12v5c0 1.5 3 3 6 3s6-1.5 6-3v-5" />
        </svg>
    );
}

function HomeIcon() {
    return (
        <svg {...iconProps}>
            <path d="M3 10.5 12 3l9 7.5" />
            <path d="M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5" />
        </svg>
    );
}

export default function UserInfo(props: StudentOverlay | any) {
    if (!props.uid) {
        return ( /* placeholder card */
            <div role="status" className="mt-4 flex w-full flex-col items-center gap-2">
                <div className="h-4 w-28 rounded bg-surface-2 animate-pulse"></div>
                <div className="h-3 w-16 rounded bg-surface-2 animate-pulse"></div>
                <div className="h-5 w-36 rounded bg-surface-2 animate-pulse"></div>
                <span className="sr-only">Loading...</span>
            </div>
        )
    }

    const room = `${props.dorm ?? ""} ${props.dormRoom ?? ""}`.trim();
    const roomHidden = room === "" || room === "Room Not Shown";

    return (
        <div className="w-full">
            <div className="mt-4 text-base sm:text-lg font-semibold tracking-tight text-fg leading-tight">
                {props.firstName} {props.lastName}
            </div>

            <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                {props.gradYear ? (
                    <span className={pillClass}>
                        <CapIcon />
                        Class of {props.gradYear}
                    </span>
                ) : null}
                <span className={roomHidden ? `${pillClass} !text-fg-3` : pillClass}>
                    <HomeIcon />
                    {roomHidden ? "Room not shown" : room}
                </span>
            </div>

            <div className="mt-3 text-xs text-fg-3 font-mono">{props.uid}</div>
        </div>
    )
}
