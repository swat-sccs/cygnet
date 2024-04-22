'use client'
import { StudentInfo } from "@/components/pagebody";

export default function UserInfo(props: StudentInfo | any) {

    if (!props.id) {
        return ( /* placeholder card */
            <div className="w-100 mont mt-2 text-center">
                <h4 className="placeholder-glow mb-0">
                    <span className="placeholder col-3"/>&nbsp;
                    <span className="placeholder col-3"/>
                </h4>
                <p className="placeholder-glow mb-0">
                    <span className="placeholder col-4"/>
                </p>
                <h6 className="placeholder-glow mt-3">
                    <span className="placeholder col-3"/>&nbsp;
                    <span className="placeholder col-2"/>&nbsp;
                    <span className="placeholder col-3"/>
                </h6>
                <h6 className="placeholder-glow mt-3">
                    <span className="placeholder col-5"/>
                </h6>

            </div>
        )
    }
    return (
        <div className="mont mt-2 text-center">
            <div className="h4 mb-0">{props.first} {props.last}</div>
            <p className="font-light mb-0">{props.pronouns}</p>
            <div className="h6 font-light mt-3">{props.dorm} {props.room} | {props.year}</div>
            <div className="h6 mt-3">{props.id}</div>
        </div>
    )
}
