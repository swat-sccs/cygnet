'use client'
import Image from 'next/image'
import { useEffect, useState } from 'react';

const avatarSize = "h-24 w-24 sm:h-28 sm:w-28";

function CameraIcon({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            aria-hidden="true"
        >
            <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
            <circle cx="12" cy="13" r="3" />
        </svg>
    );
}

function UploadIcon({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            aria-hidden="true"
        >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
    );
}

export default function UserImage(props: any) {
    const { photo_path } = props;
    const [selectedFile, setSelectedFile] = useState()
    const [preview, setPreview] = useState(photo_path)

    // create a preview as a side effect, whenever selected file is changed
    useEffect(() => {
        if (!selectedFile) {
            setPreview(photo_path)
            return
        }

        const objectUrl = URL.createObjectURL(selectedFile)
        setPreview(objectUrl)

        // free memory when ever this component is unmounted
        return () => URL.revokeObjectURL(objectUrl)
    }, [selectedFile])

    const onSelectFile = (e: any) => {
        if (!e.target.files || e.target.files.length === 0) {
            setSelectedFile(photo_path)
            return
        }

        // I've kept this example simple by using the first image instead of multiple
        setSelectedFile(e.target.files[0])
    }

    if (!photo_path) {
        return ( /* placeholder avatar */
            <div role="status" className={`${avatarSize} rounded-full bg-surface-2 animate-pulse`}>
                <span className="sr-only">Loading...</span>
            </div>
        )
    }

    return (
        <div className={`relative ${avatarSize}`}>
            <div className="relative h-full w-full rounded-full overflow-hidden ring-1 ring-line bg-surface-2">
                <Image
                    fill={true}
                    sizes="(max-width: 768px) 30vw, (max-width: 1200px) 20vw, 15vw"
                    loading={"lazy"}
                    src={props.button ? preview : photo_path}
                    alt="image of person"
                    className="object-cover"
                />
                {props.button ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-ink-900/50 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition">
                        <input type="file" id="picFile" name="picFile" onChange={onSelectFile} hidden />
                        <label
                            htmlFor="picFile"
                            tabIndex={0}
                            className="flex h-full w-full cursor-pointer items-center justify-center text-white focus:outline-none"
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault();
                                    document.getElementById("picFile")?.click();
                                }
                            }}
                        >
                            <UploadIcon className="h-6 w-6" />
                            <span className="sr-only">Change photo</span>
                        </label>
                    </div>
                ) : null}
            </div>
            {props.button ? (
                <span
                    aria-hidden="true"
                    className="pointer-events-none absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full bg-accent text-accent-fg ring-2 ring-surface"
                >
                    <CameraIcon className="h-3.5 w-3.5" />
                </span>
            ) : null}
        </div>
    )
}
