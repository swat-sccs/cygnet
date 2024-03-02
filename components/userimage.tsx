'use client'
import Image from 'next/image'
import { StudentInfo } from '@/app/page'

export default function UserImage(props: StudentInfo | any) {
    const { photo_path } = props;

    if (!photo_path) {
        return ( /* placeholder image */
            <>
                <div className="w-full relative d-flex justify-content-center">
                    <div className="spinner-grow text-primary custom-spin" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </>
        )
    }

    return (
        <>
            {/*IMAGE MUST BE SQUARE*/}
            <div className="w-full relative d-flex justify-content-center">
                <Image
                    width={300}
                    height={300}
                    loading={"lazy"}
                    src={photo_path}
                    alt="image of person"
                    className="rounded-circle gradBorder"
                />
            </div>
        </>
    )
}
