'use client'
import Image from 'next/image'
import { useEffect, useState } from 'react';

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
        return ( /* placeholder image */
            <>
                <div className="w-full relative flex justify-center">
                    <div role="status" className="animate-pulse">
                        <div className="flex items-center justify-center mt-4">
                            <svg className="h-28 w-28 md:h-32 md:w-32 lg:h-36 lg:w-36 text-gray-200 dark:text-gray-700 me-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
                            </svg>
                        </div>
                        <span className="sr-only">Loading...</span>
                    </div>

                </div>
            </>
        )
    }

    return (
        <>
            <div className="w-full relative flex justify-center">
                <div className="relative cyg-img-container h-28 w-28 md:h-32 md:w-32 lg:h-36 lg:w-36 overflow-clip rounded-circle gradBorder">
                    <Image
                        fill={true}
                        sizes="(max-width: 768px) 30vw, (max-width: 1200px) 20vw, 15vw"
                        loading={"lazy"}
                        src={props.button ? preview : photo_path}
                        alt="image of person"
                        className="cyg-img"
                    />
                    {props.button ? (
                        <div className="cyg-img-overlay">
                            <input type="file" id="picFile" name="picFile" onChange={onSelectFile} hidden />
                            <label htmlFor="picFile" className="cyg-img-svg" >
                                <svg xmlns="http://www.w3.org/2000/svg" width="75" height="60" viewBox="0 0 640 512" >
                                    {/*<!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->*/}
                                    <path fill="white" d="M144 480C64.5 480 0 415.5 0 336c0-62.8 40.2-116.2 96.2-135.9c-.1-2.7-.2-5.4-.2-8.1c0-88.4 71.6-160 160-160c59.3 0 111 32.2 138.7 80.2C409.9 102 428.3 96 448 96c53 0 96 43 96 96c0 12.2-2.3 23.8-6.4 34.6C596 238.4 640 290.1 640 352c0 70.7-57.3 128-128 128H144zm79-217c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l39-39V392c0 13.3 10.7 24 24 24s24-10.7 24-24V257.9l39 39c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-80-80c-9.4-9.4-24.6-9.4-33.9 0l-80 80z" />
                                </svg>
                            </label>
                        </div>
                    ) : (<></>)}
                </div>
            </div>
        </>
    )
}
