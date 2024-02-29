'use client'
import { StudentInfo } from "@/components/pagebody";

export default function UserInfo(props: StudentInfo | any) {
    const { LAST_NAME, FIRST_NAME, GRAD_YEAR, DORM, DORM_ROOM, USER_ID } = props;

    if (!USER_ID) {
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
            <div className="h4 mb-0">{FIRST_NAME} {LAST_NAME}</div>
            <p className="font-light mb-0">he/him</p> {/*get pronouns from where*/}
            <div className="h6 font-light mt-3">{DORM} {DORM_ROOM} | {GRAD_YEAR}</div>
            <div className="h6 mt-3">{USER_ID}</div>
        </div>
    )
}
