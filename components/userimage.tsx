'use client'
import Image from 'next/image'

export default function UserImage(props: any) {
    const { photo_path } = props;

    if (!photo_path) {
        return ( /* placeholder image */
            <>
                <div className="w-full position-relative d-flex justify-content-center">
                    <div className="position-relative cyg-img">
                        <div className="spinner-grow text-primary custom-spin" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                </div>
            </>
        )
    }

    return (
        <>
            <div className="w-full position-relative d-flex justify-content-center">
                <div className="position-relative cyg-img-container">
                    <Image
                        fill={true}
                        loading={"lazy"}
                        src={photo_path}
                        alt="image of person"
                        className="rounded-circle gradBorder cyg-img"
                    />
                </div>
            </div>
        </>
    )
}
