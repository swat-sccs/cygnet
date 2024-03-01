'use client'
import Image from 'next/image'
import { StudentInfo } from '@/app/page'
import '@/public/placeholder-image-person-jpg.jpeg'

export default function UserImage(props: StudentInfo | any) {
    const { PHOTO } = props;

    if (!PHOTO) {
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
                    src={`data:image/jpeg;base64, ${PHOTO}`}
                    alt="image of person"
                    className="rounded-circle gradBorder"
                />
            </div>
        </>
    )
}
